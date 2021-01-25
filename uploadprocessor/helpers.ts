const ftypes = [
    'mp4',
    'mp3',
    'webm',
    'avi',
    'wmv',
    'mkv',
    'gif',
    'jpg',
    'jpeg',
    'png',
    'tiff',
    'aiff',
];

const fileRegex = /^[\w,\s$-/:-?{-~!"^_`\[\]]+\.[A-Za-z0-9]{3,4}$/;
/**
 * Returns the extensions of the given file.
 *
 * Example: "test.JPG" will return "jpg".
 */
export const getFileExtension = (file) => {
    const index = file.originalname.lastIndexOf('.') + 1;
    return file.originalname.substr(index).toLowerCase();
};

export const isFtype = (p) => {
    if (p === Array) {
        return p.array.some((element) => element.match(fileRegex) && ftypes.indexOf(p.split('.')[1]) > -1);
    }
    return p.match(fileRegex) && ftypes.indexOf(p.split('.')[1]) > -1;
};
