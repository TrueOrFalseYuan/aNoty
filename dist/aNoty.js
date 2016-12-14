var aNoty = function() {
    "use strict";

    var A_NOTY_TRANSITION_DURATION = 500;
    var A_NOTY_ID_PREFIX = "a-noty-";
    var A_NOTY_STYLE_ID = "a-noty-style";

    var _version = "0.1.0";
    var _id = A_NOTY_ID_PREFIX + aNoty.prototype.ID++;

    var _default = {
        parent: "body",
        delay: 5000,
        max: 5,
        closeOnClick: true,
        containerClass: "an-container",
        containerStyle: "",
        position: ""
    };

    /**
     * private object
     */
    var _noty = {

        /**
         * set the options
         */
        set: function(options) {
            for (var name in options) {
                if (options[name]) {
                    _noty[name] = options[name];
                }
            }
        },

        /**
         * Reset the global options with default values
         */
        reset: function() {
            this.set(_default);
        },


        hide: function(el) {
            var removeEl = function() {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            };

            el.classList.remove("show");
            el.classList.add("hide");
            el.addEventListener("transitionend", removeEl);

            // Fallback for no transitions.
            setTimeout(removeEl, A_NOTY_TRANSITION_DURATION);
        },

        /**
         * Add new notification
         * If a type is passed, a class name "{type}" will get added.
         * This allows for custom look and feel for various types of notifications.
         */
        show: function(message, type, click) {
            var existing = document.querySelectorAll("#" + _id + " > div");
            if (existing) {
                var diff = existing.length - this.max;
                if (diff >= 0) {
                    for (var i = 0, _i = diff + 1; i < _i; i++) {
                        this.close(existing[i], -1);
                    }
                }
            }

            var noty = document.createElement("div");
            noty.className = (type || "default");
            if (this.template) {
                noty.innerHTML = this.template(message);
            } else {
                noty.innerHTML = message;
            }

            this.getContainer().appendChild(noty);

            // Add the click handler, if specified.
            if ("function" === typeof click) {
                noty.addEventListener("click", click);
            }

            setTimeout(function() {
                noty.className += " show";
            }, 10);

            this.close(noty, this.delay);
        },

        /**
         * Close the notification
         */
        close: function(el, wait) {
            if (this.closeOnClick) {
                el.addEventListener("click", function() {
                    _noty.hide(el);
                });
            }
            wait = wait == undefined ? this.delay : wait;
            if (wait <= 0) {
                _noty.hide(el);
            } else {
                setTimeout(function() {
                    _noty.hide(el);
                }, wait);
            }
        },

        injectCSS: function() {
            if (!document.querySelector("#" + A_NOTY_STYLE_ID)) {
                var head = document.getElementsByTagName("head")[0];
                var css = document.createElement("style");
                css.type = "text/css";
                css.id = A_NOTY_STYLE_ID;
                css.innerHTML = ".an-container{position:absolute;z-index:1}.an-container>div{position:relative;clear:both;overflow:hidden;height:auto;box-sizing:border-box;box-shadow:0 2px 5px 0 rgba(0,0,0,.2);border-radius:0;-webkit-transition:all .2s cubic-bezier(.4,.1,.2,1);transition:all .2s cubic-bezier(.4,.1,.2,1);color:#fff}.an-container>div,.an-container>div.default{background:rgba(0,0,0,.8)}.an-container>div.error{background:rgba(244,67,54,.8)}.an-container>div.success{background:rgba(76,175,80,.9)}.an-container>div,.an-container>div.hide{max-height:0;margin:0;padding:0;opacity:0;pointer-events:none}.an-container>div.show{max-height:none;padding:12px 24px;opacity:1;pointer-events:auto}.an-container.top{top:24px}.an-container.top>div.show{margin-bottom:12px}.an-container.middle{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.an-container.middle>div.show{margin:6px 0}.an-container.bottom{bottom:24px}.an-container.bottom>div.show{margin-top:12px}.an-container.bottom:not(.left):not(.right),.an-container.middle:not(.left):not(.right),.an-container.top:not(.left):not(.right){left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.an-container.bottom:not(.left):not(.right):not(.center),.an-container.middle:not(.left):not(.right):not(.center),.an-container.top:not(.left):not(.right):not(.center){width:80%}.an-container.bottom:not(.left):not(.right)>div,.an-container.middle:not(.left):not(.right)>div,.an-container.top:not(.left):not(.right)>div{text-align:center}.an-container.bottom:not(.left):not(.right)>div,.an-container.bottom:not(.left):not(.right)>div.hide,.an-container.middle:not(.left):not(.right)>div,.an-container.middle:not(.left):not(.right)>div.hide,.an-container.top:not(.left):not(.right)>div,.an-container.top:not(.left):not(.right)>div.hide{-webkit-transform:scale(.01);transform:scale(.01)}.an-container.bottom:not(.left):not(.right)>div.show,.an-container.middle:not(.left):not(.right)>div.show,.an-container.top:not(.left):not(.right)>div.show{-webkit-transform:scale(1);transform:scale(1)}.an-container.left{left:24px}.an-container.left>div{float:left}.an-container.left>div,.an-container.left>div.hide{-webkit-transform:translateX(-200%) scale(.01);transform:translateX(-200%) scale(.01)}.an-container.left>div.show{-webkit-transform:translateX(0) scale(1);transform:translateX(0) scale(1)}.an-container.center{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.an-container.center>div{float:left;text-align:center}.an-container.right{right:24px}.an-container.right>div{float:right}.an-container.right>div,.an-container.right>div.hide{-webkit-transform:translateX(200%) scale(.01);transform:translateX(200%) scale(.01)}.an-container.right>div.show{-webkit-transform:translateX(0) scale(1);transform:translateX(0) scale(1)}";
                head.insertBefore(css, head.firstChild);
            }
        },

        removeCSS: function() {
            var css = document.querySelector("#" + A_NOTY_STYLE_ID);
            if (css && css.parentNode) {
                css.parentNode.removeChild(css);
            }
        },

        getParent: function() {
            var t = this.parent;
            return "string" == typeof t ? document.querySelector(t) : "object" == typeof t ? t : void 0;
        },

        getContainer: function() {
            var container = document.querySelector("#" + _id);
            if (!container) {
                container = document.createElement("div");
                container.id = _id;
                if (typeof this.containerStyle == "string") {
                    container.style = this.containerStyle;
                } else if (typeof this.containerStyle == "object") {
                    for (var name in this.containerStyle) {
                        if (this.containerStyle[name]) {
                            container.style[name] = this.containerStyle[name];
                        }
                    }
                }
                this.getParent().appendChild(container);
            }
            container.className = this.containerClass + " " + this.position;
            return container;
        },

        getVersion: function(){
            return _version;
        }

    };
    _noty.reset();
    _noty.injectCSS();

    return {
        _$$: _noty,
        /**
         *  Final methods
         */
        notify: function(message, type, click) {
            _noty.show(message, type, click);
        },
        info: function(message, click) {
            _noty.show(message, "default", click);
        },
        success: function(message, click) {
            _noty.show(message, "success", click);
        },
        error: function(message, click) {
            _noty.show(message, "error", click);
        },
        clear: function() {
            _noty.getContainer().innerHTML = "";
        },

        /**
         * Config methods
         */
        set: function(opt) {
            _noty.set(opt);
            return this;
        },
        reset: function() {
            _noty.reset();
            _noty.template = undefined;
            return this;
        },
        parent: function(elem) {
            _noty.parent = elem;
            return this;
        },
        position: function(str) {
            _noty.position = str;
            return this;
        },
        delay: function(time) {
            if (parseInt(time)) {
                _noty.delay = parseInt(time);
            }
            return this;
        },
        max: function(num) {
            if (parseInt(num)) {
                _noty.max = parseInt(num);
            }
            return this;
        },
        closeOnClick: function(bool) {
            _noty.closeOnClick = !!bool;
            return this;
        },
        containerClass: function(str) {
            _noty.containerClass = str;
            return this;
        },
        containerStyle: function(str) {
            _noty.containerStyle = str;
            return this;
        },
        template: function(templateMethod) {
            if ("function" == typeof templateMethod) {
                _noty.template = templateMethod;
            }
            return this;
        },
        id: _id,
        version: _noty.getVersion()
    };
};

aNoty.prototype.ID = 1;

// AMD, window, and NPM support
if ("undefined" !== typeof module && !!module && !!module.exports) {

    // Preserve backwards compatibility
    module.exports = function() {
        "use strict";
        return new aNoty();
    };
    var obj = new aNoty();
    for (var key in obj) {
        module.exports[key] = obj[key];
    }
} else if (typeof define === "function" && define.amd) {
    define(function() {
        "use strict";
        return new aNoty();
    });
} else {
    window.notify = new aNoty();
}
