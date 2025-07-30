// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // Phải tìm lại user với passwordHash để so sánh
    const user = await this.usersService.findOneByEmailForAuth(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const kong_jwt_key = 'cmxCNJWmkGH9LFBn0s8GLxZf3LE8b2It';
    const kong_jwt_secret = 'fuLrEMTiHA44l3KAA3xvEs9HIVkKOn3D'
    const payload = {iss: kong_jwt_key};
    return {
      access_token: this.jwtService.sign(payload, {secret: kong_jwt_secret}),
    };
  }
}