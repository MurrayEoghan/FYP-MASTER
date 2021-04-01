import React, { useState } from "react";
import { Modal, Form, Icon, Button } from "semantic-ui-react";
import axios from "axios";

function CreatePost(props) {
  let {
    trigger,
    subTopicList,
    uniqueTopics,
    activeUser,
    activeUserId,
    reload,
  } = props;
  const headers = {
    "Content-Type": "application/json",
  };

  let [open, setOpen] = useState(false);
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");

  let [parentTopic, setParentTopic] = useState();
  let [subTopic, setSubTopic] = useState();
  const data = {
    title: title,
    author: activeUser,
    authorId: activeUserId,
    topic: parentTopic,
    subTopic: subTopic,
    content: content,
  };

  const handleCloseButton = () => {
    setTitle("");
    setContent("");
    setParentTopic();
    setSubTopic();
    setOpen(false);
  };

  async function handleCreateButton() {
    try {
      await axios
        .post("http://localhost:8080/api/v1/posts/create", data, { headers })
        .then((res) => {
          setParentTopic();
          setSubTopic();
          setOpen(false);
          reload();
        });
    } catch (err) {
      console.log(err);
    }
  }

  const handleParentTopicDropdown = (e, { value }) => {
    setParentTopic(value);
    setSubTopic();
  };

  const handleSubTopicDropdown = (e, { value }) => {
    setSubTopic(value);
  };
  return (
    <Modal
      trigger={trigger}
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <Icon name="chat" />
        Create New Post
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            fluid
            label="Title"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Form.Group widths="equal">
            <Form.Select
              fluid
              label="Main Topic"
              options={uniqueTopics}
              onChange={handleParentTopicDropdown}
              placeholder="Main Topic"
            />
            <Form.Select
              fluid
              label="Sub Topic"
              disabled={parentTopic === undefined ? true : false}
              options={
                parentTopic
                  ? subTopicList.filter((obj) => obj.parent_id === parentTopic)
                  : []
              }
              onChange={handleSubTopicDropdown}
              placeholder="Sub Topic"
            />
          </Form.Group>
          <Form.TextArea
            rows={7}
            label="Content"
            placeholder="Post Content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleCloseButton}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button
          color="green"
          onClick={handleCreateButton}
          disabled={
            title === "" ||
            content === "" ||
            parentTopic === undefined ||
            subTopic === undefined ||
            title.match(/[_@<>£$%^&]/) ||
            content.match(/[_@<>£$%^&]/)
              ? true
              : false
          }
        >
          <Icon name="checkmark" /> Post
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default CreatePost;
