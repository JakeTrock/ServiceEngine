import assimp from "assimpjs";

const inputFormats = [
  "obj",
  "mtl",
  "stl",
  "3d",
  "3ds",
  "3mf",
  "ac",
  "amf",
  "ase",
  "b3d",
  "blend",
  "bvh",
  "cob",
  "collada",
  "csm",
  "dxf",
  "fbx",
  "gltf",
  "gltf2",
  "hmp",
  "lwo",
  "lws",
  "m3d",
  "md2",
  "md5mesh",
  "mdc",
  "ms3d",
  "nff",
  "off",
  "ogre",
  "assjson",
  "ogex",
  "ply",
  "q3o",
  "q3s",
  "sib",
  "smd",
  "x",
  "xgl",
];

const outputFormats = ["assjson", "gltf", "gltf2", "glb", "glb2"];

const init = async () => {
  const ajs = await assimp();

  const convert = async (files, target) =>
    new Promise(async (resolve, reject) => {
      if (outputFormats.includes(target)) {
        return reject("Incorrect output format!");
      }
      return Promise.all(files.map((res) => res.arrayBuffer())).then(
        (arrayBuffers) => {
          // create new file list object, and add the files
          let fileList = new ajs.FileList();
          for (let i = 0; i < files.length; i++) {
            fileList.AddFile(files[i].name, new Uint8Array(arrayBuffers[i]));
          }

          // convert file list to assimp json
          let result = ajs.ConvertFileList(fileList, target);

          // check if the conversion succeeded
          if (!result.IsSuccess() || result.FileCount() == 0) {
            return reject("3dm error!" + result.GetErrorCode);
          }

          // get the result file, and convert to string

          let filesOut = [];
          for (var i = 0; i < result.FileCount(); i++) {
            filesOut.push(result.GetFile(0));
          }
          resolve(filesOut);
        }
      );
    });

  return {
    getSupportedFormats: () => {
      return { inputFormats, outputFormats };
    },
    convertOne: async (file, target) => convert([file], target)[0],
    convertMany: async (file, target) => convert(file, target)
  };
};

(() => {
  window.addmodule(init);
})();
