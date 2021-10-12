async function asyncFor(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const glcode = (imports) => {
  const ffmpeg = imports.libraries.ffmpeg;
  let dd2: string, filesIn: File[], filesDownloadable: File[], currPromise;

  //object containing functions which attach to the form
  return {
    dropdown: (e, fa, a) => {
      dd2 = e.target.value;
    },
    //hook that runs when a file is chosen
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
    //downloads file as from object
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
    //hook that runs when the convert button is pressed
    convert: async (e, fa, a) => {
      if (currPromise !== undefined) currPromise.cancel(); //TODO:instead of this make a list with cancel buttons you append to
      const progbar = (prog) => {//function which increments the progressbar from within ffmpeg
        fa("set", "ffmbar", { defaults: { value: prog } });
      };

      if (fa("get", "convertinglabel")) {
        //if a file was already being converted, remove the previous label and loading bar
        fa("del", "convertinglabel");
        fa("del", "ffmbar");
      } else if (fa("get", "button2")) {
        //if a new file is to be converted and the old download still exists, remove it
        const all = fa("get").filter(
          (e) => e.id === "button" && e.uuid !== "button1"
        );
        all.forEach((e) => {
          fa("del", e.uuid);
        });
      } else {
        //otherwise add the converting label and loading bar
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

      //run conversion from imported library
      currPromise = ffmpeg
        .formatToFormat(
          filesIn,
          filesIn.map((f) => f.name + "." + dd2),
          progbar
        )
        .then((filesOut: File[]) => {
          filesDownloadable = filesOut;
          //add download button for every available downloadable
          asyncFor(filesOut, (file, i) => {
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
        .catch((e) =>
          fa("add", "", {
            id: "label",
            defaults: { visible: true, size: "1em", label: e },
          })
        );
    },
  };
};

export default glcode;
