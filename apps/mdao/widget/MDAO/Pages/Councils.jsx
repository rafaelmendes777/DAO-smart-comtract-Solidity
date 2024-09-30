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
        <h1>Marketing DAO Councils</h1>
      </div>
      <div>
        <h3>Lorraine (@so608)</h3>
        <p>
          Long-time journalist (FastCo, SF Chronicle, Hearst) turned strategic
          communications pro Owner of marketing and communications agency
          serving venture capital firms, startups and blockchain builders
          Podcast host and course creator Web3 enthusiast working to encourage
          diverse populations to learn and explore the space
        </p>
      </div>
      <div>
        <h3>Elliot (@dacha)</h3>
        <p>
          In real life, former head of regional purchasing and marketing at
          K-Rauta Joined Near Community in Q3 of 2020; Since this time, I have
          spent my whole life here. During this time helped with marketing
          support for over 100 dApps, including our top dApps such as Near.
          Social, Land2Empire, Zomland, MotoDex. Raised many new contributors
          who are now building the Community. Active NDC contributor, involved
          in many ecosystem projects Founder of many Grassroots DAOs
        </p>
      </div>
      <div>
        <h3>Carl (@cryptocredit)</h3>
        <p>
          Old school marketeer with over 30 years experience across all sectors
          7 years of Blockchain Experience Brewery and Farm Owner IRL Founder of
          Decentralized Brewing Co built on NEAR
        </p>
      </div>
      <div>
        <h3>Johanga (@johanga) </h3>
        <p>
          Over 15 years of experience in producing cultural projects, project
          management, community building, team leading, events organization, PR
          and media marketing NEAR Community member since October 2021, being a
          Founder Lead and Council of multiply DAOs in Ecosystem Product manager
          in various initiatives, establishing and maintaining connections with
          hundreds of web3 dApps and projects
        </p>
      </div>
    </InfoSection>
  </Container>
);
