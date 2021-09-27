import React from "react";
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { exportCollection, hookCollection, IFaceBlock, utility } from "./data/interfaces";
import { wasmLoader } from "./data/wasmLoader";
import GuiRender from "./subcomponents/guiRender";
import allutils from "./data/allutils";

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

const loadMetaData = (id) => {
    if (id) {
        const ut = allutils.filter(ut => ut.id === id);
        if (ut.length === 0) toast("Invalid utility ID!")
        return ut[0];
    } else toast("You must provide an id of a utility to load!")
};

const SvcPage = (props) => {
    const { match, location, history } = props;
    const utilID = match.params.uuid;
    const currentComponent = loadMetaData(utilID);
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[] | []>(currentComponent.scheme);
    const [exports, setExports] = React.useState<hookCollection>();

    const formAccess = (action: "get" | "set" | "insert" | "delete", key: string, kvpset) => {
        if (action === "delete" && key) {
            setCurrentInterface(currentInterface.filter((e: IFaceBlock) => e.uuid !== key));
            return currentInterface;
        }
        if (action === "insert") {
            let concat;
            if (key !== "") {
                concat = compList.find((e: IFaceBlock) => e.id === key);
            }
            else if (kvpset) {
                concat = kvpset;
            }
            else {
                return currentInterface;
            }
            if (!concat.uuid) concat.uuid = Math.random().toString(36).substr(2);
            if (!currentInterface.find((e: IFaceBlock) => e.uuid && e.uuid === concat.uuid)) {
                const ncurr: IFaceBlock[] = currentInterface;
                ncurr.push(concat);//TODO:add location index insert l8r
                setCurrentInterface(ncurr);
                return currentInterface;
            }
        }
        if (action === "get" && (!key || key !== "")) return currentInterface;
        let findIndex = 0;
        let el = currentInterface.filter((e: IFaceBlock, i) => {
            if (e.uuid === key) {
                findIndex = i;
                return true;
            } else return false;
        });
        if (action === "get") return el;
        if (action === "set" && kvpset) {
            Object.getOwnPropertyNames(kvpset).forEach(e => el[e].defaults = kvpset[e]);
            currentInterface[findIndex] = kvpset;
            setCurrentInterface(currentInterface);
        }
    };

    const loadAll = async () => {
        if (currentComponent) {
            try {
                wasmLoader(currentComponent.id, currentComponent.binariesUsed).then(cmpt => setExports(cmpt));
            } catch (e) {
                toast(e);
            }
        }
    }

    return (
        <div id="helper">
            <Helmet>
                <title itemProp="name" lang="en">{currentComponent.name}</title>
                <meta name="keywords"
                    content={currentComponent.tags.join(" ")} />
                <meta name="description"
                    content={currentComponent.description} />
            </Helmet>
            <div id="serviceContainer">
                {(currentInterface && exports) ? <GuiRender schema={currentInterface} controllerFunctions={(evtname, e, additional) => {
                    console.log(evtname);
                    if (exports[evtname] !== undefined) exports[evtname](e, formAccess, additional)//TODO: export is a clear security vuln for exfil, you should filter event for read only
                }} /> : <button onClick={() => loadAll()}>▶️ load and start program</button>}
            </div>
        </div>
    );
};

export default SvcPage;