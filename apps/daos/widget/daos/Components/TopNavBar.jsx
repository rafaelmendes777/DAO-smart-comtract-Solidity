const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);
const { hasNotifications, daoId, accountId } = props;

if (!assets) return <Widget src="flashui.near/widget/Loading" />;

const links = [
  {
    text: "Reports",
    href: `//*__@replace:widgetPath__*/.App?page=reports&accountId=${accountId}`,
    icon: <i className="bi bi-clipboard-data-fill fs-5" />,
  },
  {
    text: "Proposals",
    href: `//*__@replace:widgetPath__*/.App?page=proposals&accountId=${accountId}`,
    icon: <i className="bi bi-file-earmark-text-fill fs-5" />,
  },
  {
    text: "Comments",
    href: `//*__@replace:widgetPath__*/.App?page=comments`,
    disabled: true,
    icon: <i className="bi bi-chat-square-text-fill fs-5" />,
  },
  {
    text: "Favourites",
    href: `//*__@replace:widgetPath__*/.App?page=favourites`,
    disabled: true,
    icon: <i className="bi bi-star-fill fs-5" />,
  },
];

const Navbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 3rem;
  gap: 3rem;
  align-items: center;
  border-radius: 20px;
  background: white;
  width: 100%;
`;

const LinksContainer = styled.div`
  color: #151718;
  font-size: 18px;

  a {
    padding: 2rem 1.5rem;
    text-decoration: none;

    &.active:hover {
      background: rgba(164, 194, 253, 0.2);
      font-weight: bold;

      i {
        color: #a4c2fd;
      }
    }

    &.disabled {
      cursor: not-allowed;
      color: #ccc;
    }
  }
`;

return (
  <Navbar>
    <div className="d-flex gap-3 items-center">
      <i className="bi bi-person-circle fs-4" />
      <h4>
        <b>My Activity</b>
      </h4>
    </div>
    <LinksContainer className="d-flex justify-content-between">
      {links.map(({ icon, disabled, text, href }) => (
        <a
          className={`d-flex gap-2 align-items-center ${
            disabled ? "disabled" : "active"
          }`}
          href={href}
        >
          {icon}
          <div>{text}</div>
        </a>
      ))}
    </LinksContainer>
  </Navbar>
);
