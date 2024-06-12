import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  IsEnum,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNotEmptyPropertyConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value !== '' || relatedValue !== '';
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} should not be empty if the other is empty.`;
  }
}

enum Gender {
  Male = 'male',
  Female = 'female',
  GenderNotSpecified = 'not_specified',
}

export function IsNotEmptyProperty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsNotEmptyPropertyConstraint,
    });
  };
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsNotEmptyProperty('lastname', {
    message: 'Either firstname or lastname must be provided.',
  })
  @ApiProperty({ description: 'First name', required: false })
  firstname: string;

  @IsString()
  @IsOptional()
  @IsNotEmptyProperty('firstname', {
    message: 'Either firstname or lastname must be provided.',
  })
  @ApiProperty({ description: 'Last name', required: false })
  lastname: string;

  @ApiProperty({ example: 'male', description: 'male, female, not_specified' })
  @IsOptional()
  @IsString()
  @IsEnum(Gender, {
    message: 'Invalid gender value (male, female, not_specified)',
  })
  genre: string;

  @ApiProperty({ example: '2002-06-20' })
  @IsOptional()
  @IsString()
  birthdate: string;
}
