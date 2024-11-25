import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsResidentIdNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string): boolean {
    // 1. 13자리 체크
    if (!value || value.length !== 13) return false;

    // 2. 주민번호 앞 12자리와 가중치를 곱해서 더한다.
    const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    const digits = value.split('').map(Number);
    const checkSum = weights.reduce(
      (sum, weight, index) => sum + weight * digits[index],
      0,
    );
    // 3. 합계를 11로 나눈 나머지를 11에서 빼준값을 10으로 나눠서 나머지를 구한다.
    const checkDigit = (11 - (checkSum % 11)) % 10;

    // 4. 주민번호 마지막 번호랑 위에서 구한 나머지랑 비교해서 일치하면 유효 성공
    return checkDigit === digits[12];
  }

  defaultMessage(): string {
    return 'Invalid Resident ID number';
  }
}

export function IsResidentIDNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsResidentIdNumberConstraint,
    });
  };
}
