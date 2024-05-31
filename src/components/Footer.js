import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <div className='info-left'>
        <p>Kotilantie 3 C, 50100 MIKKELI​ <br />
          y-tunnus: 1450725-9</p>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='social-icons'>
            <a
              href='https://www.facebook.com/mcroadrats/'
              className='social-icon-link facebook'
              target='_blank'
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f' />
            </a>
            <a
              href='https://www.instagram.com/mcroadrats/'
              className='social-icon-link instagram'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram' />
            </a>
          </div>
          <small className='website-rights'>Mc Road Rats St Michel Finland ry 2024</small>
        </div>
      </section>
      <div className='info-right'>
        <p>mail@mcroadrats.com​ <br />
          laskut@mcroadrats.com</p>
      </div>
    </div>
  );
}

export default Footer;