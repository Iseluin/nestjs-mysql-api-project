import { Injectable, BadRequestException } from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {  // needed to downgrade nest to make this dto work.
    const user = User.create(createUserDto);
    await user.save();
    delete user.password;
    return user;
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);

    delete user.password;
    return user;
  }

  async findById(id: number) {
    return await User.findOne(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await User.find();
    return users;
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<User> {
    const user = await this.findById(id);
  
    // Verify old password
    if (!(await user.validatePassword(changePasswordDto.oldPassword))) {
      throw new BadRequestException('Invalid old password');
    }
  
    // Update password
    user.password = changePasswordDto.newPassword;
    
    try {
      await user.save();
    } catch (error) {
      throw new BadRequestException('Error updating password');
    }

    // Remove password from returned user object
    delete user.password;
    return user;
  }
  
}