let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);
assets = assets.home;
content = content.home;

const STATUS = {
  GOOD: ["Yes", "Approved", "Yes, include in special request"],
  BAD: ["No"],
};
const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const ConnectSection = styled.div`
  padding: 3rem 0;

  @media screen and (max-width: 786px) {
    padding: 2rem;
    text-align: center;
  }
`;

return (
  <Container>
    <h1>Communities</h1>
    <ConnectSection className="d-flex flex-column">
      <Widget src="/*__@replace:widgetPath__*/.Components.Communities" />
    </ConnectSection>
  </Container>
);
