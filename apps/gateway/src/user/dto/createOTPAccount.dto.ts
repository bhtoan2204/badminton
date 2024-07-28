import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  registerDecorator,
  Validate,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

function IsEmailOrPhone(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEmailOrPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const email = obj.email;
          const phone = obj.phone;
          return (email && !phone) || (!email && phone);
        },
        defaultMessage() {
          return 'Provide either email or phone, but not both.';
        },
      },
    });
  };
}

export class CreateAccountOTPDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @Validate(IsEmailOrPhone)
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  @IsOptional()
  @Validate(IsEmailOrPhone)
  phone: string;
}
