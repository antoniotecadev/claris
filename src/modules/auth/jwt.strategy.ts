import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
	constructor(configservice: ConfigService){
		const myJwtSecret = configservice.get<string>('JWT_SECRET');
		if (!myJwtSecret)
			throw new Error('JWT_SECRET environment variable is not defined');
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: myJwtSecret,
		})
	}

	async validate(payload: JwtPayload){
		return{
			id: payload.id,
			email: payload.email,
		};
	}
}