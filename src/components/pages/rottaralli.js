import React, { useState, useEffect } from 'react';
import "../Rottaralli.css"
import Footer from '../Footer';
import { auth, db } from '../firebase'; // Import your Firebase configuration
import { addDoc, collection, getDocs,deleteDoc, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions

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

  const handleImageUpload = async (image) => {

  }
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
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
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

      <div className='ralli-kuvat-div'>
        <h1>Paikan Kuvat</h1>
        {user && (
          <div>
            <h1>Uusi kuva</h1>
            <div className="rotralli-image-upload">
              <input
                type="file"
                onChange={handleImageChange}
              />
              <button onClick={handleImageUpload}>Lisää kuva</button>
            </div>
          </div>
        )}
        
        <div className='rottaralli-kuvat-gallery'>
          <div className='rottaralli-kuva-gallery-container'>
            <img src='/images/img-9.jpg' alt="img-9" className="ralli-image" />
          </div>
          <div className='rottaralli-kuva-gallery-container'>
            <img src='/images/img-7.jpg' alt="img-9" className="ralli-image" />
          </div>
          <div className='rottaralli-kuva-gallery-container'>
            <img src='/images/img-8.jpg' alt="img-9" className="ralli-image" />
          </div>
        </div>
      </div>

      <div className="facebook-feed">
        <div className="fb-page"
          data-href="https://www.facebook.com/p/Rottaralli-100057561793735/"
          data-tabs="timeline"
          data-width="400"
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
