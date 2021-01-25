"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imagemagickIndexes = [
    (input, output) => `convert ${input} ${output}`,
    (input, iw, ih, ix, iy) => `convert -crop ${iw}x${ih}+${ix}+${iy} ${input} ${input}`,
    (input, resize) => `convert ${input} -resize ${resize}% ${input}`,
    (input) => `convert ${input} -monochrome ${input}`,
    (input, codec) => `convert ${input} -sampling-factor 4:2:0 -strip -quality 85 -interlace ${codec} -colorspace RGB ${input}`,
    (input, delay, outputName) => `convert -delay ${delay} -loop 5 -dispose previous ${input.join(' ')} ${outputName}.gif`,
    (inputName, outputName) => `convert ${inputName.join(' ')} ${outputName}.gif`
];
exports.default = imagemagickIndexes;
//# sourceMappingURL=imageMagick.js.map