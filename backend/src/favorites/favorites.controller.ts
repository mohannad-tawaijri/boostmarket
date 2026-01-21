import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.user.id);
  }

  @Get(':serviceId/check')
  checkFavorite(@Request() req, @Param('serviceId') serviceId: string) {
    return this.favoritesService.isFavorite(req.user.id, serviceId);
  }

  @Post(':serviceId')
  addFavorite(@Request() req, @Param('serviceId') serviceId: string) {
    return this.favoritesService.addFavorite(req.user.id, serviceId);
  }

  @Delete(':serviceId')
  removeFavorite(@Request() req, @Param('serviceId') serviceId: string) {
    return this.favoritesService.removeFavorite(req.user.id, serviceId);
  }
}
