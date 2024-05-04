import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import { db, auth, storage } from '../firebase'; // Import your Firebase database
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Import Firebase Storage functions
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions

function Home() {
  const [futureEvents, setFutureEvents] = useState([]); // State to hold future events
  const [user, setUser] = useState(null); // Placeholder for user state
  const [postTitle, setPostTitle] = useState(''); // State for post title
  const [image, setImage] = useState(null); // State to store selected image file
  const [postDescription, setPostDescription] = useState(''); // State for post description

  const fetchEvents = async () => {
    try {
      // Fetch posts from Firestore collection 'posts'
      const postCollection = collection(db, 'posts');
      const snapshot = await getDocs(postCollection);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    fetchEvents(); // Call fetchEvents function when component mounts
  }, []); // Empty dependency array to run only once when component mounts

  const handleCreatePost = async () => {
    try {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      // Create a new post document in Firestore collection 'posts'
      await addDoc(collection(db, 'posts'), {
        title: postTitle,
        description: postDescription,
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
      });
      alert('Post created successfully!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents(); // Fetch posts again to update the list after creating a new post
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleEditPost = async (postId) => {
    try {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      // Update the post document in Firestore collection 'posts'
      await updateDoc(doc(db, 'posts', postId), {
        title: postTitle,
        description: postDescription,
        imageUrl: imageUrl,
      });
      alert('Post updated successfully!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents(); // Fetch posts again to update the list after editing a post
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Delete the post document from Firestore collection 'posts'
      await deleteDoc(doc(db, 'posts', postId));
      alert('Post deleted successfully!');
      fetchEvents(); // Fetch posts again to update the list after deleting a post
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div>
      <div className='frontpage-container'>
        {user && <h3>Hello, {user.email}</h3>} {/* Display hello (logged user) */}
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
            <button onClick={handleCreatePost}>Create Post</button>
          </div>
        )}
          <ul>
            {futureEvents.map(event => (
              <li key={event.id}>
                <h3>{event.title}</h3>
                <p>Description: {event.description}</p>
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
