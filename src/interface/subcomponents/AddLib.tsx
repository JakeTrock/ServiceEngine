import React from "react";
import { toast } from "react-toastify";
import { interfaceDescription, libInfo } from "../data/interfaces";


function AddLib(props) {
    const utSchema: interfaceDescription = props.schema;
    const utLibs: libInfo[] = utSchema.libraries;
    const utPerms: string[] = utSchema.permissions;

    const [displayedLibs, setDisplayedLibs] = React.useState<libInfo[]>(utSchema.libraries);

    const setPerms = (nuperms: string[]) => {
        let tmp = utSchema;
        tmp.permissions = nuperms;
        props.setSchema(tmp);
    };

    const setLibs = (nulibs: libInfo[]) => {
        let tmp = utSchema;
        tmp.libraries = nulibs;
        props.setSchema(tmp);
    };

    const findFunctions = (e) => {
        if (e.target.value === "") setDisplayedLibs(utSchema.libraries);
        else return fetch(`https://sengine.cc/searchLib/${e.target.value}`)
            .then(lbs => { if (lbs.ok) return lbs.json(); })
            .then(libs => setDisplayedLibs(libs))
            .catch(e => toast(e))
    };

    return (
        <div style={{ border: "1px solid black" }}>
            <input type="text" onChange={findFunctions}></input>
            <div style={{ overflow: "scroll", height: "20%", resize: "vertical" }}>
                {displayedLibs.map((item: libInfo) => (
                    <>
                        <div style={{ border: "1px solid black" }}>
                            <h3>{item.libname}</h3>
                            <select>
                                {Array.isArray(item.libVersion) && item.libVersion.map((lbl, i) => (
                                    <option key={i} value={lbl}>{lbl}</option>
                                ))}
                            </select>
                            <button onClick={() => {
                                //@ts-ignore
                                item.libVersion = e.currentTarget.parentNode.childNodes.item(1).value;
                                if (utLibs.indexOf(item) > -1) {
                                    setLibs(utLibs.concat([item]))
                                    const mySet = Array.from(new Set(utPerms.concat(item.permissionsNeeded)));
                                    setPerms(mySet);
                                } else {
                                    setLibs(utLibs.filter(i => i.libprefix !== item.libprefix && i.libVersion !== item.libVersion))
                                    const pn = Array.from(new Set(utLibs.map(l => l.permissionsNeeded).reduce((acc, cv) => acc.concat(cv))));
                                    setPerms(pn);
                                }
                            }}>{utLibs.indexOf(item) > -1 ? "+" : "-"}</button><br />
                            <p>functions included: {item.functionsUsed.join(",")}</p><br />
                            <p>permissions needed: {item.permissionsNeeded.join(",")}</p><br />
                        </div>
                        <br />
                    </>
                ))}
            </div>
        </div>
    );
}

export default AddLib;