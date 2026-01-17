import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/create-auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    //checking if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('invalid password');
    // }

    //removed password from user and we kept it in "result"
    const { password: _, ...result } = user;
    return {
      messege: 'User successfully Created',
      user: result,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    const { password: _, ...result } = user;
    return {
      message: 'Login Successfull',
      user: result,
    };
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('invalid token');
    }
  }

  findUserById(id: string){
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
