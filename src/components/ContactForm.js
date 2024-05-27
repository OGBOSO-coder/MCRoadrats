import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactForm.css';

const ContactForm = () => {
  // Alustetaan lomakedata useState-hookilla
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    about: '',
    reason: '',
    address: '',
    motorbikeBrand: ''
  });

  // Alustetaan virhe- ja onnistumisviestit sekä lähettämisen tila
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Käsitellään lomakekenttien muutokset
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Puhelinnumeron validointifunktio
  const validatePhoneNumber = phone => {
    // Puhelinnumeron validointi regexillä (hyväksyy vain numerot ja mahdolliset väliviivat)
    const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;
    return phoneRegex.test(phone);
  };

  // Lomakkeen lähettämisen käsittely
  const handleSubmit = e => {
    e.preventDefault();

    // Jos lomake on jo lähetyksen tilassa, ei tehdä mitään
    if (isSubmitting) return;

    // Sähköpostin validointi regexillä
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Syötä oikea sähköposti');
      return;
    }

    // Puhelinnumeron validointi
    if (!validatePhoneNumber(formData.phone)) {
      setErrorMessage('Syötä oikea puhelinnumero (123-123-1234)');
      return;
    }

    // Asetetaan lähetyksen tila ja lähetetään lomake emailjs:llä
    setIsSubmitting(true);
    emailjs.sendForm('service_b1gcgxj', 'template_4tiylj8', e.target, 'Td4QDsAY5pI1HCi74')
      .then((result) => {
        console.log(result.text);
        setSuccessMessage('Email lähetetty onnistuneesti!');
        // Tyhjennetään lomake
        setFormData({
          name: '',
          email: '',
          phone: '',
          about: '',
          reason: '',
          address: '',
          motorbikeBrand: ''
        });
        setErrorMessage('');
      })
      .catch((error) => {
        console.log(error.text);
        setErrorMessage('Emailin lähetys epäonnistui. Yritä myöhemmin uudelleen.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-form">
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nimi:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Sähköposti:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Puhelinnumero:</label>
          <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Osoite:</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="motorbikeBrand">Moottoripyörämerkki:</label>
          <input type="text" id="motorbikeBrand" name="motorbikeBrand" value={formData.motorbikeBrand} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="about">Kerro itsestäsi:</label>
          <textarea id="about" name="about" value={formData.about} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Miksi haluat liittyä:</label>
          <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} required />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit" disabled={isSubmitting}>Lähetä</button> {/* Estä painike kun lomake on lähetyksen tilassa */}
      </form>
    </div>
  );
};

export default ContactForm;