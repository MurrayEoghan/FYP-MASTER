import React, { useState, useEffect } from "react";
import { Form, Input, Icon, Button, Message } from "semantic-ui-react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

function SignUp(props) {
  let { triggerReload } = props;
  const headers = {
    "Content-Type": "application/json",
  };
  const history = useHistory();
  const dispatch = useDispatch();

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [email, setEmail] = useState("");
  let [confirmEmail, setConfirmEmail] = useState("");

  let [usernameError, setUsernameError] = useState(false);
  let [passwordError, setPasswordError] = useState(false);
  let [emailError, setEmailError] = useState(false);

  let [userExists, setUserExists] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e, confirm) => {
    if (confirm === true) {
      setConfirmPassword(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };
  const handleEmail = (e, confirm) => {
    if (confirm === true) {
      setConfirmEmail(e.target.value);
    } else {
      setEmail(e.target.value);
    }
  };

  const data = {
    username: username,
    password: password,
    email: email,
  };

  useEffect(() => {
    if (!username.match(/[_/@"'<>.,£!$%^&]/) && username.length > 6) {
      setUsernameError(false);
    } else {
      setUsernameError(true);
    }
  }, [username]);

  useEffect(() => {
    if (
      !password.match(/[_/@"'<>.,£!$%^&]/) &&
      password.length > 8 &&
      password === confirmPassword
    ) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  }, [email]);

  async function register() {
    try {
      await axios
        .post("http://localhost:8080/api/v1/signup", data, { headers: headers })
        .then((res) => {
          if (res.data) {
            dispatch({
              type: "USER_LOGIN",
              payload: {
                id: parseInt(res.data.id),
                username: username,
              },
            });
            sessionStorage.setItem("user", JSON.stringify({ user: username }));
            sessionStorage.setItem("id", res.data.id);
            history.push("/forum");
            triggerReload();
          }
        });
    } catch (err) {
      setUserExists(true);
      console.log(err);
    }
  }

  return (
    <>
      <Form id="login-grid">
        <Form.Field className="grid-row">
          <Icon
            name="users"
            size="massive"
            className="generic-form-header-icon"
          />
        </Form.Field>
        <Form.Field className="form-row" required>
          <label>
            <span className="form-label">Username</span>
          </label>
          <Form.Input
            fluid
            placeholder="Username - Min 6 letters"
            value={username}
            error={
              usernameError
                ? { content: "No Special Characters. Min 7 Characters" }
                : false
            }
            onChange={handleUsername}
          />
        </Form.Field>
        <Form.Field className="form-row" required>
          <label>
            <span className="form-label">Password</span>
          </label>
          <Input
            placeholder="Password - Min 8 characters"
            value={password}
            type="password"
            onChange={(e) => handlePassword(e, false)}
          />
        </Form.Field>
        <Form.Field className="form-row" required>
          <label>
            <span className="form-label">Confirm Password</span>
          </label>
          <Form.Input
            placeholder="Confirm Password"
            value={confirmPassword}
            error={
              confirmPassword === password
                ? false
                : { content: "Passwords Do Not Match" }
            }
            type="password"
            onChange={(e) => handlePassword(e, true)}
          />
        </Form.Field>
        <Form.Field className="form-row" required>
          <label>
            <span className="form-label">Email Address</span>
          </label>
          <Form.Input
            placeholder="Email"
            value={email}
            error={emailError ? { content: "Incorrect Email Format" } : false}
            onChange={(e) => handleEmail(e, false)}
          />
        </Form.Field>
        <Form.Field className="form-row" required>
          <label>
            <span className="form-label">Confirm Email Address</span>
          </label>
          <Form.Input
            placeholder="Confirm Email"
            value={confirmEmail}
            error={confirmEmail === email ? false : true}
            onChange={(e) => handleEmail(e, true)}
          />
        </Form.Field>
        <Form.Field className="form-row" required>
          <Button
            id="submit-button"
            content="Register"
            fluid
            disabled={
              usernameError === false &&
              passwordError === false &&
              emailError === false &&
              email === confirmEmail
                ? false
                : true
            }
            onClick={register}
          />
        </Form.Field>
      </Form>
      {userExists ? <Message error header="User Already Exists" /> : null}
    </>
  );
}

export default connect()(SignUp);
