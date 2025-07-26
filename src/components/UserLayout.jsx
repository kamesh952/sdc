import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const UserLayout = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet /> {/* Render child routes here */}
      </div>
      <Footer />
    </>
  );
};

export default UserLayout;
