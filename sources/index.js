
//@ts-check

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');


const CHANGELOG = path.join(process.cwd(), 'CHANGELOG.md');

const PACKAGE_PATH = path.join(process.cwd(), 'package.json');


const packageConfig = fs.readFileSync(PACKAGE_PATH).toString()


/**
 * 
 * @param {{
 *  filter?: RegExp | RegExp[]           // optional filter
 *  titled?: boolean
 * }} [options]
 */
exports.default = function changeLog(options) {

    options = options || {}

    const { filter, titled } = options;

    var [lastVer, lastLog, content] = getLastVer();

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

        if (titled) {
            for (const line of lines) {
                if (lastLog == line) break;
                newLog += ` - ${line}\n`
            }
        }
        else for (const line of lines) {
            if (lastLog?.split('. ')[0] == line) break;
            newLog += line + '. '
        }

        if (newLog) {
            console.log('CHANGELOG updated');
            if (titled) {
                fs.writeFileSync(CHANGELOG, `##${packageInfo.version} \n\n${newLog}\n` + (content || ''));
            }
            else {
                fs.writeFileSync(CHANGELOG, `${packageInfo.version} - ${newLog}\n` + (content || ''));
            }
        }
    }
}



/**
 * @param {boolean} [titled]
 */
function getLastVer(titled) {
    if (fs.existsSync(CHANGELOG)) {
        const log = fs.readFileSync(CHANGELOG).toString();
        const lastVerInfo = titled ? (_lastlog => _lastlog ? _lastlog.split('\n').filter(p => p.startsWith(' - '))[0].slice(3) : '')(log.split('##')[1]) : log.split('\n')[0]
        const verInfo = lastVerInfo.match(/(?<ver>\d+.\d+.\d+)b? - (?<log>[\s\S]+)/);
        if (verInfo) {
            return [verInfo.groups?.ver, verInfo.groups?.log, log];
        }
    }
    return [];
}

