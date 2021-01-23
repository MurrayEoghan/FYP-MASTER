import React, { Profiler, useState } from "react";
import { Modal, Button, Icon, Input, Progress } from "semantic-ui-react";
import "./styles.css";
import { storage } from "../firebase/FirebaseConfig";
import null_profile_pic from "../images/null_profile_pic.png";

function ImageUploadModal(props) {
  let { header, userId, triggerObj, imageReload } = props;
  let [isOpen, setIsOpen] = useState();
  let [image, setImage] = useState(null);
  let [progress, setProgress] = useState(0);
  let [fileSelected, setFileSelected] = useState();

  const fileSelectedHandler = (e) => {
    setFileSelected(true);
    setImage(e.target.files[0]);
  };
  const fileUploadHandler = () => {
    const uploadTask = storage
      .ref(`images/profile_pic_id_${userId}`)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage.ref("images").child(image.name);
      }
    );
    setFileSelected(false);
  };

  const handleSave = () => {
    setIsOpen(false);
    imageReload();
  };

  return (
    <>
      <Modal
        open={isOpen}
        closeIcon
        size="tiny"
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        trigger={triggerObj}
      >
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <span id="upload-p">
              <Input
                type="file"
                accept="image"
                onChange={fileSelectedHandler}
              />

              <Button
                icon="upload"
                onClick={fileUploadHandler}
                disabled={fileSelected ? false : true}
                style={{ marginLeft: "30px" }}
                size="large"
              />
            </span>
            <Progress
              percent={progress}
              max="100"
              id="progress-bar"
              indicating
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={handleSave}>
            <Icon name="save" />
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ImageUploadModal;
