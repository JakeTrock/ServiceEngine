import React from "react";
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { hookCollection, IFaceBlock } from "./data/interfaces";
import GuiRender from "./subcomponents/guiRender";
import allutils from "./data/allutils";

//load metadata from fake database to build component, replace later with db call
const loadMetaData = (id) => {
    if (id) {
        const ut = allutils.filter(ut => ut.id === id);
        if (ut.length === 0) toast("Invalid utility ID!")
        return ut[0];
    } else toast("You must provide an id of a utility to load!")
};

const prefixCB = "./subcomponents/codeBlocks/";
const prefixGB = "./subcomponents/glueBlocks/";

async function asyncBuild(array, callback) {
    let r = {};
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, r);
    }
    return r;
}

const SvcPage = (props) => {
    const { match, location, history } = props;
    const utilID = match.params.uuid;
    const currentComponent = loadMetaData(utilID);//current component data
    const [exports, setExports] = React.useState<hookCollection>();//all references to functions in a dictionary so the gui can attach
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[] | []>(currentComponent.scheme);//current gui scheme

    //loads all code when run button is pressed, 
    const loadAll = async (): Promise<hookCollection> => {
        try {
            if (typeof SharedArrayBuffer === 'undefined') {
                const dummyMemory = new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true });
                //@ts-ignore
                globalThis.SharedArrayBuffer = dummyMemory.buffer.constructor
            }
            const x = await import(`${prefixGB}${currentComponent.id}`);

            const liblist = currentComponent.binariesUsed.map(o => import(`${prefixCB}${o}`));
            return Promise.all(liblist)
                .then(l => l.map(v => () => v.default()))
                .then(l => Promise.all(l))
                .then(l => asyncBuild(l, async (v, i, r) => {
                    r[currentComponent.binariesUsed[i]] = await v();
                })).then(libpreload => x.default({
                    libraries: libpreload
                }));
        } catch (e) {
            toast(e);
        }
    }

    //run loadall, pipe all hooks into the hook state so the form can attach
    const saveHooks = () => loadAll().then(cmpt => setExports(cmpt));

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
                {(currentComponent.scheme && exports) ? <GuiRender scheme={currentInterface} setScheme={setCurrentInterface} exports={exports} /> :
                    <button onClick={() => saveHooks()}>▶️ load and start program</button>}
            </div>
        </div>
    );
};

export default SvcPage;