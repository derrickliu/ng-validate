angular.module('ngValidate',[])
// angular的写法
// .directive('ngValidateRules',function(){
//     var nvr = {
//         restrict: 'A',
//         require: 'ngModel',
//         scope: {
//             rules: '=ngValidateRules'
//         },
//         link: function(scope,elem,attrs,ctrl){
//             var rules = scope.rules;
//             ctrl.$parsers.unshift(function(viewValue){
//                 for(var k in rules){
//                     if(!rules[k][0].test(viewValue)){
//                         ctrl.$setValidity('integer',false);
//                         return undefined;
//                     }
//                 }
//                 ctrl.$setValidity('integer', true);
//                 return viewValue;
//             });
//         }
//     };

//     return nvr;
// });
// jquery写法
.directive('ngValidate',function(){
    var nv = {
        restrict: 'A',
        scope: {
            rules: '=ngValidate',
            inst: '=?ngValidateInstance',
            auto: '=ngValidateAuto'
        },
        link: function(scope,elem,attrs){
            var elem = $(elem[0]);
            var rules = scope.rules;

            var auto = scope.atuo || true;

            if(scope.auto == 'true' || scope.auto == true){
                elem.on('focusout',':input',function(e){
                    validate($(this));
                });

                elem.on('focusin',':input',function(e){
                    reset($(this));
                });
            }

            function validate(t){
                var p = t.parent(),
                    name = t.attr('name'),
                    value = t.val(),
                    r = rules[name],

                    // 是否通过验证
                    isPass = true,
                    // 没通过验证的项
                    key;
                for(var k in r){
                    if( ( r[k][0] instanceof RegExp && !r[k][0].test(value) ) || ( $.isFunction(r[k][0]) && !r[k][0](t) ) ){
                        
                        isPass = false;
                        key = k;
                        console.log(k);
                        break;
                    }
                }

                if(isPass){
                    reset(t);
                }else{
                    p.addClass('has-error');
                    t.tooltip({
                        title: r[key][1],
                        placement: 'auto',
                        trigger: 'manual'
                    });
                    t.tooltip('show');
                }
                return isPass;
            }

            function reset(t){
                var p = t.parent();
                p.removeClass('has-error');
                t.tooltip('destroy');
            }

            if(elem.is('form')){
            	elem.on('submit',function(e){
	                var bool = validateAll();
	                //取消后续的submit绑定
	                if(!bool && e){
	                    e.stopImmediatePropagation();
	                }
	                return bool;
	            });
            }

            function validateAll(){
            	var bool = false;
                elem.find(':input').each(function(i,n){
                    bool = validate($(this));
                    if(!bool) {
                        return bool;
                    }
                });

                return bool;
            }

            scope.inst = {
            	validateAll: validateAll
            };
        }
    };
    return nv;
});
// .directive('ngValidateRules',function(){
//     var nvr = {
//         restrict: 'A',
//         scope: {
//             rules: '=ngValidateRules',
//             value: '=ngModel'
//         },
//         controller: 'ngValidateCtrl',
//         link: function(scope,elem,attr,controller){
//             var rules = scope.rules;

//             elem.on('focusout',validate);
//             elem.on('focusin',reset);

//             function validate(e){
//                 var t = $(e.currentTarget);
//                 var p = t.parent();
//                 var value = scope.value || '';

//                 if(rules == undefined){
//                     return true;
//                 }

//                 for(var k in rules){
//                     if(!rules[k][0].test(value)){
//                         p.addClass('has-error');
//                         t.tooltip({
//                             title: rules[k][1],
//                             placement: 'auto',
//                             trigger: 'manual'
//                         });
//                         t.tooltip('show');
//                         return false;
//                     }
//                 }
//                 return true;
//             }

//             function reset(e){
//                 var t = $(e.currentTarget);
//                 var p = t.parent();
//                 p.removeClass('has-error');
//                 t.tooltip('destroy');
//             }
//         }
//     };
//     return nvr;
// });
