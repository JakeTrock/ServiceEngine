import React from "react";

function ListBuilder(props) {
    const { visible, size, width, values, disabled } = props.objProps;
    const hookset = React.useRef(null);
    React.useEffect(() => {
        const ohooks = props.objHooks;
        if (ohooks && ohooks !== {}) {
            Object.entries(ohooks).forEach(([key, value]) => {
                // hookset.current.addEventListener(key, value);
                //TODO: fix me, cannot listen for changes oddly enough
                hookset.current.addEventListener("change", ()=>console.log("sdfadf"));
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
            <input type="hidden" id={id} ref={hookset} value={output} readOnly />
            <div style={{ backgroundColor: "white", border: "1px solid black", overflow: "scroll", width, visibility: vis, fontSize: size }}>
                {/* TODO:how can i make this always sync the current value? */}
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
