// Goes through every post and adds or appennds a redirect for the old
// style of `/SLUG-YYYYMMDD/` permalinks
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "../../");
const postsDir = path.join(baseDir, "_posts");
const postsDirTarget = path.join(baseDir, "_posts");

let counter = 0;

fs.readdirSync(postsDir)
  .filter(filename => filename.endsWith(".md"))
  .forEach(filename => {
    let fileout = fs.readFileSync(path.join(postsDir, filename)).toString();

    const lines = fileout.split("\n");

    const date = lines
      .filter(line => line.startsWith("date:"))[0]
      .split(":")[1]
      .trim()
      .replace(/-/g, "");

    const slug = lines
      .filter(line => line.startsWith("slug:"))[0]
      .split(":")[1]
      .trim();

    const regex = /redirectFrom:/g;

    // If there are redirects already, add a new one.
    // Otherwise, add a new `redirectFrom:` key with value at end of file
    if (regex.test(fileout)) {
      fileout = fileout.replace(
        /redirectFrom:/,
        `redirectFrom:\n  - /${slug}-${date}/`
      );
    } else {
      let i = 0;
      fileout = fileout.replace(/---/g, match => {
        i++;
        return i === 2 ? `redirectFrom:\n  - /${slug}-${date}/\n---` : match;
      });
    }

    // console.log(fileout);
    fs.writeFileSync(path.join(postsDirTarget, filename), fileout);
  });
