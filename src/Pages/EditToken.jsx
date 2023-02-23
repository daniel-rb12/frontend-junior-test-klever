import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header'
import '../CSS/editToken.css'

function EditToken() {
  const navigate = useNavigate();

  const indexToken = JSON.parse(localStorage.getItem('index'));
  const tokenStorage = JSON.parse(localStorage.getItem('tokens') || '[]');

  const [token, setToken] = useState(tokenStorage[indexToken].tok);
  const [balance, setBalance] = useState(tokenStorage[indexToken].bal);
  const [isDisabled, setIsDisabled] = useState(true);

  useMemo(() => {
    if (token.length > 0 && balance.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    };

  }, [token, balance])

  const handleClickSave = () => {
    const tokenForLocalStorage = JSON.parse(localStorage.getItem('tokens') || '[]');
    tokenForLocalStorage[indexToken] = ({ tok: token, bal: balance });
    localStorage.setItem('tokens', JSON.stringify(tokenForLocalStorage));
    navigate('/');
  };

  const handleChange = ({ target }) => {
    const targetValue = target.value;
    const regex = /^[0-9.,]+$/;
    const regexValidation =  targetValue.length === 0 ? true : regex.test(targetValue);
    const maxLengthBalance = 12;
    if (regexValidation && targetValue.length < maxLengthBalance) setBalance(targetValue);
  };

  const verifyDuplicateToken = () => {
    const tokenStorage = JSON.parse(localStorage.getItem('tokens') || '[]');
    const isDuplicate = tokenStorage.find(({ tok }) => tok === token) ? true : false;
    const isDuplicateEdit = tokenStorage[indexToken].tok === token;

    if (isDuplicateEdit) handleClickSave()
    else if (isDuplicate === true) {
      alert('This token already exists, choose another name please.');
    } else {
      handleClickSave()
    };
  };

  const removeToken = () => {
    const filterToken = tokenStorage.filter((token) => (
      token.tok !== tokenStorage[indexToken].tok));
    localStorage.setItem('tokens', JSON.stringify(filterToken));
    navigate('/')
  }

  const removeAlert = () => {
    const teste = window.confirm('The current token will be removed, do you want to continue?')
    if (teste) removeToken();
  }

  return (
    <div>
      <Header />
      <div className="edit-token-container">
        <div className="edit-top-container">
          <span id="edit-span">Edit Token</span>
          <button
            id="back-button"
            type="button"
            onClick={ () => navigate('/') }
          >
            Back
          </button>
        </div>
        <form className="edit-form-container">
          <label htmlFor="token-input">
            Token
            <input
              type="text"
              name="token"
              id="token-input"
              value={ token }
              placeholder="Token Name"
              onChange={ ({ target }) => setToken(target.value.toLocaleUpperCase()) }
              maxLength="6"
              required
            />
          </label>
          <label htmlFor="balance-input">
            Balance
            <input
              type="text"
              name="balance"
              id="balance-input"
              value={ balance }
              placeholder="Value"
              onChange={ handleChange }
              min="1"
              max="5"
              required
            />
          </label>
          <div className="button-container">
            <button
              id="save-button-edit"
              type="button"
              onClick={ verifyDuplicateToken }
              disabled={ isDisabled }
            >
              Save
            </button>
            <button
              id="remove-button"
              type="button"
              onClick={ removeAlert }
            >
              Remove
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditToken