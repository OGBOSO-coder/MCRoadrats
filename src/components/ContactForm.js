import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    about: '',
    reason: '',
    address: '',
    motorbikeBrand: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePhoneNumber = phone => {
    // Phone number validation regex (accepts only numbers with optional hyphens)
    const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (isSubmitting) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Syötä oikea sähköposti');
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      setErrorMessage('Syötä oikea puhelinnumero (123-123-1234)');
      return;
    }

    setIsSubmitting(true);
    emailjs.sendForm('service_b1gcgxj', 'template_4tiylj8', e.target, 'Td4QDsAY5pI1HCi74')
      .then((result) => {
        console.log(result.text);
        setSuccessMessage('Email sent successfully!');
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
        setErrorMessage('Failed to send email. Please try again later.');
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
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
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
        <button type="submit" disabled={isSubmitting}>Lähetä</button> {/* Disable button when submitting */}
      </form>
    </div>
  );
};

export default ContactForm;