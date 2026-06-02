import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    // Listing every user (incl. their emails) is an admin-only operation.
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Admins only');
    }
    return this.usersService.findAll();
  }

  @Get(':id/public')
  findPublicProfile(@Param('id') id: string) {
    return this.usersService.findPublicProfile(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    // Full profile (email, notification/privacy settings, etc.) is only for the
    // owner or an admin. Everyone else gets the privacy-aware public profile so
    // we don't leak PII like email addresses.
    if (req.user.id === id || req.user.role === 'ADMIN') {
      return this.usersService.findOne(id);
    }
    return this.usersService.findPublicProfile(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() updateData: any) {
    // Whitelist allowed fields to prevent mass assignment
    const allowed: Record<string, any> = {};
    const safeFields = ['name', 'bio', 'avatar', 'notifyEmail', 'notifyOrders', 'notifyMessages', 'notifyMarketing', 'showProfile', 'showOnlineStatus', 'showReadReceipts'];
    for (const key of safeFields) {
      if (updateData[key] !== undefined) {
        allowed[key] = updateData[key];
      }
    }
    // Enforce string length limits
    if (typeof allowed.bio === 'string') {
      allowed.bio = allowed.bio.slice(0, 500);
    }
    if (typeof allowed.name === 'string') {
      allowed.name = allowed.name.slice(0, 50);
    }
    return this.usersService.update(req.user.id, allowed);
  }
}
