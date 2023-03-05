export type JwtPayload = {
  username: string;
  email: string;
  avatar: string;
  sub: string;
  iat: number;
  exp: number;
};

export type JwtPayloadWithRefreshToken = JwtPayload & {
  refreshToken: string;
};
