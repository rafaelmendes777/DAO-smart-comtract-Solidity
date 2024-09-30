let { assets, contractName } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { item, index, showMoreDefault, showCommentsDefault, type, preview } =
  props;

if (!item || !contractName) return <Widget src="flashui.near/widget/Loading" />;

const metrics = item.metrics ?? item;
assets = assets.home;
const accountId = context.accountId;

const Container = styled.div`
  width: 100%;
  height: max-content;
  padding: 3rem;

  @media screen and (max-width: 786px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 30px 80px 0px rgba(0, 0, 0, 0.1);
  padding: 2rem 3rem;

  h3 {
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    margin: 10px 0;
  }

  p {
    font-size: 14px;
  }

  .dao-img {
    width: 20px;
    height: 20px;
  }

  .metric {
    border-radius: 10px;
    height: 80px;
    width: 120px;
    background: linear-gradient(
      258deg,
      rgba(162, 195, 254, 0.5) 0%,
      rgba(225, 197, 252, 0.5) 28.72%,
      rgba(241, 220, 210, 0.5) 100%
    );
    @media screen and (max-width: 786px) {
      width: 100%;
    }
  }

  .info {
    display: flex;
    align-items: center;
  }

  .actions {
    gap: 3rem;

    @media screen and (max-width: 786px) {
      gap: 0;
      justify-content: space-between;
    }
  }

  .tag {
    border-radius: 50px;
    background: #a4c2fd;
    width: max-content;
    padding: 4px 15px;
    font-size: 14px;
    text-align: center;
    color: white;
  }

  @media screen and (max-width: 786px) {
    padding: 1.5rem;
  }

  :hover {
    background: #ffffff;
  }
`;

const Status = styled.div`
  border-radius: 50px;
  border: 1px solid ${(props) => props.color};
  width: max-content;
  padding: 4px 15px;
  font-size: 14px;
  text-align: center;
  color: ${(props) => props.color};
`;

const Comments = styled.div`
  border-top: 1px solid #efefef;
  padding-top: 1rem;
`;

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  height: 40px;
  padding: 10px 20px;
  background: #a4c2fd1a;
  border-radius: 18px;
  color: #686467;
  border: 1px solid #a4c2fd1a;

  &:hover {
    text-decoration: none;
    border: 1px solid #a4c2fd;
  }
`;

const CardContainer = styled.div`
  width: 100%;
  padding: 3px;

  &:hover {
    position: relative;
    border-radius: 10px;
    background: linear-gradient(
      270deg,
      #efdcd1 -1.69%,
      #e0c6f7 43.78%,
      #adc3fb 99.83%
    );
  }
`;

const [showMore, setShowMore] = useState(showMoreDefault);
const [showComments, setShowComments] = useState(showCommentsDefault);
const [copiedShareUrl, setCopiedShareUrl] = useState(false);
const pageName = type === "Report" ? "reports" : "proposals";

const isLiked = (item) => {
  return item.likes && item.likes.find((item) => item.author_id === accountId);
};

const handleLike = () => {
  Near.call(contractName, isLiked(item) ? "post_unlike" : "post_like", {
    id: item.id,
  });
};

const dao = Near.view(contractName, "get_dao_by_id", {
  id: parseInt(item.dao_id),
});

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

const CardItem = ({ item, index }) => (
  <CardContainer>
    <Card key={index} className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between">
        <Widget
          src="mob.near/widget/Profile"
          props={{
            accountId: item.author_id,
            tooltip: true,
          }}
        />
        {item.status && (
          <div className="d-flex gap-3 align-items-center justify-content-between">
            <Status color={colorMap(item.status)}>{item.status}</Status>
          </div>
        )}
      </div>
      <div className="d-flex flex-column gap-3">
        <h3>{item.title}</h3>
        <div className="d-flex flex-column gap-1">
          <div className="info">
            <span style={{ width: "12rem" }}>Created at:</span>
            <span>
              <i className="bi bi-calendar" />{" "}
              {item.timestamp
                ? new Date(item.timestamp / 1000000).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </span>
          </div>
          {item.snapshot_history.length > 1 ? (
            <div className="info">
              <span style={{ width: "12rem" }}>Last Edited at:</span>
              <span>
                <i className="bi bi-calendar" />{" "}
                {new Date(
                  item.snapshot_history[item.snapshot_history.length - 1]
                    .timestamp / 1000000
                ).toLocaleDateString()}
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="info">
            <span style={{ width: "12rem" }}>
              {em.post_type === "Proposal"
                ? "Requested sponsor:"
                : "Reported to:"}
            </span>
            {dao && (
              <a
                href={`https://near.org/ndcdev.near/widget/daos.App?page=proposals&dao_id=${dao.id}`}
                className="d-flex align-items-center gap-1"
              >
                <img className="dao-img" src={dao.logo_url} />
                <span>{dao.title}</span>
              </a>
            )}
          </div>
          {item.post_type === "Proposal" && (
            <div className="info">
              <span style={{ width: "12rem" }}>Requested amount:</span>
              <span>
                <b>${item.requested_amount ?? 0}</b>
              </span>
            </div>
          )}
        </div>
      </div>
      <a
        role="button"
        onClick={() => setShowMore(showMore === index ? null : index)}
      >
        <b>
          See More
          <i
            className={`bi blue ${
              showMore === index ? "bi-eye" : "bi-eye-slash"
            }`}
          />
        </b>
      </a>

      {showMore === index &&
        item.description &&
        item.post_type === "Proposal" && (
          <Widget
            src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
            props={{ text: item.description }}
          />
        )}

      {showMore === index && item.post_type === "Report" && (
        <>
          {metrics["audience"] && (
            <>
              <h5>
                How many people did your project reach during this funding
                period?
              </h5>
              <h3>
                <b>{metrics["audience"]}</b>
              </h3>
            </>
          )}
          {metrics["growth"] && (
            <>
              <h5>
                How does this month's audience reach compare to previous periods
                (provide a %)
              </h5>
              <h3>
                <b>{metrics["growth"]}</b>
              </h3>
            </>
          )}
          {metrics["average_engagement_rate"] && (
            <>
              <h5>
                What is the average engagement rate on your project's primary
                platform (choose one)? Use the formula (Total Likes, Shares &
                Comments / Total Followers) X 100 = AER %
              </h5>
              <h3>
                <b>{metrics["average_engagement_rate"]}</b>
              </h3>
            </>
          )}
          {metrics["performance_statement_1"] && (
            <>
              <h5>
                What is the biggest win (most improved part of project) during
                this funding period vs. the previous one (if applicable)?
              </h5>
              <Widget
                src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
                props={{
                  text: metrics["performance_statement_1"],
                }}
              />
            </>
          )}
          {metrics["performance_statement_2"] && (
            <>
              <h5>
                What is the biggest challenge your project is facing? What did
                not improve during this funding period?
              </h5>
              <Widget
                src="/*__@replace:widgetPath__*/.Components.MarkdownViewer"
                props={{
                  text: metrics["performance_statement_2"],
                }}
              />
            </>
          )}
        </>
      )}

      {item.labels?.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {item.labels?.map((tag) => (
            <div className="tag"># {tag}</div>
          ))}
        </div>
      )}

      {!preview && (
        <div className="actions d-flex align-items-center justify-content-between">
          <div role="button" className="d-flex gap-2" onClick={handleLike}>
            <span className="blue">{item.likes.length}</span>
            <i
              className={`bi blue ${
                isLiked(item) ? "bi-heart-fill" : "bi-heart"
              }`}
            />
          </div>

          <div
            role="button"
            className="d-flex gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <span className="blue">{item.comments.length}</span>
            <i className="bi blue bi-chat" />
          </div>

          <div role="button" className="d-flex gap-2">
            <Widget
              src={"/*__@replace:widgetPath__*/.Components.Clipboard"}
              props={{
                text: `https://near.org/ndcdev.near/widget/daos.App?page=proposal&id=${item.id}`,
              }}
            />
          </div>
          <Button
            href={`//*__@replace:widgetPath__*/.App?page=proposal&id=${item.id}`}
          >
            {`Open ${item.post_type}`}
            <i className={"bi blue bi-box-arrow-up-right"} />
          </Button>
        </div>
      )}

      {showComments && (
        <Comments>
          <Widget
            src="/*__@replace:widgetPath__*/.Components.Comments"
            props={{
              postId: item.id,
              showCreate: true,
            }}
          />
        </Comments>
      )}
    </Card>
  </CardContainer>
);

return <CardItem item={item} index={index} />;
