import React from "react";

function ListBuilder(props) {
    const { visible, size, width, values, disabled } = props.objProps;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(hookset.current), 'value');
        //shim for weird onchange behaviour
        Object.defineProperty(hookset.current, 'value', {
            set: function (t) {
                const event = new Event('change');
                hookset.current.dispatchEvent(event);
                return descriptor.set.apply(this, arguments);
            },
            get: function () {
                return descriptor.get.apply(this);
            }
        });
        if (ohooks && ohooks !== {}) {
            //typical hook attachment loop
            Object.entries(ohooks).forEach(([key, value]) => {
                hookset.current.addEventListener(key, value);
            })
        }
    }, []);
    const id = props.uuid;
    const vis = (visible) ? "visible" : "hidden";
    const [allVals, setAllVals] = React.useState<string[]>(values !== "" ? values?.split(",") : []);
    const [output, setOutput] = React.useState<string>(allVals.join(","));

    const setVs = (avs) => {
        setAllVals(avs);
        setOutput(avs.join(","));
    };

    return (
        <>
            <input type="text" style={{ display: "none" }} id={id} ref={hookset} value={output} readOnly />
            <div style={{ backgroundColor: "white", border: "1px solid black", overflow: "scroll", width, visibility: vis, fontSize: size }}>
                {allVals.map((lbl, i) => (
                    <div key={i} style={{ border: "1px solid black" }}>
                        <input type="text" disabled={disabled} defaultValue={lbl} onChange={(e) => {
                            allVals[i] = e.target.value;
                            setVs(allVals);
                        }} />
                        <button type="button" disabled={disabled} onClick={() => {
                            allVals.splice(i, 1);
                            setVs(allVals);
                        }}>-</button>
                    </div>
                ))}
                <div style={{ border: "1px solid black" }}>
                    <input type="text" disabled={disabled} />
                    <button type="button" disabled={disabled} onClick={(e) => {
                        //@ts-ignore
                        const newVal = e.currentTarget.parentNode.childNodes.item(0).value;
                        if (newVal !== "") {
                            allVals.push(newVal);
                            setVs(allVals);
                            //@ts-ignore
                            e.currentTarget.parentNode.childNodes.item(0).value = "";
                        }
                    }}>+</button>
                </div>
            </div>
        </>
    );
}

export default ListBuilder;
