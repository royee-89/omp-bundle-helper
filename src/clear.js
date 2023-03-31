const fs = require('fs')
const { target, source } = require('./macro')
const { removeDir, buildDir } = require('./utils')

const args = process.argv.slice(2)[0];
// console.log('参数：\n', args)

const dir = {
    'target': target,
    'source': source
}[args];

removeDir(dir)
buildDir()
