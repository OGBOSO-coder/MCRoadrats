import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const SignupAndLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedImage, setEditedImage] = useState(null);

  // Function to fetch posts from Firestore
  const fetchPosts = async () => {
    const postCollection = collection(db, 'posts');
    const snapshot = await getDocs(postCollection);
    const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postList);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchPosts();
    }
  }, [loggedIn]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
      setEmail('');
      setPassword('');
      setLoggedIn(true);
      alert('Käyttäjä luotu!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      setEmail('');
      setPassword('');
      setLoggedIn(true);
      alert('Tervetuloa!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      alert('Kirjauduit ulos!');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handlePostCreation = async (e) => {
    e.preventDefault();
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);

      // Create a new post document in Firestore collection
      await addDoc(collection(db, 'posts'), {
        title: postTitle,
        description: postDescription,
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
      });
      alert('Tapahtuma luotu!');
      setPostTitle('');
      setPostDescription('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handlePostDeletion = async (postId, imageUrl) => {
    try {
      // Delete the post document from Firestore
      await deleteDoc(doc(db, 'posts', postId));

      // Delete image from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      alert('Post deleted successfully!');
      // Fetch posts again to update the list after deleting a post
      fetchPosts();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleEditPost = (post) => {
    setEditMode(post.id);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
  };

  const handleSaveEdit = async (postId, oldImageUrl) => {
    try {
      if (editedImage) {
        const storageRef = ref(storage, `images/${editedImage.name}`);
        await uploadBytes(storageRef, editedImage);
        const newImageUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, 'posts', postId), {
          title: editedTitle,
          description: editedDescription,
          imageUrl: newImageUrl,
        });

        const oldImageRef = ref(storage, oldImageUrl);
        await deleteObject(oldImageRef);
      } else {
        await updateDoc(doc(db, 'posts', postId), {
          title: editedTitle,
          description: editedDescription,
        });
      }
      setEditMode(null);
      setEditedTitle('');
      setEditedDescription('');
      setEditedImage(null);
      fetchPosts();
      alert('taphtuma muokattu!');
    } catch (error) {
      console.error('Error editing post: ', error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedImage(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Render content after successful login
  if (loggedIn) {
    return (
      <div>
        <h2>Welcome, User!</h2>
        <button onClick={handleLogout}>Logout</button>
        <h3>Create a New Post</h3>
        <form onSubmit={handlePostCreation}>
          <div>
            <label>Titteli</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Selite</label>
            <textarea
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Kuva</label>
            <input
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit">Julkaise</button>
        </form>
        <h3>Posts</h3>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              {editMode === post.id ? (
                <div>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                  <input
                    type="file"
                    onChange={(e) => setEditedImage(e.target.files[0])}
                  />
                  <button onClick={() => handleSaveEdit(post.id, post.imageUrl)}>Tallenna</button>
                  <button onClick={handleCancelEdit}>Peruuta</button>
                </div>
              ) : (
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
                  <button onClick={() => handleEditPost(post)}>Muokkaa</button>
                  <button onClick={() => handlePostDeletion(post.id, post.imageUrl)}>Poista</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Render login/signup form
  return (
    <div>
      <div>
        <h2>{'Login'}</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Salasana</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{'Login'}</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default SignupAndLogin;
