import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register.user.or.admin')
  register() {
    return {
      message: 'register user or admin',
    };
  }

  @MessagePattern('login.user.or.admin')
  login() {
    return {
      message: 'login user or admin',
    };
  }

  @MessagePattern('verify.user.or.admin')
  verify() {
    return {
      message: 'verify user or admin',
    };
  }
}
