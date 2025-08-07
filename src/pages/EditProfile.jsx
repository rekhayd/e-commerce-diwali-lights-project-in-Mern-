import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const stored = JSON.parse(localStorage.getItem('adminData'));
  const [name, setName] = useState(stored.name);
  const [email, setEmail] = useState(stored.email);
  const [image, setImage] = useState(stored.image);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const { data } = await axios.put('http://localhost:5000/api/admin/profile', { name, email, image }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('adminData', JSON.stringify(data));
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <form onSubmit={updateProfile}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfile;