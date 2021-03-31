import React from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import "../style.css";
import UserProfessionTag from "../../genericComponents/UserProfessionTag";

function DisplayUserAccount(props) {
  let {
    currentEmail,
    currentUsername,
    fname,
    lname,
    enableEditing,
    urlId,
    loggedInId,
    professionId,
  } = props;

  return (
    <>
      <span className="tab-headers">
        <span className="tab-headers-text">
          {fname === "" && lname === "" ? "No Name Found" : `${fname} ${lname}`}
        </span>
        <span id="profession-tag">
          <UserProfessionTag
            professionId={professionId}
            style={{
              marginRight: "30px",
              marginLeft: "30px",
              position: "relative",
              bottom: "10px",
            }}
          />
        </span>
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
