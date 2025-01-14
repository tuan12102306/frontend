import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import categoryService from '../../services/category.service';
import './Categories.css';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await categoryService.deleteCategory(id);
        if (response.success) {
          toast.success('Category deleted successfully');
          fetchCategories();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>Categories</h2>
        {isAdmin && (
          <button className="add-button" onClick={() => navigate('/categories/add')}>
            <FaPlus /> Add Category
          </button>
        )}
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-content">
              <h3>{category.name}</h3>
              <p>{category.description || 'No description available'}</p>
            </div>
            
            {isAdmin && (
              <div className="category-actions">
                <button 
                  className="edit-button"
                  onClick={() => navigate(`/categories/edit/${category.id}`)}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(category.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
