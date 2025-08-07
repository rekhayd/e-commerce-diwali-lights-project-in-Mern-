

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container } from 'react-bootstrap';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', imageFile: null, image: '', _id: null });

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      iziToast.error({ message: 'Failed to fetch categories', position: 'topRight' });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      iziToast.error({ message: 'Category name is required', position: 'topRight' });
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    if (form.imageFile) formData.append('image', form.imageFile);

    try {
      if (form._id) {
        await axios.put(`http://localhost:5000/api/categories/${form._id}`, formData);
        iziToast.success({ message: 'Category updated successfully', position: 'topRight' });
      } else {
        await axios.post('http://localhost:5000/api/categories', formData);
        iziToast.success({ message: 'Category added successfully', position: 'topRight' });
      }

      setForm({ name: '', description: '', imageFile: null, image: '', _id: null });
      fetchCategories();
    } catch (err) {
      console.error(err);
      iziToast.error({ message: 'Save failed', position: 'topRight' });
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description, image: cat.image, imageFile: null, _id: cat._id });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      iziToast.success({ message: 'Category deleted', position: 'topRight' });
      fetchCategories();
    } catch (err) {
      iziToast.error({ message: 'Delete failed', position: 'topRight' });
    }
  };

  return (
    <Container className="mt-5">
      <h3>{form._id ? 'Edit' : 'Add'} Category</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="imageFile" onChange={handleChange} accept="image/*" />
        </Form.Group>
        {form.image && (
          <div className="mt-2">
            <img src={`http://localhost:5000${form.image}`} alt="Preview" height="80" />
          </div>
        )}
        <Button type="submit" className="mt-3">{form._id ? 'Update' : 'Add'} Category</Button>
      </Form>

      <hr />
      <h4>All Categories</h4>
      <Table striped bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr key={cat._id}>
              <td>{idx + 1}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                {cat.image && <img src={`http://localhost:5000${cat.image}`} alt="" height="60" />}
                
              </td>
              <td>
                <Button size="sm" onClick={() => handleEdit(cat)} variant="warning" className="me-2">Edit</Button>
                <Button size="sm" onClick={() => handleDelete(cat._id)} variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CategoryForm;
