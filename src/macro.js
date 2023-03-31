const BG = '4'
const FONT = '3'
const BLACK = '0'
const RED = '1'
const GREEN = '2'
const YELLOW = '3'
const BLUE = '4'
const PURPLE = '5'
const DARKGREEN = '6'
const WHITE = '7'
const prefix = '\033['
const suffix = '\033[0m'
// 根目录
const root = './'
// 目标目录
const target = './targets/'
// 原始包目录
const source = './sources/'
// 忽略文件目录
const ignoreList = [
    'node_modules', 
    'src', 
    'build',
    'sources',
    'targets'
]
// 报错类型
const type = {
    DEFAULT: 4,
    ERROR: 0,
    SUCCESS: 1,
    INFO: 2,
    WARNING: 3
}
// 颜色tag
const color = [
    // error
    {
        tag: colorAssembled(RED, WHITE),
        content: colorAssembled(BLACK, RED)
    },
    // success
    {
        tag: colorAssembled(GREEN, WHITE),
        content: colorAssembled(BLACK, GREEN)
    },
    // info
    {
        tag: colorAssembled(BLUE, WHITE),
        content: colorAssembled(BLACK, BLUE)
    },
    // warning
    {
        tag: colorAssembled(YELLOW, WHITE),
        content: colorAssembled(BLACK, YELLOW)
    },
    // default
    {
        tag: colorAssembled(WHITE, BLACK),
        content: colorAssembled(BLACK, WHITE)
    }
]

module.exports = {
    prefix: prefix,
    suffix: suffix,
    root: root,
    source: source,
    target: target,
    type: type,
    color: color,
    ignoreList: ignoreList
}

/**
 * @description 组装提示颜色
 * @param Enmu backgroundColor 
 * @param Enmu fontColor 
 * @returns 
 */
function colorAssembled(backgroundColor = BLACK, fontColor = WHITE) {
    return BG + backgroundColor + ';' + FONT + fontColor + 'm '
}
