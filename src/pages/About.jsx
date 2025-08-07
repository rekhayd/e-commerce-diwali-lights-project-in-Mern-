



import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

  import ImageOne from '../assets/office9.jpeg';
 import ImageTwo from '../assets/gift9.jpeg';
import '../styles/AboutSection.css';
const AboutSection = () => {
  return (
    <Container className="py-5" style={{ height: '600px' }}>
      <motion.h1
        className="text-center mb-5"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Our Lights
      </motion.h1>

      <Row className="align-items-center">
        <Col md={6}>
          <motion.div
            className="hover-image-wrapper card-effect"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={ImageOne}
              alt="Office"
              className="hover-image img-one"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            <motion.img
              src={ImageTwo}
              alt="Gift"
              className="hover-image img-two"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </Col>

        <Col md={6}>
          <motion.div
            className="P"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* <Card className="p-4 shadow card-effect " style={{marginTop:'300px' }}> */}
              {/* <Card.Text> */} 
              <div className='p'style={{marginTop:'300px' }}>
                We specialize in decorative lighting that brings life to your dream home,
                office, and festive celebrations. Hover over the image to explore the transformation!
              {/* </Card.Text> */}
              </div>
            {/* </Card> */}
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutSection;
