# uglifyjs 实现JS文件混淆压缩（暂未支持ES6语法）
## 步骤如下：
### 1、自行搭建node环境，搭建成功后，查看npm 、 node版本信息。如果正常显示相应版本号，即表示安装成功！
/**
 *  ![image](https://github.com/Happy-LYZ/uglifyjs/blob/master/src/assets/img/npm.jpg)
 *  ![image](https://github.com/Happy-LYZ/uglifyjs/blob/master/src/assets/img/node.jpg)
 */
 
 ```node
 node -v;  //本示例，使用的node版本为：v8.11.4
 npm -v ;  //本示例，使用的npm版本为：v3.10.10
  ```


### 2、全局安装uglifyjs：
/**
  * ![image](https://github.com/Happy-LYZ/uglifyjs/blob/master/src/assets/img/uglifyjs.jpg)
  */
  
 ```node
 npm i -g uglifyjs;  //请注意，一定要全局安装！本示例，使用的uglifyjs版本为：v2.4.11
  ```

### 3、执行runNode命令，通过node指令实现JS压缩，将【原JS文件】压缩为【原JS文件.min.js】：

![image](https://github.com/Happy-LYZ/uglifyjs/blob/master/src/assets/img/runNode.jpg)

 ```node
 npm run runNode;  
  ```


### 4、执行runBat命令，通过bat脚本实现JS压缩，将【原JS文件】压缩后覆盖【原JS文件】：

![image](https://github.com/Happy-LYZ/uglifyjs/blob/master/src/assets/img/runBat.jpg)

 ```node
 npm run runBat;  
  ```

# 以上，祝好！
