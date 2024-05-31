import React, { useState, useEffect } from 'react';
import "../History.css"
import Footer from '../Footer';
import { db, auth, storage } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const EditForm = () => {
  const [image, setImage] = useState(null);
  const [futureEvents, setFutureEvents] = useState([]);
  const [user, setUser] = useState(null);

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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Fetch posts from Firestore collection 'Rottaralli-kuvat'
      const postCollection = collection(db, 'historia-kuvat');
      const snapshot = await getDocs(postCollection);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      delete postsData[0]
      setFutureEvents(postsData);
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
        const storageRef = ref(storage, `historiakuvat/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'historia-kuvat'), {
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (confirmed) {
      try {
        // Delete the post document from Firestore collection 'posts'
        await deleteDoc(doc(db, 'historia-kuvat', postId));
        alert('Post deleted successfully!');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  return (
    <div>
      <div className='history-div'>
        <h1 className='history-title'>Mc Roadrats historia</h1>
        <p className='history-text'>
          Kerho perustettiin toukokuussa 1987 ja nimeksi silloin annettiin Mikkelin Matkamoottoripyöräilijät (MMP). Ajatuksena oli saada Mikkelin seudun motoristit aktiivisen ja yhdistävän toiminnan piiriin. Jo seuraavana vuonna kerhon jäsenmäärä saavutti nykyisen noin 100 jäsenen tason. MMP toimi ensimmäiset vuodet Saksalan kaupunginosan toimintakeskuksessa. Tilojen vapaassa käytössä ilmeni kuitenkin tiettyjä rajoituksia, joten kerhon aktivistit alkoivat etsiä uusia ja suurempia kerhotiloja toiminnan kasvaessa. Mahdollista muuttoa edesauttoi kerhon taloudellisen tilanteen parantuminen Rottarallista saatujen tulojen myötä. Tämä jo legendaariseksi muodostunut kokoontumisajo pidettiin ensimmäisen kerran 1990.
        </p>
        <p className='history-text'>
          Seuraavat kerhotilat löytyivät Pursialan teollisuusalueelta, kun kaupungilta vapautui vanha kasvihuoneiden huoltorakennus. Näihin tiloihin päästiin muuttamaan marraskuussa 1993. Kerhon nimeksi vaihdettiin Mc Road Rats. Siitä alkoi innokas tilojen kunnostus moottoripyöräkerholle sopivaksi. Yläkertaan rakennettiin baari, konttori, keittokomero, sauna sosiaalitiloineen ja yöpymistilat uupuneille motoristeille. Yläkerrassa oli myös kylmä säilytystila Rottarallin kalusteille. Alakertaan remontoitiin huolto-, pesu-, maalaus- ja säilytystilat.
        </p>
        <p className='history-text'>
          Nykyisiin tiloihimme muutimme 14.5.2005. Kerhomme osti oman hallin, jota on rakenneltu toimintaamme sopivaksi. Kerholla on hyvät talvisäilytys ja huoltotilat. Jäsenistömme viihtyvyyteen on panostettu yläkerran oleskelutiloissa, joita laajensimme 2009. Hankimme kiinteistömme takapihalla olevan varastorakennuksen, jota olemme kunnostaneet vuosien varrella. Kerhotiloissa järjestetään vuosittain useita siivous- ja remontointitalkoita. Omassa baarissa vietetään pikkujoulut ja satunnaisesti spontaaneja juhlia. Ajokauden aloitus- ja lopetusbailut on juhlittu milloin missäkin. Pakollinen traditio on tietenkin Helsingin moottoripyöränäyttely. Yhteislähtöjä järjestetään joihinkin kokoontumisiin ja osa porukasta reissaa yhdessä ympäri Eurooppaa.
        </p>
        <p className='history-text'>
          Rottarallin järjestäminen on tärkein yhteinen vuosittainen tapahtumamme, jonka avulla mahdollistamme yhdistyksemme toiminnan.
        </p>
      </div>

      <center>
        <h1>Kuvia MCRoadrats</h1>
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
        <div className='history-image-slider-div'>
          {futureEvents.map(event => (
            <div class="gallery">
              <div class="history-image-container">
                <a target="_blank" href={event.imageUrl}>
                  <img class="history-gallery-image" src={event.imageUrl} />
                </a>
              </div>

              {user && (
                <button class="history-img-button" onClick={() => handleDeletePost(event.id)}>Poista</button>
              )}
            </div>

          ))}
        </div>
      </center>
    </div>
  );
};

const History = () => {
  return (
    <div>
      <EditForm />
      <Footer />
    </div>
  );
};

export default History;
