import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import userEvent from '@testing-library/user-event';
import EditToken from '../Pages/EditToken';

describe('Test home page and token component', () => {

  beforeEach(() => {
    const setLocalStorage = (id, data) => {
      window.localStorage.setItem(id, JSON.stringify(data));
      return data;
    };
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(setLocalStorage('tokens', 
      [{"tok":"KLV","bal":"10,000.00"}])).mockResolvedValue(setLocalStorage('index', 0)),
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  it('tests local storage', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    const tokenStorage = JSON.parse(localStorage.getItem('tokens') || '[]');

    expect(tokenStorage).toEqual([{"tok":"KLV","bal":"10,000.00"}]);

    window.localStorage.clear();

    const tokenStorage2 = JSON.parse(localStorage.getItem('tokens') || '[]');

    expect(tokenStorage2).toEqual([]);
  });

  it('test if spans are on the page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </MemoryRouter>
    );
    
    const tokenSpan = screen.getByText(/tokens/i);
    const balanceSpan = screen.getByText(/balance/i);

    expect(tokenSpan).toBeInTheDocument();
    expect(balanceSpan).toBeInTheDocument();
  });

  it('tests that all elements are being rendered', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </MemoryRouter>
    );
    
    const tokenName = screen.getByText(/klv/i);
    const balanceValue = screen.getByText(/10,000\.00/i);
    const icon = screen.getByTestId('icon0');

    expect(tokenName).toBeInTheDocument();
    expect(balanceValue).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('tests that all elements are being rendere', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/edit-token" element={<EditToken />} />
        </Routes>
      </MemoryRouter>
    );
    
    const icon = screen.getByTestId('icon0');

    userEvent.click(icon);

    await waitFor(() => expect(icon).not.toBeInTheDocument());
  });
});