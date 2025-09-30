import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { server } from './src/test-utils/msw/server';
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
