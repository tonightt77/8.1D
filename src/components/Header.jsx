import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import ImageFluid from './HeaderImg'
import { useAuth } from '../AuthContext';

const MenuExampleHeader = () => {
  const [activeItem, setActiveItem] = useState('');
  const auth = useAuth();

  const location = useLocation();
  useEffect(() => {
    const currentPath = location.pathname;
    switch (currentPath) {
      case '/find-dev':
        setActiveItem('Find DEV');
        break;
      case '/find-job':
        setActiveItem('Find Jobs');
        break;
      case '/login':
        setActiveItem('Login');
        break;
      case '/register':
        setActiveItem('Create Account');
        break;
      default:
        setActiveItem('');
    }
  }, [location]);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <div>
      <Menu inverted>
        <Link to="/">
          <Menu.Item
            name="DevLink Marketplace"
            onClick={handleItemClick}
          />
        </Link>
        <Menu.Menu position="right">
          <Link to="/find-dev">
            <Menu.Item
              name="Find DEV"
              active={activeItem === "Find DEV"}
              onClick={handleItemClick}
            />
          </Link>
          <Link to="/find-job">
            <Menu.Item
              name="Find Jobs"
              active={activeItem === "Find Jobs"}
              onClick={handleItemClick}
            />
          </Link>
          {auth.isLoggedIn ? (
            <Menu.Item
              name="Logout"
              onClick={auth.logout}
            />
          ) : (
            <>
              <Link to="/login">
                <Menu.Item
                  name="Login"
                  active={activeItem === "Login"}
                  onClick={handleItemClick}
                />
              </Link>
              <Link to="/register">
                <Menu.Item
                  name="Create Account"
                  active={activeItem === "Create Account"}
                  onClick={handleItemClick}
                />
              </Link>
            </>
          )}
        </Menu.Menu>
      </Menu>
      <ImageFluid />
    </div>
  );
};

export default MenuExampleHeader;