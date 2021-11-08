import React from "react";
import '../../data/splitpanel.css';
import { ReactSortable } from "react-sortablejs";
import { v4 as uuidv4 } from 'uuid';
import { IFaceBlock } from "../../data/interfaces";
import { compDict, compDefaults } from "./guiData/compDict";

function GuiEditPanel(props) {
    const [ifOrder, setifOrder] = React.useState<IFaceBlock[]>([]);
    const [selection, setSelection] = React.useState<IFaceBlock>();

    React.useEffect(() => {
        let iv = props.initValues;
        if (iv && iv.length > 0) {
            setifOrder(iv);
            setSelection(ifOrder[0]);
        }
    }, []);

    const parentCallback = (e) => props.parentCallback(e);

    const setIf = (ifo) => {
        ifo = ifo.filter(i => i !== undefined);
        setifOrder(ifo);
        parentCallback(ifo);
    };
    return (
        <div className="parentDiv">
            <div className="split left">
                <ReactSortable
                    animation={200}
                    group={{
                        name: "shared",
                        pull: true,
                        put: false,
                        revertClone: true
                    }}
                    list={compDefaults}
                    setList={() => { }}
                >
                    {compDefaults.map((item, i) => (
                        <>
                            <div key={`${i}-${item.id}`} id={`${i}-${item.id}`} style={{ width: "100%", backgroundColor: "white", border: "1px solid black" }}>
                                {React.createElement(compDict[item.id], { key: i, id: item.id, objProps: item.defaults })}
                            </div><br />
                        </>
                    )
                    )}
                </ReactSortable>
            </div>

            <div className="split center">
                <ReactSortable
                    id="holder"
                    style={{ width: "100%", height: "100%", backgroundColor: "rgb(168, 168, 168)" }}
                    group={{
                        name: "shared",
                        pull: false,
                        put: true
                    }}
                    list={ifOrder}
                    setList={() => { }}
                    removeOnSpill={true}
                    onAdd={(e) => {
                        //workaround deep copy
                        //@ts-ignore
                        const idv = e.item.id.split("-")[1];
                        if (idv) {
                            const target = JSON.parse(JSON.stringify(compDefaults.filter((i) => i.id === idv)[0]));
                            target.uuid = `${idv}-${uuidv4()}`;
                            if (target.hasOwnProperty("disabled")) {
                                target.disabled = false;
                            }
                            ifOrder.splice(e.newIndex, 0, target);
                            setIf(ifOrder);
                            setSelection(target);
                        }
                    }}
                    onUpdate={(e) => {
                        let ifodupe = ifOrder;
                        ifodupe.splice(e.newIndex, 0, ifodupe.splice(e.oldIndex, 1)[0]);
                        setIf(ifodupe);
                    }}
                >
                    {ifOrder.map((item, i) => (
                        <div style={selection === item ? { width: "100%", border: "1px solid lightgreen" } : { width: "100%" }} onClick={() => setSelection(item)}>
                            {React.createElement(compDict[item.id], { key: i, uuid: item.uuid, objProps: item.defaults })}
                            <br />
                        </div>
                    ))}
                </ReactSortable>
            </div>

            <div className="split right">
                {selection !== undefined && selection.defaults && Object.keys(selection.defaults).map((key, i) => (
                    <div key={i} style={{ paddingLeft: "1em" }}><p>{key}</p>{() => {
                        const type = typeof selection.defaults[key];
                        // {React.createElement(compDict[item.id], { key: i, uuid: item.uuid, objProps: item.defaults })}
                        if (type === "boolean") {
                            return React.createElement("input", {
                                type: "checkbox", defaultChecked: selection.defaults[key], onChange: (e) => {
                                    //@ts-ignore
                                    selection.defaults[key] = e.target.value
                                    setSelection(selection);
                                }
                            });
                        } else if (type === "number") {
                            return React.createElement("input", {
                                type: "number", defaultChecked: selection.defaults[key], onChange: (e) => {
                                    //@ts-ignore
                                    selection.defaults[key] = e.target.value
                                    setSelection(selection);
                                }
                            });
                        } else if (type === "string") {
                            return React.createElement("input", {
                                type: "text", defaultChecked: selection.defaults[key], onChange: (e) => {
                                    //@ts-ignore
                                    selection.defaults[key] = e.target.value
                                    setSelection(selection);
                                }
                            });
                        } else if (Array.isArray(selection.defaults[key])) {
                            const childType = typeof selection.defaults[key][0];
                            if (childType === "boolean") {
                                return React.createElement(compDict["listbuild"], {
                                    defaultChecked: selection.defaults[key], onChange: (e) => {
                                        //@ts-ignore
                                        selection.defaults[key] = e.target.value
                                        setSelection(selection);
                                    }
                                });
                            } else if (childType === "number") {

                            } else if (childType === "string") {
                                // React.createElement(compDict[item.id], { key: i, uuid: item.uuid, objProps: item.defaults })
                            } else if (childType === "object") {

                            }
                            // selection.defaults[key] = e.target.value.split(',')
                        }
                        setIf(ifOrder.map((i) => {
                            if (i.uuid === selection.uuid) {
                                return selection;
                            }
                            return i;
                        }));
                    }}</div>
                ))}
            </div>
        </div >
    );
}

export default GuiEditPanel;