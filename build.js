const fs = require("fs"); const path = require("path"); const { minify } = require("html-minifier");
let html = fs.readFileSync("index.html", "utf8");
const anti = `<script>document.addEventListener("contextmenu",e=>e.preventDefault());document.onkeydown=e=>{if(e.key==="F12"||(e.ctrlKey&&e.shiftKey)||(e.ctrlKey&&e.key.toLowerCase()==="u")){e.preventDefault();return false;}};setInterval(()=>{console.clear()},1000);<\/script>`;
html = html.replace(/<head>/i, `<head>${anti}`);
const result = minify(html, {collapseWhitespace:true,removeComments:true,minifyJS:true,minifyCSS:true,removeAttributeQuotes:true,removeOptionalTags:true,removeRedundantAttributes:true});
fs.writeFileSync("dist/index.html", result, "utf8"); console.log("✅ Protection complete - Minified + Anti-Inspect");
