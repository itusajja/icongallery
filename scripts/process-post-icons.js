const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");

const VARIANTS = [1024, 512, 256, 128];
const IMG_DIR = path.join(__dirname, "../../img");

processPostIcons(path.join(__dirname, "1password-1999-12-12.png"));

/**
 *
 * Here's what we want to do:
 * 1. Take the source file, copy it to `_src`
 * 2. Take the source file, get its size, copy it to corresponding folder,
 *    then optimize it.
 * 3. Take the source file, and for each remaining size:
 *    Copy, resize, optimize, move to dest
 * 4. Log out this information, something like:
 *
 * dest     original   resized     optimized
 * _src/    342.12KB
 * 1024/    342.12KB               312.34KB
 * 512/     342.12KB   99.66KB     83.12KB
 * 256/     342.12KB   29.29KB     25.12KB
 * 128/     342.12KB   18.12KB     9.25KB
 *
 * @param {string} srcFilePath
 */
async function processPostIcons(srcFilePath) {
  // Order here matters.
  // Our source file might be 1024, it might be 512 (in theory could be even
  // smaller). We'll pluck out any bigger ones and not resize the largest we have.
  let files = [
    { dest: "1024", optimize: true, resize: true },
    { dest: "512", optimize: true, resize: true },
    { dest: "256", optimize: true, resize: true },
    { dest: "128", optimize: true, resize: true },
    { dest: "_src", optimize: false, resize: false }
  ];

  const srcFileName = path.basename(srcFilePath);
  const srcFileDimension = await sharp(srcFilePath)
    .metadata()
    .then(metadata => String(metadata.width));

  // Pluck out any bigger sizes than what the source is. Then set the first one
  // (which matches our source file) to not be resized.
  const index = files.findIndex(file => file.dest === srcFileDimension);
  files = files.slice(index);
  files[0].resize = false;

  // Process all the images
  const log = await Promise.all(
    files.map(async ({ dest, optimize, resize }) => {
      const destFilePath = path.join(IMG_DIR, dest, srcFileName);
      const original = getFilesize(srcFilePath);

      try {
        await fs.copy(srcFilePath, destFilePath);

        let resized = "";
        if (resize) {
          resized = await sharp(destFilePath)
            .resize(Number(dest))
            .toBuffer()
            .then(data => fs.outputFile(destFilePath, data))
            .then(() => getFilesize(destFilePath));
        }

        let optimized = "";
        if (optimize) {
          optimized = await imagemin([destFilePath], path.join(IMG_DIR, dest), {
            use: [imageminPngquant()]
          }).then(() => getFilesize(destFilePath));
        }

        return {
          dest,
          original,
          resized,
          optimized
        };
      } catch (e) {
        console.error(`Error processing image ${destFilePath}.`, e);
        process.exit(1);
      }
    })
  );

  console.table(log);
  return true;
}

function getFilesize(filename) {
  const stats = fs.statSync(filename);
  return formatBytes(stats.size);
}

// https://stackoverflow.com/a/23625419
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + "Bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + "KB";
  else return (bytes / 1048576).toFixed(2) + "MB";
}
