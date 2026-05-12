import { isEmail, IsEmail, IsNotEmpty, isNotEmpty, IsString, MinLength, minLength  } from "class-validator";

export class LoginDto{
	@IsEmail({}, { message: 'Email inválido' })
	@IsNotEmpty({ message: 'O email é obrigatório' })
	email: string | undefined

	@IsString()
	@IsNotEmpty({ message: 'A senha é obrigatória' })
	@MinLength(6, { message: '' })
	password: string | undefined
}