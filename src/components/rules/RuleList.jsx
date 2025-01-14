import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ruleService from '../../services/rule.service';
import RuleForm from './RuleForm';
import './Rules.css';

const RuleList = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.user?.role === 'admin';

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await ruleService.getAllRules();
      if (response.success) {
        setRules(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải nội quy');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, ruleName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nội quy "${ruleName}" không?`)) {
      try {
        const response = await ruleService.deleteRule(id);
        if (response.success) {
          toast.success('Xóa nội quy thành công');
          fetchRules();
        }
      } catch (error) {
        toast.error('Không thể xóa nội quy');
      }
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <div className="rules-container">
      <div className="rules-header">
        <h2>Nội Quy Thư Viện</h2>
        {isAdmin && (
          <button 
            className="add-button"
            onClick={() => {
              setSelectedRule(null);
              setIsFormOpen(true);
            }}
          >
            <FaPlus /> Thêm nội quy
          </button>
        )}
      </div>

      <div className="rules-list">
        {rules.map((rule) => (
          <div key={rule.id} className="rule-card">
            <div className="rule-content">
              <div className="rule-header">
                <h3>{rule.rule_name}</h3>
                {isAdmin && (
                  <div className="rule-actions">
                    <button 
                      className="edit-button"
                      onClick={() => {
                        setSelectedRule(rule);
                        setIsFormOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    {!rule.is_default && (
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(rule.id, rule.rule_name)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="rule-value">{rule.rule_value}</div>
              {rule.description && (
                <p className="rule-description">{rule.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <RuleForm 
          rule={selectedRule}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedRule(null);
          }}
          onSuccess={() => {
            setIsFormOpen(false);
            setSelectedRule(null);
            fetchRules();
          }}
        />
      )}
    </div>
  );
};

export default RuleList;
