import React, { useContext, useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { BsCartPlusFill, BsStarFill, BsStarHalf, BsHeart } from 'react-icons/bs';
import { ThemeContext } from '../ThemeContext';
import { useCart } from '../CartContext';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/navigation';
import '../App.css';

const ProductSlider = () => {
  const { darkMode } = useContext(ThemeContext);
  const { addToCart, addToWishlist } = useCart();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(' Failed to fetch products:', err));
  }, []);

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={`full-${i}`} className="text-warning" />);
    }
    if (hasHalf) {
      stars.push(<BsStarHalf key="half" className="text-warning" />);
    }
    return stars;
  };

  return (
    <div className={`py-5 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <h2 className="text-center mb-4">Trending Products</h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        navigation
        autoplay={{ delay: 2500 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product._id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`shadow-sm h-100 border-0 product-card ${
                  darkMode ? 'bg-dark text-light' : 'bg-white text-dark'
                }`}
              >
                <div className="overflow-hidden">
             
<Card.Img src={`http://localhost:5000${product.image}`}
 style={{ height: '200px', objectFit: 'cover' }}/>

                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="mb-2">{renderRating(product.rating || 4)}</Card.Text>
                  <h5 className="text-primary mb-3">₹{product.price}</h5>

                  <div className="d-flex justify-content-between gap-2">
                    <Button
                      variant={darkMode ? 'outline-light' : 'primary'}
                      className="d-flex align-items-center gap-2"
                      onClick={() => {
                        addToCart(product);
                        iziToast.success({
                          title: 'Added',
                          message: `${product.name} added to cart`,
                          position: 'topRight',
                          timeout: 2000,
                        });
                      }}
                    >
                      <BsCartPlusFill /> Add to Cart
                    </Button>

                    <Button
                      variant="outline-warning"
                      className="d-flex align-items-center gap-2"
                      onClick={() => {
                        addToWishlist(product);
                        iziToast.success({
                          title: 'Wishlisted',
                          message: `${product.name} added to wishlist`,
                          position: 'topRight',
                          timeout: 2000,
                        });
                      }}
                    >
                      <BsHeart /> Wishlist
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;

