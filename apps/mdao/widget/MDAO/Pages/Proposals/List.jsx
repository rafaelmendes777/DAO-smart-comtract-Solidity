let { socialKey } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const items = Social.index("graph", socialKey, { order: "desc" });

return (
  <Container>
    {props.id ? (
      <Widget
        src="/*__@replace:widgetPath__*/.Components.Item"
        props={{
          item: items.find((i) => i.value.id === parseInt(props.id)).value,
          index: 0,
          showMoreDefault: 0,
          showRepliesDefault: true,
        }}
      />
    ) : (
      <>
        <h1>{props.type === "proposal" ? "Proposals" : "Reports"} List</h1>
        <div className="d-flex justify-content-end mb-4">
          <a
            className="btn-primary"
            href="//*__@replace:widgetPath__*/.App?page=createProposal"
          >
            <i className="bi bi-plus-circle" />
            Post
          </a>
        </div>
        <div className="d-flex flex-column gap-4">
          {items &&
            items
              .filter((i) => i.value.type === props.type)
              .map((item, index) => (
                <Widget
                  src="/*__@replace:widgetPath__*/.Components.Item"
                  props={{ item: item.value, index }}
                />
              ))}
        </div>
      </>
    )}
  </Container>
);
