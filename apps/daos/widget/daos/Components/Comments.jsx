let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const { postId, commentId, showCreate } = props;
const accountId = context.accountId;

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

const Post = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid rgb(241 241 241);
`;

const [showMore, setShowMore] = useState(null);
const [showReply, setShowReply] = useState({ [postId]: showCreate });

let comments = Near.view(contractName, "get_post_comments", {
  post_id: parseInt(postId),
});

if (!comments) return <Widget src="flashui.near/widget/Loading" />;

comments = comments.sort(
  (a, b) => parseInt(b.snapshot.timestamp) - parseInt(a.snapshot.timestamp),
);

const isLikedByMe = (comment) =>
  comment.likes
    ? comment.likes.some((like) => like.author_id === accountId)
    : false;

const handleLike = (id) => {
  Near.call(contractName, "comment_like", { id });
};

const commentById = (id) => comments.find((c) => c.id === id);

const CommentsList = ({ comments }) => (
  <>
    {comments.map((comment) => (
      <>
        <Widget
          src="/*__@replace:widgetPath__*/.Components.Comment"
          props={{
            comment,
            isLikedByMe,
            showReply,
            setShowReply,
            handleLike,
            isPreview: false,
            postId,
          }}
        />
        <Post>
          {comment.child_comments.length > 0 && (
            <CommentsList
              comments={comment.child_comments.map((childId) =>
                commentById(childId),
              )}
            />
          )}
        </Post>
      </>
    ))}
  </>
);

return (
  <>
    {!commentId && (
      <Widget
        src="/*__@replace:widgetPath__*/.Components.CreateReply"
        props={{ id: postId }}
      />
    )}

    <CommentsList
      comments={
        commentId
          ? comments.filter((c) => c.id === parseInt(commentId))
          : comments.filter((c) => !c.parent_comment)
      }
    />
  </>
);
