import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDto } from './dto';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		const user = await this.authService.register(dto);
		if (!user) {
			throw new BadRequestException(`Can't register user with data: ${JSON.stringify(dto)}`);
		}
	}

	@Post('signIn')
	async signIn(@Body() dto: SignInDto) {
		const tokens = await this.authService.signIn(dto);
		if (!tokens) {
			throw new BadRequestException(`Can't sign in with user data: ${JSON.stringify(dto)}`);
		}
	}

	@Get('refresh')
	refreshTokens() {}
}
