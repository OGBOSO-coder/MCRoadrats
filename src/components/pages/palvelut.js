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
      console.error(`Error fetching ${type} posts: `, error);
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
    } catch (error) {
      console.error(`Error adding new ${type} post: `, error);
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
    } catch (error) {
      console.error(`Error editing ${type} post: `, error);
    }
  };

  const handleDeletePost = async (id, type) => {
    try {
      await deleteDoc(doc(db, type, id));
      setPosts(prevPosts => ({
        ...prevPosts,
        [type.toLowerCase()]: prevPosts[type.toLowerCase()].filter(post => post.id !== id)
      }));
    } catch (error) {
      console.error(`Error deleting ${type} post: `, error);
    }
  };

  const renderPostForm = (type) => (
    <form onSubmit={(e) => handleAddPost(e, type)}>
      <textarea
        value={newPost.text}
        onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
        placeholder='Enter your post here...'
      />
      <input
        type='text'
        value={newPost.url}
        onChange={(e) => setNewPost({ ...newPost, url: e.target.value })}
        placeholder='Enter URL (optional)'
      />
      <button type='submit'>Add Post</button>
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
              placeholder='Enter URL (optional)'
            />
            <button onClick={() => handleEditPost(type)}>Save</button>
          </div>
        ) : (
          <div>
            <p>{post.text} {post.url && <a href={post.url} target='_blank' rel='noopener noreferrer'>{post.url}</a>}</p>
            {user && (
              <>
                <button onClick={() => setEditingPost({ id: post.id, type, text: post.text, url: post.url || '' })}>Edit</button>
                <button onClick={() => handleDeletePost(post.id, type)}>Delete</button>
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
        {user && <h3>Hello, {user.email}</h3>}
        <p className='equipment1-description'>
          <ul>{renderPosts('Palvelut')}</ul>
        </p>

        {user && renderPostForm('Palvelut')}

        <div className='equipment-images'>
          <div className='equipment-image'>
            <img src='/images/pc3.jpg' alt='Equipment 1' />
            <p className='image-caption'>Dyno jet PowerCommander</p>
          </div>
          <div className='equipment-image'>
            <img src='/images/injection adjust.jpg' alt='Equipment 2' />
            <p className='image-caption'>Suzuki injection adjuster. fit's on:
              Suzuki
              GSX/R 600, 01-
              SV 650, 03-
              GSX/R 750, 98-99
              GSX/R 750, 01-
              GSX/R 1000, 01-
              SV 1000, 03-
              TL 1000 S, 97-01
              TL 1000 R, 98-03
              DL 1000 VStrom, 02-
              GSX 1300 R Hayabusa, 99-
              GSX 1400, 01-
            </p>
          </div>
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
                      <img class="palvelut-gallery-image" src={event.imageUrl}/>
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