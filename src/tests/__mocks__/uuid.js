let mockCounter = 0;

const v4 = jest.fn(() => {
  mockCounter++;
  return `test-uuid-${mockCounter}`;
});

module.exports = {
  v4,
  __esModule: true,
  default: { v4 }
};