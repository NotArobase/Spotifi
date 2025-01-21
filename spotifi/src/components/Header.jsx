import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <><header style={styles.header}>
          <h1 style={styles.title}>Spotifi</h1>
          <div>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={location.pathname === "/login" ? "active-page" : ""}>
                <button style={styles.loginButton}>
                  Login
                </button>
                </Link>
                <Link to="/register" className={location.pathname === "/register" ? "active-page" : ""}>
                <button style={styles.loginButton}>
                  Register
                </button>
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} style={styles.loginButton}>
                Logout
              </button>
            )}
          </div>
      </header></>
  );
};

const styles = {
  header: {
    position: 'top',
    top: 0,
    width: '98%',
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'black',
  },
  loginButton: {
    backgroundColor: 'rgb(101, 224, 115)',
    border: '10px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default Header;
