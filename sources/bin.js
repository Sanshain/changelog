//@ts-check

const { default: changeLog } = require("./index.js");
const {execSync} = require('child_process');



if (~process.argv.indexOf('--config')) {

    const fs = require('fs');
    const path = require('path');

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
        if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
            console.log(execSync('pnpm i -D simple-git-hooks').toString())
        }
        else {
            console.log(execSync('npm i -D simple-git-hooks').toString())
        }

        const hooksConfigured = execSync('npx simple-git-hooks').toString();
        console.log(hooksConfigured);
    }
}
else {
    const filters = process.argv.filter(w => w.startsWith('--filter='))
    if (!filters.length) changeLog()
    else {
        changeLog(filters.map(w => new RegExp(w.slice(9))))
    }
}
