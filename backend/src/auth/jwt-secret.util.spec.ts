import { getJwtSecret } from './jwt-secret.util';

describe('getJwtSecret', () => {
  const prevSecret = process.env.JWT_SECRET;
  const prevEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.JWT_SECRET = prevSecret;
    process.env.NODE_ENV = prevEnv;
  });

  it('ưu tiên trả về JWT_SECRET từ biến môi trường', () => {
    process.env.JWT_SECRET = '  super-strong-secret  ';
    process.env.NODE_ENV = 'production';
    expect(getJwtSecret()).toBe('super-strong-secret');
  });

  it('ném lỗi khi thiếu JWT_SECRET trong môi trường production', () => {
    delete process.env.JWT_SECRET;
    process.env.NODE_ENV = 'production';
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it('cho phép fallback ở môi trường non-production', () => {
    delete process.env.JWT_SECRET;
    process.env.NODE_ENV = 'development';
    expect(getJwtSecret()).toBe('secret');
  });
});
