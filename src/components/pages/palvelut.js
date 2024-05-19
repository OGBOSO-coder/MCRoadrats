import React, { useState, useEffect } from 'react';
import '../../App.css';
import Footer from '../Footer';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

const Products = () => {
  const [user, setUser] = useState(null);
  const [eventInfo, setEventInfo] = useState('');
  const [newPost, setNewPost] = useState({ text: '', url: '' });
  const [posts, setPosts] = useState({ palvelut: [], kalusto: [] });
  const [editingPost, setEditingPost] = useState({ id: null, type: '', text: '', url: '' });

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

  return (
    <div className=''>
      <div className='equipment-container'>
        <h1 className='equipment-title'>Palvelut</h1>
        {user && <h3>Hello, {user.email}</h3>}
        <p className='palvelut-text'>
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
          <h2>Kalusto</h2>
          <ul>{renderPosts('Kalusto')}</ul>
          {user && renderPostForm('Kalusto')}
        </div>

        <p className='equipment-description'>Muutamia mitattuja moottoripyöriä.</p>
        <div className='tulokset'>
          <div className='tulokset'>
            <a href='/images/GSXR1100N.jpg' target='_blank' rel='noopener noreferrer'>
              <img src='/images/GSXR1100N.jpg' alt='GSXR1100N' />
            </a>
          </div>
          <div className='tulokset'>
            <a href='/images/CBR900RR.jpg' target='_blank' rel='noopener noreferrer'>
              <img src='/images/CBR900RR.jpg' alt='CBR900RR' />
            </a>
          </div>
          <div className='tulokset'>
            <a href='/images/Bandit1200[1].jpg' target='_blank' rel='noopener noreferrer'>
              <img src='/images/Bandit1200[1].jpg' alt='Bandit1200[1]' />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Products;