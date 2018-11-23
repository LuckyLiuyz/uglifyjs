
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const compasspath = path.resolve(__dirname,"../js");
 
/**
 * @method node命令，遍历指定目录下的所有JS文件并压缩。
 */
(function uglifyjsFun(compasspath){
    files = fs.readdirSync(compasspath);
    console.log("files",files);
    files.forEach(function(item){
        var newPath =  path.resolve(compasspath, item);
        console.log("newPath",newPath);
        if(fs.statSync(newPath).isDirectory()){
            console.log("isDirectory")
            uglifyjsFun(newPath); // 递归
        }else if(path.extname(newPath) == ".js"){ 
            console.log("newPath.extname",newPath);
            var newName = newPath.replace(".js", ""); 
            // 执行 “ uglifyjs demo.js -m -o demo.min.js” 实现将demo.js 压缩混淆 并将结果输出到demo.min.js
            cp.exec(`uglifyjs ${newPath} -m -o ${newName}.min.js`, function(error, stdout, stderr) {
                if(error !== null){
                    console.log("execFile error" + error);
                } else { 
                    console.log("execFile success");
                }
            }); 
        }  
    })
})(compasspath);
