import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import App from '../App';
import userEvent from '@testing-library/user-event';
import EditToken from '../Pages/EditToken';

describe('Test home page and token component', () => {

  const myData = [
    { tok: 'BTC', bal: "250.00" },
  ];

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

    const backButton = screen.getByRole('button', {  name: /back/i});
    const editSpan = screen.getByText(/edit token/i);
    const tokenInput = screen.getByRole('textbox', {  name: /token/i});
    const balanceInput = screen.getByRole('textbox', {  name: /balance/i});
    const removeButton = screen.getByRole('button', {  name: /remove/i});
    const saveButton = screen.getByRole('button', {  name: /save/i});

    expect(backButton).toBeInTheDocument();
    expect(editSpan).toBeInTheDocument();
    expect(tokenInput).toBeInTheDocument();
    expect(balanceInput).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('tests the back button', async () => {
    const history = createMemoryHistory();
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

    const backButton = screen.getByRole('button', {  name: /back/i});

    userEvent.click(backButton);

    expect(history.location.pathname).toBe("/")
  });

  it('tests the save button', async () => {
    const history = createMemoryHistory();
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

    const tokenInput = screen.getByRole('textbox', {  name: /token/i});
    const balanceInput = screen.getByRole('textbox', {  name: /balance/i});
    const saveButton = screen.getByRole('button', {  name: /save/i});

    userEvent.clear(tokenInput);
    userEvent.clear(balanceInput);

    userEvent.type(tokenInput, 'BTC');
    userEvent.type(balanceInput, '250.00');
    userEvent.click(saveButton);

    expect(JSON.parse(localStorage.getItem('tokens'))).toEqual(myData);
    expect(history.location.pathname).toBe("/");
  });

  it('tests th', async () => {
    const setLocalStorage = (id, data) => {
        window.localStorage.setItem(id, JSON.stringify(data));
        return data;
      };
      jest.spyOn(global, 'fetch');
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(setLocalStorage('tokens', 
        [{"tok":"KLV","bal":"10,000.00"},{"tok":"USD","bal":"5,000.00"}]))
          .mockResolvedValue(setLocalStorage('index', 0)),
      });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/edit-token" element={<EditToken />} />
        </Routes>
      </MemoryRouter>
    );

    const alertSpy = jest.spyOn(window, "alert");
    
    const icon = screen.getByTestId('icon0');

    userEvent.click(icon);

    await waitFor(() => expect(icon).not.toBeInTheDocument());


    const tokenInput = screen.getByRole('textbox', {  name: /token/i});
    const balanceInput = screen.getByRole('textbox', {  name: /balance/i});
    const saveButton = screen.getByRole('button', {  name: /save/i});

    userEvent.clear(tokenInput);
    userEvent.clear(balanceInput);
    
    userEvent.type(tokenInput, 'USD');
    userEvent.type(balanceInput, '250.00');
    userEvent.click(saveButton);

    expect(alertSpy).toHaveBeenCalledWith('This token already exists,' + 
      ' choose another name please.');
  });

  it('tests the remove button', async () => {
    const history = createMemoryHistory();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/edit-token" element={<EditToken />} />
        </Routes>
      </MemoryRouter>
    );

    const alertSpy = jest.spyOn(window, "confirm").mockReturnValueOnce(true);
    
    const icon = screen.getByTestId('icon0');

    userEvent.click(icon);

    await waitFor(() => expect(icon).not.toBeInTheDocument());

    const removeButton = screen.getByRole('button', {  name: /remove/i});
    
    userEvent.click(removeButton);

    expect(alertSpy).toHaveBeenCalledWith('The current token will be' + 
      ' removed, do you want to continue?');
    expect(JSON.parse(localStorage.getItem('tokens'))).toEqual([]);

    expect(history.location.pathname).toBe("/");
  });
});