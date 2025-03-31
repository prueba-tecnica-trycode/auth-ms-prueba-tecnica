import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { RpcException } from '@nestjs/microservices';
import { UserRole } from './enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compareSync, hashSync } from 'bcryptjs';
import { envs } from 'src/configs/dotenv.configs';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const validateUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    });

    if (validateUser) {
      throw new RpcException({
        statusCode: 400,
        message: 'User already exists',
      });
    }

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashSync(registerDto.password, 10),
      role: registerDto.role as UserRole,
    });

    await this.userRepository.save(user);

    const Payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: user,
      token: this.jwtService.sign(Payload),
    };
  }

  async login(logindto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: logindto.email,
      },
    });

    if (!user) {
      throw new RpcException({
        statusCode: 400,
        message: 'User not found',
      });
    }

    if (!compareSync(logindto.password, user.password)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Password is incorrect',
      });
    }

    const Payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: user,
      token: this.jwtService.sign(Payload),
    };
  }

  async getUserOrAdmin() {
    const users = await this.userRepository.find();

    return users;
  }

  async verify(token: string) {
    try {
      const user: JwtPayload = await this.jwtService.verify(token, {
        secret: envs.SECRET_JWT,
      });

      if (!user) {
        throw new RpcException({
          statusCode: 402,
          message: 'Unauthorized',
        });
      }

      const validateUser = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
      });

      if (!validateUser) {
        throw new RpcException({
          statusCode: 402,
          message: 'Unauthorized',
        });
      }

      return {
        user: user,
        message: 'Access granted',
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new RpcException({
        statusCode: 402,
        message: 'Unauthorized',
      });
    }
  }
}
