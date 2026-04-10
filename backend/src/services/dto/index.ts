import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

enum ServiceCategory {
  RANK_BOOST = 'RANK_BOOST',
  COACHING = 'COACHING',
  ACCOUNT_LEVELING = 'ACCOUNT_LEVELING',
  WIN_BOOST = 'WIN_BOOST',
  PLACEMENT_MATCHES = 'PLACEMENT_MATCHES',
  DUOQ = 'DUOQ',
  ITEMS = 'ITEMS',
  CUSTOM = 'CUSTOM',
  OTHER = 'OTHER',
}

enum GameCategory {
  LEAGUE_OF_LEGENDS = 'LEAGUE_OF_LEGENDS',
  VALORANT = 'VALORANT',
  CS2 = 'CS2',
  DOTA2 = 'DOTA2',
  OVERWATCH = 'OVERWATCH',
  APEX_LEGENDS = 'APEX_LEGENDS',
  FORTNITE = 'FORTNITE',
  ROCKET_LEAGUE = 'ROCKET_LEAGUE',
  RAINBOW_SIX = 'RAINBOW_SIX',
  COD_WARZONE = 'COD_WARZONE',
  PUBG = 'PUBG',
  OTHER = 'OTHER',
}

export class CreateServiceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description: string;

  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @IsEnum(GameCategory)
  game: GameCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  gameDetails?: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsString()
  @MaxLength(100)
  deliveryTime: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  requirements?: any;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  allowDirectPurchase?: boolean;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @IsOptional()
  @IsEnum(GameCategory)
  game?: GameCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  gameDetails?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deliveryTime?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  requirements?: any;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  allowDirectPurchase?: boolean;
}
