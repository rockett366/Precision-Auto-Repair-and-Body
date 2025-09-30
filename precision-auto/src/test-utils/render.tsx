import * as React from 'react';
import { render } from '@testing-library/react';

export * from '@testing-library/react';

export function renderWithProviders(ui: React.ReactElement, options?: any) {
  return render(ui, options);
}
