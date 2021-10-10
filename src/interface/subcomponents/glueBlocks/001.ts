import { toast } from "react-toastify";

async function asyncFor(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const glcode = (imports) => {
  const ffmpeg = imports.libraries.ffmpeg;
  let dd2: string, filesIn: File[], filesDownloadable: File[], currPromise;

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
      console.log(filesDownloadable);
      const file = filesDownloadable[a.findex];
      console.log(file);
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
      if (currPromise !== undefined) currPromise.cancel(); //TODO:instead of this make a list with cancel buttons you append to
      const progbar = (prog) => {
        fa("set", "ffmbar", { defaults: { value: prog } });
      };
      if (fa("get", "convertinglabel")) {
        fa("del", "convertinglabel");
        fa("del", "ffmbar");
      } else if (fa("get", "button2")) {
        const all = fa("get").filter(
          (e) => e.id === "button" && e.uuid !== "button1"
        );
        all.forEach((e) => {
          fa("del", e.uuid);
        });
      } else {
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
      }

      // currPromise = new Promise<File[]>((resolve) => {
      //   setTimeout(() => {
      //     resolve([
      //       new File(["new Blob()"], "banan", {
      //         type: "text/plain",
      //       }),
      //     ]);
      //   }, 300);
      // })
      currPromise = ffmpeg.formatToFormat
        .function(
          filesIn,
          filesIn.map((f) => f.name + "." + dd2),
          progbar
        )
        .then((filesOut: File[]) => {
          filesDownloadable = filesOut;
          console.log(filesDownloadable[0]);
          console.log(filesOut);
          asyncFor(filesOut, (file, i) => {
            console.log(i);
            fa("add", "", {
              id: "button",
              uuid: "button" + (i + 2),
              defaults: {
                visible: true,
                disabled: false,
                size: "1em",
                label: "Download " + file.name,
              },
              hooks: {
                click: {
                  name: "download",
                  additional: { fname: file.name, findex: i },
                },
              },
            });
          }).then(() => {
            currPromise = undefined;
            fa("del", "convertinglabel");
            fa("del", "ffmbar");
          });
        })
        .catch((e) => toast(e));
    },
  };
};

export default glcode;
