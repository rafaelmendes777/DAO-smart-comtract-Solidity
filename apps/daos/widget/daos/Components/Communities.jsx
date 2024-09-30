const maxLimit = props.limit || 1000;
const darkTheme = props.theme === "dark";

const STATUS = {
  GOOD: ["Yes", "Approved", "Yes, include in special request"],
  BAD: ["No"],
};

const Item = styled.div`
  width: 350px;
  height: 280px;
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

    h4 {
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

    .inner {
      height: 100%;
      background: #151718;
      border-radius: 10px;
    }
  }

  .inner {
    height: 100%;
    background: white;
    border-radius: 10px;
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

const [communities, setCommunities] = useState([]);

const fetchCommunities = () => {
  const sheetId = "1CxRHo8y6HYqWY7FuguTN8laUjNqeUjDhtnXb4mbV7V4";
  const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
  const sheetName = "Logo";
  const query = encodeURIComponent("Select *");
  const url = `${base}&sheet=${sheetName}&tq=${query}`;
  const resp = fetch(url);

  if (resp?.body) {
    let jsonString = resp.body.match(/(?<="table":).*(?=}\);)/g)[0];
    let json = JSON.parse(jsonString);

    setCommunities(json.rows.map((item) => item.c));
  }
};

fetchCommunities();

if (!communities || communities.length === 0)
  return (
    <div className="d-flex justify-content-center align-items-center gap-2">
      <Widget src="flashui.near/widget/Loading" /> <b>Loading communities...</b>
    </div>
  );

const Connect = ({ item, index }) => (
  <Item className={`${darkTheme ? "dark" : ""}`}>
    <div className="inner d-flex flex-column justify-content-center gap-3 align-items-center">
      <Widget
        src={`/*__@replace:widgetPath__*/.Components.CommunityImage`}
        props={{ image: item[6].v, index }}
      />
      <h4 className="bold color-text px-3 mt-1 text-center">{item[1].v}</h4>
      <div className="d-flex gap-4">
        {item[3].v && (
          <a href={item[3].v} target="_blank">
            <i className={`fs-3 bi bi-telegram`} />
          </a>
        )}
        {item[4].v && (
          <a href={item[4].v} target="_blank">
            <i className={`fs-3 bi bi-twitter-x`} />
          </a>
        )}
        {item[5].v && (
          <a href={item[5].v} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path d="M26.802 0C25.6903 0 24.6599 0.578583 24.0761 1.52259L17.8071 10.8307C17.6041 11.1352 17.6853 11.5513 17.9949 11.7544C18.2437 11.9219 18.5736 11.9015 18.797 11.7036L24.9696 6.34919C25.0711 6.25782 25.2285 6.26798 25.3248 6.36948C25.3655 6.41516 25.3909 6.47607 25.3909 6.53696V23.2956C25.3909 23.4326 25.2792 23.5442 25.1422 23.5442C25.0659 23.5442 25 23.5138 24.9492 23.4529L6.28934 1.13179C5.6802 0.416173 4.78679 0 3.84772 0H3.19796C1.43148 0 0 1.43123 0 3.19743V26.8026C0 28.5688 1.43148 30 3.19796 30C4.30964 30 5.3401 29.4215 5.92385 28.4775L12.1929 19.1694C12.3959 18.8648 12.3147 18.4487 12.0102 18.2456C11.7614 18.0781 11.4315 18.0985 11.2081 18.2964L5.03553 23.6508C4.93401 23.7422 4.77664 23.732 4.6802 23.6306C4.63959 23.5848 4.61421 23.524 4.61421 23.4631V6.68923C4.61421 6.5522 4.72588 6.44054 4.86294 6.44054C4.93909 6.44054 5.00507 6.47099 5.05583 6.53189L23.7107 28.8683C24.3198 29.5838 25.2081 30 26.1522 30H26.802C28.5685 30 30 28.5738 30 26.8077V3.19743C30 1.43123 28.5685 0 26.802 0Z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  </Item>
);

return (
  <div className="d-flex flex-wrap gap-5 justify-content-center">
    {communities.slice(0, maxLimit).map((item, i) => (
      <Connect key={i} item={item} index={i} />
    ))}
  </div>
);
