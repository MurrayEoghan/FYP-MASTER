import axios from "axios";
import React, { useState } from "react";
import { Container, Grid, Input, Button, Icon, Form } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import "../style.css";

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();

  const headers = {
    "Content-Type": "application/json",
  };
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
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
            setError(false);
            dispatch({
              type: "USER_LOGIN",
              payload: {
                id: parseInt(res.data.id),
                username: res.data.username,
              },
            });
            sessionStorage.setItem(
              "user",
              JSON.stringify({ user: res.data.username })
            );
            sessionStorage.setItem("id", res.data.id);
            history.push("/forum");
          }
        });
    } catch (err) {
      setError(true);
    }
  }

  return (
    <Container id="container" textAlign="center">
      <Grid id="login-grid">
        <Grid.Column>
          <Form>
            <Form.Field className="grid-row">
              <Icon
                name="user circle"
                size="massive"
                className="generic-form-header-icon"
              />
            </Form.Field>
            <Form.Field className="grid-row">
              <label>
                {error ? (
                  <label>
                    <span style={{ color: "red" }}>User Doesn't Exists!</span>
                  </label>
                ) : (
                  <label>
                    <span className="form-label">Username</span>
                  </label>
                )}
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
                onClick={handleSubmit}
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
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default connect()(Login);
