import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaChartBar,
  FaCalendarAlt
} from 'react-icons/fa';
import statisticsService from '../../services/statistics.service';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

// Đăng ký ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await statisticsService.getStatistics();
      console.log('Statistics response:', response);
      if (response.success) {
        setStatistics(response.data);
        console.log('Category statistics:', response.data.category_statistics);
      } else {
        toast.error('Không thể tải dữ liệu thống kê');
      }
    } catch (error) {
      console.error('Statistics error:', error);
      toast.error(error.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  // Log dữ liệu cho biểu đồ tròn
  console.log('Category Data:', {
    labels: statistics?.category_statistics?.map(cat => cat.name) || [],
    data: statistics?.category_statistics?.map(cat => cat.book_count) || []
  });

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!statistics) return <div>Không có dữ liệu</div>;

  // Dữ liệu cho biểu đồ cột
  const monthlyData = {
    labels: statistics.monthly_statistics?.map(stat => stat.month) || [],
    datasets: [
      {
        label: 'Số lượt mượn',
        data: statistics.monthly_statistics?.map(stat => stat.total_borrows) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Số lượt trả',
        data: statistics.monthly_statistics?.map(stat => stat.total_returns) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  // Dữ liệu cho biểu đồ tròn
  const categoryData = {
    labels: statistics?.category_statistics?.map(cat => cat.name) || [],
    datasets: [{
      data: statistics?.category_statistics?.map(cat => cat.book_count) || [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',   // Hồng
        'rgba(54, 162, 235, 0.7)',   // Xanh dương
        'rgba(255, 206, 86, 0.7)',   // Vàng
        'rgba(75, 192, 192, 0.7)',   // Xanh lá
        'rgba(153, 102, 255, 0.7)',  // Tím
        'rgba(255, 159, 64, 0.7)',   // Cam
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  index: i
                };
              });
            }
            return [];
          }
        }
      }
    }
  };

  return (
    <div className="dashboard">
      <h2>Thống kê tổng quan</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <FaBook className="stat-icon" />
          <div className="stat-info">
            <h3>Tổng số sách</h3>
            <p>{statistics.overview?.total_books || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>Tổng số người dùng</h3>
            <p>{statistics.overview?.total_users || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaExchangeAlt className="stat-icon" />
          <div className="stat-info">
            <h3>Lượt mượn sách</h3>
            <p>{statistics.overview?.total_borrows || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaChartBar className="stat-icon" />
          <div className="stat-info">
            <h3>Đang mượn</h3>
            <p>{statistics.overview?.current_borrows || 0}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Thống kê mượn trả theo tháng</h3>
          <Bar data={monthlyData} />
        </div>

        <div className="chart-container" style={{ height: '400px' }}>
          <h3>Phân bố sách theo danh mục</h3>
          <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <Pie 
              data={categoryData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      font: { size: 12 }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
