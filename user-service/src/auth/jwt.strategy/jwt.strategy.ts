// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // PHẢI GIỐNG với secret trong AuthModule
    });
  }

  async validate(payload: any) {
    // payload là đối tượng đã được giải mã từ JWT
    // NestJS sẽ tự động gắn đối tượng trả về vào request.user
    return { userId: payload.sub, email: payload.email };
  }
}