import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'


import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.usersService.showById(+id);
  }

  @Post(':id/change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Param('id') id: number, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  //for fun
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    // users.forEach(user => {
    //   delete user.password;
    // });
    return users;
  }
}