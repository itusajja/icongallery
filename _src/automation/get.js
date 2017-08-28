var colors = require("colors");
var prompt = require("prompt-sync")();
var fetch = require("node-fetch");

main();

async function main() {
  console.log("----> Running...".yellow);

  // Get the ID of the project
  const projectId = getProjectId();

  // Get iTunes info
  const { itunesUrl, itunesId } = promptForItunesInfo();

  // Query iTunes API
  const icon = await queryItunes(itunesId);

  // Map itunes response to our app data
  let post = {
    title: icon.trackName,
    slug: /\/app\/(.*)\//.exec(icon.trackViewUrl)[1],
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    category: icon.primaryGenreId,
    "itunes-url": itunesUrl,
    "app-developer": icon.artistName
  };

  if (icon.sellerUrl) {
    post["app-developer-url"] = icon.sellerUrl;
  }

  const designer = prompt("designer: ").trim();
  if (designer) {
    const designerUrl = prompt("designer www: ").trim();
    post["icon-designer"] = designer;
    post["icon-designer-url"] = designerUrl;
  }

  const tags = prompt("tags (space separated): ").trim();
  if (tags) {
    post["tags"] = tags;
  }

  console.log("\n", post);

  const order = [
    "title",
    "slug",
    "date",
    "category",
    "itunes-url",
    "app-developer",
    "app-developer-url",
    "icon-designer",
    "icon-designer-url",
    "tags"
  ];

  console.log("----> Done.".yellow);
}

/**
 * Get the id of the project based on the current working directory
 * @return {String} - Project id, i.e. ios, macos, or watchos
 */
function getProjectId() {
  const reg = /.*\/(.*)icongallery.com\//;
  const id = reg.test(__dirname) ? reg.exec(__dirname)[1] : "";
  if (!id) {
    console.error(
      "----> Error: Couldn’t get `projectId` from working directory.".red
    );
    process.exit();
  }

  return id;
}

function promptForItunesInfo() {
  const input = prompt("iTunes URL: ").trim().replace(/\?.*$/, ""); // remove any query string on the end

  const isItunes = /^(http|https):\/\/itunes.apple.com/;
  const hasId = /\/id([\d]+)/;
  const isValid = isItunes.test(input) && hasId.test(input);

  if (isValid) {
    return {
      itunesUrl: input,
      itunesId: hasId.exec(input)[1]
    };
  } else {
    console.log(
      `Please enter a valid iTunes URL, i.e. \`https://itunes.apple.com/us/app/angry-birds/id343200656\``
        .yellow
    );
    promptForItunesInfo();
  }
}

async function queryItunes(itunesId) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}`);
  const json = await res.json();
  const icon = json.results[0];

  // Validate we got something we want...
  if (!(icon && icon.artworkUrl512)) {
    console.log(json);
    console.error("iTunes API returned unexpected response".red);
    process.exit();
  }

  return icon;
}
