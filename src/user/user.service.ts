import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { pbkdf2Sync } from 'node:crypto';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	public save = (user: Partial<User>) => {
		const hashedPassword = this.hashPassword(user.password);
		return this.prismaService.user.create({
			data: {
				email: user.email,
				password: hashedPassword,
				roles: ['USER'],
			},
		});
	};
	public findOne = (idOrEmail: string) => {
		return this.prismaService.user.findFirst({
			where: {
				OR: [{ id: idOrEmail }, { email: idOrEmail }],
			},
		});
	};
	public delete = (id: string) => {
		return this.prismaService.user.delete({
			where: { id },
		});
	};
	public compareSync = (currentPasswrod: string, password: string): boolean =>
		this.hashPassword(currentPasswrod) === this.hashPassword(password);

	private hashPassword = (password: string): string => {
		return pbkdf2Sync(password, 'saltExample', 10000, 64, 'sha256').toString('hex');
	};
}
