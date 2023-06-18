#!/usr/bin/env node

'use strict';

var require$$0 = require('fs');
var require$$1 = require('child_process');
var require$$2 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);

var bin = {};

var sources = {};

//@ts-check

const fs = require$$0__default["default"];
const { execSync: execSync$1 } = require$$1__default["default"];
const path = require$$2__default["default"];


const CHANGELOG = path.join(process.cwd(), 'CHANGELOG.md');

const PACKAGE_PATH = path.join(process.cwd(), 'package.json');


const packageConfig = fs.readFileSync(PACKAGE_PATH).toString();


/**
 * 
 * @param {RegExp | RegExp[]} [filter] : optional filter;
 */
sources.default = function changeLog(filter) {

    var [lastVer, lastLog, content] = getLastVer();

    const packageInfo = JSON.parse(packageConfig);
    if (packageInfo.version !== lastVer) {
        const log = execSync$1('git log --oneline').toString();
        let lines = log.split('\n')
            .map(title => title.replace(/\([\s\S]+\)/, ''))                             // remove current branch name
            .map(line => line.split(' ').slice(1).join(' '))                            // remove commit hash
            .filter(w => !w.match(/(readme|merge branch|npmignore|gitignore)/i))        // remove service commits by specifying keywords
            .filter(title => !title.match(/^[\w\d\-_]+$/m))                             // remove one-word commits as useless info
            .filter(title => title.length > 6);                                          // remove too short commit names as useless

        if (filter) {
            if (filter instanceof RegExp) {
                lines = lines.filter(title => !title.match(filter));
            }
            else if (Array.isArray(filter)) {
                lines = filter.reduce((acc, f) => acc.filter(title => !title.match(f)), lines);                
            }
        }

        let newLog = '';
        for (const line of lines) {
            if (lastLog?.split('. ')[0] == line) break;
            newLog += line + '. ';
        }

        if (newLog) {
            console.log('CHANGELOG updated');
            fs.writeFileSync(CHANGELOG, `${packageInfo.version} - ${newLog}\n` + content);
        }
    }
};



function getLastVer() {
    if (fs.existsSync(CHANGELOG)) {
        const log = fs.readFileSync(CHANGELOG).toString();
        const lastVerInfo = log.split('\n')[0];
        const verInfo = lastVerInfo.match(/(?<ver>\d+.\d+.\d+)b? - (?<log>[\s\S]+)/);
        if (verInfo) {
            return [verInfo.groups?.ver, verInfo.groups?.log, log];
        }
    }
    return [];
}

//@ts-check

const { default: changeLog } = sources;
const {execSync} = require$$1__default["default"];



if (~process.argv.indexOf('--config')) {

    const fs = require$$0__default["default"];
    const path = require$$2__default["default"];

    const PACKAGE_PATH = path.join(process.cwd(), 'package.json');        
    const packageInfo = JSON.parse(fs.readFileSync(PACKAGE_PATH).toString());

    if (!packageInfo?.scripts['changelog']) packageInfo.scripts['changelog'] = "changelog";
    if (!packageInfo['simple-git-hooks']) {
        packageInfo['simple-git-hooks'] = { "pre-push": "npm run changelog" };
    }    
    fs.writeFileSync(PACKAGE_PATH, JSON.stringify(packageInfo, null, 2));

    
    
    
    const gitConfigured = execSync('git config core.hooksPath .git/hooks/').toString();
    console.log(gitConfigured);



    try {
        const hooksConfigured = execSync('npx simple-git-hooks').toString();
        console.log(hooksConfigured);
    }
    catch (er) {
        if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
            console.log(execSync('pnpm i -D simple-git-hooks').toString());
        }
        else {
            console.log(execSync('npm i -D simple-git-hooks').toString());
        }

        const hooksConfigured = execSync('npx simple-git-hooks').toString();
        console.log(hooksConfigured);
    }
}
else {
    const filters = process.argv.filter(w => w.startsWith('--filter='));
    if (!filters.length) changeLog();
    else {
        changeLog(filters.map(w => new RegExp(w.slice(9))));
    }
}

module.exports = bin;
