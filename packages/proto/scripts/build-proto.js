const pbjs = require("protobufjs-cli/pbjs");
const pbts = require("protobufjs-cli/pbts");
const fs = require("fs");

const protoSrcPath =
    __dirname +
    "/../../../external/minipilot-proto/src";

const protoGenPath =
    __dirname +
    "/../gen";

const jsArgs = [
    "-t", "static-module",
    "-w", "commonjs",
    "-o", "gen/compiled.js",
    "-p", protoSrcPath,
    protoSrcPath + "/mp/link.proto"
];

const tsArgs = [
    "-o", "gen/compiled.d.ts",
    "gen/compiled.js"
];

fs.mkdirSync(protoGenPath);

pbjs.main(jsArgs, function(err) {
    if (err) throw err;
    pbts.main(tsArgs, function(err) {
        if (err) throw err;
        console.log("Protobuf compilation complete.");
    });
});
