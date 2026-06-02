import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Request,
  Response,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Tight limit to slow credential brute-forcing / stuffing.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  // Limit to curb password-reset email spam / enumeration probing.
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  // ---------------- Google OAuth ----------------

  /**
   * Kick off Google OAuth flow. The frontend redirects the user here
   * (e.g. window.location.href = `${API_URL}/auth/google`).
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirects to Google. Method body is intentionally empty.
  }

  /**
   * Google OAuth callback. Passport attaches the verified profile to req.user.
   * We issue our own JWT + refresh token, but instead of putting them in the
   * redirect URL (where they leak into history, logs and Referer headers) we
   * hand back a short-lived one-time code that the frontend exchanges for the
   * tokens via POST.
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Request() req, @Response() res) {
    const result = await this.authService.validateOrCreateGoogleUser(req.user);
    const code = this.authService.createOAuthExchangeCode(result);

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:3000';

    return res.redirect(`${frontendUrl}/auth/google/callback?code=${code}`);
  }

  /**
   * Exchange a one-time OAuth code for the issued tokens. The code is single-use
   * and expires after a couple of minutes.
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('google/exchange')
  @HttpCode(HttpStatus.OK)
  googleExchange(@Body('code') code: string) {
    const result = this.authService.consumeOAuthExchangeCode(code);
    if (!result) {
      throw new UnauthorizedException('Invalid or expired code');
    }
    return result;
  }
}
