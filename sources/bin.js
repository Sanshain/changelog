//@ts-check

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const changelog = require('changelog');

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
else {
    const filters = process.argv.filter(w => w.startsWith('--filter='))    

    if (!filters.length) changeLog()
    else {
        changeLog({ filter: filters.map(w => new RegExp(w.slice(9))), titled})
    }
}

/**
 * @param {string} remoteAddress
 */
function generateInitialLog(remoteAddress) {
    if (remoteAddress.startsWith('git')) {
        remoteAddress = remoteAddress.replace('git@github.com:', '').replace('.git', '')
    }
    const store = changelog.generate(remoteAddress);
    if ('then' in store) {
        store.then(data => {
            //With npm each "version" corresponds to all changes for that build pushed on npm
            //With github each "version" is one GMT day of changes
            data.versions.forEach(function (version) {
                console.log(version.version); //currently npm projects only
                console.log(version.date); //JS Date


                //version.changes is an array of commit messages for that version
                version.changes.forEach(function (change) {
                    console.log(' * ' + change);
                });
            });

            //Information about the project
            console.log(data.project);
        });
    }
    else {
        console.log(store);
        return false;
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

