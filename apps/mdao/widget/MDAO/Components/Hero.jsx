let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);

assets = assets.home;
content = content.home;

const HeroSection = styled.div`
  background: linear-gradient(
    96deg,
    #fdefb1 -19.42%,
    #e1c4fe 49.87%,
    #95c3fe 98.55%
  );
  width: 100%;
  padding: 5rem 8rem;
  height: 550px;

  @media screen and (max-width: 786px) {
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 4.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    @media screen and (max-width: 786px) {
      font-size: 3rem;
    }
  }

  h3 {
    font-size: 1.5rem !important;
    font-weight: 300 !important;
    max-width: 500px;
    margin-bottom: 0;
  }

  img {
    width: 400px;
    height: 400px;
    @media screen and (max-width: 786px) {
      display: none;
    }
  }

  a.btn {
    border-radius: 10px;
    background: #151718;
    box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
    color: #f0f0f0;
    font-size: 24px;
    font-weight: 400;
    padding: 15px 25px 15px 90px;
    max-width: 350px;

    &:hover {
      color: #fff;
      text-decoration: none;
    }

    @media screen and (max-width: 786px) {
      padding: 15px 25px 15px 70px;
    }

    &.btn-secondary {
      background: transparent;
      color: #151718;
      background-image: none;
      border: 2px solid #151718;

      &:hover {
        color: #fff;
        background: #151718;
        text-decoration: none;
      }
    }
  }
`;

const Hero = () => (
  <HeroSection className="d-flex justify-content-between align-items-center">
    <div className="d-flex flex-column gap-5">
      <div>
        <h1>{content.heroTitle}</h1>
        <h3>{content.heroDesc}</h3>
      </div>
      <div>
        <a
          href={"//*__@replace:widgetPath__*/.App?page=info"}
          className="btn btn-secondary d-flex justify-content-between"
        >
          <span>Read More</span>
          <i className="bi bi-chevron-right" />
        </a>
      </div>
    </div>
    <img src={assets.hero} />
  </HeroSection>
);

return { Hero };
