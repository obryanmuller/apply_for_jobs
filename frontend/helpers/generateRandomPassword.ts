export function generateRandomPassword(
  pass_length: number,
  use_alphabetic: boolean,
  use_numbers: boolean,
  use_punctuation: boolean
): string {
  const alphabeticChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';
  const punctuationChars = '!@#$%^&*()_+-={}[]|:;"<>,.?~`';

  let password = '';
  let availableChars = '';

  if (use_alphabetic) {
    availableChars += alphabeticChars;
  }
  if (use_numbers) {
    availableChars += numericChars;
  }
  if (use_punctuation) {
    availableChars += punctuationChars;
  }

  for (let i = 0; i < pass_length; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }

  return password;
}
