const { assets } = VM.require(`/*__@replace:widgetPath__*/.Config`);

const [showMenu, setShowMenu] = useState(false);

const links = [
  {
    title: "ACTIVITY FEED",
    href: "//*__@replace:widgetPath__*/.App?page=reports",
    color: "#FDEFB1",
    items: [
      {
        title: "List of Proposals",
        href: "//*__@replace:widgetPath__*/.App?page=proposals",
      },
      {
        title: "List of Reports",
        href: "//*__@replace:widgetPath__*/.App?page=reports",
      },
      {
        title: "Guidance for Proposals and Reports",
        href: "//*__@replace:widgetPath__*/.App?page=guidance",
      },
    ],
  },
  {
    title: "COMMUNITIES",
    href: "//*__@replace:widgetPath__*/.App?page=communities",
    color: "#F7CCFA",
  },
  {
    title: "ABOUT",
    href: "#about",
    color: "#AFC5FE",
    items: [
      {
        title: "Charter",
        target: "_blank",
        href: "https://docs.google.com/document/d/11m2-dmDRABz74WZfkcgGyFz7Wn6k4y9oPVXPCCyhXp8/edit",
      },
      {
        title: "SM Strategy",
        href: "//*__@replace:widgetPath__*/.App?page=info",
      },
      {
        title: "Achievements",
        href: "//*__@replace:widgetPath__*/.App?page=achievements",
      },
      {
        title: "Councils",
        href: "//*__@replace:widgetPath__*/.App?page=councils",
      },
      {
        title: "Meetings and Workshops Calendar",
        href: "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&mode=AGENDA&src=MDNiOTMyMjJmNGQ4YTIxNmQ3MmZmNmE1MDg5ZjY4NGQ4MWI3Mjg0OGUzMGQ1ZjllOGE4MzdiZTBlYjNjNjdjZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23C0CA33",
      },
      {
        title: "Bounty Program",
        target: "_blank",
        href: "https://www.heroes.build/",
      },
      {
        title: "Brand Toolkit",
        target: "_blank",
        href: "https://nftstorage.link/ipfs/bafybeihe5lcn2jv2bhawpqjswem7yk3nlkauqxeqia3nqbbr6eaizkdsx4",
      },
    ],
  },
];

const Navbar = styled.div`
  padding: 1.5rem 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #151718;

  @media screen and (max-width: 768px) {
    padding: 1.5rem 2rem;

    img {
      width: 50px;
      height: 50px;
    }
  }
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;

  a {
    color: #fff;
    font-size: 14px;
    font-style: normal;
    line-height: normal;
    text-decoration: none;
  }

  .dropdown {
    position: relative;
    display: inline-block;
    height: 50px;

    &:hover .dropdown-content {
      display: block;
    }
  }

  .dropdown-content {
    display: none;
    position: absolute;
    width: 250px;
    top: 45px;
    right: 0;
    background-color: #f1f1f1;
    border-radius: 10px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;

    a {
      padding: 20px 25px;
      text-decoration: none;
      display: block;
      font-size: 16px;
      color: black;
      letter-spacing: normal;

      &:hover {
        text-decoration: none;
        background-color: rgba(227, 195, 255, 0.2);
      }

      &:first-child {
        &:hover {
          border-radius: 10px 10px 0 0;
        }
      }

      &:last-child {
        &:hover {
          border-radius: 0 0 10px 10px;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => props.bg};
`;

const MobileNav = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
  }

  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  padding: 24px 36px 36px 16px;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;

  border-radius: 0px 0px 10px 10px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(5px);

  z-index: 50;

  a {
    color: #fff;
    font-size: 16px;
    font-style: normal;
    line-height: normal;
    text-decoration: none;
  }
`;

const MobileMenu = styled.button`
  all: unset;
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

return (
  <Navbar className="position-relative">
    <a href={`//*__@replace:widgetPath__*/.App?page=home`}>
      <img src={assets.logoWhite} />
    </a>
    <div className="d-flex gap-4 align-items-center">
      <LinksContainer>
        {links.map((link) => (
          <a className="d-flex gap-2 align-items-center" href={link.href}>
            <Circle bg={link.color} />
            {link.items?.length > 0 ? (
              <div className="d-flex align-items-center dropdown">
                <div>{link.title}</div>
                <div className="dropdown-content">
                  {link.items.map(({ title, href, target }) => (
                    <a href={href} target={target}>
                      <div className="d-flex gap-2 link align-items-center">
                        {title}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div>{link.title}</div>
            )}
          </a>
        ))}
      </LinksContainer>
      <MobileMenu className="fs-1" onClick={() => setShowMenu(!showMenu)}>
        <i className="bi bi-list text-white" />
      </MobileMenu>
    </div>

    {showMenu && (
      <MobileNav>
        <div
          onClick={() => setShowMenu(!showMenu)}
          style={{ cursor: "pointer" }}
          className="fs-1"
        >
          <i className="bi bi-x text-white" />
        </div>
        <div className="d-flex flex-column gap-4">
          {links.map((link) => (
            <>
              {link.items?.length > 0 ? (
                <div>
                  <div className="d-flex text-white gap-2 align-items-center">
                    <Circle bg={link.color} />
                    <a>{link.title}</a>
                  </div>
                  <div className="d-flex gap-3 flex-column py-3">
                    {link.items.map(({ title, href, target }) => (
                      <div className="d-flex gap-2 px-3  align-items-center">
                        <a href={href} target={target}>
                          {title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <a className="d-flex gap-2 align-items-center" href={link.href}>
                  <Circle bg={link.color} />
                  <div>{link.title}</div>
                </a>
              )}
            </>
          ))}
        </div>
      </MobileNav>
    )}
  </Navbar>
);
