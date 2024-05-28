import React, { useState, useEffect } from 'react';
import '../../App.css';
import "../Palvelut.css"
import Footer from '../Footer';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const Products = () => {
  const [user, setUser] = useState(null);
  const [eventInfo, setEventInfo] = useState('');
  const [newPost, setNewPost] = useState({ text: '', url: '' });
  const [Honored, setHonored] = useState([]);
  const [posts, setPosts] = useState({ palvelut: [], kalusto: [] });
  const [editingPost, setEditingPost] = useState({ id: null, type: '', text: '', url: '' });

  const [image, setImage] = useState(null)
  const [imagesFromDatabase, setFutureImages] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setUser(user || null));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Palvelut'));
        snapshot.forEach(doc => setEventInfo(doc.data().info));

        const honoredCollection = collection(db, 'Laitekuvat');
        const snapshot1 = await getDocs(honoredCollection);
        const honordData = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setHonored(honordData);
      } catch (error) {
        console.error('Error fetching event info: ', error);
      }
    };

    fetchEventInfo();
  }, []);

  const fetchPosts = async (type) => {
    try {
      const postsCollection = collection(db, type);
      const q = query(postsCollection, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Virhe haettaessa ${type} viestejä: `, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      const [palvelutPosts, kalustoPosts] = await Promise.all([fetchPosts('Palvelut'), fetchPosts('Kalusto')]);
      setPosts({ palvelut: palvelutPosts, kalusto: kalustoPosts });
    };
    fetchAllPosts();
  }, []);

  const handleAddPost = async (e, type) => {
    e.preventDefault();
    const { text, url } = newPost;
    if (!text.trim()) return;

    try {
      const createdAt = new Date();
      const docRef = await addDoc(collection(db, type), { text, url, createdAt });
      setPosts(prevPosts => ({
        ...prevPosts,
        [type.toLowerCase()]: [...prevPosts[type.toLowerCase()], { id: docRef.id, text, url, createdAt }]
      }));
      setNewPost({ text: '', url: '' });
      alert('Post added successfully!');
    } catch (error) {
      console.error(`Virhe lisättäessä uutta ${type} viestiä: `, error);
      alert('Error adding post!');
    }
  };

  const handleEditPost = async (type) => {
    const { id, text, url } = editingPost;
    if (!id) return;

    try {
      await updateDoc(doc(db, type, id), { text, url });
      setPosts(prevPosts => ({
        ...prevPosts,
        [type.toLowerCase()]: prevPosts[type.toLowerCase()].map(post =>
          post.id === id ? { ...post, text, url } : post)
      }));
      setEditingPost({ id: null, type: '', text: '', url: '' });
      alert('Post edited successfully!');
    } catch (error) {
      console.error(`Virhe muokattaessa ${type} viestiä: `, error);
      alert('Error editing post!');
    }
  };

  const handleDeletePost = async (id, type) => {
    try {
      await deleteDoc(doc(db, type, id));
      setPosts(prevPosts => ({
        ...prevPosts,
        [type.toLowerCase()]: prevPosts[type.toLowerCase()].filter(post => post.id !== id)
      }));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error(`Virhe poistettaessa ${type} viestiä: `, error);
      alert('Error deleting post!');
    }
  };

  const renderPostForm = (type) => (
    <form onSubmit={(e) => handleAddPost(e, type)}>
      <textarea
        value={newPost.text}
        onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
        placeholder='Kirjoita ilmoitus tähän...'
      />
      <input
        type='text'
        value={newPost.url}
        onChange={(e) => setNewPost({ ...newPost, url: e.target.value })}
        placeholder='Syötä URL (valinnainen)'
      />
      <button type='submit'>Lisää ilmoitus</button>
    </form>
  );

  const renderPosts = (type) => (
    posts[type.toLowerCase()].map(post => (
      <div key={post.id}>
        {editingPost.id === post.id ? (
          <div>
            <textarea value={editingPost.text} onChange={(e) => setEditingPost({ ...editingPost, text: e.target.value })} />
            <input
              type='text'
              value={editingPost.url}
              onChange={(e) => setEditingPost({ ...editingPost, url: e.target.value })}
              placeholder='Syötä URL (valinnainen)'
            />
            <button onClick={() => handleEditPost(type)}>Tallenna</button>
          </div>
        ) : (
          <div>
            <p>{post.text} {post.url && <a href={post.url} target='_blank' rel='noopener noreferrer'>{post.url}</a>}</p>
            {user && (
              <>
                <button onClick={() => setEditingPost({ id: post.id, type, text: post.text, url: post.url || '' })}>Muokkaa</button>
                <button onClick={() => handleDeletePost(post.id, type)}>Poista</button>
              </>
            )}
          </div>
        )}
      </div>
    ))
  );

  // Image related code

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      // Fetch posts from Firestore collection 'Rottaralli-kuvat'
      const postCollection = collection(db, 'Palvelu-kuvat');
      const snapshot = await getDocs(postCollection);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFutureImages(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    try {
      let imageUrl = ''; // Initialize imageUrl to empty string

      // Check if an image is provided
      if (image) {
        const storageRef = ref(storage, `Palvelu-kuvat/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'Palvelu-kuvat'), {
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      fetchImages();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDeleteImage = async (postId) => {
    try {
      // Delete the post document from Firestore collection 'posts'
      await deleteDoc(doc(db, 'Palvelu-kuvat', postId));
      alert('Post deleted successfully!');
      fetchImages();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className=''>
      <div className='equipment-container'>
        <h1>Moottoripyörien tehonmittaus</h1>
        {user && <h3>Kirjautunut, {user.email}</h3>}
        <p className='equipment1-description'>
          <ul>{renderPosts('Palvelut')}</ul>
        </p>

        {user && renderPostForm('Palvelut')}

        <div className='equipment-images'>
          {Honored.map(event => (
            <div key={event.id}>
              <h2 className='service-title'>{event.text}</h2>
              {event.imageUrl && (
                <div className='equipment-image'>
                  <img className="logo-img" src={event.imageUrl} alt="Rottaralli Logo" />
                  <p className='image-caption'>{event.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='equipment1-description'>
          <h2>Kerhomme kalustoa tapahtumiin</h2>
          <ul>{renderPosts('Kalusto')}</ul>
          {user && renderPostForm('Kalusto')}
        </div>

        <p className='equipment-description'>Muutamia mitattuja moottoripyöriä.</p>

        {user && (
          <div>
            <h1>Lisää kuva:</h1>
            <div className="history-image-upload">
              <input
                type="file"
                onChange={handleImageChange}
              />
              <button onClick={handleImageUpload}>Lisää kuva</button>
            </div>
          </div>
        )}

        <div className='palvelut-image-slider-div'>
          {imagesFromDatabase.map(event => (
            <div class="gallery">
              <div class="palvelut-image-container">
                <a target="_blank" href={event.imageUrl}>
                  <img class="palvelut-gallery-image" src={event.imageUrl} />
                </a>
              </div>
              {user && (
                <button class="palvelut-img-button" onClick={() => handleDeleteImage(event.id)}>Poista</button>
              )}
            </div>

          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Products;
