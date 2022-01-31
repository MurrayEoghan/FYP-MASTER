import React, { useEffect, useCallback, useState } from "react";
import { Table, Image } from "semantic-ui-react";
import { storage } from "../../firebase/FirebaseConfig";
import null_profile_pic from "../../images/null_profile_pic.png";
import "../style.css";

function FollowerDisplay(props) {
  let { follower, key } = props;

  let [image, setImage] = useState(null);

  const getImage = useCallback(() => {
    storage
      .ref(`images/profile_pic_id_${follower.id}`)
      .getDownloadURL()
      .then((url) => setImage(url));
  }, [follower]);
  useEffect(() => {
    getImage();
  }, [image, getImage]);
  return (
    <Table.Row key={key}>
      <Table.Cell width={5}>
        <Image
          src={image ? image : null_profile_pic}
          size="mini"
          style={{ marginRight: "0" }}
        />
      </Table.Cell>
      <Table.Cell>
        <span>
          <a href={`http://localhost:3000/profile/${follower.id}`}>
            {follower.username}
          </a>
        </span>
      </Table.Cell>
    </Table.Row>
  );
}

export default FollowerDisplay;
