import React, { useState } from "react";
import "./aboutUs.css"

const AboutUs = () => {
  const [users, setUser] = useState({
    AboutUs: "About Us",
    Description: "We are 3d graphic design services that serve various kinds of orders",
  });
  return (
    <>
      <div className="about-us" id="outer-container">
        <div className="App-Body">
          <div>
            <p className="paragraph-about-us">
              <h1>{users.AboutUs}</h1>
              <h3>{users.Description}</h3>
            </p>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
