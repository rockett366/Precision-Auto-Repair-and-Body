const push = jest.fn();
const replace = jest.fn();
const refresh = jest.fn();
const back = jest.fn();
const forward = jest.fn();

export const useRouter = () => ({
  push, replace, refresh, back, forward,
  prefetch: jest.fn(),
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams('');
export const redirect = jest.fn();
export const notFound = jest.fn();
