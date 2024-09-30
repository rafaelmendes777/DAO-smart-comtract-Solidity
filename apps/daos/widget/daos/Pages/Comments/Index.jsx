let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

let { post_id, comment_id } = props;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 3rem;
  margin: 3rem 0;
  border-radius: 20px;
  background: white;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const comments = Near.view(contractName, "get_post_comments", {
  post_id: parseInt(post_id),
});

return (
  <Container>
    <Widget
      src="/*__@replace:widgetPath__*/.Components.Comments"
      props={{
        postId: post_id,
        commentId: comment_id,
        showCreate: true,
      }}
    />
  </Container>
);
