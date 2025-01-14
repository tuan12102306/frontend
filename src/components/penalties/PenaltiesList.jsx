import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import penaltyService from '../../services/penalty.service';
import './PenaltiesList.css';

const PenaltiesList = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const response = await penaltyService.getUserPenalties();
      if (response.success) {
        setPenalties(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách phạt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="penalties-container">
      <h2>Danh sách phạt</h2>
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="penalties-list">
          {penalties.length === 0 ? (
            <p className="no-penalties">Không có phạt nào</p>
          ) : (
            penalties.map(penalty => (
              <div key={penalty.id} className="penalty-card">
                <div className="penalty-header">
                  <h3>{penalty.book_title}</h3>
                  <span className={`status ${penalty.status}`}>
                    {penalty.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
                <p className="reason">{penalty.reason}</p>
                <div className="penalty-footer">
                  <span className="amount">{penalty.amount.toLocaleString()}đ</span>
                  <span className="date">
                    {new Date(penalty.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PenaltiesList; 