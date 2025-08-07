import React from 'react';
import { Container, Button } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import bannerImg from '../assets/img4.jpeg';
import SiteNavbar from './SiteNavbar';
import Footer from './Footer';
import '../App.css';
// import ProductCard from './ProductCard';

import CategoryCards from '../pages/CategoryCards';
// import OurProducts from '../pages/OurProducts';
import ProductSlider from '../pages/ProductSlider';
//import About from '../pages/About';

const Banner = () => {
  return (
    <>
      <SiteNavbar />

      <div
        className="banner-section d-flex align-items-center justify-content-center text-white "
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '600px',
          position: 'relative',
          boxShadow: 'inset 0 -10px 25px rgba(0,0,0,0.6)',
        }}
      >
        <Container className="text-center" style={{ zIndex: 2 }}>
          <motion.h1
            className="fw-bold display-3 text-glow"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Celebrate Diwali with Stunning Lights
          </motion.h1>

          <motion.p
            className="lead fs-5 text-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            Brighten your home with festive sparkle and joy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              variant="warning"
              href="/shop"
              className="custom-hover sharp-btn mt-3"
            >
              Shop Now
            </Button>
          </motion.div>
        </Container>
      </div> 

      <ProductSlider/>
     < CategoryCards/>
{/* <ProductCard/> */}
{/* <OurProducts/> */}
{/* <About/> */}
      <Footer />
    </>
  );
};

export default Banner;
