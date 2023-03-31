/**
 * @description 打包工具方法
 * @author yehx
 * 
 */
const fs = require('fs')
const compressing = require('compressing')
const { 
    prefix,
    suffix,
    root,
    source,
    target,
    type,
    color,
    ignoreList
 } = require('./macro')

/**
 * 
 */
class Log {
    constructor(content, tag = '') {
        write(type.DEFAULT, {tag, content})
    }
    static success = function(content, tag = 'SUCCESS') { write(type.SUCCESS, {tag, content}) }
    static error = function(content, tag = 'ERROR') { write(type.ERROR, {tag, content}) }
    static default = function(content, tag = '') { write(type.DEFAULT, {tag, content}) }
    static warning = function(content, tag = 'WARNING') { write(type.WARNING, {tag, content}) }
    static info = function(content, tag = 'INFO') { write(type.INFO, {tag, content}) }
}

function buildDir() {
    try {
        fs.mkdirSync(source)
        Log.success(source + '目录创建成功')
    } catch (err) {
        Log.warning(err)
    }
    try {
        fs.mkdirSync(target)
        Log.success(target + '目录创建成功')
    } catch(err) {
        Log.warning(err)
    }
}

/**
 * @description 解压缩包
 * @param String filename 
 */
async function unpack(filename, callback) {
    const realname = filename.replace(/.tar.gz/g, '')
    if(fs.existsSync(source + realname)) {
        removeDir(source + realname)
    }
    Log.warning(filename + ' 解压缩中...')
    await compressing.gzip.uncompress(source + filename, source + realname + '.tar')
    Log.success(filename + ' 解压缩完成！')
    Log.warning(realname + '.tar 解压缩中...')
    await compressing.tar.uncompress(source + realname + '.tar', root + realname)
    Log.success(realname + 'tar 解压缩完成！' )
    const delFileName = source + realname + '.tar'
    Log.warning('中间文件 ' + realname + '.tar 删除中...')

    try{
        const res = await deleteFile(delFileName, 
            { 
               content: delFileName + ' 删除成功！'
            },
            {
                tag: 'ERROR', content: '删除文件失败' + delFileName
            }
        )
        Log.success(res.content)
    } catch (err) {
        write(type.ERROR, err)
    }
    Log.success('解压缩完成', 'DONE')
    callback && callback()
}

/**
 * @description 打包
 * @param String path 
 * @param Boolean ignoreBase 
 * @param Function callback 
 * @param Function errback 
 */
async function pack(dirname, ignoreBase = true, callback, errback) {
    const path = root + dirname
    const targetPath = target + dirname
    Log.info(path,'打包路径' )
    Log.warning('tar文件 打包中...', 'LOADING')
    await compressing.tar.compressDir(path, targetPath + '.tar', {
        ignoreBase
    })
    Log.success(targetPath + '.tar 生成成功！' )
    Log.warning('tar.gz文件 打包中...', 'LOADING')
    await compressing.gzip.compressFile(targetPath + '.tar', targetPath + '.tar.gz')
    Log.success(targetPath + '.tar.gz 生成成功！')
    try{
        const processRes = await deleteFile(targetPath + '.tar', 
            { content: targetPath + '.tar 删除成功！'},
            { content: '删除文件失败' + targetPath + '.tar' }
        )
        callback && callback(processRes, targetPath + '.tar.gz')
    } catch (err) {
        Log.error(err.content)
        errback()
    }
}

/**
 * @description 获取输入颜色字符串
 * @param Enmu type 
 * @param Object param1 
 * @param Boolean isReverse 
 * @returns 
 */
function getOutStr(type, { tag = '', content = '' }) {
    const colorPlate = color[type]
    if(tag === '') {
        return `${prefix}${colorPlate.content} ${content} ${suffix} \n`
    }
    return `${prefix}${colorPlate.tag}${tag} ${prefix}${colorPlate.content} ${content} ${suffix} \n`
}

/**
 * @description 清空当前行控制台输出颜色log
 * @method cleanThenWrite
 * @param Enmu type 
 * @param Object content 
 * @param Boolean isReverse 
 */
function cleanThenWrite(type, content) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    write(type, content)
}

/**
 * @description 控制台输出颜色log
 * @method write
 * @param Enmu type 
 * @param Object content 
 * @param Boolean isReverse 
 */
function write(type, content) {
    process.stdout.write(getOutStr(type, content))
}

/**
 * @description 删除指定文件
 * @method deleteFile
 * @param String fileName
 * @param Object successMsg 
 * @param Object errorMsg 
 * @returns 
 */
function deleteFile(fileName, successMsg, errorMsg) {
    return new Promise((resolve, reject) => {
        fs.unlink(fileName, (err) => {
            if(err) {
                reject(errorMsg, err)
                return
            }
            resolve(successMsg)
        })
    })
}

/**
 * @description 获取目标目录下的目录列表
 * @method getDirList
 * @param {*} dir 
 * @returns 
 */
function getDirList(dir) {
    const files = fs.readdirSync(dir);
    return files.reduce((cur, next) => {
        const isDir = fs.lstatSync(dir + next).isDirectory();
        if(!ignoreList.includes(next) && isDir) {
            cur.push(next)
        }
        return cur
    }, [])
}

/**
 * @description 获取tar.gz文件列表
 * @param {*} dir 
 * @returns 
 */
function getTarGzList(dir) {
    const files = fs.readdirSync(dir);
    return files.reduce((cur, next) => {
        const isDir = fs.lstatSync(dir + next).isDirectory();
        if(!ignoreList.includes(next) && !isDir && /.tar.gz$/g.test(next)) {
            cur.push(next)
        }
        return cur
    }, [])
}

/**
 * @description 删除指定目录
 * @method removeDir
 * @param String target 
 */
function removeDir(target) {
    try {
        const files = fs.readdirSync(target)
        for (const file of files) {
            if (fs.lstatSync(target + '/' + file).isDirectory()){
                removeDir(target + '/' + file)
            } else {
                fs.unlinkSync(target + '/' + file)
            }
        }
        fs.rmdirSync(target)
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    cleanThenWrite: cleanThenWrite,
    Log: Log,
    removeDir: removeDir,
    deleteFile: deleteFile,
    getDirList: getDirList,
    getTarGzList: getTarGzList,
    getOutStr: getOutStr,
    pack:pack,
    unpack:unpack,
    buildDir: buildDir
} 