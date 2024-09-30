let { assets, socials, content } = VM.require(
  `/*__@replace:widgetPath__*/.Config`,
);

const page = props.page;
const showFooterPages = [
  null,
  undefined,
  "home",
  "councils",
  "guidance",
  "achievements",
  "communities",
];

const Footer = styled.div`
  display: ${showFooterPages.includes(page) ? "flex" : "none"};
  width: 100%;
  position; absolute;
  bottom: 0;
  background: #151718;
  padding: 4rem 0 7rem 0;
`;

const Description = styled.p`
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 300;
  tet-align: center;
  width: 50%;

  @media screen and (max-width: 786px) {
    width: 100%;
  }
`;

const ImageContainer = styled.img`
  ${page !== "home" && "display: none;"}
  height: 280px;
  width: 100%;
  object-fit: cover;
`;
const FooterLogo = styled.img`
  width: 70px !important;
  height: 70px !important;
`;

const Socials = () => (
  <div className="d-flex gap-5">
    {Object.entries(socials).map(([name, link]) => (
      <a href={link} target="_blank">
        <i className={`fs-1 text-white bi bi-${name}`} />
      </a>
    ))}
  </div>
);

const MidContent = () => {
  return (
    <div className="d-flex flex-column align-items-center gap-4">
      <FooterLogo src={assets.logoColor} />
      <Description>{content.home.footerDesc}</Description>
      <Socials />
    </div>
  );
};

const SmallContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
    justify-content: center;
    gap: 1rem;
    align-items: center;
  }
`;

return (
  <>
    <ImageContainer src={assets.home.support_bg} />
    <Footer className="justify-content-center">
      <MidContent />
    </Footer>
  </>
);
