import { loginIdOfAuthUser, loginKey, sameLogin, sessionIsGone } from '@/domain/login';

describe('login keys', () => {
  it('keys a number by its last 10 digits and an email in lower case', () => {
    expect(loginKey('+91 98765 43210')).toBe('9876543210');
    expect(loginKey('919876543210')).toBe('9876543210');
    expect(loginKey(' Riya@Example.com ')).toBe('e.riya@example.com'.replace('@', '_'));
  });

  it('prefers the phone on an auth user', () => {
    expect(loginIdOfAuthUser({ phone: '919876543210', email: 'a@b.co' })).toBe('919876543210');
    expect(loginIdOfAuthUser({ phone: '', email: 'a@b.co' })).toBe('a@b.co');
    expect(loginIdOfAuthUser(null)).toBeNull();
  });

  it('matches a restored session only to the same person', () => {
    expect(sameLogin('9876543210', { phone: '919876543210' })).toBe(true);
    expect(sameLogin('9876543210', { phone: '919876543211' })).toBe(false);
    expect(sameLogin('riya@example.com', { email: 'RIYA@example.com' })).toBe(true);
    expect(sameLogin('riya@example.com', { phone: '919876543210' })).toBe(false);
    expect(sameLogin('', { phone: '919876543210' })).toBe(false);
    expect(sameLogin('123', { phone: '123' })).toBe(false);
  });
});

describe('when a failed refresh asks for a code again', () => {
  it('never for network trouble', () => {
    expect(sessionIsGone('Failed to fetch')).toBe(false);
    expect(sessionIsGone('Network request failed')).toBe(false);
    expect(sessionIsGone('Load failed')).toBe(false);
    expect(sessionIsGone(null)).toBe(false);
  });

  it('only when the server says the session no longer exists', () => {
    expect(sessionIsGone('Invalid Refresh Token: Refresh Token Not Found')).toBe(true);
    expect(sessionIsGone('Invalid Refresh Token: Already Used')).toBe(true);
    expect(sessionIsGone('Auth session missing!')).toBe(true);
  });
});
