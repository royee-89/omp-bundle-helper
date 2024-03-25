const compressing = require('compressing')
const fs = require('fs')
let readline = require('readline')
const { buildDir, unpack, getTarGzList, Log } = require('./utils')
const { source } = require('./macro')
buildDir()
const targzList = getTarGzList(source)
// let selected = null
let next = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

if(targzList.length === 0) {
    Log.warning('没有获取到可以解压缩的文件', 'EMPTY')
    next.close()
} else {
    Log.default('', '======== 请选择需要解压缩的文件序号：========')
    targzList.forEach((targz: string, index: any) => {
        Log.default(targz, index + 1)
    })
    Log.warning(' 输入序号(回车确认) ', 'TIPS')
}

next.on('line', function(line: any) {
    if (!isNaN(Number(line))) {
        unpack(targzList[Number(line) - 1], ()=> {
            next.close()
        })
    }
})
