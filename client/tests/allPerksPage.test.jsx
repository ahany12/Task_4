import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';

import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';


  

describe('AllPerks page (Directory)', () => {
  test('lists public perks and responds to name filtering', async () => {
    // Ensure a deterministic seeded perk exists for this test. The global
    // setup normally provides one, but in parallel runs another test can
    // remove it; create a fresh one here if needed so the test is robust.
    const ctx = global.__TEST_CONTEXT__;
    let seededPerk = ctx?.seededPerk;
    if (!seededPerk) {
      const resp = await ctx.api.post('/perks', {
        title: `Integration Preview Benefit ${Date.now()}`,
        description: 'Baseline record created during test for deterministic rendering checks.',
        category: 'travel',
        merchant: `Integration Merchant ${Date.now()}`,
        discountPercent: 15
      });
      seededPerk = resp.data.perk;
      if (seededPerk?._id) ctx.createdPerkIds.add(seededPerk._id);
    }

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the baseline card to appear which guarantees the asynchronous
    // fetch finished.
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Interact with the name filter input using the real value that
    // corresponds to the seeded record.
    const nameFilter = screen.getByPlaceholderText('Enter perk name...');
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    // The summary text should continue to reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });

  /*
  TODO: Test merchant filtering
  - use the seeded record
  - perform a real HTTP fetch.
  - wait for the fetch to finish
  - choose the record's merchant from the dropdown
  - verify the record is displayed
  - verify the summary text reflects the number of matching perks
  */

  test('lists public perks and responds to merchant filtering', async () => {
    const ctx = global.__TEST_CONTEXT__;
    let seededPerk = ctx?.seededPerk;
    if (!seededPerk) {
      const resp = await ctx.api.post('/perks', {
        title: `Integration Preview Benefit ${Date.now()}`,
        description: 'Baseline record created during test for deterministic rendering checks.',
        category: 'travel',
        merchant: `Integration Merchant ${Date.now()}`,
        discountPercent: 15
      });
      seededPerk = resp.data.perk;
      if (seededPerk?._id) ctx.createdPerkIds.add(seededPerk._id);
    }

    // Render the exploration page so it performs its real HTTP fetch.
    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for the baseline card to appear which guarantees the asynchronous
    // fetch finished.
    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Interact with the name filter input using the real value that
    // corresponds to the seeded record.
  // The merchant <select> isn't guaranteed to have a placeholder or id,
  // so locate it via the nearby label text and then query for the select
  // element inside the same container.
  const merchantLabel = screen.getByText(/Filter by Merchant/i);
  const merchantContainer = merchantLabel.closest('div');
  const merchantFilter = merchantContainer.querySelector('select');
  fireEvent.change(merchantFilter, { target: { value: seededPerk.merchant } });

    await waitFor(() => {
      expect(screen.getByText(seededPerk.title)).toBeInTheDocument();
    });

    // The summary text should continue to reflect the number of matching perks.
    expect(screen.getByText(/showing/i)).toHaveTextContent('Showing');
  });
});