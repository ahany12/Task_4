import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

// 🧪 Before running any tests, confirm seededPerk from setup is valid
beforeAll(() => {
  const seededPerk = global.__TEST_CONTEXT__?.seededPerk;
  expect(seededPerk).toBeDefined();
  expect(seededPerk.title).toBeDefined();
  expect(seededPerk.merchant).toBeDefined();
  expect(typeof seededPerk.title).toBe('string');
  expect(typeof seededPerk.merchant).toBe('string');
});

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Filter by name
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // 🔍 Debug: log seeded perk merchant to ensure value is correct
    console.log('Testing merchant filter with:', seededPerk.merchant);

    // Try to locate the merchant filter input (placeholder may differ)
    const merchantFilter =
      screen.queryByPlaceholderText('Select merchant...') ||
      screen.queryByLabelText(/merchant/i) ||
      screen.getByRole('combobox');

    // Filter by merchant
    fireEvent.change(merchantFilter, { target: { value: seededPerk.merchant } });

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});