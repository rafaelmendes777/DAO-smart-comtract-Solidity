let fontCss = fetch(
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700&display=swap",
);

if (!fontCss) {
  function AppLayout({ page, children }) {
    return <></>;
  }
  return { AppLayout };
}
fontCss = fontCss.body;

const Theme = styled.div`
  position: fixed;
  inset: 73px 0px 0px;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  font-weight: 500;
  font-family: "Montserrat", sans-serif;
  ${fontCss};

  font-style: normal;
  background: #f8f6ff;

  a {
    color: inherit;
    font-weight: 500;

    &.color-text {
      background: linear-gradient(
        270deg,
        rgb(246 112 85) 1%,
        rgb(180 102 248) 50%,
        rgb(82 129 249) 99.83%
      );

      &.color-dark {
        background: linear-gradient(
          270deg,
          #efdcd1 -1.69%,
          #e0c6f7 43.78%,
          #adc3fb 99.83%
        );
      }
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .profile {
    a {
      color: inherit;
      font-size: 14px;
      margin-left: 5px;
      font-weight: 500;
      line-height: 1.2rem;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #151718;
  }

  h1 {
    font-weight: 600;
  }

  img {
    width: 100%;
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  .btn {
    &:disabled {
      box-shadow: none;
      border: 1px solid darkgray;
      background: #eee;
      color: #353333 !important;
    }
  }

  .btn-primary {
    border-radius: 10px;
    background: #a4c2fd;
    border: 1px solid #a4c2fd;
    color: white !important;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.15);
    padding: 10px 40px 10px 25px;

    &:hover {
      text-decoration: none;
      cursor: pointer;
      border: 1px solid #a4c2fd;
    }
  }

  .btn-outline-primary {
    border-radius: 10px;
    border: 1px solid #a4c2fd;
    color: #000 !important;
    text-decoration: none;
    display: flex;
    gap: 1rem;
    box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.15);
    padding: 10px 40px 10px 25px;

    &:hover {
      text-decoration: none;
      background: #151718;
      color: white !important;
    }
  }

  .btn-sm {
    padding: 5px 10px 5px 20px;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
  }

  .blue {
    color: rgb(146 168 210);
  }

  @keyframes scroll {
    0% {
      transform: translate(0%);
    }
    100% {
      transform: translate(-100%);
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75%;
  margin: 3rem 0;

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

function AppLayout({ page, props, children }) {
  return (
    <Theme>
      <Container>
        <Widget src={`/*__@replace:widgetPath__*/.Components.NavBar`} />
        {["home", "dao"].includes(page) ? (
          children
        ) : (
          <Wrapper>{children}</Wrapper>
        )}
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Footer`}
          props={{ page }}
        />
      </Container>
    </Theme>
  );
}

return { AppLayout };
