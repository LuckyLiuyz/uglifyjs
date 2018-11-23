const child_process = require("child_process");
const path = require('path');


/**
 * @method node命令，执行bat脚本，在脚本内遍历指定目录下的所有JS文件并压缩。
 */
const aimPath = path.resolve(__dirname, './1.bat'); // 执行当前目录下的 1.bat 脚本 
child_process.execFile(aimPath, null,null,function(error,stdout,stderr){
    if(error !== null){
        console.log("execFile error" + error);
    } else { 
        console.log("execFile success");
    }
})
