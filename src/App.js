import { Component } from "react";
import { FaHome, } from "react-icons/fa";
import "./theme/defaultstyle.css";

class App  extends Component {
  constructor() {
    super();
    this.state = {};
  }
  activeMenu() {
    const list = document.querySelectorAll('.list');
    function activeLink(){
      list.forEach((item)=>
      item.classList.remove('active'));
      this.classList.add('active')
    }
    list.forEach((item)=>
    item.addEventListener('click',activeLink));
  }
  render() {
    return (
      <div className="App">
        
      </div>
      
    );
  }
}

export default App;
