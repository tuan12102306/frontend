import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaTimes } from 'react-icons/fa';
import ruleService from '../../services/rule.service';
import './Rules.css';

const RuleForm = ({ rule, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: '',
    rule_value: '',
    description: ''
  });

  useEffect(() => {
    if (rule) {
      setFormData({
        rule_name: rule.rule_name,
        rule_value: rule.rule_value,
        description: rule.description || ''
      });
    }
  }, [rule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = rule
        ? await ruleService.updateRule(rule.id, formData)
        : await ruleService.addRule(formData);

      if (response.success) {
        toast.success(`Nội quy đã được ${rule ? 'cập nhật' : 'thêm'} thành công`);
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Không thể ${rule ? 'cập nhật' : 'thêm'} nội quy`);
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

  return (
    <div className="rule-form-modal">
      <div className="rule-form-content">
        <h2>{rule ? 'Chỉnh sửa nội quy' : 'Thêm nội quy mới'}</h2>
        
        <form onSubmit={handleSubmit} className="rule-form">
          <div className="form-group">
            <label>Tiêu đề nội quy *</label>
            <input
              type="text"
              name="rule_name"
              value={formData.rule_name}
              onChange={handleChange}
              required
              placeholder="VD: Số lượng sách được mượn"
              disabled={rule}
            />
          </div>

          <div className="form-group">
            <label>Nội dung quy định *</label>
            <textarea
              name="rule_value"
              value={formData.rule_value}
              onChange={handleChange}
              required
              rows="4"
              placeholder="VD: Mỗi độc giả được mượn tối đa 3 cuốn sách trong thời gian 14 ngày"
            />
          </div>

          <div className="form-group">
            <label>Ghi chú bổ sung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Nhập thêm ghi chú hoặc giải thích chi tiết (nếu cần)"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
            >
              <FaTimes /> Hủy
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              <FaSave /> {loading ? 'Đang lưu...' : 'Lưu nội quy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RuleForm;
