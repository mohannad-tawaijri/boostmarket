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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() updateData: any) {
    // Whitelist allowed fields to prevent mass assignment
    const allowed: Record<string, any> = {};
    const safeFields = ['name', 'bio', 'avatar'];
    for (const key of safeFields) {
      if (updateData[key] !== undefined) {
        allowed[key] = updateData[key];
      }
    }
    return this.usersService.update(req.user.id, allowed);
  }
}
