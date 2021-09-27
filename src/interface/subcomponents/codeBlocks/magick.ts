import { toast } from "react-toastify";
import {
  buildInputFile,
  execute,
  loadImageElement,
  MagickInputFile,
} from "wasm-imagemagick";

const magick = async () => {
  const magickGeneric = async (input: File[], runargs: string[]) => {
    var richNames = [];
    return new Promise(() =>
      input.map(async (f, i) => {
        const fileArrayBuffer = await f.arrayBuffer();
        richNames[i] = f.name;
        return {
          name: f.name,
          content: new Uint8Array(fileArrayBuffer),
        };
      })
    ).then(async (inputFiles: MagickInputFile[]) => {
      const commands: string[] = runargs.map((ra) => {
        /**
         * if any of these strings match {if$*00} then...
         */
        const lst = ra.split(/[{}]/);

        return lst
          .map((l) => {
            if (l.indexOf("$*") > -1) {
              const num = Number(l.split("$*")[1]);
              return richNames[num];
            } else return l;
          })
          .join("");
      });

      const { outputFiles, exitCode } = await execute({
        inputFiles,
        commands,
      });
      if (exitCode !== 0) return outputFiles;
      else toast("error processing files!");
    });
  };
  return {
    // name: {
    //   function: () => magickGeneric(),
    //   names: [""],
    //   types: [""],
    // },
  };
};

/*
Don't forget to do this when you build:
cp node_modules/wasm-imagemagick/dist/magick.wasm .
cp node_modules/wasm-imagemagick/dist/magick.js .
*/
export default magick;
