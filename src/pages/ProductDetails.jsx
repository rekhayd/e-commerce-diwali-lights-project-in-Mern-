

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={`http://localhost:5000${product.image}`} alt={product.name} />
      <p>Price: ₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      <p>Category: {product.category}</p>
    </div>
  );
};

export default ProductDetail;

