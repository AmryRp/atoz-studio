import React, { useState } from "react";
import "../../theme/defaultstyle.css";
import mask from '../../resource/hanya_mask.png';
import { Carousel } from 'antd';

const Dashboard = () => {
  const [users, setUser] = useState({
    Title: "Welcome To AtoZ Studio"
  }
  )
  const [banners, setBanner] = useState(
    [
      {
        id: 1,
        name: "Ranger 1",
        imageurl: 'https://www.adventurevalley.co.uk/wp-content/uploads/2022/04/Banner-1200-%C3%97-480px.jpg',
      },
      {
        id: 2,
        name: "Ranger 2",
        imageurl: 'https://www.adventurevalley.co.uk/wp-content/uploads/2022/04/Banner-1200-%C3%97-480px.jpg',
      },
      {
        id: 3,
        name: "Ranger 3",
        imageurl: 'https://www.adventurevalley.co.uk/wp-content/uploads/2022/04/Banner-1200-%C3%97-480px.jpg',
      },
    ]
  )
  return (
    <>
      {/* <Carousel autoplay autoplaySpeed={1800}>
        {banners.map((banner) => {
          return (
            <div key={banner.id}>
              <img className="CarouselStyle" src={banner.imageurl} alt={banner.name}></img>
            </div>
          );
        })}
      </Carousel> */}
      <div className="Dashboard" id="outer-container">
        <div className="App-Body">

          <div>
            {/* <h1 className="Title">{users.Title}</h1> */}
          </div>

          <div>
            {/* Tittle Banner 
            <img className="BannerImg" src={mask} alt="hanya mask" />
            */}
          </div>
          <div>
            {/* 3D showcase */}
          </div>
        </div>
      </div>

    </>
  );
}

export default Dashboard;
