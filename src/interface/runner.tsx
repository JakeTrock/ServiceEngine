import React from "react";
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
import glue from "./subcomponents/glueBlocks/001"

const loadMetaData = (id) => {
    if (id) {
        const ut = allutils.filter(ut => ut.id === id);
        if (ut.length === 0) toast("Invalid utility ID!")
        return ut[0];
    } else toast("You must provide an id of a utility to load!")
};

const prefixCB = "../subcomponents/codeBlocks/";
const prefixGB = "../subcomponents/glueBlocks/";


const SvcPage = (props) => {
    const { match, location, history } = props;
    const utilID = match.params.uuid;
    const currentComponent = loadMetaData(utilID);
    const [exports, setExports] = React.useState<hookCollection>();
    const [currentInterface, setCurrentInterface] = React.useState<IFaceBlock[] | []>(currentComponent.scheme);

    // const { imported: glueLoaded, loading: glueLoading } = useImported(
    //     () => import(prefixGB + currentComponent.id)
    // );
    // const { imported: libsLoaded, loading: libsLoading } = useImported(
    //     () => Promise.all(currentComponent.binariesUsed.map(l => import(prefixCB + l)))
    // );
    // const { imported: libsLoaded, loading: libsLoading } = useImported(
    //     () => import(prefixCB + currentComponent.binariesUsed[0])
    // );
    const loadAll = async (): Promise<hookCollection> => {
        // if (!glueLoaded || !libsLoading) return Promise.reject(toast("Slow network, application still loading..."));

        // return glue({
        //     libraries: [ffmpeg].reduce(function (r, o, i) {
        //         //combine libs
        //         r[currentComponent.binariesUsed[i]] = o;
        //         return r;
        //     }, {}),
        // });
        try {
            if (typeof SharedArrayBuffer === 'undefined') {
                const dummyMemory = new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true });
                //@ts-ignore
                globalThis.SharedArrayBuffer = dummyMemory.buffer.constructor
            }
            const ff = await ffmpeg();
            return glue({ libraries: { ffmpeg: ff } });
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
                {(currentComponent.scheme && exports) ? <GuiRender scheme={currentInterface} setScheme={setCurrentInterface} exports={exports} /> : <button onClick={() => loadAll().then(cmpt => setExports(cmpt))}>▶️ load and start program</button>}
            </div>
        </div>
    );
};

export default SvcPage;