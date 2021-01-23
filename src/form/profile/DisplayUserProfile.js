import React from "react";
import { Table, Grid, Button, Icon } from "semantic-ui-react";
import "../style.css";
function DisplayUserProfile(props) {
  let {
    firstname,
    lastname,
    userAge,
    userGender,
    userAddr1,
    userAddr2,
    userAddr3,
    userCountry,
    userCounty,
    enableEditing,
    urlId,
    loggedInId,
  } = props;
  return (
    <>
      <span className="tab-headers">
        {firstname === "" && lastname === ""
          ? "No Name Found"
          : `${firstname} ${lastname}`}
      </span>
      <Grid style={{ marginTop: "50px" }} columns="equal" centered>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">Age :</span>
          </Grid.Column>
          <Grid.Column>{userAge}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">Gender :</span>
          </Grid.Column>
          <Grid.Column>{userGender}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">Address Line 1 :</span>
          </Grid.Column>
          <Grid.Column>{userAddr1}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">Address Line 2 :</span>
          </Grid.Column>
          <Grid.Column>{userAddr2}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">Address Line 3 :</span>
          </Grid.Column>
          <Grid.Column>{userAddr3}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column>
            <span className="address-text">County :</span>
          </Grid.Column>
          <Grid.Column>{userCounty}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>

          <Grid.Column>
            <span className="address-text">Country :</span>
          </Grid.Column>

          <Grid.Column>{userCountry}</Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
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
export default DisplayUserProfile;
