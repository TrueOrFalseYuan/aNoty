/* eslint-env karma, jasmine */
/* eslint strict: [2, "global"] */
/* global require */
"use strict";

describe("CommonJS Unit Tests", function() {

    var aNoty = require("aNoty");

    it("should be a function", function() {
        expect(typeof aNoty).toBe("function");
    });

    [ aNoty, new aNoty(), aNoty() ].forEach(function(noty) {
        it("should define the public methods", function() {
            expect(typeof noty.notify).toBe("function");
            expect(typeof noty.info).toBe("function");
            expect(typeof noty.success).toBe("function");
            expect(typeof noty.error).toBe("function");
            expect(typeof noty.clear).toBe("function");

            expect(typeof noty.set).toBe("function");
            expect(typeof noty.reset).toBe("function");

            expect(typeof noty.parent).toBe("function");
            expect(typeof noty.position).toBe("function");
            expect(typeof noty.delay).toBe("function");
            expect(typeof noty.max).toBe("function");
            expect(typeof noty.closeOnClick).toBe("function");

            expect(typeof noty.containerClass).toBe("function");
            expect(typeof noty.containerStyle).toBe("function");
            expect(typeof noty.template).toBe("function");
        });
    });

    it("should be different instances", function() {
        var anotherANoty = new aNoty();
        anotherANoty.position("bottom");
        expect(anotherANoty._$$).not.toEqual(aNoty._$$);
    });

    it("should allow parent element to be updated", function() {
        var el = document.createElement("div");
        aNoty.parent(el);
        expect(aNoty._$$.getParent() === el).toBe(true);
    });

    it("should reset the parent element", function() {
        var el = document.createElement("div");
        aNoty.parent(el);
        aNoty.reset();
        expect(aNoty._$$.getParent() === document.body).toBe(true);
    });

});
