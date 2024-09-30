const { proposals } = props;

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: rgb(43, 41, 51);
  overflow: hidden;
  position: relative;

  .scroll {
    display: flex;
    animation: scroll 30s linear infinite;
  }

  &:hover {
    .scroll {
      animation-play-state: paused;
    }
  }
`;

const Badge = styled.a`
  width: 350px;
  min-width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 18px 0;
  gap: 1rem;
  color: white;
  font-size: 1em;
  border-left: 0.5px solid rgba(164, 194, 253, 0.1);
  border-right: 0.5px solid rgba(164, 194, 253, 0.1);

  &:hover {
    text-decoration: none;
    background: #3d3947;
  }

  small {
    color: white;
  }
`;

const Amount = styled.span`
  font-weight: bold;
  margin-right: 5px;
  color: #fdefb1 !important;
`;

const Label = styled.span`
  color: white;
  font-size: 1em;
  font-weight: 600;
`;

const Status = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  padding: 0 1rem;
  border-radius: 20px;
  border: 1px solid ${(p) => p.color};
  height: 20px;
  color: ${(p) => p.color};
  font-weight: 600;
`;

const Logo = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: #151718;
`;

const colorMap = (status) => {
  switch (status) {
    case "New":
      return "rgb(146 168 210)";
    case "Closed":
      return "rgb(196 196 196)";
    case "InReview":
      return "rgb(223 193 73)";
    case "Approved":
      return "rgb(99 222 100)";
    case "Rejected":
      return "rgb(214 113 113)";
    default:
      break;
  }
};

const formatDate = (timestamp) =>
  new Date(parseInt(timestamp) / 1000000).toLocaleDateString();

return (
  <Container>
    {[1, 2, 3].map((el) => (
      <div className="scroll">
        {proposals.map(({ proposal, dao }, index) => (
          <Badge
            key={index}
            role="button"
            href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${proposal.id}`}
          >
            <Logo>
              <img src={dao.logo_url} />
            </Logo>
            <div className="d-flex flex-column gap-1">
              <div className="d-flex gap-2 align-items-center">
                <Amount>${proposal.requested_amount ?? 0}</Amount>
                <Label>{dao.title}</Label>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <small>{formatDate(proposal.timestamp)}</small>
                <Status color={colorMap(proposal.status)}>
                  {proposal.status}
                </Status>
              </div>
            </div>
          </Badge>
        ))}
      </div>
    ))}
  </Container>
);
