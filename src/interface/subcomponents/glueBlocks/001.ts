import { toast } from "react-toastify";

const glcode = (imports) => {
  const ffmpeg = imports.libraries.ffmpeg;
  let dd2: string, filesIn: File[], filesDownloadable: File[];

  return {
    dropdown: (e, fa, a) => {
      dd2 = e.target.value;
    },
    chooser: (e, fa, a) => {
      var f = e.target.files;
      if (f.length) {
        let tmp = [];
        for (var i = 0; i < f.length; i++) {
          tmp.push(f[i]);
        }
        filesIn = tmp;
      }
    },
    download: async (e, fa, a) => {
      const file = filesDownloadable[a.findex];
      const url = window.URL.createObjectURL(file);
      const dlink = document.createElement("a");
      dlink.style.display = "none";
      dlink.href = url;
      dlink.download = a.fname;
      document.body.appendChild(dlink);
      dlink.click();
      window.URL.revokeObjectURL(url);
    },
    convert: async (e, fa, a) => {
      fa("add", "", {
        id: "label",
        uuid: "convertinglabel",
        defaults: { visible: true, size: "1em", label: "Converting..." },
      });
      fa("add", "", {
        id: "progbar",
        uuid: "ffmbar",
        defaults: { visible: true, value: 0, min: 0, max: 1 },
      });
      const progbar = (prog) => {
        fa("set", "ffmbar", { default: { value: prog } });
      };
      console.log(fa("get"));
      // if (fa("get", "downloadButton").length > 0) {
      //   const all = fa("get").filter(
      //     (e) => (e.id = "button" && e.uuid !== "button1")
      //   );
      //   all.forEach((e) => {
      //     fa("del", e.uuid);
      //   });
      // }
      // ffmpeg.formatToFormat
      //   .function(
      //     filesIn,
      //     filesIn.map((f) => f.name + "." + dd2),
      //     progbar
      //   )
      //   .then((filesOut) => {
      //     filesDownloadable = filesOut;
      //     console.log(filesOut);
      //     filesOut
      //       .forEach((file, i) => {
      //         fa("add", "", {
      //           id: "button",
      //           uuid: "button" + (i + 1),
      //           defaults: {
      //             visible: true,
      //             disabled: false,
      //             size: "1em",
      //             label: "Download " + file.name,
      //           },
      //           hooks: {
      //             click: {
      //               name: "download",
      //               additional: { fname: file.name, findex: i - 1 },
      //             },
      //           },
      //         });
      //       })
      //       .then(() => fa("del", "convertinglabel"));
      //   })
      //   .catch((e) => toast(e));
    },
  };
};

export default glcode;
