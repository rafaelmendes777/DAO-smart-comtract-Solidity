const Wrapper = styled.div`
  display: flex;
  border-radius: 10px;
  background: #fff;

  div.content {
    position: relative;
    z-index: 3;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentArea = styled.div`
  padding: 40px;
  width: 60%;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const PrimaryButton = styled.a`
  &.btn-primary {
    margin-top: 20px;
    border-radius: 10px;
    background: #151718;
    border: #151718;
    box-shadow: 0px 20px 30px 0px rgba(31, 27, 50, 0.22);
    display: flex;
    color: white;

    :hover {
      border: black;
    }

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  padding-top: 20px;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const SecondaryButton = styled.a`
  &.btn-primary {
    width: 45%;
    background: white;
    border: black;
    color: black !important;
    display: flex;
    margin-top: 20px;
    border-radius: 10px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }

    :hover {
      border: black;
    }
  }
`;

const Image = styled.img`
  width: 100%;
`;

const { section } = props;

return (
  <Wrapper>
    <ContentArea>
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.Title`}
        props={{
          title: section.office.title,
          description: section.office.description,
        }}
      />
      <PrimaryButton
        className="btn-primary d-flex"
        href={section.office.buttons.book.link}
      >
        <div>
          {section.office.buttons.book.text}
          <i className="bi bi-chevron-right" />
        </div>
      </PrimaryButton>
      <ButtonGroup>
        <SecondaryButton
          className="btn-primary d-flex"
          href={section.office.buttons.workshops.link}
        >
          <div>
            {section.office.buttons.workshops.text}
            <i className="bi bi-chevron-right" />
          </div>
        </SecondaryButton>
        <SecondaryButton
          className="btn-primary d-flex"
          href={section.office.buttons.book.calendar.link}
        >
          <div>
            {section.office.buttons.calendar.text}
            <i className="bi bi-chevron-right" />
          </div>
        </SecondaryButton>
      </ButtonGroup>
    </ContentArea>
    <div>
      <Image src={section.office.image} alt="Office" />
    </div>
  </Wrapper>
);
