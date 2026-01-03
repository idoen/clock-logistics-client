import type { AuthGateway } from './authGateway';

class LocalAuthGateway implements AuthGateway {
  async login(): Promise<void> {
    return Promise.resolve();
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }
}

const localAuthGateway = new LocalAuthGateway();

export default localAuthGateway;
