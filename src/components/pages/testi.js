import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db, storage } from '../firebase'; // Import your Firebase configuration
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Import Firebase Storage functions

const SignupAndLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(true); // Default to signup form
  const [loggedIn, setLoggedIn] = useState(false); // Track login state
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [posts, setPosts] = useState([]); // State to store posts
  const [image, setImage] = useState(null); // State to store selected image file
  const [editMode, setEditMode] = useState(null); // State to track the post being edited
  const [editedTitle, setEditedTitle] = useState(''); // State to store edited title
  const [editedDescription, setEditedDescription] = useState(''); // State to store edited description
  const [editedImage, setEditedImage] = useState(null); // State to store edited image file

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      alert('Logged out successfully!');
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
    setEditMode(post.id); // Set the post id to enable edit mode
    setEditedTitle(post.title); // Set the current title in the edit form
    setEditedDescription(post.description); // Set the current description in the edit form
  };

  const handleSaveEdit = async (postId, oldImageUrl) => {
    try {
      if (editedImage) {
        // If a new image is selected, upload it to Firebase Storage
        const storageRef = ref(storage, `images/${editedImage.name}`);
        await uploadBytes(storageRef, editedImage);
        const newImageUrl = await getDownloadURL(storageRef);

        // Update the post document in Firestore with the new image URL
        await updateDoc(doc(db, 'posts', postId), {
          title: editedTitle,
          description: editedDescription,
          imageUrl: newImageUrl,
        });

        // If a new image is uploaded, delete the old image from Storage
        const oldImageRef = ref(storage, oldImageUrl);
        await deleteObject(oldImageRef);
      } else {
        // If no new image is selected, update the post document with existing image URL
        await updateDoc(doc(db, 'posts', postId), {
          title: editedTitle,
          description: editedDescription,
        });
      }
      // Clear edit mode and reset edited states
      setEditMode(null);
      setEditedTitle('');
      setEditedDescription('');
      setEditedImage(null);
      // Fetch posts again to update the list after editing a post
      fetchPosts();
      alert('Post edited successfully!');
    } catch (error) {
      console.error('Error editing post: ', error);
    }
  };

  const handleCancelEdit = () => {
    // Clear edit mode and reset edited states
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
              required
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
                  <button onClick={() => handleSaveEdit(post.id, post.imageUrl)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  {post.imageUrl && <img src={post.imageUrl} alt="Post" />}
                  <button onClick={() => handleEditPost(post)}>Edit</button>
                  <button onClick={() => handlePostDeletion(post.id, post.imageUrl)}>Delete</button>
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
