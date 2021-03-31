import React, { useState, useEffect, useCallback } from "react";
import { Grid, Button, Icon, Statistic, Popup, Table } from "semantic-ui-react";
import UserProfessionTag from "../../genericComponents/UserProfessionTag";
import { connect } from "react-redux";
import axios from "axios";
import "../style.css";
import RecentPosts from "./RecentPosts";
import FollowerDisplay from "./FollowerDisplay";
import _ from "lodash";

function DisplayUserProfile(props) {
  let {
    firstname,
    lastname,
    userAddr1,
    userAddr2,
    userAddr3,
    userCountry,
    userCounty,
    enableEditing,
    urlId,
    loggedInId,
    professionId,
  } = props;
  const headers = {
    "Content-Type": "application/json",
  };

  let [userFollowers, setUserFollowers] = useState([]);
  let [userFollowing, setUserFollowing] = useState([]);
  let [following, setFollowing] = useState(false);
  let [posts, setPosts] = useState([]);
  async function getPosts() {
    let data = {
      author_id: urlId,
    };
    try {
      await axios
        .post("http://localhost:8080/api/v1/posts/recent", data, { headers })
        .then((res) => setPosts(res.data));
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getPosts();
  }, [urlId]);

  useEffect(() => {
    let found = _.filter(userFollowers, _.matches({ id: loggedInId }));
    if (found.length > 0) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [urlId, userFollowers]);

  let mapsAdd = `http://www.google.com/maps/embed/v1/place?key=AIzaSyBMpl7kzfpil4n_iGXvQdGgu_QaPvoDvjc&q=${userAddr1},${userAddr2},${userAddr3},${userCounty},${userCountry}`;

  async function follow() {
    let data = {
      parent_id: loggedInId,
      sub_id: urlId,
    };
    try {
      await axios
        .post(`http://localhost:8080/api/v1/user/follow`, data, {
          headers: headers,
        })
        .then(() => {
          setFollowing(true);
          triggerReload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  const triggerFollow = () => {
    setFollowing(true);
    follow();
  };

  async function unfollow() {
    let data = {
      parent_id: loggedInId,
      sub_id: urlId,
    };
    try {
      await axios
        .post(`http://localhost:8080/api/v1/user/unfollow`, data, {
          headers: headers,
        })
        .then(() => {
          setFollowing(false);
          triggerReload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  const triggerUnfollow = () => {
    setFollowing(false);
    unfollow();
  };

  async function getFollowers() {
    try {
      await axios
        .get(`http://localhost:8080/api/v1/user/${urlId}/followers`, {
          headers: headers,
        })
        .then((res) => {
          setUserFollowers(res.data);
        });
    } catch (error) {
      setUserFollowers([]);
    }
  }
  async function getFollowing() {
    try {
      await axios
        .get(`http://localhost:8080/api/v1/user/${urlId}/following`, {
          headers: headers,
        })
        .then((res) => {
          setUserFollowing(res.data);
        });
    } catch (error) {
      setUserFollowing([]);
    }
  }

  const triggerReload = () => {
    getFollowers();
    getFollowing();
    getPosts();
  };

  useEffect(() => {
    triggerReload();
  }, [urlId]);

  return (
    <>
      <span className="tab-headers">
        {firstname === "" && lastname === "" ? (
          <span className="tab-headers-text">"No Name Found"</span>
        ) : (
          <>
            {loggedInId !== urlId ? (
              following ? (
                <Button id="unfollow-button" onClick={triggerUnfollow}>
                  <Icon.Group>
                    <Icon name="user" />
                    <Icon name="close" corner="bottom left" />
                  </Icon.Group>
                  Unfollow
                </Button>
              ) : (
                <Button id="follow-button" onClick={triggerFollow}>
                  <Icon name="user" />
                  Follow
                </Button>
              )
            ) : null}

            <span
              className="tab-headers-text"
              style={professionId > 0 ? { paddingRight: "30px" } : null}
            >
              {firstname} {lastname}
            </span>
            {professionId > 0 ? (
              <UserProfessionTag
                professionId={professionId}
                style={{
                  marginRight: "30px",
                  position: "relative",
                  bottom: "10px",
                }}
              />
            ) : null}
          </>
        )}
      </span>

      <Grid style={{ marginTop: "50px" }} columns="equal" centered>
        <Grid.Row>
          <span style={{ paddingRight: "150px" }}>
            {userFollowers.length > 0 ? (
              <Popup
                content={
                  <Table>
                    <Table.Body id="follower-table-body">
                      {userFollowers.map((item) => {
                        return (
                          <>
                            <FollowerDisplay follower={item} />
                          </>
                        );
                      })}
                    </Table.Body>
                  </Table>
                }
                on="click"
                pinned
                position="bottom center"
                trigger={
                  <Statistic size="mini">
                    <Statistic.Value>{userFollowers.length}</Statistic.Value>
                    <Statistic.Label>Followers</Statistic.Label>
                  </Statistic>
                }
              />
            ) : (
              <Statistic size="mini">
                <Statistic.Value>0</Statistic.Value>
                <Statistic.Label>Followers</Statistic.Label>
              </Statistic>
            )}
          </span>
          {userFollowing.length > 0 ? (
            <Popup
              content={
                <Table>
                  <Table.Body id="follower-table-body">
                    {userFollowing.map((item) => {
                      return (
                        <>
                          <FollowerDisplay follower={item} />
                        </>
                      );
                    })}
                  </Table.Body>
                </Table>
              }
              on="click"
              pinned
              position="bottom center"
              trigger={
                <Statistic size="mini">
                  <Statistic.Value>{userFollowing.length}</Statistic.Value>
                  <Statistic.Label>Following</Statistic.Label>
                </Statistic>
              }
            />
          ) : (
            <Statistic size="mini">
              <Statistic.Value>0</Statistic.Value>
              <Statistic.Label>Following</Statistic.Label>
            </Statistic>
          )}
        </Grid.Row>

        <Grid.Row>
          <RecentPosts
            data={posts}
            tableId="user-recent-table"
            postTitleHeader="Recent Posts"
          />
        </Grid.Row>

        <Grid.Row>
          <span className="tab-headers-text">Practice Location</span>
        </Grid.Row>
        <Grid.Row>
          <iframe
            id="map_canvas"
            name="map_canvas"
            width="70%"
            height="300px"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={mapsAdd}
          ></iframe>
        </Grid.Row>

        <Grid.Row centered>
          {urlId === loggedInId ? (
            <Button onClick={enableEditing}>
              <Icon name="edit" />
              Edit
            </Button>
          ) : null}
        </Grid.Row>
      </Grid>
    </>
  );
}

function mapStateToProps(state) {
  return {
    reduxUser: state.user,
  };
}

export default connect(mapStateToProps, null)(DisplayUserProfile);
