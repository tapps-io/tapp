window.eventBus = {
  register: jest.fn(() => true),
  subscribe: jest.fn(() => {
    unsubscribe: jest.fn();
  }),
  publish: jest.fn(),
};
