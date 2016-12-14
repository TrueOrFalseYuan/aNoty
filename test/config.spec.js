/* eslint-env karma, jasmine */
/* eslint strict: [2, "global"] */
"use strict";

describe("Setting Unit Tests", function() {

    var _$aNoty;

    var elContainer;
    elContainer = document.createElement("div");
    elContainer.id = "testing";

    beforeEach(function() {
        notify.reset();
        notify.clear();
        _$aNoty = notify._$$;
    });

    it("should have a version number", function() {
        expect(typeof notify.version).toBe("string");
        expect(notify.version).toEqual(_$aNoty.getVersion());
    });

    it("should update the options", function() {
        notify.max(10);
        expect(_$aNoty.max).toBe(10);
        notify.delay(1000);
        expect(_$aNoty.delay).toBe(1000);
        notify.closeOnClick(false);
        expect(_$aNoty.closeOnClick).toBe(false);

        document.body.appendChild(elContainer);
        notify.parent("#testing");
        expect(_$aNoty.getParent().id).toBe("testing");

        notify.position("bottom");
        notify.info("bottom");
        expect(document.querySelector("#" + notify.id).classList.contains("bottom")).toBe(true);
    });

    it("should reset all options when reset called", function() {
        notify.max(10);
        notify.delay(1000);
        notify.closeOnClick(false);
        document.body.appendChild(elContainer);
        notify.parent("#testing");
        notify.position("bottom");
        notify.info("reset");
        expect(document.querySelectorAll("#testing #" + notify.id).length).toBe(1);

        notify.reset();

        expect(_$aNoty.delay).toBe(5000);
        expect(_$aNoty.closeOnClick).toBe(true);
        expect(_$aNoty.max).toBe(5);
        expect(_$aNoty.getParent()).toBe(document.body);

        notify.info("reset");
        var lst = document.querySelector("#" + notify.id).classList;
        expect(lst.contains("bottom")).toBe(false);
        expect(lst.contains("top")).toBe(true);
        expect(lst.contains("left")).toBe(true);

        expect(document.querySelectorAll("body #" + notify.id).length).toBe(1);
    });

    it("should inject CSS by default, only once", function() {
        expect(!!document.querySelector("#a-noty-style")).toBe(true);
    });

    it("should remove CSS", function() {
        _$aNoty.removeCSS();
        expect(!!document.querySelector("#a-noty-style")).toBe(false);
    });

    it("should not inject CSS if element already exists", function() {
        _$aNoty.removeCSS();

        var fakeCSS = document.createElement("fake");
        fakeCSS.id = "a-noty-style";
        document.body.appendChild(fakeCSS);

        _$aNoty.injectCSS();

        expect(document.querySelector("#a-noty-style").tagName).toBe("FAKE");
    });
});
