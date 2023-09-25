import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

const getJwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
	secret: config.get('JWT_SECRET'),
	signOptions: { expiresIn: config.get('JWT_EXPIRE', '5m') },
});

export const options = (): JwtModuleAsyncOptions => ({
	inject: [ConfigService],
	useFactory: getJwtModuleOptions,
});
