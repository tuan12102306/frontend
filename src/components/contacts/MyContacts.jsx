import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import contactService from '../../services/contact.service';
import './Contacts.css';

const MyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyContacts();
  }, []);

  const fetchMyContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getMyContacts();
      if (response.success) {
        setContacts(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch your contacts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-contacts-container">
      <h2>My Feedback History</h2>
      <div className="contacts-grid">
        {contacts.map((contact) => (
          <div key={contact.id} className={`contact-card ${contact.status}`}>
            <div className="contact-info">
              <h4>{contact.subject}</h4>
              <p className="contact-message">{contact.message}</p>
              <div className="contact-details">
                <span>Date: {new Date(contact.created_at).toLocaleDateString()}</span>
                <span className="status-badge">{contact.status}</span>
              </div>
            </div>
            {contact.response && (
              <div className="response-section">
                <h5>Admin Response:</h5>
                <p>{contact.response}</p>
                <span className="response-date">
                  Responded on: {new Date(contact.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {contacts.length === 0 && (
        <div className="no-contacts">
          <p>You haven't submitted any feedback yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyContacts; 