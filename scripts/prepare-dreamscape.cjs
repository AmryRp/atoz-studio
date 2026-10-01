const sharp = require('../.tools/node_modules/sharp');
const input = process.argv[2];
(async () => {
 await sharp(input).resize(1920, 1080, {fit:'cover'}).webp({quality:80}).toFile('public/portfolio/dreamscape-desktop.webp');
 await sharp(input).resize(860, 1100, {fit:'cover',position:'centre'}).webp({quality:76}).toFile('public/portfolio/dreamscape-mobile.webp');
})();
