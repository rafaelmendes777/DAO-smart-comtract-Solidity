const Item = styled.div`
  width: 350px;
  min-height: 280px;
  border-radius: 10px;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);

  h4 {
    color: #000
    font-size: 24px;
  }

  &.dark {
    position: relative;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
    padding: 2px;


    h4, a, i {
      width: 100%;
      background: linear-gradient(
        270deg,
        #efdcd1 -1.69%,
        #e0c6f7 43.78%,
        #adc3fb 99.83%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    a {
      width: 50%;
      @media screen and (max-width: 786px) {
        width: 100%;
      }
    }

    .inner {
      height: 100%;
      background: #151718;
      border-radius: 10px;

      span {
        color: white;
      }
    }
  }

  .inner {
    height: 100%;
    background: white;
    border-radius: 10px;

    span {
      font-weight: 300;
      color: white;
    }

    h4 {
      font-weight: 700;
    }
  }

  svg {
    margin: 7px;
  }

  i, svg {
    color: ${darkTheme ? "#f0ddce" : "#A4C2FD"};
    fill: ${darkTheme ? "#f0ddce" : "#A4C2FD"};

    &:hover {
      color: ${darkTheme ? "#fff" : "#151718"};
      fill: ${darkTheme ? "#fff" : "#151718"};
    }
  }

  p {
    font-size: 16px;
    font-weight: 300;
    margin: 0;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const Container = styled.div`
  h3,
  h4,
  span {
    color: white;
  }

  .topSection {
    width: 87%;

    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  @media screen and (max-width: 786px) {
    padding: 0rem;
  }
`;

const SubmitProposal = styled.a`
  border: 2px solid #efdcd1;
  border-radius: 10px;
  padding: 10px 25px;
  background: linear-gradient(
    270deg,
    #efdcd1 -1.69%,
    #e0c6f7 43.78%,
    #adc3fb 99.83%
  );
  background-clip: text;
  text-align: center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const { section, dao_id } = props;

return (
  <Container>
    <div className="d-flex flex-wrap gap-5">
      <div className="topSection">
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.Title`}
          props={{
            subtitle: section.guidance.subTitle,
            title: section.guidance.title,
            description: section.guidance.description,
            color: "#fff",
          }}
        />
      </div>
      <div className="d-flex w-100 justify-content-center">
        <div className="d-flex flex-wrap justify-content-center gap-5">
          {section.guidance.cards.map((card) => (
            <Item className="dark">
              <div className="inner d-flex flex-column justify-content-between p-4 align-items-left">
                <div>
                  <h4 className="color-text">{card.title}</h4>
                  <span>{card.description}</span>
                </div>
                {card.button.link && (
                  <div className="d-flex mt-3">
                    <a href={card.button.link}>{card.button.title}</a>
                    <i className="bi bi-chevron-right" />
                  </div>
                )}
              </div>
            </Item>
          ))}
        </div>
      </div>

      <div className="d-flex gap-3 w-100 flex-wrap justify-content-center">
        <SubmitProposal
          href={`//*__@replace:widgetPath__*/.App?page=create_proposal&dao_id=${dao_id}`}
        >
          Submit Proposal
          <i className="bi bi-chevron-right" />
        </SubmitProposal>
        <SubmitProposal
          href={`//*__@replace:widgetPath__*/.App?page=proposals&dao_id=${dao_id}`}
        >
          Show Proposals
        </SubmitProposal>
      </div>
    </div>
  </Container>
);
