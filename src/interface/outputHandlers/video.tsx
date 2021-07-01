import * as React from "react";

// markup
const VideoOutput = () => {
    const [byteArray, setByteArray] = React.useState<Uint8ClampedArray>();
    const cv = React.useRef(null);
    let ctx;
    React.useEffect(() => {
        ctx = cv.getContext('2d');
    }, []);
    const update = (mem) => {
        setByteArray(new Uint8ClampedArray(mem.buffer, 0, 512 * 512 * 4));
        const img = new ImageData(byteArray, 512, 512);
        ctx.putImageData(img, 0, 0);
    };
    return (
        <canvas ref={cv}></canvas>
    );
};

export default VideoOutput;
