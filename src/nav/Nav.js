import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Login from "../form/login/Login";
import SignUp from "../form/signup/SignUp";
import EditProfile from "../form/profile/Profile";
import Notification from "../genericComponents/Notification";
import Forum from "../forum/main/Forum";
import "./style.css";
import logo from "../logo.png";
import axios from "axios";
import { useHistory } from "react-router-dom";

import {
  Container,
  Icon,
  Menu,
  Image,
  Dropdown,
  Label,
  Message,
  Table,
  Popup,
  Button,
} from "semantic-ui-react";
import PostDisplay from "../forum/post/PostDisplay";
import Dashboard from "../dashboard/Dashboard";

function Nav(props) {
  let { user } = props;
  let userId = user[0].id;
  const history = useHistory();

  const headers = {
    "Content-Type": "application/json",
  };
  let [sessionStorageUser, setSessionStorageUser] = useState({});
  let [backUpUserId, setBackUpUserId] = useState();
  let [notifications, setNotifications] = useState([]);

  async function getData() {
    let user = await JSON.parse(sessionStorage.getItem("user"));
    let id = await JSON.parse(sessionStorage.getItem("id"));

    setSessionStorageUser(user);
    setBackUpUserId(id);
  }

  async function getNotifications() {
    try {
      await axios
        .get(`http://localhost:8080/api/v1/user/${userId}/notifications`, {
          headers: headers,
        })
        .then((res) => {
          setNotifications(res.data);
        });
    } catch (err) {
      setNotifications([]);
    }
  }

  async function clearNotifications() {
    try {
      await axios
        .delete(
          `http://localhost:8080/api/v1/user/${userId}/notifications/delete`,
          { headers: headers }
        )
        .then(() => {
          setNotifications([]);
        });
    } catch (err) {
      console.log("No Notifications to delete");
    }
  }

  useEffect(() => {
    getData();
    getNotifications();
  }, [user]);

  const handleLogOut = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("profession_id");

    history.push("/");
    setSessionStorageUser(null);
    window.location.reload();
  };
  const startup = "/";
  const dashboard = "/dashboard";
  const login = "/login";
  const signup = "/signup";
  const forum = "/forum";
  const profileURL = `/profile/:id`;
  const postURL = `/forum/post/:id`;

  return (
    <>
      <div className="nav">
        <Menu fluid secondary>
          {sessionStorageUser === null ? null : (
            <>
              <Menu.Item as={Link} to={dashboard}>
                <span className="menu-link-left">
                  <Icon name="table" /> Dashboard
                </span>
              </Menu.Item>
              <Menu.Item to={forum} as={Link}>
                <span className="menu-link-left">
                  <Icon name="comments" /> Forum
                </span>
              </Menu.Item>
            </>
          )}
          <Container id="logo-container">
            <Image src={logo} id="logo" />
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
            <>
              <Menu.Item
                style={{
                  position: "absolute",
                  right: "200px",
                }}
              >
                <Popup
                  pinned
                  on="click"
                  style={{ backgroundColor: "#7d0541" }}
                  position="bottom center"
                  trigger={
                    <div id="notifications-icon">
                      <Label size="mini" color="red">
                        {notifications.length}
                      </Label>
                      <Icon
                        name="bell"
                        style={{
                          position: "relative",
                          top: "4px",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  }
                  content={
                    <Table>
                      {notifications.length > 0 ? (
                        <Table.Body id="notification-table">
                          <Table.Row>
                            <Button
                              color="red"
                              content="Clear"
                              fluid
                              inverted
                              onClick={clearNotifications}
                            />
                          </Table.Row>
                          {notifications.map((item) => {
                            return <Notification inboundNotification={item} />;
                          })}
                        </Table.Body>
                      ) : (
                        <Table.Body id="notification-table">
                          <Message
                            warning
                            style={{ height: "100%" }}
                            content="No Notifications"
                          />
                        </Table.Body>
                      )}
                    </Table>
                  }
                ></Popup>
              </Menu.Item>

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
            </>
          )}
        </Menu>
      </div>
      <Switch>
        <Route path={dashboard} component={Dashboard} />
        <Route path={login} component={Login} />
        <Route path={signup} component={SignUp} />
        <Route exact path={forum} component={Forum} />
        <Route path={profileURL} component={EditProfile} />
        <Route path={postURL} component={PostDisplay} />
      </Switch>
    </>
  );
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps, null)(Nav);
