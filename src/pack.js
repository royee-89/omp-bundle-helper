const path = require('path')
let readline = require('readline')
const { getDirList, buildDir, pack, Log } = require('./utils')
const { root } = require('./macro')
buildDir()
// 获取当前文档中存在的目录
const dirs = getDirList(root)
// 选定打包目录
let selectedDir = null

let next = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

if(dirs.length === 0) {
    Log.warning('没有获取到需要打包的目录', 'EMPTY')
    next.close()
} else {
    Log.default('', '======== 请选择需要打包的目录序号：========')
    dirs.forEach((dir, index) => {
        Log.default(dir, index + 1)
    })
    Log.warning(' 输入序号(回车确认) ', 'TIPS')
}


next.on('line', function(line) {
    if (!isNaN(Number(line)) && !selectedDir) {
        selectedDir = dirs[Number(line) - 1]
        pack(selectedDir, true, (msg, fileName) => {
            Log.success(msg.content)
            Log.info(fileName, '压缩包路径')
            Log.success('打包完成', 'DONE')
            next.close()
        }, () => {
            next.close()
        })
    } 
    // 判断是和否可以忽略根目录进行打包
    // else if(selectedDir) {
    //     pack(selectedDir, line === 'y', () => {
    //         next.close()
    //     })
    // }
})



