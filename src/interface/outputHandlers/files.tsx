import * as React from "react";
import jszip from 'jszip';
import '../../data/styles.css';

// markup
const FilesOutput = () => {
    const [files, setFiles] = React.useState<File[]>();

    const update = (mem) => {
        //TODO:pull files from mem.buffer
    };
    return (
        <div id="holder">
            {files.length > 1 && <div id="suggestion" onClick={
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
            </div>}
            <div id="resultsHolder">
                {files.map((result, index) => {
                    const url = (window.URL || window.webkitURL).createObjectURL(result);
                    return (
                        <div id="suggestion" key={index} download={result.name} href={url}>
                            {result.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FilesOutput;
