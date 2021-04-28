const mockedPino = (option) => ({
  trace: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  silent: jest.fn(),
});

export default mockedPino;
