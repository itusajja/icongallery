const fs = require("fs");
const path = require("path");
const moment = require("moment");
const prompts = require("prompts");
const fetch = require("node-fetch");
const rl = require("readline-sync");

const IOS = "ios";
const MACOS = "macos";
const WATCHOS = "watchos";

const IMGS_DIR = path.resolve(__dirname /*, "../../img"*/);
const POSTS_DIR = path.resolve(__dirname /*, "../../_posts"*/);

process.on("unhandledRejection", err => {
  console.error(err);
  process.exit(1);
});

main();

async function main() {
  // Get the ID of the project
  const projectId = getProjectId();

  // Prompt for iTunes info
  const { itunesUrl, itunesId } = promptForItunesUrl();

  // Query iTunes API
  const {
    artworkUrl512,
    artistName,
    primaryGenreId,
    sellerUrl,
    trackName,
    trackViewUrl
  } = await queryItunes(itunesId);

  // Prompt for other icon info
  const designer = rl.question("designer: ").trim();
  const designerUrl = rl.question("designerUrl: ").trim();
  const colorId = rl.question("colorId: ").trim();

  // Map itunes response to our app data
  const post = {
    title: trackName,
    slug: /\/app\/(.*)\//.exec(trackViewUrl)[1],
    date: moment().format("YYYY-MM-DD"),
    categoryId: primaryGenreId,
    itunesUrl: trackViewUrl.replace(/\?.*$/, ""), // remove any query string on the end
    developer: artistName,
    ...(sellerUrl ? { developerUrl: sellerUrl } : {}),
    ...(designer ? { designer } : {}),
    ...(designerUrl ? { designerUrl } : {}),
    ...(colorId ? { colorId } : {})
  };

  // Formulate file name/contents
  const fileName = `${post.date}-${post.slug}.md`;
  const fileContents = getFileContents(post);

  // Confirm we want to write
  console.log("\n\n" + fileName + "\n" + fileContents + "\n\n");
  const confirmWrite = rl.keyInYN("Write?");

  if (confirmWrite) {
    console.log("Writing...");
    // Write markdown file
    fs.writeFileSync(path.resolve(POSTS_DIR, fileName), fileContents);

    // Fetch the icon and write file
    const wroteFileSuccess = await writePostImg({
      post,
      artworkUrl512,
      projectId
    });
    console.log("Done?", wroteFileSuccess);
  }
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
 *
 * @return {Object} info
 *         {String} itunesUrl
 *         {String} itunesId
 */
function promptForItunesUrl() {
  const regexItunesUrl = /^(http|https):\/\/itunes.apple.com/;
  const regexItunesId = /\/id([\d]+)/;

  const itunesUrl = rl.question("itunesUrl: ").trim();

  if (regexItunesUrl.test(itunesUrl) && regexItunesId.test(itunesUrl)) {
    return {
      itunesUrl,
      itunesId: regexItunesId.exec(itunesUrl)[1]
    };
  } else {
    console.log(
      "iTunes URL invalid. Please enter a valid iTunes URL, i.e. https://itunes.apple.com/us/app/angry-birds/id343200656"
    );
    promptForItunesUrl();
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

function getFileContents(post) {
  return (
    "---\n" +
    Object.keys(post).reduce((acc, key) => {
      // If there are special yaml characters we stick the value in quotes
      // const value = yamlSpecialChars.some(specialChar =>
      //   typeof post[key] === 'string' && post[key].includes(specialChar)
      // )
      //   ? `"${post[key]}"`
      //   : post[key];
      return acc + `${key}: ${post[key]}\n`;
    }, "") +
    "---"
  );
}

/**
 * Write post markdown file.
 * @param {Object} post
 */
function writePostMd(post) {}

/**
 * Write the image file for the associated post markdown
 * @param {String} projectId
 * @param {String} artworkUrl512 - Value we got from itunes for the icon
 * @param {Objet} post
 */
async function writePostImg({ projectId, artworkUrl512, post }) {
  let imgUrl1024 = "";

  if (projectId === IOS || projectId === MACOS) {
    imgUrl1024 = artworkUrl512.replace(".jpg", ".png").replace("512x512", "1024x1024");
  } else {
    // watchos
    // Ask for the image's 399 URL, then change to 1024
    // Eample: # http://is5.mzstatic.com/image/thumb/Purple118/v4/d5/d5/ca/d5d5caa5-97f6-07f7-a3e8-9e1da044ac4a/source/399x399bb.jpg
    imgUrl1024 = rl.question("raw icon url: ").trim();
    imgUrl1024 = imgUrl1024.substr(0, imgUrl1024.lastIndexOf('/')) + "/1024x1024.png";
  }

  const imgUrl512 = imgUrl1024.replace("1024x1024", "512x512");
  const imgName = `${post.slug}-${post.date}.png`;

  try {
    // Fetch the image
    let res = await fetch(imgUrl1024);
    if (!res.ok) {
      res = await fetch(imgUrl512);
    }

    // Write to disk
    const wroteSuccess = await res.body
      .pipe(fs.createWriteStream(path.join(IMGS_DIR, imgName)))
      .on("close", () => true);

    return true;
  } catch (e) {
    console.error("Failed to fetch image and write to hard drive.", e);
    process.exit(1);
  }
}
