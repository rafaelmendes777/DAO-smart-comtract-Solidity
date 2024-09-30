const fileAccept = props.fileAccept || "*";
const onChange = props.onChange;

State.init({
  uploading: false,
  cid: null,
  filename: "",
});

const ipfsUrl = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

return (
  <div style={{ width: "max-content" }}>
    {/* {state.cid && (
      <a href={ipfsUrl(state.cid)} download>
        {state.filename}
      </a>
    )} */}
    <Files
      multiple={false}
      accepts={["image/*", "video/*", ".pdf"]}
      minFileSize={1}
      clickable
      className="d-flex justify-content-center align-items-center attachment-button"
      onChange={(files) => {
        if (!files || !files.length) return;

        const [body] = files;

        State.update({ uploading: true, cid: null });
        asyncFetch("https://ipfs.near.social/add", {
          method: "POST",
          headers: { Accept: "application/json" },
          body,
        }).then(({ body: { cid } }) => {
          State.update({ cid, filename: body.name, uploading: false });
          onChange(ipfsUrl(cid));
        });
      }}
    >
      {state.cid ? (
        <i className="bi bi-arrow-clockwise" />
      ) : (
        <i className="bi bi-image" />
      )}
    </Files>
  </div>
);
