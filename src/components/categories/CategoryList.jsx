import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import categoryService from '../../services/category.service';
import bookService from '../../services/book.service';
import './Categories.css';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBooksByCategory(selectedCategory);
    }
  }, [selectedCategory]);

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

  const fetchBooksByCategory = async (categoryId) => {
    try {
      const response = await bookService.getBooksByCategory(categoryId);
      if (response.success) {
        setCategoryBooks(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch books');
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
          <div 
            key={category.id} 
            className="category-card"
            onMouseEnter={() => setSelectedCategory(category.id)}
          >
            <div className="category-content">
              <h3>{category.name}</h3>
              <p>{category.description || 'No description available'}</p>
              <Link 
                to={`/categories/${category.id}/books`} 
                className="view-all-books"
              >
                Xem tất cả sách
              </Link>
            </div>
            
            {selectedCategory === category.id && categoryBooks.length > 0 && (
              <div className="category-books-dropdown">
                <h4>Sách trong danh mục</h4>
                <div className="books-list">
                  {categoryBooks.map(book => (
                    <Link 
                      to={`/books/${book.id}`} 
                      key={book.id}
                      className="book-item"
                    >
                      <img src={`http://localhost:5000${book.image_url}`} alt={book.title} />
                      <div className="book-info">
                        <h5>{book.title}</h5>
                        <p>{book.author}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
