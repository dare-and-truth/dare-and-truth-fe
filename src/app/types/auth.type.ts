export type LoginPayload = {
  email: string;
  password: string;
};

export type ErrorFormLogin = LoginPayload;

export type SignUpPayload = {
  email: string;
  username: string;
  password: string;
};
