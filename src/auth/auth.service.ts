import { UserService } from './../user/user.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto';
import { SignInDto } from './dto/signIn.dto';
import { Tokens } from './interfaces';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly prismaService: PrismaService,
	) {}
	async register(dto: RegisterDto) {
		return this.userService.save(dto).catch((err) => {
			this.logger.error(err);
			return null;
		});
	}
	async signIn(dto: SignInDto): Promise<Tokens> {
		const user: User = await this.userService.findOne(dto.email).catch((err) => {
			this.logger.error(err);
			return null;
		});
		if (!user || !this.userService.compareSync(dto.password, user.password)) {
			throw new UnauthorizedException('Invalid login or password');
		}
		const accessToken = this.jwtService.sign({
			id: user.id,
			email: user.email,
			roles: user.roles,
		});
		const refreshToken = await this.getRefreshToken(user.id);
		return { accessToken, refreshToken };
	}

	private async getRefreshToken(userId: string): Promise<Token> {
		return this.prismaService.token.create({
			data: {
				token: v4(),
				exp: add(new Date(), { months: 1 }),
				userId,
			},
		});
	}
}
