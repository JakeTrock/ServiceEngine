import React from "react";
import { IFaceBlock } from "../../data/interfaces";
import { compDict, compDefaults } from "../../guiData/compDict";
import { v4 as uuidv4 } from 'uuid';
import '../../data/ctxmenu.css';
import { toast } from "react-toastify";
import KvpBuilder from "../../guiData/guiBlocks/kvpBuilder";

const findEvts = (blks) => {

    let allHookAps = [];

    const hksOfBlock = (blk, legacies = "") => {
        if (blk.childNodesPossible) {
            Object.getOwnPropertyNames(blk.childNodesPossible).forEach(name => {
                hksOfBlock(legacies + "," + blk.childNodesPossible[name].uuid, blk.childNodesPossible[name]);
            });
        }
        allHookAps.push(legacies + "," + blk.childNodesPossible.uuid);//TODO:enforce uuid!!! create a seperate type!!!
    }

    return allHookAps;
}

function ProgEditPanel(props) {
    const importsNames: string[] = props.imports;
    const blockEvts = findEvts(props.blocks);//TODO:may not update, may be challenging to parse
    const [vars, setVars] = React.useState<{ [key: string]: string | number | boolean | object }>(props.program?.vars || {});
    const [sharedFunctions, setSharedFunctions] = React.useState<{ [key: string]: string }>(props.program?.shared || {});
    const [doWhen, setDoWhen] = React.useState<{ [key: string]: string }>(props.program?.doWhen || {});//index string format: cmptName:hooktype

    // const mcedit = React.useRef(null);
    // const rtclick = React.useRef(null);

    // const parentCallback = (e) => props.parentCallback(e);

    // React.useEffect(() => {
    //     mcedit.current!.addEventListener("contextmenu", function (event) {
    //         event.preventDefault();
    //         rtclick.current!.style.display = "block";
    //         rtclick.current!.style.left = (event.pageX - 10) + "px";
    //         rtclick.current!.style.top = (event.pageY - 10) + "px";
    //     }, false);
    //     mcedit.current!.addEventListener("click", function (event) {
    //         rtclick.current!.style.display = "";
    //         rtclick.current!.style.left = "";
    //         rtclick.current!.style.top = "";
    //     }, false);
    // }, [mcedit.current, rtclick.current]);

    // const updTxt = () => {
    //     try {
    //         const inst = mcedit.current!.value.replace("\n", "");
    //         if (inst.match(/,(?=\s*[\)\}\]])/)) return toast("you must remove all trailing commas!");
    //         let ifo = JSON.parse(inst);
    //         ifo = ifo.filter(i => i !== undefined);//TODO:validate more
    //         setifOrder(ifo);
    //         parentCallback(ifo);
    //     } catch (err) {
    //         console.log(err)
    //         toast(err);
    //     }
    // };

    // const insText = (txt) => {
    //     if (mcedit.current!.selectionStart || mcedit.current!.selectionStart == '0') {
    //         var startPos = mcedit.current!.selectionStart;
    //         var endPos = mcedit.current!.selectionEnd;
    //         mcedit.current!.value = mcedit.current!.value.substring(0, startPos)
    //             + txt
    //             + mcedit.current!.value.substring(endPos, mcedit.current!.value.length);
    //     } else {
    //         mcedit.current!.value += txt;
    //     }
    // };

    // const exitclk = function (e) {
    //     rtclick.current!.style.display = 'none';
    // }

    return (
        <div style={{ height: "100%" }}>
            {/* <div onClick={exitclk} style={{ height: "100%" }}>*/}
            <p>hint: right click to insert built-in functions</p><br />
            {/* <button className="smbutton" onClick={updTxt}>save</button><br /> */}
            {/* <h1>Imports-</h1> Imports will show up here(and in your right click menu):
            {importsNames.map(n => (
                <p>{n}</p>
            ))} */}
            <h1>Variables-</h1> Define variables here(accessible in all functions):
            <KvpBuilder objProps={{
                value: vars,
                childNodesCurrent: Object.getOwnPropertyNames(vars).map(x => "tvl"),
                childNodesPossible: {
                    "tvl": {
                        id: "listbuild",
                        defaults: {
                            value: [],
                            childNodesCurrent: ["type", "value"],
                            childNodesPossible: {
                                "type": {
                                    id: "onechoice",
                                    defaults: {
                                        value: "text",
                                        labels: ["text", "number", "yesNo"],
                                    },
                                },
                                "value": {
                                    id: "textbox",
                                    defaults: {
                                        value: "",
                                    },
                                }
                            },
                        },
                        validate: {
                            maxListLength: 2,
                            minListLength: 2,
                        },
                    }
                },
                hooks: {
                    "change": {}
                    //TODO:hook
                }
            }} />

            <h1>Shared Functions-</h1> Define shared functions here(shown in the right click menu):
            <KvpBuilder objProps={{
                value: vars,
                childNodesCurrent: Object.getOwnPropertyNames(vars).map(x => "value"),
                childNodesPossible: {
                    "value": {
                        id: "textbox",
                        defaults: {
                            value: "",
                            multirow: true
                        },
                    }
                },
                hooks: {
                    "change": {}
                    //TODO:hook
                }
            }} />

            <h1>Do-When-</h1> Functions that run when an action has been performed:
            [kvpbuild of double dropdown(first is block, second is event type) to long test]
            <KvpBuilder objProps={{
                value: vars,
                childNodesCurrent: Object.getOwnPropertyNames(vars).map(x => "tvl"),
                childNodesPossible: {
                    "tvl": {
                        id: "listbuild",
                        defaults: {//TODO: add stuff to set name, additional
                            visible: true,
                            disabled: false,
                            size: "1em",
                            width: "20em",
                            value: ["", ""],
                            childNodesCurrent: ["blockAttach", "value"],
                            childNodesPossible: {
                                "blockAttach": {
                                    id: "onechoice",
                                    defaults: {
                                        visible: true,
                                        disabled: false,
                                        value: "apple",
                                        size: "1em",
                                        labels: blockEvts,//TODO: assign
                                        required: false,
                                    },
                                },
                                "value": {
                                    id: "textbox",
                                    defaults: {
                                        value: "",
                                        multirow: true
                                    },
                                }
                            },
                        },
                        validate: {
                            maxListLength: 2,
                            minListLength: 2,
                        },
                    }
                },
                hooks: {
                    "change": {}
                    //TODO:hook
                }
            }} />

            {/* <menu id="ctxMenu" ref={rtclick}>
                {Object.getOwnPropertyNames(insOptions).map((o, y) => (
                    <menu key={o + y} title={o}>
                        {Object.getOwnPropertyNames(insOptions[o]).map((e, i) => (
                            <menu key={o + e + i} style={{ color: "blue" }} onClick={() => insText((() => {
                                const stxt = insOptions[o][e];//original string to insert
                                //inject uuid
                                return stxt.slice(0, 1) + `"uuid": ${uuidv4()},` + stxt.slice(1);
                            })())} title={e}></menu>
                        ))}
                    </menu>
                ))}
            </menu> */}

        </div>
    );
}

export default ProgEditPanel;