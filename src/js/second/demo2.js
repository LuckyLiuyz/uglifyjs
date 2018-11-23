/**
 * 此文件仅仅用于压缩展示，没有实际意义
 */
define(['uui','webAjax'], function (_,webAjax) {
    var viewModel, cardUtils, serviceProxy;
    var isAddSave;//N:修改保存 Y：新增保存
    var funcal;// 新增默认值事件回调函数

    var ActionEvents = function (cardViewModel, valueUtils, service) {
        viewModel = cardViewModel;
        cardUtils = valueUtils;
        serviceProxy = service;
    };

    // 新增设值默认值事件注册
    ActionEvents.prototype.onSetDefaultValueWhenAdd = function (listener) {
        funcal = listener;
    };

    // 卡片界面新增
    ActionEvents.prototype.onAdd = function () {
        isAddSave = true;
        cardUtils.setCardEnable(viewModel, true);
        viewModel.head.createEmptyRow();
        viewModel.events.add();
        funcal();
    };
    // 卡片界面删除
    ActionEvents.prototype.ondelete = function (pk) {
        var array = [];
        var id = cardUtils.getHeadValue(pk);
        array.push(id);
        serviceProxy.deleteBill(pk,array);
        ComeBack();
    };
    // 卡片界面保存
    ActionEvents.prototype.onSave = function () {
        var bill = cardUtils.getAllValue();
        var data = serviceProxy.saveBill(isAddSave,bill);


        // 更新界面数据，就是TS和ID
        cardUtils.setAllValue(data);
        // 统一更新datatable的行状态为Row.STATUS.NORMAL
        cardUtils.setDataTableRowStatus(Row.STATUS.NORMAL);
        viewModel.isHasData(true);
        cardUtils.setCardEnable(viewModel, false);
    };
    // 卡片界面修改
    ActionEvents.prototype.onEdit = function () {
        isAddSave = false;
        cardUtils.setCardEnable(viewModel, true);
    };
    // 卡片界面取消
    ActionEvents.prototype.onCancel = function () {
        cardUtils.clearAllData();
        cardUtils.setCardEnable(viewModel, false);
    };
    // 卡片界面返回
    ActionEvents.prototype.onComeBack = function () {
        ComeBack();
    };

    var ComeBack = function (){
        window.history.back();
    };

    return ActionEvents;

});