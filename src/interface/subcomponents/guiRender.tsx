import React, { Fragment } from "react";
import { IFaceBlock } from "../data/interfaces";
import compDict from "../data/compDict";
import FailComponent from "./guiBlocks/failComponent";

const compList: IFaceBlock[] = [
    { id: "label", defaults: { visible: true, size: "1em", label: "Explanatory text" } },
    { id: "button", defaults: { visible: true, disabled: true, size: "1em", label: "Button" } },
    { id: "uplButton", defaults: { visible: true, disabled: true, size: "1em" } },
    { id: "textbox", defaults: { visible: true, disabled: true, size: "1em", value: "default value", multirow: "false" } },
    { id: "numbox", defaults: { visible: true, disabled: true, size: "1em", value: 3, min: 0, max: 10 } },
    { id: "datebox", defaults: { visible: true, disabled: true, size: "1em", value: "1000-01-01T12:00", min: "0001-01-01T00:00", max: "2000-01-01T24:00" } },
    { id: "onechoice", defaults: { visible: true, disabled: true, size: "1em", labels: "apple,banana,melon,berry" } },
    { id: "multchoice", defaults: { visible: true, disabled: true, size: "1em", label: "topping", labels: "walnuts,peanuts,chocolate,gummy", checked: "false,true,false,true" } },
    { id: "listbuild", defaults: { visible: true, disabled: true, size: "1em", width: "20em", values: "strawberry,chocolate,vanilla,mint" } },
    { id: "mediabox", defaults: { visible: true, hasVideo: true, hasControls: true, width: "10em", height: "10em" } },
    { id: "canvasbox", defaults: { visible: true, width: "10em", height: "10em" } },
    { id: "slider", defaults: { visible: true, disabled: true, width: "10em", value: 1, min: 0, max: 10 } },
    { id: "progbar", defaults: { visible: true, value: 50, max: 100 } }
];

const processHooks = (schema, makeEvent) => {
    return schema.map(prp => {
        if (prp.hooks && prp.hooks !== {}) {
            Object.getOwnPropertyNames(prp.hooks).forEach((key) => {
                if (prp.hooks[key].name && prp.hooks[key].name !== "evfunction") {
                    prp.hooks[key] = makeEvent(prp.hooks[key]);
                }
            })
        }
        return prp;
    });
}

export default function GuiRender(props) {
    const currentInterface = props.scheme;
    const setCurrentInterface = props.setScheme;
    const mkevt = (evv) => {
        console.log(evv.name);
        const evfunction = (e) => props.exports[evv.name](e, formAccess, evv.additional || {});
        return evfunction;
    };

    const formAccess = (action: "get" | "set" | "add" | "del", key: string, kvpset) => {//TODO:make switch
        console.log(action)
        if (action && currentInterface.length) {
            if (action === "del" && key) {
                setCurrentInterface(ci => {
                    const cface = (ci || currentInterface);
                    const v = cface.filter((e: IFaceBlock) => e.uuid !== key);
                    return v;

                });
            }
            if (action === "add") {
                let concat;
                if (kvpset && kvpset !== {}) {
                    concat = kvpset;
                } else {
                    const cmpFind = compList.find((e: IFaceBlock) => e.id === key);
                    if (cmpFind)
                        concat = cmpFind;
                    else return;
                }

                if (!concat.uuid) concat.uuid = Math.random().toString(36).substr(2);
                setCurrentInterface((ci) => {
                    const nci = (ci || currentInterface);
                    if (!nci.find((e: IFaceBlock) => e.uuid && e.uuid === concat.uuid)) {
                        const ncurr: IFaceBlock[] = [...nci, concat];
                        return ncurr;
                    } else return nci;
                });//TODO:add location index insert l8r
            }
            if (action === "set" && key && kvpset) {
                if (kvpset.uuid && currentInterface.find((e: IFaceBlock) => e.uuid && e.uuid === kvpset.uuid)) return;
                setCurrentInterface((ci) => {//TODO:use lower version when state problem fixed, not mem efficient
                    const cface = (ci || currentInterface);
                    return cface.map((e: IFaceBlock) => {
                        if (e.uuid === key) {
                            Object.getOwnPropertyNames(kvpset).forEach(k => {
                                if (k === "defaults") {
                                    Object.getOwnPropertyNames(kvpset.defaults).forEach(dk => e["defaults"][dk] = kvpset.defaults[dk]);
                                } else if (k === "hooks") {
                                    Object.getOwnPropertyNames(kvpset.hooks).forEach(dk => e["hooks"][dk] = kvpset.hooks[dk]);
                                } else {
                                    e[k] = kvpset[k];
                                }
                            });
                            return e;
                        } else return e;
                    })
                });
            }
            // if (action === "set" && key && kvpset) {
            //     if (kvpset.uuid && currentInterface.find((e: IFaceBlock) => e.uuid && e.uuid === kvpset.uuid)) return;
            //     setCurrentInterface((ci) => {
            //         const cface = (ci || currentInterface);
            //         const itm = cface.findIndex((e: IFaceBlock) => e.uuid && e.uuid === key)
            //         if (itm > -1) {
            //             Object.getOwnPropertyNames(kvpset).forEach(k => {
            //                 if (k === "defaults") {
            //                     Object.getOwnPropertyNames(kvpset.defaults).forEach(dk => cface[itm]["defaults"][dk] = kvpset.defaults[dk]);
            //                 } else if (k === "hooks") {
            //                     Object.getOwnPropertyNames(kvpset.hooks).forEach(dk => cface[itm]["hooks"][dk] = kvpset.hooks[dk]);
            //                 } else {
            //                     cface[itm][k] = kvpset[k];
            //                 }
            //             });
            //         }
            //         return cface;
            //     });
            // }
        }
        if (action === "get") {
            if (!key || key === "") return currentInterface;
            else return currentInterface.find((e: IFaceBlock) => e.uuid === key);
        }
    };

    return (
        <div>
            {currentInterface && processHooks(currentInterface, mkevt).map((item, i) => (
                <Fragment key={props.key}>
                    {React.createElement(compDict[item.id] || FailComponent, { key: i, uuid: item.uuid, objProps: item.defaults, objHooks: item.hooks })}
                    <br />
                </Fragment>
            ))}
        </div>
    );
}