import React from "react";
import './data/styles.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MonacoEditor from 'react-monaco-editor';
import TabsContainer from "./subcomponents/organizers/tabs/tabview";
import { IFaceBlock, interfaceDescription } from "./data/interfaces";
import JSZip from "jszip";
import extToLang from "./data/extToLang";
import GuiRender from "./subcomponents/guiRender";
import Tab from "./subcomponents/organizers/tabs/tab";
import licenses from "./data/licenses";

// markup
const CodeEdit = (props) => {
    const { match, location, history } = props;
    const utilID = match.params.uuid;
    //stores all GUI details of the utility being worked on
    const [initVals, setInitVals] = React.useState<interfaceDescription>({
        title: "",
        tags: "",
        description: "",
        license: "",
        libraries: [],
        permissions: []
    });
    //uploads and publishes the current service
    const svcPub = async () => {
        //TODO:convert to GQL
        // return defaultConnect
        //     .post("/create", {
        //         iface,
        //         langType,//TODO:add support
        //         userUUID: JSON.parse(localStorage.getItem("tk")).uuid
        //     })
        //     .then(async (itm) => {
        //         //upload the binary
        //         await defaultConnect
        //             .put(itm.data.upls[0], bin);
        //         //zip+upload the code
        //         var srcArch = new JSZip();
        //         scripts.forEach((s, i) => {
        //             srcArch.file(scnames[i], s);
        //         });
        //         await srcArch.generateAsync({ type: "blob" })
        //             .then((content) =>
        //                 defaultConnect
        //                     .put(itm.data.upls[1], new File([content], "src.zip", { type: "application/zip" })));

        //         //upload the gui scheme    
        //         const sch = { type: 'text/json' };
        //         const Jblob = new Blob([JSON.stringify(iface)], sch);
        //         var Jfile = new File([Jblob], "scheme.json", sch);
        //         await defaultConnect
        //             .put(itm.data.upls[1], Jfile);
        //         history.push('/?svc=' + itm.data.message.uuid);
        //     })
        //     .catch((e) => toast(e));
    };

    //initialize the editor
    React.useEffect(() => {
        // TODO:convert to GQL
        fetch(utilID)
            .then(async (itm) => {
                if (itm.ok) {
                    itm.json().then(itjson => {
                        const { title, tags, description, license, libraries, permissions } = itjson;
                        setInitVals({
                            title,
                            tags,
                            description,
                            license,
                            libraries,
                            permissions
                        });
                    });
                } else throw new Error("could not get utility!");
            })
            .catch((e) => handleErr(e));
    }, []);

    const handleErr = (e) => toast(e);

    const propform: IFaceBlock[] = [
        { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Title:" }, "uuid": "fd117200-5bd0-4f4f-aae6-5c475f050fb7" },
        { "id": "textbox", "defaults": { "visible": true, "disabled": false, "size": "1em", "multirow": false, "value": initVals.title }, hooks: { "change": "title" }, "uuid": "5dab4339-5b5f-4d98-8c65-8daa8cd37391" },
        { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Tags:" }, "uuid": "11dd756a-4453-43e6-aff4-c4dccf0be38d" },
        { "id": "listbuild", "defaults": { "visible": true, "disabled": false, "size": "1em", "width": "20em", "values": initVals.tags }, hooks: { "change": "tags" }, "uuid": "8ddf0ef0-c88a-4af0-a51e-eacf1c05c06e" },
        { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Description:" }, "uuid": "75fb57df-7379-4d32-a5a3-d030db8d88ef" },
        { "id": "textbox", "defaults": { "visible": true, "disabled": false, "size": "1em", "multirow": true, "value": initVals.description }, hooks: { "change": "description" }, "uuid": "a77429da-9fec-4457-9e3f-725a84b081d4" },
        { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "License" }, "uuid": "81740e0e-3876-4154-8237-ebae073b37fb" },
        { "id": "onechoice", "defaults": { "visible": true, "disabled": false, "size": "1em", "labels": licenses.join(","), "value": initVals.license }, hooks: { "change": "license" }, "uuid": "bacb493f-7e74-4883-9a71-862d312e8ddc" }
    ];

    const [uploadform, chgUploadForm] = React.useState<IFaceBlock[]>([
        { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Upload as version:" } },
        { "id": "numbox", defaults: { visible: true, disabled: true, size: "1em", value: 0, min: 0 }, hooks: { "change": "vnumber" }, },
        { "id": "label", "defaults": { "visible": true, "size": "1em", "label": "Attach binary:" } },
        { "id": "uplButton", defaults: { visible: true, disabled: false, size: "1em" } },
        { "id": "button", defaults: { visible: true, disabled: true, size: "1em", label: "Upload" }, hooks: { "click": "upload" }, },
        { "id": "progbar", defaults: { visible: true, value: 0, max: 100 } }
    ]);

    return (
        <>
            <div id="serviceContainer">
                <h1>Preview</h1>

                <div>
                    <TabsContainer>
                        <Tab label="Settings and Libraries">
                            <GuiRender schema={propform} controllerFunctions={(evtname, e) => {
                                initVals[evtname] = e.target.value
                                setInitVals(initVals);
                            }} />
                            {/* TODO: add seperate library search and add tool here */}
                        </Tab>
                        <Tab label="Upload the binary">
                            <GuiRender schema={uploadform} controllerFunctions={(evtname, e) => {
                                if (evtname === "vnumber") {
                                    uploadform[1].defaults.value = e.target.value;
                                }
                                if (evtname === "upload" && uploadform[1].defaults.value === 0) return handleErr("cannot have a version number of zero!");
                                else if (evtname === "upload") {
                                    
                                }

                                // initVals[evtname] = e.target.value
                                // setInitVals(initVals);
                                //TODO: get value of both the version box and binary, set binary name to version number, upload to server, show progress on progbar
                            }} />
                        </Tab>
                    </TabsContainer>
                </div>
                <button onClick={() => svcPub()}>Publish</button>
            </div>
        </>
    );
};//TODO:make GUI editor drag n drop like asp form designer
//https://react-jsonschema-form.readthedocs.io/en/latest/usage/widgets/

export default CodeEdit;
