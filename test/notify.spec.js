/* eslint-env karma, jasmine */
/* eslint strict: [2, false] */
describe("Notification Unit Tests:", function() {
    var _$aNoty;


    var first = 'the first notification~';
    var second = 'the second notification!';
    var third = 'the third notification?';

    var t = function(msg) {
        return msg + ' HAHAHAHA!';
    };

    beforeEach(function() {
        notify.reset();
        notify.clear();
        _$aNoty = notify._$$;
    });

    describe("Creating notifications", function() {

        it("should create notifications", function(done) {
            notify.info(first);
            notify.error(second);
            setTimeout(function() {
                expect(document.querySelectorAll("#" + notify.id + " > div").length).toBe(2);
                expect(document.querySelector("#" + notify.id + " .default").innerHTML).toBe(first);
                expect(document.querySelector("#" + notify.id + " .error").innerHTML).toBe(second);
                done();
            }, 100);
        });

        it("should create 3 different instances", function(done) {
            var _1 = new aNoty();
            var _2 = new aNoty();

            notify.info(first);
            _1.error(second);
            _2.success(third);

            setTimeout(function() {
                expect(document.querySelectorAll("." + _$aNoty.containerClass).length).toBe(3);
                done();
            }, 100);
        });

        it("should use a templating method", function(done) {
            notify.template(t);

            notify.info(first);
            notify.error(second);

            setTimeout(function() {
                expect(document.querySelector("#" + notify.id + " .default").innerHTML).toBe(t(first));
                expect(document.querySelector("#" + notify.id + " .error").innerHTML).toBe(t(second));
                done();
            }, 100);
        });

        it("should reset", function() {
            notify.template(t);
            expect(typeof _$aNoty.template).toBe("function");
            notify.reset();
            expect(typeof _$aNoty.template).toBe("undefined");
        });

    });

});
