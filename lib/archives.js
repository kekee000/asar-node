const { existsSync, statSync } = require('./fs/index.js')
const path = require('path')

class Archives {
  constructor () {
    this._archives = new Map()
    this._lookups = new Set()
  }

  _addArchive (archivePath) {
    if (existsSync(archivePath) && statSync(archivePath).isFile()) {
      this._archives.set(archivePath, 1)
      if (archivePath.endsWith('node_modules.asar')) {
        this._lookups.add(archivePath.slice(0, -5))
      }
    } else {
      throw new Error(`Archive not found or is not a file: ${archivePath}`)
    }
  }

  loadArchives (paths) {
    if (!Array.isArray(paths)) {
      throw new TypeError('Archives paths should be an array of strings')
    }
    for (const asarPath of paths) {
      if (asarPath.includes('*.asar')) {
        require('fast-glob').sync(asarPath, { onlyFiles: true }).forEach((resolvedPath) => {
          this._addArchive(path.resolve(resolvedPath))
        })
      } else {
        this._addArchive(path.resolve(asarPath))
      }
    }
  }

  isArchive (archivePath) {
    return this._archives.has(archivePath)
  }

  isLookup (lookupPath) {
    return this._lookups.has(lookupPath)
  }
}

exports.archives = new Archives()
