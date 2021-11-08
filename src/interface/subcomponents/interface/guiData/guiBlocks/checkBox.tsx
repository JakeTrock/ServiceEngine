import React from "react";

function CheckBox(props) {
    const { visible, disabled, value } = props.objProps;
    const [onOff, setOnOff] = React.useState<boolean>(value || false);
    const hookset = React.useRef(null);
    //attach hooks to html
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            //if object has hook kvp, loop thru and attach all functions from hooks to html object
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, e => (value as Function)({ value: onOff }));//TODO: needs to be debounced.
            })
        }
    }, [onOff]);
    const id = props.uuid;
    const vis = (visible === false) ? "hidden" : "visible";
    return (
        <input type="checkbox" id={id} defaultChecked={onOff} disabled={disabled} onClick={() => setOnOff(v => !v)} ref={hookset} style={{ visibility: vis }} />
    );
}

export default CheckBox;
