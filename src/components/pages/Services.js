import React from 'react';
import '../../App.css';

export default function Services() {
  return (
    <div className='services-container'>
      <h1 className='services'>SERVICES</h1>
      <ul className='services-list'>
        <li>Service 1</li>
        <li>Service 2</li>
        <li>Service 3</li>
        {/* Add more services as needed */}
      </ul>
    </div>
  );
}
