import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class OnlyOneFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [prop1, prop2, prop3] = args.constraints;
    const object = args.object as any;
    const count = [object[prop1], object[prop2], object[prop3]].filter(
      (val) => val !== null && val !== undefined,
    ).length;
    return count === 1;
  }

  defaultMessage(args: ValidationArguments) {
    const [prop1, prop2, prop3] = args.constraints;
    return `Only one of ${prop1}, ${prop2}, ${prop3} should be provided.`;
  }
}

export function OnlyOneField(
  property1: string,
  property2: string,
  property3: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property1, property2, property3],
      validator: OnlyOneFieldConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
class FamilyIdRequirementConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    if (
      (object['id_extra_package'] !== null &&
        object['id_extra_package'] !== undefined) ||
      (object['id_combo_package'] !== null &&
        object['id_combo_package'] !== undefined)
    ) {
      return value !== null && value !== undefined;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return `id_family is required when id_extra_package or id_combo_package is provided.`;
  }
}

export function FamilyIdRequired(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: FamilyIdRequirementConstraint,
    });
  };
}

export class PlaceOrderDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Validate(OnlyOneField, [
    'id_main_package',
    'id_extra_package',
    'id_combo_package',
  ])
  id_main_package: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Validate(OnlyOneField, [
    'id_main_package',
    'id_extra_package',
    'id_combo_package',
  ])
  id_extra_package: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Validate(OnlyOneField, [
    'id_main_package',
    'id_extra_package',
    'id_combo_package',
  ])
  id_combo_package: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Validate(FamilyIdRequired)
  id_family: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bankCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;
}
