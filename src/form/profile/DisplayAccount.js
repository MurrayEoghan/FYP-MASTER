import React from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import "../style.css";

function DisplayUserAccount(props) {
  let {
    currentEmail,
    currentUsername,
    fname,
    lname,
    enableEditing,
    urlId,
    loggedInId,
  } = props;

  return (
    <>
      <span className="tab-headers">
        {fname === "" && lname === "" ? "No Name Found" : `${fname} ${lname}`}
      </span>
      <Grid style={{ marginTop: "50px" }} columns="equal" centered>
        <Grid.Row className="profile-rows">
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">Username :</span>
          </Grid.Column>
          <Grid.Column>{currentUsername}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row className="profile-rows">
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">Email Address :</span>
          </Grid.Column>
          <Grid.Column>{currentEmail}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row centered className="profile-rows">
          {urlId === loggedInId ? (
            <Button simple onClick={enableEditing}>
              <Icon name="edit" />
              Edit
            </Button>
          ) : null}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default DisplayUserAccount;
