import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "semantic-ui-react";
import { connect } from "react-redux";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function EditUserAccount(props) {
  let {
    profileId,
    currentEmail,
    currentUsername,
    disableEditing,
    saveToast,
  } = props;
  let [newUsername, setNewUsername] = useState("");
  let [newPassword, setNewPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [newEmail, setNewEmail] = useState("");
  let [confirmEmail, setConfirmEmail] = useState("");

  let [usernameError, setUsernameError] = useState(true);
  let [passwordFormatError, setPasswordFormatError] = useState(true);
  let [passwordError, setPasswordError] = useState(true);
  let [emailError, setEmailError] = useState(true);
  let [emailFormatError, setEmailFormatError] = useState(true);

  useEffect(() => {
    setNewEmail(currentEmail);
    setConfirmEmail(currentEmail);
    setNewUsername(currentUsername);
  }, [props]);

  useEffect(() => {
    if (!newUsername.match(/[_/@"'<>.,£!$%^&]/) && newUsername.length > 6) {
      setUsernameError(false);
    } else {
      setUsernameError(true);
    }
  }, [newUsername]);

  useEffect(() => {
    if (!newPassword.match(/[_/@"'<>.,£!$%^&]/)) {
      setPasswordFormatError(false);
    } else {
      setPasswordFormatError(true);
    }
    if (newPassword.length > 8 && newPassword === confirmPassword) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (newEmail === confirmEmail) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
    if (newEmail.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g)) {
      setEmailFormatError(false);
    } else {
      setEmailFormatError(true);
    }
  }, [newEmail, confirmEmail]);

  const headers = {
    "Content-Type": "application/json",
  };
  const data = {
    id: parseInt(profileId),
    username: newUsername,
    email: newEmail,
    password: newPassword,
  };
  async function handleSubmit() {
    try {
      await axios
        .post("http://localhost:8080/api/v1/update/account", data, {
          headers: headers,
        })
        .then((res) => {
          disableEditing();
          toast.success("Update Success", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    } catch (err) {
      toast.error("Update Failed", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err);
    }
  }

  return (
    <>
      <span className="tab-headers">Edit Account</span>

      <Container id="form-container">
        <Form widths="equal" autoComplete={false}>
          <Form.Field>
            <label>Username</label>
            <Form.Input
              placeholder="New Username"
              value={newUsername}
              fluid
              onChange={(e) => setNewUsername(e.target.value)}
              error={
                usernameError
                  ? {
                      content: "No Special Characters. Min 7 Characters",
                      pointing: "below",
                    }
                  : false
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Password</label>
            <Form.Input
              type="password"
              placeholder="New Password"
              fluid
              error={
                passwordFormatError
                  ? {
                      content: "Banned Characters Found.",
                      pointing: "below",
                    }
                  : false
              }
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <Form.Input
              placeholder="Confirm Password"
              type="password"
              fluid
              error={
                passwordError
                  ? {
                      content:
                        "Passwords Do Not Match or Less Than 8 Characters",
                      pointing: "below",
                    }
                  : false
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <Form.Input
              placeholder="Email"
              fluid
              error={
                emailFormatError
                  ? { content: "Incorrect Email Format", pointing: "below" }
                  : false
              }
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <label>Confirm Email</label>
            <Form.Input
              placeholder="Confirm Email"
              value={profileId}
              fluid
              error={
                emailError
                  ? { content: "Emails Do Not Match.", pointing: "below" }
                  : false
              }
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <Button.Group>
              <Button
                primary
                icon="save"
                content="Save"
                disabled={
                  !usernameError &&
                  !passwordError &&
                  !emailError &&
                  !emailFormatError &&
                  !passwordFormatError
                    ? false
                    : true
                }
                onClick={handleSubmit}
              />
              <Button.Or />
              <Button icon="close" onClick={disableEditing}>
                Cancel
              </Button>
            </Button.Group>
          </Form.Field>
        </Form>
        <ToastContainer />
      </Container>
    </>
  );
}
export default connect()(EditUserAccount);
