import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave } from 'react-icons/fa';
import serviceService from '../../services/service.service';
import './Services.css';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    max_books: '',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const response = await serviceService.getServiceById(id);
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch service details');
      navigate('/services');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = id
        ? await serviceService.updateService(id, formData)
        : await serviceService.createService(formData);

      if (response.success) {
        toast.success(`Service ${id ? 'updated' : 'created'} successfully`);
        navigate('/services');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} service`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="service-form-container">
      <h2>{id ? 'Edit Service' : 'Add New Service'}</h2>
      
      <form onSubmit={handleSubmit} className="service-form">
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

        <div className="form-group">
          <label>Price (USD) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Duration (days) *</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Max Books *</label>
          <input
            type="number"
            name="max_books"
            value={formData.max_books}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        {id && (
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/services')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            <FaSave /> {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
