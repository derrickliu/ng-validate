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
            rules: '=ngValidate'
        },
        link: function(scope,elem,attrs){
            var elem = $(elem[0]);
            var rules = scope.rules;

            elem.on('focusout','input',function(e){
                validate($(this));
            });

            elem.on('focusin','input',function(e){
                reset($(this));
            });

            function validate(t){
                var p = t.parent(),
                    name = t.attr('name'),
                    value = t.val(),
                    r = rules[name];
                for(var k in r){
                    if(r[k][0] instanceof RegExp && !r[k][0].test(value) ||
                        $.isFunction(r[k][0]) && !r[k][0](t)){
                        p.addClass('has-error');
                        t.tooltip({
                            title: r[k][1],
                            placement: 'auto',
                            trigger: 'manual'
                        });
                        t.tooltip('show');
                        return false;
                    }
                }
                return true;
            }

            function reset(t){
                var p = t.parent();
                p.removeClass('has-error');
                t.tooltip('destroy');
            }

            elem.on('submit',function(e){
                var bool = false;
                $(this).find('input').each(function(i,n){
                    bool = validate($(this));
                    if(!bool) {
                        return bool;
                    }
                });
                //取消后续的submit绑定
                if(!bool && e){
                    e.stopImmediatePropagation();
                }
                return bool;
            });
        }
    };
    return nv;
})
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