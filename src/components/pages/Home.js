import React, { useState } from 'react';
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
      id: Date.now() // Add a unique ID for each event
    };
    // Add the new event to the list of future events
    setFutureEvents([...futureEvents, newEvent]);
    // Reset form fields
    setEventName('');
    setEventDate('');
    setEventDescription('');
    // Hide the form after submission
    setShowForm(false);
  };

  const handleDelete = (id) => {
    // Filter out the event with the given ID
    const updatedEvents = futureEvents.filter(event => event.id !== id);
    // Update the list of future events
    setFutureEvents(updatedEvents);
  };

  return (
    <div>
      <div className='frontpage-container'>
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