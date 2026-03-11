# Backend Conventions

## Module Structure

Every feature lives in its own folder with three files:

```
backend/src/<feature>/
├── <feature>.module.ts      # Module definition
├── <feature>.controller.ts  # HTTP route handlers
└── <feature>.service.ts     # Business logic
```

Optional: `dto/` subfolder for input validation classes.

## Module Definition

```typescript
@Module({
  imports: [PrismaModule],  // Add other modules as needed
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],  // Only if other modules need this service
})
export class FeatureModule {}
```

Register new modules in `app.module.ts` imports array.

## Controller Patterns

```typescript
@Controller('feature')
export class FeatureController {
  constructor(private featureService: FeatureService) {}

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.featureService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateFeatureDto) {
    return this.featureService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdateFeatureDto) {
    return this.featureService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string, @Request() req) {
    return this.featureService.remove(id, req.user.id);
  }
}
```

**Rules:**
- RESTful naming: plural nouns for resource paths
- `@UseGuards(JwtAuthGuard)` on all write operations and user-specific reads
- Access user via `@Request() req` → `req.user.id`, `req.user.email`
- Pagination via `@Query('skip')` and `@Query('take')`
- `@HttpCode(204)` for delete operations (no content)

## Service Patterns

```typescript
@Injectable()
export class FeatureService {
  constructor(private prisma: PrismaService) {}

  // Business logic + Prisma queries here
  // Throw NestJS exceptions for errors
}
```

**Error handling — use NestJS built-in exceptions:**
- `NotFoundException('Resource not found')` → 404
- `ForbiddenException('Not allowed')` → 403
- `UnauthorizedException('Invalid credentials')` → 401
- `ConflictException('Already exists')` → 409
- `BadRequestException('Invalid input')` → 400

## DTOs (Data Transfer Objects)

```typescript
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(SomeEnum)
  category: SomeEnum;
}
```

**Rules:**
- One DTO per operation (Create, Update)
- All fields validated with `class-validator` decorators
- Optional fields use `@IsOptional()` + TypeScript `?`
- The global `ValidationPipe` enforces: `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`

## Prisma Usage

```typescript
// Create with relations
await this.prisma.model.create({
  data: { ...dto, userId },
  include: { user: { select: { id: true, name: true, avatar: true } } },
});

// Find with filters, pagination, and relations
await this.prisma.model.findMany({
  where: { active: true, ...(filter && { field: filter }) },
  skip,
  take: take || 20,
  orderBy: { createdAt: 'desc' },
  include: { relation: true, _count: { select: { reviews: true } } },
});

// Update with ownership check
const item = await this.prisma.model.findUnique({ where: { id } });
if (!item) throw new NotFoundException();
if (item.userId !== userId) throw new ForbiddenException();
await this.prisma.model.update({ where: { id }, data: dto });
```

**Conventions:**
- CUID primary keys: `@id @default(cuid())`
- Timestamps: `createdAt DateTime @default(now())`
- Use `include` sparingly — only load needed relations
- Use `select` to limit fields on nested relations (don't leak passwords)
- Always check ownership before update/delete operations

## TypeScript Strictness

The existing backend tsconfig has `strictNullChecks: false` and `noImplicitAny: false`. When writing **new** code, apply stricter standards regardless:

- **No `any`** — use proper types, generics, or `unknown` with type narrowing
- **Handle nullability** — check for `null`/`undefined` before accessing properties, even though the compiler won't catch it
- **Type service method returns** — use explicit return types on service methods (`Promise<User>`, not implicit)
- **Type controller parameters** — always use DTOs for `@Body()`, never raw `any` or untyped objects

This ensures new code is future-proof if strict mode is later enabled project-wide.

## Security

- Rate limiting is global: 60 requests per 60 seconds (ThrottlerGuard)
- Helmet middleware for security headers
- CORS whitelist — only allowed origins
- JWT access tokens expire in 15 minutes
- Refresh token rotation with database storage
- Passwords hashed with bcrypt (never return password fields)
- `forbidNonWhitelisted: true` strips unknown fields from request body
