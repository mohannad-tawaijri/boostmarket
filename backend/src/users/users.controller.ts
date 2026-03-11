import { Controller, Get, Param, UseGuards, Request, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/public')
  findPublicProfile(@Param('id') id: string) {
    return this.usersService.findPublicProfile(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
