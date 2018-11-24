# uglifyjs 实现JS文件混淆压缩

## 该工具产生的背景
前几天，不知什么原因，上级领导 *** 似的，要求将几年前的前端旧项目（AMD规范+Jquery）源码进行压缩混淆！  
顿时头顶一万头马狂奔而过 >_< ,这...这...这...  
得，那就做呗~该工具由此呱呱坠地~~~  
注：由于该工具是针对于老老老...式js代码，所以还未支持ES6语法。  
无伤大雅，用ES6语法的，相信已经选择了当下大火的Vue、React了，配合Webpack,怎一个爽字了得~~~  


## 步骤如下：
### 1、自行搭建node环境，搭建成功后，查看npm 、 node版本信息。如果正常显示相应版本号，即表示安装成功！
 ```node
 node -v;  //本示例，使用的node版本为：v8.11.4
 npm -v ;  //本示例，使用的npm版本为：v3.10.10
  ```


### 2、全局安装uglifyjs：
 ```node
 npm i -g uglifyjs;  //请注意，一定要全局安装！本示例，使用的uglifyjs版本为：v2.4.11
  ```

### 3、执行runNode命令，通过node指令实现JS压缩，将【原JS文件】压缩为【原JS文件.min.js】：

 ```node
 npm run runNode;  
  ```
![image](https://github.com/Happy-LYZ/uglifyjs/blob/master/src/assets/img/runNode.jpg)



### 4、执行runBat命令，通过bat脚本实现JS压缩，将【原JS文件】压缩后覆盖【原JS文件】：

 ```node
 npm run runBat;  
  ```
![image](https://github.com/Happy-LYZ/uglifyjs/blob/master/src/assets/img/runBat.jpg)


# 以上，祝顺利！
