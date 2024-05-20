import React, { useState, useEffect } from 'react';
import '../../App.css';
import { db, auth, storage } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

function Services() {
  const [futureEvents, setFutureEvents] = useState([]);
  const [Honored, setHonored] = useState([]);
  const [Gone, setGone] = useState([]);
  const [user, setUser] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [image, setImage] = useState(null);
  const [postDescription, setPostDescription] = useState('');

  const fetchEvents = async () => {
    try {
      // Fetch posts from Firestore collection 'posts'
      const postCollection = collection(db, 'members');
      const snapshot = await getDocs(postCollection);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const honoredCollection = collection(db, 'honored-members');
      const snapshot1 = await getDocs(honoredCollection);
      const honordData = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const goneCollection = collection(db, 'Gonemember');
      const snapshot2 = await getDocs(goneCollection);
      const goneData = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setFutureEvents(postsData);
      setHonored(honordData);
      setGone(goneData);
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
  
      await addDoc(collection(db, 'members'), {
        name: postTitle,
        description: postDescription,
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  const handleCreatePost1 = async () => {
    try {
      let imageUrl = ''; // Initialize imageUrl to empty string
  
      // Check if an image is provided
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      await addDoc(collection(db, 'honored-members'), {
        name: postTitle,
        description: postDescription,
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  const handleCreatePost3 = async () => {
    try {
      let imageUrl = ''; // Initialize imageUrl to empty string
  
      // Check if an image is provided
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      await addDoc(collection(db, 'Gonemember'), {
        name: postTitle,
        description: postDescription,
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
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
  
      // Update the post document in Firestore collection 'posts'
      await updateDoc(doc(db, 'members', postId), {
        name: postTitle,
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
      await deleteDoc(doc(db, 'members', postId));
      alert('Post deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  const handleDeletePost1 = async (postId) => {
    try {
      // Delete the post document from Firestore collection 'posts'
      await deleteDoc(doc(db, 'honored-members', postId));
      alert('Post deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  const handleDeletePost2 = async (postId) => {
    try {
      // Delete the post document from Firestore collection 'posts'
      await deleteDoc(doc(db, 'Gonemember', postId));
      alert('Post deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
  return (
    <div className='services-container'>
              {user && <h3>Kirjautunut, {user.email}</h3>} {/* Display hello (logged user) */}
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
          </div>
            <button onClick={handleCreatePost}>Hallitus</button>
            <button onClick={handleCreatePost1}>Honored</button>
            <button onClick={handleCreatePost3}>Gone</button>
          </div>
        )}
          <h1 className='services-title'>Hallitus</h1>
    <div className='services-grid'>
      {/* Map over futureEvents to render service boxes */}
      {futureEvents
  .slice() // Create a copy of the array to avoid mutating the original array
  .reverse() // Reverse the order of the array
  .map(event => (
    <div key={event.id} className='service'>
      <h2 className='service-title'>{event.name}</h2>
      <p className='service-description'>{event.description}</p>
      {user && (
        <div>
          <button onClick={() => handleEditPost(event.id)}>Muokkaa</button>
          <button onClick={() => handleDeletePost(event.id)}>Poista</button>
        </div>
      )}
    </div>
  ))}

    </div>
      <div className='members-container'>
        <div className='members-section'>
          <h2 className='members-section-title'>Honored Members</h2>
          {Honored
  .slice() // Create a copy of the array to avoid mutating the original array
  .reverse() // Reverse the order of the array
  .map(event => (
    <div key={event.id} className=''>
      <p className=''>{event.name}</p>
      {user && (
        <div>
          <button onClick={() => (event.id)}>Muokkaa</button>
          <button onClick={() => handleDeletePost1(event.id)}>Poista</button>
        </div>
      )}
    </div>
  ))}
          <p>Kimmo Saranen, Kunniapuheenjohtaja (Honorary President, Life Member)</p>
          <p>Tede Fehrmann, Kunniajäsen (Life  Member)</p>
          <p>Marko Siiskonen, Kunniajäsen (Life Member)</p>
          <p>Arto Alatalo, Kunniajäsen (Life Member)</p>
          <p>Hannu Haajanen, Kunniajäsen (Life Member)</p>
          <p>Ilkka Husu, Kunniajäsen (Life Member)</p>
        </div>
        <div className='members-section'>
          <h2 className='members-section-title'>Gone But Never Forgotten</h2>
          {Gone
  .slice() // Create a copy of the array to avoid mutating the original array
  .reverse() // Reverse the order of the array
  .map(event => (
    <div key={event.id} className=''>
      <p className=''>{event.name}</p>
      {user && (
        <div>
          <button onClick={() => (event.id)}>Muokkaa</button>
          <button onClick={() => handleDeletePost2(event.id)}>Poista</button>
        </div>
      )}
    </div>
  ))}
          <p>Seppo, Kunniajäsen (Honorary Member)</p>
          <p>Antti, Kunniajäsen (Honorary Member)</p>
          <p>Tapsa</p>
          <p>Kaisa</p>
          <p>Ari</p>
          <p>Pekka</p>
          <p>Pasi</p>
        </div>
      </div>
        <center>
          <div class='ryhmäkuva'>
            <img src='/images/g' class='' />
            <p className='image-caption'>ryhmäkuva</p>
          </div>
        </center>

    </div>
  );
}

export default Services;