var aNoty = function() {
    "use strict";

    var A_NOTY_TRANSITION_DURATION = 500;
    var A_NOTY_ID_PREFIX = "a-noty-";
    var A_NOTY_STYLE_ID = "a-noty-style";
    var A_NOTY_CLASS_PREFIX = "an-";

    var _version = "0.1.0";
    var _id = A_NOTY_ID_PREFIX + aNoty.prototype.ID++;

    var _default = {
        parent: "body",
        delay: 5000,
        max: 5,
        closeOnClick: true,
        containerClass: "an-container",
        containerStyle: "",
        position: "top left"
    };

    var removeElement = function(ele) {
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
    };

    var attachEventListener = function(ele, evt, method) {
        if (ele.addEventListener) {
            ele.addEventListener(evt, method);
        } else if (ele.attachEvent) {
            ele.attachEvent("on" + evt, method);
        }
    };

    var getAllNoties = function(p) {
        var noties = new Array();
        var children = p.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeType == 1 && children[i].tagName.toLowerCase() == "div") {
                noties.push(children[i]);
            }
        }
        return noties;
    };

    var getPositionClasses = function(pos) {
        if (!pos) {
            return "";
        }
        var arr = pos.split(" ");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = A_NOTY_CLASS_PREFIX + arr[i];
        }
        return arr.join(" ");
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
                if (options[name] != undefined) {
                    _noty[name] = options[name];
                }
            }
        },

        /**
         * Reset the global options with default values
         */
        reset: function() {
            this.set(_default);
            var ele = document.getElementById(_id);
            if (ele) {
                removeElement(ele);
            }
        },


        hide: function(el) {
            el.classList.remove(A_NOTY_CLASS_PREFIX + "show");
            el.classList.add(A_NOTY_CLASS_PREFIX + "hide");
            attachEventListener(el, "transitionend", removeElement);

            // Fallback for no transitions.
            setTimeout(function() {
                removeElement(el);
            }, A_NOTY_TRANSITION_DURATION);
        },

        /**
         * Add new notification
         * This allows for custom look and feel for various types of notifications.
         */
        show: function(message, type, click) {
            var existing = getAllNoties(this.getContainer());
            if (existing) {
                var diff = existing.length - this.max;
                if (diff >= 0) {
                    for (var i = 0, _i = diff + 1; i < _i; i++) {
                        this.close(existing[i], -1);
                    }
                }
            }

            var noty = document.createElement("div");
            noty.className = A_NOTY_CLASS_PREFIX + (type || "default");
            if (this.template) {
                noty.innerHTML = this.template(message);
            } else {
                noty.innerHTML = message;
            }

            this.getContainer().appendChild(noty);

            // Add the click handler, if specified.
            if ("function" === typeof click) {
                attachEventListener(noty, "click", click);
            }

            setTimeout(function() {
                noty.classList.add(A_NOTY_CLASS_PREFIX + "show");
            }, 10);

            this.close(noty, this.delay);
        },

        /**
         * Close the notification
         */
        close: function(el, wait) {
            if (this.closeOnClick) {
                attachEventListener(el, "click", function() {
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
            if (!document.getElementById(A_NOTY_STYLE_ID)) {
                var head = document.getElementsByTagName("head")[0];
                var css = document.createElement("style");
                css.type = "text/css";
                css.id = A_NOTY_STYLE_ID;
                css.innerHTML = "/* style.css */";
                head.insertBefore(css, head.firstChild);
            }
        },

        removeCSS: function() {
            var css = document.getElementById(A_NOTY_STYLE_ID);
            if (css && css.parentNode) {
                css.parentNode.removeChild(css);
            }
        },

        getParent: function() {
            var t = this.parent;
            if ("string" == typeof t) {
                if (document.querySelector) {
                    t = document.querySelector(t);
                } else {
                    t = document.getElementById(t);
                    if (!t) {
                        t = document.getElementsByTagName(t)[0];
                    }
                }
                this.parent = t;
            }
            if ("object" == typeof t) {
                return t;
            } else {
                return;
            }
        },

        getContainer: function() {
            var container = document.getElementById(_id);
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
            container.className = this.containerClass + " " + getPositionClasses(this.position);
            return container;
        },

        getVersion: function() {
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
            var ele = document.getElementById(_id);
            if (ele) {
                removeElement(ele);
            }
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
