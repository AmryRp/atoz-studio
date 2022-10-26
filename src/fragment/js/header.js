import React, { useState } from "react";
import { FaHome, FaPhone, FaSlideshare, FaPhotoVideo } from "react-icons/fa";
import "../../theme/defaultstyle.css";
import { ReactComponent as ReactLogo } from "../../resource/32.svg";
import { Input } from 'antd';

const { Search } = Input;

const Header = () => {
  const [users, setUser] = useState(
    [
      {
        name: "Ranger 1",
      },
      {
        name: "Ranger 2",
      },
      {
        name: "Ranger 3",
      },
    ]
  )

  const [menus, setMenu] = useState(
    [
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
        iconName: "FaPhone",
      },
    ]
  )

  const activeMenu = () => {
    const list = document.querySelectorAll('.list');
    function activeLink() {
      list.forEach((item) =>
        item.classList.remove('active'));
      this.classList.add('active')
    }
    list.forEach((item) =>
      item.addEventListener('click', activeLink));
  }

  const iconLoad = (props) => {
    if (props === "FaPhone") {
      return <FaPhone />
    }
    if (props === "FaSlideshare") {
      return <FaSlideshare />
    }
    if (props === "FaPhotoVideo") {
      return <FaPhotoVideo />
    }
    return <FaHome />;
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="navigation">
          <ReactLogo className="upperLogo" />
          <ul>
            {menus.map((menu) => {
              return (
                <li key={menu.id} className={"list " + menu.active}>
                  <a href='#' onClick={activeMenu}>
                    <span className="icon">
                      {iconLoad(menu.iconName)}
                    </span>
                    <span className="text">{menu.en}</span>
                  </a>
                </li>
              );
            })}
            <div className="indicator"></div>
          </ul>
          {/* <div>
            <Search className="searchBox" placeholder="search... "/>
          </div> */}
        </div>
      </header>
    </div>
  );
}

export default Header;
