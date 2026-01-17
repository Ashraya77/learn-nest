import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/create-auth.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    const result = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    return this.authService.login(result.user);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const payload = this.authService.verifyToken(refreshToken);

    if (payload instanceof UnauthorizedException) {
      return payload;
    }

    const user = await this.authService.findUserById(payload.sub);
    if (user instanceof UnauthorizedException) {
      throw user;
    }

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return this.authService.login({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
