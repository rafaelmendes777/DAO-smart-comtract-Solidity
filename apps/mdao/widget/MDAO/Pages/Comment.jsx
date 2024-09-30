let { socialKey } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const Container = styled.div`
  width: 100%;
  height: 100vh;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const items = Social.index("graph", `${socialKey}.reply`, { order: "desc" });

return (
  <Container>
    <Widget
      src="/*__@replace:widgetPath__*/.Components.ReplyItem"
      props={{
        item: items.find((i) => i.value.id === parseInt(props.id)).value,
        showCreate: true,
      }}
    />
  </Container>
);
