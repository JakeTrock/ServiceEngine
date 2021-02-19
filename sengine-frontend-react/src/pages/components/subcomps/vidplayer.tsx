import * as React from "react";
import styled from "styled-components";
const FullVid = styled.video`
  width: 100%;
  height: 100%;
`;

export default (props) => {
  const vid = React.useRef(null);
  const changeFile = () => {
    const file = props.file;
    if (vid.current.canPlayType(file.type) === "")
      return alert("video editor dosen't support this format");

    const fileURL = (window.URL || window.webkitURL).createObjectURL(file);
    vid.current.src = fileURL;
  };
  React.useEffect(() => changeFile(), []);
  return (
    <FullVid
      onLoadedMetadata={(e) => props.callback([e.videoWidth, e.videoHeight])}
      ref={vid}
      autoPlay="true"
      loop="true"
      muted="true"
    />
  );
};