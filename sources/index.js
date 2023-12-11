
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
 *  titled?: boolean,
 *  title?: string
 * }} [options]
 */
exports.default = function changeLog(options) {

    options = options || {}

    const { filter, titled } = options;
    const title = options.title || ''

    var [lastVer, lastLog, content] = getLastVer({titled, title});

    const packageInfo = JSON.parse(packageConfig)
    if (packageInfo.version !== lastVer) {
        const log = execSync('git log --oneline').toString();
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
            .map(ci => ci.commitName)

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
            const title = options.title || '# changelog\n\n';
            if (titled) {
                fs.writeFileSync(CHANGELOG, title + `## ${packageInfo.version} \n\n${newLog}\n` + (content || ''));
            }
            else {
                fs.writeFileSync(CHANGELOG, title + `**${packageInfo.version}** - ${newLog}\n\n` + (content || ''));
            }
        }
    }
}



/**
 * @description 
 * @param {{
 *  titled?: boolean,
 *  title?: string
 * }} [options]
 */
function getLastVer(options) {

    const { title, titled } = options || {};

    if (fs.existsSync(CHANGELOG)) {
        
        let log = fs.readFileSync(CHANGELOG).toString();
        log = log.replace(title || /^# changelog\s+/, '');

        const lastVerInfo = titled ? log.split('## ')[1] : log.split('\n')[0];
        if (titled) {
            if (lastVerInfo) {
                const lastVerLines = lastVerInfo.split('\n')
                const lastVer = lastVerLines[0].trim();
                const lastlog = lastVerLines.filter(p => p.startsWith(' - '))[0].slice(3);
                return [lastVer, lastlog.replace('\r', ''), log.trim()]
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

