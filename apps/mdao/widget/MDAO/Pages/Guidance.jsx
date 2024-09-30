let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);

content = content.home;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85vh;
  overflow: hidden;
  background: linear-gradient(
    96deg,
    #fdefb1 -19.42%,
    #e1c4fe 49.87%,
    #95c3fe 98.55%
  );

  h1 {
    color: white;
    text-transform: uppercase;
    font-size: 80px;
    text-align: center;
    font-weight: bold;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    margin-top: -5rem;
    img {
      width: 100px;
    }
  }

  a.btn {
    border-radius: 0px;
    background: #151718;
    box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
    color: #f0f0f0;
    font-size: 24px;
    font-weight: bold;
    text-align: center !important;
    padding: 15px 50px;

    &:hover {
      color: #fff;
      text-decoration: none;
    }
  }
`;

return (
  <Container>
    <div className="wrapper">
      <a className="img" href={`//*__@replace:widgetPath__*/.App?page=home`}>
        <img src={assets.logoWhite} />
      </a>
      <h1>
        Proposal & Report <br />
        Creation guide
      </h1>
      <a className="btn" href="https://youtu.be/XaYKceQz_e4" target="_blank">
        Marketing DAO
      </a>
    </div>
  </Container>
);
