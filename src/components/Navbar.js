import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            MC ROADRATS
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Etusivu
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/palvelut'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Palvelut
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/hallitus'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Jäsenistö
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/historia'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Historia
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/rottaralli'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Rottaralli
              </Link>
            </li>

            <li>
              <Link
                to='/jaseneksi'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Hae jäseneksi
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>Hae jäseneksi</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
