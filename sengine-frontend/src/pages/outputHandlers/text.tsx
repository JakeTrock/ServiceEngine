import * as React from "react";

// markup
const TextOutput = () => {
    const [txtContent, setTxtContent] = React.useState<String>();
    const txt = React.useRef(null);

    const update = (mem) => {
        setTxtContent(mem.buffer);//TODO: Do I have to do any processing to the buffer?
    };
    return (
        <textarea ref={txt}></textarea>
    );
};

export default TextOutput;