return (
  <OverlayTrigger
    placement="auto"
    overlay={
      <Tooltip>{state.copied ? "Copied!" : "Copy to clipboard"}</Tooltip>
    }
  >
    <span
      onClick={() => {
        clipboard.writeText(props.text).then(() => {
          State.update({ copied: true });
          if (props.onCopy) {
            props.onCopy(props.text);
          }
        });
      }}
    >
      {state.copied ? (
        <>
          {props.copiedIcon ?? <i className="bi blue bi-check-lg" />}
          {props.copiedLabel ?? props.label}
        </>
      ) : (
        <>
          {props.clipboardIcon ?? <i className="bi blue bi-share" />}{" "}
          {props.label}
        </>
      )}
    </span>
  </OverlayTrigger>
);
