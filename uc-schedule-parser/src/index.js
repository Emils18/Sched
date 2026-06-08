const fs = require('fs');
const jsObfuscator = require('javascript-obfuscator');
const htmlMinifier = require('html-minifier');

let html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script(?![^>]*type="module")>([\s\S]*?)<\/script>/i;
const match = html.match(scriptRegex);
if (!match) {
    console.error('Main script not found');
    process.exit(1);
}
const originalScript = match[1];
const obfuscated = jsObfuscator.obfuscate(originalScript, {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    renameGlobals: false,
    selfDefending: false
}).getObfuscatedCode();

let newHtml = html.replace(scriptRegex, `<script>${obfuscated}</script>`);

const blocker = `<script>
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.onkeydown = e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
    }
};
</script>`;
newHtml = newHtml.replace('</head>', `${blocker}</head>`);

const minified = htmlMinifier.minify(newHtml, {
    removeComments: true,
    collapseWhitespace: true,
    minifyCSS: true
});

if (!fs.existsSync('dist')) fs.mkdirSync('dist');
fs.writeFileSync('dist/index.html', minified);
console.log('✅ Protected frontend created in dist/');