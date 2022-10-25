import React, { useState } from "react";
import "../../theme/defaultstyle.css";
import mask from '../../resource/hanya_mask.png';
import { Carousel } from 'antd';

const contentStyle = {
  height: '480px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};
const Dashboard = () => {
  const [users, setUser] = useState({
    Title: "Welcome To AtoZ Studio"
  }
  )
  return (
    <>
     <Carousel autoplay autoplaySpeed={1800}>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
    <div className="Dashboard">
      <div className="App-Body">
        
        <div><h1 className="Title">{users.Title}</h1></div>
        
        <div>
          <img className="BannerImg" src={mask} alt="hanya mask" />
        </div>
        
      </div>
    </div>
   
    </>
  );
}

export default Dashboard;
