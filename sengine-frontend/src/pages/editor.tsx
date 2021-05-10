import * as React from "react";
import axios from "axios";
import { sha512 } from 'hash-wasm';
import {
    Holder,
    ServiceContainer,
    FormButton,
    Header,
    InputNorm,
} from "../data/styles";
import Form from "@rjsf/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MonacoEditor from 'react-monaco-editor';
import TabsContainer from "./outputHandlers/tabs/tabview";
import { form } from "../data/interfaces";
import TabbedEditor from "./outputHandlers/tabs/multitabeditor";
import JSZip from "jszip";
import extToLang from "../data/extToLang";
// consts
const defaultConnect = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-type": "application/json",
    },
});
//monacco options
const options = {
    selectOnLineNumbers: true
};
// markup
const AuthPage = ({ match, location, history }) => {
    const [langType, setLangType] = React.useState<"typescript" | "csharp" | "rust" | "cpp">("rust");
    const [bin, setBin] = React.useState<File>(undefined);//TODO:add compilation
    const [scripts, setScripts] = React.useState<string[]>([""]);
    const [scnames, setScnames] = React.useState<string[]>(["main.rs"]);
    //stores all GUI details of the utility being worked on
    const [iface, setInterface] = React.useState<form>({
        input: {
            title: "Todo",
            type: "object",
            required: ["title"],
            properties: {
                email: { type: "string", title: "Title", default: "email" },
                done: { type: "boolean", title: "Done?", default: false }
            }
        },
        uiSchema: {
            "email": {
                "inputType": "email"
            }
        },
        currentFormData: {
            title: "faketitle",
            done: false
        },
        output: "textarea"
    });
    //uploads and publishes the current service
    const svcPub = async () => {
        const binHash = await bin.arrayBuffer().then(ab => sha512(new Uint8Array(ab)));
        return defaultConnect
            .post("/create", {
                iface,
                langType,//TODO:add support
                binHash,
                userUUID: JSON.parse(localStorage.getItem("tk")).uuid
            })
            .then(async (itm) => {
                //upload the binary
                await defaultConnect
                    .put(itm.data.upls[0], bin);
                //zip+upload the code
                var srcArch = new JSZip();
                scripts.forEach((s, i) => {
                    srcArch.file(scnames[i], s);
                });
                await srcArch.generateAsync({ type: "blob" })
                    .then((content) =>
                        defaultConnect
                            .put(itm.data.upls[1], new File([content], "src.zip", { type: "application/zip" })));

                //upload the gui scheme    
                const sch = { type: 'text/json' };
                const Jblob = new Blob([JSON.stringify(iface)], sch);
                var Jfile = new File([Jblob], "scheme.json", sch);
                await defaultConnect
                    .put(itm.data.upls[1], Jfile);
                history.push('/?svc=' + itm.data.message.uuid);
            })
            .catch((e) => toast(e));
    };

    //initialize the editor
    const initEd = async (uuid) => {
        return defaultConnect
            .post("/getsvc?" + uuid)
            .then(async (itm) => {
                const { jsonLoc, srcLoc, binLoc, langType } = JSON.parse(itm.data);
                const form = await axios.get(jsonLoc).then(d => { return d.data });
                const code = await axios.get(srcLoc).then(d => { return d.data });
                // const bin = await fetch(binLoc);//TODO: how to get the file and set it?

                //unzip sources and put them in array
                let fnames = [];
                let fcontents = [];

                JSZip.loadAsync(code).then((zip) => {
                    Object.keys(zip.files).forEach((filename) => {
                        fnames.push(filename);
                        zip.files[filename].async('string')
                            .then((fdata) => fcontents.push(fdata))
                    })
                });
                setScnames(fnames);
                setScripts(fcontents);


                setInterface(form);
                // setBin(bin);
                setLangType(langType);
            })
            .catch((e) => toast(e));
    };

    //runs when the source is changed
    const compileSrc = (newValue, e) => {
        //TODO:live-compile here
    }

    //runs when interface code is changed
    const setIFace = (newValue, e) => {
        setInterface(newValue);
    }

    //TODO: editor needs design concepts/overhaul
    React.useEffect(() => {
        if (match && match.params) initEd(match.params.uuid);
    }, []);

    const handleErr = (e) => toast(e);

    return (
        <Holder>
            <ToastContainer />
            <FormButton href="/">« dashboard
                <img
                    alt="ServiceEngine Logo"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMiIKICAgd2lkdGg9IjY0IgogICBoZWlnaHQ9IjY0IgogICB2aWV3Qm94PSIwIDAgNjQgNjQiCiAgIHNvZGlwb2RpOmRvY25hbWU9InNlTG9nby5wbmcuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjAuMSAoM2JjMmU4MTNmNSwgMjAyMC0wOS0wNykiPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTgiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM2IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI1IgogICAgIGlkPSJuYW1lZHZpZXc0IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIzNy40MzI0NjUiCiAgICAgaW5rc2NhcGU6Y3g9IjM0LjYxNjAwOCIKICAgICBpbmtzY2FwZTpjeT0iMzMuMzg1MzkiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJnNDgiCiAgICAgaW5rc2NhcGU6c25hcC1pbnRlcnNlY3Rpb24tcGF0aHM9InRydWUiCiAgICAgaW5rc2NhcGU6b2JqZWN0LXBhdGhzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbWlkcG9pbnRzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtc21vb3RoLW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOnNuYXAtbm9kZXM9InRydWUiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtcm90YXRpb249IjAiCiAgICAgaW5rc2NhcGU6c25hcC1iYm94PSJmYWxzZSIKICAgICBpbmtzY2FwZTpiYm94LW5vZGVzPSJ0cnVlIgogICAgIGlua3NjYXBlOmJib3gtcGF0aHM9InRydWUiIC8+CiAgPGcKICAgICBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIgogICAgIGlua3NjYXBlOmxhYmVsPSJJbWFnZSIKICAgICBpZD0iZzEwIj4KICAgIDxnCiAgICAgICBpZD0iZzUwMTEiCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NS4wODU3OTYsMjcuMjIzOTcpIj4KICAgICAgPGcKICAgICAgICAgaWQ9Imc1MDM5Ij4KICAgICAgICA8ZwogICAgICAgICAgIGlkPSJnNDgiCiAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC45NTY4MjE2MywwLDAsMC45ODYyNDU5NCwtMy40MTMwNTM2LC0wLjQyMjcwODI0KSI+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc1MDIwIgogICAgICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMCwxLDEsMCwtODEuNDU2NTI0LC0zNC4zNzIyNzEpIj4KICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6I2YzYmIxMTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgZD0ibSA5LjkwNDUxNjUsNDkuMTE4NDEzIDAuMDg2NDcsLTYuNDI5NjAzIDkuMjQ2ODYwNSw5LjMwMDU0OCB2IDYuNjY2NjY3IHogTSA0NS45MDQ1MTcsMTMuNzI2MzUgViA3LjA1OTY4MjUgbCA5LjMzMzMzLDkuMjE0OTgwNSAtMy4xNzE2MDgsMy4yNzYzMDggeiIKICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzk4IgogICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDxnCiAgICAgICAgICAgICAgIGlkPSJnNTAxNCI+CiAgICAgICAgICAgICAgPHBhdGgKICAgICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojMWExYjVmO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICAgIGQ9Im0gMTkuMjM3ODQ3LDU1LjMyMjY5MSB2IC0zLjMzMzMzMyBsIDMuMzMzMzQsLTMuMTMxNTA0IDMuMzMzMzMsLTMuMTMxNTA0IHYgMy4zMzMzMzMgMy4zMzMzMzQgbCAtMy4zMzMzMywzLjEzMTUwNCAtMy4zMzMzNCwzLjEzMTUwNCB6IG0gLTkuMjQ2ODYwNSwtMTIuNjMzODg0IDcuOTU2NzcwNSwtNy44NzM3NCA3Ljk1Njc2LC03Ljg3Mzc0IHYgMy4zNDE3MTcgMy4zNDE3MTkgTCAxOS40NTcwMDcsMzkuOTc1MzI0IDEzLjIxMzUsNDUuODk3ODEgWiBNIDM5LjIzNzg0NywzNS40NDEwNDUgdiAtMy4zMzMzMzQgbCA4LC03LjkxNjUyNCA4LC03LjkxNjUyNCB2IDMuMzMzMzM0IDMuMzMzMzMzIGwgLTgsNy45MTY1MjQgLTgsNy45MTY1MjQgeiBtIDAsLTE4Ljc4NTAyIHYgLTMuMzMzMzM0IGwgMy4zMzMzNCwtMy4xMzE1MDUgMy4zMzMzMywtMy4xMzE1MDM1IHYgMy4zMzMzMzQ1IDMuMzMzMzMzIGwgLTMuMzMzMzMsMy4xMzE1MDQgLTMuMzMzMzQsMy4xMzE1MDQgeiIKICAgICAgICAgICAgICAgICBpZD0icGF0aDQ3ODgiCiAgICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjYyIgLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgICBzdHlsZT0iZmlsbDojY2NjY2NjO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgICBkPSJtIDI1LjkwNDUxNywyNi45NDEzMyAxMy4zMzMzMyw1LjE2NjM4MSB2IDYuNjY2NjY3IGwgLTEzLjMzMzMzLC01LjE0OTYxMiB6IgogICAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtOSIKICAgICAgICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjYyIgLz4KICAgICAgICAgIDwvZz4KICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICBzdHlsZT0iZmlsbDojN2RiNzVkO3N0cm9rZS13aWR0aDoxLjMzMzMzIgogICAgICAgICAgICAgZD0ibSAtNTAuODU3Nzg3LDM1LjE5MTI0MSAtOS4zNzAxMzEsLTkuMzMwNDYgNi41NjI2NzMsLTAuMDAyIDUuODg4OTE3LDYuMjY0NjE3IHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQiCiAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjIiAvPgogICAgICAgICAgPHBhdGgKICAgICAgICAgICAgIHN0eWxlPSJmaWxsOiNjY2NjY2M7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjEuMzMzMzMiCiAgICAgICAgICAgICBkPSJtIC0zOC4xMzkxMjQsMTAuNTIwNjcyIDIuMDA3ODk1LC0xLjg1NjQ2NjcgNi4xNjE3MzksNi42NjQxOTQ3IC0yLjAzNzEwNSwxLjg1NDE2NSB6IgogICAgICAgICAgICAgaWQ9InBhdGg0Nzk0LTktNiIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8cGF0aAogICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzdkYjc1ZDtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgIGQ9Im0gLTguMjUxNzg1NCwtMC43ODgyMDY3IC05Ljc1MTI3NzYsLTkuMzIyODY1MyAtNi4wMzc5MiwtMC4wMTA3MyA5LjU3MzY4NSw5LjI1ODc0NDAxIHoiCiAgICAgICAgICAgICBpZD0icGF0aDQ3OTQtMSIKICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2MiIC8+CiAgICAgICAgICA8ZwogICAgICAgICAgICAgaWQ9Imc0OTk4IgogICAgICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoLTkzLjIyMTc1OSwtMzYuMjg1ODkxLDE3LjczNzUyMikiPgogICAgICAgICAgICA8ZwogICAgICAgICAgICAgICBpZD0iZzUwMDIiPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC01MC40MzY4MjEsMTIuMDA0NDg4IC0yLjgxNTg5LC0zLjM3MjYwODggMC4xNzk4MTgsLTMuMjEyMDY4IDAuMTc5ODIsLTMuMjEyMDY1NCAzLjI1MjE3NSwzLjYzNzkwMDQgMy4yNTIxODMsMy42Mzc5MDEgLTAuNjE2MTEyLDIuOTQ2Nzc1OCAtMC42MTYxMDMsMi45NDY3NzMgeiBtIDE0LjIzOTg4NywtMy44OTM0NzM4IC03LjIyMDYzNywtOC4xODE3OTcyOCAwLjE4MzQwOSwtMy4yNzYyMDgzMiAwLjE4MzQxMSwtMy4yNzYyMDU0IDcuNjUyNTYzLDguNTYwMTg2NiA3LjY1MjU2Myw4LjU2MDE4OTIgLTAuNjE1MzM0LDIuODk3ODE2IC0wLjYxNTMzNiwyLjg5NzgxNiB6IgogICAgICAgICAgICAgICAgIGlkPSJwYXRoNDc4OC0wIgogICAgICAgICAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2NjY2NjY2NjIiAvPgogICAgICAgICAgICAgIDxwYXRoCiAgICAgICAgICAgICAgICAgc3R5bGU9ImZpbGw6IzFhMWI1ZjtzdHJva2Utd2lkdGg6MS4zMzMzMyIKICAgICAgICAgICAgICAgICBkPSJtIC0yNS41MDI3MDMsNDAuMjE3OTM4IDYuMTM3NzI1LDYuNTUwNTQgMC40MjQwNDksLTYuMjAxNDgyIC0wLjM1MjA3LC0wLjQxNDU1NiAtMy4yMjk4OCwtMy42NTc3MTggLTIuOTk4ODA2LDAuMjY1MDM2IC0yLjk5ODgwNCwwLjI2NTAyNyB6IG0gNS41NDIyNiwtMTMuNjgyNzI0IDcuMzU3OTMyLDguMTc1NDEzIDMuNDQzNzM2NSwtMy4xODE4MzggLTQuNTc2NTQ3NSwtNS4wNjAxNjYgLTcuNjAwMDk2LC04LjYwNjgwNCAtMi45NTAwOTQsMC4yNzAwMjQgLTIuOTUwMDk0LDAuMjcwMDI1IHoiCiAgICAgICAgICAgICAgICAgaWQ9InBhdGg0Nzg4LTAtMCIKICAgICAgICAgICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjY2NjY2NjY2NjY2MiIC8+CiAgICAgICAgICAgIDwvZz4KICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo="
                />
            </FormButton>
            <ServiceContainer>
                <Header>Preview</Header>
                <Form schema={iface.input}
                    uiSchema={iface.uiSchema}
                    onError={handleErr} />
                <Holder>
                    <TabsContainer>
                        <div label="Settings and Security">
                            <select onChange={(e) => {
                                //@ts-ignore
                                setLangType(e.target.value);
                            }}>
                                <option value="typescript">typescript</option>
                                <option value="csharp">c#</option>
                                <option value="rust">rust</option>
                                <option value="cpp">c++</option>
                            </select>
                        </div>
                        <div label="Code">
                            <TabbedEditor
                                mcopt={options}
                                applySrc={compileSrc}
                                scnames={scnames}
                                setScnames={setScnames}
                                sccontent={scripts}
                                setSccontent={setScripts} />
                        </div>
                        <div label="Interface">
                            <MonacoEditor
                                width="100%"
                                height="50em"
                                language="json"
                                theme="vs-light"
                                value={JSON.stringify(iface)}
                                options={options}
                                onChange={setIFace}
                            />
                        </div>
                    </TabsContainer>
                </Holder>
                <FormButton onClick={() => svcPub()}>Publish</FormButton>

            </ServiceContainer>
        </Holder>
    );
};//TODO:make GUI editor drag n drop like asp form designer
//https://react-jsonschema-form.readthedocs.io/en/latest/usage/widgets/

export default AuthPage;
