import React from 'react';
import '../../App.css';
import Footer from '../Footer';

export default function Products() {
  return (
    <div className=''>
      <div className='equipment-container'>
        <h1 className='equipment-title'>Palvelut</h1>
        <p className='equipment-description'>
          Palvelut:
          <br />
          - Teho-, vääntö- ja seoksenmittaus inertiapenkissämme.
          <br />
          - Laitteistossamme on kotimainen huippuohjelmisto.
          <br />
          - Laitteistossamme on kotimainen huippuohjelmisto. Seosmittaus laajakaistalambdalla. Tulokset ennen ja jälkeen säädön saat mukaan paperitulosteena, jossa näkyy hevosvoima-, vääntö- ja seoskäyrä.
          <br />
          - Uutta! Säätö myös TuneEcu:lla. <a href='http://www.tuneecu.com'>www.tuneecu.com</a>
          <br />
          - Meillä on myös välineet Suzukien ruiskun ja PowerCommander säätöön.
        </p>
        <div className='equipment-images'>
          <div className='equipment-image'>
            <img src='/images/pc3.jpg' alt='Equipment 1' />
            <p className='image-caption'>Dyno jet PowerCommander</p>
          </div>
          <div className='equipment-image'>
            <img src='/images/injection adjust.jpg' alt='Equipment 2' />
            <p className='image-caption'>Suzuki injection adjuster. fit's on:
              Suzuki
              GSX/R 600, 01-
              SV 650, 03-
              GSX/R 750, 98-99
              GSX/R 750, 01-
              GSX/R 1000, 01-
              SV 1000, 03-
              TL 1000 S, 97-01
              TL 1000 R, 98-03
              DL 1000 VStrom, 02-
              GSX 1300 R Hayabusa, 99-
              GSX 1400, 01-
            </p>
          </div>
        </div>
        <p className='equipment1-description'>
          Kerhomme kalustoa tapahtumiim:
          <br />
          - Rottarallin tapahtuma teltat 2 kpl 13 x 38 m
          <br />
          - Tapahtumapöydät ja tuolit
          <br />
          - POP-UP teltat 4 x 4 m 2 kpl
          <br />
          - Grillikontti ruoan valmistukseen ( vaihtolava vaijereilla )
          <br />
          - Toimisto/vastaanotto kioski ( vaihtolava vaijereilla )
          <br />
          - Soppatykit, isot muurikkapannut, alfakeittimet
        </p>
        <p className='equipment-description'>
          Muutamia mitattuja moottoripyöriä.
        </p>
        <div className='tulokset'>
          <div className='tulokset'>
            <a href='/images/GSXR1100N.jpg' target='_blank' rel='noopener noreferrer'>
              <img src='/images/GSXR1100N.jpg' alt='GSXR1100N' />
            </a>
          </div>
          <div className='tulokset'>
            <a href='/images/CBR900RR.jpg' target='_blank' rel='noopener noreferrer'>
              <img src='/images/CBR900RR.jpg' alt='CBR900RR' />
            </a>
          </div>
          <div className='tulokset'>
            <a href='/images/Bandit1200[1].jpg' target='_blank' rel='noopener noreferrer'>
              <img src='/images/Bandit1200[1].jpg' alt='Bandit1200[1]' />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}