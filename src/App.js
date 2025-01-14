import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Import Page Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/home/Home';
import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';
import BookDetail from './components/books/BookDetail';
import MyBorrows from './components/borrows/MyBorrows';
import Profile from './components/profile/Profile';
import ServiceList from './components/services/ServiceList';
import ServiceForm from './components/services/ServiceForm';
import CategoryList from './components/categories/CategoryList';
import CategoryForm from './components/categories/CategoryForm';
import ContactForm from './components/contacts/ContactForm';
import ContactList from './components/contacts/ContactList';
import NewsList from './components/news/NewsList';
import NewsDetail from './components/news/NewsDetail';
import NewsForm from './components/news/NewsForm';
import RuleList from './components/rules/RuleList';
import Dashboard from './components/admin/Dashboard';
import FavoriteBooks from './components/books/FavoriteBooks';
import Notifications from './pages/Notifications';
import PenaltiesList from './components/penalties/PenaltiesList';
import UserStats from './components/statistics/UserStats';
import AdminNotifications from './components/admin/notifications/AdminNotifications';
import MyContacts from './components/contacts/MyContacts';
import CategoryBooks from './components/categories/CategoryBooks';

// Layout Component
const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Auth Layout (không có header/footer)
const AuthLayout = ({ children }) => {
  return <div className="auth-container">{children}</div>;
};

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.user?.role === 'admin' ? (
    <MainLayout>{children}</MainLayout>
  ) : (
    <Navigate to="/books" />
  );
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Auth Routes - Không có Header/Footer */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* Protected Routes - Có Header/Footer */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Public Routes - Có Header/Footer */}
        <Route
          path="/books"
          element={
            <MainLayout>
              <BookList />
            </MainLayout>
          }
        />
        <Route
          path="/books/:id"
          element={
            <MainLayout>
              <BookDetail />
            </MainLayout>
          }
        />

        {/* Admin Routes - Có Header/Footer */}
        <Route
          path="/books/edit/:id"
          element={
            <AdminRoute>
              <BookForm />
            </AdminRoute>
          }
        />
        <Route
          path="/books/add"
          element={
            <AdminRoute>
              <BookForm />
            </AdminRoute>
          }
        />

        <Route 
          path="/my-borrows" 
          element={
            <PrivateRoute>
              <MyBorrows />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route path="/services" element={<ServiceList />} />
        <Route 
          path="/services/add" 
          element={
            <AdminRoute>
              <ServiceForm />
            </AdminRoute>
          } 
        />
        <Route 
          path="/services/edit/:id" 
          element={
            <AdminRoute>
              <ServiceForm />
            </AdminRoute>
          } 
        />
        <Route path="/categories" element={<CategoryList />} />
        <Route 
          path="/categories/add" 
          element={
            <AdminRoute>
              <CategoryForm />
            </AdminRoute>
          } 
        />
        <Route 
          path="/categories/edit/:id" 
          element={
            <AdminRoute>
              <CategoryForm />
            </AdminRoute>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PrivateRoute>
              <ContactForm />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/contacts" 
          element={
            <AdminRoute>
              <ContactList />
            </AdminRoute>
          } 
        />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route 
          path="/news/add" 
          element={
            <AdminRoute>
              <NewsForm />
            </AdminRoute>
          } 
        />
        <Route 
          path="/news/edit/:id" 
          element={
            <AdminRoute>
              <NewsForm />
            </AdminRoute>
          } 
        />
        <Route path="/rules" element={<RuleList />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute>
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            </PrivateRoute>
          } 
        />
        <Route path="/favorites" element={<FavoriteBooks />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route 
          path="/penalties" 
          element={
            <PrivateRoute>
              <PenaltiesList />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/statistics" 
          element={
            <PrivateRoute>
              <UserStats />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/statistics" 
          element={
            <AdminRoute>
              <UserStats isAdmin={true} />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/notifications" 
          element={
            <AdminRoute>
              <AdminNotifications />
            </AdminRoute>
          } 
        />
        <Route 
          path="/my-contacts" 
          element={
            <PrivateRoute>
              <MyContacts />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/categories/:categoryId/books" 
          element={
            <MainLayout>
              <CategoryBooks />
            </MainLayout>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
