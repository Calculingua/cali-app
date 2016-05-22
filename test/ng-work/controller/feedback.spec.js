define(["$J", "sinon", "ng-work/work-app", "angularMocks"], function($J, sionon, module, mocks){
    
    $J.describe("Feedback Controller", function(){
        
        var feedback, api, scope, q, _window;
        
        $J.beforeEach(function(){
            mocks.module("cali-work");
            mocks.inject(function($controller, _ApiService_, $q, $window){
                scope = {};
                feedback = $controller("Feedback", { $scope: scope });
                api =  _ApiService_;
                q = $q;
                _window = $window.cali = {
                    version: "butts"
                };
            });
        });
        
        $J.describe("scope.submit()", function(){
            $J.describe("uses the API to submit the issue.", function(){
                $J.beforeEach(function(){
                    sinon.stub(api, "submitIssue", function(data){
                        var def = q.defer();
                        
                        return q.when({status: 200, data: "okay"});
                    });
                });
                
                $J.afterEach(function(){
                    api.submitIssue.restore();
                });
                
                $J.it("should call the api", function(){
                    scope.subject = "Hello";
                    scope.body = "World";
                    scope.submit();
                    expect(api.submitIssue.callCount).toEqual(1);
                    expect(api.submitIssue.getCall(0).args[0]).toEqual({subject: "Hello", body: "World", version: "butts"});
                });
                
                $J.describe("when the version is not defined", function(){
                    $J.beforeEach(function(){
                        mocks.inject(function($window){
                            delete $window.cali;
                        });
                    });
                    
                    $J.it("should make version 'unknown'", function(){
                        scope.subject = "Hello";
                        scope.body = "World";
                        scope.submit();
                        expect(api.submitIssue.callCount).toEqual(1);
                        expect(api.submitIssue.getCall(0).args[0]).toEqual({subject: "Hello", body: "World", version: "unknown"});
                    });
                });
            });
        });
    });
});