let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

let { id } = props;

const post = Near.view(contractName, "get_post_by_id", {
  id: parseInt(id),
});

return (
  <Widget
    src="/*__@replace:widgetPath__*/.Components.Item"
    props={{
      item: post,
      index: post.id,
      type: post.post_type,
      id: post.id,
      showMoreDefault: post.id,
      showCommentsDefault: true,
    }}
  />
);
