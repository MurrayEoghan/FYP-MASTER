import React, { useState, useEffect, useCallback } from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
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
  const headers = { "Content-Type": "application/json" };

  let [sessionStorageUser, setSessionStorageUser] = useState({});
  let [backUpUserId, setBackUpUserId] = useState();
  let [notifications, setNotifications] = useState([]);

  async function getData() {
    let user = await JSON.parse(sessionStorage.getItem("user"));
    let id = await JSON.parse(sessionStorage.getItem("id"));

    setSessionStorageUser(user);
    setBackUpUserId(id);
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
  const getNotifications = useCallback(async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      axios
        .get(`http://localhost:8080/api/v1/user/${userId}/notifications`, {
          headers: headers,
        })
        .then((res) => {
          setNotifications(res.data);
        });
    } catch (err) {
      setNotifications([]);
    }
  }, [userId]);

  useEffect(() => {
    getData();
    getNotifications();
  }, [user, getNotifications]);

  const handleLogOut = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("profession_id");
    history.push("/");
    setSessionStorageUser(null);
    window.location.reload();
  };

  const dashboard = "/dashboard";
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

          <Menu.Item
            style={{
              left: "30px",
              position: "relative",
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
              trigger={
                <span className="menu-link-right">
                  <Icon name="user" />
                  {sessionStorageUser === null ? null : sessionStorageUser.user}
                </span>
              }
            >
              <Dropdown.Menu id="dropdown-menu">
                <Dropdown.Item>
                  <Link
                    to={
                      userId ? `/profile/${userId}` : `/profile/${backUpUserId}`
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
        </Menu>
      </div>
      <Switch>
        <Route path={dashboard} component={Dashboard} />

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
