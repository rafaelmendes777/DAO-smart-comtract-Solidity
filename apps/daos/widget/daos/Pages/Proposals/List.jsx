let { contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);

if (!contractName) return <Widget src="flashui.near/widget/Loading" />;

let { dao_id, type, accountId } = props;

const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem 0;

  .dao-img {
    width: 50px;
    height: 50px;
  }

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: left;
  img {
    margin-right: 1rem;
  }

  @media screen and (max-width: 768px) {
    align-items: center;
    flex-direction: column;
    img {
      margin-bottom: 1rem;
    }
  }
`;

let items = null;
let dao = null;

if (dao_id) {
  items = Near.view(contractName, "get_dao_posts", {
    dao_id: parseInt(dao_id),
  });
  dao = Near.view(contractName, "get_dao_by_id", {
    id: parseInt(dao_id),
  });
} else if (accountId)
  items = Near.view(contractName, "get_posts_by_author", {
    author: accountId,
  });
else items = Near.view(contractName, "get_all_posts", { page: 0, limit: 100 });

if (!items) return <Widget src="flashui.near/widget/Loading" />;

return (
  <Container>
    <>
      {dao_id ? (
        <>
          <Header>
            <img className="dao-img" src={dao.logo_url} />
            <h1>{dao.title}</h1>
          </Header>

          <div className="mt-4">
            <a
              style={{ fontSize: "24px" }}
              className="btn-primary text-uppercase"
              href={`//*__@replace:widgetPath__*/.App?page=create_proposal&dao_id=${dao_id}`}
            >
              create {type}
            </a>
          </div>
        </>
      ) : accountId ? (
        <Widget
          src={`/*__@replace:widgetPath__*/.Components.TopNavBar`}
          props={props}
        />
      ) : (
        <h1>All {type}s</h1>
      )}

      <div className="d-flex flex-column gap-4 mt-4">
        {items?.length ? (
          items
            .filter((i) => i.post_type === type)
            .map((item, index) => (
              <Widget
                src="/*__@replace:widgetPath__*/.Components.Item"
                props={{ item, index, type, id: item.id }}
              />
            ))
        ) : (
          <div className="w-100 my-5 d-flex justify-content-center align-tems-center">
            <h1>No active {type}s</h1>
          </div>
        )}
      </div>
    </>
  </Container>
);
