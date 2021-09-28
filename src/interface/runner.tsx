import React from "react";
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { exportCollection, hookCollection, IFaceBlock, utility } from "./data/interfaces";
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
    const [exports, setExports] = React.useState<hookCollection>();
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[] | []>(currentComponent.scheme);

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
                {(currentComponent.scheme && exports) ? <GuiRender scheme={currentInterface} setScheme={setCurrentInterface} exports={exports} /> : <button onClick={() => loadAll()}>▶️ load and start program</button>}
            </div>
        </div>
    );
};

export default SvcPage;