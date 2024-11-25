import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBusinessNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(businessNumber: string): boolean {
    // 1. 10자리 체크
    if (!businessNumber || businessNumber.length !== 10) return false;

    // 2. 사업자번호 앞 9자리와 가중치를 곱해서 더한다.
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    const digits = businessNumber.split('').map(Number);
    const sum = weights.reduce(
      (acc, weight, index) => acc + weight * digits[index],
      0,
    );
    // 3. 8번째 숫자와 8번째 가중치를 곱한다음에 10을 나누고 위에 구한 합계랑 더한다.
    const checkSum = sum + Math.floor((weights[8] * digits[8]) / 10);

    // 4. 합계를 10으로 나눈 나머지를 10에서 빼준값을 10으로 나눠서 나머지를 구한다.
    const checkDigit = (10 - (checkSum % 10)) % 10;

    // 5. 사업자 번호 마지막 번호랑 위에서 구한 나머지랑 비교해서 일치하면 유효 성공
    return checkDigit === digits[9];
  }

  defaultMessage(): string {
    return 'Invalid business number';
  }
}

export function IsBusinessNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBusinessNumberConstraint,
    });
  };
}
