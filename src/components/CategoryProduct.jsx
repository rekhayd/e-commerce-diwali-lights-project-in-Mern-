


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (product) => {
    console.log('Add to cart clicked:', product.name);
    // TODO: Hook this into Cart Context or Redux
    alert(` Added "${product.name}" to cart!`);
  };

  useEffect(() => {
    if (!categoryId) {
      setError("Category ID missing in URL");
      setLoading(false);
      return;
    }

    const fetchCategoryData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/categories/${categoryId}`),
          axios.get(`http://localhost:5000/api/products/category/${categoryId}`)
        ]);
        setCategory(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Category: {category?.name}</h2>
      <p>{category?.description}</p>

      <h3>Products in this Category</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.length > 0 ? (
          products.map(product => (
            <div
              key={product._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '15px',
                width: '250px',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <h4>{product.name}</h4>
              <p><strong>₹{product.price}</strong></p>
              <button onClick={() => handleAddToCart(product)} style={{
                backgroundColor: '#28a745',
                color: '#fff',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                🛒 Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products found under this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;
