#!/usr/bin/env node

'use strict';

var require$$1 = require('child_process');
var require$$0 = require('fs');
var require$$2 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);

var bin = {};

var sources = {};

//@ts-check

const fs$1 = require$$0__default["default"];
const { execSync: execSync$1 } = require$$1__default["default"];
const path$1 = require$$2__default["default"];


const CHANGELOG = path$1.join(process.cwd(), 'CHANGELOG.md');

const PACKAGE_PATH = path$1.join(process.cwd(), 'package.json');


const packageConfig = fs$1.readFileSync(PACKAGE_PATH).toString();


/**
 * 
 * @param {{
 *  filter?: RegExp | RegExp[]           // optional filter
 *  titled?: boolean
 * }} [options]
 */
sources.default = function changeLog(options) {

    options = options || {};

    const { filter, titled } = options;

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

        if (titled) {
            for (const line of lines) {
                if (lastLog == line) break;
                newLog += ` - ${line}\n`;
            }
        }
        else for (const line of lines) {
            if (lastLog?.split('. ')[0] == line) break;
            newLog += line + '. ';
        }

        if (newLog) {
            console.log('CHANGELOG updated');
            if (titled) {
                fs$1.writeFileSync(CHANGELOG, `##${packageInfo.version} \n\n${newLog}\n` + (content || ''));
            }
            else {
                fs$1.writeFileSync(CHANGELOG, `${packageInfo.version} - ${newLog}\n` + (content || ''));
            }
        }
    }
};



/**
 * @param {boolean} [titled]
 */
function getLastVer(titled) {
    if (fs$1.existsSync(CHANGELOG)) {
        const log = fs$1.readFileSync(CHANGELOG).toString();
        const lastVerInfo = titled ? (_lastlog => _lastlog ? _lastlog.split('\n').filter(p => p.startsWith(' - '))[0].slice(3) : '')(log.split('##')[1]) : log.split('\n')[0];
        const verInfo = lastVerInfo.match(/(?<ver>\d+.\d+.\d+)b? - (?<log>[\s\S]+)/);
        if (verInfo) {
            return [verInfo.groups?.ver, verInfo.groups?.log, log];
        }
    }
    return [];
}

//@ts-check

const { execSync } = require$$1__default["default"];
const fs = require$$0__default["default"];
const path = require$$2__default["default"];

const { default: changeLog } = sources;



const titled = process.argv.some(w => w.startsWith('--titled'));


if (~process.argv.indexOf('--config')) {    

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

        installPackage('simple-git-hooks');

        const hooksConfigured = execSync('npx simple-git-hooks').toString();
        console.log(hooksConfigured);
    }

}
else {
    const filters = process.argv.filter(w => w.startsWith('--filter='));    

    if (!filters.length) changeLog();
    else {
        changeLog({ filter: filters.map(w => new RegExp(w.slice(9))), titled});
    }
}

/**
 * @param {string} packageName
 */
function installPackage(packageName) {
    if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
        console.log(execSync('pnpm i -D ' + packageName).toString());
    }
    else {
        console.log(execSync('npm i -D ' + packageName).toString());
    }
}

module.exports = bin;
