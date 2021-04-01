import React from "react";
import { Table, Popup, Header, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import * as moment from "moment";
import "../style.css";

function RecentPosts(props) {
  let { data, style, tableId, postTitleHeader } = props;

  return (
    <>
      {data.length > 0 ? (
        <Table basic="very" celled collapsing id={tableId}>
          <Table.Header id="table-header">
            <Table.Row>
              <Popup
                content="Click To Sort"
                position="left center"
                trigger={
                  <Table.HeaderCell width={2} id="table-headers">
                    Votes
                  </Table.HeaderCell>
                }
              />
              <Table.HeaderCell id="table-post-header">
                {postTitleHeader}
              </Table.HeaderCell>
              <Table.HeaderCell width={4} id="table-headers">
                Author
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body id="table-body" style={style}>
            {data.map((post, i) => {
              return (
                <Table.Row key={i}>
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
                          Date Posted :{moment(post.date).format("DD/MM/YYYY")}
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
        </Table>
      ) : (
        <Message
          style={{ width: "40vw", marginTop: "50px", marginBottom: "50px" }}
          warning
          icon="inbox"
          header="No Recent Posts Found"
          content="Try creating some posts. Most recent ones will appear here"
        />
      )}
    </>
  );
}

export default RecentPosts;
