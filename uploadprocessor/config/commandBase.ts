export const commandBase: Object ={
  "feb278f5-e0b0-4e49-99bc-a21c9103ff58": {
    "clientScript": "3dModCon",
    "backendCommand": (input, outExt)=>`assimp export ${input} ${input.split(`.`)+'-converted.'+outExt}`
  },
  "b10f3c8d-c7f5-48bf-885f-47130e8dac69": {
    "clientScript": "cropVid",
    "backendCommand": (input, dimw, dimh, dimx, dimy) => `ffmpeg -i ${input} -filter:v 'crop=${dimw}:${dimh}:${dimx}:${dimy}' ${input.split(`.`)[0]+'-cropped.'+input.split(`.`)[1]}`
  },
  "e590a5fe-6e7b-48cf-8e6e-7d17597560e7": {
    "clientScript": "trimAud",
    "backendCommand": (input, sm, ss, sms, em, es, ems) => `ffmpeg -ss ${sm}:${ss}:${sms} -i ${input} -to ${em}:${es}:${ems} -c copy ${input.split(`.`)[0]+'-timetrim.'+input.split(`.`)[1]}`
  },
  "dc2de45e-ab8e-48d8-924a-f23cd346242e": {
    "clientScript": "trimVid",
    "backendCommand": (input, sm, ss, sms, em, es, ems) => `ffmpeg -ss ${sm}:${ss}:${sms} -i ${input} -to ${em}:${es}:${ems} -c copy ${input.split(`.`)[0]+'-timetrim.'+input.split(`.`)[1]}`
  },
  "4bbf2a6a-8d1b-41b0-8fd5-6c24ec099754": {
    "clientScript": "audChange",
    "backendCommand": (input, input1) => `ffmpeg -i ${input} -i ${input1} -map 0:0 -map 1:0 -c:v copy -c:a aac -b:a 256k -shortest ${input.split(`.`)[0]+'-newaud.'+input.split(`.`)[1]}`
  },
  "7a55e42b-c1bf-47f2-a86e-980433b1e04c": {
    "clientScript": "videoUploadSimple",
    "backendCommand": (input) => `ffmpeg -i ${input} -codec copy -an ${input.split(`.`)[0]+'-noaud.'+input.split(`.`)[1]}`
  },
  "f23a7c9a-4e76-4a4f-8d70-0836263a43d7": {
    "clientScript": "extAudio",
    "backendCommand": (input, outputForm) => `ffmpeg -i ${input} -vn -acodec copy ${input.split(`.`)[0]+'-newaud.'+outputForm}`
  },
  "1a72ddb2-7b43-4c4d-9944-4cd12bdeac41": {
    "clientScript": "vidToVid",
    "backendCommand": (input, outputForm) => `ffmpeg -i ${input} -vn -acodec copy ${input.split(`.`)[0]+'-converted.'+outputForm}`
  },
  "cd66bc21-e411-4a9d-8ef6-971c4e25a861": {
    "clientScript": "audToAud",
    "backendCommand": (input, outputForm) => `ffmpeg -i ${input} -vn -acodec copy ${input.split(`.`)[0]+'-converted.'+outputForm}`
  },
  "f4347d77-9429-423d-98e2-f1768b54e7ad": {
    "clientScript": "vidOpt",
    "backendCommand": (input, quality) => `ffmpeg -y -i ${input} -c:v libx264 -crf ${quality} -profile:v high -pix_fmt yuv420p -color_primaries 1 -color_trc 1 -colorspace 1 -movflags +faststart -an ${input.split(`.`)[0]}-optimized.mp4`
  },
  "1ee3deec-e728-4ec2-9fd5-b595fb7310d9": {
    "clientScript": "dvdUpl",
    "backendCommand": (input, isNTSC) => `ffmpeg -i ${input} -target ${(isNTSC)?'ntsc':'pal'}-dvd ${input.split(`.`)[0]+'-dvd.'+input.split(`.`)[1]}`
  },
  "f4911fa7-dc07-485e-b308-4eb35e2f1f9c": {
    "clientScript": "videoWatermark",
    "backendCommand": (input, watermark, wmx, wmy) => `ffmpeg -i ${input} -i ${watermark}-filter_complex 'overlay=${wmx}:${wmy}' ${input.split(`.`)[0]+'-watermarked.'+input.split(`.`)[1]}`
  },
  "706e6896-244e-4b12-9b80-4a3942fe6091": {
    "clientScript": "videoWatermark",
    "backendCommand": (input, watermark, wmx, wmy) => `ffmpeg -i ${input} -i ${watermark}-filter_complex 'overlay=${wmx}:${wmy}' ${input.split(`.`)[0]+'-watermarked.'+input.split(`.`)[1]}`
  },
  "9a71280b-a4c7-4622-88b3-482b702c7d46": {
    "clientScript": "videoResize",
    "backendCommand": (input, width) => `ffmpeg -i ${input} -filter:v scale=${width}:-1 -c:a copy ${input.split(`.`)[0]+'-resized.'+input.split(`.`)[1]}`
  },
  "46b0ed7f-79dc-49ff-9c75-65bfbdf3e8a3": {
    "clientScript": "videoResize",
    "backendCommand": (input, width) => `ffmpeg -i ${input} -filter:v scale=${width}:-1 -c:a copy ${input.split(`.`)[0]+'-resized.'+input.split(`.`)[1]}`
  },
  "b146d2bd-3650-4ee4-816a-938af36d26f6": {
    "clientScript": "videoGif",
    "backendCommand": (input, length, loop) => `ffmpeg -t ${length} -i ${input} -vf 'fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse' -loop ${loop} ${input.split(`.`)[0]}-gifconv.gif`
  },
  "171521fa-6825-4e5f-b0a1-4f4b2cec50bf": {
    "clientScript": "videoRotate",
    "backendCommand": (input, rotateFactor) => `ffmpeg -i ${input} -vf 'transpose=${rotateFactor}' ${input.split(`.`)[0]+'-rotatedCustom.'+input.split(`.`)[1]}`
  },
  "2a35ec9e-485a-4085-b654-9c8e353d7577": {
    "clientScript": "uploadSimple",
    "backendCommand": (input) => `ffmpeg -i ${input} -vf 'transpose=1' ${input.split(`.`)[0]+'-rotated90.'+input.split(`.`)[1]}`
  },
  "ad6c92f2-9d8a-4c31-a05a-080980577016": {
    "clientScript": (input) => `ffmpeg -i ${input} -vf 'transpose=2,transpose=2' ${input.split(`.`)[0]+'-rotated180.'+input.split(`.`)[1]}`
  },
  "e248f4f5-352b-476a-9b2e-b399304b00b3": {
    "clientScript": (input) => `ffmpeg -i ${input} -vf 'transpose=2,transpose=2' ${input.split(`.`)[0]+'-rotated180.'+input.split(`.`)[1]}`
  },
  "9da36fbd-9c3e-4ba9-8fdd-3bce6f84fc74": {
    "clientScript": (input) => `ffmpeg -i ${input} -vf 'transpose=3' ${input.split(`.`)[0]+'-rotated270.'+input.split(`.`)[1]}`
  },
  "1b2be231-b6b0-4133-b64d-81d2019f7e4a": {
    "clientScript": "imageFormConv",
    "backendCommand": (input, outputForm) => `convert ${input} ${input.split(`.`)[0]+'-converted.'+outputForm}`
  },
  "fa1eb28f-633a-4d1b-92e6-8fd09f235103": {
    "clientScript": "imageCrop",
    "backendCommand": (input, iw, ih, ix, iy) => `convert -crop ${iw}x${ih}+${ix}+${iy} ${input} ${input.split(`.`)[0]+'-cropped.'+input.split(`.`)[1]}`
  },
  "206026a0-a2a1-40ff-b182-59ec078c4a1e": {
    "clientScript": "imageResize",
    "backendCommand": (input, resize) => `convert ${input} -resize ${resize}% ${input.split(`.`)[0]+'-resized.'+input.split(`.`)[1]}`
  },
  "2e800731-0f24-4ef0-990e-5301df1cf473": {
    "clientScript": "imageMonochrome",
    "backendCommand": (input) => `convert ${input} -monochrome ${input.split(`.`)[0]+'-monochrome.'+input.split(`.`)[1]}`
  },
  "acd6c452-c104-4cea-97cf-b0d9dcae837a": {
    "clientScript": "imageUploadSimple",
    "backendCommand": (input, codec) => `convert ${input} -sampling-factor 4:2:0 -strip -quality 85 -interlace ${codec} -colorspace RGB ${input.split(`.`)[0]+'-optimized.'+input.split(`.`)[1]}`
  },
  "c46ad602-9e95-4a08-a458-1a455a80f4ab": {
    "clientScript": "imageMakeGif",
    "backendCommand": (input, delay, outputName) => `convert -delay ${delay} -loop 5 -dispose previous ${input.join(' ')} ${outputName}-gifcomp.gif`
  },
  "d9702b96-e688-45af-8323-c68947d5b957": {
    "clientScript": "imageCombineGif",
    "backendCommand": (inputName, outputName) => `convert ${inputName.join(' ')} ${outputName}.gif`
  },
  "29b151ff-e54c-48ff-a1d6-558f2729b26c": {
    "clientScript": "timer",
    "backendCommand": "'false'"
  },
  "0d00e2b7-6721-4339-9591-16e6b86a746f": {
    "clientScript": "clock",
    "backendCommand": "'false'"
  },
  "0ae99c7b-90a8-4b9f-aaaf-3bafb6ec85c0": {
    "clientScript": "calculator",
    "backendCommand": "'false'"
  }
};