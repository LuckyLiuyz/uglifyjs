:: 开始...
@echo off

:: 千万注意， %cd% 指的是，当前dos窗口中执行命令时所在的路径， 并不是该bat文件所在的路径！！！！！！
:: 设置压缩JS文件的根目录，脚本会自动按树层次查找和压缩所有的JS
SET JSFOLDER= %cd%\src\js
echo 正在查找JS文件
:: 改变当前目录到 %JSFOLDER%
chdir /d %JSFOLDER%
:: for /r 递归遍历每个目录，执行for语句; “.”表示当前目录
for /r . %%a in (*.js) do (
    @echo 正在压缩 %%~a ...
	:: 当启用混淆功能时，如果你希望保留一些名字不被混淆，你可以用--reserved (-r) 声明一些名字，用逗号隔开。例如：uglifyjs ... -m -r '$,require,exports', 防止require, exports和 $被混淆改变。
    :: 调用以下命令： uglifyjs demo.js -m -o demo.js 实现将demo.js 的文件混淆压缩后，输出到demo.js(即用压缩后的代码，覆盖压缩前的代码)
    uglifyjs %%~fa  -m -o %%~fa
)
echo 完成!
pause & exit
:: 结束...