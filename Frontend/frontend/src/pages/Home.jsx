import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/home.css';
import homeImage from '../assets/home1.jpg';

function Home() {
  return (
    <div  className='home-page'>
      <Navbar />
      <div className="home-banner" style={{ backgroundImage: `url(${homeImage})` }}>
        <div className="home-banner-text">
          <h1>Find It Local</h1>
          <p>May be It is Near You</p>
        </div>
      </div>
      <main>
        <p>This is a simple home page after login/signup.</p>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
