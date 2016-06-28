angular.module("filterApp", [])
    .filter('dateToString', function () {
        return function (text, format) {
            if (angular.isNullOrEmpty(text)) {
                return '';
            }
            text = text.replace(/\.\d+/, '').replace(/-/g, '/');
            var yearFormat = 'yyyy';  //年
            var monthFormat = 'MM';   //月 -补零
            var dayFormat = 'dd';     //日 -补零
            var hourFormat24 = 'HH';  //24小时 -补零
            var minuteFormat = 'mm';  //分钟 -补零
            var secFormat = 'ss';     //秒 -补零

            var monthFormatMin = 'M'; //月
            var dayFormatMin = 'd';   //日
            var hourFormat24Min = 'H';//24小时
            var minuteFormatMin = 'm';//分钟
            var secFormatMin = 's';   //秒

            var date = new Date(text);

            if (angular.isNullOrEmpty(date) || date == 'Invalid Date') {
                return '';
            }
            var dateStr = format;
            dateStr = dateStr
                .replace('yyyy', date.getFullYear())
                .replace('MM', (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1))
                .replace('dd', (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()))
                .replace('HH', (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()))
                .replace('mm', (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()))
                .replace('ss', (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()));
            dateStr = dateStr
                .replace('M', date.getMonth() + 1)
                .replace('d', date.getDate())
                .replace('H', date.getHours())
                .replace('m', date.getMinutes())
                .replace('s', date.getSeconds());
            return dateStr;
        }
    })
    .filter('parseStatus', function () {
        return function (index) {
            var status = {
                '-3': '输单',
                '-2': '商机退回',
                '-1': '线索退回',
                '0': '未分配',
                '1': '已分配',
                '2': '初步洽谈',
                '3': '需求确定',
                '4': '方案/报价',
                '5': '谈判审批',
                '6': '赢单'
            };
            return status[index];
        }
    })
    .filter('parseRole', function () {
        return function (index) {
            var status = {
                '0': '发起人',
                '1': '使用者',
                '2': '影响者',
                '3': '守门人',
                '4': '购买者',
                '5': '决策者'
            };
            return status[index];
        }
    })
    .filter('parseSource', function () {
        return function (index) {
            var array = ['销售获取','市场活动','合作渠道','推广渠道','公司官网','公司微信','在线客服','产品注册','独立合伙人','老板关系','老客户转介绍','其他'];
            return array[index-1];
        }
    })
    .filter('daysAgo', function () {
        return function (d) {
            d = d.replace(/\.\d+/, '').replace(/-/g, '/');
            var minus = new Date() - new Date(d);
            var day = minus / (24 * 60 * 60 * 1000);
            return Math.floor(day);
        }
    });


