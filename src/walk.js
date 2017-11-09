var walk = function (dir) {
  var results = []
  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file))
    } else {
      results.push(file)
    }
  })
  return results
}

// array = walk('public') 将会列出 public 目录下所有的文件