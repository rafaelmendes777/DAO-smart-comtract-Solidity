const CircleContainer = styled.div`
  position: absolute;
  top: 0%;
  right: 0%;
  height: 100%;
  z-index: 2;
  width: 60%;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const SectorUI = styled.div`
  position: absolute;
  top: ${(p) => p.shift}rem;
  left: ${(p) => p.shift}rem;
  width: ${(p) => p.size}%;
  height: ${(p) => p.size}%;
  border-radius: 50%;
  background: linear-gradient(90deg, ${(p) => p.color[0]} 50%, transparent 50%)
    0 0;
  background-repeat: no-repeat;
`;

return (
  <CircleContainer>
    <SectorUI color={["#e5e4f5", "efe5f1"]} size={250} shift={-5} />
    <SectorUI color={["#d5d5eb", "efe5f1"]} size={230} shift={-0} />
    <SectorUI color={["#cacae2", "efe5f1"]} size={210} shift={5} />
    <SectorUI color={["#c4c1dd", "efe5f1"]} size={180} shift={10} />
  </CircleContainer>
);
