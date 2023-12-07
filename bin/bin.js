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
 *  titled?: boolean,
 *  title?: string
 * }} [options]
 */
sources.default = function changeLog(options) {

    options = options || {};

    const { filter, titled } = options;
    const title = options.title || '';

    var [lastVer, lastLog, content] = getLastVer({titled, title});

    const packageInfo = JSON.parse(packageConfig);
    if (packageInfo.version !== lastVer) {
        const log = execSync$1('git log --oneline').toString();
        let lines = log.split('\n')
            .map(title => title.replace(/\([\s\S]+\)/, ''))                                         // remove current branch name
            .map(line => {                                                                          // remove commit hash
                const commitInfo = line.split(' ');
                const commitName = commitInfo.slice(1).join(' ');
                const hash = commitInfo[0];
                return { commitName, hash };
            })                            
            .filter(ci => !ci.commitName.match(/(readme|merge branch|npmignore|gitignore)/i))       // remove service commits by specifying keywords
            .filter(ci => !ci.commitName.match(/^[\w\d\-_]+$/m))                                    // remove one-word commits as useless info
            .filter(ci => ci.commitName.length > 6)                                                 // remove too short commit names as useless
            .map(ci => ci.commitName);

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
            const title = options.title || '# changelog\n\n';
            if (titled) {
                fs$1.writeFileSync(CHANGELOG, title + `## ${packageInfo.version} \n\n${newLog}\n` + (content || ''));
            }
            else {
                fs$1.writeFileSync(CHANGELOG, title + `**${packageInfo.version}** - ${newLog}\n` + (content || ''));
            }
        }
    }
};



/**
 * @param {{
 *  titled?: boolean,
 *  title?: string
 * }} [options]
 */
function getLastVer(options) {

    const { title, titled } = options || {};

    if (fs$1.existsSync(CHANGELOG)) {
        
        let log = fs$1.readFileSync(CHANGELOG).toString();
        log = log.replace(title || /^# changelog/, '');

        const lastVerInfo = titled ? log.split('## ')[1] : log.split('\n')[0];
        if (titled) {
            if (lastVerInfo) {
                const lastVerLines = lastVerInfo.split('\n');
                const lastVer = lastVerLines[0].trim();
                const lastlog = lastVerLines.filter(p => p.startsWith(' - '))[0].slice(3);
                return [lastVer, lastlog, log.trim()]
            }
        }
        else {
            const verInfo = lastVerInfo.match(/(\*\*)?(?<ver>\d+.\d+.\d+)b?(\*\*)? - (?<log>[\s\S]+)/);
            if (verInfo) {
                return [verInfo.groups?.ver, verInfo.groups?.log, log.trim()];
            }
        }
    }
    return [];
}

var convert = {};

var hasRequiredConvert;

function requireConvert () {
	if (hasRequiredConvert) return convert;
	hasRequiredConvert = 1;
	//@ts-check

	const CHANGELOG_FILE = 'CHANGELOG.md';
	const TITLE = '# changelog';

	const fs = require$$0__default["default"];

	/**
	 * 
	 * @param {{ legacyLog?: string, changelogFilename?: string }} options
	 * @returns {string}
	 */
	convert.linesToTitles = function linesToTitles({ legacyLog, changelogFilename}) {

	    legacyLog = fs.readFileSync(changelogFilename || CHANGELOG_FILE).toString();

	    const lines = legacyLog.split('\n').filter(Boolean);
	    const content = lines.map(line => {
	        if (line == TITLE) {
	            return line;
	        }
	        const verInfo = line.match(/(\*\*)?(?<ver>\d+.\d+.\d+)b?(\*\*)? - (?<log>[\s\S]+)/);
	        return `## ${verInfo?.groups?.ver}\n\n${verInfo?.groups?.log.split('. ').filter(Boolean).map(c => ' - ' + c).join('\n')}`;
	    }).join('\n\n');

	    changelogFilename && fs.writeFileSync(changelogFilename || CHANGELOG_FILE, content);

	    return content;
	};

	/**
	 *
	 * @param {{ legacyLog?: string, changelogFilename?: string }} options
	 * @returns {string}
	 */
	convert.titlesToLines = function titlesToLines({ legacyLog, changelogFilename}) {

	    legacyLog = legacyLog || fs.readFileSync(changelogFilename || CHANGELOG_FILE).toString();

	    const lines = legacyLog.split('## ').filter(Boolean);
	    const content = lines.map(log => {
	        if (log.trim() === TITLE) return TITLE;
	        const _lines = log.split('\n');
	        const verInfo = _lines[0].trim();
	        const sublogs = _lines.filter(p => p.startsWith(' - ')).map(p => p.slice(3)).join('. ');
	        return `**${verInfo}** - ${sublogs}`;
	    }).join('\n\n');

	    changelogFilename && fs.writeFileSync(changelogFilename || CHANGELOG_FILE, content);

	    return content
	};
	return convert;
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
        packageInfo['simple-git-hooks'] = {
            [~process.argv.indexOf('--pre-commit') ? "pre-commit" : "pre-push"]: "npm run changelog",
            // "pre-push": "npm run changelog"
        };

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
else if (~process.argv.indexOf('--convert')) {
    
    const changelogFilename = path.join(process.cwd(), 'CHANGELOG.md');

    if (~process.argv.indexOf('--titled')) {
        const { linesToTitles } = requireConvert();
        linesToTitles({ changelogFilename });
    }
    else if (~process.argv.indexOf('--lined')) {
        const { titlesToLines } = requireConvert();
        titlesToLines({ changelogFilename });
    }
}
else {
    const filters = process.argv.filter(w => w.startsWith('--filter='));    

    if (!filters.length) changeLog({titled});
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
