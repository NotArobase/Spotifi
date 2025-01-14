import React from 'react';
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <><header style={styles.header}>
          <h1 style={styles.title}>Spotifi</h1>
          <Link to="/login" className={location.pathname === "/login" ? "active-page" : ""}>
              <button style={styles.loginButton}>
                  Login
              </button>
          </Link>
      </header></>
  );
};

// Inline styling
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
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default Header;
