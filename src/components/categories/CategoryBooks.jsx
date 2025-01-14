import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookService from '../../services/book.service';
import categoryService from '../../services/category.service';
import './Categories.css';

const CategoryBooks = () => {
    const { categoryId } = useParams();
    const [books, setBooks] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategoryAndBooks();
    }, [categoryId]);

    const fetchCategoryAndBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch category details
            const categoryResponse = await categoryService.getCategoryById(categoryId);
            if (categoryResponse.success) {
                setCategory(categoryResponse.data);
            }

            // Fetch books for category
            const booksResponse = await bookService.getBooksByCategory(categoryId);
            if (booksResponse.success) {
                setBooks(booksResponse.data);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="category-books-container">
            {category && (
                <div className="category-header">
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                </div>
            )}

            <div className="books-grid">
                {books && books.length > 0 ? (
                    books.map(book => (
                        <Link to={`/books/${book.id}`} key={book.id} className="book-card">
                            <img 
                                src={`http://localhost:5000${book.image_url}`} 
                                alt={book.title}
                                onError={(e) => {
                                    e.target.src = '/placeholder-book.png'; // Thêm ảnh placeholder
                                }}
                            />
                            <div className="book-info">
                                <h3>{book.title}</h3>
                                <p className="author">{book.author}</p>
                                <p className="quantity">Số lượng: {book.quantity}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="no-books">
                        <p>Không có sách nào trong danh mục này</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryBooks; 