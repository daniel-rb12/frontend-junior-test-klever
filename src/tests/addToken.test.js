import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import AddToken from '../Pages/AddToken';
import App from '../App';
import userEvent from '@testing-library/user-event';

describe('Test Add Token page', () => {

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

  it('tests whether all elements are on the screen', () => {
    render(
      <MemoryRouter initialEntries={['/add-token']}>
        <Routes>
          <Route path="/add-token" element={<AddToken />} />
        </Routes>
      </MemoryRouter>
    );

    const addSpan = screen.getByTestId('add-span');
    const backButton = screen.getByRole('button', {  name: /back/i});
    const tokenInput = screen.getByRole('textbox', {  name: /token/i});
    const balanceInput = screen.getByRole('textbox', {  name: /balance/i});
    const saveButton = screen.getByRole('button', {  name: /save/i});

    expect(addSpan).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    expect(tokenInput).toBeInTheDocument();
    expect(balanceInput).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('tests the back button', () => {
    const history = createMemoryHistory();
    render(
      <MemoryRouter initialEntries={['/add-token']}>
        <Routes>
          <Route path="/add-token" element={<AddToken />} />
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    const backButton = screen.getByRole('button', {  name: /back/i});
    
    userEvent.click(backButton);

    expect(history.location.pathname).toBe("/")
  });

  it(`tests the save button and if it only enables
    it when you fill in all the fields`, () => {
    const history = createMemoryHistory();
    render(
      <MemoryRouter initialEntries={['/add-token']}>
        <Routes>
          <Route path="/add-token" element={<AddToken />} />
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    window.localStorage.clear();

    const tokenInput = screen.getByRole('textbox', {  name: /token/i});
    const balanceInput = screen.getByRole('textbox', {  name: /balance/i});
    const saveButton = screen.getByRole('button', {  name: /save/i});
    
    userEvent.type(tokenInput, 'BTC');

    expect(saveButton).toBeDisabled();

    userEvent.clear(tokenInput);
    userEvent.type(balanceInput, '250.00');

    expect(saveButton).toBeDisabled();

    userEvent.type(tokenInput, 'BTC');

    expect(saveButton).not.toBeDisabled();

    userEvent.click(saveButton);

    expect(JSON.parse(localStorage.getItem('tokens'))).toEqual(myData)
    expect(history.location.pathname).toBe("/");
  });
  it(`tests whether the user receives an alert when 
    trying to add a token with an existing name`, () => {
  render(
    <MemoryRouter initialEntries={['/add-token']}>
      <Routes>
        <Route path="/add-token" element={<AddToken />} />
      </Routes>
    </MemoryRouter>
  );

  const alertSpy = jest.spyOn(window, "alert");

  const tokenInput = screen.getByRole('textbox', {  name: /token/i});
  const balanceInput = screen.getByRole('textbox', {  name: /balance/i});
  const saveButton = screen.getByRole('button', {  name: /save/i});
  
  userEvent.type(tokenInput, 'KLV');
  userEvent.type(balanceInput, '250.00');

  userEvent.click(saveButton);

  expect(alertSpy).toHaveBeenCalledWith('This token already exists,' + 
    ' choose another name please.');
  });

  it(`tests regex validator`, () => {
    render(
    <MemoryRouter initialEntries={['/add-token']}>
        <Routes>
        <Route path="/add-token" element={<AddToken />} />
        </Routes>
    </MemoryRouter>
    );

    const tokenInput = screen.getByRole('textbox', {  name: /token/i});
    const balanceInput = screen.getByRole('textbox', {  name: /balance/i});
    const saveButton = screen.getByRole('button', {  name: /save/i});

    userEvent.type(tokenInput, 'KLV');
    userEvent.type(balanceInput, 'TEST');

    expect(balanceInput.value.length).toEqual(0);
    expect(saveButton).toBeDisabled();
  });
});