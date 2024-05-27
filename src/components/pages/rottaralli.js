import React, { useState, useEffect } from 'react';
import "../Rottaralli.css"
import Footer from '../Footer';
import { auth, db, storage } from '../firebase'; // Import your Firebase configuration
import { addDoc, collection, getDocs,deleteDoc, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const Ralli = () => {
  const [user, setUser] = useState(null); // Placeholder for user state
  const [eventInfo, setEventInfo] = useState(''); // State to hold the event info text
  const [postTitle, setPostTitle] = useState('');
  const [Honored, setHonored] = useState([]);
  const [newPost, setNewPost] = useState(''); // State to hold the new post text
  const [postDescription, setPostDescription] = useState('');
  const [posts, setPosts] = useState([]); // State to hold the posts
  const [editingPostId, setEditingPostId] = useState(null); // State to hold the ID of the post being edited
  const [editedPostText, setEditedPostText] = useState(''); // State to hold the edited post text
  const [image, setImage] = useState(null); // State to hold Image
  const [imagesFromDatabase, setImagesFromDatabase] = useState([]);
  const [ticketLinks, setTicketLinks] = useState([]);
  
  useEffect(() => {
    // Trigger rendering of Facebook feed after SDK is loaded
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);
  useEffect(() => {
    const fetchTicketLinks = async () => {
      try {
        const ticketLinksCollection = collection(db, 'ticketLinks');
        const snapshot = await getDocs(ticketLinksCollection);
        const links = snapshot.docs.map(doc => doc.data());
        const honoredCollection = collection(db, 'Rottaralli-logo');
        const snapshot1 = await getDocs(honoredCollection);
        const honordData = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHonored(honordData);
        setTicketLinks(links);
      } catch (error) {
        console.error('Error fetching ticket links:', error);
      }
    };
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
      const snapshot = await getDocs(postsCollection);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Call fetchPosts function when component mounts or when editing is done
  }, [editingPostId]); // Add editingPostId to the dependencies to refetch posts after editing

  const handlePostSubmit = async () => {
    try {
      // Add new post to the "event-info" collection
      const docRef = await addDoc(collection(db, 'event-info'), {
        text: postTitle,
        timestamp: new Date().toISOString(),
      });
      console.log('Post added with ID: ', docRef.id);
      setNewPost(''); // Clear the input field after submitting
      fetchPosts(); // Refetch posts after adding a new post
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  const handleEditPost = async (postId) => {
    try {
      // Update the post in the "event-info" collection
      await updateDoc(doc(db, 'event-info', postId), {
        text: editedPostText,
      });
      console.log('Post edited successfully');
      setEditingPostId(null); // Clear the editing state
      fetchPosts(); // Refetch posts after editing
    } catch (error) {
      console.error('Error editing post: ', error);
    }
  };

  
  const handleDeletePost = async (postId) => {
    try {
      // Delete the post document from Firestore collection 'posts'
      await deleteDoc(doc(db, 'event-info', postId));
      alert('Post deleted successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting document: ', error);
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
        {user && <h3>Hello, {user.email}</h3>} {/* Display hello (logged user) */}
        <center>
        <div className='rottaralli-logo-div'>
          {Honored.map(event => (
            <p key={event.id}>
              {event.imageUrl && <img className="logo-img" src={event.imageUrl} alt="Rottaralli Logo" />}
            </p>
          ))}
        </div>
        </center>
      </div>
      <div className='ralli-info'>
        <div className='ralli-div'>
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
            <button onClick={handlePostSubmit}>Hallitus</button>
          </div>
          <h1 className='ralli-title'>Rottaralli tiedotteita</h1>
          <p className='ralli-text'>
          <ul>
          {posts.map(post => (
            <div key={post.id}>
              {editingPostId === post.id ? (
                <div>
                  <textarea value={editedPostText} onChange={(e) => setEditedPostText(e.target.value)} />
                  <button onClick={() => handleEditPost(post.id)}>Save</button>
                </div>
              ) : (
                <div>
                  <p>{post.text}</p>
                  {user && (
                    <><button onClick={() => {
                        setEditingPostId(post.id);
                        setEditedPostText(post.text);
                      } }>Edit</button><button onClick={() => handleDeletePost(post.id)}>Poista</button></>
                  )}
                </div>
              )}
            </div>
          ))}
        </ul>
          </p> {/* Display event info text */}
        </div>
        <div className='ralli-lippuja'>
          {ticketLinks.map((link, index) => (
            <div className='ralli-lippu-div' key={index}>
              <h1>{link.title}</h1>
              <button className='button' onClick={() => window.open(link.url, '_blank')} rel='noopener noreferrer'>
                {link.buttonText}
              </button>
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
                      <img class="rottaralli-gallery-image" src={event.imageUrl}/>
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
