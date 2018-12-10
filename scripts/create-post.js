const fs = require("fs-extra");
const path = require("path");
const moment = require("moment");
const prompts = require("prompts");
const fetch = require("node-fetch");
const rl = require("readline-sync");
const processPostIcons = require("./process-post-icons");

const IOS = "ios";
const MACOS = "macos";
const WATCHOS = "watchos";

process.on("unhandledRejection", err => {
  console.error(err);
  process.exit(1);
});

try {
  main();
} catch (e) {
  console.error("Error: failed to create post.", e);
}

async function main() {
  // Get the ID of the project
  const projectId = getProjectId();

  // Keep trying until you get what you want
  // (ideally this gets the id then checks the API for a single result)
  let itunesId = promptForItunesUrl();
  while (!itunesId) {
    itunesId = promptForItunesUrl();
  }

  const designer = rl.question("designer: ").trim();
  const designerUrl = designer
    ? rl.question("designerUrl: ").trim()
    : undefined;
  const colorId = rl.question("colorId: ").trim();

  // ideally at some future date, `createPostFiles` doesn't write directly in
  // place, but rather returns the location of each, then here we would
  // move to their appropriate locations. Or if this was the server,
  // it would take those files and upload them, i.e.
  // ["thing.md", "thing.512.jpg", "thing.256.jpg", "thing.128.jpg"]
  await createPostFiles({
    projectId,
    itunesId,
    additionalPostData: { designer, designerUrl, colorId }
  });

  console.log("Done!");
  process.exit(0);
}

// Ends up in another file (but has side effects, which ideally we move out
// at some point)
async function createPostFiles({
  projectId,
  itunesId,
  additionalPostData = {}
}) {
  // Query iTunes API
  const {
    artworkUrl512,
    artistName,
    primaryGenreId,
    sellerUrl,
    trackName,
    trackViewUrl
  } = await queryItunes(itunesId);
  const { designer, designerUrl, colorId } = additionalPostData;

  // Map itunes response to our app data
  const post = {
    title: trackName,
    slug: /\/app\/(.*)\//.exec(trackViewUrl)[1],
    date: moment().format("YYYY-MM-DD"),
    categoryId: primaryGenreId,
    itunesUrl: trackViewUrl.replace(/\?.*$/, ""), // remove any query string on the end
    developer: artistName,
    ...(sellerUrl ? { developerUrl: sellerUrl } : {}),

    // Additional metadata that can may included in each post
    ...(designer ? { designer } : {}),
    ...(designerUrl ? { designerUrl } : {}),
    ...(colorId ? { colorId } : {})
  };

  // Formulate file name/contents
  const fileName = `${post.date}-${post.slug}.md`;
  const fileContents = createPostMarkdownFile(post);

  // Confirm we want to write
  console.log("\n\n" + fileName + "\n" + fileContents + "\n\n");
  const confirmWrite = rl.keyInYN("Write?");

  if (!confirmWrite) {
    process.exit(1);
  }

  // Write markdown file
  fs.writeFileSync(
    path.resolve(__dirname, "../../_posts", fileName),
    fileContents
  );

  // Fetch the icon and write file
  const srcImgPath = await writePostImg({
    post,
    artworkUrl512,
    projectId
  });
  // process icon into multiple variations
  const wroteFileSuccess = await processPostIcons(srcImgPath);

  // remove our original image
  fs.removeSync(srcImgPath);

  return true;
}

/**
 * Get the id of the project based on the current working directory
 * @return {String} - Project id, i.e. ios, macos, or watchos
 */
function getProjectId() {
  const reg = /.*\/(.*)icongallery.com\//;
  const id = reg.test(__dirname) ? reg.exec(__dirname)[1] : "";
  if (!id) {
    console.error("Error: Couldn’t get `projectId` from working directory.");
    // process.exit(1);
  }

  return id;
}

/**
 * Prompt for an itunesUrl and don't yield until you get it
 * @return {String|Null} itunesId - the ID extracted from the URL
 */
function promptForItunesUrl() {
  const regexItunesUrl = /^(http|https):\/\/itunes.apple.com/;
  const regexItunesId = /\/id([\d]+)/;

  const itunesUrl = rl.question("itunesUrl: ").trim();

  if (regexItunesUrl.test(itunesUrl) && regexItunesId.test(itunesUrl)) {
    return regexItunesId.exec(itunesUrl)[1];
  } else {
    console.log(
      "iTunes URL invalid. Please enter a valid iTunes URL, i.e. https://itunes.apple.com/us/app/angry-birds/id343200656"
    );
    return null;
  }
}

async function queryItunes(itunesId) {
  const res = await fetch(
    `https://itunes.apple.com/lookup?id=${itunesId}`
  ).then(res => res.json());

  // Validate we got something we want...
  if (res.results && res.results[0] && res.results[0].artworkUrl512) {
    return res.results[0];
  } else {
    console.log(res);
    console.error("iTunes API returned unexpected response");
    process.exit(1);
  }
}

/**
 * Take an object and create a mapping of the keys to the values, represented
 * as YAML front-matter. Example:
 *
 * In:
 *   { title: "My Title: Something Here", date: "2018-12-15", colorId: "red" }
 *
 * Out:
 *   ---
 *   title: "My Title: Something Here"
 *   date: 2018-12-15
 *   color: red
 *   ---
 *
 * @param {Object} post
 */
function createPostMarkdownFile(post = {}) {
  const yamlSpecialChars = [":"];
  return (
    "---\n" +
    Object.keys(post).reduce((acc, key) => {
      let value = post[key];
      if (typeof post[key] === "string") {
        if (yamlSpecialChars.some(specialChar => value.includes(specialChar))) {
          value = `"${value}"`;
        }
      }

      return acc + `${key}: ${value}\n`;
    }, "") +
    "---\n"
  );
}

/**
 * Write the image file for the associated post markdown. Return its path
 * @param {String} projectId
 * @param {String} artworkUrl512 - Value we got from itunes for the icon
 * @param {Objet} post
 */
async function writePostImg({ filePath, projectId, artworkUrl512, post }) {
  let imgUrl1024 = "";

  if (projectId === IOS || projectId === MACOS) {
    imgUrl1024 = artworkUrl512
      .replace(".jpg", ".png")
      .replace("512x512", "1024x1024");
  } else {
    // watchos
    // Ask for the image's 399 URL, then change to 1024
    // Eample: # http://is5.mzstatic.com/image/thumb/Purple118/v4/d5/d5/ca/d5d5caa5-97f6-07f7-a3e8-9e1da044ac4a/source/399x399bb.jpg
    imgUrl1024 = rl.question("raw icon url: ").trim();
    imgUrl1024 =
      imgUrl1024.substr(0, imgUrl1024.lastIndexOf("/")) + "/1024x1024.png";
  }

  const imgUrl512 = imgUrl1024.replace("1024x1024", "512x512");
  const imgName = `${post.slug}-${post.date}.png`;

  try {
    const filePath = path.join(__dirname, imgName);

    // Fetch the image & write to disk
    await fetch(imgUrl1024)
      .then(res => (res.ok ? res : fetch(imgUrl512)))
      .then(res => {
        // https://github.com/bitinn/node-fetch/issues/375
        return new Promise((resolve, reject) => {
          const dest = fs.createWriteStream(filePath);
          res.body.pipe(dest);
          res.body.on("error", err => {
            reject(err);
          });
          dest.on("finish", () => {
            resolve();
          });
          dest.on("error", err => {
            reject(err);
          });
        });
      });

    return filePath;
  } catch (e) {
    console.error("Failed to fetch image and write to hard drive.", e);
    process.exit(1);
  }
}
