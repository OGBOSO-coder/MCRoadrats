import React, { useState, useEffect } from 'react';
import Footer from '../Footer';

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [futureEvents, setFutureEvents] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new event object
    const newEvent = {
      name: eventName,
      date: eventDate,
      description: eventDescription,
      id: Date.now() 
    };
    setFutureEvents([...futureEvents, newEvent]);
    setEventName('');
    setEventDate('');
    setEventDescription('');
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updatedEvents = futureEvents.filter(event => event.id !== id);
    setFutureEvents(updatedEvents);
  };

  useEffect(() => {
    // Load Facebook SDK asynchronously
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 'your-app-id',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v11.0'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  useEffect(() => {
    // Trigger rendering of Facebook feed after SDK is loaded
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div>
      <div className='frontpage-container'>
        <center>
          <div class='logo-div'>
            <img src='\images\logo.PNG' class='logo-img' />
          </div>
        </center>
        <section className='intro-section'>
          <h1>Meistä?</h1>
          <p>
            Olemme Mikkelissä toimiva moottoripyöräkerho. Jäseniä kerhossamme on n. 110. Yleisimmät moottoripyörämerkit ovat edustettuina ja yhtälailla tervetulleita. Kerhomme on Suomen Motoristit ry eli SMOTON jäsen.
          </p>
        </section>
        <section className='future-events'>
          <h2>Tulevat tapahtumat</h2>
          <ul>
            {futureEvents.map(event => (
              <li key={event.id}>
                <h3>{event.name}</h3>
                <p>Date: {event.date}</p>
                <p>Description: {event.description}</p>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </li>
            ))}
          </ul>
          {showForm ? (
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Event Name'
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <input
                type='text'
                placeholder='Event Date'
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              <textarea
                placeholder='Event Description'
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              ></textarea>
              <button type='submit'>Submit</button>
            </form>
          ) : (
            <button onClick={() => setShowForm(true)}>Add Event</button>
          )}
        </section>
        <section className='past-events'>
          <h2>Menneet tapahtumat</h2>
          <ul>
          <li>
            <h3>Rottaralli</h3>
            <p>Date: January 1, 2024</p>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </li>
          <li>
            <h3>tapahtuma 2</h3>
            <p>Date: January 1, 2024</p>
            <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </li>
            {/* Display past events here */}
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;