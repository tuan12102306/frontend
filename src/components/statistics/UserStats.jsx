import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import statisticsService from '../../services/statistics.service';
import './UserStats.css';

const UserStats = ({ isAdmin }) => {
  const [stats, setStats] = useState({
    borrows: {
      total_borrows: 0,
      active_borrows: 0,
      returned_borrows: 0
    },
    penalties: {
      total_penalties: 0,
      total_amount: 0,
      unpaid_amount: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await statisticsService.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải thống kê');
      console.error('Statistics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="stats-container">
      <h2>{isAdmin ? 'Thống kê tổng quan' : 'Thống kê của bạn'}</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Sách đã mượn</h3>
          <div className="stat-value">
            {stats.borrows?.total_borrows || 0}
          </div>
          <div className="stat-details">
            <span>Đang mượn: {stats.borrows?.active_borrows || 0}</span>
            <span>Đã trả: {stats.borrows?.returned_borrows || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Phạt</h3>
          <div className="stat-value">
            {stats.penalties?.total_penalties || 0} lần
          </div>
          <div className="stat-details">
            <span>
              Tổng tiền: {(stats.penalties?.total_amount || 0).toLocaleString()}đ
            </span>
            <span>
              Chưa trả: {(stats.penalties?.unpaid_amount || 0).toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats; 