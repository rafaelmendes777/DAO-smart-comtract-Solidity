const { text } = props;

const SwitchRoot = styled("Switch.Root")`
  all: unset;
  display: block;
  min-width: 70px;
  width: 70px;
  height: 30px;
  background: linear-gradient(
    96deg,
    #fdefb1 -19.42%,
    #e1c4fe 49.87%,
    #95c3fe 98.55%
  );
  border-radius: 9999px;
  position: relative;

  &[data-state="checked"] {
    background-color: black;
  }
`;

const SwitchThumb = styled("Switch.Thumb")`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.25);
  border-radius: 9999px;
  height: 30px;
  width: 30px;
  transition: transform 150ms;
  transform: translateX(0px);
  will-change: transform;
  color: white;

  &[data-state="checked"] {
    transform: translateX(43px);
  }
`;

return (
  <SwitchRoot>
    <SwitchThumb>
      <div>{text}</div>
    </SwitchThumb>
  </SwitchRoot>
);
