import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookService from '../../services/book.service';
import './BookForm.css';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    category: '',
    publisher: '',
    publish_year: '',
    description: '',
    image: null
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await bookService.getBookById(id);
      if (response.success) {
        setFormData(response.data);
      } else {
        toast.error('Failed to fetch book details');
        navigate('/books');
      }
    } catch (error) {
      toast.error('Error fetching book details');
      navigate('/books');
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

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.title || !formData.author || !formData.quantity || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate quantity
      if (parseInt(formData.quantity) < 0) {
        toast.error('Quantity cannot be negative');
        return;
      }

      const response = isEditMode
        ? await bookService.updateBook(id, formData)
        : await bookService.addBook(formData);

      if (response.success) {
        toast.success(isEditMode ? 'Sách đã được cập nhật' : 'Sách đã được thêm mới');
        navigate('/books');
      } else {
        toast.error(response.message || 'Thao tác thất bại');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="book-form-container">
      <h2>{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>ISBN *</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
            disabled={isEditMode}
          />
        </div>

        <div className="form-group">
          <label>Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Publisher</label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Publish Year</label>
          <input
            type="number"
            name="publish_year"
            value={formData.publish_year}
            onChange={handleChange}
            min="1800"
            max={new Date().getFullYear()}
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

        <div className="form-group">
          <label>Book Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/books')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {isEditMode ? 'Update Book' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;