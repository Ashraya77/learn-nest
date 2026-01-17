import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/create-auth.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

    //removed password from user and we kept it in "result"
    const { password: _, ...result } = user;
    return {
      messege: 'User successfully Created',
      user: result,
    };
  }
}
