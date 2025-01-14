import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave } from 'react-icons/fa';
import categoryService from '../../services/category.service';
import './Categories.css';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      fetchCategoryDetails();
    }
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await categoryService.getCategoryById(id);
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch category details');
      navigate('/categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = id
        ? await categoryService.updateCategory(id, formData)
        : await categoryService.createCategory(formData);

      if (response.success) {
        toast.success(`Category ${id ? 'updated' : 'created'} successfully`);
        navigate('/categories');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="category-form-container">
      <h2>{id ? 'Edit Category' : 'Add New Category'}</h2>
      
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/categories')} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
