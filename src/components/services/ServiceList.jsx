import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import serviceService from '../../services/service.service';
import './Services.css';

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentService, setCurrentService] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    fetchServices();
    if (user) {
      fetchCurrentService();
    }
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getAllServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentService = async () => {
    try {
      const response = await serviceService.getCurrentService();
      if (response.success) {
        setCurrentService(response.data);
      }
    } catch (error) {
      // Ignore if no active service
    }
  };

  const handleRegister = async (serviceId) => {
    try {
      if (!user) {
        toast.error('Please login to register for a service');
        return;
      }

      const response = await serviceService.registerService(serviceId);
      if (response.success) {
        toast.success('Service registered successfully');
        fetchCurrentService();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register service');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await serviceService.deleteService(id);
        if (response.success) {
          toast.success('Service deleted successfully');
          fetchServices();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="services-container">
      <div className="services-header">
        <h2>Library Services</h2>
        {isAdmin && (
          <button className="add-service-btn" onClick={() => navigate('/services/add')}>
            <FaPlus /> Add New Service
          </button>
        )}
      </div>

      {currentService && (
        <div className="current-service">
          <h3>Your Current Service</h3>
          <div className="service-card active">
            <h4>{currentService.name}</h4>
            <p>{currentService.description}</p>
            <div className="service-details">
              <span>Max Books: {currentService.max_books}</span>
              <span>Valid until: {new Date(currentService.end_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h4>{service.name}</h4>
            <p>{service.description}</p>
            <div className="service-details">
              <span>Duration: {service.duration} days</span>
              <span>Max Books: {service.max_books}</span>
              <span>Price: ${service.price}</span>
            </div>
            
            <div className="service-actions">
              {isAdmin ? (
                <>
                  <button 
                    className="edit-btn"
                    onClick={() => navigate(`/services/edit/${service.id}`)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(service.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              ) : (
                <button 
                  className="register-btn"
                  onClick={() => handleRegister(service.id)}
                  disabled={!!currentService}
                >
                  {currentService ? 'Already Subscribed' : 'Register'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
