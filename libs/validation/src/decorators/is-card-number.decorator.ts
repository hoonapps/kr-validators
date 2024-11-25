import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCardNumberConstraint implements ValidatorConstraintInterface {
  validate(cardNumber: string): boolean {
    // 1. 16자리 체크
    const cardRegex = /^\d{16}$/;
    if (!cardRegex.test(cardNumber)) return false;

    // 2. Luhn 알고리즘 검사
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9; // 두 자리 숫자는 각 자리의 합을 더함
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    // 3. 구한 값을 10으로 나눴을때 나머지가 0이면 유효 성공
    return sum % 10 === 0;
  }

  defaultMessage(): string {
    return 'Invalid credit card number';
  }
}

export function IsCardNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCardNumberConstraint,
    });
  };
}
