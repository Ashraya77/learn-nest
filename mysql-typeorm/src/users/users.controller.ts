import { Body, Controller, Get, Post } from '@nestjs/common';
import { createUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.findUsers();
    return users;
  }

  @Post()
  createUser(@Body() createUser: createUserDto) {
    this.usersService.createUser(createUser);
  }
}
