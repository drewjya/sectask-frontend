import type { VFile } from "./file";

export type User = {
  id: number;
  name: string;
  email: string;
  profilePicture: VFile | undefined | null;
};

export type UserDto = {
  token: Token;
  user: User;
};
export type Token = {
  accessToken: string;
  refreshToken: string;
};
