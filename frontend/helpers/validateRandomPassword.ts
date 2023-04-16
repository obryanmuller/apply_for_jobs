export type ValidationResponse = {
  letters: boolean;
  digits: boolean;
  punctuation: boolean;
  length: boolean;
}

export type ValidationPayload = {
  useLetters?: boolean;
  useDigits?: boolean;
  usePunctuation?: boolean;
  passLength: number;
  sendedPassword: string;
}

export function validatePassword(
  { useLetters, useDigits, usePunctuation, passLength, sendedPassword }: ValidationPayload): ValidationResponse {
  const validation = {
    letters: true,
    digits: true,
    punctuation: true,
    length: true,
  }

  if (useLetters && !/[a-zA-Z]/.test(sendedPassword)) {
    validation.letters = false
  }

  if (useDigits && !/\d/.test(sendedPassword)) {
    validation.digits = false
  }

  if (usePunctuation && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(sendedPassword)) {
    validation.length = false
  }

  if (sendedPassword.length < passLength) {
    validation.length = false
  }
  return validation;
}