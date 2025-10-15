import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/render';
import AdminInvoices from '@/app/admin-invoices/page';

jest.mock('@/app/constants/nav.js', () => () => <nav data-testid="nav" />);
jest.mock('@/app/admin-invoices/components/invoicesTable', () => (p) => (
  <div data-testid="invoices-table">{p.items?.length ?? 0}</div>
));
jest.mock('@/app/admin-invoices/components/placeholderJSON', () => (p) => (
  <pre data-testid="placeholder-json">{JSON.stringify(p.data)}</pre>
));

const mockHook = jest.fn();
jest.mock('@/app/admin-invoices/hooks/useInvoicesHistory', () => ({
  __esModule: true,
  default: () => mockHook(),
}));

const renderPage = () => renderWithProviders(<AdminInvoices />);

describe('AdminInvoices page', () => {
  afterEach(() => mockHook.mockReset());

  test('renders basics (success state)', () => {
    mockHook.mockReturnValue({
      invoices: [{ id: 1, name: 'A', description: 'd', date: '2025-01-01' }],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: /review invoices/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search item name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByTestId('invoices-table')).toHaveTextContent('1');
  });

  test('loading state', () => {
    mockHook.mockReturnValue({
      invoices: [],
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    renderPage();
    expect(screen.getByText(/loading invoices/i)).toBeInTheDocument();
  });

  test('error state shows message, retry, and placeholder JSON', async () => {
    const refetch = jest.fn();
    mockHook.mockReturnValue({
      invoices: [],
      isLoading: false,
      isError: true,
      error: new Error('Fetch failed 500'),
      refetch,
    });

    renderPage();

    expect(screen.getByText(/could not load invoices/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    expect(screen.getByTestId('placeholder-json')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(refetch).toHaveBeenCalled();
  });

  test('empty success shows empty message', () => {
    mockHook.mockReturnValue({
      invoices: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    renderPage();

    expect(screen.getByTestId('invoices-table')).toHaveTextContent('0');
    expect(screen.getByText(/no invoices found/i)).toBeInTheDocument();
  });

  test('upload modal opens and closes', async () => {
    mockHook.mockReturnValue({
      invoices: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /upload/i }));
    expect(screen.getByRole('heading', { level: 2, name: /new invoice/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByRole('heading', { level: 2, name: /new invoice/i })).not.toBeInTheDocument();
  });
});