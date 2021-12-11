import JSZip from "jszip";

async function asyncMap(array, callback) {
  for (let index = 0; index < array.length; index++) {
    array[index] = await callback(array[index], index, array);
  }
  return array;
}

const init = async () => {
  function save(file) {
    if (file) {
      const url = window.URL.createObjectURL(file);
      const dlink = document.createElement("a");
      dlink.style.display = "none";
      dlink.href = url;
      dlink.download = file.name;
      document.body.appendChild(dlink);
      dlink.click();
      window.URL.revokeObjectURL(url);
    }
  }
  return {
    downloadOne: (file) => save(file),
    downloadMany: async (inputs) => {
      if (inputs.length > 0) {
        var zip = new JSZip();
        asyncMap(inputs, async (f) => zip.file(f.name, f.arrayBuffer())).then(
          () =>
            zip.generateAsync({ type: "blob" }).then(function (content) {
              save(new File(content, `sengine-${+new Date()}.zip`));
            })
        );
      }
    },
  };
};

(()=>{
    window.addmodule(init);
})();
