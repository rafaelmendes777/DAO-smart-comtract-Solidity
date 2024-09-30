const { AppLayout } = VM.require(`/*__@replace:widgetPath__*/.Layouts.App`);
const { page, ...passProps } = props;

if (!AppLayout) return <Widget src="flashui.near/widget/Loading" />;
if (!page) page = "home";

function Page() {
  switch (page) {
    case "comments": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Comment`}
          props={passProps}
        />
      );
    }
    case "home": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Home`}
          props={passProps}
        />
      );
    }
    case "info": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Info`}
          props={passProps}
        />
      );
    }
    case "councils": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Councils`}
          props={passProps}
        />
      );
    }
    case "achievements": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Achievements`}
          props={passProps}
        />
      );
    }
    case "guidance": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Guidance`}
          props={passProps}
        />
      );
    }
    case "reports": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.List`}
          props={{ type: "report", ...passProps }}
        />
      );
    }
    case "proposals": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.List`}
          props={{ type: "proposal", ...passProps }}
        />
      );
    }
    case "communities": {
      return <Widget src={`/*__@replace:widgetPath__*/.Pages.Communities`} />;
    }
    case "createProposal": {
      return (
        <Widget
          src={`/*__@replace:widgetPath__*/.Pages.Proposals.Create`}
          props={passProps}
        />
      );
    }

    default: {
      const NotFound = styled.div`
        width: 100%;
        height: 70vh;

        h1 {
          font-size: 10rem;
        }

        h2 {
          font-size: 2rem;
        }
      `;

      return (
        <NotFound className="d-flex flex-grow-1 flex-column justify-content-center align-items-center">
          <h1>
            <b>404</b>
          </h1>
          <h2>Page does not exist</h2>
        </NotFound>
      );
    }
  }
}

return (
  <AppLayout page={page}>
    <Page />
  </AppLayout>
);
