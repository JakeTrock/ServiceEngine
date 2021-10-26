async function asyncFor(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const glcode = (imports) => {
  const ffmpeg = imports.libraries.ffmpeg;
  const download = imports.libraries.fileUtils.downloadOne;
  let dd2: string, filesIn: File[], filesDownloadable: File[], currPromise;

  //object containing functions which attach to the form
  return {
    dropdown: (event, formAccess, additional, notify) => {
      dd2 = event.target.value;
    },
    //hook that runs when a file is chosen
    chooser: (event, formAccess, additional, notify) => {
      //TODO: add filetype validator
      var f = event.target.files;
      if (f.length) {
        let tmp = [];
        for (var i = 0; i < f.length; i++) {
          tmp.push(f[i]);
        }
        filesIn = tmp;
      }
    },
    //downloads file as from object
    download: async (event, formAccess, additional, notify) =>
      download(filesDownloadable[additional.findex]),
    //hook that runs when the convert button is pressed
    convert: async (event, formAccess, additional, notify) => {
      const progbar = (prog) => {
        //function which increments the progressbar from within ffmpeg
        formAccess("set", "ffmbar", { defaults: { value: prog } });
      };

      if (formAccess("get", "convertinglabel")) {
        //if a file was already being converted, remove the previous label and loading bar
        formAccess("del", "convertinglabel");
        formAccess("del", "ffmbar");
      } else if (formAccess("get", "button2")) {
        //if a new file is to be converted and the old download still exists, remove it
        const all = formAccess("get").filter(
          (e) => e.id === "button" && e.uuid !== "button1"
        );
        all.forEach((e) => {
          formAccess("del", e.uuid);
        });
      } else {
        //otherwise add the converting label and loading bar
        formAccess("add", "", {
          id: "label",
          uuid: "convertinglabel",
          defaults: { visible: true, size: "1em", label: "Converting..." },
        });
        formAccess("add", "", {
          id: "progbar",
          uuid: "ffmbar",
          defaults: { visible: true, value: 0, min: 0, max: 1 },
        });
      }

      //run conversion from imported library
      ffmpeg
        .basicProcess(
          filesIn,
          filesIn
            .map((f) => f.name + "." + dd2)
            .map((n, i) => ["-i", `{if${i}}`, `{of${i}}`]),
          progbar,
          filesIn.map((f) => f.name + "." + dd2)
        )
        .then((filesOut: File[]) => {
          console.log(filesOut)
          filesDownloadable = filesOut;
          //add download button for every available downloadable
          asyncFor(filesOut, (file, i) => {
            formAccess("add", "", {
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
                  additional: { findex: i },
                },
              },
            });
          }).then(() => {
            currPromise = undefined;
            formAccess("del", "convertinglabel");
            formAccess("del", "ffmbar");
          });
        })
        .catch((e) => notify(e));
    },
  };
};

export default glcode;
