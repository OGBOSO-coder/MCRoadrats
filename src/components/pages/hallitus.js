import React, { useState, useEffect } from 'react';
import '../../App.css';
import "../Hallitus.css";
import { db, auth, storage } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

function Services() {
  const [futureEvents, setFutureEvents] = useState([]);
  const [Honored, setHonored] = useState([]);
  const [Gone, setGone] = useState([]);
  const [user, setUser] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagesFromDatabase, setimagesFromDatabase] = useState([]);
  const [postDescription, setPostDescription] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingSection, setEditingSection] = useState('');

  const fetchEvents = async () => {
    try {
      const postCollection = collection(db, 'members');
      const honoredCollection = collection(db, 'honored-members');
      const goneCollection = collection(db, 'Gonemember');
      const imageCollection = collection(db, 'hallitus-kuvat');

      const postQuery = query(postCollection, orderBy('createdAt', 'asc'));
      const honoredQuery = query(honoredCollection, orderBy('createdAt', 'asc'));
      const goneQuery = query(goneCollection, orderBy('createdAt', 'asc'));

      const snapshot = await getDocs(postQuery);
      const snapshot1 = await getDocs(honoredQuery);
      const snapshot2 = await getDocs(goneQuery);
      const imagesnapshot = await getDocs(imageCollection);

      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const honordData = snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const goneData = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const imageData = imagesnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      delete imageData[0]
      setimagesFromDatabase(imageData);

      setFutureEvents(postsData);
      setHonored(honordData);
      setGone(goneData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreatePost = async () => {
    if (!postTitle && !postDescription) {
      alert('All input fields are empty');
      return;
    }
  
    try {
      let imageUrl = '';

      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'members'), {
        name: postTitle,
        description: postDescription,
        createdAt: new Date(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleCreatePost1 = async () => {
    if (!postTitle && !postDescription) {
      alert('All input fields are empty');
      return;
    }
  
    try {
      let imageUrl = '';

      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'honored-members'), {
        name: postTitle,
        description: postDescription,
        createdAt: new Date(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleCreatePost3 = async () => {
    if (!postTitle && !postDescription) {
      alert('All input fields are empty');
      return;
    }
  
    try {
      let imageUrl = '';

      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'Gonemember'), {
        name: postTitle,
        description: postDescription,
        createdAt: new Date(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      setPostTitle('');
      setPostDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleEditPost = (post, section) => {
    setEditingPostId(post.id);
    setEditingTitle(post.name);
    setEditingDescription(post.description);
    setEditingSection(section);
  };

  const handleUpdatePost = async () => {
    if (!editingPostId) return;

    try {
      let imageUrl = '';

      await updateDoc(doc(db, 'members', editingPostId), {
        name: editingTitle,
        description: editingDescription,
        imageUrl: imageUrl,
      });
      alert('Post updated successfully!');
      setEditingPostId(null);
      setEditingTitle('');
      setEditingDescription('');
      setEditingSection('');
      fetchEvents();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleUpdatePost1 = async () => {
    if (!editingPostId) return;

    try {
      let imageUrl = '';

      await updateDoc(doc(db, 'honored-members', editingPostId), {
        name: editingTitle,
        imageUrl: imageUrl,
      });
      alert('Post updated successfully!');
      setEditingPostId(null);
      setEditingTitle('');
      setEditingSection('');
      fetchEvents();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleUpdatePost2 = async () => {
    if (!editingPostId) return;

    try {
      let imageUrl = '';

      await updateDoc(doc(db, 'Gonemember', editingPostId), {
        name: editingTitle,
        imageUrl: imageUrl,
      });
      alert('Post updated successfully!');
      setEditingPostId(null);
      setEditingTitle('');
      setEditingSection('');
      fetchEvents();
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await deleteDoc(doc(db, 'members', postId));
        alert('Post deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const handleDeletePost1 = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await deleteDoc(doc(db, 'honored-members', postId));
        alert('Post deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const handleDeletePost2 = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await deleteDoc(doc(db, 'Gonemember', postId));
        alert('Post deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const handleImageUpload = async () => {
    try {
      let imageUrl = '';

      if (image) {
        const storageRef = ref(storage, `hallituskuvat/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'hallitus-kuvat'), {
        createdAt: new Date(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDeleteImage = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await deleteDoc(doc(db, 'hallitus-kuvat', postId));
        alert('Post deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingTitle('');
    setEditingDescription('');
    setEditingSection('');
  };

  return (
    <div className='services-container'>
      {user && <h3>Kirjautunut, {user.email}</h3>}
      {user && (
        <div>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Nimi"
          />
          <textarea
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            placeholder="Tiedot (hallitus)"
          ></textarea>
          <div>
            <button onClick={handleCreatePost}>Hallitus</button>
            <button onClick={handleCreatePost1}>Honored</button>
            <button onClick={handleCreatePost3}>Gone</button>
          </div>
        </div>
      )}
      <h1 className='services-title'>Hallitus</h1>
      <div className='services-grid'>
        {futureEvents.map(event => (
          <div key={event.id} className='service'>
            {editingPostId === event.id && editingSection === 'Hallitus' ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="Nimi"
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Tiedot"
                ></textarea>
                <button onClick={handleUpdatePost}>Päivitä</button>
                <button onClick={handleCancelEdit}>Peruuta</button>
              </>
            ) : (
              <>
                <h2 className='service-title'>{event.name}</h2>
                <p className='service-description'>{event.description}</p>
                {user && (
                  <div>
                    <button onClick={() => handleEditPost(event, 'Hallitus')}>Muokkaa</button>
                    <button onClick={() => handleDeletePost(event.id)}>Poista</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className='members-container'>
        <div className='members-section'>
          <h2 className='members-section-title'>Honored Members</h2>
          {Honored.map(event => (
            <div key={event.id}>
              {editingPostId === event.id && editingSection === 'Honored' ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="Nimi"
                  />
                  <button onClick={handleUpdatePost1}>Päivitä</button>
                  <button onClick={handleCancelEdit}>Peruuta</button>
                </>
              ) : (
                <>
                  <p>{event.name}</p>
                  {user && (
                    <div>
                      <button onClick={() => handleEditPost(event, 'Honored')}>Muokkaa</button>
                      <button onClick={() => handleDeletePost1(event.id)}>Poista</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className='members-section'>
          <h2 className='members-section-title'>Gone But Never Forgotten</h2>
          {Gone.map(event => (
            <div key={event.id}>
              {editingPostId === event.id && editingSection === 'Gone' ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    placeholder="Edit Title"
                  />
                  <button onClick={handleUpdatePost2}>Update</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{event.name}</p>
                  {user && (
                    <div>
                      <button onClick={() => handleEditPost(event, 'Gone')}>Muokkaa</button>
                      <button onClick={() => handleDeletePost2(event.id)}>Poista</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <center>
        {user && (
          <div>
            <h1>Lisää kuva:</h1>
            <div className="hallitus-image-upload">
              <input type="file" onChange={handleImageChange} />
              <button onClick={handleImageUpload}>Lisää kuva</button>
            </div>
          </div>
        )}
        <div className='hallitus-image-slider-div'>
          {imagesFromDatabase.map(event => (
            <div class="gallery">
              <div class="hallitus-image-container">
                <a target="_blank" href={event.imageUrl}>
                  <img class="hallitus-gallery-image" src={event.imageUrl} />
                </a>
              </div>
              {user && (
                <button class="hallitus-img-button" onClick={() => handleDeleteImage(event.id)}>Poista</button>
              )}
            </div>
          ))}
        </div>
      </center>
    </div>
  );
}

export default Services;
