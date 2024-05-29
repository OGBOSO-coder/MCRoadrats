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
  const [postDescription, setPostDescription] = useState('');
  const [image, setImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Fetch posts from Firestore collection 'posts' and order by 'createdAt' in ascending order
      const postCollection = collection(db, 'posts');
      const q = query(postCollection, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const honoredCollection = collection(db, 'Etusivu');
      const snapshot1 = await getDocs(honoredCollection);
      const honoredData = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setHonored(honoredData);
      setFutureEvents(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const handleImageChange = (e, setImageFn) => {
    if (e.target.files[0]) {
      setImageFn(e.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
     // Check if all input fields are empty
    if (!postTitle.trim() && !postDescription.trim() && !image) {
      alert('All input fields are empty');
      return;
    }

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
      setImage(null);
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleEditPost = async () => {
    const postToEdit = futureEvents.find(post => post.id === editingPostId);
    if (!postToEdit) return;

    try {
      let newImageUrl = postToEdit.imageUrl;  // Initialize imageUrl to empty string
      if (editImage) {
        const storageRef = ref(storage, `images/${editImage.name}`);
        await uploadBytes(storageRef, editImage);
        newImageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, 'posts', editingPostId), {
        title: editTitle,
        description: editDescription,
        imageUrl: newImageUrl,
      });

      alert('Post updated successfully!');
      setEditingPostId(null);
      setEditTitle('');
      setEditDescription('');
      setEditImage(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        alert('Post deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const startEditingPost = (post) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditTitle('');
    setEditDescription('');
    setEditImage(null);
  };

  return (
    <div>
      <div className='frontpage-container'>
        {user && <h3>Kirjautunut, {user.email}</h3>}
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
                  onChange={(e) => handleImageChange(e, setImage)}
                />
              </div>
              <button onClick={handleCreatePost}>Luo ilmoitus</button>
            </div>
          )}
          <ul>
            {futureEvents.map(event => (
              <li key={event.id}>
                {editingPostId === event.id ? (
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Post Title"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Post Description"
                    ></textarea>
                    <div>
                      <label>Image</label>
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, setEditImage)}
                      />
                    </div>
                    <button onClick={handleEditPost}>Save Changes</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    {event.imageUrl && <img src={event.imageUrl} alt="Event" />}
                    {user && (
                      <div>
                        <button onClick={() => startEditingPost(event)}>Edit</button>
                        <button onClick={() => handleDeletePost(event.id)}>Delete</button>
                      </div>
                    )}
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