import { toast } from "react-toastify";
import { hookCollection } from "./interfaces";
import ffmpeg from "../subcomponents/codeBlocks/ffmpeg";
import glue from "../subcomponents/glueBlocks/001";

// const prefixCB = "../subcomponents/codeBlocks/";
// const prefixGB = "../subcomponents/glueBlocks/";

export const wasmLoader = async (id, libraries): Promise<hookCollection> => {
  //I'm at the end of my goddamned rope with this one. Fix it before it gives me a damned hernia..
  // return import(prefixGB + id).then(async (glue) => {
  //   const libsall = await Promise.all(
  //     libraries.map(async (l) => {
  //       try {
  //         const lzlib = await import(prefixCB + l);
  //         return lzlib({});
  //       } catch (e) {
  //         return toast("error fetching library");
  //       }
  //     })
  //   );
  //   return glue({
  //     libraries: libsall.reduce(function (r, o, i) {
  //       //combine libs
  //       r[libraries[i]] = o;
  //       return r;
  //     }, {}),
  //   });
  // });
  if (typeof SharedArrayBuffer === 'undefined') {
    const dummyMemory = new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true });
    //@ts-ignore
    globalThis.SharedArrayBuffer = dummyMemory.buffer.constructor
  }
  const ff = await ffmpeg();
  return glue({ libraries: { ffmpeg: ff } });
};
