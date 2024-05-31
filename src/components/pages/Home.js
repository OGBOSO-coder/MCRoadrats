import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import { db, auth, storage } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

function Home() {
  const [futureEvents, setFutureEvents] = useState([]);
  const [Honored, setHonored] = useState([]);
  const [user, setUser] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [image, setImage] = useState(null);
  const [postDescription, setPostDescription] = useState('');

  const fetchEvents = async () => {
    try {
      // Fetch posts from Firestore collection 'posts' and order by 'createdAt' in ascending order
      const postCollection = collection(db, 'posts');
      const q = query(postCollection, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const honoredCollection = collection(db, 'Etusivu');
      const snapshot1 = await getDocs(honoredCollection);
      const honordData = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setHonored(honordData);
      setFutureEvents(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

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
    fetchEvents();
  }, []);

  const handleCreatePost = async () => {
    try {
      let imageUrl = ''; // Initialize imageUrl to empty string
  
      // Check if an image is provided
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      await addDoc(collection(db, 'posts'), {
        title: postTitle,
        description: postDescription,
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
        createdAt: serverTimestamp(), // Add createdAt field
      });
      alert('tapahtuma luotu!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleEditPost = async (postId) => {
    try {
      let imageUrl = ''; // Initialize imageUrl to empty string
  
      // Check if an image is provided
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      // Update the post document in Firestore collection 'posts'
      await updateDoc(doc(db, 'posts', postId), {
        title: postTitle,
        description: postDescription,
        imageUrl: imageUrl, // Assign the imageUrl whether it's empty or contains a value
      });
      alert('Post updated successfully!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Delete the post document from Firestore collection 'posts'
      await deleteDoc(doc(db, 'posts', postId));
      alert('Post deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div>
      <div className='frontpage-container'>
        {user && <h3>Kirjautunut, {user.email}</h3>} {/* Display hello (logged user) */}
        <center>
        <div className='logo-div'>
          {Honored.map(event => (
            <p key={event.id}>
              {event.imageUrl && <img className="logo-img" src={event.imageUrl} alt="logo" />}
            </p>
          ))}
        </div>
        </center>
        <section className='intro-section'>
          <p>
            Olemme Mikkelissä toimiva moottoripyöräkerho. Jäseniä kerhossamme on n. 110. Yleisimmät moottoripyörämerkit ovat edustettuina ja yhtälailla tervetulleita. Kerhomme on Suomen Motoristit ry eli SMOTON jäsen.
          </p>
        </section>
        <section className='future-events'>
          <h2>Tapahtumia</h2>
          {user && (
          <div>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Post Title"
            />
            <textarea
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              placeholder="Post Description"
            ></textarea>
                      <div>
            <label>Kuva</label>
            <input
              type="file"
              onChange={handleImageChange}
            />
          </div>
            <button onClick={handleCreatePost}>Luo ilmoitus</button>
          </div>
        )}
          <ul>
            {futureEvents.map(event => (
              <li key={event.id}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                {event.imageUrl && <img src={event.imageUrl} alt="Event" />}
                {/* Add edit and delete buttons only if user is logged in */}
                {user && (
                  <div>
                    <button onClick={() => handleEditPost(event.id)}>Muokkaa</button>
                    <button onClick={() => handleDeletePost(event.id)}>Poista</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;