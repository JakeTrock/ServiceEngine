import JSZip from "jszip";
import helpers from "../../data/helpers";

const init = async () => {
  function save(file: File) {
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
    downloadOne: (file: File) => save(file),
    downloadMany: async (inputs: File[]) => {
      if (inputs.length > 0) {
        var zip = new JSZip();
        helpers.asyncMap(inputs, async (f) => zip.file(f.name, f.arrayBuffer())).then(
          () =>
            zip.generateAsync({ type: "blob" }).then(function (content) {
              save(
                new File([content as BlobPart], `sengine-${+new Date()}.zip`)
              );
            })
        );
      }
    },
  };
};

export default init;
