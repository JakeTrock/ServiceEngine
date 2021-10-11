import React from "react";
import { lazy } from "react";
import { toast } from 'react-toastify';
import './data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { useImported } from "react-imported-component";
import { exportCollection, hookCollection, IFaceBlock, utility } from "./data/interfaces";
// import { wasmLoader } from "./data/wasmLoader";
import GuiRender from "./subcomponents/guiRender";
import allutils from "./data/allutils";

import ffmpeg from "./subcomponents/codeBlocks/ffmpeg";
// import glue from "./subcomponents/glueBlocks/001"

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
    const currentComponent = loadMetaData(utilID);

    const [exports, setExports] = React.useState<hookCollection>();
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[] | []>(currentComponent.scheme);

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
            // const libpreload = currentComponent.binariesUsed.reduce(async (r, o, i) => {
            //     //combine libs
            //     const v = await import(`${prefixCB}${o}`);
            //     console.log(v)
            //     const n = v.default();
            //     r[currentComponent.binariesUsed[i]] = n;
            //     return r;
            // }, {});

        } catch (e) {
            toast(e);
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
                {(currentComponent.scheme && exports) ? <GuiRender scheme={currentInterface} setScheme={setCurrentInterface} exports={exports} /> :
                    <button onClick={() => loadAll().then(cmpt => setExports(cmpt))}>▶️ load and start program</button>}
            </div>
        </div>
    );
};

export default SvcPage;