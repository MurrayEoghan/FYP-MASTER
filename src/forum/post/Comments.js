import React, { useState, useEffect } from "react";
import { Comment, Form, Icon, Modal, Button } from "semantic-ui-react";
import * as moment from "moment";
import { storage } from "../../firebase/FirebaseConfig";
import null_profile_pic from "../../images/null_profile_pic.png";
import { ToastContainer, toast } from "react-toastify";
import UserProfessionTag from "../../genericComponents/UserProfessionTag";

import "./comment-styles.css";
import axios from "axios";

function Comments(props) {
  let { incomingComment, loggedInUserId, headers, reload } = props;
  let [image, setImage] = useState(null);
  let [editComment, setEditComment] = useState(false);
  let [deleteComment, setDeleteComment] = useState(false);
  let [textAreaContent, setTextAreaContent] = useState("");

  useEffect(() => {
    async function getImages(comment) {
      await storage
        .ref(`images/profile_pic_id_${comment.comment_author_id}`)
        .getDownloadURL()
        .then((url) => setImage(url));
    }

    getImages(incomingComment);
  }, [incomingComment]);

  const handleTextArea = (e) => {
    setTextAreaContent(e.target.value);
  };

  async function updateComment() {
    const data = {
      comment_id: incomingComment.comment_id,
      comment_author_id: incomingComment.comment_author_id,
      comment: textAreaContent,
    };
    try {
      await axios
        .patch("http://localhost:8080/api/v1/update/comment", data, {
          headers,
        })
        .then(() => {
          reload();
          setEditComment(false);
          toast.success("Update Success", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    } catch (err) {
      console.log(err);
    }
  }
  async function deleteUserComment() {
    try {
      await axios
        .delete(
          `http://localhost:8080/api/v1/delete/comment/${incomingComment.comment_id}`,
          {
            headers,
          }
        )
        .then(() => {
          reload();
          setDeleteComment(false);
          toast.success("Delete Success", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Comment key={incomingComment.id} id="comment">
        <Comment.Avatar
          src={image ? image : null_profile_pic}
          id="comment-avatar"
        />

        <Comment.Content>
          {incomingComment.comment_author_profession_id > 0 ? (
            <>
              <Comment.Author
                as="a"
                href={`/profile/${incomingComment.comment_author_id}`}
              >
                <span id="author-display">
                  {incomingComment.comment_author}
                </span>

                <span id="author-profession-tag">
                  <UserProfessionTag
                    professionId={incomingComment.comment_author_profession_id}
                    size="mini"
                  />
                </span>
              </Comment.Author>
              <Comment.Metadata id="posted-date">
                <div>
                  Posted : {moment(incomingComment.date).format("DD/MM/YYYY")}
                </div>
              </Comment.Metadata>
            </>
          ) : (
            <>
              <Comment.Author as="span">
                <span id="author-display">
                  {incomingComment.comment_author}
                </span>
              </Comment.Author>
              <Comment.Metadata id="posted-date">
                <div>
                  Posted : {moment(incomingComment.date).format("DD/MM/YYYY")}
                </div>
              </Comment.Metadata>
            </>
          )}

          <Comment.Text>{incomingComment.comment}</Comment.Text>
          {loggedInUserId === incomingComment.comment_author_id ? (
            <Comment.Actions>
              <Modal
                onOpen={() => setEditComment(true)}
                onClose={() => setEditComment(false)}
                open={editComment}
                closeIcon
                size="small"
                trigger={
                  <Comment.Action onClick={() => setEditComment(true)}>
                    <Icon name="edit" />
                    Edit
                  </Comment.Action>
                }
              >
                <Modal.Header>Edit Comment</Modal.Header>
                <Modal.Content>
                  <Form>
                    <Form.TextArea
                      rows={5}
                      placeholder="New Comment..."
                      onChange={handleTextArea}
                    ></Form.TextArea>
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    positive
                    content="Save"
                    labelPosition="left"
                    disabled={
                      textAreaContent.length < 1 ||
                      textAreaContent.match(/[_/@"'<>.,£!$%^&]/)
                        ? true
                        : false
                    }
                    onClick={updateComment}
                    icon="edit"
                  />
                  <Button
                    content="Cancel"
                    onClick={() => setEditComment(false)}
                    labelPosition="right"
                    icon="close"
                  />
                </Modal.Actions>
              </Modal>
              <Modal
                onOpen={() => setDeleteComment(true)}
                onClose={() => setDeleteComment(false)}
                open={deleteComment}
                size="tiny"
                closeIcon
                trigger={
                  <Comment.Action>
                    <Icon name="trash" />
                    Delete
                  </Comment.Action>
                }
              >
                <Modal.Header>Delete Comment</Modal.Header>
                <Modal.Content>
                  Are you sure you want to delete this comment? It will be lost
                  forever.
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    positive
                    content="Confirm"
                    labelPosition="left"
                    onClick={deleteUserComment}
                    icon="edit"
                  />
                  <Button
                    content="Cancel"
                    onClick={() => setDeleteComment(false)}
                    labelPosition="right"
                    icon="close"
                  />
                </Modal.Actions>
              </Modal>
            </Comment.Actions>
          ) : null}
        </Comment.Content>
      </Comment>
      <ToastContainer />
    </>
  );
}

export default Comments;
