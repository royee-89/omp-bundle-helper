const compressing = require('compressing')

const path = './'
const filename = 'UYUN-Asset-V2.0.R18.31.3-noarch-patch'
const tarSuffix = '.tar'
const gzSuffix = '.gz'
async function packGz(filename) {
    await compressing.gzip.compressFile(filename, filename + gzSuffix)
}

packGz(path + filename + tarSuffix)

// async function packTar(filename) {
//     await compressing.tar.compressFile(filename, filename + tarSuffix)
// }

// packTar(path + filename)
