import { IsString, IsEmail, IsNotEmpty, IsOptional, IsDateString, IsUrl, MaxLength, MinLength, isString } from "class-validator";
import { PatchUndefined } from "generated/prisma/internal/prismaNamespace";

export class RegisterDto{
	@IsEmail({}, { message: 'Email inválido' })
	@IsNotEmpty({ message: 'O Email é obrigatório' })
	email: string | undefined

	@IsString()
	@IsNotEmpty({ message: 'A senha é obrigatória' })
	@MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
	password: string | undefined

	@IsString()
	@IsNotEmpty({ message: 'O nome é obrigatório' })
	@MinLength(2)
	@MaxLength(80)
	displayName: string | undefined

	@IsOptional()
	@IsString()
	@MaxLength(9)
	gender? : string

	@IsOptional()
	@IsDateString()
	BirthDate: string | undefined

	@IsOptional()
	@IsString()
	@IsUrl({}, { message: 'Este campo deve ser uma URL válida' })
	avatarUrl? : string
}