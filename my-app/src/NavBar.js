import React from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components"



const BG = "CadetBlue";
const minHeight = "3vh"
const Nav = styled.section`
display:flex;
  position:relative;
  z-index: 10;
  flex-direction: row-reverse;
  -webkit-box-shadow:0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow:0 3px 4px rgba(0, 0, 0, 0.3);
  min-width: 100%;
  text-align: center;
  align-items: center;
  flex-wrap: wrap;
  background: ${BG};
  min-height: ${minHeight};
  ${Nav} > * {
    border-right: solid white 4px;
    padding:0.6em;
    align-self: center;
    text-decoration: none;
    font-weight: bold;
    color:white;
    }
  }
`;



const Link = styled.a`
  text-decoration: none;
  min-height: ${minHeight};
  background-color: ${BG};
  font-weight: bold;
  ${Link}:hover {
    background-color: red;
    color: white;
  }
`

function NavBar() {
    return (
        <Nav>
                {/*<a href="/">HOME</a>*/}
                <Link href='/create' >CREATE</Link>
                <Link href='/learn' >EXPLORE</Link>
                <Link href='https://joinoasys.org' >ABOUT</Link>
        </Nav>
    )
}

export default NavBar;