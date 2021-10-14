import { createFFmpeg } from "@ffmpeg/ffmpeg";
const outFormatTranslate = {
  //Aud
  wav: "audio/wav",
  ogg: "audio/ogg",
  mp3: "audio/mp3",
  //Vid
  mp4: "video/mp4",
  webm: "video/webm",
  mpv: "video/mpv",
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function asyncMap(array, callback) {
  for (let index = 0; index < array.length; index++) {
    array[index] = await callback(array[index], index, array);
  }
  return array;
}

//https://github.com/ffmpegwasm/ffmpeg.wasm/blob/master/docs/api.md
const ffmpeg = async () => {
  //initialize ffmpeg instance
  const ffmpegInst = createFFmpeg({ log: true });
  await ffmpegInst.load();
  //generic command runner function
  const ffGeneric = async (
    input: File[],
    runargs: string[][],
    opProgresscb: Function,
    opNames: string[]
  ) =>
    new Promise<File[]>(async (resolve, reject) => {
      if (!input || input.length === 0) return reject("no files provided!");
      const all = input.map(
        async (ifile) =>
          new Promise<void>(async (resolve, reject) => {
            ifile
              .arrayBuffer()
              .then((fileArrayBuffer) =>
                ffmpegInst.FS(
                  "writeFile",
                  ifile.name,
                  new Uint8Array(fileArrayBuffer)
                )
              )
              .then(() => resolve())
              .catch((e) => reject(e));
          })
      );
      return Promise.allSettled(all)
        .then(async () =>
          asyncForEach(runargs, (ra) => {
            ffmpegInst.setProgress(({ ratio }) => opProgresscb(ratio));
            return ffmpegInst.run(
              ...ra.map((r) => {
                /*
                    {if} replaced with input filename
                    {of}.xyz replaced with output filename
                  */
                const pos = Number(r.substring(3).split("}")[0]);
                if (r.substring(0, 3) === "{if") {
                  return input[pos].name;
                } else if (r.substring(0, 3) === "{of") {
                  return opNames[pos];
                } else return r;
              })
            );
          })
        )
        .then(() =>
          asyncMap(opNames, async (n) => {
            const f = await ffmpegInst.FS("readFile", n);
            return new File([f], n, {
              type: outFormatTranslate[n],
            });
          })
        )
        .then((f) => resolve(f))
        .catch((e) => reject(e));
    });
  //all exported ffmpeg functions
  return {
    // name: {
    //   function: () => ffGeneric(),
    //   names: [""],
    //   types: [""],
    // },
    /*basic format to format converter*/
    formatToFormat: (input: File[], outNames: string[], progressCB: Function) =>
      ffGeneric(
        input,
        outNames.map((n, i) => ["-i", `{if${i}}`, `{of${i}}`]),
        progressCB,
        outNames
      ),
    optimizeClip: (input: File[], outNames: string[], progressCB: Function) =>
      ffGeneric(
        input,
        outNames.map((n, i) => [
          "-filter:v 'crop=ih/3*4:ih'",
          "-c:v libx264",
          "-crf 28",
          "-preset veryfast",
          "-c:a copy",
          "-i",
          `{if${i}}`,
          `{of${i}}`,
        ]),
        progressCB,
        outNames
      ),
    //TODO: addmore
  };
};

export default ffmpeg;
