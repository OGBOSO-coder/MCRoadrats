import React from 'react';
import '../../App.css';
import Cards from '../Cards'; // Import the 'Cards' component

export default function Services() {
  return (
    <div className='services-container'>
      <h1 className='services-title'>Hallitus</h1>
      <div className='services-grid'>
        <div className='service'>
          <h2 className='service-title'>Tero Pöntinen</h2>
          <p className='service-description'>puheenjohtaja</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Ilkka Husu</h2>
          <p className='service-description'>varapuheenjohtaja</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Sami Kuva</h2>
          <p className='service-description'>sihteeri, varajäsen</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Sari Martikainen</h2>
          <p className='service-description'>rahastonhoitaja</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Pasi Laitinen</h2>
          <p className='service-description'>Jäsen</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Henri Avikainen</h2>
          <p className='service-description'>Jäsen</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Janne Purhonen</h2>
          <p className='service-description'>Jäsen</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Hermanni Saresma</h2>
          <p className='service-description'>Jäsen</p>
        </div>
        <div className='service'>
          <h2 className='service-title'>Hermanni Saresma</h2>
          <p className='service-description'>varajäsen</p>
        </div>
        {/* Add more services as needed */}
      </div>
      <div className='members-container'>
        <div className='members-section'>
          <h2 className='members-section-title'>Honored Members</h2>
          <p>Kimmo Saranen, Kunniapuheenjohtaja (Honorary President, Life Member)</p>
          <p>Tede Fehrmann, Kunniajäsen (Life  Member)</p>
          <p>Marko Siiskonen, Kunniajäsen (Life Member)</p>
          <p>Arto Alatalo, Kunniajäsen (Life Member)</p>
          <p>Hannu Haajanen, Kunniajäsen (Life Member)</p>
          <p>Ilkka Husu, Kunniajäsen (Life Member)</p>
        </div>
        <div className='members-section'>
          <h2 className='members-section-title'>Gone But Never Forgotten Members</h2>
          <p>Seppo, Kunniajäsen (Honorary Member)</p>
          <p>Antti, Kunniajäsen (Honorary Member)</p>
          <p>Tapsa</p>
          <p>Kaisa</p>
          <p>Ari</p>
          <p>Pekka</p>
          <p>Pasi</p>
        </div>
      </div>


    </div>
  );
}