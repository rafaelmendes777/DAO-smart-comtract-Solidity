const { text } = props;

const Content = styled.div`
  a {
    color: blue !important;
  }

  blockquote {
    font-style: normal !important;
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 1.5em 10px;
    padding: 1em 10px 0.1em;

    p {
      margin-bottom: 1rem !important;
    }
  }
`;

return (
  <Content>
    <Widget
      src={"devhub.near/widget/devhub.components.molecule.MarkdownViewer"}
      props={{ text }}
    />
  </Content>
);
