const { imgUrl, title, description, subtitle, color } = props;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: ${(p) => (p.color ? p.color : "inherit")};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  img {
    width: 33px;
    margin-right: 15px;
  }

  span {
    font-size: 32px;
    font-weight: 700;
  }
`;

const Description = styled.span`
  font-size: 24px;
  font-weight: 400;
`;

const SubTitle = styled.span`
  font-size: 24px;
  font-weight: 400;
  text-transform: uppercase;
`;

return (
  <Container color={color}>
    {subtitle && <SubTitle>{subtitle}</SubTitle>}
    <Title>
      {imgUrl && <img src={imgUrl}></img>}
      <span>{title}</span>
    </Title>
    {description && <Description>{description}</Description>}
  </Container>
);
