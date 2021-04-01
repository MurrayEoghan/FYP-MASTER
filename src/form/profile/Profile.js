import React, { useState, useEffect, useCallback } from "react";
import EditUserProfile from "./EditProfile";
import EditUserAccount from "./EditAccount";
import DisplayUserProfile from "./DisplayUserProfile";
import DisplayUserAccount from "./DisplayAccount";
import { Container, Image, Grid, Tab, Menu } from "semantic-ui-react";
import null_profile_pic from "../../images/null_profile_pic.png";
import ImageUploadModal from "../../genericComponents/ImageUploadModal";
import { storage } from "../../firebase/FirebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import axios from "axios";
import "../style.css";

function EditProfile(props) {
  let urlUserId = props.match.params.id;
  let parsedUrlId = parseInt(urlUserId);
  let loggedInUserId = JSON.parse(sessionStorage.getItem("id"));

  let [displayProfileEdit, setDisplayProfileEdit] = useState(false);
  let [displayAccountEdit, setDisplayAccountEdit] = useState(false);
  let [image, setImage] = useState(null);
  let [imageChange, setImageChange] = useState(false);

  let [user, setUser] = useState({});

  const saveSuccess = () => {
    toast.success("Update Success", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const getImage = useCallback(() => {
    storage
      .ref(`images/profile_pic_id_${urlUserId}`)
      .getDownloadURL()
      .then((url) => setImage(url));
  }, [urlUserId]);
  useEffect(() => {
    getImage();
  }, [imageChange, getImage]);

  useEffect(() => {
    async function getUrlProfile() {
      await axios
        .get("http://localhost:8080/api/v1/user", {
          params: { id: parseInt(urlUserId) },
        })
        .then((res) => {
          setUser(res.data);
        });
    }
    getUrlProfile();
    getImage();
  }, [urlUserId, displayProfileEdit, displayAccountEdit, getImage]);
  const panes = [
    {
      menuItem: (
        <>
          {parsedUrlId === loggedInUserId ? (
            <Menu.Item disabled style={{ paddingBottom: "30px" }} key={1}>
              <ImageUploadModal
                header={"Profile Picture Upload"}
                userId={loggedInUserId}
                imageReload={() => setImageChange(!imageChange)}
                triggerObj={
                  <Image
                    src={image ? image : null_profile_pic}
                    fluid
                    className="disabled-tab-pane"
                  />
                }
              />
            </Menu.Item>
          ) : (
            <Menu.Item disabled style={{ paddingBottom: "30px" }} key={2}>
              <Image
                src={image ? image : null_profile_pic}
                fluid
                className="disabled-tab-pane"
              />
            </Menu.Item>
          )}
        </>
      ),
    },

    {
      menuItem: "Profile",
      render: () => (
        <Tab.Pane attached={false} id="tab-body">
          {displayProfileEdit ? (
            <EditUserProfile
              profileId={urlUserId}
              userId={loggedInUserId}
              firstname={user.fname}
              lastname={user.lname}
              userAge={user.age}
              userGender={user.gender}
              userAddr1={user.addr1}
              userAddr2={user.addr2}
              userAddr3={user.addr3}
              userCounty={user.county}
              userCountry={user.country}
              disableEditing={() => setDisplayProfileEdit(false)}
              saveToast={saveSuccess}
              professionId={user.profession_id}
            />
          ) : (
            <DisplayUserProfile
              firstname={user.fname}
              lastname={user.lname}
              userAge={user.age}
              userGender={user.gender}
              userAddr1={user.addr1}
              userAddr2={user.addr2}
              userAddr3={user.addr3}
              userCounty={user.county}
              userCountry={user.country}
              urlId={parsedUrlId}
              loggedInId={loggedInUserId}
              enableEditing={() => setDisplayProfileEdit(true)}
              professionId={user.profession_id}
            />
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "About",
      render: () => (
        <Tab.Pane attached={false}>
          {displayAccountEdit ? (
            <EditUserAccount
              profileId={urlUserId}
              userId={loggedInUserId}
              currentUsername={user.username}
              currentEmail={user.email}
              disableEditing={() => setDisplayAccountEdit(false)}
              saveToast={saveSuccess}
            />
          ) : (
            <DisplayUserAccount
              currentEmail={user.email}
              currentUsername={user.username}
              fname={user.fname}
              lname={user.lname}
              enableEditing={() => setDisplayAccountEdit(true)}
              urlId={parsedUrlId}
              loggedInId={loggedInUserId}
              professionId={user.profession_id}
            />
          )}
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Container id="tab-pane-container">
      <Grid>
        <Tab
          id="tab-pane"
          menu={{
            secondary: true,
            vertical: true,
            fluid: true,
          }}
          panes={panes}
          defaultActiveIndex={1}
        />
      </Grid>
      <ToastContainer />
    </Container>
  );
}

export default connect()(EditProfile);
