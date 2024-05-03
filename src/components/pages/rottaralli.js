import React, { useState, useEffect } from 'react';
import "../Rottaralli.css"
import Footer from '../Footer';
import { auth, db } from '../firebase'; // Import your Firebase configuration
import { addDoc, collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

const Ralli = () => {
  const [user, setUser] = useState(null); // Placeholder for user state
  const [eventInfo, setEventInfo] = useState(''); // State to hold the event info text
  const [newPost, setNewPost] = useState(''); // State to hold the new post text
  const [posts, setPosts] = useState([]); // State to hold the posts

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user); // Set user if logged in
      } else {
        setUser(null); // Set user to null if logged out
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        // Fetch event info from Firebase database
        const eventInfoCollection = collection(db, 'event-info');
        const snapshot = await getDocs(eventInfoCollection);
        snapshot.forEach(doc => {
          setEventInfo(doc.data().info); // Set the event info state with fetched data
        });
      } catch (error) {
        console.error('Error fetching event info: ', error);
      }
    };

    fetchEventInfo(); // Call fetchEventInfo function when component mounts
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts from Firebase database under the "event-info" collection
        const postsCollection = collection(db, 'event-info');
        const snapshot = await getDocs(postsCollection);
        const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };

    fetchPosts(); // Call fetchPosts function when component mounts
  }, []);

  const handlePostSubmit = async () => {
    try {
      // Add new post to the "event-info" collection
      const docRef = await addDoc(collection(db, 'event-info'), {
        text: newPost,
        timestamp: new Date().toISOString(),
        userId: user.uid // Assuming you have user authentication enabled
      });
      console.log('Post added with ID: ', docRef.id);
      setNewPost(''); // Clear the input field after submitting
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  return (
    <div className="sivut">
      <div className='ralli-header'>
        <h1>Rottaralli 2024</h1>
        {user && <h3>Hello, {user.email}</h3>} {/* Display hello (logged user) */}
        <center>
          <div className='rottaralli-logo-div'>
            <img src='/images/rottaralli_logo.png' className='rottaralli-logo-img' alt='Rottaralli Logo' />
          </div>
        </center>
      </div>

      <div className='ralli-info'>
        <div className='ralli-div'>
          <h1 className='ralli-title'>Rottaralli 2024 tiedotteita</h1>
          <p className='ralli-text'>
          <ul>
          {posts.map(post => (
            <p key={post.id}>{post.text}
            <button onClick={() => (post)}>Edit</button></p>
          ))}
        </ul>
          </p> {/* Display event info text */}
        </div>
        <div className='ralli-lippuja'>
          <div className='ralli-lippu-div'>
            <h1>Rallilipu</h1>
            <button>Osta</button>
          </div>
          <div className='ralli-lippu-div'>
            <h1>Hotellin Majoitukset</h1>
            <button>Lisätietoja</button>
          </div>
        </div>
      </div>

      <div className='ralli-kuvat-div'>
        <h1>Paikan Kuvat</h1>
        <div className='rottaralli-kuvat-gallery'>
          <div className='rottaralli-kuva-gallery-container'>
            <img src='/images/img-9.jpg' alt="img-9" className="ralli-image" />
          </div>
          <div className='rottaralli-kuva-gallery-container'>
            <img src='/images/img-7.jpg' alt="img-9" className="ralli-image" />
          </div>
          <div className='rottaralli-kuva-gallery-container'>
            <img src='/images/img-8.jpg' alt="img-9" className="ralli-image" />
          </div>
        </div>
      </div>

      <div className="facebook-feed">
        <div className="fb-page"
          data-href="https://www.facebook.com/p/Rottaralli-100057561793735/"
          data-tabs="timeline"
          data-width="400"
          data-height=""
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true">
          <blockquote cite="https://www.facebook.com/p/Rottaralli-100057561793735/" className="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/p/Rottaralli-100057561793735/">MC Road Rats ry</a>
          </blockquote>
        </div>
      </div>

      {/* Form to submit a new post */}
      {user && (
        <div>
          <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Write your post here" />
          <button onClick={handlePostSubmit}>Submit Post</button>
        </div>
      )}

      {/* Display posts */}
      <div className="posts">
        <h2>Posts</h2>
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.text}</li>
          ))}
        </ul>
      </div>

      <Footer />
    </div>
  );
};

export default Ralli;
