/**
 * 此文件仅仅用于压缩展示，没有实际意义
 */
(function demo() {
    var notice = "请注意，此工具目前还未支持ES6语法，如果使用过程中发现压缩不成功，请确认是否使用了ES6语法。或者压缩前先使用babel转义。";
    console.log('readme', notice);
    console.log('readme', notice);
    console.log('readme', notice);
    console.log('readme', notice);
    console.log('readme', notice);
    console.log('readme', notice);
    console.log('readme', notice);
    console.log('readme', notice);

    var ServiceProxy = function (valuesUtils, viewModel, constantEnum) {
        cardUtils = valuesUtils;
        viewModel = viewModel;
        constant = constantEnum;
    };
    var haha = function (id, url) {
        var queryurl = rootUrl + 'query.do';
        if ((url != null) && (url != undefined)) {
            queryurl = rootUrl + url;
        }
        var datas = {};
        datas.billTemplateID = constant.templateID;
        datas.oid = id;
        var para = {};
        para = JSON.stringify(datas);
        var retData;
        var callback = function (allData) {
            if (allData.data.head == null) {
                setTimeout(function () {
                    window.history.back();
                }, 2000);
            }
            retData = allData;
        }
        webAjax.send(queryurl, para, false, callback);
        return retData;
    }
})();

