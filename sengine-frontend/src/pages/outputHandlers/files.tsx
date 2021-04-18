import * as React from "react";
import jszip from 'jszip';
import { Holder, ResultsHolder, Suggestion } from "../../data/styles";

// markup
const FilesOutput = () => {
    const [files, setFiles] = React.useState<File[]>();

    const update = (mem) => {
        //TODO:pull files from mem.buffer
    };
    return (
        <Holder>
            {files.length > 1 && <Suggestion onClick={
                async () => {
                    let zip = new jszip();
                    await files.map(async (f) => zip.file(f.name, f.arrayBuffer()));
                    const file = await zip.generateAsync({ type: "base64" });
                    const linkSource = `data:application/zip;base64,${file}`;
                    const downloadLink = document.createElement("a");
                    downloadLink.href = linkSource;
                    downloadLink.download = `sengine-${+new Date}.zip`;
                    downloadLink.click();
                }
            }>
                [Download all as zip]
            </Suggestion>}
            <ResultsHolder>
                {files.map((result, index) => {
                    const url = (window.URL || window.webkitURL).createObjectURL(result);
                    return (
                        <Suggestion key={index} download={result.name} href={url}>
                            {result.name}
                        </Suggestion>
                    );
                })}
            </ResultsHolder>
        </Holder>
    );
};

export default FilesOutput;
