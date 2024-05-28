import React, { useState, useEffect } from 'react';
import "../Rottaralli.css"
import Footer from '../Footer';
import { auth, db, storage } from '../firebase'; // Import your Firebase configuration
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const Ralli = () => {
  const [user, setUser] = useState(null); // Placeholder for user state
  const [eventInfo, setEventInfo] = useState(''); // State to hold the event info text
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [posts, setPosts] = useState([]); // State to hold the posts
  const [editingPost, setEditingPost] = useState({ id: null, title: '', description: '' });
  const [image, setImage] = useState(null); // State to hold Image
  const [imagesFromDatabase, setImagesFromDatabase] = useState([]);
  const [ticketLinks, setTicketLinks] = useState([]);
  const [editingLink, setEditingLink] = useState({ id: null, title: '', url: '', buttonText: '' });
  const [honored, setHonored] = useState([]);

  useEffect(() => {
    // Trigger rendering of Facebook feed after SDK is loaded
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);
  useEffect(() => {
    fetchImages();
    fetchTicketLinks();
  }, []);
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
    const fetchEventInfo = async () => {
      try {
        // Fetch event info from Firebase database
        const eventInfoCollection = collection(db, 'event-info');
        const snapshot = await getDocs(eventInfoCollection);
        snapshot.forEach(doc => {
          setEventInfo(doc.data().info); // Set the event info state with fetched data
        });
      } catch (error) {
        console.error('Error fetching event info: ', error);
      }
    };

    fetchEventInfo(); // Call fetchEventInfo function when component mounts
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch posts from Firebase database under the "event-info" collection
      const postsCollection = collection(db, 'event-info');
      const q = query(postsCollection, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Call fetchPosts function when component mounts or when editing is done
  }, [editingPost.id]); // Add editingPost.id to the dependencies to refetch posts after editing

  const handlePostSubmit = async () => {
    try {
      const createdAt = new Date();
      const docRef = await addDoc(collection(db, 'event-info'), {
        title: postTitle,
        description: postDescription,
        createdAt
      });
      setPosts(prevPosts => [
        ...prevPosts,
        { id: docRef.id, title: postTitle, description: postDescription, createdAt }
      ]);
      setPostTitle(''); // Clear the input fields after submitting
      setPostDescription('');
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding post: ', error);
      alert('Error adding post!');
    }
  };

  const handleEditPost = async () => {
    const { id, title, description } = editingPost;

    try {
      await updateDoc(doc(db, 'event-info', id), {
        title,
        description,
      });
      console.log('Post edited successfully');
      setEditingPost({ id: null, title: '', description: '' }); // Clear the editing state
      fetchPosts(); // Refetch posts after editing
    } catch (error) {
      console.error('Error editing post: ', error);
    }
  };


  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'event-info', postId));
      alert('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  // Ticket Link Control

  const fetchTicketLinks = async () => {
    try {
      const ticketLinksCollection = collection(db, 'ticketLinks');
      const snapshot = await getDocs(ticketLinksCollection);
      const links = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTicketLinks(links);

      const honoredCollection = collection(db, 'Rottaralli-logo');
      const snapshot1 = await getDocs(honoredCollection);
      const honoredData = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHonored(honoredData);
    } catch (error) {
      console.error('Error fetching ticket links:', error);
    }
  };

  const handleLinkEdit = (link) => {
    setEditingLink(link);
  };

  const handleLinkUpdate = async () => {
    const { id, title, url, buttonText } = editingLink;
    if (!id || !url.trim() || !buttonText.trim()) {
      alert('Link URL and Button Text cannot be empty');
      return;
    }

    try {
      await updateDoc(doc(db, 'ticketLinks', id), {
        title,
        url,
        buttonText,
      });
      alert('Link updated successfully!');
      setEditingLink({ id: null, title: '', url: '', buttonText: '' }); // Clear the editing state
      fetchTicketLinks(); // Refetch ticket links after editing
    } catch (error) {
      console.error('Error updating link: ', error);
    }
  };

  // Image Control

  const fetchImages = async () => {
    try {
      // Fetch posts from Firestore collection 'Rottaralli-kuvat'
      const imageCollection = collection(db, 'Rottaralli-kuvat');
      const snapshot = await getDocs(imageCollection);
      const imageData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      delete imageData[0]
      setImagesFromDatabase(imageData);
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
        const storageRef = ref(storage, `rotrallikuvat/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'Rottaralli-kuvat'), {
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
      await deleteDoc(doc(db, 'Rottaralli-kuvat', postId));
      alert('Post deleted successfully!');
      fetchImages();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div className="sivut">
      <div className='ralli-header'>
        {user && <h3>Hello, {user.email}</h3>}
        <center>
          <div className='rottaralli-logo-div'>
            {honored.map(event => (
              <p key={event.id}>
                {event.imageUrl && <img className="logo-img" src={event.imageUrl} alt="Rottaralli Logo" />}
              </p>
            ))}
          </div>
        </center>
      </div>
      <div className='ralli-info'>
        <div className='ralli-div'>
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
              <button onClick={handlePostSubmit}>Add Post</button>
            </div>
          )}
          <div className='ralli-text'>
            <ul>
              {posts.map(post => (
                <div key={post.id}>
                  {editingPost.id === post.id ? (
                    <div>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        placeholder="Edit Title"
                      />
                      <textarea
                        value={editingPost.description}
                        onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
                        placeholder="Edit Description"
                      ></textarea>
                      <button onClick={handleEditPost}>Save</button>
                    </div>
                  ) : (
                    <div>
                      {post.title && <h2 className="ralli-title">{post.title}</h2>}
                      <p>{post.description}</p>
                      {user && (
                        <>
                          <button onClick={() => setEditingPost({ id: post.id, title: post.title, description: post.description })}>Edit</button>
                          <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className='ralli-lippuja'>
          {ticketLinks.map((link, index) => (
            <div className='ralli-lippu-div' key={index}>
              {editingLink.id === link.id ? (
                <div>
                  <input
                    type="text"
                    value={editingLink.title}
                    onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                    placeholder="Edit Title"
                  />
                  <input
                    type="text"
                    value={editingLink.url}
                    onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                    placeholder="Edit URL"
                  />
                  <input
                    type="text"
                    value={editingLink.buttonText}
                    onChange={(e) => setEditingLink({ ...editingLink, buttonText: e.target.value })}
                    placeholder="Edit Button Text"
                  />
                  <button onClick={handleLinkUpdate}>Save</button>
                </div>
              ) : (
                <div>
                  <h1>{link.title}</h1>
                  <button className='button' onClick={() => window.open(link.url, '_blank')} rel='noopener noreferrer'>
                    {link.buttonText}
                  </button>
                  {user && (
                    <div>
                      <button onClick={() => handleLinkEdit(link)}>Edit</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <center>
        <h1>Paikan kuvat</h1>
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

        <div className='rottaralli-image-slider-div'>
          {imagesFromDatabase.map(event => (
            <div class="gallery">
              <div class="rottaralli-image-container">
                <a target="_blank" href={event.imageUrl}>
                  <img class="rottaralli-gallery-image" src={event.imageUrl} />
                </a>
              </div>

              {user && (
                <button class="rottaralli-img-button" onClick={() => handleDeleteImage(event.id)}>Poista</button>
              )}
            </div>

          ))}
        </div>
      </center>

      <div className="facebook-feed">
        <div className="fb-page"
          data-href="https://www.facebook.com/p/Rottaralli-100057561793735/"
          data-tabs="timeline"
          data-width="375"
          data-height=""
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true">
          <blockquote cite="https://www.facebook.com/p/Rottaralli-100057561793735/" className="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/p/Rottaralli-100057561793735/">MC Road Rats ry</a>
          </blockquote>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ralli;
