import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Image,
  Divider,
  Comment,
  Header,
  Form,
  Button,
  Icon,
  Modal,
  Loader,
  Popup,
} from "semantic-ui-react";
import axios from "axios";
import null_profile_pic from "../../images/null_profile_pic.png";
import { storage } from "../../firebase/FirebaseConfig";
import Comments from "./Comments";
import "./styles.css";
import "./comment-styles.css";
import * as moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import UserProfessionTag from "../../genericComponents/UserProfessionTag";
import PostAnswer from "./PostAnswer";

function PostDisplay(props) {
  let urlPostId = props.match.params.id;
  let [post, setPost] = useState({});
  let [comments, setComments] = useState([]);
  let loggedInUserId = parseInt(sessionStorage.getItem("id"));
  let loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  let loggedInProfessionId = parseInt(sessionStorage.getItem("profession_id"));

  let [textAreaValue, setTextAreaValue] = useState("");
  let [editPost, setEditPost] = useState(false);
  let [image, setImage] = useState(null);
  let [updateComments, setUpdateComments] = useState(false);
  let [updateConfirm, setUpdateConfirm] = useState(false);
  let [reloadPost, setReloadPost] = useState(false);
  let [editPostContent, setEditPostContent] = useState("");
  let [imageLoading, setImageLoading] = useState(false);
  let [deleteModal, setDeleteModal] = useState(false);
  let [createAnswer, setCreateAnswer] = useState(false);
  let [createAnswerText, setCreateAnswerText] = useState("");

  async function getImage(id) {
    setImageLoading(true);
    try {
      await storage
        .ref(`images/profile_pic_id_${id}`)
        .getDownloadURL()
        .then((url) => {
          setImage(url);
          setImageLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  }
  const getPost = useCallback(async () => {
    let data = {
      post_id: parseInt(urlPostId),
    };
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .post("http://localhost:8080/api/v1/post", data, { headers })
        .then((res) => {
          setPost(res.data);
          setComments(res.data.comments);
          setImage(getImage(res.data.authorId));
        });
    } catch (err) {
      console.log(err);
    }
  }, [urlPostId]);

  useEffect(() => {
    getPost();
  }, [updateComments, reloadPost, getPost]);

  async function updatePost() {
    let data = {
      post_id: post.post_id,
      author_id: loggedInUserId,
      content: editPostContent,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .patch("http://localhost:8080/api/v1/update/post", data, {
          headers,
        })
        .then(() => {
          toast.success("Post Update Success", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    } catch (err) {
      console.log(err);
    }
    setEditPost(false);
    setUpdateConfirm(false);
    setReloadPost(!reloadPost);
  }
  async function deletePost() {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .delete(`http://localhost:8080/api/v1/delete/post/${post.post_id}`, {
          headers,
        })
        .then(() => {
          window.location = "/forum";
          setDeleteModal(false);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function createComment() {
    const headers = {
      "Content-Type": "application/json",
    };
    let data = {
      comment: textAreaValue,
      parent_post_id: post.post_id,
      comment_author: loggedInUser.user,
      comment_author_id: loggedInUserId,
    };
    try {
      await axios
        .post("http://localhost:8080/api/v1/comment", data, {
          headers,
        })
        .then(() => {
          setTextAreaValue("");
          toast.success("Post Success", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    } catch (err) {
      console.log(err);
    }
    setUpdateComments(!updateComments);
  }

  const handleTextAreaChange = (e) => {
    setTextAreaValue(e.target.value);
  };

  const handleEditTextAreaChange = (e) => {
    setEditPostContent(e.target.value);
  };

  const handleEditMode = (value) => {
    console.log(value);
    switch (value) {
      case true:
        return setEditPost(true);
      case false:
        return setEditPost(false);
      default:
        return null;
    }
  };

  const handleCreateAnswerTextArea = (e) => {
    setCreateAnswerText(e.target.value);
  };

  async function handleCreateAnswer() {
    let data = {
      parent_post_id: post.post_id,
      answer: createAnswerText,
      author_id: loggedInUserId,
      author: loggedInUser.user,
      author_profession: loggedInProfessionId,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      await axios
        .post("http://localhost:8080/api/v1/post/answer/create", data, {
          headers,
        })
        .then(() => {
          setCreateAnswer(false);
          setReloadPost(!reloadPost);
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Grid celled id="grid">
        <Grid.Row columns={2}>
          <Grid.Column
            width={4}
            style={{
              paddingBottom: "20px",
              textAlign: "center",
              paddingTop: "30px",
            }}
          >
            {imageLoading ? (
              <Loader active>Loading</Loader>
            ) : (
              <>
                <span id="author-name">Post Author</span>
                <Image
                  id="author-profile-image"
                  size="small"
                  src={image ? image : null_profile_pic}
                />
                {post.profession_id > 0 ? (
                  <div>
                    <UserProfessionTag
                      professionId={post.profession_id}
                      style={{ marginBottom: "10px" }}
                    />
                  </div>
                ) : null}
                <span id="author-name">{post.author}</span>
                <br />
                <span id="author-date-posted">
                  Posted : {moment(post.date).format("DD/MM/YYYY")}
                </span>
              </>
            )}
          </Grid.Column>
          <Grid.Column style={{ paddingLeft: "30px" }} width={12}>
            <Grid.Row id="header-container">
              <span>
                {post.title}
                {loggedInUserId === post.authorId ? (
                  <>
                    <Modal
                      open={deleteModal}
                      size="small"
                      onOpen={() => setDeleteModal(true)}
                      onClose={() => setDeleteModal(false)}
                      closeIcon
                      trigger={
                        <Button icon floated="right" id="edit-button">
                          <Icon name="trash" />
                        </Button>
                      }
                    >
                      <Modal.Header>Delete Post</Modal.Header>
                      <Modal.Content>
                        Are you sure you want to delete this post? All
                        accompanying content will be lost forever. This cannot
                        be undone.
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          icon="checkmark"
                          labelPosition="left"
                          positive
                          content="Confirm"
                          onClick={deletePost}
                        />
                        <Button
                          icon="close"
                          labelPosition="left"
                          content="Cancel"
                          onClick={() => setDeleteModal(false)}
                        />
                      </Modal.Actions>
                    </Modal>

                    <Button
                      icon
                      floated="right"
                      id="edit-button"
                      onClick={() => handleEditMode(true)}
                    >
                      <Icon name="edit" />
                    </Button>
                  </>
                ) : null}
              </span>
            </Grid.Row>
            <Divider id="divider" />
            <Grid.Row id="post-body">
              {editPost ? (
                <Form>
                  <Form.TextArea
                    id="create-comment-textarea"
                    placeholder={post.content}
                    onChange={handleEditTextAreaChange}
                    rows={7}
                    value={editPostContent}
                  />
                  <Button.Group floated="right">
                    <Modal
                      onClose={() => setUpdateConfirm(false)}
                      onOpen={() => setUpdateConfirm(true)}
                      closeIcon
                      size="mini"
                      open={updateConfirm}
                      trigger={
                        <Button
                          positive
                          content="Update"
                          labelPosition="left"
                          disabled={
                            editPostContent.length < 1 ||
                            editPostContent.match(/[_/@"'<>.,£!$%^&]/)
                              ? true
                              : false
                          }
                          icon="edit"
                          onClick={() => setUpdateConfirm(true)}
                        />
                      }
                    >
                      <Modal.Header>Update Confirm</Modal.Header>
                      <Modal.Content>
                        Are you sure you want to update your post?
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          icon="checkmark"
                          labelPosition="left"
                          positive
                          content="Confirm"
                          onClick={updatePost}
                        />
                      </Modal.Actions>
                    </Modal>
                    <Button.Or />
                    <Button
                      content="Cancel"
                      labelPosition="right"
                      icon="close"
                      onClick={() => handleEditMode(false)}
                    />
                  </Button.Group>
                </Form>
              ) : (
                post.content
              )}
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        {post.answer_author_id === 0 ? (
          loggedInProfessionId > 0 && loggedInUserId !== post.authorId ? (
            <Grid.Row>
              <Grid.Column id="comments-col" width={16}>
                <Modal
                  onClose={() => setCreateAnswer(false)}
                  onOpen={() => setCreateAnswer(true)}
                  closeIcon
                  open={createAnswer}
                  trigger={
                    <Button positive id="answer-button">
                      <Icon name="plus" />
                      Answer Question
                    </Button>
                  }
                >
                  <Modal.Header>
                    Answer Question
                    <Popup
                      content="Illegal Characters : /[_/@<>£$%^&]/"
                      trigger={
                        <Icon
                          name="info"
                          style={{
                            position: "relative",
                            marginLeft: "5px",
                            top: "-2px",
                          }}
                          circular
                          inverted
                          size="tiny"
                        />
                      }
                    />
                  </Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.TextArea
                        rows={5}
                        placeholder="New Answer..."
                        onChange={handleCreateAnswerTextArea}
                      ></Form.TextArea>
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      icon="checkmark"
                      labelPosition="left"
                      positive
                      content="Create"
                      disabled={
                        createAnswerText.length < 1 ||
                        createAnswerText.match(/[_/@"<>£$%^&]/)
                          ? true
                          : false
                      }
                      onClick={handleCreateAnswer}
                    />
                    <Button
                      icon="close"
                      labelPosition="left"
                      content="Cancel"
                      onClick={() => setCreateAnswer(false)}
                    />
                  </Modal.Actions>
                </Modal>
              </Grid.Column>
            </Grid.Row>
          ) : null
        ) : (
          <Grid.Row>
            <Grid.Column id="comments-col" width={16}>
              <PostAnswer
                answer={post.answer}
                answerAuthor={post.answer_author}
                answerAuthorProfession={post.answer_author_profession}
                answerAuthorId={post.answer_author_id}
                answerId={post.answer_id}
                parentPostId={post.post_id}
                loggedInUserId={loggedInUserId}
                reload={() => setReloadPost(!reloadPost)}
              />
            </Grid.Column>
          </Grid.Row>
        )}

        <Grid.Row columns={1}>
          <Grid.Column id="comments-col" width={16}>
            <Comment.Group style={{ paddingBottom: "10px" }}>
              <Header as="h1" id="comments-header">
                Comments
              </Header>

              {comments
                ? comments.map((comment) => {
                    return (
                      <span key={comment.comment_id}>
                        <Comments
                          incomingComment={comment}
                          loggedInUserId={loggedInUserId}
                          professionId={post.profession_id}
                          commentId={comment.comment_id}
                          reload={() => setReloadPost(!reloadPost)}
                        />
                      </span>
                    );
                  })
                : null}
              <Form>
                <Form.TextArea
                  id="create-comment-textarea"
                  rows={3}
                  placeholder="Comment..."
                  onChange={handleTextAreaChange}
                  value={textAreaValue}
                />
                <Button
                  content="Comment"
                  labelPosition="left"
                  icon="reply"
                  disabled={
                    textAreaValue.match(/[_/@"'<>.,£!$%^&]/) ||
                    textAreaValue.length < 1
                      ? true
                      : false
                  }
                  primary
                  onClick={createComment}
                />
              </Form>
            </Comment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div id="margin-container" />
      <ToastContainer />
    </>
  );
}

export default connect()(PostDisplay);
