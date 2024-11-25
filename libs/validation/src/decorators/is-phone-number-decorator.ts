import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    // 핸드폰번호 정규식 => 01[016789]중에 1자리 - [0-9]로 3~4자리 - [0-9]로 4자리
    const phoneRegex = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    return phoneRegex.test(value);
  }

  defaultMessage(): string {
    return 'Invalid phone number format';
  }
}

export function IsPhoneNumber(
  withHyphen: boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [withHyphen],
      validator: IsPhoneNumberConstraint,
    });
  };
}
