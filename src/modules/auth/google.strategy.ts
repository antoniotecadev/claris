import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
	constructor(configService: ConfigService){
		super({
			clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
			clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
			callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
			scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile)
	{
		const user = {
			googleId: profile.id,
			email: profile.emails?.at(0)?.value,
			displayName: `${profile.name?.givenName} ${profile.name?.familyName}`,
			avatarUrl: profile.photos?.at(0)?.value,
			provider: 'google',
			accessToken,
		};
		return user;
	}
}