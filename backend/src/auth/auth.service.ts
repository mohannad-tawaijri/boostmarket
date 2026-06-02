import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto } from './dto';

export interface AuthResult {
  user: { id: string; email: string; name: string; isAdmin: boolean };
  token: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  // Short-lived, single-use codes used to hand OAuth results to the frontend
  // without ever putting tokens in a redirect URL. Held in memory; entries
  // live only ~2 minutes and are consumed within seconds of issuance.
  private readonly oauthExchangeCodes = new Map<
    string,
    { data: AuthResult; expiresAt: number }
  >();
  private readonly OAUTH_CODE_TTL_MS = 2 * 60 * 1000;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  /** Store an OAuth result and return a one-time code referencing it. */
  createOAuthExchangeCode(data: AuthResult): string {
    const code = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    this.oauthExchangeCodes.set(code, {
      data,
      expiresAt: now + this.OAUTH_CODE_TTL_MS,
    });
    // Opportunistic cleanup of expired entries.
    for (const [key, value] of this.oauthExchangeCodes) {
      if (value.expiresAt < now) this.oauthExchangeCodes.delete(key);
    }
    return code;
  }

  /** Consume a one-time OAuth code, returning the result exactly once. */
  consumeOAuthExchangeCode(code: string): AuthResult | null {
    if (!code) return null;
    const entry = this.oauthExchangeCodes.get(code);
    if (!entry) return null;
    this.oauthExchangeCodes.delete(code); // single use
    if (entry.expiresAt < Date.now()) return null;
    return entry.data;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.role === 'ADMIN',
      },
      token: accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Google-only account (no password set)
    if (!user.password) {
      throw new UnauthorizedException(
        'هذا الحساب مسجّل عبر Google. سجّل الدخول باستخدام زر Google.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.role === 'ADMIN',
      },
      token: accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Find the refresh token in the database
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Reuse detection: a *revoked* token presented again means it was already
    // rotated out (or stolen and replayed). Treat it as a compromise and revoke
    // the whole token family so an attacker holding an old token is locked out.
    if (storedToken.revoked) {
      await this.revokeAllUserTokens(storedToken.userId);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke the old refresh token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const user = storedToken.user;

    // Generate new tokens
    const newAccessToken = this.generateAccessToken(user.id, user.email);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.role === 'ADMIN',
      },
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      // Revoke the refresh token
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }
  }

  async revokeAllUserTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Unable to change password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Google user without a password — let them set one (no current password needed)
    if (!user.password) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      await this.revokeAllUserTokens(userId);
      return { message: 'تم تعيين كلمة المرور بنجاح' };
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new UnauthorizedException('كلمة المرور الحالية غير صحيحة');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens for security
    await this.revokeAllUserTokens(userId);

    return { message: 'تم تغيير كلمة المرور بنجاح' };
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }

  /**
   * Request a password reset. Always returns the same response (200) to avoid
   * leaking which emails are registered. If the email matches a local-auth
   * account, a reset token is generated and emailed via SMTP.
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const genericResponse = {
      message:
        'إذا كان البريد الإلكتروني مسجلاً لدينا، فسنرسل رابط إعادة التعيين خلال لحظات.',
    };

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      // Don't reveal whether the account exists or is Google-only.
      return genericResponse;
    }

    // Invalidate any outstanding unused tokens for this user.
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://boostmarket.app';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password/${rawToken}`;

    await this.mailService.sendPasswordResetEmail(user.email, user.name, resetUrl);

    return genericResponse;
  }

  /**
   * Complete the password reset using a valid token.
   */
  async resetPassword(
    rawToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException(
        'الرابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      // Revoke any active refresh tokens for security.
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revoked: false },
        data: { revoked: true },
      }),
    ]);

    return { message: 'تم إعادة تعيين كلمة المرور بنجاح.' };
  }

  /**
   * Google OAuth sign-in/sign-up.
   * If a user exists with the googleId, return them.
   * If a user exists with the same email (local account), link googleId to it.
   * Otherwise create a new user (no password, authProvider='google').
   */
  async validateOrCreateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
  }) {
    // 1. Check by googleId
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    // 2. Fallback: check by email (link existing local account)
    if (!user) {
      const byEmail = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (byEmail) {
        user = await this.prisma.user.update({
          where: { id: byEmail.id },
          data: {
            googleId: googleUser.googleId,
            authProvider: byEmail.authProvider || 'local',
            avatar: byEmail.avatar || googleUser.avatar,
            verified: true,
          },
        });
      }
    }

    // 3. Create new user
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.googleId,
          authProvider: 'google',
          avatar: googleUser.avatar,
          verified: true,
        },
      });
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.role === 'ADMIN',
      },
      token: accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '30'); // days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn, 10));

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    // Clean up expired tokens for this user
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true, createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        ],
      },
    });

    return token;
  }
}
