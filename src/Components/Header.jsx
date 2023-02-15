import { createBrowserHistory } from '@remix-run/router';
import React from 'react'
import KleverLogo from '../assets/logo.svg'
import Star from '../assets/shooting-star.svg'
import '../CSS/header.css'

function Header() {
  const history = createBrowserHistory();
  const locate = history.location.pathname;
  return (
    <header>
        <div className="klever-logo-container">
          <img id="klever-logo" src={ KleverLogo } alt="logo Klever" />
        </div>
        <div className="star-container">
          <div className="star-and-wish-container">
            <img id="shooting-star" src={ Star } alt="shooting star" />
            <span id="wish-span">Wish Wallet</span>
          </div>
          <div>
          { locate === "/" && 
              <button 
              id="add-button"
              type="button"
            >
              Add Token
            </button> 
          }
          </div>
        </div>
    </header>
  )
}

export default Header