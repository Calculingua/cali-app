define(["$J", "ng-work/work-app", "angularMocks"], function($J, module, mocks){
    
    $J.describe("ApiService", function() {
        
        var api, httpBackend;
        
        $J.beforeEach(function(){
            mocks.module("cali-work");
            mocks.inject(function($httpBackend, _ApiService_){
                httpBackend = $httpBackend;
                api =  _ApiService_
            });
        });

        $J.afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
        
        $J.it("should exist", function(){
            expect(typeof api).toEqual("object");
        });
        
        $J.describe("#submitIssue(opts)", function(done){
            
            $J.it("should exist", function(){
                expect(typeof api.submitIssue).toEqual("function");
            });
                    
            $J.it("should submit properly formed message", function(){
                httpBackend.expectPOST("/app/userIssue", {subject: "hello", body: "world"}).respond(200, "okay");
                api.submitIssue({subject: "hello", body: "world"})
                    .then(function(okay){
                        expect(okay).toBeTruthy();
                    })
                    .catch(function(err){
                        expect(err).toBeFalsy();
                    });
                httpBackend.flush();
            });
        });
    });
});