const {
  comment,
  isLikedByMe,
  showReply,
  setShowReply,
  handleLike,
  isPreview,
  postId,
} = props;

const Body = styled.div`
  padding: 0rem 1rem;
`;

const Content = styled.div`
  .attachments {
    margin: 10px 0 20px 0;
    padding: 10px;
    border: 1px solid rgb(222 235 255);
    background: #f5f9ff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 300px;

    a {
      color: rgb(118 150 198);
      font-size: 13px;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      overflow: hidden;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: -3px 0 10px 0;
`;

const Post = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid rgb(241 241 241);
`;

const Header = styled.div`
  margin-bottom: 0;
  display: inline-flex;
  width: 100%;
`;

const formatDate = (timestamp) => {
  const date = new Date(parseInt(timestamp) / 1000000);

  return `${date.toLocaleDateString()}, ${date.getHours()}:${date.getMinutes()}`;
};

return (
  <>
    <Header>
      <div className="my-3 d-flex gap-3 align-items-center justify-content-between">
        <Widget
          src="near/widget/AccountProfile"
          props={{
            accountId: comment.author_id,
            hideAccountId: true,
          }}
        />
        <div className="d-flex gap-2 align-items-center justify-content-between">
          <i className="bi bi-clock" />
          <small>{formatDate(comment.snapshot.timestamp)}</small>
        </div>
      </div>
    </Header>
    <Post>
      <Body>
        <Content>
          <Widget
            src={"/*__@replace:widgetPath__*/.Components.MarkdownViewer"}
            props={{ text: comment.snapshot.description }}
          />
          {comment.snapshot.attachments.length > 0 && (
            <div className="attachments">
              {comment.snapshot.attachments.map((src) => (
                <a href={src}>
                  <i className="bi bi-paperclip" /> {src}
                </a>
              ))}
            </div>
          )}
        </Content>

        {!isPreview && (
          <Actions>
            <div
              role="button"
              className="d-flex gap-2 align-items-center"
              onClick={() => handleLike(comment.id)}
            >
              <small className="blue">{comment.likes.length}</small>
              <i
                className={`bi blue ${
                  isLikedByMe(comment) ? "bi-heart-fill" : "bi-heart"
                }`}
              />
            </div>
            <div
              role="button"
              onClick={() =>
                setShowReply({ [comment.id]: !showReply[comment.id] })
              }
            >
              <small className="blue">{comment.child_comments.length}</small>
              <i className="bi blue bi-chat" />
            </div>
            <Link
              to={`//*__@replace:widgetPath__*/.App?page=comments&post_id=${postId}&comment_id=${comment.id}`}
            >
              <i class={"bi blue bi-share"} />
            </Link>
          </Actions>
        )}
      </Body>
    </Post>
  </>
);
