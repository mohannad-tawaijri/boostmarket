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
import { CreateServiceDto, UpdateServiceDto } from './dto';

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
    const parsedSkip = skip ? Math.max(0, parseInt(skip)) : undefined;
    const parsedTake = take ? Math.min(100, Math.max(1, parseInt(take))) : undefined;
    return this.servicesService.findAll({
      game,
      category,
      featured: featured === 'true',
      sortBy,
      skip: parsedSkip,
      take: parsedTake,
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMy(@Request() req) {
    return this.servicesService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createData: CreateServiceDto) {
    return this.servicesService.create(req.user.id, createData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Request() req, @Body() updateData: UpdateServiceDto) {
    return this.servicesService.update(id, req.user.id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Request() req) {
    return this.servicesService.delete(id, req.user.id);
  }
}
