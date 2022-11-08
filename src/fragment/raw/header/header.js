import React, { useState } from "react";
import { FaHome, FaPhoneAlt, FaSlideshare, FaPhotoVideo } from "react-icons/fa";
// import "../../theme/defaultstyle.css";
// import { ReactComponent as Mylogo } from "../../resource/Atoz_logo_web.svg";
import { Input } from 'antd';
import AtozLogo from "../../../resource/AtozLogo";
import { stack as Menu } from "react-burger-menu";
import './header.css'
const { Search } = Input;

const Header = () => {
  const [users, setUser] = useState([
    {
      name: "Ranger 1",
    },
    {
      name: "Ranger 2",
    },
    {
      name: "Ranger 3",
    },
  ]);

  const [menus, setMenu] = useState([
    {
      id: "1",
      idn: "Beranda",
      en: "Home",
      iconName: "FaHome",
      active: "active",
    },
    {
      id: "2",
      idn: "Tentang Kami",
      en: "About Us",
      iconName: "FaSlideshare",
    },
    {
      id: "3",
      idn: "Portofolio",
      en: "Portofolio",
      iconName: "FaPhotoVideo",
    },
    {
      id: "4",
      idn: "profil akun",
      en: "Profile",
      iconName: "FaPhoneAlt",
    },
  ]);

  const activeMenu = () => {
    const list = document.querySelectorAll(".list");
    function activeLink() {
      list.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    }
    list.forEach((item) => item.addEventListener("click", activeLink));
  };
  const [isOpen,setOpen] = useState(false);
  const iconLoad = (props) => {
    if (props === "FaPhoneAlt") {
      return <FaPhoneAlt />;
    }
    if (props === "FaSlideshare") {
      return <FaSlideshare />;
    }
    if (props === "FaPhotoVideo") {
      return <FaPhotoVideo />;
    }
    return <FaHome />;
  };
  return (
        <div className="navigation">
          {/* <AtozLogo className="upperLogo"
            logoProperty={{
              strokeColor: '#10131f',
              fill: "none",
              strokeWidth: 91.67,
            }} 
          /> */}
          <ul>
            {menus.map((menu, i) => {
              return (
                <li key={i} className={"list " + menu.active}>
                  <a href="#" onClick={activeMenu}>
                    <span className="icon">{iconLoad(menu.iconName)}</span>
                    <span className="text">{menu.en}</span>
                  </a>
                </li>
              );
            })}
            <div className="indicator"></div>
            
          </ul>
          <Menu right toggled={isOpen} toggle={setOpen} pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" }>
          {menus.map((menu) => {
            return (
                <a href="#" onClick={activeMenu}>
                  <span className="icon">{iconLoad(menu.iconName)}</span>
                  <span className="text">{menu.en}</span>
                </a>
            );
          })}
          </Menu>
          {/* <div>
            <Search className="searchBox" placeholder="search... "/>
          </div> */}
        </div>
  );
};

export default Header;
