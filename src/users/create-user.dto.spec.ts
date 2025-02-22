import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.name = 'Piotr';
    dto.password = '123456A#';
  });

  it('2+2=4', () => {
    expect(2).toBe(2); // Assertion
  });

  it('should validate complete valid data', async () => {
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    //Arrange
    dto.email = 'test';

    //Act
    const errors = await validate(dto);

    //Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  // 1) At leat 1 uppercase letter
  // 2) At least 1 number
  // 3) At least 1 special character

  it('should return specific validation messages', async () => {
    //Arrange
    dto.password = 'abcdfa';
    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).not.toBeUndefined();

    const messages = Object.values(passwordError?.constraints ?? {});
    expect(messages).toContain(
      'Password must contain at least 1 uppercase letter',
    );
  });
});
