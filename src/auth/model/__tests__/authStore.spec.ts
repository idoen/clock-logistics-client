import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../authStore';
import type { AuthGateway } from '../authGateway';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('logs in using the provided gateway', async () => {
    const gateway: AuthGateway = {
      login: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
    };

    const store = useAuthStore();

    await store.login(gateway);

    expect(gateway.login).toHaveBeenCalledTimes(1);
    expect(store.isAuthenticated).toBe(true);
  });

  it('does not authenticate when login fails', async () => {
    const gateway: AuthGateway = {
      login: vi.fn().mockRejectedValue(new Error('boom')),
      logout: vi.fn().mockResolvedValue(undefined),
    };

    const store = useAuthStore();

    await expect(store.login(gateway)).rejects.toThrow('boom');
    expect(store.isAuthenticated).toBe(false);
  });

  it('logs out using the provided gateway', async () => {
    const gateway: AuthGateway = {
      login: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
    };

    const store = useAuthStore();
    store.isAuthenticated = true;

    await store.logout(gateway);

    expect(gateway.logout).toHaveBeenCalledTimes(1);
    expect(store.isAuthenticated).toBe(false);
  });
});
