//@ts-check

const CHANGELOG_FILE = 'CHANGELOG.md'
const TITLE = '# changelog'

const fs = require('fs');

/**
 * 
 * @param {{ legacyLog?: string, changelogFilename?: string }} options
 * @returns {string}
 */
exports.linesToTitles = function linesToTitles({ legacyLog, changelogFilename}) {

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
}

/**
 *
 * @param {{ legacyLog?: string, changelogFilename?: string }} options
 * @returns {string}
 */
exports.titlesToLines = function titlesToLines({ legacyLog, changelogFilename}) {

    legacyLog = legacyLog || fs.readFileSync(changelogFilename || CHANGELOG_FILE).toString();

    const lines = legacyLog.split('## ').filter(Boolean);
    const content = lines.map(log => {
        if (log.trim() === TITLE) return TITLE;
        const _lines = log.split('\n')
        const verInfo = _lines[0].trim()
        const sublogs = _lines.filter(p => p.startsWith(' - ')).map(p => p.slice(3)).join('. ')
        return `**${verInfo}** - ${sublogs}`;
    }).join('\n\n');

    changelogFilename && fs.writeFileSync(changelogFilename || CHANGELOG_FILE, content);

    return content
}
