const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 5rem;
  height: 100%;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr); // 1 columns
    gap: 1rem;
  }

  a {
    &:hover {
      text-decoration: none;
    }
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  height: ${(p) => (p.height ? p.height + "%" : "auto")};
`;

const CardTitle = styled.h4`
  color: white !important;
  font-weight: 600;
  text-align: center;
  padding: 1rem 1.5rem;
  border-radius: 10px 10px 0px 0px;
  background: #a4c2fd;
  margin-bottom: unset;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const ListItem = styled.li`
  background-color: rgb(43, 41, 51);
  color: white;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  font-size: 1.2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 20px 30px 0px rgba(0, 0, 0, 0.25);
`;

const ItemText = styled.span``;

const Arrow = styled.span`
  color: #007bff;
`;

const CardContainer = styled.div`
  width: 370px;
`;

const CardBlockContainer = styled.div`
  margin-top: 1rem;
  height: ${(p) => (p.height ? "100%" : "auto")};
`;

function groupByCategoryList(daos) {
  const categoryMap = {};

  daos.forEach((dao) => {
    dao.verticals.forEach((category) => {
      if (!categoryMap[category]) {
        categoryMap[category] = { title: category, links: [] };
      }

      categoryMap[category].links.push({ title: dao.title, id: dao.id });
    });
  });

  return Object.values(categoryMap).map((category) => ({
    title: category.title,
    links: category.links,
  }));
}

const groupedByCategory = groupByCategoryList(props.daos);

const CardBlock = ({ height, id }) => (
  <CardBlockContainer height={height}>
    <CardTitle>{groupedByCategory[id].title}</CardTitle>
    <Card key={groupedByCategory[id].title} height={height}>
      <LinkList>
        {groupedByCategory[id].links.map((link) => (
          <Link
            href={`//*__@replace:widgetPath__*/.App?page=proposals&dao_id=${link.id}`}
          >
            <ListItem key={link}>
              <ItemText>{link.title}</ItemText>
              <Arrow>
                <i className="bi bi-chevron-right" />
              </Arrow>
            </ListItem>
          </Link>
        ))}
      </LinkList>
    </Card>
  </CardBlockContainer>
);

return (
  <GridContainer>
    <CardContainer>
      <CardBlock height={90} id={1} />
    </CardContainer>
    <CardContainer>
      <CardBlock id={0} />
      <CardBlock height={50} id={2} />
    </CardContainer>
    <CardContainer>
      <CardBlock id={3} />
      <CardBlock id={4} />
      <CardBlock id={5} />
    </CardContainer>
  </GridContainer>
);
