import React, { useState, useEffect } from 'react';
import "../History.css"
import Footer from '../Footer';
import ImageSlider from '../ImageSlider';
import { db, auth, storage } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

const images = ["images/img-6.jpg", "images/img-7.jpg", "images/img-8.jpg", "images/img-9.jpg"]

// Components 

const EditForm = () => {
  const [image, setImage] = useState(null);
  const [futureEvents, setFutureEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      // Fetch posts from Firestore collection 'posts'
      const postCollection = collection(db, 'posts');
      const snapshot = await getDocs(postCollection);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        const storageRef = ref(storage, `rotrallikuvat/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      await addDoc(collection(db, 'Rottaralli-kuvat'), {
        date: new Date().toLocaleDateString(),
        imageUrl: imageUrl,
      });
      alert('tapahtuma luotu!');
      fetchEvents();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      <div className='history-div'>
        <h1 className='history-title'>Mc Roadrats Historia</h1>
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
      <h1>Lisää kuva:</h1>
      <div className="history-image-upload">
          <input
            type="file"
            onChange={handleImageChange}
          />
          <button onClick={handleImageUpload}>Lisää kuva</button>
        </div>
      
        <div className='history-image-slider-div'>
          <ImageSlider imageUrls={images} />
        </div>
      </center>
    </div>
  )
}

const History = () => {
  return (
    <div>
      <EditForm />
      <Footer />
    </div>
  );
};

export default History;