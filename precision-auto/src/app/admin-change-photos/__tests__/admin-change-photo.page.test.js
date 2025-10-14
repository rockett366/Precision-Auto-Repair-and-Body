import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils/render';
import AdminChangePhotosPage from '@/app/admin-change-photos/page';

jest.mock('@/app/constants/admin-sidebar', () => () => <aside data-testid="sidebar" />);
jest.mock('@/app/constants/nav.js', () => () => <nav data-testid="nav" />);

describe('AdminChangePhotos page', () => {
  test('renders main elements', () => {
    renderWithProviders(<AdminChangePhotosPage />);
    expect(screen.getByRole('heading', { level: 1, name: /change photos/i })).toBeInTheDocument();
    expect(screen.getByText(/view and manage photos/i)).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  test('renders at least one image row', () => {
    renderWithProviders(<AdminChangePhotosPage />);
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/placeholder for/i).length).toBeGreaterThan(0);
  });
});