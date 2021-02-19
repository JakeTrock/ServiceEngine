import * as React from "react";
import styled from "styled-components";
const FullImg = styled.img`
  width: 100%;
  height: 100%;
`;

export default (props) => {
  const img = React.useRef(null);
  const changeFile = () => {
    const file = props.file;
    const fileURL = (window.URL || window.webkitURL).createObjectURL(file);
    img.current.src = fileURL;
  };
  React.useEffect(() => changeFile(), []);
  return (
    <FullImg onLoad={(e) => props.callback([e.width, e.height])} ref={img} />
  );
};