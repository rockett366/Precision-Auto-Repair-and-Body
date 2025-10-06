import React from 'react';
import { render, screen, waitFor } from '@/test-utils/render';

function HealthWidget() {
  const [count, setCount] = React.useState(null);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/health`)
      .then((r) => r.json())
      .then((d) => setCount(d.vehicle_count))
      .catch(() => setCount(-1));
  }, []);

  return <div aria-label="vehicle-count">{count ?? 'Loading'}</div>;
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('shows backend vehicle count (success path)', async () => {
  global.fetch.mockResolvedValueOnce({
    json: async () => ({ status: 'ok', vehicle_count: 42 }),
  });

  render(<HealthWidget />);

  expect(screen.getByLabelText('vehicle-count')).toHaveTextContent('Loading');

  await waitFor(() =>
    expect(screen.getByLabelText('vehicle-count')).toHaveTextContent('42')
  );

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(String(global.fetch.mock.calls[0][0])).toMatch(/\/health$/);
});

test('shows -1 on network error (error path)', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Network error'));

  render(<HealthWidget />);

  await waitFor(() =>
    expect(screen.getByLabelText('vehicle-count')).toHaveTextContent('-1')
  );
});
