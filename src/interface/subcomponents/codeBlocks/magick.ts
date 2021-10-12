import { execute, MagickInputFile } from "wasm-imagemagick";

const outFormatTranslate = {
  //TODO:addmore
  png: "image/png",
  jpg: "image/jpg",
  svg: "image/svg",
  bmp: "image/bmp",
  webp: "image/webp",
  tiff: "image/tiff",
};

async function asyncMap(array, callback) {
  for (let index = 0; index < array.length; index++) {
    array[index] = await callback(array[index], index, array);
  }
  return array;
}

const magick = async () => {
  const magickGeneric = async (input: File[], runargs: string[]) =>
    new Promise<File[]>(async (resolve, reject) => {
      var richNames = [];

      return asyncMap(input, async (f, i) => {
        const fileArrayBuffer = await f.arrayBuffer();
        richNames[i] = f.name;
        return {
          name: f.name,
          content: new Uint8Array(fileArrayBuffer),
        };
      })
        .then(async (inputFiles: MagickInputFile[]) => {
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

          return execute({
            inputFiles,
            commands,
          }).then((eres) => {
            const { outputFiles, exitCode, errors } = eres;
            if (exitCode !== 0) {
              return outputFiles.map((n) => {
                return new File([n.blob], n.name, {
                  type: outFormatTranslate[n.name],
                });
              });
            } else {
              reject(errors);
            }
          });
        })
        .then((files: File[]) => resolve(files))
        .catch((e) => reject(e));
    });
  return {
    // name: {
    //   function: () => magickGeneric(),
    //   names: [""],
    //   types: [""],
    // },
    formatToFormat: {
      function: (input: File[], outNames: string[]) =>
        magickGeneric(
          input,
          outNames.map((n, i) => `convert ${input[i].name} ${n}`)
        ),
      names: ["input file", "output format"],
      types: ["File", "string"],
    },
  };
};

/*
Don't forget to do this when you build:
cp node_modules/wasm-imagemagick/dist/magick.wasm .
cp node_modules/wasm-imagemagick/dist/magick.js .
*/
export default magick;
