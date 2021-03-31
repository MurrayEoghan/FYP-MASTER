import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Header,
  Table,
  Icon,
  Input,
  Popup,
  Form,
} from "semantic-ui-react";
import CreatePost from "../post/CreatePost";
import { connect } from "react-redux";
import * as moment from "moment";
import "./styles.css";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";

function Forum() {
  let [data, setData] = useState([]);
  let [topics, setTopics] = useState([]);
  let [reload, setReload] = useState(false);
  let [filteredData, setFilteredData] = useState([]);
  let [sortedOrder, setSortedOrder] = useState(false);
  let [filterMode, setFilterMode] = useState(false);
  let [parentTopic, setParentTopic] = useState();

  let loggedInUserId = parseInt(sessionStorage.getItem("id"));
  let loggedInUser = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    async function getPosts() {
      await axios
        .get("http://localhost:8080/api/v1/posts")
        .then((res) => setData(res.data));
    }
    getPosts();
  }, [reload]);

  useEffect(() => {
    async function getTopics() {
      await axios.get("http://localhost:8080/api/v1/topics").then((res) => {
        setTopics(res.data);
      });
    }
    getTopics();
  }, []);
  const subTopicList = topics.map((obj) => {
    return {
      key: obj.SubTopicId,
      text: obj.sub_topic,
      value: obj.SubTopicId,
      parent_id: obj.parent_topic_id,
    };
  });

  const uniqueTopics = [
    ...new Map(
      topics
        .map((obj) => {
          return {
            key: obj.topic_id,
            text: obj.topic,
            value: obj.topic_id,
          };
        })
        .map((item) => [JSON.stringify(item), item])
    ).values(),
  ];
  const handleSearch = (e) => {
    let val = e.target.value;

    setFilteredData(
      data.filter((item) => {
        if (val == null) return data;
        else if (item.title.toLowerCase().includes(val.toLowerCase())) {
          return filteredData;
        }
      })
    );
  };

  useEffect(() => {
    if (filteredData.length === 0) {
      switch (sortedOrder) {
        case false:
          return setData(_.orderBy(data, ["votes"], ["desc"]));
        case true:
          return setData(_.orderBy(data, ["votes"], ["asc"]));
        default:
          return null;
      }
    }
    switch (sortedOrder) {
      case false:
        return setFilteredData(_.orderBy(filteredData, ["votes"], ["desc"]));
      case true:
        return setFilteredData(_.orderBy(filteredData, ["votes"], ["asc"]));
      default:
        return null;
    }
  }, [sortedOrder]);
  const handleParentTopicDropdown = (e, { value }) => {
    setParentTopic(value);
  };
  const handleSubTopicDropdown = (e, { value }) => {
    setFilteredData(
      data.filter((item) => {
        if (value == null) return data;
        else if (item.subTopic === value) {
          return filteredData;
        }
      })
    );
  };

  const handleFilterReset = () => {
    setFilterMode(false);
    setFilteredData(data);
  };
  return (
    <Grid id="table-grid">
      <Grid.Column>
        <Grid.Row>
          <div id="forum-header">
            <span id="title">Forum</span>
            {loggedInUser ? (
              <>
                <CreatePost
                  uniqueTopics={uniqueTopics}
                  activeUser={loggedInUser.user}
                  subTopicList={subTopicList}
                  activeUserId={loggedInUserId}
                  reload={() => setReload(!reload)}
                  trigger={
                    <Button id="button-styles">
                      <Icon name="add" />
                      Create Post
                    </Button>
                  }
                />
                {filterMode ? (
                  <Button id="filter-button-style" onClick={handleFilterReset}>
                    <Icon name="close" />
                    Reset
                  </Button>
                ) : (
                  <Button
                    id="filter-button-style"
                    onClick={() => setFilterMode(true)}
                  >
                    <Icon name="filter" />
                    Filter Post
                  </Button>
                )}
              </>
            ) : null}
          </div>
        </Grid.Row>
        {filterMode ? (
          <Grid.Row>
            <div id="filter-container">
              <Form>
                <Form.Group widths="equal">
                  <Form.Select
                    style={{ marginRight: "20px" }}
                    options={uniqueTopics}
                    onChange={handleParentTopicDropdown}
                    placeholder="Main Topic"
                  />
                  <Form.Select
                    disabled={parentTopic === undefined ? true : false}
                    options={
                      parentTopic
                        ? subTopicList.filter(
                            (obj) => obj.parent_id === parentTopic
                          )
                        : []
                    }
                    onChange={handleSubTopicDropdown}
                    placeholder="Sub Topic"
                  />
                </Form.Group>
              </Form>
            </div>
          </Grid.Row>
        ) : null}

        <Grid.Row>
          <Table basic="very" celled collapsing id="table">
            <Table.Header id="table-header">
              <Table.Row>
                <Popup
                  content="Click To Sort"
                  position="left center"
                  trigger={
                    <Table.HeaderCell
                      width={2}
                      id="table-headers"
                      onClick={() => setSortedOrder(!sortedOrder)}
                    >
                      Votes
                    </Table.HeaderCell>
                  }
                />
                <Table.HeaderCell id="table-post-header">
                  Post
                  <Input
                    type="search"
                    icon="search"
                    size="mini"
                    className="post-searchterm"
                    onChange={handleSearch}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell width={4} id="table-headers">
                  Author
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {filteredData.length > 0 ? (
              <Table.Body>
                {filteredData.map((post) => {
                  return (
                    <Table.Row>
                      <Table.Cell width={2}>
                        <Header as="h2" textAlign="center">
                          <span className="post-header">{post.votes}</span>
                        </Header>
                      </Table.Cell>

                      <Table.Cell>
                        <Header as="h3">
                          <Header.Content>
                            <Link to={`/forum/post/${post.id}`}>
                              <span className="post-header">{post.title}</span>
                            </Link>
                            <Header.Subheader>
                              Date Posted :
                              {moment(post.date).format("DD/MM/YYYY")}
                            </Header.Subheader>
                          </Header.Content>
                        </Header>
                      </Table.Cell>

                      <Table.Cell width={4}>
                        <Header as="h4" textAlign="center">
                          <span className="post-header">{post.author}</span>
                        </Header>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            ) : (
              <Table.Body>
                {data.map((post) => {
                  return (
                    <Table.Row key={post.id}>
                      <Table.Cell width={2}>
                        <Header as="h2" textAlign="center">
                          <span className="post-header">{post.votes}</span>
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <Header as="h3">
                          <Header.Content>
                            <Link to={`/forum/post/${post.id}`}>
                              <span className="post-header">{post.title}</span>
                            </Link>
                            <Header.Subheader>
                              Date Posted :
                              {moment(post.date).format("DD/MM/YYYY")}
                            </Header.Subheader>
                          </Header.Content>
                        </Header>
                      </Table.Cell>
                      <Table.Cell width={4}>
                        <Header as="h4" textAlign="center">
                          <span className="post-header">{post.author}</span>
                        </Header>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            )}
          </Table>
        </Grid.Row>
        <Grid.Row textAlign="center">
          <span id="footer">Showing {data.length} Results</span>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
}

export default connect()(Forum);
