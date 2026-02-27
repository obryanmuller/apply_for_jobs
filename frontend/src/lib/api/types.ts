export type CreatePwdRequestBase = {
  pass_view_limit: number;
  expiration_in_seconds: number;
};

export type CreatePwdRequestWithPassword = CreatePwdRequestBase & {
  sended_password: string;
};

export type CreatePwdRequestWithPolicy = CreatePwdRequestBase & {
  use_letters: boolean;
  use_digits: boolean;
  use_punctuation: boolean;
  pass_length: number;
};

export type CreatePwdRequest =
  | CreatePwdRequestWithPassword
  | CreatePwdRequestWithPolicy;

export type CreatePwdResponse = {
  pwdId: string;
};

export type GetPwdResponse = {
  pwd: string;
  expiration_date: number;
  view_count: number;
};