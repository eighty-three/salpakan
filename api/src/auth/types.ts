export interface IPayload {
  username?: string;
  role?: string;
  session?: string;
  guest?: string;
  iat?: number;
  exp?: number;
}

export interface ISession {
  role: string;
  session: string;
}
