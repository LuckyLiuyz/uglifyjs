/**
 * 此文件仅仅用于压缩展示，没有实际意义
 */
define(
    [
        'uui', 'webAjax'
    ],
    function (uui, webAjax) {

        var CardUtils = function (app, constant) {
            this.app = app;
            this.constant = constant;
        };

        CardUtils.prototype.setCardEnable = function (viewModel, flag) {
            viewModel.isEditable(flag);
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.gridId) {
                    this.app.getComp(dataTable.gridId).setEnable(flag)
                }
                else {
                    dataTable.setEnable(flag);
                }
            }
            if (flag) {
                $('.viewCardBody  .gridTest .u-grid-header-link span').show();
            }
            else {
                $('.viewCardBody  .gridTest .u-grid-header-link span').hide();
            }
        };

        CardUtils.prototype.isHasData = function () {
            var flag = false;
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                var rows = dataTable.getAllRows();
                if (rows != null) {
                    flag = true;
                    break;
                }
            }
            return flag;
        };

        CardUtils.prototype.setDataTableRowStatus = function (status) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                var rows = dataTable.getAllRows();
                for (var i = 0, count = rows.length; i < count; i++) {
                    rows[i].setStatus(status);
                }
            }
        };

        /*
        *   判断当前单据状态是否是新增
        * */
        CardUtils.prototype.getDataTableRowStatus = function () {
            var status = null;
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                var rows = dataTable.getAllRows();
                for (var i = 0, count = rows.length; i < count; i++) {
                    status = rows[i].status;
                    if (status !== "new") {
                        return status;
                    }
                }
            }
            return status
        };

        /**
         * 类型：Function 说明：获取全界面修改过的数据组织成json
         */
        CardUtils.prototype.getAllChangeValue = function (oid) {
            var data = {};// 表头dataTable
            var bodys = {};// 表体dataTables
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id === "head") {// 表头
                    var head = this.getAllChangeHeadValue(dataTable);
                    data.head = head;
                }
                else { // 表体
                    var bodyData = this.getAllChangeBodyValue(dataTable);
                    bodys[dataTable.id] = bodyData;
                }
            }
            data.bodys = bodys;
            data.oid = oid;
            return data;
        };
        CardUtils.prototype.getAllChangeHeadValue = function (dataTable) {
            var head = {};
            head.name = dataTable.id;
            head.pageInfo = {
                currentPageIndex: dataTable.pageIndex(),
                pageCount: dataTable.totalPages(),
                pageSize: dataTable.pageSize()
            }
            head.rows = new Array();
            var rows = dataTable.getChangedRows();
            var rlen = rows.length;
            if (rlen == 0) {
                // 当表头没有被修改时，只传TS和单据主键
                var headvalues = {};
                headvalues.status = transStatus(Row.STATUS.NORMAL);
                var values = {};
                values['ts'] = this.getHeadValue('ts');
                values[this.constant.HID] = this.getHeadValue(this.constant.HID);
                headvalues.values = values;
                head.rows.push(headvalues);
                return head;
            }
            for (var i = 0, count = rlen; i < count; i++) {
                var rowData = rows[i].data;
                // 设值行状态
                var headvalues = {};
                var rowstatus = rows[i].status;
                headvalues.status = transStatus(rowstatus);
                var values = {};
                for (var key in rowData) {
                    if ((typeof rowData[key].value == undefined)
                        || (rowData[key].value == null)) {
                        continue;
                    }
                    values[key] = {};
                    for (var valueKey in rowData[key].meta) {
                        if (valueKey === 'display') {
                            values[key].display = rowData[key].meta.display;
                        }
                        else if (valueKey === 'precision') {
                            values[key].precision = rowData[key].meta.precision;
                        }
                    }
                    if (!(rowData[key].meta)) {
                        rowData[key].display = rowData[key].value;
                        values[key].display = rowData[key].value;
                    }
                    values[key].value = rowData[key].value;
                    // if (rowData[key].meta.display!=null){
                    // values[key].pk = values[key].value;
                    // rowData[key].pk = values[key].pk;
                    // rowData[key].value = rowData[key].meta.display;
                    // }
                    headvalues.values = values;
                }
                head.rows.push(headvalues);
            }
            return head;
        };
        CardUtils.prototype.getAllChangeBodyValue = function (dataTable) {
            // 表体
            var bodyData = {};
            bodyData.name = dataTable.id;
            bodyData.pageInfo = {
                currentPageIndex: dataTable.pageIndex(),
                pageCount: dataTable.totalPages(),
                pageSize: dataTable.pageSize()
            };
            bodyData.rows = new Array();
            var rows = dataTable.getChangedRows();
            var rlen = rows.length;
            if (rlen == 0) {
                // 当表体没有被修改时，只传TS和单据主键
                var rows = dataTable.getAllRows();
                var rlen = rows.length;
                for (var i = 0, count = rlen; i < count; i++) {
                    var values = {};
                    var bodyonevalues = {};
                    bodyonevalues.rowId = rows[i].rowId;
                    bodyonevalues.status = transStatus(Row.STATUS.NORMAL);
                    values['ts'] = this.getBodyValueByRowIndex(i, 'ts');
                    values[this.constant.BID] = this.getBodyValueByRowIndex(i,
                        this.constant.BID);
                    bodyonevalues.values = values;
                    bodyData.rows.push(bodyonevalues);
                }
                return bodyData;
            }
            for (var i = 0, count = rlen; i < count; i++) {
                var bodyonevalues = {};
                var bodyvalues = {};
                bodyonevalues.status = transStatus(rows[i].status);
                bodyonevalues.rowId = rows[i].rowId;
                var rowData = rows[i].data;
                for (var key in rowData) {
                    // if ((typeof rowData[key].value == undefined)
                    // || (rowData[key].value == null)) {
                    // continue;
                    // }
                    bodyvalues[key] = {};
                    for (var valueKey in rowData[key].meta) {
                        if (valueKey === 'display') {
                            bodyvalues[key].display = rowData[key].meta.display;
                        }
                        else if (valueKey === 'precision') {
                            bodyvalues[key].precision = rowData[key].meta.precision;
                        }
                    }
                    // changed by zhaozhao 20170415 owData[key].meta ==
                    // undefined
                    if ((rowData[key].meta == undefined)
                        || (rowData[key].meta.display == undefined)) {
                        rowData[key].display = rowData[key].value;
                        bodyvalues[key].display = rowData[key].value;
                    }
                    bodyvalues[key].value = rowData[key].value;
                    // if (rowData[key].meta.display!=null){
                    // bodyvalues[key].pk = bodyvalues[key].value;
                    // rowData[key].pk = bodyvalues[key].pk;
                    // rowData[key].value = rowData[key].meta.display;
                    // }
                    bodyonevalues.values = bodyvalues;
                }
                bodyData.rows.push(bodyonevalues);
            }
            return bodyData;

        };

        /*
        *   判断当前页面是否有值改变
        * */
        CardUtils.prototype.isHasChange = function () {
            var flag = false;
            var dataTables = this.app.getDataTables();

            //如果页面是新增态，默认改变，返回true
            var status = this.getDataTableRowStatus();
            if (status === "new") {
                flag = true;
            } else {
                for (var key in dataTables) {
                    var dataTable = dataTables[key];
                    var rows = dataTable.getChangedRows();
                    if ((rows != null) && (rows.length > 0)) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        };

        /**
         * 获取页面展示的所有数据 （于getAllValue区别在于没有删除行的数据）
         *
         * @param oid
         * @returns {{}}
         */
        CardUtils.prototype.getAllUIValue = function (oid) {
            var data = {};// 表头dataTable
            var bodys = {};// 表体dataTables
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id === "head") {// 表头
                    var head = this.getAllHeadValue(dataTable);
                    data.head = head;
                }
                else { // 表体
                    var bodyData = this.getAllBodyUIValue(dataTable);
                    bodys[dataTable.id] = bodyData;
                }
            }
            data.bodys = bodys;
            data.oid = oid;
            return data;
        };
        /**
         * 获取用于删除的精简数据结构
         *
         * @param oid
         * @returns {{}}
         */
        CardUtils.prototype.getAllValueForDel = function (oid) {
            var bill = this.getAllValue(oid);
            var bodys = bill.bodys;
            for (var key in bodys) {
                bodys[key].rows = [];
            }
            var hvalues = bill.head.rows[0].values;
            var newHvalues = {};
            for (var key in hvalues) {
                if (key === this.constant.HID || key === this.constant.TS) {
                    newHvalues[key] = hvalues[key];
                }
            }
            bill.head.rows[0].values = newHvalues;
            return bill;
        };
        /**
         * 类型：Function 说明：获取全界面数据组织成json
         */
        CardUtils.prototype.getAllValue = function (oid) {
            var data = {};// 表头dataTable
            var bodys = {};// 表体dataTables
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id === "head") {// 表头
                    var head = this.getAllHeadValue(dataTable);
                    data.head = head;
                }
                else { // 表体
                    var bodyData = this.getAllBodyValue(dataTable);
                    bodys[dataTable.id] = bodyData;
                }
            }
            data.bodys = bodys;
            data.oid = oid;
            return data;
        };
        CardUtils.prototype.getAllHeadValue = function (dataTable) {
            var head = {};
            head.name = dataTable.id;
            head.pageInfo = {
                currentPageIndex: dataTable.pageIndex(),
                pageCount: dataTable.totalPages(),
                pageSize: dataTable.pageSize()
            };
            head.rows = new Array();
            var rows = dataTable.getAllRows();
            for (var i = 0, count = rows.length; i < count; i++) {
                var rowData = rows[i].data;
                // 设值行状态
                var headvalues = {};
                headvalues.status = transStatus(rows[i].status);
                var values = {};
                for (var key in rowData) {
                    // if ((typeof rowData[key].value == undefined)
                    // || (rowData[key].value == null)) {
                    // continue;
                    // }
                    values[key] = {};
                    for (var valueKey in rowData[key].meta) {
                        if (valueKey === 'display') {
                            values[key].display = rowData[key].meta.display;
                        }
                        else if (valueKey === 'precision') {
                            values[key].precision = rowData[key].meta.precision;
                        }
                    }
                    // 如果是复选框，当没有选择时，默认使其保存value
                    if($("#"+key).attr('type') === 'checkbox' && rowData[key].value === null){
                        rowData[key].value = 'N';
                    }
                    // values[key].pk = rowData[key].meta.pk;
                    // values[key].precision = rowData[key].meta.precision;
                    values[key].value = rowData[key].value;
                    headvalues.values = values;
                }
                head.rows.push(headvalues);
            }
            return head;
        };
        /**
         * 获取界面当前展示的所有数据
         *
         * @param dataTable
         * @returns {{}}
         */
        CardUtils.prototype.getAllBodyUIValue = function (dataTable) {
            // 表体
            var bodyData = {};
            bodyData.name = dataTable.id;
            bodyData.pageInfo = {
                currentPageIndex: dataTable.pageIndex(),
                pageCount: dataTable.totalPages(),
                pageSize: dataTable.pageSize()
            };
            bodyData.rows = new Array();
            var rows = dataTable.getAllRows();
            var rlen = rows.length;
            for (var i = 0, count = rlen; i < count; i++) {
                var bodyonevalues = {};
                var bodyvalues = {};
                bodyonevalues.status = transStatus(rows[i].status);
                if (rows[i].status === Row.STATUS.FALSE_DELETE) {// 删除状态的不要
                    continue;
                }
                bodyonevalues.rowId = rows[i].rowId;
                var rowData = rows[i].data;
                for (var key in rowData) {
                    if ((typeof rowData[key].value == undefined)
                        || (rowData[key].value == null)) {
                        continue;
                    }
                    bodyvalues[key] = {};
                    for (var valueKey in rowData[key].meta) {
                        if (valueKey === 'display') {
                            bodyvalues[key].display = rowData[key].meta.display;
                        }
                        else if (valueKey === 'precision') {
                            bodyvalues[key].precision = rowData[key].meta.precision;
                        }
                    }
                    bodyvalues[key].value = rowData[key].value;
                    bodyonevalues.values = bodyvalues;
                }
                bodyData.rows.push(bodyonevalues);
            }
            return bodyData;

        };
        /**
         * 获取表体所有数据包括已删除的
         *
         * @param dataTable
         * @returns {{}}
         */
        CardUtils.prototype.getAllBodyValue = function (dataTable) {
            // 表体
            var bodyData = {};
            bodyData.name = dataTable.id;
            bodyData.pageInfo = {
                currentPageIndex: dataTable.pageIndex(),
                pageCount: dataTable.totalPages(),
                pageSize: dataTable.pageSize()
            };
            bodyData.rows = new Array();
            var rows = dataTable.getAllRows();
            var rlen = rows.length;
            for (var i = 0, count = rlen; i < count; i++) {
                var bodyonevalues = {};
                var bodyvalues = {};
                bodyonevalues.status = transStatus(rows[i].status);
                bodyonevalues.rowId = rows[i].rowId;
                var rowData = rows[i].data;
                for (var key in rowData) {
                    // if ((typeof rowData[key].value == undefined)
                    // || (rowData[key].value == null)) {
                    // continue;
                    // }
                    bodyvalues[key] = {};
                    for (var valueKey in rowData[key].meta) {
                        if (valueKey === 'display') {
                            bodyvalues[key].display = rowData[key].meta.display;
                        }
                        else if (valueKey === 'precision') {
                            bodyvalues[key].precision = rowData[key].meta.precision;
                        }
                    }
                    bodyvalues[key].value = rowData[key].value;
                    // Add by WangyongR
                    // if (dataTable.meta[key].controltype == 'uiRefer') {
                    // // bodyvalues[key].pk = rowData[key].meta.pk;
                    // bodyvalues[key].display = rowData[key].value;
                    // }
                    // else {
                    // // bodyvalues[key].pk = rowData[key].meta.pk;
                    // bodyvalues[key].value = rowData[key].value;
                    // }
                    // End
                    // bodyvalues[key].precision = rowData[key].meta.precision;
                    bodyonevalues.values = bodyvalues;
                }
                bodyData.rows.push(bodyonevalues);
            }
            return bodyData;

        };

        // 将kero的行状态转化为NC后台的VO状态
        var transStatus = function (status) {
            var vostatus = 0;
            if (status === Row.STATUS.NORMAL) {
                vostatus = 0;
            }
            else if (status === Row.STATUS.UPDATE) {
                vostatus = 1;
            }
            else if (status === Row.STATUS.NEW) {
                vostatus = 2;
            }
            else if (status === Row.STATUS.FALSE_DELETE) {
                vostatus = 3;
            }
            return vostatus;
        };

        /**
         * 类型：Function 说明：设置全部字段具体值 用法：data 规定好的json结构
         */
        CardUtils.prototype.setAllValue = function (allData) {
            var data = allData;
            var headdata = data.head;
            var bodydata = data.bodys;
            this.setAllHeadValue(headdata);
            this.setAllBodyValue(bodydata)
        };
        /**
         * 类型：Function 说明：设置表头字段具体值 用法：headdata 规定好的json结构
         */
        CardUtils.prototype.setAllHeadValue = function (headdata) {
            var name = headdata.name;
            if (name == null) {
                name = "head";
            }
            // var pageInfo = headdata.pageInfo;
            var rows = headdata.rows;
            var dataTable = this.app.getDataTable(name);
            // 表头(表头只有一行，所以不考虑获取多行)
            var row = dataTable.getCurrentRow();
            if (row == null) {
                row = dataTable.createEmptyRow();
            }

            for (var i = 0; i < rows.length; i++) {
                var rowdata = rows[i].values;
                for (var key in rowdata) {
                    if (dataTable.meta.hasOwnProperty(key)) {
                        var type = dataTable.getMeta(key).DataType;
                        var controltype = dataTable.getMeta(key).controltype;
                        if (((type == 'date') || (type == "u-date") || (type == "UFDate"))
                            && rowdata[key].value) {
                            if (controltype == "refRelation") {
                                if (rowdata[key].display) {
                                    rowdata[key].display = rowdata[key].display
                                        .substring(0, 10);
                                }
                            }else{
                                if (rowdata[key].value) {
                                    rowdata[key].value = rowdata[key].value.substring(0, 10);
                                }
                            }
                        }
                    }
                }
                this.setRowValue(row, rowdata);
            }
        };
        /**
         * 类型：Function 说明：设置表体字段具体值 用法：bodydata 规定好的json结构
         */
        CardUtils.prototype.setAllBodyValue = function (bodydata) {
            for (var key in bodydata) {
                var onebody = bodydata[key];
                var name = key;
                var pageInfo = onebody.pageInfo;
                var rows = onebody.rows;
                var datatable = this.app.getDataTable(name);
                var datatablerows = datatable.getAllRows();
                var length = datatablerows.length;
                for (var i = 0; i < rows.length; i++) {
                    var unSelect = {
                        unSelect: true
                    };
                    var row;
                    if (length == 0) {
                        row = datatable.createEmptyRow(unSelect);
                    }
                    else {
                        row = datatablerows[i];
                    }
                    var rowdata = rows[i].values;
                    for (var key in rowdata) {
                        if (datatable.meta.hasOwnProperty(key)) {
                            var type = datatable.getMeta(key).DataType;
                            var controltype = datatable.getMeta(key).controltype;
                            if (((type == 'date') || (type == "u-date") || (type == "UFDate"))
                                && rowdata[key].value) {
                                if (controltype == "refRelation") {
                                    if (rowdata[key].display) {
                                        rowdata[key].display = rowdata[key].display.substring(0,
                                            10);
                                    }
                                }else{
                                    if (rowdata[key].value) {
                                        rowdata[key].value = rowdata[key].value.substring(0, 10);
                                    }
                                }

                            }
                        }
                    }
                    this.setRowValue(row, rows[i].values);
                }
            }
        };
        // 编辑后事件设置某行的字段值
        CardUtils.prototype.setAllBodyCellValue = function (bodydata, cName) {
            for (var key in bodydata) {
                if (key = "bodys") {
                    var onebody = bodydata[key];
                    var name = key;
                    var pageInfo = onebody[cName].pageInfo;
                    var rows = onebody[cName].rows;
                    var datatable = this.app.dataTables[cName];
                    var datatableRows = datatable.getAllRows();
                    for (var i = 0; i < rows.length; i++) {
                        var row = datatableRows[i];
                        if (row == null) {
                            var unSelect = {
                                unSelect: true
                            };
                            row = datatable.createEmptyRow(unSelect);
                        }
                        this.setRowValue(row, rows[i].values);
                    }
                }
            }
        };
        CardUtils.prototype.addBodyValue = function (bodydata) {
            for (var key in bodydata) {
                var onebody = bodydata[key];
                var name = key;
                var rows = onebody.rows;
                var datatable = this.app.getDataTable(name);
                // var datatableRows = datatable.getAllRows();
                for (var i = 0; i < rows.length; i++) {
                    var unSelect = {
                        unSelect: true
                    };
                    var row = datatable.createEmptyRow(unSelect);
                    this.setRowValue(row, rows[i].values);
                }
            }
        };

        CardUtils.prototype.setRowValue = function (row, data) {
            for (var field in data) {
                if (!row.data[field]) {
                    continue;
                }
                this.setRowValueByField(row, field, data[field]);
            }
        }

        CardUtils.prototype.setRowValueByField = function (row, field, value) {
            // 关闭编辑后事件开关，AfterEvent会有处理
            window.valueChange = false;

            if ((value.precision != undefined) && (value.precision != null)) {
                if ((parseFloat(value.precision) >= 0)
                    && (parseFloat(value.precision) < 20)) {
                    row.setMeta(field, 'precision', value.precision);
                }
            }
            var display = value.display;
            var values = value.value;
            if (display !== undefined) {
                row.setMeta(field, "display", display);
            }
            else {
                row.setMeta(field, "display", null);
            }
            if (values !== undefined) {
                /**
                 * 此处之所以要先置null，因为取消操作恢复界面原有值的场景下
                 * 界面上的加载关联项字段上value上已经有值，重新给它赋完display后，
                 * 紧接着row.setValue(field,value);但由于value值没有变化，iuap并不会触发
                 * 事件将display赋值到控件上，故先row.setValue(field, null)
                 */
                row.setValue(field, null);
                row.setValue(field, values);
            }
            else {
                row.setValue(field, null);
            }

            // 打开编辑后事件开关，AfterEvent会有处理
            window.valueChange = true;
        };

        /**
         * 类型：Function 说明：设置表头字段具体值 用法： key表头字段名称 ，value具体的值
         */
        CardUtils.prototype.setHeadValue = function (nckey, value) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id === "head") {// 表头(表头只有一行，所以不考虑传入行号)
                    var row = dataTable.getCurrentRow();
                    if ((row == null) || (typeof row == undefined)) {
                        return null;
                    }
                    this.setRowValueByField(row, nckey, value);
                }
            }
        }

        /**
         * 类型：Function 说明：设置表头字段具体值 用法： key表头字段名称 ，value具体的值
         */
        CardUtils.prototype.setSearchValue = function (nckey, value) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (JSON.stringify(dataTable.meta) !== "{}") {
                    var row = dataTable.getCurrentRow();
                    row.setMeta(nckey, "display", value);
                    row.setMeta(nckey, 'precision', value);
                    row.setValue(nckey, value);
                }
            }
        };

        /**
         * 类型：Function 说明：获取表头字段具体值 用法： key表头字段名称 return 一个value对象
         */
        CardUtils.prototype.getHeadValue = function (nckey) {
            var dataTables = this.app.getDataTables();
            if (dataTables == null) {
                return null;
            }
            var value = {};
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id === "head") {// 表头(表头\所以不考虑传入行号)
                    var row = dataTable.getCurrentRow();
                    if ((row == null) || (typeof row == undefined)) {
                        return null;
                    }
                    value.value = row.getValue(nckey);
                    value.display = row.getMeta(nckey, "display");
                    value.precision = row.getMeta(nckey, "precision");
                    return value;
                }
            }
        };
        /**
         * 类型：Function 说明：设置表体rowid特定行的具体字段值 用法：rowid为行的rowid, key表体字段名称，value 具体值
         */
        CardUtils.prototype.setBodyValueByRowId = function (rowid, nckey, value) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id !== "head") {// 表头有多行
                    var row = dataTable.getRowByRowId(rowid);
                    if ((row != undefined) && (row != null)) {
                        this.setRowValueByField(row, nckey, value);
                    }
                    break;
                }
            }
        };
        /**
         * 类型：Function 说明：获取表体rowid特定行的具体字段值 用法：rowid为行的rowid, key表体字段名称 return
         * value对象，包含value、pk、precision
         */
        CardUtils.prototype.getBodyValueByRowId = function (rowid, nckey) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id !== "head") {// 表头有多行
                    var row = dataTable.getRowByRowId(rowid);
                    var values = {};
                    values.display = row.getMeta(nckey, "display");
                    values.value = row.getValue(nckey);
                    values.precision = row.getMeta(nckey, "precision");
                    return values;
                }
            }
        };
        /**
         * 类型：Function 说明：设置表体索引特定行的具体字段值 用法：rowindex为行索引, key表体字段名称，value 具体值
         */
        CardUtils.prototype.setBodyValueByRowIndex = function (rowindex, nckey,
                                                               value) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id !== "head") {// 表头有多行
                    var row = dataTable.getRow(rowindex);
                    this.setRowValueByField(row, nckey, value);
                }
            }
        };
        /**
         * 类型：Function 说明：获取表体索引特定行的具体字段值 用法：rowindex为行索引, key表体字段名称 return 字段具体值
         *
         */
        CardUtils.prototype.getBodyValueByRowIndex = function (rowindex, nckey) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id !== "head") {// 表头有多行
                    var row = dataTable.getRow(rowindex);
                    var values = {};
                    values.display = row.getMeta(nckey, "display");
                    values.value = row.getValue(nckey);
                    values.precision = row.getMeta(nckey, "precision");
                    return values;
                }
            }
        };
        /**
         * 类型：Function 说明：获取表体索引特定行的数据 用法：rowindex为行索引 return 某一行的值
         *
         */
        CardUtils.prototype.getRowDataByIndex = function (rowindex) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id !== "head") {// 表头有多行
                    var row = dataTable.getRow(rowindex);
                    return row.data;
                }
            }
        };

        /**
         * 类型：Function 说明：获取表体索引特定行的数据 用法：rowindex为行索引 return 某一行的值
         *
         */
        CardUtils.prototype.getRowChangedDataByIndex = function (rowindex) {
            var rowdata = this.getRowDataByIndex(rowindex);
            var datachanged = new Array();
            for (var rowkey in rowdata) {
                var rowvalue = rowdata[rowkey];
                if (rowvalue.changed) {
                    datachanged[rowkey] = rowvalue;
                }
            }
            return datachanged;
        };
        /**
         * 类型：Function 说明：获取表体选择行的数据 用法： return 某选中行的值
         *
         */
        CardUtils.prototype.getSelectedRowData = function () {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                if (dataTable.id !== "head") {// 表头有多行
                    var row = dataTable.getFocusRow();
                    return row.data;
                }
            }
        };

        /**
         * 卡片界面默认初始化参数: type:"detail" 默认是浏览详情 id:当前页面上的单据主键
         */
        CardUtils.prototype.getInitPageParams = function () {
            var pk = this.getHeadValue(this.constant.HID);
            if ((pk == null) || (pk == "undefined")) {
                return null;
            }
            var initPageParams = {
                "type": "detail",// 页面初始化类型，新增、修改、详情、转单
                "id": pk.value, // 页面数据id
            };
            return initPageParams;
        };

        /**
         * 类型：Function 说明：获取需要删除的数据（ID和ts） 用法：
         *
         */
        CardUtils.prototype.getSelectedDelData = function (viewModel) {
            var selectedRows = viewModel.dataTable.getSelectedRows();
            var selectedIndexs = viewModel.dataTable.getSelectedIndexs();
            var deletejsons = new Array();
            var datas = {};
            if ((selectedRows.length > 0) && (selectedIndexs.length > 0)) {
                for (var i = 0; i < selectedRows.length; i++) {
                    deletejsons.push(getDeleteJson(selectedRows[i]));
                }
                datas = deletejsons;
            }
            return datas;
        };

        function getDeleteJson(deleterow) {
            var data = {};
            var bodys = {};// 表体
            var head = getDeleteHeadJson(deleterow);
            data.oid = '0001Z810000000006YU5';
            data.head = head;
            var body = getDeleteBodyJson(deleterow);
            bodys.body = body;
            data.bodys = bodys;
            return data;
        }

        function getDeleteHeadJson(deleterow) {
            var head = {};// 表头
            // 组织表头json
            head.name = "head";
            head.pageInfo = {
                "currentPageIndex": 0,
                "pageCount": 0,
                "pageSize": 0
            };
            head.rows = new Array();
            var headvalues = {};
            var values = {};
            for (var key in deleterow.data) {
                if (key === "crevecontid" || key === "ts") {
                    values[key] = {};
                    values[key].display = deleterow.data[key].value;
                    values[key].value = deleterow.data[key].value;
                    values[key].precision = 0;
                }
            }
            headvalues.values = values;
            head.rows.push(headvalues);
            return head;
        }

        function getDeleteBodyJson(deleterow) {
            var body = {};
            body.name = "";
            body.pageInfo = {
                "currentPageIndex": 0,
                "pageCount": 0,
                "pageSize": 0
            };
            body.rows = new Array();
            body.rows.push(null);

            return body;
        }

        CardUtils.prototype.resetAllValue = function () {
            var dataTables = this.app.getDataTables();
            var that = this;
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                dataTable.resetAllValue();
            }

            // 修改保存取消才走一下逻辑，补充元数据加载关联项
            var hid = this.getHeadValue(this.constant.HID);
            if (hid != null) {
                var resetData = this.getAllValue(this.constant.templateID);
                webAjax.send(ctx + 'platform/pubapp/billcard_loadrelation.do',
                    resetData, false, function (data) {
                        if (data.success) {
                            that.setAllValue(data.data);
                        }
                    });
                this.setDataTableRowStatus(Row.STATUS.NORMAL);
            }
        };

        /**
         * 类型：Function 说明：清空界面上的数据 用法： 删除界面所有数据
         *
         */
        CardUtils.prototype.clearAllData = function () {
            var emptyRows = [];// 空行
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                var dataTable = dataTables[key];
                var rows = dataTable.getAllRows();
                for (var i = 0, count = rows.length; i < count; i++) {
                    var data = rows[i].data;
                    for (var key in data) {
                        var obj = data[key];
                        if (obj && obj['changed']) {
                            data[key]['changed'] = false;
                            rows[i].setValue(key, null);
                            rows[i].setMeta(key, 'display', null);

                            if (obj.baseValue) {
                                obj.baseValue = null;
                            }
                        }

                    }
                    if (rows[i].status == 'new') {
                        emptyRows.push(i);
                    }
                }
                dataTable.removeRows(emptyRows);
            }
        };

        CardUtils.prototype.getHeadTable = function () {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                if (key === "head" || key === "searchTable") {
                    var dataTable = dataTables[key];
                    return dataTable;
                }
            }
        };

        CardUtils.prototype.getBodyTables = function () {
            var dataTables = this.app.getDataTables();
            var bodyTables = [];
            for (var key in dataTables) {
                if ((key != "head") && (key != "searchTable")) {
                    bodyTables.push(dataTables[key]);
                }
            }
            return bodyTables;
        };

        /**
         * 类型：Function 说明：设置字段可编辑性 用法： nckey表头字段值,editable是否可编辑（true,false）
         */
        CardUtils.prototype.setHeadItemEditable = function (nckey, editable) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                if (key === "head" || key === "searchTable") {
                    var dataTable = dataTables[key];
                    var itemsmeta = dataTable.meta;
                    for (var itemkey in itemsmeta) {
                        if (nckey === itemkey) {
                            dataTable.setMeta(nckey, "enable", editable);
                            if (!editable) {
                                if ($('#' + nckey).attr('type') === 'checkbox') {
                                    $('#' + nckey).parent().parent('div[u-meta]').css({
                                        'background-color': 'rgba(241, 241, 241,0.54)'
                                    }).addClass('unEditable');
                                } else {
                                    $('#' + nckey).css({
                                        'background-color': 'rgba(241, 241, 241,0.54)'
                                    }).addClass('unEditable');
                                }
                                $('#' + nckey).attr('disabled', true).prev('.u-input-group-before').css({
                                    'display': 'none'
                                });
                            }
                            else {
                                if ($('#' + nckey).attr('type') === 'checkbox') {
                                    $('#' + nckey).parent().parent('div[u-meta]').css({
                                        'background-color': 'rgba(241, 241, 241,0.54)'
                                    }).removeClass('unEditable');
                                    if($('#' + nckey).parent().parent('div[u-meta]').hasClass('is-disabled')){
                                        $('#' + nckey).parent().parent('div[u-meta]').removeClass('is-disabled');
                                    }
                                } else {
                                    $('#' + nckey).css({
                                        'background-color': 'rgb(255, 255, 255)'
                                    }).removeClass('unEditable');
                                }
                                $('#' + nckey).attr('disabled', false).prev('.u-input-group-before').css({
                                    'display': 'block'
                                });
                            }
                        }
                    }
                }
            }
        };
        /**
         * 类型：Function 说明：设置表体整列列字段可编辑性 用法： nckey表头字段值,editable是否可编辑（true,false）
         */
        CardUtils.prototype.setBodyListEditable = function (nckey, editable) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                if (key !== "head") {
                    var dataTable = dataTables[key];
                    var itemsmeta = dataTable.meta;
                    for (var itemkey in itemsmeta) {
                        if (nckey === itemkey) {
                            dataTable.setMeta(nckey, "enable", editable);
                        }
                    }
                }
            }
        };

        /**
         * 类型：Function 说明：设置表体行可编辑性 用法： rowindex行索引,editable是否可编辑（true,false）
         */
        CardUtils.prototype.setBodyRowEditable = function (rowindex, editable) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                if (key !== "head") {
                    var dataTable = dataTables[key];
                    var itemsmeta = dataTable.meta;
                    var row = dataTable.getRow(rowindex);
                    for (var itemkey in itemsmeta) {
                        row.setMeta(itemkey, "enable", editable);
                    }
                }
            }
        };
        /**
         * 类型：Function 说明：设置表体行单元格可编辑性 用法：rowindex行索引
         * nckey表头字段值,editable是否可编辑（true,false）
         */
        CardUtils.prototype.setBodyCellEditable = function (rowindex, nckey,
                                                            editable) {
            var dataTables = this.app.getDataTables();
            for (var key in dataTables) {
                if (key !== "searchTable") {
                    var dataTable = dataTables[key];
                    var itemsmeta = dataTable.meta;
                    var row = dataTable.getRow(rowindex);
                    for (var itemkey in itemsmeta) {
                        if (nckey === itemkey) {
                            row.setMeta(nckey, "enable", editable);
                        }
                    }
                }
            }
        };

        /**
         * 编辑后事件组装数据结构--zhaozhaob field 编辑字段 tabName编辑表体 表头为head rowIds为编辑行id数组
         * 因为可能为批量新增所以用数组 不传参数默认为当前行
         */
        CardUtils.prototype.afterEditGetJsonValue = function (event, rowIds) {
            var field = event.field;
            var tabName = event.dataTable;
            var datas = {};
            datas.cellName = field;
            var card = this.getAllValue(this.constant.templateID);
            datas.card = card;
            var rows = new Array();
            var cellValues = new Array();
            if (tabName === "head") {
                rows = card.head.rows;
            }
            else {
                datas.tabName = tabName;
                datas.cellValues = cellValues;
                if (rowIds !== undefined && rowIds !== null) {
                    for (var i = 0; i < rowIds.length; i++) {
                        var row = this.app.getDataTable(tabName).getRowByRowId(rowIds[i]);
                        row.values = row.data;
                        rows.push(row);
                    }
                }
                else {
                    var row = this.app.getDataTable(tabName).getCurrentRow();
                    row.values = row.data;
                    rows.push(row);
                }
            }
            for (var i = 0; i < rows.length; i++) {
                var rowData = rows[i].values;
                var cell = {};
                var rid = rows[i].rowId;
                cell.rowId = rows[i].rowId;
                cell.newValue = {
                    value: rowData[field].value,
                    precision: rowData[field].precision,
                    display: rowData[field].display
                }
                if (typeof rowData[field].basevalue == 'undefined') {
                    rowData[field].basevalue = null;
                }
                var oldValue;
                if (i == 0) {
                    oldValue = event.oldValue;
                }
                cell.oldValue = {
                    value: oldValue,
                    precision: rowData[field].precision,
                    display: ''
                }
                cellValues.push(cell);
            }
            if (tabName == "head") {
                datas.newValue = cellValues[0].newValue;
                datas.oldValue = cellValues[0].oldValue;
            }
            return datas;
        };
        /**
         * 参照多选表体增行--zhaozhaob
         */
        CardUtils.prototype.refMulAddRows = function (field, row) {
            var values = row.getValue(field);
            var displays = row.getMeta(field, "display");
            if ((values != undefined) && (values != null)
                && (values.split(',').length > 1)) {
                for (var i = 0; i < values.split(',').length; i++) {
                    if (i == 0) {
                        row.setMeta(field, 'precision', 0);
                        row.setMeta(field, 'display', displays.split(",")[i]);
                        row.setValue(field, values.split(',')[i]);
                        // row.setStatus(Row.STATUS.NORMAL);
                    }
                    else {
                        var index = this.viewModel.dataTable.getFocusIndex() + i;
                        this.viewModel.dataTable.insertRow(index);
                        var nrow = this.viewModel.dataTable.getRow(index);
                        // _listDataUtils.setRowValue(nrow, row.data);
                        nrow.setMeta(field, 'precision', 0);
                        nrow.setMeta(field, 'display', displays.split(",")[i]);
                        nrow.setValue(field, values.split(',')[i]);
                        // nrow.setStatus(Row.STATUS.NORMAL);
                    }
                }
            }
        };
        /**
         * 将组装好的编辑后事件数据结构发送到后台处理--zhanglmg ajax封装好的方法
         *
         * @param datas
         */
        CardUtils.prototype.afterEditGetAjaxValue = function (url, datas) {
            var _this = this;
            var callBack = function (allData) {
                if (allData.success) {
                    var grid = allData.data;
                    _this.setAllValue(grid);
                }
                else {
                    console.log(allData);
                }
            }
            webAjax.send(url, datas, false, callBack);
        };
        return CardUtils;
    });
