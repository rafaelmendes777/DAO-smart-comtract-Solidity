let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);

assets = assets.home;
content = content.home;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;
`;

const HeroSection = styled.div`
  width: 100%;
  background: linear-gradient(
    96deg,
    #fdefb1 -19.42%,
    #e1c4fe 49.87%,
    #95c3fe 98.55%
  );
  height: 600px;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 2rem;
    text-align: center;
  }

  h1 {
    font-size: 5.2rem;
    font-weight: 600;
    margin-bottom: 0;
    @media screen and (max-width: 786px) {
      font-size: 3rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 300;
    max-width: 800px;
    margin-bottom: 0;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0;
  }

  img {
    width: 500px;
    height: 500px;
    @media screen and (max-width: 786px) {
      display: none;
    }
  }
}`;

const InfoSection = styled.div`
  width: 75%;
  padding: 5rem 3rem;
  font-weight: 300;
  font-size: 1.2rem;

  h1 {
    font-size: 3rem;
    font-weight: 600;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
    padding: 2rem 1rem;
  }
`;

return (
  <Container>
    <InfoSection className="d-flex flex-column gap-4 mx-auto">
      <div>
        <h1>Achievements</h1>
      </div>
      <div>
        <p>
          We are proud to support:
          <ul>
            <li>Over 150 NEAR Ecosystem dApps</li>
            <li>Over 50 regional communities across the world</li>
            <li>1000+ AMA's</li>
            <li>2000 + quizzes</li>
            <li>competitions & workshops</li>
            <li>100+ events and hackathons</li>
            <li>Over 20K new NEAR wallets</li>
          </ul>
        </p>
      </div>
      <div>
        <p>
          100+ developers building on NEAR Top Ecosystem Projects
          <ul>
            <li>ShardDog</li>
            <li>Chill & Shill</li>
            <li>Rogue Studios</li>
            <li>SHE is NEAR</li>
            <li>Degens</li>
            <li>
              Regional communities including NEAR Turkey, Indonesia, China and
              more
            </li>
          </ul>
        </p>
      </div>
      <img src="https://ipfs.near.social/ipfs/bafkreighnzhgb5vnqr2shu4m3j7v7nh3aq63urewyibitrrwdbsqvkxdba" />
    </InfoSection>
  </Container>
);
