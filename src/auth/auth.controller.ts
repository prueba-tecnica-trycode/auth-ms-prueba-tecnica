import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register.user.or.admin')
  register(@Payload() register: RegisterDto) {
    return this.authService.register(register);
  }

  @MessagePattern('login.user.or.admin')
  login(@Payload() logindto: LoginDto) {
    return this.authService.login(logindto);
  }

  @MessagePattern('get.user.or.admin')
  getUserOrAdmin() {
    return this.authService.getUserOrAdmin();
  }

  @MessagePattern('verify.user.or.admin')
  verify(@Payload() token: { token: string }) {
    return this.authService.verify(token.token);
  }
}
