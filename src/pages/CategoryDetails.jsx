import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryDetails = () => {
  const { id } = useParams(); 
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/categories/${id}`);
        setCategory(res.data);
      } catch (err) {
        console.error("Fetch category error:", err.response?.data || err.message);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  return (
    <div>
      {category ? (
        <>
          <h2>{category.name}</h2>
          <img src={`http://localhost:5000${category.image}`} alt="Category" width={300} />
        </>
      ) : (
        <p>Loading or error occurred...</p>
      )}
    </div>
  );
};

export default CategoryDetails;
