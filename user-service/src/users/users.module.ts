// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Đăng ký User entity
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService để các module khác có thể sử dụng
})
export class UsersModule {}