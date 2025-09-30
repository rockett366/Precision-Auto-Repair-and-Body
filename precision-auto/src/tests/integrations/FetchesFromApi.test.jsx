import React from 'react';
import { render, screen, waitFor } from '@/src/test-utils/render';

function VehicleCount() {
  const [count, setCount] = React.useState(null);
  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`)
      .then(r => r.json())
      .then(d => setCount(d.vehicle_count))
      .catch(() => setCount(-1));
  }, []);
  return <div aria-label="vehicle-count">{count ?? 'Loading'}</div>;
}
test('shows count from backend (mocked)', async () => {

  render(<VehicleCount />);
  await waitFor(() => expect(screen.getByLabelText('vehicle-count')).toHaveTextContent('42'));
});
