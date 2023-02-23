import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from "../App";
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditToken from '../Pages/EditToken';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import Header from '../Components/Header';
import AddToken from '../Pages/AddToken';

describe('Test Header component', () => {

  beforeEach(() => {
    const setLocalStorage = (id, data) => {
      window.localStorage.setItem(id, JSON.stringify(data));
      return data;
    };
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(setLocalStorage('tokens', [{"tok":"KLV","bal":"10,000.00"}]))
        .mockResolvedValue(setLocalStorage('index', 0)),
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  test('Tests if the header element appears in all routes', async () => {
    const history = createMemoryHistory();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<App />} />
          <Route path="/add-token" element={<AddToken />} />
          <Route path="/edit-token" element={<EditToken />} />
        </Routes>
      </MemoryRouter>
    );
    
    let img = screen.getByRole('img', {  name: /logo klever/i});
    const addToken = screen.getByRole('button', {  name: /add token/i});
    let wishSpan = screen.getByText(/wish wallet/i);
    let shootingStar = screen.getByRole('img', {  name: /shooting star/i});

    expect(img).toBeInTheDocument();
    expect(addToken).toBeInTheDocument();
    expect(wishSpan).toBeInTheDocument();
    expect(shootingStar).toBeInTheDocument();

    act(() => {
      addToken.click();
    });

    img = screen.getByRole('img', {  name: /logo klever/i});
    wishSpan = screen.getByText(/wish wallet/i);
    shootingStar = screen.getByRole('img', {  name: /shooting star/i});

    expect(img).toBeInTheDocument();
    expect(addToken).not.toBeInTheDocument();
    expect(wishSpan).toBeInTheDocument();
    expect(shootingStar).toBeInTheDocument();

    history.push("/edit-token");

    expect(img).toBeInTheDocument();
    expect(addToken).not.toBeInTheDocument();
    expect(wishSpan).toBeInTheDocument();
    expect(shootingStar).toBeInTheDocument();
  });
});