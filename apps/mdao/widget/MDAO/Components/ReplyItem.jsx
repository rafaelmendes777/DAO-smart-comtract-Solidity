// Copy of old version of src/Posts/Post.jsx
let { socialKey } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { item, showCreate } = props;
const accountId = context.accountId;

const Post = styled.div`
  position: relative;

  &::before {
    content: "";
    display: ${showCreate ? "none" : "block"};
    position: absolute;
    left: 19px;
    top: 52px;
    bottom: 12px;
    width: 2px;
    background: #eceef0;
  }
`;

const Header = styled.div`
  margin-bottom: 0;
  display: inline-flex;
`;

const Body = styled.div`
  padding-left: ${showCreate ? "0" : "50px"};
  padding-bottom: 5px;
`;

const Content = styled.div`
  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
    margin: 0 0 12px;
  }
`;

const Text = styled.p`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  color: rgb(150 150 150);
  align-items: center;
  gap: 15px;
  margin: -3px 0 10px 0;
`;

const Comments = styled.div`
  > div > div:first-child {
    padding-top: 12px;
  }
`;

const [showMore, setShowMore] = useState(null);
const [liked, setLiked] = useState(false);
const [showReply, setShowReply] = useState({ [item.id]: showCreate });

const comments = Social.index("graph", `${socialKey}.reply`, { order: "desc" });
let likes = Social.index("graph", `${socialKey}.like`, { order: "desc" });
likes = likes ? likes.filter((like) => like.value.parentId === item.id) : [];
const myLike = likes ? likes.some((like) => like.value[accountId]) : false;
setLiked(myLike);

const [replies, setReplies] = useState([]);
replies = comments
  ? comments.filter((repl) => repl.value.parentId === item.id)
  : [];
setReplies(replies);

const handleLike = () => {
  Social.set({
    index: {
      graph: JSON.stringify({
        key: `${socialKey}.like`,
        value: {
          parentId: item.id,
          [accountId]: !myLike,
        },
      }),
    },
  });
};

return (
  <Post>
    {item.text && (
      <Header>
        <div className="row">
          <div className="col-auto">
            <div className="d-flex gap-3 align-items-center">
              <Widget
                src="near/widget/AccountProfile"
                props={{
                  accountId: item.accountId,
                  hideAccountId: true,
                }}
              />
              <div className="text-secondary">
                <small>
                  <i className="bi bi-clock" />
                  {new Date(item.id).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      </Header>
    )}

    <Body>
      {item.text && (
        <Content>
          <Widget
            src={"/*__@replace:widgetPath__*/.Components.MarkdownViewer"}
            props={{ text: item.text }}
          />
        </Content>
      )}
      {item.text && item.id && (
        <Actions>
          <div
            role="button"
            className="d-flex gap-2 align-items-center"
            onClick={handleLike}
          >
            <small>{likes.length}</small>
            <i className="bi bi-heart" />
          </div>
          <div
            role="button"
            onClick={() => setShowReply({ [item.id]: !showReply[item.id] })}
          >
            <small>{replies.length}</small>
            <i className="bi bi-chat" />
          </div>
          <div>
            <Link
              to={`//*__@replace:widgetPath__*/.App?page=comments&id=${item.id}`}
            >
              <i class="bi bi-link-45deg fs-5" />
            </Link>
          </div>
        </Actions>
      )}

      {showReply[item.id] && (
        <Widget
          src="/*__@replace:widgetPath__*/.Components.CreateReply"
          props={{ id: item.id }}
        />
      )}
      {comments.length > 0 && (
        <div>
          {comments
            .filter((repl) => repl.value.parentId === item.id)
            .map((item) => (
              <Widget
                src="/*__@replace:widgetPath__*/.Components.ReplyItem"
                props={{ item: item.value, showCreate: false }}
              />
            ))}
        </div>
      )}
    </Body>
  </Post>
);
