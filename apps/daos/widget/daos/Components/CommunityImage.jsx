const { image, index } = props;

const Img = styled.img`
  border-radius: 50%;
  width: 100px !important;
  height: 100px !important;
  background: ${index % 3 === 0
    ? "#A4C2FD"
    : index % 2 === 0
    ? "#D8C4FE"
    : "#E9D1E6"};
`;

const [img, setImg] = useState(image);
const fallbackUrl =
  "https://ipfs.near.social/ipfs/bafkreiav2t6nufvveb336dcd7sm6obpje5hl74vbuoct3fyoxfrcfhfhbq";

return <Img src={img} onError={() => setImg(fallbackUrl)} />;
