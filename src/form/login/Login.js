import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Container,
  Image,
  Button,
  Icon,
  Form,
  Message,
  Tab,
  Divider,
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import SignUp from "../signup/SignUp";
import "../style.css";
import logo from "../../logo.png";

function Login(props) {
  const panes = [
    {
      menuItem: "Login",
      render: () => (
        <Tab.Pane attached={false}>
          <Form id="login-grid">
            <Form.Field className="grid-row">
              <Icon
                name="user circle"
                size="massive"
                className="generic-form-header-icon"
              />
            </Form.Field>
            <Form.Field className="grid-row">
              <label>
                <label>
                  <span className="form-label">Username</span>
                </label>

                <Form.Input
                  fluid
                  placeholder="User name"
                  icon="user"
                  value={username}
                  onChange={handleUsername}
                  error={error}
                />
              </label>
            </Form.Field>

            <Form.Field className="grid-row">
              <label>
                <span className="form-label">Password</span>
                <Form.Input
                  type="password"
                  fluid
                  placeholder="Password - Min 6 Characters"
                  value={password}
                  icon="key"
                  onChange={handlePassword}
                  error={error}
                />
              </label>
            </Form.Field>

            <Form.Field className="grid-row">
              <Button
                id="submit-button"
                onClick={triggerLogInFunctions}
                fluid
                content="Submit"
                disabled={
                  username.length > 2
                    ? password.length > 5
                      ? false
                      : true
                    : true
                }
              />
            </Form.Field>
          </Form>
          {error ? <Message error header="Invalid Login Details." /> : null}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Sign Up",

      render: () => (
        <Tab.Pane attached={false}>
          <SignUp triggerReload={triggerReload} />
        </Tab.Pane>
      ),
    },
  ];
  let { triggerReload } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const headers = {
    "Content-Type": "application/json",
  };
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [activeTab, setActiveTab] = useState(0);
  let [tabStyle, setTabStyle] = useState({});
  let [error, setError] = useState(false);
  const data = {
    username: username,
    password: password,
  };
  function handlePassword(e) {
    setPassword(e.target.value);
  }
  function handleUsername(e) {
    setUsername(e.target.value);
  }

  async function handleSubmit() {
    try {
      await axios
        .post("http://localhost:8080/api/v1/login", data, { headers: headers })
        .then((res) => {
          if (res.data) {
            sessionStorage.setItem(
              "user",
              JSON.stringify({ user: res.data.username })
            );
            sessionStorage.setItem("id", res.data.id);
            sessionStorage.setItem("profession_id", res.data.profession_id);
            history.push("/dashboard");
            setError(false);
          }
        });
    } catch (err) {
      setError(true);
    }
  }

  async function triggerLogInFunctions() {
    await handleSubmit();
    let loggedInUserId = JSON.parse(sessionStorage.getItem("id"));
    let loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    let followers = [];
    let following = [];
    try {
      await axios
        .get(`http://localhost:8080/api/v1/user/${loggedInUserId}/followers`, {
          headers: headers,
        })
        .then((res) => {
          followers = res.data;
        });
    } catch (err) {
      console.log(err);
    }
    try {
      await axios
        .get(`http://localhost:8080/api/v1/user/${loggedInUserId}/following`, {
          headers: headers,
        })
        .then((res) => {
          following = res.data;
        });
    } catch (err) {
      console.log(err);
    }
    triggerReload();
    dispatch({
      type: "USER_LOGIN",
      payload: {
        id: parseInt(loggedInUserId),
        username: loggedInUser,
        following: following,
        followers: followers,
      },
    });
  }

  const handleTabChange = (e, { activeIndex }) => {
    setActiveTab(activeIndex);
  };
  useEffect(() => {
    if (activeTab === 0) {
      setTabStyle({ position: "relative", top: "150px", left: "25vw" });
    } else {
      setTabStyle({ position: "relative", top: "30px", left: "25vw" });
    }
  }, [activeTab]);

  return (
    <Container id="container" textAlign="center">
      <Image src={logo} id="home-logo" />
      <Divider
        vertical
        style={{
          color: "white !important",
          backgroundColor: "white !important",
        }}
        inverted
      />
      <Tab
        menu={{
          secondary: true,
          attached: false,
          pointing: true,

          tabular: false,
        }}
        onTabChange={handleTabChange}
        activeIndex={activeTab}
        panes={panes}
        style={tabStyle}
      />
    </Container>
  );
}

export default connect()(Login);
