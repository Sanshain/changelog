//@ts-check

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { default: changeLog } = require("./index.js");



const titled = process.argv.some(w => w.startsWith('--titled'))


if (~process.argv.indexOf('--config')) {    

    const PACKAGE_PATH = path.join(process.cwd(), 'package.json');        
    const packageInfo = JSON.parse(fs.readFileSync(PACKAGE_PATH).toString());

    if (!packageInfo?.scripts['changelog']) packageInfo.scripts['changelog'] = "changelog"
    if (!packageInfo['simple-git-hooks']) {
        packageInfo['simple-git-hooks'] = { "pre-push": "npm run changelog" }
    }    
    fs.writeFileSync(PACKAGE_PATH, JSON.stringify(packageInfo, null, 2))

    
    
    
    const gitConfigured = execSync('git config core.hooksPath .git/hooks/').toString()
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
        const { linesToTitles } = require('./convert')
        linesToTitles({ changelogFilename })
    }
    else if (~process.argv.indexOf('--lined')) {
        const { titlesToLines } = require('./convert')
        titlesToLines({ changelogFilename })
    }
}
else {
    const filters = process.argv.filter(w => w.startsWith('--filter='))    

    if (!filters.length) changeLog({titled})
    else {
        changeLog({ filter: filters.map(w => new RegExp(w.slice(9))), titled})
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

