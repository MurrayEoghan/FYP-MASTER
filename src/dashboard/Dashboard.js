import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Container,
  Table,
  Statistic,
  Popup,
  Button,
  Message,
} from "semantic-ui-react";
import "../dashboard/style.css";
import { connect } from "react-redux";
import UserProfessionTag from "../genericComponents/UserProfessionTag";
import FollowerDisplay from "../form/profile/FollowerDisplay";
import axios from "axios";
import RecentPosts from "../form/profile/RecentPosts";
import Notification from "../genericComponents/Notification";

function Dashboard() {
  let [notifications, setNotifications] = useState([]);
  let [recentFollowerPosts, setRecentFollowerPosts] = useState([]);
  let [recentUserPosts, setRecentUserPosts] = useState([]);
  let [userFollowers, setUserFollowers] = useState([]);
  let [userFollowing, setUserFollowing] = useState([]);

  let loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  let loggedInProfessionId = parseInt(sessionStorage.getItem("profession_id"));
  let loggedInUserId = parseInt(sessionStorage.getItem("id"));

  const headers = {
    "Content-Type": "application/json",
  };

  const getNotifications = useCallback(async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .get(
          `http://localhost:8080/api/v1/user/${loggedInUserId}/notifications`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setNotifications(res.data);
        });
    } catch (err) {
      setNotifications([]);
    }
  }, [loggedInUserId]);
  const getFollowing = useCallback(async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .get(`http://localhost:8080/api/v1/user/${loggedInUserId}/following`, {
          headers: headers,
        })
        .then((res) => {
          setUserFollowing(res.data);
        });
    } catch (error) {
      setUserFollowing([]);
    }
  }, [loggedInUserId]);
  const getFollowers = useCallback(async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .get(`http://localhost:8080/api/v1/user/${loggedInUserId}/followers`, {
          headers: headers,
        })
        .then((res) => {
          setUserFollowers(res.data);
        });
    } catch (error) {
      setUserFollowers([]);
    }
  }, [loggedInUserId]);

  const getPosts = useCallback(async () => {
    let data = {
      author_id: loggedInUserId,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .post("http://localhost:8080/api/v1/posts/recent", data, {
          headers: headers,
        })
        .then((res) => setRecentUserPosts(res.data));
    } catch (err) {
      console.log(err);
    }
  }, [loggedInUserId]);

  const getFollowingPosts = useCallback(async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .get(
          `http://localhost:8080/api/v1/user/${loggedInUserId}/following/posts`,
          { headers: headers }
        )
        .then((res) => {
          setRecentFollowerPosts(res.data);
        });
    } catch (err) {
      setRecentFollowerPosts([]);
    }
  }, [loggedInUserId]);

  async function clearNotifications() {
    try {
      await axios
        .delete(
          `http://localhost:8080/api/v1/user/${loggedInUserId}/notifications/delete`,
          { headers: headers }
        )
        .then(() => {
          setNotifications([]);
        });
    } catch (err) {
      console.log("No Notifications to delete");
    }
  }

  useEffect(() => {
    getFollowers();
    getFollowing();
    getPosts();
    getNotifications();
    getFollowingPosts();
  }, [
    getFollowers,
    getFollowing,
    getFollowingPosts,
    getPosts,
    getNotifications,
  ]);

  return (
    <Container id="dashboard-container">
      {loggedInUser ? (
        <Grid style={{ width: "100vw" }}>
          <Grid.Column>
            <Grid.Row>
              <span id="username-text">{loggedInUser.user}</span>
              <span id="user-tag">
                <UserProfessionTag
                  professionId={loggedInProfessionId}
                  style={{
                    marginRight: "30px",
                    position: "relative",
                    bottom: "10px",
                  }}
                />
              </span>
            </Grid.Row>

            <Grid.Row style={{ position: "relative", top: "50px" }}>
              <span style={{ paddingRight: "150px" }}>
                {userFollowers.length > 0 ? (
                  <Popup
                    content={
                      <Table>
                        <Table.Body id="follower-table-body">
                          {userFollowers.map((item, i) => {
                            return (
                              <span key={i}>
                                <FollowerDisplay follower={item} />
                              </span>
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
                        <Statistic.Value>
                          {userFollowers.length}
                        </Statistic.Value>
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
            <Grid.Row style={{ position: "relative", top: "50px" }}>
              {recentUserPosts.length > 0 ? (
                <RecentPosts
                  data={recentUserPosts}
                  tableId="recent-table"
                  postTitleHeader="Your Recent Posts"
                />
              ) : (
                <Message
                  warning
                  icon="inbox"
                  header="No Recent Posts Found"
                  content="Try creating some posts. Most recent ones will appear here."
                  id="no-user-posts-msg"
                />
              )}

              <Table id="notification-display">
                {notifications.length > 0 ? (
                  <Table.Body id="notification-table">
                    <Table.Row>
                      <Table.Cell>
                        <Button
                          color="red"
                          content="Clear"
                          fluid
                          inverted
                          onClick={clearNotifications}
                        />
                      </Table.Cell>
                    </Table.Row>
                    {notifications.map((item) => {
                      return <Notification inboundNotification={item} />;
                    })}
                  </Table.Body>
                ) : (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <Message
                          color="green"
                          content="No Notifications"
                          id="notification-message"
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )}
              </Table>
              {recentFollowerPosts.length > 0 ? (
                <RecentPosts
                  data={recentFollowerPosts}
                  tableId="recent-follower-table"
                  postTitleHeader="Your Following Users Recent Posts"
                />
              ) : (
                <Message
                  warning
                  icon="inbox"
                  header="No Follower User Posts Found"
                  content="Try following some people to see their new posts here."
                  id="no-following-posts-msg"
                />
              )}
            </Grid.Row>
          </Grid.Column>
        </Grid>
      ) : (
        <span id="username-text">Access Denied. Log In</span>
      )}
    </Container>
  );
}

export default connect()(Dashboard);
