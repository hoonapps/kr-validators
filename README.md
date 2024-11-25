<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# kr_validators

Custom validation decorators for Korean-specific data such as **resident IDs, phone numbers, business numbers, and postal codes**.  
This library is designed to work seamlessly with NestJS and `class-validator` for a clean, reusable validation process.

---

## Features

- **Resident ID Validator**: Validate Korean resident identification numbers.
- **Phone Number Validator**: Validate Korean phone numbers.
- **Business Number Validator**: Validate Korean business registration numbers.
- **Email Validator**: Validate email addresses.
- **Postal Code Validator**: Validate Korean postal codes.
- Lightweight and optimized for **NestJS** applications.
- Fully compatible with **class-validator**.

---

## Installation

Install the package via NPM:

```bash
npm install kr-validators
```

---

## Usage

### NestJS Integration Example

#### 1. Import and apply the decorators in your DTO

```typescript
import {
  IsEmail,
  IsPhoneNumber,
  IsResidentIDNumber,
  IsBusinessNumber,
  IsPostalCode,
} from 'kr-validators';

export class CreateUserDto {
  @IsEmail({ message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @IsPhoneNumber({ message: '유효하지 않은 전화번호입니다.' })
  phone: string;

  @IsResidentIDNumber({ message: '유효하지 않은 주민등록번호입니다.' })
  residentId: string;

  @IsBusinessNumber({ message: '유효하지 않은 사업자등록번호입니다.' })
  businessNumber: string;

  @IsPostalCode({ message: '유효하지 않은 우편번호입니다.' })
  postalCode: string;
}
```

#### 2. Apply the DTO in your controller

Use the `CreateUserDto` in your NestJS controller to validate incoming request data automatically.

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // The validation is automatically triggered when the request data is bound to the DTO.
    return { message: 'User created successfully', data: createUserDto };
  }
}
```

In this example:

- **Automatic Validation**: The `CreateUserDto` class is automatically validated when the request body is bound to it.  
  NestJS's built-in `ValidationPipe` triggers the validation process without requiring manual checks.
- **Error Handling**: If the incoming data fails validation, a `400 Bad Request` response is returned automatically with detailed error messages.

- **Successful Requests**: If the data passes validation, the `createUser` method is executed, and the validated data is returned in the response.

---

### Example Scenarios

#### **Invalid Request Body**

```json
{
  "email": "not-an-email",
  "phone": "123",
  "residentId": "123456",
  "businessNumber": "12345",
  "postalCode": "123"
}
```

#### **Invalid Response**

If the incoming data fails validation, the API will return a **400 Bad Request** response with detailed error messages for each invalid field.

```json
{
  "statusCode": 400,
  "message": [
    "유효한 이메일 주소를 입력해주세요.",
    "유효하지 않은 전화번호입니다.",
    "유효하지 않은 주민등록번호입니다.",
    "유효하지 않은 사업자등록번호입니다.",
    "유효하지 않은 우편번호입니다."
  ],
  "error": "Bad Request"
}
```

Each error message corresponds to the field that failed validation, making it easy to identify and correct issues in the request payload.

---

#### **Valid Request Body**

```json
{
  "email": "example@example.com",
  "phone": "010-1234-5678",
  "residentId": "9201011234567",
  "businessNumber": "1234567890",
  "postalCode": "06236"
}
```

#### **Successful Response**

```json
{
  "message": "User created successfully",
  "data": {
    "email": "example@example.com",
    "phone": "010-1234-5678",
    "residentId": "9201011234567",
    "businessNumber": "1234567890",
    "postalCode": "06236"
  }
}
```

This shows how custom validators integrate seamlessly into a NestJS controller. By defining validations in DTOs, you ensure that incoming data is always consistent and secure before reaching your application logic.

---

## Validation Rules

1. **Resident ID Validator**:

   - Must be 13 digits.
   - Luhn algorithm-based checksum validation.

2. **Phone Number Validator**:

   - Formats: `010-1234-5678`, `01012345678`.

3. **Business Number Validator**:

   - 10-digit Korean business registration number.

4. **Email Validator**:

   - Standard email format validation.

5. **Postal Code Validator**:
   - Validates Korean postal codes (5-digit).

---

## API Reference

### 1. **`@IsEmail(validationOptions?: ValidationOptions)`**

Validates the email address.

### 2. **`@IsPhoneNumber(validationOptions?: ValidationOptions)`**

Validates the phone number in Korean formats.

### 3. **`@IsResidentIdNumber(validationOptions?: ValidationOptions)`**

Validates a Korean resident ID number.

### 4. **`@IsBusinessNumber(validationOptions?: ValidationOptions)`**

Validates a Korean business registration number.

### 5. **`@IsPostalCode(validationOptions?: ValidationOptions)`**

Validates a Korean postal code.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add my feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## Author

Created by **hoonapps**.  
Visit the [GitHub Repository](https://github.com/hoonapps) for more projects.

---

### Need help?

Feel free to reach out at **didgns10@gmali.com** or create an issue in the repository!
