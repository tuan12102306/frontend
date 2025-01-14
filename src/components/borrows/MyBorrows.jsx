import React, { useState, useEffect } from 'react';
import { FaBook, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import borrowService from '../../services/borrow.service';
import './MyBorrows.css';

const MyBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    fetchMyBorrows();
  }, []);

  const fetchMyBorrows = async () => {
    try {
      setLoading(true);
      const response = await borrowService.getUserBorrows();
      if (response.success) {
        setBorrows(response.data);
      }
    } catch (error) {
      console.error('Fetch borrows error:', error);
      toast.error('Không thể tải danh sách sách đã mượn');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      setReturningId(borrowId);
      const response = await borrowService.returnBorrow(borrowId);
      
      if (response.success) {
        toast.success('Trả sách thành công');
        // Cập nhật UI ngay lập tức
        setBorrows(borrows.map(borrow => 
          borrow.id === borrowId 
            ? {...borrow, status: 'returned'} 
            : borrow
        ));
        // Sau đó mới gọi API để lấy dữ liệu mới
        await fetchMyBorrows();
      }
    } catch (error) {
      console.error('Return book error:', error);
      toast.error(error.message || 'Không thể trả sách. Vui lòng thử lại');
    } finally {
      setReturningId(null);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="my-borrows-container">
      <h2>Sách đã mượn</h2>
      
      {borrows.length === 0 ? (
        <p className="no-borrows">Bạn chưa mượn cuốn sách nào.</p>
      ) : (
        <div className="borrows-grid">
          {borrows.map((borrow) => (
            <div key={borrow.id} className="borrow-card">
              <h3>{borrow.title}</h3>
              <p><strong>Tác giả:</strong> {borrow.author}</p>
              <p><strong>Ngày mượn:</strong> {new Date(borrow.borrow_date).toLocaleDateString()}</p>
              <p><strong>Hạn trả:</strong> {new Date(borrow.due_date).toLocaleDateString()}</p>
              <p className={`status ${borrow.status}`}>
                {borrow.status === 'borrowed' ? 'Đang mượn' : 'Đã trả'}
              </p>
              
              {borrow.status === 'borrowed' && (
                <button 
                  className={`return-button ${returningId === borrow.id ? 'processing' : ''}`}
                  onClick={() => handleReturn(borrow.id)}
                  disabled={returningId === borrow.id}
                >
                  <FaUndo /> {returningId === borrow.id ? 'Đang trả sách...' : 'Trả sách'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrows;
