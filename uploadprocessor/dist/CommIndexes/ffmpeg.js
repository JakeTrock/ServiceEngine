"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ffmpegIndexes = [
    (input, dimw, dimh, dimx, dimy) => `ffmpeg -i ${input} -filter:v "crop=${dimw}:${dimh}:${dimx}:${dimy}" ${input}`,
    (input, sm, ss, sms, em, es, ems) => `ffmpeg -ss ${sm}:${ss}:${sms} -i ${input} -to ${em}:${es}:${ems} -c copy ${input}`,
    (input1, input2) => `ffmpeg -i ${input1} -i ${input2} -map 0:0 -map 1:0 -c:v copy -c:a aac -b:a 256k -shortest ${input1}`,
    (input) => `ffmpeg -i ${input} -codec copy -an ${input}`,
    (input, output) => `ffmpeg -i ${input} -vn -acodec copy ${output}`,
    (input, output) => `ffmpeg -i ${input} ${output}`,
    (input, quality, outname) => `ffmpeg -y -i ${input} -c:v libx264 -crf ${quality} -profile:v high -pix_fmt yuv420p -color_primaries 1 -color_trc 1 -colorspace 1 -movflags +faststart -an ${outname}.mp4`,
    (input, watermark, wmx, wmy) => `ffmpeg -i ${input} -i ${watermark}-filter_complex "overlay=${wmx}:${wmy}" ${input}`,
    (input, width) => `ffmpeg -i ${input} -filter:v scale=${width}:-1 -c:a copy ${input}`,
    (input, length, loop, outname) => `ffmpeg -t ${length} -i ${input} -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop ${loop} ${outname}.gif`
];
exports.default = ffmpegIndexes;
//# sourceMappingURL=ffmpeg.js.map