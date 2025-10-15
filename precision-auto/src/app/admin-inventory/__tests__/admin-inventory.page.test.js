import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test-utils/render';
import AdminInventory from '@/app/admin-inventory/page';

jest.mock('@/app/constants/admin-sidebar', () => () => <aside data-testid="sidebar" />);
jest.mock('@/app/constants/nav.js', () => () => <nav data-testid="nav" />);

describe('AdminInventory page', () => {
  test('renders basics', () => {
    renderWithProviders(<AdminInventory />);
    expect(screen.getByRole('heading', { level: 1, name: /inventory/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search item name/i)).toBeInTheDocument();
    expect(screen.getAllByText('+', { selector: 'button' }).length).toBeGreaterThan(0);    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
  });

  test('edit/save item name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminInventory />);
    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1];
    await user.click(within(firstDataRow).getByRole('button', { name: /edit/i }));
    const inputs = within(firstDataRow).getAllByRole('textbox');
    await user.clear(inputs[0]);
    await user.type(inputs[0], 'Wrench');
    await user.click(within(firstDataRow).getByRole('button', { name: /save/i }));
    expect(within(firstDataRow).getByText('Wrench')).toBeInTheDocument();
  });

  test('increment/decrement respects bounds', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminInventory />);
    const firstRow = screen.getAllByRole('row')[1];
    await user.click(within(firstRow).getByRole('button', { name: /edit/i }));
    await user.click(within(firstRow).getByRole('button', { name: /cancel/i }));
    await user.click(within(firstRow).getByRole('button', { name: '+' }));
    expect(within(firstRow).getByText('2 / 100')).toBeInTheDocument();
    await user.click(within(firstRow).getByRole('button', { name: '-' }));
    await user.click(within(firstRow).getByRole('button', { name: '-' }));
    expect(within(firstRow).getByText('0 / 100')).toBeInTheDocument();
  });
});