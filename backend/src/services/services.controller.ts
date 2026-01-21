import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  findAll(
    @Query('game') game?: string,
    @Query('category') category?: string,
    @Query('featured') featured?: string,
    @Query('sortBy') sortBy?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.servicesService.findAll({
      game,
      category,
      featured: featured === 'true',
      sortBy,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createData: any) {
    return this.servicesService.create(req.user.id, createData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Request() req, @Body() updateData: any) {
    return this.servicesService.update(id, req.user.id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req) {
    return this.servicesService.delete(id, req.user.id);
  }
}
