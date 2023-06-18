
//@ts-check

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');


const CHANGELOG = path.join(process.cwd(), 'CHANGELOG.md');

const PACKAGE_PATH = path.join(process.cwd(), 'package.json');


const packageConfig = fs.readFileSync(PACKAGE_PATH).toString()


/**
 * 
 * @param {RegExp | RegExp[]} [filter] : optional filter;
 */
exports.default = function changeLog(filter) {

    var [lastVer, lastLog] = getLastVer();

    const packageInfo = JSON.parse(packageConfig)
    if (packageInfo.version !== lastVer) {
        const log = execSync('git log --oneline').toString();
        let lines = log.split('\n')
            .map(title => title.replace(/\([\s\S]+\)/, ''))                             // remove current branch name
            .map(line => line.split(' ').slice(1).join(' '))                            // remove commit hash
            .filter(w => !w.match(/(readme|merge branch|npmignore|gitignore)/i))        // remove service commits by specifying keywords
            .filter(title => !title.match(/^[\w\d\-_]+$/m))                             // remove one-word commits as useless info
            .filter(title => title.length > 6)                                          // remove too short commit names as useless

        if (filter) {
            if (filter instanceof RegExp) {
                lines = lines.filter(title => !title.match(filter))
            }
            else if (Array.isArray(filter)) {
                lines = filter.reduce((acc, f) => acc.filter(title => !title.match(f)), lines)                
            }
        }

        let newLog = ''
        for (const line of lines) {
            if (lastLog == line) break;
            newLog += line + '. '
        }

        if (newLog) {
            console.log('CHANGELOG updated');
            fs.writeFileSync(CHANGELOG, `${packageInfo.version} - ${newLog}\n` + log);
        }
    }
}



function getLastVer() {
    if (fs.existsSync(CHANGELOG)) {
        const log = fs.readFileSync(CHANGELOG).toString();
        const lastVerInfo = log.split('\n')[0]
        const verInfo = lastVerInfo.match(/(?<ver>\d+.\d+.\d+)b? - (?<log>[\s\S]+)/);
        if (verInfo) {
            return [verInfo.groups?.ver, verInfo.groups?.log];
        }
    }
    return [];
}

