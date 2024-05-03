import React, { useEffect } from 'react';
import "../Rottaralli.css"
import Footer from '../Footer';

const Ralli = () => {
  useEffect(() => {
    // Load Facebook SDK asynchronously
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 'your-app-id',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v11.0'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  useEffect(() => {
    // Trigger rendering of Facebook feed after SDK is loaded
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div class="sivut" >
      <div class='ralli-header'>
        <h1>Rottaralli 2024</h1>
        <center>
          <div class='rottaralli-logo-div'>
            <img src='/images/rottaralli_logo.png' class='rottaralli-logo-img' />
          </div>
        </center>
      </div>

      <div className='ralli-info'>
        <div class='ralli-div'>
          <h1 class='ralli-title'>Rottaralli 2024 tiedotteita</h1>
          <p className='ralli-text'>
            Motoristien mekka - Rottaralli järjestetään Heimarissa 26.-28.7.2024
            Siimahännät 🐀🐁 painaa rallimeiningit jälkeen kohdalleen rallikansalle 🛵🏍️🦽 Ennakkoliput ja majoitukset avautuvat viimevuotiseen tapaan myyntiin nettilipun kautta. Pientä porkkanaa 🥕 ja tietenkin paljon lihaa 🍖 luiden ympärille 🔥
            Let’s make Rottaralli again! Tuunaa prätkäsi ja stay tuned 💣
            #rottaralli #mcroadrats #mpkokoontumisajot #international
            #bikeevent #bikerally #finland
          </p>
          <h2>Aluekuva ilmasta</h2>
          <img src='/images/aluekuva.jpg' alt="aluekuva" className="ralli-image" />
        </div>
        <div class='ralli-lippuja'>
          <div class='ralli-lippu-div'>
            <h1>Lipun osto</h1>
            <button>Osta</button>
          </div>
          <div class='ralli-lippu-div'>
            <h1>Hotellin Majoitukset</h1>
            <button>Lisätietoja</button>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ralli;