const { value, text, loading, type } = props;
const { Circle } = VM.require(
  `/*__@replace:widgetPath__*/.Components.MetricsDisplay.styled`,
);

const Loading = () => <Widget src="flashui.near/widget/Loading" />;
if (!Circle) return <Loading />;

const formatValue = (value) => {
  const val = value ? parseFloat(value) : null;

  if (val === null || val === undefined) return "n/a";

  return val >= 1000000000
    ? `${parseFloat(val / 1000000000).toFixed(2)}B`
    : val >= 1000000
    ? `${parseFloat(val / 1000000).toFixed(2)}M`
    : val >= 1000
    ? `${parseFloat(val / 1000).toFixed(2)}K`
    : Number.isInteger(val)
    ? val
    : val.toFixed(2);
};

const Desc = styled.span`
  color: #fcf8ff;
  text-align: center;
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

const Name = styled.div`
  color: #fcf8ff;
  text-align: center;
  font-family: Montserrat;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  max-width: 600px;
  gap: 10px;
  justify-content: space-evently;
`;

const NameInnerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

return (
  <div className="item">
    <div className="inner">
      {loading ? (
        <Loading />
      ) : type === "list" ? (
        <NameContainer>
          {value.map((item) => (
            <NameInnerContainer>
              <Circle color={item.color} /> <Name>{item.name}</Name>
            </NameInnerContainer>
          ))}
        </NameContainer>
      ) : (
        <span>{formatValue(value)}</span>
      )}
    </div>

    <div className="d-flex justify-content-center align-items-center gap-2">
      {color && <Circle color={color} />}
      <Desc>{text}</Desc>
    </div>
  </div>
);
