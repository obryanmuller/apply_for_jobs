export function generateRandomPassword(
  { passLength, useLetters, useDigits, usePunctuation }: { passLength: number; useLetters: boolean; useDigits: boolean; usePunctuation: boolean; }): string {
  const alphabeticChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';
  const punctuationChars = '!@#$%^&*()_+-={}[]|:;"<>,.?~`';

  let password = '';
  let availableChars = '';

  if (useLetters) {
    availableChars += alphabeticChars;
  }
  if (useDigits) {
    availableChars += numericChars;
  }
  if (usePunctuation) {
    availableChars += punctuationChars;
  }

  for (let i = 0; i < passLength; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    password += availableChars[randomIndex];
  }

  return password;
}
