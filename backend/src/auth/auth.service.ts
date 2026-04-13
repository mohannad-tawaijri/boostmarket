import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

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
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
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
    // Find the refresh token in the database
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        // Revoke the token if it was found but expired
        await this.prisma.refreshToken.update({
          where: { id: storedToken.id },
          data: { revoked: true },
        });
      }
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
    if (!user || !user.password) {
      throw new UnauthorizedException('Unable to change password');
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new UnauthorizedException('كلمة المرور الحالية غير صحيحة');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
