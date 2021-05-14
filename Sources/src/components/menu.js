import React from "react";
import { css } from "emotion";

const easeSlow = css`
  transition: all 450ms ease-in-out;
`;

const menuBtn = css`
  position: absolute;
  z-index: 3;
  left: 30px;
  top: 30px;
  cursor: pointer;
  ${easeSlow};
  &.closer {
    transform: rotate(180deg);
  }
`;

const btnLine = css`
  width: 28px;
  height: 4px;
  margin: 0 0 5px 0;
  background-color: #000;
  ${easeSlow};
  &.closer {
    background-color: #D50000;  
    &:nth-child(1) {
      transform: rotate(45deg) translate(4px, 0px);
      width: 20px;
    }
    &:nth-child(2) {
      transform: translateX(-8px);
    }
    &:nth-child(3) {
      transform: rotate(-45deg) translate(4px, 0px);
      width: 20px;
    }
  }
`;

const menuOverlay = css`
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  height: 100vh;
  width: 15vw;
  transform: translateX(-100%);
  transition: all 500ms ease-in-out;
  &.show {
    background-color: #FFF;
    transform: translateX(0%); 
    box-shadow: 0px 7px 4px 3px #9191913b;
  }
  nav {
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    a {
      height: 45px;
      text-decoration: none;
      color: #000;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      width: 100%;
      text-align: center;
      font-size: 25px;
      line-height: 40px;
      &:hover {
        background-color: #f2f2f2;
      } 
    }
  }
  @media (max-width: 800px) {
    width: 100vw;
  }
`;

export class Menu extends React.Component {
  state = {
    isMenuOpen: false
  };

  toggleMenu = () =>
    this.setState(({ isMenuOpen }) => ({ isMenuOpen: !isMenuOpen }));

  render() {
    const { isMenuOpen } = this.state;
    if (localStorage.getItem("admin") === '0'){
    return (
      <React.Fragment>
        <div
          className={`${menuBtn} ${isMenuOpen ? "closer" : null}`}
          onClick={this.toggleMenu}
        >
          
          <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
          <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
          <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
        </div>
        <div className={`${menuOverlay} ${isMenuOpen ? "show" : null}`}>
          <nav>
            <a href={"/Accueil"}>Accueil</a>
            <a href={"/Messages"}>Mes Messages</a>
            <a href={"/Enseignants"}>Enseignants</a>
            <a href={"/Consultation"}>Consulter </a>
          </nav>
        </div>
      </React.Fragment>
    );
    }
    else
    {
      return (
        <React.Fragment>
          <div
            className={`${menuBtn} ${isMenuOpen ? "closer" : null}`}
            onClick={this.toggleMenu}
          >
            
            <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
            <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
            <div className={`${btnLine} ${isMenuOpen ? "closer" : null}`} />
          </div>
          <div className={`${menuOverlay} ${isMenuOpen ? "show" : null}`}>
            <nav>
              <a href={"/Accueil"}>Accueil</a>
              <a href={"/Tableaux"}>Les Utilisateurs</a>
              <a href={"/Statistiques"}>Statistiques</a>
              <a href={"/Messages"}>Mes Messages</a>
            </nav>
          </div>
        </React.Fragment>
      ); 
    }
  }
}

export default Menu;
