export type CreatePwdRequest = {
  sended_password?: string;

  use_letters: boolean;
  use_digits: boolean;
  use_punctuation: boolean;
  pass_length: number;

  pass_view_limit: number;
  expiration_in_seconds: number;
};

export type CreatePwdResponse = {
  pwdId: string;
};

export type GetPwdResponse = {
  pwd: string;
  expiration_date: number; // epoch seconds
  view_count: number; // já consumidas
  // opcional, se você quiser retornar isso no backend depois:
  pass_view_limit?: number;
};