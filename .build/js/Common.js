//判断日期是否正确
function isDate(strDate){
	var strSeparator = "-"; //日期分隔符
        var strDateArray;
        var intYear;
        var intMonth;
        var intDay;
        var boolLeapYear;
        strDateArray = strDate.split(strSeparator);
        if (strDateArray.length != 3) return false;
        intYear = parseInt(strDateArray[0], 10);
        intMonth = parseInt(strDateArray[1], 10);
        intDay = parseInt(strDateArray[2], 10);
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;
        if (intMonth > 12 || intMonth < 1) return false;
        if ((intMonth == 1 || intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12) && (intDay > 31 || intDay < 1)) return false;
        if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30 || intDay < 1)) return false;
        if (intMonth == 2) {
            if (intDay < 1) return false;
            boolLeapYear = false;
            if ((intYear % 100) == 0) {
                if ((intYear % 400) == 0) boolLeapYear = true;
            }
            else {
                if ((intYear % 4) == 0) boolLeapYear = true;
            }
            if (boolLeapYear) {
                if (intDay > 29) return false;
            }
            else {
                if (intDay > 28) return false;
            }
        }
        return true
}

 //判断是否为身份证号
function isCardNo(IdCard){
	var reg = /^\d{15}(\d{2}[0-9X])?$/i;
        if (!reg.test(IdCard)) {
            return false;
        }

        if (IdCard.length == 15) {
            var n = new Date();
            var y = n.getFullYear();
            if (parseInt("19" + IdCard.substr(6, 2)) < 1900 || parseInt("19" + IdCard.substr(6, 2)) > y) {
                return false;
            }

            var birth = "19" + IdCard.substr(6, 2) + "-" + IdCard.substr(8, 2) + "-" + IdCard.substr(10, 2);
            if (!isDate(birth)) {
                return false;
            }
        }
        if (IdCard.length == 18) {
            var n = new Date();
            var y = n.getFullYear();
            if (parseInt(IdCard.substr(6, 4)) < 1900 || parseInt(IdCard.substr(6, 4)) > y) {
                return false;
            }

            var birth = IdCard.substr(6, 4) + "-" + IdCard.substr(10, 2) + "-" + IdCard.substr(12, 2);
            if (!isDate(birth)) {
                return false;
            }

            var iW = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);

            var iSum = 0;
            for (var i = 0; i < 17; i++) {
               var  iC = IdCard.charAt(i);
               var iVal = parseInt(iC);
                iSum += iVal * iW[i];
            }

            var iJYM = iSum % 11;
            var sJYM ='';
            if (iJYM == 0) sJYM = "1";
            else if (iJYM == 1) sJYM = "0";
            else if (iJYM == 2) sJYM = "x";
            else if (iJYM == 3) sJYM = "9";
            else if (iJYM == 4) sJYM = "8";
            else if (iJYM == 5) sJYM = "7";
            else if (iJYM == 6) sJYM = "6";
            else if (iJYM == 7) sJYM = "5";
            else if (iJYM == 8) sJYM = "4";
            else if (iJYM == 9) sJYM = "3";
            else if (iJYM == 10) sJYM = "2";

            var cCheck = IdCard.charAt(17).toLowerCase();
            if (cCheck != sJYM) {
                return false;
            }
        }
     return true;
    }

    //取性别和生日
    function cardTOInfo(sId){
        var iSum=0 ;
        var info="" ;
        sId=sId.replace(/x$/i,"a");
        if (sId.length == 15) {
            var sBirthday='19'+sId.substr(6,2)+"-"+sId.substr(8,2)+"-"+sId.substr(10,2);
            var gender = (sId.substr(16,1)%2?"1":"2");
            var splitArr = sBirthday.split('-');
            var brithday = splitArr[0]+'-'+splitArr[1]+'-'+splitArr[2];

            var arr = new Array();
            arr[0] = brithday;
            arr[1] = gender;
            return arr;
        }else if (sId.length == 18) {
            var sBirthday=sId.substr(6,4)+"-"+sId.substr(10,2)+"-"+sId.substr(12,2);
            var gender = (sId.substr(16,1)%2?"1":"2");
            var splitArr = sBirthday.split('-');
            var brithday = splitArr[0]+'-'+splitArr[1]+'-'+splitArr[2];

            var arr = new Array();
            arr[0] = brithday;
            arr[1] = gender;
            return arr;
        }
    }


    //检验Email格式
   function checkEmail(obj){
       var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(obj.value!=''){
         if(!myreg.test(obj.value)){
            $('#signingTime').val(1);
            var some_html = '<div class="alert alert-danger fade in"><label>请输入有效的E_mail！</label></div>';
                bootbox.alert(some_html);
            return false;
         }
       }
   }

   //检验电话号码格式
   function checkNum(obj){
    //var re=/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    //var reg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
       var reg = /^1[34578][0-9]{9}$/;
        if(obj.value != ''){
        if (!reg.test(obj.value)){
        var some_html = '<div class="alert alert-danger fade in"><label>请输入正确的联系方式!</label></div>';
            bootbox.alert(some_html);
            obj.value="";
            return false;
             }
        }
    }

    //去空格，左右都去掉
    function distrim(value){
       return value.replace(/\s+/g,'');
    }

    //投保单号不能重复(同一个公司下面)
    function checkOnlyAppNo(obj,contractId){
        var appNo = obj.value;
        var rex1 = /^[^\u4e00-\u9fa5]{0,}$/;
        var rex2 = /^[^\'\"\,\/\\]{0,}$/;
        if (!rex1.test(appNo)){
              var  some_html = '<div class="alert alert-danger fade in"><label>提示\n\n投保单号不能输入中文，请重新输入!</label></div>';
              bootbox.alert(some_html);
              obj.value='';
        }else if(!rex2.test(appNo)){
              var  some_html = '<div class="alert alert-danger fade in"><label>提示\n\n投保单号不能输入非法字符，请重新输入!</label></div>';
              bootbox.alert(some_html);
              obj.value='';
        }
        $.ajax({
            type: "get",
            url: "/biz/contract/checkApplicationNo",
            data: {applicationNo:appNo,contractId:contractId},
            dataType: "json",
            success: function(data){
              if(data.length > 0){
                obj.value='';
                var  some_html = '<div class="alert alert-danger fade in"><label>投保单号重复,请重新输入!</label></div>';
                bootbox.alert(some_html);
              }
            }
        });
    }

    //保单号不能重复(同一个公司下面)
    function checkOnlyConNo(obj,contractId){
        var conNo = obj.value;
        var rex1 = /^[^\u4e00-\u9fa5]{0,}$/;
        var rex2 = /^[^\'\"\,\/\\]{0,}$/;
        if (!rex1.test(conNo)){
            var some_html = '<div class="alert alert-danger fade in"><label>提示\n\n保单号码不能输入中文，请重新输入!</label></div>';
            bootbox.alert(some_html);
            obj.value='';
        }else if(!rex2.test(conNo)){
            var  some_html = '<div class="alert alert-danger fade in"><label>提示\n\n保单号码不能输入非法字符，请重新输入!</label></div>';
            bootbox.alert(some_html);
            obj.value='';
        }

        $.ajax({
            type: "get",
            url: "/biz/contract/checkContractNo",
            data: {contractNo:conNo,contractId:contractId},
            dataType: "json",
            success: function(data){
                if(data.length > 0){
                   obj.value='';
                   var  some_html = '<div class="alert alert-danger fade in"><label>保单号码重复,请重新输入!</label></div>';
                   bootbox.alert(some_html);
                }
            }
        });
    }
