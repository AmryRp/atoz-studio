import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './fragment/js/header.js';
import Dashboard from './fragment/raw/dashboard.js';
import Showcase from './fragment/raw/showcaseBox.js';
import AboutUs from './fragment/raw/aboutUs';
import 'antd/dist/antd.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <Dashboard />
    <Showcase />
    <AboutUs/>
  </React.StrictMode>,
);

