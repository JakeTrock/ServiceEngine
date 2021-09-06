import React from "react";
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { exportCollection, IFaceBlock, utility } from "./data/interfaces";
import { wasmLoader } from "./data/wasmLoader";
import GuiRender from "./subcomponents/guiRender";
import allutils from "./data/allutils";

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
    const currentInterface: IFaceBlock | [] = currentComponent.scheme;
    const [exports, setExports] = React.useState<exportCollection>();

    //handle form error
    const handleErr = (e) => toast(e);


    const loadAll = async () => {
        if (currentComponent) {
            try {
                // wasmLoader(currentComponent.binariesUsed).then(cmpt => setExports(cmpt))
            } catch (e) {
                handleErr(e);
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
                {(currentInterface && exports) ? <GuiRender schema={currentInterface} controllerFunctions={(evtname, e) =>
                    exports[evtname].function(e)//TODO: this is a clear security vuln for exfil
                } /> : <button onClick={() => loadAll()}>▶️ load and start program</button>}
            </div>
        </div>
    );
};

export default SvcPage;