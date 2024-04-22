import React from 'react';
import "../Rottaralli.css"
import Footer from '../Footer';

const Ralli = () => {


  return (

    <div>
      <div class='ralli-div'>
        <h1 class='ralli-title'>Rottaralli</h1>
        <p className='ralli-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis magna libero, placerat non sapien non,
          suscipit scelerisque urna. Donec et velit non felis gravida posuere ac nec magna. Donec mauris risus,
          mollis at iaculis vel, suscipit sed massa. Morbi a congue eros, vitae condimentum dolor. Orci varius
          natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus euismod risus
          id risus malesuada, non lacinia magna sodales. Vivamus purus est, viverra vitae est vel, accumsan
          sodales ex. Nunc at maximus nisi, nec ultrices metus.
          Donec rhoncus velit eu metus auctor, vitae facilisis sapien sagittis. Duis et eros magna. Etiam ac semper
          quam. Integer eu orci bibendum nisl lobortis bibendum ac vel magna. Maecenas suscipit tempor fermentum.
          Vestibulum facilisis dui eget dui vulputate facilisis. Aenean vitae massa a nisi tincidunt tristique.
        </p>
      </div>
      <img src='/images/img-9.jpg' alt="img-9" className="ralli-image" />
      <div className="facebook-feed">
        <div class="fb-page" data-href="https://www.facebook.com/mcroadrats/?locale=fi_FI" data-tabs="timeline" data-width="500" data-height="" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
          <blockquote cite="https://www.facebook.com/mcroadrats/?locale=fi_FI" class="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/mcroadrats/?locale=fi_FI">MC Road Rats ry
            </a>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

const Rottaralli = () => {
  return (
    <div>
      <Ralli />
      <Footer />
    </div>
  );
};

export default Rottaralli;