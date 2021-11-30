import helpers from "../../../../data/helpers";

const glcode = (imports) => {
  const ffmpeg = imports.libraries.ffmpeg;
  const download = imports.libraries.fileUtils.downloadOne;
  let qual: number,
    dd2: string,
    isfourthree: boolean,
    filesIn: File[],
    filesDownloadable: File[],
    currPromise;

  //object containing functions which attach to the form
  return {
    setqual: (event, formAccess, additional, notify) => {
      qual = event.value;
    },
    dropdown: (event, formAccess, additional, notify) => {
      dd2 = event.value;
    },
    setfourthree: (event, formAccess, additional, notify) => {
      isfourthree = event.value === "yes";
    },
    //hook that runs when a file is chosen
    chooser: (event, formAccess, additional, notify) => {
      var f = event.files;
      if (f.length) {
        let tmp = [];
        for (var i = 0; i < f.length; i++) {
          if (f[i].name.indexOf("mp4") < 0) {
            notify("file must be a MP4!");
            tmp = [];
          }
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
      if (currPromise !== undefined) currPromise.cancel(); //TODO:instead of this make a list with cancel buttons you append to
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
      currPromise = ffmpeg
        .basicProcess(
          filesIn,
          filesIn.map((n, i) =>
            isfourthree
              ? [
                  "-filter:v 'crop=ih/3*4:ih'",
                  "-c:v libx264",
                  `-crf ${qual}`,
                  // `-preset ${dd2}`,
                  "-c:a copy",
                  "-i",
                  `{if${i}}`,
                  `{of${i}}`,
                ]
              : [
                  "-c:v libx264",
                  `-crf ${qual}`,
                  // `-preset ${dd2}`,
                  "-c:a copy",
                  "-i",
                  `{if${i}}`,
                  `{of${i}}`,
                ]
          ),
          progbar,
          filesIn.map((f) => `opt.${f.name}`)
        )
        .then((filesOut: File[]) => {
          filesDownloadable = filesOut;
          //add download button for every available downloadable
          helpers
            .asyncFor(filesOut, (file, i) => {
              formAccess("add", "", {
                id: "button",
                uuid: "button" + (i + 5),
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
            })
            .then(() => {
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
