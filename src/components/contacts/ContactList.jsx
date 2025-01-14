import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaReply, FaTrash } from 'react-icons/fa';
import contactService from '../../services/contact.service';
import './Contacts.css';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0
  });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [replyData, setReplyData] = useState({ id: null, response: '' });

  useEffect(() => {
    fetchContacts();
  }, [pagination.page, selectedStatus]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAllContacts(
        pagination.page,
        pagination.limit,
        selectedStatus
      );
      if (response.success) {
        setContacts(response.data.contacts);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      const response = await contactService.respondToContact(
        replyData.id,
        replyData.response
      );
      if (response.success) {
        toast.success('Response sent successfully');
        setReplyData({ id: null, response: '' });
        fetchContacts();
      }
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await contactService.deleteContact(id);
        if (response.success) {
          toast.success('Contact deleted successfully');
          fetchContacts();
        }
      } catch (error) {
        toast.error('Failed to delete contact');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h2>Contact Messages</h2>
        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-filter"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="responded">Responded</option>
        </select>
      </div>

      <div className="contacts-grid">
        {contacts.map((contact) => (
          <div key={contact.id} className={`contact-card ${contact.status}`}>
            <div className="contact-info">
              <h4>{contact.subject}</h4>
              <p className="contact-message">{contact.message}</p>
              <div className="contact-details">
                <span>From: {contact.name}</span>
                <span>Email: {contact.email}</span>
                <span>Date: {new Date(contact.created_at).toLocaleDateString()}</span>
                <span className="status-badge">{contact.status}</span>
              </div>
            </div>

            {contact.response && (
              <div className="response-section">
                <h5>Response:</h5>
                <p>{contact.response}</p>
              </div>
            )}

            <div className="contact-actions">
              {contact.status !== 'responded' && (
                <button 
                  className="reply-button"
                  onClick={() => setReplyData({ id: contact.id, response: '' })}
                >
                  <FaReply /> Reply
                </button>
              )}
              <button 
                className="delete-button"
                onClick={() => handleDelete(contact.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {replyData.id && (
        <div className="reply-modal">
          <div className="reply-modal-content">
            <h3>Reply to Contact</h3>
            <form onSubmit={handleReply}>
              <textarea
                value={replyData.response}
                onChange={(e) => setReplyData({ ...replyData, response: e.target.value })}
                placeholder="Enter your response"
                rows="4"
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setReplyData({ id: null, response: '' })}>
                  Cancel
                </button>
                <button type="submit">Send Response</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div className="pagination">
          {[...Array(pagination.total_pages)].map((_, index) => (
            <button
              key={index + 1}
              className={pagination.page === index + 1 ? 'active' : ''}
              onClick={() => setPagination({ ...pagination, page: index + 1 })}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
