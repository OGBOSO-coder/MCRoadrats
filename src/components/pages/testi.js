import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import your Firebase configuration
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import Firestore functions

const SignupAndLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(true); // Default to signup form
  const [loggedIn, setLoggedIn] = useState(false); // Track login state
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [posts, setPosts] = useState([]); // State to store posts

  // Function to fetch posts from Firestore
  const fetchPosts = async () => {
    const postCollection = collection(db, 'posts');
    const snapshot = await getDocs(postCollection);
    const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postList);
  };

  useEffect(() => {
    if (loggedIn) {
      // Fetch posts when the user is logged in
      fetchPosts();
    }
  }, [loggedIn]); // Fetch posts when loggedIn state changes

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password); // Create user with email and password
      setError('');
      setEmail('');
      setPassword('');
      setLoggedIn(true); // Set loggedIn state to true after successful signup
      alert('Account created successfully!'); // Optionally, provide feedback to the user
    } catch (error) {
      setError(error.message); // Handle authentication errors
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password); // Sign in with email and password
      setError('');
      setEmail('');
      setPassword('');
      setLoggedIn(true); // Set loggedIn state to true after successful login
      alert('Logged in successfully!'); // Optionally, provide feedback to the user
    } catch (error) {
      setError(error.message); // Handle authentication errors
    }
  };

  const handlePostCreation = async (e) => {
    e.preventDefault();
    try {
      // Create a new post document in Firestore collection
      await addDoc(collection(db, 'posts'), {
        title: postTitle,
        description: postDescription,
        date: new Date().toLocaleDateString()
      });
      alert('Post created successfully!');
      // Optionally, you can clear the input fields after creating the post
      setPostTitle('');
      setPostDescription('');
      // Fetch posts again to update the list after creating a new post
      fetchPosts();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handlePostDeletion = async (postId) => {
    try {
      // Delete the post document from Firestore
      await deleteDoc(doc(db, 'posts', postId));
      alert('Post deleted successfully!');
      // Fetch posts again to update the list after deleting a post
      fetchPosts();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  // Render content after successful login
  if (loggedIn) {
    return (
      <div>
        <h2>Welcome, User!</h2>
        <h3>Create a New Post</h3>
        <form onSubmit={handlePostCreation}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Post</button>
        </form>
        <h3>Posts</h3>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>Date: {post.date}</p>
              <p>Description: {post.description}</p>
              <button onClick={() => handlePostDeletion(post.id)}>Delete</button>
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
        <h2>{isSigningUp ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={isSigningUp ? handleSignup : handleLogin}>
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
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isSigningUp ? 'Sign Up' : 'Login'}</button>
        </form>
        {error && <p>{error}</p>}
      </div>
      <div>
        <button onClick={() => setIsSigningUp(true)}>Register for an account</button>
        <button onClick={() => setIsSigningUp(false)}>Login</button>
      </div>
    </div>
  );
};

export default SignupAndLogin;
