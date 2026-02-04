import { describe, expect, it, vi } from 'vitest';

const { responseUse, create } = vi.hoisted(() => {
  const responseUse = vi.fn();
  const create = vi.fn(() => ({
    interceptors: {
      response: {
        use: responseUse,
      },
    },
  }));

  return { responseUse, create };
});

vi.mock('axios', () => ({
  default: {
    create,
  },
  create,
}));

import httpClient from '../httpClient';

describe('httpClient', () => {
  it('creates an axios client with defaults', () => {
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    expect(httpClient).toBeDefined();
  });

  it('maps API errors from the response interceptor when payload is present', async () => {
    const [, onRejected] = responseUse.mock.calls[0];

    await expect(
      onRejected({ response: { data: { error: 'Bad request' } } }),
    ).rejects.toMatchObject({
      message: 'Bad request',
      payload: { error: 'Bad request' },
    });
  });

  it('uses a fallback message when no api error is provided', async () => {
    const [, onRejected] = responseUse.mock.calls[0];

    await expect(onRejected({ response: { data: {} } })).rejects.toMatchObject({
      message: 'Request failed',
    });
  });
});
