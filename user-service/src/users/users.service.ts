// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    const { passwordHash, ...result } = savedUser;
    return result;
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.usersRepository.find();
    return users.map(({ passwordHash, ...result }) => result);
  }

  async findOne(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async findOneByEmailForAuth(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // We preload to get the full entity, including the passwordHash
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    const updatedUser = await this.usersRepository.save(user);
    // Sanitize the final result before returning
    const { passwordHash, ...result } = updatedUser;
    return result;
  }

  async remove(id: string): Promise<Omit<User, 'passwordHash'>> {
    // First, find the full entity to ensure it exists
    const userToRemove = await this.usersRepository.findOneBy({ id });
    if (!userToRemove) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Now, pass the full, valid entity to the remove method
    await this.usersRepository.remove(userToRemove);

    // Return the sanitized version of the object that was just removed
    const { passwordHash, ...result } = userToRemove;
    return result;
  }
}