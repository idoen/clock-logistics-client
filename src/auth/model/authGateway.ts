export interface AuthGateway {
  login(): Promise<void>;
  logout(): Promise<void>;
}
