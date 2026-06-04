import { IsEmail, IsNotEmpty, isString, IsString, Length } from "class-validator";

export class VerifyEmailCodeDto {
	@IsEmail()
	@IsNotEmpty()
	email: string | undefined;

	@IsString()
	@IsNotEmpty()
	@Length(6, 6)
	code: string | undefined;
}