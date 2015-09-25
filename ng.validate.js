angular.module('ngValidate',[])
.controller('ngValidateCtrl',function(){
    this.validate = function(elem,value){

    };

    this.reset = function(elem){

    }
})
.directive('ngValidate',function(){
    var nv = {
        scope: {
            rules: '=ngValidate'
        },
        controller: 'ngValidateCtrl',
        link: function(scope,elem,attr,controller){
            var rules = scope.rules;

            elem.on('submit',function(e){
                var bool = false;

                for(var k in rules){
                    if(!controller.validate()){
                        return bool = false;
                    }
                }

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
.directive('ngValidateRules',function(){
    var nvr = {
        scope: {
            rules: '=ngValidateRules',
            value: '=ngModel'
        },
        controller: 'ngValidateCtrl',
        link: function(scope,elem,attr,controller){
            var rules = scope.rules;

            elem.on('focusout',validate);
            elem.on('focusin',reset);

            function validate(e){
                var t = $(e.currentTarget);
                var p = t.parent();
                var value = scope.value || '';

                if(rules == undefined){
                    return true;
                }

                for(var k in rules){
                    if(!rules[k][0].test(value)){
                        p.addClass('has-error');
                        t.tooltip({
                            title: rules[k][1],
                            placement: 'auto',
                            trigger: 'manual'
                        });
                        t.tooltip('show');
                        return false;
                    }
                }
                return true;
            }

            function reset(e){
                var t = $(e.currentTarget);
                var p = t.parent();
                p.removeClass('has-error');
                t.tooltip('destroy');
            }
        }
    };
    return nvr;
})