import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

describe('Test Header component', () => {
  test('qwdd', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    
    const img = screen.getByRole('img', {  name: /logo klever/i});

    expect(img).toBeInTheDocument();
  });
});