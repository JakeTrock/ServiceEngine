import React from "react";
import { toast } from 'react-toastify';
import '../../data/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { hookCollection, IFaceBlock, utility } from "../../data/interfaces";
import GuiRender from "./guiRender";


const prefixCB = "./programs/codeBlocks/";
const prefixGB = "./programs/glueBlocks/";

async function asyncBuild(array, callback) {
    let r = {};
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, r);
    }
    return r;
}

const GuiRunner = (props) => {
    const currentComponent: utility = props.component;//current component data
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
            const coreGlue = await import(`${prefixGB}${currentComponent.file}`);

            const liblist = currentComponent.binariesUsed.map(o => import(`${prefixCB}${o}`));
            return Promise.all(liblist)
                .then(l => l.map(v => () => v.default()))
                .then(l => Promise.all(l))
                .then(l => asyncBuild(l, async (v, i, r) => {
                    r[currentComponent.binariesUsed[i]] = await v();
                })).then(libpreload => coreGlue.default({
                    libraries: libpreload
                }));
        } catch (e) {
            toast.error(e.toString());
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

export default GuiRunner;