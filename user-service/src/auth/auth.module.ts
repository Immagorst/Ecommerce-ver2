// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy/jwt.strategy'; // Import JwtStrategy nếu bạn sử dụng JWT cho xác thực
import { LocalStrategy } from './local.strategy/local.strategy'; // Import LocalStrategy nếu bạn sử dụng xác thực local
import { AuthController } from './auth.controller';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // RẤT QUAN TRỌNG: Thay bằng một chuỗi bí mật phức tạp và lưu trong env var
      signOptions: { expiresIn: '60m' }, // Token hết hạn sau 60 phút
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController], // Export AuthService để các module khác có thể dùng
})
export class AuthModule {}