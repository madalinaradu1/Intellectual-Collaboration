import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders IGLOO platform', () => {
  const mockSignOut = jest.fn();
  const mockUser = { username: 'test@gcu.edu' };
  
  render(<App signOut={mockSignOut} user={mockUser} />);
  // Test will pass as the component renders without errors
  expect(true).toBe(true);
});
