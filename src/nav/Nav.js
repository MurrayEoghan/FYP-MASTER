import React, {useState} from "react"
import {Router, Route, Switch} from "react-router"
import { BrowserRouter, Link } from "react-router-dom"
import Login from "../form/login/Login"
import "./style.css"
import logo from "../logo.png"
import { Container, Icon, Menu, Image } from "semantic-ui-react"

function Nav(){


    let [activeItem, setActiveItem] = useState("")

    const handleMenuClick = (e) =>{
        setActiveItem(e.target.value);
    }

    const login = "/login"
    const signup = "/signup"

    return(
        <>
        {/* <div className="nav"> */}
        <div className="nav">
            <Menu fluid secondary>
                    <Menu.Item
                        as={Link}
                    >
                        <span className="menu-link-left"><Icon name="home"/> Home</span>
                    </Menu.Item>
                    <Menu.Item 
                        as={Link}
                    >
                        <span className="menu-link-left"><Icon name="comments"/> Forum</span>
                    </Menu.Item>
                <Container textAlign="center">
                   <Image centered src={logo} id="logo"/>
               </Container>
               <Menu.Item
                    position="right"
                    to={login}
                    as={Link}

               >
                  <span className="menu-link-right"><Icon name="sign-in"/> Log In</span>
               </Menu.Item>
               <Menu.Item
                    to={signup}
                    as={Link}
               >
                  <span className="menu-link-right"><Icon name="add user"/> Sign Up</span>
               </Menu.Item>
            </Menu>
            </div>
        <Switch>
            <Route path={login} component={Login}/>
            <Route path={signup} component={null}/>
        </Switch>

        </>
    )
}

export default Nav