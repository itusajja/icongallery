const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../../');
const postsDir = path.join(baseDir, '_posts');
const postsDirTarget = path.join(baseDir, '_posts');
const imgsDir = path.join(baseDir, 'img');

let counter = 0;

fs.readdirSync(postsDir)
  .filter(filename => filename.endsWith('.md'))
  .forEach(filename => {
    
    let fileout = "";

    const lines = fs.readFileSync(path.join(postsDir, filename)).toString().split('\n');

    const date = lines.filter(line => line.startsWith('date:'))[0].split(':')[1].trim();
    const dateYear = (new Date(date)).getFullYear();
    const slug = lines.filter(line => line.startsWith('slug:'))[0].split(':')[1].trim();

    let redirect = [`/${dateYear}/${slug}`];
    
    lines.forEach((line, i) => {
      // If it's the last line of the file, do nothing
      if (line === "" && i === lines.length - 1) {
        return;
      }

      // If it has a redirect, store it, then skip writing out this line
      // as we'll write it out later when we're at the end of the front-matter
      if (line.startsWith('redirect_from:')) {
        redirect.unshift(line.split(':')[1].trim());
        return;
      }

      // If last line of front-matter
      if (line === "---" && i !== 0) {
        fileout += `redirect_from:\n${redirect.map(r => `  - ${r}\n`).join('')}---\n`;
      } else {
        fileout += line + "\n";
      }
    });

    // Write the .md file changes
    // fs.writeFileSync(path.join(postsDirTarget, filename), fileout);

    // Find the img in every location and rewrite it
    ['_src', '128', '256', '512', '1024'].forEach(size => {
      const oldImgName = slug + "-" + dateYear + '.png';
      const oldImgPath = path.join(imgsDir, size, oldImgName);
      
      if (fs.existsSync(oldImgPath)) {
        const newImgName = slug + "-" + date + '.png';
        const newImgPath = path.join(imgsDir, size, newImgName);
        // console.log('rename', oldImgPath, newImgPath);
        fs.renameSync(oldImgPath, newImgPath);
        // console.log('Rename ' + imgPath);
        // fs.copyFileSync(imgPath, path.dirname(imgPath) + `/${date}-${slug}.png.TEST`);
      } else {
        // counter = counter + 1;
        // console.log('  - ', imgPath)
      }
    });
});
