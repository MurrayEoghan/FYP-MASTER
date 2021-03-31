import React, { useState, useEffect } from "react";
import { Icon, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";

function Notification(props) {
  let { inboundNotification } = props;
  let notificationType = inboundNotification.notification_type;
  let [icon, setIcon] = useState("");
  let [text, setText] = useState(null);
  useEffect(() => {
    switch (notificationType) {
      case 1:
        setIcon("comment");
        setText(
          <>
            <Link to={`/profile/${inboundNotification.initiated_by_id}`}>
              {inboundNotification.initiated_by_name}
            </Link>{" "}
            commented on your
            <Link to={`/forum/post/${inboundNotification.cause_entity}`}>
              {" "}
              Post
            </Link>
          </>
        );
        break;
      case 2:
        setIcon("bolt");
        setText(
          <>
            <Link to={`/profile/${inboundNotification.initiated_by_id}`}>
              {inboundNotification.initiated_by_name}
            </Link>{" "}
            answered your
            <Link to={`/forum/post/${inboundNotification.cause_entity}`}>
              {" "}
              Post
            </Link>
          </>
        );

        break;
      case 3:
        setText(
          <>
            <Link to={`/profile/${inboundNotification.initiated_by_id}`}>
              {inboundNotification.initiated_by_name}
            </Link>{" "}
            followed you!
          </>
        );
        setIcon("user circle");
        break;
      default:
        setIcon("");
        break;
    }
  }, [inboundNotification]);

  return (
    <Table.Row style={{ borderBottom: "1px solid #7d0541" }}>
      <Table.Cell width={2}>
        <Icon name={icon} />
      </Table.Cell>
      <Table.Cell>{text}</Table.Cell>
    </Table.Row>
  );
}

export default Notification;
