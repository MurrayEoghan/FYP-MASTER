import React, { useState, useEffect } from "react";
import "./styles.css";
import { storage } from "../../firebase/FirebaseConfig";
import { Comment, Modal, Icon, Form, Button, Popup } from "semantic-ui-react";
import null_profile_pic from "../../images/null_profile_pic.png";
import UserProfessionTag from "../../genericComponents/UserProfessionTag";

import axios from "axios";

function PostAnswer(props) {
  let {
    answer,
    answerAuthor,
    parentPostId,
    answerAuthorId,
    answerAuthorProfession,
    answerId,

    loggedInUserId,
    reload,
  } = props;
  const headers = {
    "Content-Type": "application/json",
  };
  let [image, setImage] = useState(null);
  let [textAreaContent, setTextAreaContent] = useState("");
  let [editAnswer, setEditAnswer] = useState(false);
  let [deleteAnswer, setDeleteAnswer] = useState(false);

  async function getImage(id) {
    try {
      await storage
        .ref(`images/profile_pic_id_${id}`)
        .getDownloadURL()
        .then((url) => {
          setImage(url);
        });
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getImage(answerAuthorId);
  }, [answerAuthorId]);

  const handleTextArea = (e) => {
    setTextAreaContent(e.target.value);
  };

  async function deleteAnswerCall() {
    try {
      await axios
        .delete(
          `http://localhost:8080/api/v1/delete/post/answer/${parentPostId}`,
          { headers }
        )
        .then(() => {
          setDeleteAnswer(false);
          reload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function updateAnswer() {
    let data = {
      post_id: parentPostId,
      answer_id: answerId,
      answer: textAreaContent,
    };
    try {
      await axios
        .patch("http://localhost:8080/api/v1/update/post/answer", data, {
          headers,
        })
        .then(() => {
          reload();
          setEditAnswer(false);
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <span id="answer-header">Answer</span>
      <Comment.Group>
        <Comment id="comment">
          <Comment.Avatar
            as="a"
            href={`/profile/${answerAuthorId}`}
            src={image ? image : null_profile_pic}
          />
          <Comment.Content>
            <Comment.Author as="a" href={`/profile/${answerAuthorId}`}>
              <span id="answer_author">{answerAuthor}</span>
              <UserProfessionTag professionId={answerAuthorProfession} />
            </Comment.Author>

            <Comment.Text>{answer}</Comment.Text>
            {loggedInUserId === answerAuthorId ? (
              <Comment.Actions>
                <Modal
                  onOpen={() => setEditAnswer(true)}
                  onClose={() => setEditAnswer(false)}
                  open={editAnswer}
                  closeIcon
                  size="small"
                  trigger={
                    <Comment.Action onClick={() => setEditAnswer(true)}>
                      <Icon name="edit" />
                      Edit
                    </Comment.Action>
                  }
                >
                  <Modal.Header>
                    Edit Answer
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
                        textAreaContent.match(/[_/@"<>£$%^&]/)
                          ? true
                          : false
                      }
                      onClick={updateAnswer}
                      icon="edit"
                    />
                    <Button
                      content="Cancel"
                      onClick={() => setEditAnswer(false)}
                      labelPosition="right"
                      icon="close"
                    />
                  </Modal.Actions>
                </Modal>
                <Modal
                  onOpen={() => setDeleteAnswer(true)}
                  onClose={() => setDeleteAnswer(false)}
                  open={deleteAnswer}
                  size="tiny"
                  closeIcon
                  trigger={
                    <Comment.Action>
                      <Icon name="trash" />
                      Delete
                    </Comment.Action>
                  }
                >
                  <Modal.Header>Delete Answer</Modal.Header>
                  <Modal.Content>
                    Are you sure you want to delete this answer? It will be lost
                    forever.
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      positive
                      content="Confirm"
                      labelPosition="left"
                      onClick={deleteAnswerCall}
                      icon="edit"
                    />
                    <Button
                      content="Cancel"
                      onClick={() => setDeleteAnswer(false)}
                      labelPosition="right"
                      icon="close"
                    />
                  </Modal.Actions>
                </Modal>
              </Comment.Actions>
            ) : null}
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </>
  );
}

export default PostAnswer;
