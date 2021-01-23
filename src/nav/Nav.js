import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Login from "../form/login/Login";
import SignUp from "../form/signup/SignUp";
import EditProfile from "../form/profile/Profile";
import "./style.css";
import logo from "../logo.png";
import { Container, Icon, Menu, Image, Dropdown } from "semantic-ui-react";

function Nav(props) {
  let { user } = props;
  let userId = user[0].id;

  let [sessionStorageUser, setSessionStorageUser] = useState({});
  let [backUpUserId, setBackUpUserId] = useState();
  async function getData() {
    let user = await JSON.parse(sessionStorage.getItem("user"));
    let id = await JSON.parse(sessionStorage.getItem("id"));
    setSessionStorageUser(user);
    setBackUpUserId(id);
    console.log(id);
  }
  useEffect(() => {
    getData();
  }, [user]);

  const handleLogOut = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("id");
    setSessionStorageUser(null);
  };

  const home = "/home";
  const login = "/login";
  const signup = "/signup";
  const forum = "/forum";
  const profileURL = `/profile/:id`;

  return (
    <>
      <div className="nav">
        <Menu fluid secondary>
          <Menu.Item as={Link} to={home}>
            <span className="menu-link-left">
              <Icon name="home" /> Home
            </span>
          </Menu.Item>
          <Menu.Item to={forum} as={Link}>
            <span className="menu-link-left">
              <Icon name="comments" /> Forum
            </span>
          </Menu.Item>
          <Container id="logo-container">
            <Image centered src={logo} id="logo" />
          </Container>
          {sessionStorageUser === null ? (
            <>
              <Menu.Item position="right" to={login} as={Link}>
                <span className="menu-link-right">
                  <Icon name="sign-in" /> Log In
                </span>
              </Menu.Item>
              <Menu.Item to={signup} as={Link}>
                <span className="menu-link-right">
                  <Icon name="add user" /> Sign Up
                </span>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item position="right">
              <Dropdown
                id="dropdown"
                item
                simple
                text={
                  <span className="menu-link-right">
                    <Icon name="user" />
                    {sessionStorageUser === null
                      ? null
                      : sessionStorageUser.user}
                  </span>
                }
              >
                <Dropdown.Menu id="dropdown-menu">
                  <Dropdown.Item>
                    <Link
                      to={
                        userId
                          ? `/profile/${userId}`
                          : `/profile/${backUpUserId}`
                      }
                    >
                      <span className="dropdown-item">
                        <Icon name="user circle" />
                        Profile
                      </span>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <span className="dropdown-item">
                      <Icon name="mail" />
                      Messages
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ backgroundColor: "white" }} />

                  <Dropdown.Item onClick={handleLogOut}>
                    <Link to="/login">
                      <span className="dropdown-item">
                        <Icon name="log out" /> Log Out
                      </span>
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Menu>
      </div>
      <Switch>
        <Route path={home} component={null} />
        <Route path={login} component={Login} />
        <Route path={signup} component={SignUp} />
        <Route path={forum} component={null} />
        <Route path={profileURL} component={EditProfile} />
      </Switch>
    </>
  );
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps, null)(Nav);
