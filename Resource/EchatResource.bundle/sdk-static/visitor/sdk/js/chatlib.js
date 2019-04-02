/**
 * Created by lihong on 15-8-20.
 */
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
(function () {
    //echat 不使用模块化加载
    var EChatQuery = (function () {
        var $, emptyArray = [], concat = emptyArray.concat,
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            rnative = /^[^{]+\{\s*\[native \w/,
            rclass = /[\t\r\n\f]/g,
            rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            rnotwhite = (/\S+/g),
            Expr = {find: {}, filter: {}},
            preferredDoc = window.document,
            document = window.document,
            docElem,
            expando = "echatQuery" + 1 * new Date(),
            support = {},
        // Instance methods
            arr = [],
            pop = arr.pop,
            push_native = arr.push,
            slice = arr.slice,
            push = arr.push,
            contains, setDocument,
        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
            runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
            funescape = function (_, escaped, escapedWhitespace) {
                var high = "0x" + escaped - 0x10000;
                // NaN means non-codepoint
                // Support: Firefox<24
                // Workaround erroneous numeric interpretation of +"0x"
                return high !== high || escapedWhitespace ?
                    escaped :
                    high < 0 ?
                        // BMP codepoint
                        String.fromCharCode(high + 0x10000) :
                        // Supplemental Plane codepoint (surrogate pair)
                        String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
            },

        // http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
            /**
             * Sets document-related variables once based on the current document
             * @param {Element|Object} [doc] An element or document object to use to set the document
             * @returns {Object} Returns the current document
             */
            unloadHandler = function () {
                setDocument();
            };

        function zid(element) {
            return element._zid || (element._zid = _zid++);
        }

        var filter = {
            "TAG": function (nodeNameSelector) {
                var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ?
                    function () {
                        return true;
                    } :
                    function (elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
            },
            "CLASS": function (className) {
                //var pattern = classCache[className + " "];
                //return pattern ||
                var pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)");
                return function (elem) {
                    return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
                };
            }
        };

        /**
         * Support testing using an element
         * @param {Function} fn Passed the created div and expects a boolean result
         */
        function assert(fn) {
            if (!document.createElement) {
                //debugger;
            }
            var div = document.createElement("div");

            try {
                return !!fn(div);
            } catch (e) {
                return false;
            } finally {
                // Remove from its parent by default
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                // release memory in IE
                div = null;
            }
        }

        support.getElementsByTagName = assert(function (div) {
            div.appendChild(document.createComment(""));
            return !div.getElementsByTagName("*").length;
        });

        setDocument = function (node) {
            var hasCompare, parent,
                doc = node ? node.ownerDocument || node : preferredDoc;

            // Return early if doc is invalid or already selected
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                //return document;
            }
            // Update global variables
            document = doc;
            docElem = document.documentElement;
            // Support: IE 9-11, Edge
            // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
            if ((parent = document.defaultView) && parent.top !== parent) {
                // Support: IE 11
                if (parent.addEventListener) {
                    parent.addEventListener("unload", unloadHandler, false);

                    // Support: IE 9 - 10 only
                } else if (parent.attachEvent) {
                    parent.attachEvent("onunload", unloadHandler);
                }
            }

            /* Attributes
             ---------------------------------------------------------------------- */

            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties
            // (excepting IE8 booleans)
            support.attributes = assert(function (div) {
                div.className = "i";
                return !div.getAttribute("className");
            });

            /* getElement(s)By*
             ---------------------------------------------------------------------- */

            // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function (div) {
                div.appendChild(document.createComment(""));
                return !div.getElementsByTagName("*").length;
            });

            // Support: IE<9
            support.getElementsByClassName = rnative.test(doc.getElementsByClassName);

            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function (div) {
                docElem.appendChild(div).id = expando;
                return !document.getElementsByName || !document.getElementsByName(expando).length;
            });

            // ID find and filter
            if (support.getById) {
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== "undefined") {
                        var m = context.getElementById(id);
                        return m ? [m] : [];
                    }
                };
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                // Support: IE6/7
                // getElementById is not reliable as a find shortcut
                delete Expr.find["ID"];

                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        var node = typeof elem.getAttributeNode !== "undefined" &&
                            elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }
            // Tag
            support.qsa = rnative.test(doc.querySelectorAll);
            Expr.find["TAG"] = support.getElementsByTagName ?
                function (tag, context) {
                    if (typeof context.getElementsByTagName !== "undefined") {
                        return context.getElementsByTagName(tag);

                        // DocumentFragment nodes don't have gEBTN
                    } else if (support.qsa) {
                        return context.querySelectorAll(tag);
                    }
                } :
                function (tag, context) {
                    var elem,
                        tmp = [],
                        i = 0,
                    // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                        results = preferredDoc.getElementsByTagName(tag);//context.getElementsByTagName(tag);

                    // Filter out possible comments
                    //var resu = filter.TAG(tag,context);
                    //if (tag === "*") {
                    while ((elem = results[i++])) {
                        if (elem.nodeType === 1 && contains(context, elem)) {
                            tmp.push(elem);
                        }
                    }
                    return tmp;
                    //}
                    //return results;
                };
            // Class
            Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
                if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            };

            /* Contains
             ---------------------------------------------------------------------- */
            hasCompare = rnative.test(docElem.compareDocumentPosition);

            // Element contains another
            // Purposefully self-exclusive
            // As in, an element does not contain itself
            contains = hasCompare || rnative.test(docElem.contains) ?
                function (a, b) {
                    if(!a||!b){
                        return false;
                    }
                    var adown = a.nodeType === 9 ? a.documentElement : a,
                        bup = b && b.parentNode;
                    return a === bup || !!( bup && bup.nodeType === 1 && (
                            adown.contains ?
                                adown.contains(bup) :
                            a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
                        ));
                } :
                function (a, b) {
                    if(!a){
                        return false;
                    }
                    if (b) {
                        while ((b = b.parentNode)) {
                            if (b === a) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
            return doc;
        };
        setDocument();
        function classCache() {
            var keys = [];

            function cache(key, value) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if (keys.push(key + " ") > Expr.cacheLength) {
                    // Only keep the most recent entries
                    delete cache[keys.shift()];
                }
                return (cache[key + " "] = value);
            }

            return cache;
        }

        //仅支持一个选择器 不可混合使用。
        //ID CLASS TAG,可指定搜索的父级元素
        function Query(selector, context, results) {
            var newContext = context && context.ownerDocument,
                results = results || [];

            // HANDLE: $(""), $(null), $(undefined), $(false)
            if (!selector) {
                this.length = 0;
                return this;
            }

            if (selector.nodeType || selector == window.document || selector == window) {
                this.context = selector;
                this.results = [selector];
                this.length = 1;
                return this;

                // HANDLE: $(function)
                // Shortcut for document ready
            } else if (isFunction(selector)) {
                return typeof ready !== "undefined" ?
                    this.readyList.push(selector) :
                    // Execute immediately if ready is not present
                    selector();
            } else if (selector instanceof Query) {
                return selector;
            } else if (typeof selector === "string") {

            }
            // Try to shortcut find operations (as opposed to filters) in HTML documents

            if (( context ? context.ownerDocument || context : preferredDoc ) !== document) {
                setDocument(context);
            }
            context = context || document;

            this.selector = selector;
            this.context = context;

            this.results = mySiz(selector, context, results, newContext);
            this.length = this.results.length;
        }

        function mySiz(selector, context, results, newContext) {
            if (!selector)return results;
            var m, i, elem, match, newSelector, nodeType = context ? context.nodeType : 9;

            // If the selector is sufficiently simple, try using a "get*By*" DOM method
            // (excepting DocumentFragment context, where the methods don't exist)

            // nodeType defaults to 9, since context defaults to document
            match = rquickExpr.exec(selector);
            if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

                // ID selector
                if ((m = match[1])) {

                    // Document context
                    if (nodeType === 9) {
                        if ((elem = context.getElementById(m))) {
                            // Support: IE, Opera, Webkit
                            // TODO: identify versions
                            // getElementById can match elements by name instead of ID
                            if (elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        } else {
                            return results;
                        }
                        // Element context
                    } else {
                        // Context is not a document
                        if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) &&
                            contains(context, elem) && elem.id === m) {
                            results.push(elem);
                            return results;
                        }
                    }

                    // tag selector
                } else if ((m = match[2])) {
                    if (elems = Expr.find["TAG"](m, context)) {
                        push.apply(results, elems);
                    }
                    return results;

                    // Class selector
                } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

                    push.apply(results, context.getElementsByClassName(m));
                    return results;
                }
            }

            // Take advantage of querySelectorAll
            if (nodeType !== 1) {
                newContext = context;
                newSelector = selector;
            }
            if (newSelector) {
                try {
                    push.apply(results,
                        newContext.querySelectorAll(newSelector)
                    );
                    return results;
                } catch (qsaError) {
                } finally {

                }
            }

            //如果ID tag getElementsByClassName querySelectorAll没找到，就还剩下普通浏览器的CLASS选择器了。
            //继续查找
            var elems = Expr.find["TAG"]("*", context),
                len = elems.length, tag;
            i = 0;
            if (tag = match[2]) {
                var tmp = [];
                // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                results = context.getElementsByTagName(tag);
                elem = undefined;
                // Filter out possible comments
                if (tag === "*") {
                    while ((elem = results[i++])) {
                        if (elem.nodeType === 1) {
                            tmp.push(elem);
                        }
                    }

                    return tmp;
                }
                return results;
            } else {
                var matcher = filter.CLASS;
                var matches = matcher(match[3]);
                for (; i !== len && (elem = elems[i]) != null; i++) {
                    if (elem && elem.nodeType === 1) {
                        //j = 0;
                        //if (!context && elem.ownerDocument !== document) {
                        //    setDocument(elem);
                        //}
                        if (matches(elem)) {
                            results.push(elem);
                        }
                    }
                }

            }
            return results;
        }


        $ = function (selector, context, results) {
            return new Query(selector, context);
        }
        var jsonpID = 0;
        var jsre = /(\=)\?(&|$)|\?\?/i;

        $.ajaxJSONP = function (options, deferred) {
            if (!('type' in options)) return $.ajax(options);
            var document = window.document;
            var _callbackName = options.jsonpCallback,
                callbackName = (isFunction(_callbackName) ?
                        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
                node = document.createElement('script'),
                originalCallback = window[callbackName],
                responseData,
                abort = function (errorType) {
                    $(script).triggerHandler('error', errorType || 'abort')
                },
                xhr = {abort: abort};//, abortTimeout

            if (deferred) deferred.promise(xhr)

            var head = document.getElementsByTagName("head")[0];

            function onload(e, errorType) {
                //clearTimeout(abortTimeout);
                $(node).remove();
                if (e && e.type == 'error' || !responseData) {
                    options.error && options.error(null, errorType || 'error', xhr, options, deferred)
                } else {
                    options.success && options.success(responseData[0], xhr, options, deferred)
                }

                window[callbackName] = originalCallback
                if (responseData && isFunction(originalCallback))
                    originalCallback(responseData[0]);

                originalCallback = responseData = undefined
            }

            window[callbackName] = function () {
                responseData = arguments
            }
            var replace = "$1" + callbackName + "$2";
            options.url = options.url.replace(jsre, replace);
            var p = '';
            if (options.data) {
                for (var k in options.data) {
                    var d = ((typeof options.data[k] == "string") ? options.data[k] : JSON.stringify(options.data[k]));
                    p = '&' + k + '=' + encodeURIComponent(d);
                }
                if (p) {
                    p = p.substring(1);
                    p += "&";
                }
            }

            // options.url += (/\?/.test(options.url) ? "&" : "?") + p + ('jsonp' || options.jsonpCB) + "=" + callbackName;
            options.url += (/\?/.test(options.url) ? "&" : "?") + p + (options.jsonpCB||'jsonp') + "=" + callbackName;

            //设置ONLOAD
            var supportOnload = "onload" in node;
            if (supportOnload) {
                node.onload = onload
                node.onerror = function () {
                    onload({type: "error"})
                }
            } else {
                node.onreadystatechange = function () {
                    if (/loaded|complete/.test(node.readyState)) {
                        onload()
                    }
                }
            }
            if (options.beforeSend && options.beforeSend(xhr) === false) {
                console.log('abort', options);
                return xhr
            }
            node.src = options.url;
            document.getElementsByTagName("head")[0].appendChild(node);

            //超时
            //if (options.timeout > 0) abortTimeout = setTimeout(function(){
            //    abort('timeout')
            //}, options.timeout)
            return xhr
        }

        $.ajax = function (o) {
            if (o.jsonp == "jsonp" || o.jsonp == "JSONP"||o.type=='jsonp'||o.type=='JSONP') {
                return $.ajaxJSONP(o, o.deferred);
            }
            function XHR() {
                var xhr;
                try {
                    xhr = new XMLHttpRequest();
                } catch (e) {
                    var IEXHRVers = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
                    for (var i = 0, len = IEXHRVers.length; i < len; i++) {
                        try {
                            xhr = new ActiveXObject(IEXHRVers[i]);
                            break;
                        } catch (e) {
                            continue;
                        }
                    }
                }
                return xhr;
            }

            var xhr = XHR();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {// 4 = "loaded"
                    if (xhr.status == 200) {// 200 = OK
                        //目前只处理了这种。
                        o.success && o.success(xhr.responseText);
                    }
                    else {
                        o.error(xhr, xhr.responseText);
                    }
                }
            };
            //异步
            xhr.open(o.type, o.url, true);
            if(o.header){
                for (var name in o.header) {
                    xhr.setRequestHeader(name, o.header[name]);
                }
            }
            if ((!o.header) || (!o.header['Content-Type'] && !o.header['Content-type'] && !o.header['content-type'] ) || ( o.contentType !== false)) {
                xhr.setRequestHeader("Content-type", o.contentType || 'application/json;charset=UTF-8;');
            }
            o.beforeSend && o.beforeSend(xhr);
            // 并且get方式发送请求时send参数是null
            var d = o.data;
            var str = '';
            if(d&& Object.prototype.toString.apply(d).toLowerCase()==('[object object]')){
                for(var key in d){
                    str += '&' + key + '=' + encodeURIComponent(d[key]);
                }
                // d = str;
            }
            if (window.XMLHttpRequest) {
                if (!d) d = null
            } else {
                if (!d) d = undefined
            }

            xhr.send(str ? str.substring(1) : d);
        }

        var rmsPrefix = /^-ms-/,
            rdashAlpha = /-([\da-z])/gi,

            camelCase = function (string) {
                return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, function (all, letter) {
                    return letter.toUpperCase();
                });
            },
            cssProps;

        (function () {
            var div, style, a;
            div = document.createElement("div");
            div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
            a = div.getElementsByTagName("a")[0];
            style = a && a.style;
            style = style.cssText = "float:left;opacity:.5";
            cssProps = {
                // normalize float css property
                "float": (!!style.cssFloat) ? "cssFloat" : "styleFloat"
            };
            div = null;
            a = null;
        })();
        function getStyleName(name) {
            var n = camelCase(name);
            return cssProps[n] || n;
        }

        var isFunction = function (obj) {
            if (obj == null) {
                return false;
            }
            return typeof obj === "function" || Object.prototype.toString.call(obj) === "[object Function]";
        };
        var isArray = function (obj) {
            return Object.prototype.toString.apply(obj) === "[object Array]";
        };
        var isString = function (obj) {
            return typeof obj == 'string'
        };

        var class2type = {},
            toString = class2type.toString;

        function type(obj) {
            return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
        }

        function isWindow(obj) {
            return obj != null && obj == obj.window
        }

        function isDocument(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE
        }

        function isObject(obj) {
            return type(obj) == "object"
        }

        var isPlainObject = function (obj) {
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
        }
        var trim = function (text) {
            return text == null ?
                "" :
                ( text + "" ).replace(rtrim, "");
        }

        function extend(target, source, deep) {
            for (var key in source)
                if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                    if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                        target[key] = {}
                    if (isArray(source[key]) && !isArray(target[key]))
                        target[key] = []
                    extend(target[key], source[key], deep)
                }
                else if (source[key] !== undefined) target[key] = source[key]
        }

        $.extend = function (target, source, deep) {
            for (var key in source)
                if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                    if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                        target[key] = {}
                    if (isArray(source[key]) && !isArray(target[key]))
                        target[key] = []
                    extend(target[key], source[key], deep)
                }
                else if (source[key] !== undefined) target[key] = source[key]
            return target;
        }

        $.cookie = function (key, value, options) {

            // key and at least value given, set cookie...
            if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
                options = $.extend({}, options);

                if (value === null || value === undefined) {
                    options.expires = -1;
                }

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }

                value = String(value);
                return (document.cookie = [
                    encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    '; path=' + (options.path||'/'),//默认/
                    (options.domain) ? '; domain=' + (options.domain) : '',
                    // (options.domain || window.mainDomain) ? '; domain=' + (options.domain || window.mainDomain) : '',
                    options.secure ? '; secure' : ''
                ].join(''));
            }

            // key and possibly options given, get cookie...
            options = value || {};
            var decode = options.raw ? function (s) {
                return s;
            } : decodeURIComponent;

            var pairs = document.cookie.split('; ');
            for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
                if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
            }
            return null;
        };
        $.toJSON = JSON.stringify;
        var attrFilter = {
            src: true,
            href: true
        }
        var fn = {
            isFunction: isFunction,
            isArray: isArray,
            isString: isString,
            isObject: isObject,
            isPlainObject: isPlainObject,
            trim: trim,
            contains: contains,
            readyList: [],
            find: function (selector) {
                //TODO 这个方法还没测
                var that = {};
                this.each(function (i, element) {
                    Query.call(that, selector, element, that.results);
                });
                return that;
            },
            match: function (target, selector) {
                var myq = new Query(selector);
                var match = null;
                myq.each(function (i, elem) {
                    if (elem == target || contains(elem, target)) {
                        match = elem;
                        return true;//break;
                    }
                })
                return match;
            },
            parents:function (selector) {
                // 只修改了result 没有修改selector等
                var match,matchFun,element,parent;
                if (this.results && this.results.length > 0 && (match = rquickExpr.exec(selector))) {
                    // ID selector
                    if ((m = match[1])) {
                        matchFun = function (elem) {
                            return elem.id == m;
                        }
                        // tag selector
                    } else if ((m = match[2])) {
                        m = m.to
                        matchFun = function (elem) {
                            return elem.tagName == m;
                        }
                    } else if (m = match[3]) {
                        matchFun = function (elem) {
                            if (elem.className) {
                                var clss = elem.className.split(' ');
                                for (var i = 0; i < clss.length; i++) {
                                    if (clss[i] == m) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        }
                    }
                    if(matchFun) {
                        element = this.results[0];
                        while (parent = element.parentNode) {
                            if (matchFun(parent)) {
                                this.results.length = 1;
                                this.results[0] = parent;
                                return this;
                                break;
                            }
                            element = parent;
                        }
                    }
                }
                this.results.length = 0;
                return this;
            },
            html: function (html) {
                if (html||html==='') {
                    return this.each(function (i, element) {
                        element.innerHTML = html;
                    });
                } else {
                    return (this.results && this.results[0] ? this.results[0].innerHTML : null);
                }
            },
            text: function (html) {
                if (typeof html == 'string') {
                    return this.each(function (i, element) {
                        if (typeof element.textContent == "string") {
                            element.textContent = html;
                        } else {
                            element.innerText = html;
                        }
                    });
                } else {
                    return (this.results && this.results[0] ? (this.results[0].textContent || this.results[0].innerText) : null);
                }
            },
            append: function (html) {
                //debugger
                if (!html)return;
                /* var els = null;
                 if (isString(html)) {
                 var d = document.createElement("div");
                 d.innerHTML = html;
                 els = d.childNodes;
                 }
                 var ap = els ? function (i, el) {
                 for (var i = 0; i < els.length; i++) {
                 el.appendChild(els[i]);
                 }
                 } : function (i, el) {
                 el.appendChild(html);
                 }*/
                if (isString(html)) {
                    var div = document.createElement("div");
                    div.innerHTML = html;
                    var list = div.childNodes;
                    this.each(function (i, el) {
                        var node, i = 0;
                        while (node = list[i++]) {
                            if (node.nodeType == 1) {
                                node = node.cloneNode(true);
                                el.appendChild(node);
                            }
                        }
                    });
                } else {
                    this.each(function (i, el) {
                        el.appendChild(html);
                    });
                }
                //d = null
                return this;
            },
            insertBefore:function (html,beforeEl) {
                if (!html)return;
                if (isString(html)) {
                    var div = document.createElement("div");
                    div.innerHTML = html;
                    var list = div.childNodes;
                    this.each(function (i, el) {
                        var node, i = 0;
                        while (node = list[i++]) {
                            if (node.nodeType == 1) {
                                node = node.cloneNode(true);
                                el.insertBefore(html,beforeEl||el.childNodes[0]);
                            }
                        }
                    });
                } else {
                    this.each(function (i, el) {
                        el.insertBefore(html,beforeEl||el.childNodes[0]);
                    });
                }
                //d = null
                return this;

            },
            show: function () {
                this.each(function (i, element) {
                    element.style.display = "block";
                });
                return this;
            },
            hide: function () {
                //这个方法也待完善，需先检测块级元素 和 行内元素
                return this.each(function (i, element) {
                    element.style.display = "none";
                });
            },
            removeClass: function (cls) {
                var len = this.results.length, elem, cur, j = 0, clazz, finalValue, clsName, i = 0;
                var classes = ( cls || "" ).match(rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this.results[i];
                    //clsName = typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "";
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace(rclass, " ") :
                        ""
                    );
                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            // Remove *all* instances
                            while (cur.indexOf(" " + clazz + " ") >= 0) {
                                cur = cur.replace(" " + clazz + " ", " ");
                            }
                        }

                        // only assign if different to avoid unneeded rendering.
                        finalValue = cls ? trim(cur) : "";
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    } else {
                        elem.className = "";
                    }
                }
                return this;
            },
            addClass: function (cls) {
                var len = this.results.length, elem, cur, j = 0, clazz, finalValue, clsName, i = 0;
                var classes = ( cls || "" ).match(rnotwhite) || [];
                for (; i < len; i++) {
                    elem = this.results[i];
                    //clsName = typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "";
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace(rclass, " ") :
                        ""
                    );
                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            // Remove *all* instances
                            while (cur.indexOf(" " + clazz + " ") < 0) {
                                cur += clazz + " ";
                            }
                        }

                        // only assign if different to avoid unneeded rendering.
                        finalValue = cls ? trim(cur) : "";
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    } else {
                        elem.className = cls;
                    }
                }
                return this;
            },

            /*
             /*getAttribute总结：
             1:常规属性建议使用 node.XXXX。
             2:自定义属性建议使用node.getAttribute("XXXX")。
             3:当获取的目标是JS里的关键字时建议使用node.getAttribute("XXX")，如label中的for。
             4:当获取的目标是保留字,如：class,请使用className代替。
             */
            attr: function (name, val) {
                if (!name) {
                    return this;
                }
                if (typeof val == "undefined") {
                    if (typeof name === "string") {
                        //获取属性
                        if (this.results && this.results.length > 0) {
                            return this.getAttr(this.results[0], name);
                        }
                    } else {
                        //设置属性集合
                        var len = this.results ? this.results.length : 0;
                        for (var key in name) {
                            for (var i = 0; i < len; i++) {
                                var elem = this.results[i];
                                attrFilter[key] ? elem[key] = name[key] : elem.setAttribute(key + '', name[key]);
                            }
                        }
                    }
                } else {
                    //设置一个属性
                    var len = this.results ? this.results.length : 0;
                    for (var i = 0; i < len; i++) {
                        var elem = this.results[i];
                        elem.setAttribute(name, val);
                        attrFilter[name] ? elem[name] = val : elem.setAttribute(name, val);
                    }
                }
                return this;
            },
            css: function (name, val) {
                if (!name) {
                    return this;
                }
                if (typeof val == "undefined") {
                    if (typeof name === "string") {
                        this.css(name, val === 0 ? "0" : "inherit");
                    } else {
                        var len = this.results ? this.results.length : 0;
                        for (var i = 0; i < len; i++) {
                            for (var key in name) {
                                var n = camelCase(key);
                                n = cssProps[n] || n;
                                //不会自动加上支持的浏览器前缀。如-webkit;
                                var elem = this.results[i];
                                elem.style[n] = name[key];
                            }
                        }
                    }
                } else {
                    try {
                        var len = this.results ? this.results.length : 0;
                        for (var i = 0; i < len; i++) {
                            var n = camelCase(name);
                            n = cssProps[n] || n;
                            //不会自动加上支持的浏览器前缀。如-webkit;
                            var elem = this.results[i];
                            elem.style[n] = val;
                        }
                    } catch (e) {
                        return this;
                    }
                }
                return this;
            },
            remove: function () {
                var len = this.results ? this.results.length : 0;
                for (var i = 0; i < len; i++) {
                    //不会自动加上支持的浏览器前缀。如-webkit;
                    var elem = this.results[i];
                    elem.parentNode.removeChild(elem);
                }
                this.length = 0;
                this.results = [];
                return this;
            },
            removeAttr: function (name) {
                //简化，不考虑 checked disable class->className之类，需要可参考jquery增加
                return this.each(function (i, elem) {
                    elem.setAttribute(name, "");
                    elem.removeAttribute(name);
                });
            },
            ready: function (func) {
                var fn, i = 0;
                while (this.readyList && (fn = this.readyList[i])) {
                    fn.call(window);
                    i++;
                }
                return this;
            },
            hasClass: function (cls) {
                var len = this.results ? this.results.length : 0;
                var ar = [];
                var match = filter.CLASS(cls);
                for (var i = 0; i < len; i++) {
                    var item = this.results[i];
                    if (match(item)) {
                        ar.push(item);
                    }
                }
                return ar.length;//0-len
            },
            max: function (a, b) {
                return a > b ? a : b;
            },
            width: function () {
                return this.results && this.results[0] ? fn.max(this.results[0].offsetWidth, this.results[0].clientWidth) : null;
            },
            height: function () {
                return this.results && this.results[0] ? fn.max(this.results[0].offsetHeight, this.results[0].clientHeight) : null;
            },
            val: function (val) {
                if (typeof val == "undefined") {
                    return this.results && this.results[0] ? this.results[0].value : null;
                } else {
                    this.results && this.results[0] ? (this.results[0].value = val + '') : null;
                }
                return this;
            },
            getAttr: function (el, name) {
                return el.getAttribute(name)
            },
            each: function (list, fn) {
                if (isArray(list)) {
                    for (var i = 0; i < list.length; i++) {
                        if (fn.call(list[i], i, list[i]))break;
                    }
                } else if (isFunction(list)) {
                    fn = list;
                    list = this.results || [];
                    for (var i = 0; i < list.length; i++) {
                        if (fn.call(list[i], i, list[i]))break;
                    }
                } else {
                    for (var i in list) {
                        if (fn.call(list[i], i, list[i]))break;
                    }
                }
                return this;
            }
        }

        var ready = function () {
            var callback = function () {
                if (!ready)return;
                // Remember that the DOM is ready
                fn.ready();
                ready = undefined;
            };
            var document = window.document;

            function domCententLoaded() {
                document.removeEventListener('DOMContentLoaded', domCententLoaded, false);
                document.removeEventListener('load', domCententLoaded, false);
                callback();
            }

            function myReadyStateChange() {
                if (document.readyState == "complete") {
                    document.detachEvent("onreadystatechange", myReadyStateChange);
                    document.detachEvent("onload", winLoad);
                    callback();
                }
            }

            function winLoad() {
                document.detachEvent("onreadystatechange", myReadyStateChange);
                document.detachEvent("onload", winLoad);
                callback();
            }

            ///兼容FF,Google
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', domCententLoaded, false);
                window.addEventListener("load", domCententLoaded, false);
            }
            //兼容IE
            else if (document.attachEvent) {
                document.attachEvent('onreadystatechange', myReadyStateChange);
                window.attachEvent("onload", winLoad);
            } else if (document.lastChild == document.body) {
                return callback();
            }

            var l = document.getElementsByTagName("body") || [];
            if (l.length > 0) {
                callback();
            }//return setTimeout(ready,1);
        }
        //if (document.addEventListener) {
        //    // Use the handy event callback
        //    document.addEventListener("DOMContentLoaded", fn.ready, false);
        //
        //    // A fallback to window.onload, that will always work
        //    window.addEventListener("load", fn.ready, false);
        //
        //    // If IE event model is used
        //} else {
        //    // Ensure firing before onload, maybe late but safe also for iframes
        //    document.attachEvent("onreadystatechange", fn.ready);
        //
        //    // A fallback to window.onload, that will always work
        //    window.attachEvent("onload", fn.ready);
        //}
        ready();
        $.fn = fn;
        $.each = fn.each;

        /*事件处理*/
        var _zid = 1, undefined,
            slice = Array.prototype.slice,
            handlers = {},
            specialEvents = {},
            focusinSupported = 'onfocusin' in window,
            focus = {focus: 'focusin', blur: 'focusout'},
            hover = {mouseenter: 'mouseover', mouseleave: 'mouseout'}

        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

        function zid(element) {
            return element._zid || (element._zid = _zid++)
        }

        function findHandlers(element, event, fn, selector) {
            event = parse(event)
            if (event.ns)
                var matcher = matcherFor(event.ns);
            var list = handlers[zid(element)] || [];

            function filter(handler) {
                return handler
                    && (!event.e || handler.e == event.e)
                    && (!event.ns || matcher.test(handler.ns))
                    && (!fn || zid(handler.fn) === zid(fn))
                    && (!selector || handler.sel == selector)
            }

            var arr = [];
            for (var i = 0; i < list.length; i++) {
                if (filter(list[i]))
                    arr.push(list[i]);
            }
            return arr;
        }

        function parse(event) {
            var parts = ('' + event).split('.')
            return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
        }

        function matcherFor(ns) {
            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
        }

        function eventCapture(handler, captureSetting) {
            return handler.del &&
                (!focusinSupported && (handler.e in focus)) || !!captureSetting
        }

        function realEvent(type) {
            return hover[type] || (focusinSupported && focus[type]) || type
        }

        function add(element, events, fn, data, selector, delegator, capture) {
            var id = zid(element), set = (handlers[id] || (handlers[id] = []))
            $.fn.each(events.split(/\s/), function (i, event) {
                if (event == 'ready') return $(document).ready(fn)
                var handler = parse(event)
                handler.fn = fn
                handler.sel = selector
                // emulate mouseenter, mouseleave
                if (handler.e in hover) fn = function (e) {
                    var related = e.relatedTarget
                    if (!related || (related !== this && !$.contains(this, related)))
                        return handler.fn.apply(this, arguments)
                }
                handler.del = delegator
                var callback = delegator || fn
                handler.proxy = function (e) {
                    e = compatible(e)
                    if (e.isImmediatePropagationStopped()) return
                    e.data = data
                    var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
                    if (result === false) e.preventDefault(), e.stopPropagation()
                    return result
                }
                handler.i = set.length
                set.push(handler)
                if ('addEventListener' in element)
                    element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
                else {
                    element.attachEvent("on" + realEvent(handler.e), handler.proxy);
                }
            })
        }

        function remove(element, events, fn, selector, capture) {
            var id = zid(element)
                ;
            $.fn.each((events || '').split(/\s/), function (i, event) {
                $.fn.each(findHandlers(element, event, fn, selector), function (k, handler) {
                    delete handlers[id][handler.i]
                    if ('removeEventListener' in element)
                        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
                    else {
                        element.detachEvent("on" + realEvent(handler.e), handler.proxy);
                    }
                });
            });
        }

        $.event = {add: add, remove: remove}

        $.proxy = function (fn, context) {
            var args = (2 in arguments) && slice.call(arguments, 2)
            if (isFunction(fn)) {
                var proxyFn = function () {
                    return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
                }
                proxyFn._zid = zid(fn)
                return proxyFn
            } else if (isString(context)) {
                if (args) {
                    args.unshift(fn[context], fn)
                    return $.proxy.apply(null, args)
                } else {
                    return $.proxy(fn[context], fn)
                }
            } else {
                throw new TypeError("expected function")
            }
        }

        $.fn.bind = function (event, data, callback) {
            return this.on(event, data, callback)
        }
        $.fn.unbind = function (event, callback) {
            return this.off(event, callback)
        }
        $.fn.one = function (event, selector, data, callback) {
            return this.on(event, selector, data, callback, 1)
        }

        var returnTrue = function () {
                return true
            },
            returnFalse = function () {
                return false
            },
            ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
            eventMethods = {
                preventDefault: 'isDefaultPrevented',
                stopImmediatePropagation: 'isImmediatePropagationStopped',
                stopPropagation: 'isPropagationStopped'
            }

        function compatible(event, source) {
            if (source || !event.isDefaultPrevented) {
                source || (source = event)

                $.each(eventMethods, function (name, predicate) {
                    var sourceMethod = source[name]
                    event[name] = function () {
                        this[predicate] = returnTrue
                        return sourceMethod && sourceMethod.apply(source, arguments)
                    }
                    event[predicate] = returnFalse
                })

                if (source.defaultPrevented !== undefined ? source.defaultPrevented :
                        'returnValue' in source ? source.returnValue === false :
                        source.getPreventDefault && source.getPreventDefault())
                    event.isDefaultPrevented = returnTrue
            }
            return event
        }

        function createProxy(event) {
            var key, proxy = {originalEvent: event}
            for (key in event)
                if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

            return compatible(proxy, event)
        }

        $.fn.delegate = function (selector, event, callback) {
            return this.on(event, selector, callback)
        }
        $.fn.undelegate = function (selector, event, callback) {
            return this.off(event, selector, callback)
        }

        $.fn.live = function (event, callback) {
            $(document.getElementsByTagName("body")).delegate(this.selector, event, callback)
            return this
        }
        $.fn.die = function (event, callback) {
            $(document.getElementsByTagName("body")).undelegate(this.selector, event, callback)
            return this
        }

        $.fn.on = function (event, selector, data, callback, one) {
            var autoRemove, delegator, $this = this
            if (event && !isString(event)) {
                $.each(event, function (type, fn) {
                    $this.on(type, selector, data, fn, one)
                })
                return $this
            }

            if (!isString(selector) && !isFunction(callback) && callback !== false)
                callback = data, data = selector, selector = undefined
            if (callback === undefined || data === false)
                callback = data, data = undefined

            if (callback === false) callback = returnFalse

            return $this.each(function (_, element) {
                if (one) autoRemove = function (e) {
                    remove(element, e.type, callback)
                    return callback.apply(this, arguments)
                }

                if (selector) delegator = function (e) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var evt, match = fn.match(target, selector);
                    if (match && match !== element) {
                        evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
                        return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
                    }
                }

                add(element, event, callback, data, selector, delegator || autoRemove)
            })
        }
        $.fn.off = function (event, selector, callback) {
            var $this = this
            if (event && !isString(event)) {
                $.each(event, function (type, fn) {
                    $this.off(type, selector, fn)
                })
                return $this
            }

            if (!isString(selector) && !isFunction(callback) && callback !== false)
                callback = selector, selector = undefined

            if (callback === false) callback = returnFalse

            return $this.each(function () {
                remove(this, event, callback, selector)
            })
        }

        $.fn.trigger = function (event, args) {
            event = (isString(event) || isPlainObject(event)) ? $.Event(event) : compatible(event)
            event._args = args
            return this.each(function () {
                // handle focus(), blur() by calling them directly
                if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
                // items in the collection might not be DOM elements
                else if ('dispatchEvent' in this) this.dispatchEvent(event)
                else $(this).triggerHandler(event, args)
            })
        }

        // triggers event handlers on current element just as if an event occurred,
        // doesn't trigger an actual event, doesn't bubble
        $.fn.triggerHandler = function (event, args) {
            var e, result
            this.each(function (i, element) {
                e = createProxy(isString(event) ? $.Event(event) : event)
                e._args = args
                e.target = element
                $.each(findHandlers(element, event.type || event), function (i, handler) {
                    result = handler.proxy(e)
                    if (e.isImmediatePropagationStopped()) return false
                })
            })
            return result
        }

            // shortcut methods for `.bind(event, fn)` for each event type
        ;
        $.fn.each(('focusin focusout focus blur load resize scroll unload click dblclick ' +
        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
        'change select keydown keypress keyup error').split(' '), function (i, event) {
            $.fn[event] = function (callback) {
                return (0 in arguments) ?
                    this.bind(event, callback) :
                    this.trigger(event)
            }
        })

        $.Event = function (type, props) {
            if (!isString(type)) props = type, type = props.type
            var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
            if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
            event.initEvent(type, bubbles, true)
            return compatible(event)
        }
        Query.prototype = $.fn;
        return $;
    })();
    window.EChatQuery = EChatQuery;
    // window.$ === undefined && (window.$ = EChatQuery);
})();

/**
 * Created by lihong on 15-7-14.
 * @require query.js
 */
(function ($) {
    //echat 不使用模块化加载
    if(typeof window.ECHATObjKeyMap == 'undefined'){
        window.ECHATObjKeyMap = {};
    }
    var UTIL = function (justBase) {
        this.ECHATConfig = {
            contextPath: '/mychat/visitor'// location.href.replace(/https?:\/\/[^\/]*/, '').replace(/\/jquery-examples\/.*$/, ''),
        }
        var _self = this;
        this.subMap = {};
        this.eventMap = {};
        this.setSub = function (key) {
            this.subMap[key] = key;
        };
        this.removeSub = function (sub) {
            delete this.subMap[typeof sub == "string" ? sub : sub.KEY];
        };
        this.publish = function (eventType) {
            var arr = this.subMap;
            for (var subId in arr) {
                var sub = ECHATObjKeyMap[subId];
                if (sub && sub.eventMap && sub.eventMap[eventType]) {
                    var handle = sub.eventMap[eventType];
                    if (this.isArray(handle)) {
                        for (var i = 0; i < handle.length; i++) {
                            handle[i].apply(sub, arguments);
                        }
                    }
                }
            }
        };
        this.subscribe = function (eventType, func) {
            if (this.eventMap[eventType]) {
                this.eventMap[eventType].push(func);
            } else {
                this.eventMap[eventType] = [func];
            }
        };
        this.unSubscribeAll = function () {
            this.eventMap = {};
        };
        this.unSubscribe = function (eventType) {
            if (this.isArray(eventType)) {
                for (var i = 0; i < eventType.length; i++) {
                    delete this.eventMap[eventType[i]];
                }
            }
            else delete this.eventMap[eventType];
        };
        this.isArray = function (obj) {
            return Object.prototype.toString.apply(obj) === "[object Array]"
        };
        this.getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
                // return r[2];
            }
            // return undefined;
        };
        /**
         *
         * @param url
         * @returns {{}} 地址中所有的参数的JSON
         */
        this.getQueryParams = function (url) {
            var params = {};
            if (typeof url != "string") {
                url = location.search;
            }
            if (url.indexOf("#") != -1) {
                url = url.substring(0, url.indexOf("#"));
            }
            if (url.indexOf("?") != -1) {
                url = url.substring(url.indexOf("?") + 1);
            }

            var arr = url.split("&"), item, len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i]) {
                    item = arr[i].split("=");
                    if (item[0] && item[1]) {
                        params[item[0]] = decodeURIComponent(item[1]);
                        //兼容全小写
                        params[item[0].toLowerCase()] = params[item[0]];
                    }
                }
            }
            if(params.visEvt){
                try {
                    var evt = JSON.parse(params.visEvt);
                    if (evt && evt.eventId) {
                        params.eventId = evt.eventId;
                        params.eventid = evt.eventId;
                    }
                } catch (e) {
                    params.visEvt = undefined;
                    delete params.visEvt
                }
            }
            return params

        };
        this.queryParams = this.getQueryParams();
        this.companyId = this.getQueryString("companyid");
        this.hasStorage = (function () {
            try {
                if (!window.localStorage) {
                    return false;
                } else {
                    window.localStorage.setItem("echt_test_storage", "ok");
                    var ok = window.localStorage.getItem("echt_test_storage");
                    if(!ok){
                        return false;
                    }
                }
            } catch (e) {
                return false;
            }
            window.localStorage.removeItem("echt_test_storage");
            return true;
        })();
        this.hasCookie = (function () {
            $.cookie('echt_test_cookie','ok');
            var ok = $.cookie('echt_test_cookie');
            if(!ok){
                return false;
            }
            $.cookie('echt_test_cookie',null);
            return true;
        })();
        $.store = (function (local) {
            if(local){
                return function (key, value, options) {
                    //默认local
                    if (!key)return null;

                    // key and at least value given, set cookie...
                    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
                        options = $.extend({}, options);

                        if (value === null || value === undefined) {
                            options.expires = -1;
                        }
                        value = String(value);
                        if ( options.session) {
                            window.sessionStorage.setItem(key,value)
                        }else{
                            window.localStorage.setItem(key,value)
                        }
                        return value;
                    }
                    // key and possibly options given, get cookie...
                    options = value || {};
                    if(options.local) {
                        return window.localStorage.getItem(key);
                    }else if(options.session) {
                        return window.sessionStorage.getItem(key);
                    }else{
                        return window.localStorage.getItem(key) || window.sessionStorage.getItem(key) || $.cookie(key);
                    }
                };
            }else {
                return $.cookie;//qcometd.js里面定义,4个使用UTIL.JS的地方,qcometd都在前面打包了
            }
        })(this.hasStorage);
        /*对于管理COMETD的类，不需要一下功能*/
        if (justBase) {
            return;
        }
        this.getDeviceInfo = (function () {
            _self.deviceInfo = F;
            var b = _self;
            var f = b.indexOf = (function () {
                var x = Array.prototype.indexOf;
                if (typeof x != 'function' || !/\[native code\]/.test(x.toString()))x = y;
                function y(A) {
                    // "use strict"
                    if (this == null) {
                        throw new TypeError()
                    }
                    var B = Object(this);
                    var C = B.length >>> 0;
                    if (C === 0) {
                        return -1
                    }
                    var D = 0;
                    if (arguments.length > 0) {
                        D = Number(arguments[1]);
                        if (D != D) {
                            D = 0;
                        }
                        else if (D != 0 && D != Infinity && D != -Infinity) {
                            D = (D > 0 || -1) * Math.floor(Math.abs(D));
                        }
                    }
                    if (D >= C) {
                        return -1;
                    }
                    var E = D >= 0 ? D : Math.max(C - Math.abs(D), 0)
                    for (; E < C; E++) {
                        if (E in B && B[E] === A) {
                            return E;
                        }
                    }
                    return -1;
                }

                function z(A, B, C) {
                    return x.call(B, A, C);
                }

                return z;
            })()
            var h = b.isFunction = (function () {
                function x(y) {
                    return typeof y == 'function';
                }

                return x;
            })()
            var i = b.isString = (function () {
                function x(y) {
                    return typeof (y) == 'string';
                }

                return x;
            })()
            var q = b.Browser = (function () {
                var x = navigator, y = x.userAgent.toLowerCase(),
                    z = +(/trident.*rv:? *([0-9]+)/.exec(y) || [])[1] || !1, A = $s(),
                    zz = /edge/.exec(y) || (!A && !!window.StyleMedia) || !1, B = A == 8, C = A == 7, D = A == 6,
                    E = (window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]") || (/webkit/.test(y) && (/opr/.test(y) || /opera/.test(y))),
                    F = navigator.vendor == 'Google Inc.', G = navigator.vendor == 'Apple Computer, Inc.',
                    H = !A && (F || G || /webkit|khtml/.test(y)), I = +/\d+/.exec(/firefox\/\d+/i.exec(navigator.userAgent) || ''),
                    J = y.indexOf('firefox/2') > -1, K = y.indexOf('firefox/3') > -1, L = y.indexOf("iphone") != -1,
                    M = y.indexOf("ipod") != -1, N = y.indexOf("ipad") != -1, O = L || N || M, P = y.indexOf("android") != -1,
                    Q = y.indexOf("wp7") != -1, kgBrowser = y.indexOf('kgbrowser') != -1, R = O || P || Q || kgBrowser, S,
                    //新增 UC 猎豹 QQ 搜狗 360 maxthon(傲游)

                    uc = y.indexOf("ucbrowser") != -1,
                    liebao = y.indexOf("lbbroser") != -1 || y.indexOf("liebao") > -1,
                    qq = y.indexOf("qqbrowser") != -1,
                    sogou = y.indexOf("metasr") != -1||y.indexOf("sogou") != -1,
                    f360 = false,
                    //无法判断y.indexOf("360") != -1 || window.navigator.mimeTypes[40] || !window.navigator.mimeTypes.length,
                    maxth = y.indexOf("maxthon") != -1,
                    baidu = y.indexOf("bidubrowser") != -1||y.indexOf("baidubrowser") != -1||y.indexOf("baidu") != -1,
                    // baidubox = y.indexOf("baiduboxapp") != -1,//||y.indexOf("baidu") != -1,
                    weixin = y.indexOf('micromessenger') != -1,
                    T = A && 'msie' || I && 'firefox' || E && 'opera' || uc && 'uc' || liebao && 'liebao' || qq && 'qq'|| zz && 'edge' || sogou && 'sogou' || f360 && '360' || maxth && 'maxth'|| baidu && 'baidu' || /*baidubox && 'baiduboxapp' || */weixin && 'weixin' || G && 'safari' || F && 'chrome' || H && "chrome",
                    //暂时其他不识别的WEBKIT内核识别为CHROME
                    U, V = A && !W, W = document.compatMode == "CSS1Compat", X = !W,
                    Y = A && X && document.documentElement && !!document.documentElement.style.setExpression, Z = document.documentMode || A,
                    $$ = (y.indexOf("windows") != -1 || y.indexOf("win32") != -1),
                    $_ = (y.indexOf("macintosh") != -1 || y.indexOf("mac os x") != -1 || window.navigator.platform.indexOf('Mac') != -1),
                    $a = document.location.protocol == 'https:',
                    $b = x.language || x.browserLanguage || x.userLanguage || x.systemLanguage, $c = {
                        noBoxSizing: Z <= 7,
                        ie: {cssBottomRight: D, cssFixed: D || Y, buggyCSS: D || Y}
                    }, $d = ('textContent' in document.createElement('div'))
                var $e = !1;
                try {
                    if (window.CustomEvent && /\[native code\]/.test(window.CustomEvent.toString())) {
                        new window.CustomEvent('testevent', {bubbles: !1, cancelable: !0, detail: !0});
                        $e = !0
                    }
                } catch ($u) {

                }
                switch (T) {
                    case "opera":
                        U = +/\d+/.exec(new RegExp('opr' + '[ /]\\d+').exec(y) || '');
                        break;
                    case 'msie':
                    case 'firefox':
                    case 'chrome':
                        U = U || +/\d+/.exec(new RegExp(T + '[ /]\\d+').exec(y) || '');
                        break;
                    case 'baidu':
                        U = +/\d+/.exec(new RegExp('bidubrowser' + '[ /]\\d+').exec(y) || '');
                        break;
                    case "maxth":
                        U = +/\d+/.exec(new RegExp('maxthon' + '[ /]\\d+').exec(y) || '');
                        break;
                    case 'qq':
                        U = +/\d+/.exec(new RegExp('qqbrowser' + '[ /]\\d+').exec(y) || '');
                        break;
                    case 'liebao':
                        U = +/\d+/.exec(new RegExp('lbbroser' + '[ /]\\d+').exec(y) || '');
                        break;
                    case 'uc':
                        U = +/\d+/.exec(new RegExp('ucbrowser' + '[ /]\\d+').exec(y) || '');
                        break;
                    case 'sogou':
                        U = +/\d+/.exec(new RegExp('metasr' + '[ /]\\d+').exec(y) || '');
                        break;

                    default:
                        U = +/\d+/.exec(/version[ \/]\d+/.exec(y) || '');
                }
                function $f($u) {
                    return $u.replace(/^http:/, $a ? 'https:' : 'http:');
                }

                function $g() {
                    if (window.innerHeight !== a)return window.innerHeight;
                    if (document.documentElement)return document.documentElement.offsetHeight;
                    if (document.getElementsByTagName('body').length)return document.getElementsByTagName('body')[0].clientHeight;
                    return 0;
                }

                function $h() {
                    if (window.innerWidth !== a)return window.innerWidth;
                    if (document.documentElement)return document.documentElement.offsetWidth;
                    if (document.getElementsByTagName('body').length)return document.getElementsByTagName('body')[0].clientWidth;
                    return 0;
                }

                if (D) {
                    var $i = [];
                    $c.leaksMemory = function ($u) {
                        p.isFunction($u);
                        $i.push($u);
                    }
                    var $j = function () {
                        for (var $u = 0; $u < $i.length; $u++)$i[$u]();
                    }
                    $c.leaksMemory.remove = function ($u) {
                        for (var $v = $i.length - 1; $v >= 0; $v--)if ($u == $i[$v])$i.splice($v, 1);
                    }
                    window.attachEvent('onunload', $j);
                }
                var $k = 'Shockwave Flash', $l = 'ShockwaveFlash.ShockwaveFlash', $m = 'application/x-shockwave-flash', $n = 'application/x-java-vm'

                function $o() {
                    var $u = x.plugins && x.plugins[$k], $v;
                    if ($u) {
                        $v = x.mimeTypes && x.mimeTypes[$m];
                        if ($v && !$v.enabledPlugin)return null;
                        return $u.description
                    }
                    else if (window.ActiveXObject) {
                        try {
                            $u = new window.ActiveXObject($l);
                            $u.AllowScriptAccess = 'always';
                            return $u.GetVariable('$version');
                        } catch ($w) {
                        }
                    }
                }

                function $p() {
                    var $u = x.mimeTypes
                    if (A)return Q ? !1 : ('javaEnabled' in x) && x.javaEnabled();
                    if ($u && ($u = $u[$n]) && ($u = $u.enabledPlugin))return $u.name;
                }

                function $q() {
                    if (!k(S))return S;
                    var $u = document.createElement('div'), $v = document.createElement('div'), $w = $u.style, $x = $v.style
                    $w.overflow = 'auto';
                    $w.width = $w.height = '100px';
                    $w.position = 'absolute';
                    $w.top = '-1000px';
                    $x.width = '100%';
                    $x.height = '200px';
                    $u.appendChild($v);
                    document.body.appendChild($u);
                    S = $u.offsetWidth - $u.clientWidth;
                    document.body.removeChild($u);
                    return S
                }

                function $r() {
                    try {
                        return eval('false');
                    } catch ($u) {
                        return !0
                    }
                }

                function $s() {
                    var $u = 3, $v = document.createElement('div'), $w = $v.getElementsByTagName('i')
                    while ($v.innerHTML = '<!--[if gt IE ' + (++$u) + ']><i></i><![endif]-->', $w[0]);
                    return $u > 4 ? $u : document.documentMode
                }

                var $t = {
                    browser: T,
                    version: U,
                    isStrict: W,
                    isQuirks: X,
                    isOpera: E,
                    isSafari: G,
                    isWebKit: H,
                    isChrome: !E && F,
                    isAndroid: P,
                    isIPhone: L,
                    isIPod: M,
                    isIPad: N,
                    isIOS: O,
                    isWP7: Q,
                    isMobile: R,
                    isEdge: zz,
                    isNewIE: z,
                    isIE: A,
                    isIE6: D,
                    isIE7: C,
                    isIE8: B,
                    isFF: I,
                    isFF2: J,
                    isFF3: K,
                    isBorderBox: V,
                    isCustomEvents: $e,
                    engineIE: Z,
                    bugs: $c,
                    isWindows: $$,
                    isXP: /windows nt 5.1/.test(y),
                    isMac: $_,
                    isLinux: /Linux/.test(navigator.platform),
                    isSecure: $a,
                    secureURL: $f,
                    hasFlash: $o(),
                    hasJava: $p(),
                    language: $b,
                    getScrollbarSize: $q,
                    getWindowClientHeight: $g,
                    getWindowClientWidth: $h,
                    isTextContent: $d,
                    hasCSP: $r()
                };
                $t.isPC = !$t.isMobile && ($t.isWindows || $t.isMac || $t.isEdge || $t.isLinux);
                return $t
            })();
            var x = b.__$$__jx_ui_HTMLElement;
            var y = /google inc\./i, z = /chrome/i, A = /apple computer, inc\./i, B = /crios/i, C = window.navigator.userAgent || '', D = window.navigator.vendor || '',  F = {
                checkLandscape: L,
                getZoomLevel: Y,
                getOffset: Z
            };

            var E = G();
                function G() {
                var $$ = /mobile|kgbrowser|(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i,
                    $_ = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
                    $a = C || D || window.opera, $b = $$.test($a) || $_.test($a.substr(0, 4));
                return $b;
            }


            function L() {
                return window.document.documentElement.clientWidth > window.document.documentElement.clientHeight
            }

            function R() {
                return E && /(iemobile|windows phone)/i.test(C)
            }

            function T() {
                return E && y.test(D) && (!z.test(C) || /samsung/i.test(C))
            }


            function Y() {
                var a ;
                var $$ = 1.2, $_ = 640, $a = window.document.documentElement.clientWidth, $b = window.document.documentElement.clientHeight, $c = ($a / $b) > $$, $d = window.screen.width, $e = window.screen.height, $f = !1
                if ($c && $d < $e) {
                    $f = !0
                    $d = window.screen.height
                    $e = window.screen.width
                }
                var $g = window.innerWidth, $h = $a / $d
                if (window.devicePixelRatio && T() && $d > $_) {
                    $h *= window.devicePixelRatio
                }
                else if (R()) {
                    $h *= 1.5
                }
                var $i = ($a / $g) / $h
                $i = ($i / $$).toFixed(2)

                return ($d / $g).toFixed(2);
                return $i;
            }

            function Z() {
                var $$ = window, $_ = $$.document.documentElement, $a = $$.document.body, $b = null, $c = {
                    top: 0,
                    left: 0
                }
                if (!h($_.getBoundingClientRect)) {
                }
                else if (h($$.getComputedStyle)) {
                    if ($$.getComputedStyle($a).position == 'relative') {
                        $b = $a
                    }
                    else if ($$.getComputedStyle($_).position == 'relative') {
                        $b = $_
                    }
                }
                else if ($a.currentStyle) {
                    if ($a.currentStyle.position == 'relative') {
                        $b = $a
                    }
                    else if ($_.currentStyle.position == 'relative') {
                        $b = $_
                    }
                }
                else if ($a.style.position == 'relative') {
                    $b = $a
                }
                else if ($_.style.position == 'relative') {
                    $b = $_
                }
                if ($b) {
                    var $d = $b.getBoundingClientRect()
                    $c.top = $d.top + $$.pageYOffset - $_.clientTop
                    $c.left = $d.left + $$.pageXOffset - $_.clientLeft
                }
                return $c
            }

            _self.Device = F;
        })();
        //不强制跳转设备里面的对话页面 避免与客户location的mobile冲突
        var isMobilePage = window.mobilePage || (location.href.split("?")[0].indexOf('/visitor/mobile/') != -1 && !ECHATObjKeyMap.outerId);
        if (_self.Browser.isMobile || isMobilePage || !_self.Browser.isPC) {//识别为手机、当前加载的页面是手机    没有匹配为手机!isPC

            //_self.Device.media = this.Browser.isAndroid && "Android" || this.Browser.isIPhone && "iPhone" ||
            //this.Browser.isIPod && "iPod" || this.Browser.isIPad && "iPad" ||
            //this.Browser.isWP && "Windows Phone" || "other mobile";
            //先设置为INT
            _self.Device.media = 2
        } else {
            //_self.Device.media = this.Browser.isWindows && "Windows" || this.Browser.isMac && "Mac" || "OS X";
            //先设置为INT
            _self.Device.media = 1
        }
        _self.Device.OS = this.Browser.isWindows && "Windows" || this.Browser.isIPhone && "iPhone" ||
            this.Browser.isIPad && "IPAD" || this.Browser.isIPod && "IPOD" || this.Browser.isMac && "OSX" ||
            this.Browser.isAndroid && "Android" || this.Device.isWP && "Windows Phone" ||
            this.Browser.isLinux && "Linux" || "others";
        //this.Browser.browser = _self.Device.isNativeAndroidMobile?"android":this.Browser.browser;//识别安卓自带浏览器
        //console.log(navigator.userAgent);

        /**
         *
         */
        this.hasTranslate = this.Browser.isMobile;
        /**
         翻页
         * @param x int
         * @param y int
         */
        this.setTransform = function (x, y) {
            var v = "translate(" + x + "px," + y + "px)";
            _self.hasTranslate ? $(this).css({
                "-webkit-transform": v,
                "-o-transfrom": v,
                "-ms-transform": v,
                "-moz-transform": v,
                "transform": v
            }) : $(this).css({left: x + "px", top: y + "px"});

        };
        this.setScale = function (zoom) {
            var F = this, $q = 10, $o = 10;

            function $C() {
                var $D = _self.deviceInfo.getZoomLevel()
                var $E = (1 / $D).toFixed(2)
                var $F = window.pageXOffset
                var $G = window.pageYOffset
                var $H = window.innerWidth
                var $I = window.innerHeight
                var $J = F[0].clientWidth;
                var $K = F[0].clientHeight;
                //for (var $L = 0, $M = O.cssom_prefixes.length; $L < $M; $L++) {
                //    F.wrapper.setStyle(O.cssom_prefixes[$L] + 'Transform', 'scale(' + $E + ')')
                //    F.wrapper.setStyle(O.cssom_prefixes[$L] + 'TransformOrigin', '0 0')
                //}

                var v = "scale(" + $E + ")";
                //_self.hasTranslate ? $(F).css({
                //    "-webkit-transform": v,
                //    "-o-transfrom": v,
                //    "-ms-transform": v,
                //    "-moz-transform": v,
                //    "transform": v//,
                //    //"-webkit-transform-orign":"0 0",
                //    //"-o-transform-orign":"0 0",
                //    //"-moz-transform-orign":"0 0",
                //    //"-ms-transform-orign":"0 0",
                //    //"transform-orign":"0 0"
                //}) : $(this).css({zoom: $E});
                //$("#FEELEC,#FEELEC iframe").css({zoom: $E});
                return;
                var $N = $J / $D, $O = $K / $D, $P = _self.deviceInfo.getOffset(), $Q = (_self.Browser.isIOS && $D >= 1) ? 'absolute' : 'fixed', $R, $S, $T, $U
                F.css({
                    position: $Q,
                    width: $N + 'px',
                    height: $O + 'px'//,
                    //top: '',
                    //right: '',
                    //bottom: '',
                    //left: ''
                })
                if ($Q === 'fixed') {
                    $R = 'auto'
                    $S = "bl" === 'bl' ? 'auto' : ($q / $D) + 'px'
                    $T = ($o / $D) + 'px'
                    $U = $e === 'bl' ? ($q / $D) + 'px' : 'auto'
                }
                else {
                    $R = Math.ceil($G + $I - $O - ($o / $D) - $P.top) + 'px'
                    $S = 'auto'
                    $T = 'auto'
                    if ("bl" === 'bl') {
                        $U = Math.ceil($F + ($q / $D) - $P.left) + 'px'
                    }
                    else {
                        $U = Math.floor($F + $H - $N - ($q / $D) - $P.left) + 'px'
                    }
                }
                F.css({top: $R, right: $S, bottom: $T, left: $U})
            }

            $C()

        }

        function _isPointerEventType(e, type) {
            return (e.type == 'pointer' + type ||
            e.type.toLowerCase() == 'mspointer' + type ||
            e.type == "mouse" + type)
        }

        function _isPrimaryTouch(event) {
            var t = (event.type.indexOf("mouse") > -1)
                || ((event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH)
                && event.isPrimary)
            return t;
        }

        /**
         *
         * @param pageSelector 列表容器，父级元素宽度为页宽
         * @param endCB 滑动结束后回调，传入滑动的页数
         */
        var _clearSlct = "getSelection" in window ? function () {
            window.getSelection().removeAllRanges();
        } : function () {
            document.selection.empty();
        };
        this.pageSlide = function (pageSelector, endCB) {
            $(document).on('mousedown touchstart MSPointerDown pointerdown', pageSelector, function (e) {
                e = e || window.event;
                var _isPointerType = false;
                if ((_isPointerType = _isPointerEventType(e, 'down')) && !_isPrimaryTouch(e)) return
                // Clear out touch movement data if we have it sticking around
                // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                e = _isPointerType ? e : (e.touches && e.touches[0] || e);
                var touch = {};
                touch.x2 = undefined
                touch.y2 = undefined
                var deltaX = 0, deltaY = 0, dir = 0,
                    target = $(this),
                    //自行设置一页宽度
                    pageDelta = this.parentNode.clientWidth,
                    bounceDelta = pageDelta / 8,
                    initX = parseInt(target.attr("x") || this.offsetLeft) || 0,
                    w = this.clientWidth,
                    minX = -w + pageDelta - 20,
                    maxX = 20;
                touch.x1 = e.clientX;
                touch.y1 = e.clientY;
                target.removeClass("transition");
                var stopTouchmove = function(e){
                    e.preventDefault() // 阻止默认的处理方式
                }
                //打开表情栏的时候，防止某些手机浏览器右滑的时候返回上一页
                document.body.addEventListener('touchmove', stopTouchmove, {passive: false})
                var move = function (e) {
                        e = _isPointerType ? e : (e.touches && e.touches[0] || e);
                        touch.x2 = e.clientX;
                        touch.y2 = e.clientY;

                        deltaX = (touch.x2 - touch.x1);
                        deltaY = (touch.y2 - touch.y1);
                        //设置位置
                        var x = deltaX + initX;
                        x > maxX ? x = maxX : x < minX ? x = minX : x = x;
                        _self.setTransform.call(target, x, 0);
                        target.attr("x2", x);
                        _clearSlct();
                    },
                    end = function (e) {
                        _clearSlct();
                        if (!target)return;
                        //查看位置是否够翻页
                        target.addClass("transition");
                        var delta = 0;//记录上一页 、 下一页、还是本页。
                        if (dir == 0 && bounceDelta < Math.abs(deltaX)) {
                            var x = parseInt(target.attr("x2"));
                            //左右滑动
                            if (deltaX >= bounceDelta && (initX + pageDelta <= 0)) {
                                //上一页
                                _self.setTransform.call(target, initX + pageDelta, 0);
                                target.attr("x", initX + pageDelta);
                                delta = -1;
                                ;
                            } else if (deltaX <= -bounceDelta && (initX - pageDelta + w > 0)) {
                                //下一页
                                _self.setTransform.call(target, initX - pageDelta, 0);
                                target.attr("x", initX - pageDelta);
                                delta = 1;
                            } else {
                                _self.setTransform.call(target, initX, 0);
                            }
                        } else {
                            _self.setTransform.call(target, initX, 0);
                        }
                        //回调
                        var r = endCB && endCB(delta);
                        $(document).off('mousemover mousemove touchmove MSPointerMove pointermove', move)
                            .off('mouseup touchend MSPointerUp pointerup', end);
                        target = null;
                        _clearSlct();
                        if (r === false) {
                            e.stopPropagation && e.stopPropagation;
                            e.preventDefault && e.preventDefault();
                            return false;
                        }
                        //恢复默认效果，删除监听touchmove事件
                        document.body.removeEventListener('touchmove', stopTouchmove)
                    };
                $(document).on('mousemover mousemove touchmove MSPointerMove pointermove', move)
                    .on('mouseup touchend MSPointerUp pointerup', end);
            });
        }


        this.getCSSRule = function (ruleName, deleteFlag, document) {               // Return requested style obejct
            document = document || window.document;
            ruleName = ruleName.toLowerCase();                       // Convert test string to lower case.
            if (document.styleSheets) {                            // If browser can play with stylesheets
                for (var i = 0; i < document.styleSheets.length; i++) { // For each stylesheet
                    var styleSheet = document.styleSheets[i];          // Get the current Stylesheet
                    var ii = 0;                                        // Initialize subCounter.
                    var cssRule = false;                               // Initialize cssRule.
                    do {                                             // For each rule in stylesheet
                        if (styleSheet.cssRules) {                    // Browser uses cssRules?
                            cssRule = styleSheet.cssRules[ii];         // Yes --Mozilla Style
                        } else {                                      // Browser usses rules?
                            cssRule = styleSheet.rules[ii];            // Yes IE style.
                        }                                             // End IE check.
                        if (cssRule) {                               // If we found a rule...
                            if (cssRule.selectorText && cssRule.selectorText.toLowerCase() == ruleName) { //  match ruleName?
                                if (deleteFlag == 'delete') {             // Yes.  Are we deleteing?
                                    if (styleSheet.cssRules) {           // Yes, deleting...
                                        styleSheet.deleteRule(ii);        // Delete rule, Moz Style
                                    } else {                             // Still deleting.
                                        styleSheet.removeRule(ii);        // Delete rule IE style.
                                    }                                    // End IE check.
                                    return true;                         // return true, class deleted.
                                } else {                                // found and not deleting.
                                    return cssRule;                      // return the style object.
                                }                                       // End delete Check
                            }                                          // End found rule name
                        }                                             // end found cssRule
                        ii++;                                         // Increment sub-counter
                    } while (cssRule)                                // end While loop
                }                                                   // end For loop
            }                                                      // end styleSheet ability check
            return false;                                          // we found NOTHING!
        }                                                         // end getCSSRule

        this.killCSSRule = function (ruleName) {                          // Delete a CSS rule
            return this.getCSSRule(ruleName, 'delete');                  // just call getCSSRule w/delete flag.
        }                                                         // end killCSSRule

        this.addCSSRule = function (ruleName) {                           // Create a new css rule
            if (document.styleSheets) {                            // Can browser do styleSheets?
                if (!this.getCSSRule(ruleName)) {                        // if rule doesn't exist...
                    if (document.styleSheets[0].addRule) {           // Browser is IE?
                        document.styleSheets[0].addRule(ruleName, null, 0);      // Yes, add IE style
                    } else {                                         // Browser is IE?
                        document.styleSheets[0].insertRule(ruleName + ' { }', 0); // Yes, add Moz style.
                    }                                                // End browser check
                }                                                   // End already exist check.
            }                                                      // End browser ability check.
            return this.getCSSRule(ruleName);                           // return rule we just created.
        }


        this.addJS = function (url, callback) {
            var node = document.createElement('script');
            node.setAttribute("type", "text/javascript");
            var head = document.getElementsByTagName("head")[0];
            var supportOnload = "onload" in node;
            if (supportOnload) {
                node.onload = onload
                node.onerror = function () {
                    onload(true)
                }
            }
            else {
                node.onreadystatechange = function () {
                    if (/loaded|complete/.test(node.readyState)) {
                        onload()
                    }
                }
            }
            function onload(error) {
                // Ensure only run once and handle memory leak in IE
                node.onload = node.onerror = node.onreadystatechange = null

                // Remove the script to reduce memory leak
                head.removeChild(node);

                // Dereference the node
                node = null
                callback(error)
            }

            node.src = url;
            head.appendChild(node);
        }
        this.addCSS = function (url) {
            //增加css
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url//"/visitor/surfer/css/surfer.css";
            link.media = "screen";
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(link);
        }
        /**
         * base64编码
         * @param {Object} str
         */
        this.base64encode = function (str) {
            var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var out, i, len;
            var c1, c2, c3;
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        }
        $(document).on("drag", function (e) {
            e = e || window.event;
            e.preventDefault && e.preventDefault();
            return false
        });
    }


    Date.prototype.format = function (format) {
        /*
         使用方法
         var now = new Date();
         var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
         //使用方法2:
         var testDate = new Date();
         var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
         //示例：
         (new Date().Format("yyyy年MM月dd日"));
         (new Date().Format("MM/dd/yyyy"));
         (new Date().Format("yyyyMMdd"));
         (new Date().Format("yyyy-MM-dd hh:mm:ss"));
         */
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    window.UTIL = UTIL;
    if (typeof console == "undefined") {
        window.console = {
            log: function (args) {
                //alert(JSON.stringify(arguments));
            }
        };
    }
})(EChatQuery);
/**
 * @require query.js
 // * @require cometd.js
 // * @require qcometd.js
 * @require util.js
 */
(function ($) {
    function ChatConnect(state) {
        $.cometd = {
            getStatus: function () {
                return 'sdk';
            }
        }
        //继承
        UTIL.call(this, true);

        var _self = this;
        var queueCommon = [];//链接通前 消息队列
        var queueChat = [];//对话开始后 消息队列

        var _connected = false;
        var _disconnecting = false;

        function toLeavePage(msg) {
            _self.publish("toLeavePage", msg);
        }

        //访客接收消息
        this.selfMsg = function (message, fromChat) {
            var msg = message;//.data;
            switch (msg.mt + "") {
                case "10009":
                    _endChat({ justConnect: true, mt: '10009', type: msg.type });
                    return;
                    break;
                case "600":
                    window.chatVisitorId = 'chatVisitorId' + msg.visitorId;
                    window.encryptVID = _self.encryptVID = msg.encryptVID;
                    _self.visitorId = msg.visitorId;
                    window.encryptVID = _self.companyId = msg.companyId;
                    ECHATObjKeyMap["chatId"] && ECHATObjKeyMap["chatId"].initVisitor();
                    _self.publish("setVisitorInfo", msg);
                    if (msg.routeEntranceInfo) {
                        // 不发送109 等待访客选择
                        _self.waitForRouterSelect = true;
                        _self.publish("displayRouterInfo", msg);
                    }
                    _connectionInitialized(message);
                    _self.publish('handshakeOk', message);
                    _connected = true;
                    break;
                case "671":
                    _self.publish("setChatParam", msg);
                    break;
                case "672":
                    _self.publish("setRestartTag", msg);
                    break;
                case "649":
                    //设置配置
                    _self.publish("setconfig", msg);
                    //包含了去离线页面
                    _self.publish("waitingChat", msg);
                    break;
                case "678":
                        //设置配置
                        view.chat.companyOff = true;
                        _self.publish("toLeavePage", msg);
                        break;
                case "651"://获取上传文件token
                case "682"://获取上传文件token
                    //     this.publish("getFileToken", msg);
                    break;
                case "652"://错误消息
                    this.publish("getErr", msg);
                    break;
                case "646"://扫一扫手机对话的二维码的 chatToken
                    this.publish("getChatToken", msg);
                    break;
                default:
                    //没有就去chat里面
                    !fromChat && _self.receiveChat(message, true);
                    break;
            }
        }
        /**
         * 公司和部门频道 只有603 弃用,使用selfmsg代替,消息不分频道。
         * @param message
         */
        //对话消息
        var chatting = false;
        this.receiveChat = function (message, fromSelf) {
            var msg = message;//.data;
            switch (msg.mt + "") {
                case "127":
                    this.publish('sendLocationInfo', msg)
                    break;
                case "603":// 公司状态变更
                    //_self.publish("companyState", msg);
                    if (msg.status == 2) {
                        //649有信息收集-发送103-收到603-留言可发消息状态
                        toLeavePage(msg)
                    } else if (msg.status == 1) {
                        //console.log("这里是后续状态变更发送，不是初始时发送，应该是不会走这");
                    }
                    break;
                    return;
                case "604"://	对话开始 606客服详情合并到604
                    //对话开始后 waitForRouterSelect 一律为false,不会再做第二次选择咨询入口
                    _self.waitForRouterSelect = false;
                    _startChat(msg);
                    //对话
                    flashMsg(true);
                    // this.publish("staffInfo", msg);
                    break;
                case "605":// 对话结束
                    _endChat(msg);
                    return;
                    break;
                /*  case "606":// 客服详情、手机端使用
                 _self.publish("staffInfo", msg);
                 break;*/
                case "620":// 对话客服状态变更
                    this.publish("staffState", msg);
                    return;//无关对话状态,先不去除遮罩
                    break;
                /*      case "621":// 客服邀请评价
                 //TODO
                 this.publish("inviteSatisfy", msg);
                 break;*/
                case "640"://文本消息
                    this.publish("getMsg", msg);
                    break;
                case "641"://图片消息
                    this.publish("getMsgImg", msg);
                    break;
                case "642"://文件消息
                    this.publish("getMsgFile", msg);
                    break;
                case "644"://客服正在输入
                    this.publish("getMsgTyping", msg);
                    break;
                case "647"://系统消息
                    /*type 1：等待提示语
                     2：欢迎语
                     3：结束语
                     WAITMSG = 1;
                     WELCOMEMSG = 2;
                     CHATENDMSG = 3;
                     TIMEOUTMSG = 4;
                     AUTOREPLY = 5;
                     SYSTEM = 6;
                     OFFLINEMSG = 7;
                     QUEUEMSG = 8;
                     QUEUECONNECTMSG = 9;
                     ROBOTMSG = 10;
                     */
                    this.publish("getSysMsg", msg);
                    break;
                case "648"://访客排队消息 position:排队位置。
                    this.publish("getPosMsg", msg);
                    break;
                case "650"://刷新验证码
                    this.publish("refreshVerify", msg);
                    return;//不往下走，不去掉遮罩
                    break;
                case "655":
                    /*未读消息*/
                    msg.current = true;
                    _self.publish("getLeaveMsg", msg);
                    break;
                case "864"://自己发送同步给其他窗口消息。
                    this.publish("getMsgMine", msg);
                    break;
                case "865"://自己发送的文件消息
                    // alert(JSON.stringify(msg));
                    if(view.fileMsgs[msg.clientFileId]){
                        view.fileMsgs[msg.clientFileId].sendStatus = 4;
                    }
                    this.publish("getMsgImg", msg);
                    break;
                case "866"://自己发送的文件消息
                // alert(JSON.stringify(msg));
                    if(view.fileMsgs[msg.clientFileId]){
                        view.fileMsgs[msg.clientFileId].sendStatus = 4;
                    }
                    this.publish("getMsgFile", msg);
                    break;
                case "874"://历史记录消息
                    this.publish("getHistory", msg);
                    break;
                case "876":
                    this.publish("overLength", msg);
                    return;//无关对话状态,先不去除遮罩
                    break;
                case "890":
                    this.publish("inviteBook", msg);
                    break;
                case "892"://已经成功提交预约信息，通知其他窗口
                    this.publish("inviteBookOK", msg);
                    break;
                case "670":
                    //入口信息收集反馈
                    _self.publish('entryCallback', msg);
                    return;//不往下走，不去掉遮罩
                    break;
                case "673":
                    //客服推送访客评价
                    _self.publish("inviteSatisfy", msg);
                    $.store('ECHAT_inviteSatisfyId', msg.mid);
                    break;
                case "675":
                    //客服对访客离线消息的回复
                    msg.staffName = msg.staffName || msg.staffNickName;
                    _self.publish("getLeaveReply", msg);
                    //TODO 一个对话回合结束了 会重新注册对话
                    chatting = false;
                    return;
                    break;
                case "680"://推送URL
                    this.publish("receiveURL", msg);
                    break;
                case '923':
                    //todo 重新注册访客频道 取消订阅原来的频道
                    _self.publish("setVisitorInfo", { visitorId: msg.newVisitorId, photo: msg.metaDataInfo.photo });
                    return;//无关对话状态,先不去除遮罩
                    break;
                case '928':
                    return;//无关对话状态,先不去除遮罩
                    //离线未读消息 列表
                    _self.publish("receiveUnread", message);
                    var temp = { data: null, from: 928, talkId: msg.talkId };
                    var list = msg.chatDetailList;
                    for (var i = 0; i < list.length; i++) {
                        list[i].staffName = list[i].staffNickName;
                        list[i].fromUnread = true;
                        //历史消息里面展示
                        temp.data = list[i];
                        _self.receiveChat(temp);
                        //未读层上面展示
                    }
                    return;//无关对话状态,先不去除遮罩
                    break;
                case '12001':
                    //访客发送机器人文本消息et=130，请求后会收到回执消息
                    //机器人转人工et=131，请求后会收到回执消息

                    this.publish("getMsgRobot", msg);
                    break;
                case '10011':
                    _self.publish("receiveVisEvt", msg);
                    break;
                default:
                    //没有就去selfmsg里面找
                    !fromSelf && _self.selfMsg(message, true);
                    return;
                    break;
            }
            //判断是否有LOADING 有LOADING就删除。

            if (!chatting) {
                this.publish("removeLoading", msg);
                chatting = true;
            }
            //收到消息 系统消息不算
            if (msg.mt == 892 || msg.mt == 890 || msg.mt == 866 || msg.mt == 874 || msg.mt == 865 || msg.mt == 864 || msg.mt == 642 || msg.mt == 641 || msg.mt == 640) {
                msg.tm && (ECHATObjKeyMap["chatId"].lastMsgTM = msg.tm);
            }
        };
        this.receive = function () {
            //TODO 提示用户网络断了？

        }
        function _startChat(msg) {
            //对话中访客发送service通道消息
            // _self.unSubscribe("sendVisitorEvent");
            // _self.subscribe("sendVisitorEvent", function (eventType, data, cb) {
            //     _sendMsg(data, cb, null, true);
            // });
            //初始化界面和注册事件
            _self.publish("startChat", msg);
        }


        //结束对话，不再接收访客发送的通道消息。
        //TODO
        function _endChat(msg) {
            _connected = false;
            //无MSG是访客发送的，有是客服端发送的
            if (msg) {
                _self.publish("chatEnded", msg);
                chatting = false;
            }
            _self.unSubscribe(["sendVisitorEvent", "visitorCommonEvent"]);
            _self.unSubscribe("restartChat");
            _self.subscribe("restartChat", function () {
                chat.publish('__callNative', { functionName: 'restartChat' });
            });
        }
        _self.subscribe("restartChat", function () {
            chat.publish('__callNative', { functionName: 'startChat' });
        });
        _self.subscribe("_endConnect", function () {
            _endChat({ justConnect: true });
        });


        //访客发送消息的统一地方。
        function _sendMsg(data, cb, hisItem, needChatStart) {
            var queue = needChatStart ? queueChat : queueCommon;
            var timeStamp = hisItem ? hisItem.item : new Date().getTime();
            var item = hisItem || { data: data, cb: cb, time: timeStamp, sending: true };
            //发送队列
            !(hisItem && data.et != 104) && queue.push(item);
            // if (_connected) {
            _self.publish('__sendMessage', data, function (publishAck) {
                if (cb) {//&& publishAck.successful
                    publishAck.bridgeMsgId = data.bridgeMsgId;//重发消息
                    cb.apply(this, arguments);
                }
                if (publishAck.successful) {
                    for (var i = queue.length - 1; i > -1; i--) {
                        if (queue[i] && queue[i].time == timeStamp) {
                            queue.splice(i, 1);
                            break;
                        }
                    }
                    flashMsg(false);
                } else {
                    item.sending = false;
                }
            });
            return true;
            // } else {
            //     item.sending = false;
            //     return false;
            // }
        }

        function flashMsg(needChatStart) {
            var queue = needChatStart ? queueChat : queueCommon;
            if (queue.length > 0) {
                // $.cometd.batch(function () {
                var item;
                //console.log(queue);
                for (var i = 0; i < queue.length; i++) {
                    item = queue[i];
                    //发送的消息后移除了 影响了队列，几率很小 直接退出。
                    //if (!item)break;

                    if (item.sending) {
                        continue;
                    }
                    item.sending = true;
                    if (!_sendMsg(item.data, item.cb, item)) {
                        // 网络链接断开
                        break;
                    } else {
                        //queue.shift();
                    }
                }
                // });
            }
        };

        function _connectionInitialized(handshakeReply) {
            //允许访客通过此途径发送信息 注册对话、TOKEN请求、以及将来可能的事件。 无需对话开始
            _self.unSubscribe(['sendVisitorEvent', "visitorCommonEvent"]);
            _self.subscribe("sendVisitorEvent", function (eventType, data, cb) {
                _sendMsg(data, cb, null, true);
            });
            _self.subscribe('visitorCommonEvent', function (eventtype, data, cb) {
                _sendMsg(data, cb, null, false);
            });
            //握手成功后删除重新对话事件，结束对话之后再订阅。
        }

        function _metaConnect(message) {
            return;
        }
        //调用Native方法
        _self.subscribe('__callNative', function (evt, data, cb) {
            __nativeAPI(data.functionName, data.value, cb);
        });
        //替代chathandle的内容转给Native发消息
        _self.unSubscribe('__registChatAction');
        _self.subscribe("__registChatAction", function (eventtype, data) {
            //发送109 103
            __nativeAPI('registChatAction', data);

        });

        //TODO 通知Native发送消息
        var sendMsgMap = {};
        var bridgeMsgIndex = 0;//用于关联回执
        var bridgeMsgIdPrefix = new Date().getTime() + "";//用于关联回执
        _self.subscribe('__sendMessage', function (evt, data, cb) {
            if (data.publishAck) {
                //代表是重发消息
                // data.publishAck.bridgeMsgId && (data.lastBridgeMsgId = data.publishAck.bridgeMsgId);
                data.bridgeMsgId = data.publishAck.bridgeMsgId;
                delete data.publishAck;
            }
            if (data.bridgeMsgId) {
                data.isResend = 1;
            } else {
                data.bridgeMsgId = bridgeMsgIdPrefix + (++bridgeMsgIndex);
            }

            __nativeAPI('sendMessage', data);
            sendMsgMap[data.bridgeMsgId] = cb;
        });
        //加载上一次对话记录
        _self.subscribe('__loadPreHistory', function (evt, data, cb) {
            __nativeAPI('loadPreHistory', { baseTalkId: _self.lastTalkId || '', talkType: _self.lastTalkType || '' });
        });
        //去除遮罩
        _self.subscribe('removeLoading', function (evt, data, cb) {
            __nativeAPI('removeLoading');
        });
        /**
         * JS调用native的方法
         * @param name string类型
         * @param param string类型
         * @private
         */
        var callbackIndex = 1;

        function __nativeAPI(name, param, callback) {
            console.log(name, param, callback);
            if (!name) {
                return;
            }
            try {
                var mutiParams = {
                    "functionName": name
                }
                if (param) {
                    mutiParams.value = param;
                }
                if (callback && typeof callback == 'function') {
                    mutiParams.callback = "callback_" + callbackIndex;
                    window[mutiParams.callback] = function () {
                        console.log('callback***' + mutiParams.callback, arguments);
                        callback.apply(callback, arguments);
                        window[mutiParams.callback] = null;
                    }
                    callbackIndex++;
                }
                if (!window.wkWebkit) {
                    window.EchatJsBridge && EchatJsBridge.callEchatNativeConnect(JSON.stringify(mutiParams))
                } else {
                    window.webkit && window.webkit.messageHandlers.callEchatNativeConnect.postMessage(JSON.stringify(mutiParams));
                }
            } catch (e) {
                console.log(e);
            }
        }
        // 暂时不捕捉异常，上线后再捕捉
        function parseJson(params) {
            return typeof params == 'string' ? JSON.parse(params + "") : params
        }
        //native调用JS的方法
        window.callEchatJsConnect = function (params) {
            var json = parseJson(params);
            console.log('%ccallEchatJs:%c %o', 'color:green', 'color:green', JSON.stringify(params));
            json.functionName && echatPageService[json.functionName] && echatPageService[json.functionName](json.value);
        }

        var historyMap = {
            //防止重复消息,只保存第一个,649保存最后一个有效的
            600: 0,
            103: 0,
            649: 0,
            109: 0,
            encryptVId: 0
        }, lastTalkId, lastTalkType,//上次一对话记录
            lastUnReadTalkId, unReadList = []//上次一对话记录
        var echatPageService = {
            msgFromServer: function (params) {
                if (!params) {
                    return;
                }
                console.log('msgFromServer',params)
                var json = parseJson(params);
                if (json.bridgeMsgId && sendMsgMap[json.bridgeMsgId]) {
                    //发送消息回执处理
                    sendMsgMap[json.bridgeMsgId](json);
                    sendMsgMap[json.bridgeMsgId] = undefined;
                } else if (json.mt || json.encryptVId) {
                    if (json.encryptVId) {
                        window.encryptVID = _self.encryptVID = view.chat.encryptVID = json.encryptVId;
                        _self.companyId = view.chat.companyId = json.companyId;
                    }
                    _self.receiveChat(json);
                } else if (json.et) {
                    //todo 109的参数要处理,方便后面103发送
                } else if (!json.mt) {
                    _metaConnect(json);
                }
            },
            msgFromDB: function (params) {
                var json = parseJson(params);
                var historyList = []
                var list = (json.chatDetailList == 'null' ? [] : json.chatDetailList) || [];
                if (Object.prototype.toString.call((list)) == '[object Array]') {
                    for (var i = 0; i < list.length; i++) {
                        json = list[i];
                        if (json.mt && json.mt != 644 && json.mt != 10005 && historyMap[json.mt] != 1) {//客服输入中
                            if (typeof historyMap[json.mt] != 'undefined') {
                                //指定的几个消息600 103等、防止重复消息
                                if (json.mt == 649 && historyMap[json.mt] == 1) {
                                    if (json.sdkChatBoxInfo) {//机器人转人工后,一个ws会有二次649
                                        historyList.push(json);
                                    }
                                } else {
                                    historyList.push(json);
                                    historyMap[json.mt] = 1;
                                }
                            } else {
                                historyList.push(json);
                            }
                            historyMap.encryptVId = json.encryptVId || json.encryptVID || historyMap.encryptVId
                        } else if (json.et && (json.et != 104 && historyMap[json.et] != 1)) {//访客输入中  109 103
                            if (typeof historyMap[json.et] != 'undefined') {
                                historyMap[json.et] == 0 && historyList.push(json);
                                historyMap[json.et] = 1;
                            } else {
                                if (!_self.lastUnReadMid || _self.lastUnReadMid < json.mid) {//无未读消息列表 或者未读消息列表中还没处理的mid
                                    historyList.push(json);
                                }
                            }
                        } else if (json.clientFileId) {
                            //发送文件 fileType	Int	1图片，2文件，3语音，4视频
                            json.mt = 866;
                            historyList.push(json);
                            
                        }
                    }
                    historyList.length && _self.handleHistoryMsg(historyList);
                }
            },
            allTalkIdFromHistory: function (params) {
                console.log("******allTalkIdFromHistory****", params)
                if (!params) {
                    view.chat.hidePreHistory();
                } else {
                    var json = parseJson(params);
                    if (json.length > 1 && json[0] == 'null') {
                        json.shift();
                        view.chat.showPreHistory();
                    }
                    if (json[0] == 'null') {
                        view.chat.hidePreHistory();
                        _self.lastTalkIdFromNative = undefined
                    } else {
                        _self.lastTalkIdFromNative = json[0] && json[0].talkId || undefined;
                    }
                }
            },
            msgFromUnRead: function (params) {
                if (params == 'null' || !params) {
                    //没有未读
                    return;
                }
                var json = parseJson(params);
                if (Object.prototype.toString.call((json)) == '[object Array]') {
                    alert('msgFromUnRead value 为Array json 格式，兼容多个会话的未读消息')
                    return;
                }
                unReadList = {};
                var chatList = [];
                for (var i = 0; i < json.length; i++) {
                    unReadList[json[i].talkId] = { talkId: json[i].talkId, talkType: json[i].talkType };
                    chatList = json[i].chatDetailList || [];
                    for (var k = 0; k < chatList.length; k++) {
                        getHistory(chatList[k], unReadList[json[i].talkId], 'unread')
                    }
                }

                console.log("*****************msgFromUnRead*handle*****************")
                console.log(unReadList);
                setTimeout(function () {
                    //显示历史消息 包含未读消息
                    for (var talkId in unReadList) {
                        //TODO 处理多次600 649
                        var historyList = unReadList[talkId], len = historyList.length;
                        if (!len) {
                            continue;
                        }
                        if (lastUnReadTalkId == talkId && historyList[len - 1].mt != '605' && historyList[len - 1].mt != '10009') {//还没结束 按照恢复对话处理
                            _self.handleHistoryMsg(historyList);
                            continue
                        }

                        var newStart = true, msg649, msg;//可能有机器人转人工,可能有多次握手。过滤多次600 109 671
                        for (var i = 0; i < len; i++) {
                            msg = historyList[i];
                            //109 103后面就不需要600 109 013 671 直到转人工
                            if ((i > 3 && msg.mt == 600)) {//不是第一次600 里面的649 109都不要
                                newStart = false;//重新握手了。只能是自动重连。
                            }
                            if (!newStart && (msg.mt == 671 || msg.et == 109 || msg.et == 103) || (i > 3 && msg.mt == 600)) {
                                historyList.splice(i);//删除
                                i--;
                                len--;
                                continue;
                            } else if (newStart) {
                                if (msg.mt == 12001 && msg.type == 3 && (msg.result == 204 || msg.result == 205)) {
                                    newStart = true;//转人工了 可以继续有注册对话
                                }
                            }
                            if (msg.mt == '649') {
                                msg649 = msg;
                            } else if (msg.mt == '600') {
                                msg.routeEntranceInfo = undefined;
                                msg649 = null;
                            } else if (msg.mt == '670' || msg.mt == 679 || msg.mt == 604) {
                                msg649 && (msg649.sdkEntranceInfo = undefined);
                                msg649 && (msg649.captChaToken = undefined);
                            }
                        }
                        if (!_self.lastTalkId) {//第一个是最上面一个,当做拉取历史记录的基准
                            _self.lastTalkId = lastTalkId = json.talkId;
                            // _self.lastTalkType = lastTalkType = json.lastTalkType;
                        }
                        view.chat.showHis(unReadList[talkId], talkId);
                    }

                }, 1)
            },
            getUnReadyMsg: function (params) {
                if (params == 'null') {
                    //没有消息
                } else {
                    getHistory(params, unReadList[lastUnReadTalkId], 'unread')
                }
            },
            getUnReadMsg: function (params) {
                if (params == 'null') {
                    //没有消息
                } else {
                    getHistory(params, unReadList[lastUnReadTalkId], 'unread')
                }
            },
            msgFromHistory: function (params) {
                if (params == 'null' || !params) {
                    view.chat.hidePreHistory();
                    return;
                } 
                var json = parseJson(params);
                _self.lastTalkId = lastTalkId = json.talkId;
                _self.lastTalkType = lastTalkType = json.talkIdType||json.talkType;
                if (lastTalkId == _self.lastTalkIdFromNative) {
                    view.chat.hidePreHistory();
                }

                var lastHistoryList = {};
                var chatList = json.chatDetailList || [];
                for (var k = 0; k < chatList.length; k++) {
                    getHistory(chatList[k], lastHistoryList)
                }
                 console.log('%cmsgFromHistory showHis%c%o', 'color:green', 'color:green', lastHistoryList)
                 //todo 处理历史记录
                view.chat.showHis(lastHistoryList, lastTalkId);

            },
            prepareUpload:function(params){//告知H5准备上传
                var json = parseJson(params);
                // view.fileMsgs[json.clientFileId] = json;
                // var content = '<div class="file-sending">' + fileTypeMap[json.fileType || 0] + '准备上传' + '</div>';
                content = view.getMsgSendingFile(json)
                // 显示开始上传
                if(_$(json.clientFileId)){
                    view.chat.updateMsg(json.clientFileId, content);
                    $(".file-resend",_$(json.clientFileId)).remove();//删除重发
                }else{
                    view.chat.showMsg({ id: json.clientFileId, f: "c" },content);
                }
            },
            uploadKey:function(params){//告知H5准备上传
                echatPageService.prepareUpload({
                    clientFileId:params
                });
            },
            uploadStart: function (params) {//开始上传
                var json = parseJson(params);
                // view.fileMsgs[json.clientFileId] = json;
                // 显示开始上传
                view.chat.updateMsg(json.clientFileId,  view.getMsgSendingFile(json));
            },
            uploadProgress: function (params) {
                var json = parseJson(params);
                // 显示上传进度或者上传结果
                if (!json.progress || view.fileMsgs[json.clientFileId] && view.fileMsgs[json.clientFileId].sendStatus == 4) {
                    return;
                }
                view.chat.updateMsg(json.clientFileId,  view.getMsgSendingFile(json));

            },//发送完成收到服务器消息完整更新本条消息
            updateLocalMessage:function (params) {
                var json = parseJson(params);
                view.fileMsgs[json.clientFileId] && (view.fileMsgs[json.clientFileId] = json);
            },
            downloadProgress: function (params) {
                var json = parseJson(params);
                var msg = view.fileMsgs[params.identityKey];
                var el = _$(params.identityKey);
                if(msg){
                    msg.loadStatus = json.loadStatus;
                }
                if(el){
                    btn = $('.file-load-btn', el).results[0];
                    if (btn && json.loadStatus == 1) {
                        btn.innerHTML = '文件下载完成';
                        btn.className = 'file-load-status file-load-status1'
                    }else if (json.loadStatus == 2) {
                        btn.innerHTML = '文件下载中' + json.progress + '%,点击取消下载';
                        btn.className = 'file-load-btn file-load-status2'
                    }else if (json.loadStatus == 3) {
                        btn.innerHTML = '文件下载取消，点击重新下载';
                        btn.className = 'file-load-btn file-load-status3';
                    }
                }
            }
        }
        /**
         * 历史记录消息 和 未读消息 处理
         * @param {*} params 
         * @param {*} list 
         * @param {*} type 
         */
        function getHistory(params, list, type) {
            var json = parseJson(params);
            if (json.et == 105 || json.et == 130 || json.mt == 864) {
                json.mt = 864;
                json.f = 'c';//访客消息
                (json.et == 130) && (json.ff = 'r')//机器人
                //0 文本 1文件 2图片...
                json.m = 0;
            } else if (json.mt == 640 || json.mt == 641 || json.mt == 642) {
                json.f = 's';//客服
                (json.mt == 640) && (json.m = 0);
                (json.mt == 641) && (json.m = 2);
                (json.mt == 642) && (json.m = 1);
            } else if (json.et == 127) {
                json.f = 'c';//访客地图
                json.mt = 127
            } else if (json.mt == 12001) {
                json.f = 'r';//机器人
            } else if (json.et == 104 || json.mt == 644 || json.et == 106) {//提交信息收集
                return;//正在输入不加入
            }
            var tm = json.tm || (new Date().getTime())
            if (json.mt != 673 || type == 'unread') {//邀请评价不在加载历史记录中显示 本次对话的历史记录
                list[tm] = json;
                if (list.order) {
                    list.order.push(tm)
                } else {
                    list.order = [tm]
                }
            }
            if (type == 'unread') {
                if (json.mt == 649 || json.mt == 604 || json.mt == 600) {
                    if (list.config) {
                        list.config.push(json)
                    } else {
                        list.config = [json]
                    }
                }
                if (json.mid) {
                    _self.lastUnReadMid = json.mid;
                }
            }
        }
        /**
         * 恢复对话msgfromdb和未读消息unreadMsg 消息处理
         *
         */
        _self.handleHistoryMsg = function (historyList) {
            console.log('handleHistoryMsg', historyList);
            var i, len = historyList.length,
                msg = historyList[len - 1],
                chatEnd = false,
                error = false,
                newStart = true,//中途可能有机器人转人工,可能有多次握手。过滤多次600 109 671
                msg649;//根据649后面的消息 去除里面的信息收集
            if (!len) {
                return;
            }
            if (msg.mt == 600 || msg.mt == 649) {
                error = true;
                return;
            } else if (msg.mt == 605) {
                chatEnd = true;
            } else if (msg.mt == 10009) {
                chatEnd = true;
            } else {
                msg649 = null;
                //todo 去掉649的入口信息收集和验证码 600的咨询入口
                for (i = 0; i < len; i++) {
                    msg = historyList[i];
                    //109 103后面就不需要600 109 013 671 直到转人工
                    if ((i > 3 && msg.mt == 600)) {//不是第一次600 里面的649 109都不要
                        newStart = false;//重新握手了。只能是自动重连。
                    }
                    if ((i > 3 && msg.mt == 600) || (!newStart && (msg.mt == 671 || msg.et == 109 || msg.et == 103))) {
                        historyList.splice(i);//删除
                        i--;
                        len--;
                        continue;
                    } else if (newStart) {
                        if (msg.mt == 12001 && msg.type == 3 && (msg.result == 204 || msg.result == 205)) {
                            newStart = true;//转人工了 可以继续有注册对话
                        }
                    }
                    if (msg.mt == '649') {
                        msg649 = msg;
                    } else if (msg.mt == '600') {
                        msg.routeEntranceInfo = undefined;
                        msg649 = null;
                    } else if (msg.mt == '670' || msg.mt == 679 || msg.mt == 604) {
                        msg649 && (msg649.sdkEntranceInfo = undefined);
                        msg649 && (msg649.captChaToken = undefined);
                    }
                }


            }

            var last673,//邀请评价处理;
                inviteId = $.store('ECHAT_inviteSatisfyId'),
                handleId = $.store('ECHAT_inviteSatisfyHandle'),
                need673 = true;
            if (inviteId == handleId) {
                need673 = false
            }
            for (i = len - 1; i > -1; i--) {
                msg = historyList[i];
                if (msg.mt == 600) {
                    if (msg.routeEntranceInfo) {
                        if (i < len - 1) {//这里只会有这种情况,因为前面已经处理过了
                            msg.routeEntranceInfo = null;
                        }
                    } else {
                        //todo error
                        error = true;
                    }

                } else if (msg.mt == 649) {
                    var msg649 = $.store('ECHAT_' + _self.companyId + "_649");
                    if (msg649) {
                        msg649 = JSON.parse(msg649)
                        msg.sdkEntranceInfo = null
                        msg.captChaToken = null
                        msg.robotConfigInfo = null
                        historyList[i] = $.extend(msg649 || {}, msg);
                    }
                } else if (msg.mt == 673) {
                    if (!need673) {
                        msg.del = true;//只保留访客没有处理过的邀请
                    } else if (inviteId < msg.mid) {
                        msg.del = true;//只保留最后一次邀请
                    } else if (last673) {
                        msg.del = true;//只保留最后一次邀请
                    } else {
                        last673 = msg;
                    }
                }
            }
            var newMsg = [];
            //按顺序处理消息
            for (i = 0; i < len; i++) {
                msg = historyList[i]
                if (msg.del) {
                    continue
                }
                msg.fromDB = true;
                if (msg.mt == 670) {
                    //处理历史消息不再注册对话
                    continue;
                }
                if (msg.et == 105 || msg.et == 130) {//访客发送
                    msg.mt = 864;
                } else if (msg.et == 127) {
                    //访客地图
                    msg.mt = 127;
                }
                msg.fromHistory = true;
                if (msg.isForward === false && msg.mt != 605) {
                    //加入未读消息列表
                    newMsg.push[msg];
                }
                if (msg.mt == 866 && msg.sendStatus != 2) {
                    view.chat.showMsg(json.clientFileId,view.getMsgSendingFile(msg));
                }else{
                    _self.selfMsg(msg);
                }
            }
            if (chatEnd && newMsg.length > 1) {
                var list = {
                    data: {
                        chatDetailList: newMsg
                    }
                }
                _self.publish("receiveUnread", list);
                // 显示接入对话按钮
            }
        }
    }
    var chat = new ChatConnect();
    ECHATObjKeyMap["cometdId"] = chat;
    chat.setSub("chatId");
    chat.setSub("cometdId");
    window.initChat = function () {
        //通知Native H5页面准备完毕
        var lastChatstatus = $.store('ECHAT_chatStatus');
        if (lastChatstatus == 'waiting' || lastChatstatus == 'chatting') {
            // data.talkId = $.store('ECHAT_talkId')
        }
        setTimeout(function () {
            console.log('pageReady')
            //初始化,查询历史talkId列表 发送解析消息配置。。。
            chat.publish('__callNative', {
                functionName: 'pageReady', value: {
                    // encryptVID: window.encryptVID || '13Uhqd8H4BE=',
                    // dataHost: window.dataHost,
                    // companyId: chat.companyId || 174,
                    // appId: 'SDKFPXARTHJZXKCOEWK',
                    // appSecret: 'DKXAEXUTGAERFCSQMCCCSUDC4NBVHUNVHHAMV9ZAWTN',
                    // deviceToken: 'ssss'
                }
            });
        });
        //查询所有历史记录的talkId
        chat.publish('__callNative', { functionName: 'queryTalkIDs' });
        //主动查询当前访客的未读消息,会以完整会话的形势给到
        chat.publish('__callNative', { functionName: 'getUnReadMessage' });
    }
    window.retryTime = 0;
})(EChatQuery);


function InputHandle() {
    var that = this;

    this.filterPasteData = function (sHtml, isText,pureText) {
        var newLine = pureText ? '\r\n' : '<br/>'
        if (sHtml && isText) {
            return sHtml.replace(/(^[\s\r\n]+)|[\r]|([\s\r\n]+$)/g, "").replace(/[\r\n]+([\r\n\s]+)*/g, newLine) //换行显示出来
        }
        var sHtml2 = sHtml && sHtml.replace(/<(br|hr)\/?>/ig, '\n')
            .replace(/<\/(br|p|div|table|section|footer|article|li|ul|ol)>/ig, '\n')//换行保存下来
            .replace(/(<[a-z]+(\s+[^>]*)?>)|(<\/?[a-z]+\/?>)/ig, '')//剩下的所有标签过滤
            .replace(/([\r\n]+)|([\r\n]+[\s]+[\r\n]*)|([\r\n]*[\s]+[\r\n]+)/g, '\n') //换行显示出来
            .replace(/[\n]+/g, newLine);//多个换行合并
        return sHtml2;
    }
    /**
     * 获取输入的文本
     * clear代表是否要清除输入框（发送时用）
     */
    this.getInput = function (clear) {
        if (that.plainText) {
            var v = $("#textInput").val();
            if (v) {
                if (clear) {
                    $("#textInput").val("");
                    var input = _$("textInput");
                    // input.blur();//blur干嘛???
                }
                return that.filterPasteData(v,true,true);
            }
            return v;
        }

        var doc = that.getInputDoc(), body = that.getInputDocBody(), msgOrigin
        var msg = msgOrigin = body.innerHTML;

        if (msg.length > 500) {
            //比较长的直接取文本
            body.innerHTML = msgOrigin.replace(/<img[^>]+code="([^"]+)"[^>]*>/ig, "[#$1#]");
            msg = (typeof body.innerText == "string") ? body.innerText : body.textContent;
        } else {
        }

        if (clear) {
            body.innerHTML = '';
            $("#inputPlaceholder").removeClass("hide");
        } else if (msgOrigin.length > 500) {
            body.innerHTML = msgOrigin;
        }
        if (msgOrigin.length > 500) {
            str = msg;
        } else {
            //去除插件DIV 去除前后空余BR
            // return msg.replace(/<img[^>]+code="([^"]+)"[^>]*>/ig, "[#$1#]").replace(/<(?!br|\/br)(?:.|\s)*?>/ig, "").replace(/(&nbsp;)+/ig, " ").replace(/^((<\/?br\/?>)|[\r\n\s]+)+|((<\/?br\/?>)|[\r\n\s]+)+$/ig, "");
            var str = msg.replace(/<img[^>]+code="([^"]+)"[^>]*>/ig, "[#$1#]")
            str = that.filterPasteData(str,false,true);
        }
        if (str.length > 5000) {
            //超出5000(后台是10000)直接截断
            str = str.substring(0, 5000);
        }

        return str;
    }
    this.setInput = function (text) {
        if (!text) {
            return this.getInput(true);
        }
        text = text.replace(/<img[^>]+code="([^"]+)"[^>]*>/ig, "[#$1#]").replace(/<(?!br|\/br)(?:.|\s)*?>/ig, "").replace(/&nbsp;/ig, " ").replace(/^((<\/?br\/?>)|[\r\n\s]+)+|((<\/?br\/?>)|[\r\n\s]+)+$/ig, "");
        if (that.plainText) {
            $("#textInput").val(text);
        } else {
            var doc = that.getInputDoc(), body = that.getInputDocBody();
            body.innerHTML = text;
        }
    }

    this.inputScrollToView = function (input) {
        var that = this;
        var hasShowInput = 5;
        var scrollTimes = 1;
        $(input).on("focus", function (e) {
            if (window.top == window) {
                scrollWin();
                scrollTimes = 1;
            } else {
                that.postMessage("inputScroll");
            }
            // e.preventDefault();//??这句什么意思
        });
        $(input).on("blur", function (e) {
            scrollTimes = 1;
            setTimeout(function () {
                that.postMessage("inputScrollStop");
            }, 550);
        });
        function scrollWin() {
            if (scrollTimes > 15) return;
            setTimeout(function () {
                var top = window.innerHeight + (that.isIOS ? 80 : 20);//ios app里面的VIEW/微信必须这样推
                window.scrollTo(0, top);
                scrollTimes++;
                scrollWin();
            }, 100);
        };
        /* setTimeout(function () {
             input.focus();
         }, 500);  不获取焦点会有表情问题*/
    }
    this.changeToIframe = function (historyHTML, oImg) {
        if (!this.plainText) return;
        this.plainText = false;
        this.editorType = 2;
        var that = this;
        $("#textInput").hide();
        // $("#textInput").off("keydown").hide();
        var iframe = _$("html_input");
        iframe.style.display = "block";
        //只绑定一次事件
        if (this.hasInitIframeInput) {
            return;
        }
        this.hasInitIframeInput = true;
        var doc = that.getInputDoc();
        //只需键入以下设定，iframe立刻变成编辑器。
        // if ("designMode" in doc) {
        try {
            doc.designMode = 'on';
        } catch (e) {
            console.log(e);
        }
        // }
        doc.contentEditable = true;
        //但是IE与FireFox有点不同，为了兼容FireFox，所以必须创建一个新的document。
        try {
            if (window.isIE6) {
                doc.write("<html><head><meta http-equiv=\"Content-type\" content=\"text/html;charset=utf-8\"><style type='text/css'>html,body{width:100%;height:100%;max-height: 100%;overflow: auto;margin:0;padding:0;background-color:transparent;font-family: \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica,\"微软雅黑\", Arial, sans-serif, STHeiti, FangSong;}</style></head><body></body></html>");
            }
            else {
                doc.open();
                doc.write("<html><head><meta http-equiv=\"Content-type\" content=\"text/html;charset=utf-8\"><style type='text/css'>html,body{width:100%;height:100%;max-height: 100%;overflow: auto;margin:0;padding:0;background-color:transparent;font-family: \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica,\"微软雅黑\", Arial, sans-serif, STHeiti, FangSong;}"
                    + (view.windowType == 1 ? '' : ' .img-emo{width:20px;height:20px;') + "}</style></head><body></body></html>");
                doc.close();
            }
        } catch (e) {

        }


        var body = doc.getElementsByTagName("body")[0];
        body.style.cssText = "margin:0;padding:0;word-break:break-all;white-space: pre-wrap;word-wrap: break-word;width:100%;line-height:1.2;overflow-x:hidden;overflow-y:auto;";
        that.win = iframe.contentWindow || document.frames["html_input"];

        function GetPos(e) {
            $("#inputPlaceholder").addClass("hide");
            var doc = that.getInputDoc();
            var r = null;
            if (doc.selection) {
                r = doc.selection.createRange();
            } else if (that.win.getSelection) {
                if (that.win.getSelection().rangeCount) {
                    r = that.win.getSelection().getRangeAt(0);
                }
            }
            // var range = (doc.selection && doc.selection.createRange()) || (that.win.getSelection && that.win.getSelection().rangeCount ? that.win.getSelection().getRangeAt(0) : null);
            // return range && (that.win.pos = range);
            return r && (that.win.pos = r);
        }

        that.getPos = GetPos;
        function focusHandle() {
            GetPos();
            view.hideMenus(0);
        };
        function blurHandle() {
            GetPos();
            if (!that.getInput(false)) {
                $("#inputPlaceholder").removeClass("hide");
            }
        }
        function addEvent(el, name, fn) {
            if (el.addEventListener) {
                el.addEventListener(name, fn);
            } else {
                el.attachEvent("on" + name, fn);
            }
        }

        addEvent(that.win, 'focus', focusHandle);
        addEvent(that.win, 'blur', blurHandle);
        addEvent(body, 'focus', focusHandle);
        addEvent(body, 'blur', blurHandle);
        addEvent(body, 'select', GetPos);
        addEvent(body, 'click', function (ev) {
            GetPos(ev);
            view.hideMenus(0);

        });
        addEvent(body, 'keydown', function (ev) {
            $("#inputPlaceholder").addClass("hide");
            var e = ev || that.win.event;
            return view.enter(e);
        });
       /*  addEvent(body, 'drop', function (ev) {
            setTimeout(function () {
                if (that.getInput(false)) {
                    $("#inputPlaceholder").addClass("hide");
                }
            }, 100)
            //禁止火狐浏览器拖拽搜索
            ev&&ev.stopPropagation();
        }); */
        addEvent(body, 'drop', function (ev) {
            setTimeout(function () {
                if (that.getInput(false)) {
                    $("#inputPlaceholder").addClass("hide");
                }
            }, 100)
            if(that.Browser.browser=='firefox'){
              //禁止火狐浏览器拖拽搜索
            }
        }); 
        addEvent(doc, 'paste', function (ev) {
            setTimeout(function () {
                if (!that.getInput(false)) {
                    $("#inputPlaceholder").removeClass("hide");
                } else {
                    $("#inputPlaceholder").addClass("hide");
                }
            }, 100)
        });
        if (that.isMobile) {
            that.inputScrollToView(body);
        }
        //绑定事件ce
        view.initHtmlEdit && view.initHtmlEdit(that.win, doc);
        if (!that.isMobile) {
            //粘贴文件
            that.addPaste(that.win, doc);
        }
        setTimeout(function () {
            if (!that.getInput(false)) {
                $("#inputPlaceholder").removeClass("hide");
            } else {
                $("#inputPlaceholder").addClass("hide");
            }
        }, 100)
    }
    this.preRange = null;
    /**todo 使用pre作为编辑文本输入*/
    this.changeToPreInput = function () {
        if (!this.plainText) return;
        this.editorType = 3;
        this.plainText = false;
        var that = this;
        $("#textInput").hide();
        // $("#textInput").off("keydown").hide();
        var editor = $("#html_pre_input"),
            entEditor = editor.results[0];
        editor.css('display', "block");
        if (that.isMobile) {
            that.inputScrollToView(that.getInputDocBody());
        }
        var inpTimer;
        entEditor.onkeyup = function () {//如果把光标移动中间某个位置后输入也要更新range
            clearTimeout(inpTimer);
            inpTimer = setTimeout(function () {
                GetPos();
            }, 300);
        };
        entEditor.onkeydown = function (ev) {
            $("#inputPlaceholder").addClass("hide");
            var e = ev || window.event;
            return view.enter(ev);
        }
        entEditor.ontouchend = function (evt) {
            setTimeout(function () {//需要延时不然后获得range还是上一个位置的
                GetPos(evt);
            }, 50);
        };
        entEditor.ontouchstart = function (evt) {
            $("#inputPlaceholder").addClass("hide");
        };
        entEditor.onfocus = function () {//输入框获取焦点后被表情隐藏点
            $("#inputPlaceholder").addClass("hide");
            GetPos();
            view.hideMenus(0);
        };
        entEditor.onblur = function () {//输入框获取焦点后被表情隐藏点
            if (!that.getInput(false)) {
                $("#inputPlaceholder").removeClass("hide");
            }
        };
        entEditor.onclick = function () {
            GetPos();
            view.hideMenus(0);
            entEditor.focus();
        }
        function GetPos(evt) {

            var range,
                realEditor = editor.results[0];
            if (window.getSelection) {
                var sel = window.getSelection();
                try {//获取range如果没有直接创建
                    range = sel.getRangeAt(0);
                } catch (e) {
                    range = document.createRange();
                    range.selectNodeContents(realEditor);
                    range.collapse(false);
                    range.select();/* 
                    range.collapse(true);
                    range.setEnd(realEditor, realEditor.childNodes.length);
                    range.setStart(realEditor, realEditor.childNodes.length); */
                }
            } else {
                range = document.selection.createRange();
            }
            that.preRange = range;
            return range;
        }
        //pre输入框进来时需要获取焦点
        /*  setTimeout(function () {
              entEditor.focus()
          },10);*/

        that.getPos = GetPos;
    }
    this.bindPlainTextEvent = function () {
        this.plainText = true;
        this.editorType = 1;
        $("#textInput").show();
        var iframe = _$("html_input");
        $(iframe).hide();



        //目前只有手机,无需处理placeholder
        var that = this;
        $("#inputPlaceholder").addClass('hide');
        if (that.isMobile) {

        } else {
            //todo
        }

        if (this.hasBindPlainTextEvent) {
            //避免重复绑定 重复粘贴等
            return;
        }
        this.hasBindPlainTextEvent = true;

        view.bindPlainTextEvent();
        $("#textInput").off('keydown').on("keydown", function (e) {
            var e = e || window.event;
            that.handleInputLength && setTimeout(that.handleInputLength, 50);
            if (view.enter(e) === false) {
                //发送
                return;
            };
            var currKey = e.keyCode || e.which || e.charCode || 0;
            if (currKey == 8) {
                //找到光标位置 看看是不是删除的表情
                var el = _$("textInput");
                // tc.focus();当前肯定是focus
                var text = el.value;

                if (el.createTextRange) {//IE浏览器
                    console.log('手机端IE?')
                } else {//非IE浏览器
                    var curStart = el.selectionStart, newPos = -1, end = 0;
                    if (curStart > 0) {
                        text.replace(/\[#([^#]+)#\]/g, function (label, emo, index, val) {
                            if (index < curStart && (index + label.length) >= curStart) {
                                newPos = index;
                                end = index + label.length;
                            }
                            return label
                        });
                    }
                    if (newPos != -1) {
                        el.setSelectionRange(newPos, end);
                    }
                }
            }
            GetPos();
        }).on('change input', function () {
            that.handleInputLength && that.handleInputLength();
            GetPos();
        }).on('paste', function (e) {
            return that.filterPasteText(e,undefined,window,document);
        }).on("drop", function(e){
            that.handleInputLength && setTimeout(function(){
                that.handleInputLength();
            })
        }).on("focus",GetPos);
        setTimeout(function () {
            _$("textInput").scrollIntoView();
        }, 400)

        that.textRange = null;
        function GetPos(evt) {
            var range,
                realEditor = _$("textInput");
            if (window.getSelection) {
                var sel = window.getSelection();
                try {//获取range如果没有直接创建
                    range = sel.getRangeAt(0);
                } catch (e) {
                    range = document.createRange();
                    range.selectNodeContents(realEditor);
                    range.collapse(true);
                    // range.select();
                    /* range.collapse(true);
                    range.setEnd(realEditor, realEditor.value.length);
                    range.setStart(realEditor, realEditor.value.length); */
                }
            } else {
                range = document.selection.createRange();
            }
            that.textRange = range;
            return range;
        }
    }
    this.filterPasteText = function (e, text,window,document) {
        var input = document.getElementById('textInput')
        if (typeof text == 'undefined') {
            if (window.clipboardData && clipboardData.setData) {
                // IE 11+
                text = window.clipboardData.getData('text');
            } else {
                text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
            }
        }
        if (text) {
            text = that.filterPasteData(text,undefined,true);
            e.returnValue = false;
            e.preventDefault && e.preventDefault();
            e.stopPropagation&&e.stopPropagation();
            if (text && that.plainText) {
                if (document.selection) {
                    var sel = document.selection.createRange();
                    sel.text = text;
                } else if (typeof input.selectionStart === 'number' && typeof input.selectionEnd === 'number') {
                    var startPos = input.selectionStart,
                        endPos = input.selectionEnd,
                        cursorPos = startPos,
                        tmpStr = input.value;
                        input.value = tmpStr.substring(0, startPos) + text + tmpStr.substring(endPos, tmpStr.length);
                    cursorPos += text.length;
                    input.selectionStart = input.selectionEnd = cursorPos;
                } else {
                    input.value += text;
                }
            }
            else if (text && document.body.createTextRange) {
                if (document.selection) {
                    textRange = document.selection.createRange();
                } else if (window.getSelection) {
                    // if(view.chat.Browser.browser=='msie'&&view.chat.Browser.version==0){
                        // document.execCommand("insertText", false, text);
                        // return true;
                    // }
                    sel = window.getSelection();
                    var range = sel.getRangeAt(0);

                    // 创建临时元素，使得TextRange可以移动到正确的位置
                    var tempEl = document.createElement("span");
                    tempEl.innerHTML = "&#FEFF;";
                    range.deleteContents();
                    range.insertNode(tempEl);
                    textRange = document.body.createTextRange();
                    textRange.moveToElementText(tempEl);
                    tempEl.parentNode.removeChild(tempEl);
                }
                textRange.text = text;
                textRange.collapse(false);
                textRange.select();
            } else if (text) {
                // Chrome之类浏览器
                document.execCommand("insertText", false, text);
            }
            return false;
        } else {
            return true;
        }
    }

    /**todo 获取输入框所在的document*/
    this.getInputDoc = function () {
        var doc, et = this.editorType;
        if (et == 2) {//iframe输入框
            if (!(doc = _$("html_input").contentDocument)) {
                doc = document.frames["html_input"].document;
            }
        } else {//textarea pre输入框都是当前document
            doc = document;
        }
        return doc;
    }
    /**todo 获取输入框本身*/
    this.getInputDocBody = function () {//
        var doc, body, et = this.editorType;

        if (et == 3) {//使用pre作为输入框
            body = _$('html_pre_input');
            body.blur || (body.blur = function () {
                window.focus();
            });
        } else if (et == 2) {//使用iframe作为输入框
            if (!(doc = _$("html_input").contentDocument)) {
                doc = document.frames["html_input"].document;
            }
            body = doc.body || doc.getElementsByTagName('body')[0];
        } else {
            body = _$('textInput');
        }
        return body;
    }
    this.focusInput = function (notFocus) {
        var win, et = this.editorType, doc, body;

        if (et == 3) {//使用pre作为输入框
            win = _$('html_pre_input');
        } else if (et == 2) {//使用iframe作为输入框
            win = _$("html_input").contentWindow || document.frames["html_input"]
            if (!(doc = _$("html_input").contentDocument)) {
                doc = document.frames["html_input"].document;
            }
            body = doc.body || doc.getElementsByTagName('body')[0];
            !notFocus && body.focus();

        } else {
            win = _$('textInput');
        }
        !notFocus && win.focus();
        !notFocus && body && body.focus();
        return win;
    }
    this.insertImg = function (code) {
        var that = this;
        if (that.plainText) {
            _$("textInput").value += '[#' + that.emoLan[code] + '#]';
            view.textInputChange && view.textInputChange();
            return;
        }
        var url = "/res/emoji/24/" + code + ".png",
            doc = this.getInputDoc(), body = this.getInputDocBody(),
            win = that.win,
            et = this.editorType,
            range = win ? win.pos : null;
        if (et == 3) {
            win = window;
            range = that.preRange;
        }
        //插入图片至编辑器
        if (doc.selection && !/opera/ig.test(view.chat.Browser.browser)) {//IE10及以下
            var _image = '<img class="img-emo" src="' + url + '" border="0" code="' + code + '" unselectable="on"/>';
            if (range) {
                win.focus();
                //doc.selection.createRange().pasteHTML(_image);
                setTimeout(function () {
                    range = win.pos || range;
                    // doc.selection.createRange().pasteHTML(_image);
                    range.pasteHTML(_image);
                    range.collapse(true);
                    range.select();//这两句 让IE的光标跑到插入表情的后面。
                }, 1);
            } else {
                //目前没被执行过
                var _image = doc.createElement("img");
                _image.className = 'img-emo';
                _image.src = url;
                _image.border = "0";

                _image.setAttribute("code", code);
                _image.setAttribute("unselectable", "on");
                doc.getElementsByTagName("body")[0].appendChild(_image);
                body.appendChild(_image);
            }
        } else if (window.getSelection) {
            var sel;
            var _image = doc.createElement("img");
            _image.className = 'img-emo';
            _image.src = url;
            _image.border = "0";

            _image.setAttribute("code", code);
            _image.setAttribute("unselectable", "on");

            //console.log("*******rangeCount:" + win.pos.rangeCount);
            /*  if (!range) {
                  //todo 如果 右侧广告有输入框,会获取不到,下面会报错
                  range = that.getPos();
              }*/
            if (!range) {
                body.appendChild(_image);
            } else {
                sel = win.getSelection();
                sel.removeAllRanges();
                range.deleteContents();
                range.insertNode(_image);
                range.setStartAfter(_image);
                range.setEndAfter(_image);
                if (!this.isMobile) {//移动端输入了表情不需要马上又获取焦点
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            //滚动到表情
            setTimeout(function () {
                body.scrollTop = _image.offsetTop;
            }, 100);
        }
        $("#inputPlaceholder").addClass("hide");
    }
    /**
     * 处理paste事件
     * 增加黏贴截图/图片的功能
     */
    this.addPaste = function (win, doc) {
        var hasPasteSend,
            that = this;
        that.filterPaste(win, doc);//todo
        this.hasPasteCapture = hasPasteSend = that.hasFormData;
        if (window.ltIE10 || !hasPasteSend || view.chat.Browser.browser == 'safari') {
            setTimeout(function () {
                $("#inputPlaceholder").attr("placeholder", lanRes.inputPlaceholder2).html(lanRes.inputPlaceholder2);
            }, 500);
        }
        //虽然有的浏览器不支持粘贴发送  但是要处理粘贴事件。  界面展示在view中
        /**
         *  不支持粘贴事件
         *  删除编辑器里面的非表情图片
         */
        function clearPasteImg() {
            setTimeout(function () {
                var imgs = that.getInputDocBody().getElementsByTagName("img");
                for (var i = 0; i < imgs.length; i++) {
                    if (!imgs[i].getAttribute("code")) {
                        if (imgs[i].parentNode) {
                            imgs[i].parentNode.removeChild(imgs[i]);
                        } else {
                            imgs[i].removeNode && imgs[i].removeNode(true);
                        }
                    }
                }
            }, 2);
        }
        if (!hasPasteSend) {
            if (doc.addEventListener) {
                doc.addEventListener("paste", clearPasteImg);
            } else {
                doc.attachEvent("onpaste", clearPasteImg);
            }
            return;
        }

        /* 粘贴事件 */
        function pasteHandler(e) {
            clearPasteImg();
            if (that.companyOff !== true && (!that.busyCanSend || that.queryParams['autoChat'] == '0') && that.chatting !== true) {
                return;
            }
            //只支持Chrome
            if (e.clipboardData && e.clipboardData.items) {
                var items = e.clipboardData.items;
                if (items) {
                    // 便利所有类型，找到图片
                    var len = items.length;
                    for (var i = len - 1; i > -1; i--) {
                        if (items[i].type.indexOf("image") !== -1) {
                            var file = items[i].getAsFile();
                            var fileName = (new Date().getTime()) + '.' + items[i].type.split('/')[1];
                            readImageBase64(file, function (fileObj) {
                                if (fileObj) {
                                    fileObj.fileName = fileName;
                                    previewPasteImage(fileObj);
                                }
                            });
                            break;
                        }
                    }
                }
            } else {
                //如果不支持e.clipboardData.items， firefox ie
                setTimeout(checkInput, 1);
            }
        }

        /** 将图片读取为base64 */
        function readImageBase64(file, cb) {
            if (cb && file && file.type.indexOf('image/') > -1) {
                var reader = new FileReader();
                reader.onload = function (e) {//文件读取完成后开始处理
                    cb({ file: file, base64: e.target.result });
                };
                reader.readAsDataURL(file);//文件转换成base64图片，交给onload处理

            } else {
                cb && cb(null);
            }
        }

        //预览粘贴图片
        function previewPasteImage(file) {
            $("#pasteImg").attr("src", file.base64);
            $("#pastePreview").show();
            $("#maskVerify").show();
        }

        function checkInput() {
            // 把粘贴的图片dom存在变量里面
            var imgs = that.getInputDocBody().getElementsByTagName("img");
            var child;
            for (var i = 0; i < imgs.length; i++) {
                if (!imgs[i].getAttribute("code")) {
                    child = imgs[i];
                    break;
                }
            }
            function pasteFun() {
                //清除里面的webkit-fake-url图片
                var imgs = that.getInputDocBody().getElementsByTagName("img");
                for (var i = 0; i < imgs.length; i++) {
                    if (imgs[i].src.match(/webkit-fake-url:/i)) {
                        imgs[i].parentNode.removeChild(imgs[i]);
                    }
                }
            }

            if (child) {
                var src = child.currentSrc || child.src;
                if (!src.match(/data:image\/[\w]+;base64/i)) {
                    if (src.match(/blob/i)) {
                        //好像没有这种类型，应该会出错  canvers?
                        console.log("blob******************src");

                    } else {
                        if (src.match(/webkit-fake-url:/)) {
                            console.log("safari等浏览器 粘贴图片无法发送");
                            win.removeEventListener("paste", pasteFun);
                            win.addEventListener("paste", pasteFun);
                        } else if (src.match(/^(http[s]?:\/\/[^\/]+|)\/.+/ig)) {
                            //粘贴网络图片，只发送地址
                            that.getInputDocBody().innerHTML += lanRes.picture + ":" + src + "";
                        }
                    }
                } else {
                    //firefox src是base64
                    previewPasteImage({ base64: src });
                }
                if (child.parentNode) {
                    child.parentNode.removeChild(child);
                } else {
                    child.removeNode && child.removeNode(true);
                }
            }
        }

        if (win.addEventListener) {
            win.addEventListener("paste", pasteHandler);
        } else {
            win.attachEvent("onpaste", pasteHandler);
        }

        //发送事件
        $("#pasteOK").on("click", function () {
            view.chat.publish("sendVisitorEvent", {
                et: 123,
                uploadServiceType: that.uploadServiceType,
                ssl: that.needHttps ? 1 : undefined,
                ft: 5//发送base64截图
            }, function (publishAck) {
                if (publishAck.successful) {
                    //发送成功 会收到865
                } else {
                    //发送失败 给个提示，让她
                    $("#pasteError").show();
                    $("#pastePreview").show();
                    $("#maskVerify").show();
                }
            });
            //取后面base64的内容
            that.captureFileSource = $("#pasteImg").attr('src').split("64,")[1];

            $("#pasteError").hide();
            $("#pastePreview").hide();
            $("#maskVerify").hide();
        });
        $("#pasteCancel").on("click", function () {
            $("#pastePreview").hide();
            $("#maskVerify").hide();
        });
    }
    /**
     * 处理paste drop的纯文本、过滤超文本
     * 如果成功获取到文本，则preventDefault阻止自动粘贴
     */
    this.filterPaste = function (win, doc) {
        var that = this;
        var w, or, divTemp, originText;
        var newData;
        var isIE = (navigator.appName.indexOf("Microsoft") != -1) ? true : false;
        var ifrm = document.getElementById("html_input");
        if (!ifrm) {
            return
        };
  
        function getSel(w) {
            return w.getSelection ? w.getSelection() : w.document.selection;
        }

        function setRange(sel, r) {
            sel.removeAllRanges();
            sel.addRange(r);
        }

        function block(e) {
            e.preventDefault();
        }
        function evt(e) {
            if (that.plainText) {
                return;
            }
            var pastedText = undefined;
            try {
                if (win.clipboardData && win.clipboardData.getData) { // IE
                    pastedText = win.clipboardData.getData('Text');
                } else {
                    pastedText = e.clipboardData.getData('Text') || e.clipboardData.getData('text/plain');
                }
                if (pastedText) {
                    console.log('获取到了文本，就去按获取到的文本处理',pastedText)
                    //获取到了文本，就去按获取到的文本处理
                    return that.filterPasteText(e, pastedText,win,doc);
                }
            } catch (err) {
                pastedText = (pastedText && that.filterPasteData(pastedText)) || '';
            }
            //没获取到文本 或者处理过程中出了异常，就使用下面的办法处理
            return pasteClipboardData(e, pastedText);
        }

        if (isIE) {
            ifrm.contentWindow.document.documentElement.attachEvent("onpaste", evt);
            ifrm.contentWindow.document.documentElement.attachEvent("ondrop", that.filterDrop);
        } else {
            ifrm.contentWindow.document.addEventListener("paste", evt, false);
            // ifrm.contentWindow.document.addEventListener("drop", that.filterDrop, false);
            ifrm.contentWindow.document.body.addEventListener("drop", that.filterDrop, false);
        }
        /**
         * 处理IE11以下等 未获取到粘贴文本的情况
         */
        function pasteClipboardData( e, pasteText) {
            var newDataStr = pasteText;//一定是空
            var objEditor = _$('html_input');
            var edDoc = objEditor.contentWindow.document;
            if (isIE) {
                var orRange = edDoc.selection.createRange();
                if (!newDataStr) {
                    var ifmTemp = document.getElementById("ifmTemp");
                    if (!ifmTemp) {
                        ifmTemp = document.createElement("IFRAME");
                        ifmTemp.id = "ifmTemp";
                        ifmTemp.style.width = "1px";
                        ifmTemp.style.height = "1px";
                        ifmTemp.style.position = "absolute";
                        ifmTemp.style.border = "none";
                        ifmTemp.style.left = "-10000px";
                        ifmTemp.src = "iframeblankpage.html";
                        document.body.appendChild(ifmTemp);
                        ifmTemp.contentWindow.document.designMode = "On";
                        ifmTemp.contentWindow.document.open();
                        ifmTemp.contentWindow.document.write("<body></body>");
                        ifmTemp.contentWindow.document.close();
                    } else {
                        ifmTemp.contentWindow.document.body.innerHTML = "";
                    }

                    originText = objEditor.contentWindow.document.body.innerText;

                    ifmTemp.contentWindow.focus();
                    ifmTemp.contentWindow.document.execCommand("Paste", false, null);
                    objEditor.contentWindow.focus();
                    //todo
                    if (typeof ifmTemp.contentWindow.document.body.textContent == "string") {
                        newData = ifmTemp.contentWindow.document.body.textContent;
                    } else {
                        newData = ifmTemp.contentWindow.document.body.innerText;
                    }
                    //filter the pasted data
                    // newData = (newData,true);
                    newData = that.filterPasteData(newData);
                    // ifmTemp.contentWindow.document.body.innerHTML = newData;
                } else {
                    newData = newDataStr
                }
                //paste the data into the editor
                orRange.pasteHTML(newData);
                //block default paste
                if (e) {
                    e.returnValue = false;
                    if (e.preventDefault)
                        e.preventDefault();
                }
                return false;
            } else {
                if (!newDataStr) {
                    //create the temporary html editor
                    var divTemp = edDoc.createElement("DIV");
                    divTemp.id = 'htmleditor_tempdiv';
                    divTemp.innerHTML = '\uFEFF';
                    divTemp.style.left = "-10000px";    //hide the div
                    divTemp.style.height = "1px";
                    divTemp.style.width = "1px";
                    divTemp.style.position = "absolute";
                    divTemp.style.overflow = "hidden";
                    edDoc.body.appendChild(divTemp);
                    //disable keyup,keypress, mousedown and keydown
                    objEditor.contentWindow.document.addEventListener("mousedown", block, false);
                    objEditor.contentWindow.document.addEventListener("keydown", block, false);
                    enableKeyDown = false;
                    //get current selection;
                    w = objEditor.contentWindow;
                    or = getSel(w).getRangeAt(0);

                    //move the cursor to into the div
                    var docBody = divTemp.firstChild;
                    var rng = edDoc.createRange();
                    rng.setStart(docBody, 0);
                    rng.setEnd(docBody, 1);
                    setRange(getSel(w), rng);

                    // newData = divTemp.innerHTML;
                    if (typeof objEditor.contentWindow.document.body.textContent == "string") {
                        originText = objEditor.contentWindow.document.body.textContent;
                    } else {
                        originText = objEditor.contentWindow.document.body.innerText;
                    }
                    // originText = objEditor.contentWindow.document.body.textContent;
                    if (originText === '\uFEFF') {
                        originText = "";
                    }

                    window.setTimeout(function () {
                        //get and filter the data after onpaste is done
                        if (divTemp.innerHTML === '\uFEFF') {
                            newData = "";
                            edDoc.body.removeChild(divTemp);
                            return;
                        }

                        // newData = divTemp.innerHTML;
                        if (typeof divTemp.textContent == "string") {
                            newData = divTemp.textContent;
                        } else {
                            newData = divTemp.innerText;
                        }
                        // Restore the old selection
                        if (or) {
                            setRange(getSel(w), or);
                        }

                        newData = that.filterPasteData(newData);
                        divTemp.innerHTML = newData;
                        //paste the new data to the editor
                        objEditor.contentWindow.document.execCommand('inserthtml', false, newData);
                        edDoc.body.removeChild(divTemp);
                    }, 1);
                    //enable keydown,keyup,keypress, mousedown;
                    enableKeyDown = true;
                    objEditor.contentWindow.document.removeEventListener("mousedown", block, false);
                    objEditor.contentWindow.document.removeEventListener("keydown", block, false);
                    return true;
                } else {
                    objEditor.contentWindow.document.execCommand('inserthtml', false, newDataStr);
                    if (e) {
                        e.returnValue = false;
                        if (e.preventDefault)
                            e.preventDefault();
                    }
                    return false;
                }
            }
        }
    }
    this.filterDrop = function (e) {
        e = e || window.event;
        var text = e.dataTransfer&&e.dataTransfer.getData('text');
        if (!text) {
            e.returnValue = false;
            if (e.preventDefault){
                e.preventDefault();
            }
            e.stopPropagation&&e.stopPropagation();
            return false;
        
        }
        // text = (text, true);
        text = that.filterPasteData(text, undefined, that.plainText);
        if (that.isInrobot) {
            //机器人输入文本长度截断
            text = text.substring(0, that.maxRobotLength);
        }
        var doc = that.getInputDoc(), body = that.getInputDocBody(),
            win = that.win,
            et = that.editorType,
            range = win ? win.pos : null;
        if (et == 3) {
            win = window;
            range = that.preRange;
        } else if (et == 1) {
            range = that.textRange
            return;
        }
        if (doc.selection && !/opera/ig.test(view.chat.Browser.browser)) {//IE10及以下
            that.plainText?this.focus():win.focus();
            if (range) {
                // win.focus();
                setTimeout(function () {
                    range = (et == 3 ? that.preRange : et == 1 ? that.textRange : win.pos) || range;
                    range.pasteHTML(text);
                    range.collapse(true);
                    range.select();//这两句 让IE的光标跑到插入表情的后面。
                }, 1);
            } else {
                e.dataTransfer.setData('text');
                return true;
            }
        } else if (window.getSelection) {
            var sel;
            /*  if (!range) {
             //todo 如果 右侧广告有输入框,会获取不到,下面会报错
             range = that.getPos();
             }*/
            if (!range) {
                body.innerHTML += text;
            } else if (et == 1) {
                _$("textInput").focus();
                document.execCommand("insertText", false, text);
            } else {
                var node = doc.createElement("div");
                node.innerHTML = text;
                sel = win.getSelection();
                sel.removeAllRanges();
                range.deleteContents();
                range.insertNode(node);
                range.setStartAfter(node);
                range.setEndAfter(node);
                if (!that.isMobile) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            //滚动
            node && setTimeout(function () {
                body.scrollTop = node.offsetTop;
            }, 100);
        }
        if (e) {
            e.returnValue = false;
            e.stopPropagation&&e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
        }
        return false;
    }

}
/**
 * Created by lihong on 15-8-4.
 * @require query.js
 * @require cometd.js
 * @require qcometd.js
 * @require util.js
 * @require chatconnect.js
 */
(function ($,document) {
    //节省1200+字符
    window._$ = function (id) {
        return document.getElementById(id);
    };
    window._$s = function (tag) {
        return document.getElementsByTagName(tag);
    };
    window.$ = $;
    window.locationBase = window.locationBase || "";
    //不报异常错误
    window.onerror = function(e){
        console.log("onerror",e.message,JSON.stringify(arguments));//不支持console的低版本浏览器不显示异常
        // return true;
    }
    //留言/信息收集
    //校验方法
    function isArray(obj) {
        return Object.prototype.toString.apply(obj) === "[object Array]"
    }

    function checkIpt(ipt, val, name, cb) {
        var valid = true;
        if (ipt.length >= 2 && ipt[0]) ipt = ipt[0];//性别 radio或者checkbox
        if (!val && (ipt.className.indexOf("req") > 0)) {
            valid = false;
            _$("leave_tip_con").innerHTML = lanRes.inputPlease + (ipt.getAttribute("lb") || "");
        } else if (val && validRule[name] ) {
            //验证正则和长度
            if(validRule[name].length && val.length > validRule[name].length){
                valid = false;
                _$("leave_tip_con").innerHTML = (ipt.getAttribute("lb") || "")+" "+lanRes.overLength;
            }else if (validRule[name].p && !val.match(validRule[name].p)) {
                valid = false;
                _$("leave_tip_con").innerHTML = validRule[name].msg;
            }

        }
        view.chat.tipTimer && clearTimeout(view.chat.tipTimer);
        if (cb) {
            cb && cb(valid);
            if (valid && ipt.style) {
                hideTip()
            } else {
                $("#leave_tip").removeClass("tiphide");
                view.chat.tipTimer = setTimeout(function () {
                    $("#leave_tip").addClass("tiphide");
                }, 3000);
            }
        } else {
            if (valid && ipt.style) {
                ipt.style.borderColor = "#FFFFFF";
                hideTip();
            } else {
                ipt.style.borderColor = "#FF0000";
                $("#leave_tip").removeClass("tiphide");
                view.chat.tipTimer = setTimeout(function () {
                    $("#leave_tip").addClass("tiphide");
                }, 3000);
            }
        }
        return valid;
    }
    function showTip(tip) {
        view.chat.tipTimer && clearTimeout(view.chat.tipTimer);
        _$("leave_tip_con").innerHTML = tip;
        $("#leave_tip").removeClass("tiphide");
        view.chat.tipTimer = setTimeout(function () {
            $("#leave_tip").addClass("tiphide");
        }, 3000);
    }
    function hideTip(){
        view.chat.tipTimer && clearTimeout(view.chat.tipTimer);
        $("#leave_tip").addClass("tiphide");
    }
    /*计算预约表的项是否全部都是占满一行。*/
    function updateInOneline(list) {
        var allInOneLine = true;
        for (var i = 0; i < list.length; i++) {
            allInOneLine = allInOneLine && list[i].configInline == '1';
            if (!allInOneLine) break;
        }
        return allInOneLine ? '1' : '0';
    }

    var Chat = function () {
        //继承
        UTIL.call(this);
        //输入框相关
        InputHandle.call(this);

        this.talkId = "";//604开始对话时赋值
        this.KEY = "chatId";
        ECHATObjKeyMap[this.KEY] = this;

        //先自己调自己，不分开。。
        this.setSub(this.KEY);
        //cometd流转类
        this.setSub("cometdId");
        //native app需要
        this.setSub('viewId');

        //当前页面 将来可能用于消息已读未读
        //this.curPage = "feelEC_chat";
        this.errorList = {};
        /* 常用常量*/
        this.regFace = new RegExp('\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]|[\u0023-\u00ae]|[\u203c-\u3299]', 'g');
        this.regEmo = new RegExp('\\[#[a-z0-9A-Z]+(_[a-z0-9A-Z]+)?#\\]', 'g');
        this.unescapeSend = new RegExp('<\d>', 'g');

        var that = this;
        this.isMobile = this.Device.media == 2;
        this.isIOS = that.Browser.isIOS;
        this.isMini = !that.isMobile && view.windowType == 2;
        //window.isIE6 = this.Browser.browser=='msie'&&this.Browser.version==6;
        //window.ltIE10 = this.Browser.browser=='IE'&&this.Browser.version<9;

        /*初始化时是纯问本输入，不能输入表情*/
        this.plainText = true;
        this.editorType = 1;//输入框类型【1：纯文本textarea,2：富文本iframe,3：富文本pre】【!注：增加pre主要是解决移动设备上的输入焦点问题，特别是ios】
        this.hasStorage = (function () {
            try {
                if (!window.localStorage) {
                    return false;
                } else {
                    window.localStorage.setItem("echt_test_storage", "ok");
                    var ok = window.localStorage.getItem("echt_test_storage");
                    if(!ok){
                        return false;
                    }
                }
            } catch (e) {
                return false;
            }
            return true;
        })();
        //页面自动根据设备跳转时丢失document.referrer的问题
        if (this.hasStorage) {
            this.tempReferrer = this.hasStorage ? window.localStorage.getItem("echat_temp_referrer") : '';
            window.localStorage.setItem("echat_temp_referrer", '');
        }

        if (location.protocol == 'https:') {
            this.needHttps = 'https:';
        }
        /*初始化*/
        !window.SDK && this.initVisitor();
        this.init();
        this.initBridge();/*父窗口和子窗口postmessage通信*/
        this.postMessage('miniReady');
        //保存对话窗口机器人和人工的颜色配置
        this.setChatbox = function(key,data){
            data && $.store('ECHAT_' + view.chat.companyId + "_" + key, JSON.stringify({
                chatStaffBackColor: data.chatStaffBackColor,
                chatStaffTxtColor: data.chatStaffTxtColor,
                chatVisitorBackColor: data.chatVisitorBackColor,
                chatVisitorTxtColor: data.chatVisitorTxtColor,
                sysMsgBackground: data.sysMsgBackground,
                sysMsgFontColor: data.sysMsgFontColor
            }), {path: '/', expires: 365});
        }
        this.getChatbox = function(key){
            var config = $.store('ECHAT_' + view.chat.companyId + "_" + key);
            return config && JSON.parse(config);
        }
        this.addEchatInnerFrameParam = function (url) {
            if(url){
                if(url.indexOf('&echatInnerFrame=1')!=-1||url.indexOf('?echatInnerFrame=1')!=-1){
                    return url;
                }
                var search = url.split("#"),
                    tempHash = search[1] || "",
                    tempURL = search[0],
                    paramNum = tempURL.indexOf("?") == -1 ? 0 : 1;
                return tempURL + (paramNum ? '&' : '?') + "echatInnerFrame=1" + (tempHash ? "#" : '') + tempHash
            }
        }
    }
    Chat.prototype = {
        replaceHtml:function(content) {
            //表情-->FACE  html去掉不?
            if(content){
                content = content.replace(/<img[^>]+code="([^"]+)"[^>]*>/ig, "[face]");//.replace(/<(?:.|\s)*?>/ig, "");
            }
            return content; //? content.replace(/<(?:.|\s)*?>/ig, "") : content;
        },
        initBridge:function () {
            var that = this;
            function CrossMessager(target,domain,callback){
                if(!target || !callback || typeof callback != 'function') return ;

                var wnd = window,
                    targetWnd = target;
                if (wnd.addEventListener) {
                    wnd.addEventListener('message', function (mesg) {
                        callback(mesg,mesg.data);
                    });

                    this.send = function (data) {
                        if (!data || !domain) return;
                        if (view.windowType == 2 && window.top != self) {//PC 手机内页
                            try {
                                targetWnd.postMessage(data, domain || "*");
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    };
                }else{
                    this.send = function () {
                        console.log('不支持 postMessage');
                    }
                }
                return this;
            };
            var replaceHtml = that.replaceHtml;
            var messager = new CrossMessager(parent,
                that.queryParams['fromhost']||(that.tempReferrer||document.referrer||'').split('/').slice(0,3).join('/'),
                function(evt,data){
                    that.publish('getCrossMessage',evt)
                });
            //对话状态(未包含机器人状态)
            this.subscribe("__chatStatus",function (event,data) {
                that.outerChatStatus = data;
                messager.send({
                    act:100,
                    eventAction:'chatStatus',
                    eventLabel:data||''
                });
                //为了SDK保存waiting、chatting,状态
                $.store('ECHAT_chatStatus', data);
            });
            //客服状态(未包含机器人状态)
            this.subscribe("__staffStatus",function (event,data) {
                messager.send({
                    act:100,
                    eventAction:'staffStatus',
                    eventLabel:data||''
                });
            });
            this.subscribe("__chatStart",function (event,data) {
                messager.send({
                    act:200,
                    eventAction:'Served by Agent',
                    eventLabel:data||''
                });
            });
            //排队位置
            this.subscribe("__chatQueue",function (event,data) {
                messager.send({
                    act:100,
                    eventAction:'queuePostion',
                    eventLabel:data||''
                });
            });
            //客服信息
            this.subscribe("__chatStaffInfo",function (event,data) {
                messager.send({
                    act:100,
                    eventAction:'chatStaffInfo',
                    eventLabel:JSON.stringify(data)
                });
            });
            //客服新消息(未包含系统消息)
            this.subscribe("__newMsg",function (event,data) {
                //0 文本 1文件 2图片 3预约确认 4 5...
                var m = data.m;
                if(data.f == 's' && data.c ) {
                    messager.send({
                        act: 100,
                        eventAction: 'newMsg',
                        eventLabel: m == 0 ? replaceHtml(data.c) : m == 1 ? '[file]' : m == 2 ? '[image]' : ''
                    });
                }
            });
            //系统新消息(系统消息)
            this.subscribe("__newSysMsg",function (event,data) {
                //0 文本
                var m = data.m;
                if(data.c ) {
                    messager.send({
                        act: 100,
                        eventAction: 'newSysMsg',
                        eventLabel: m == 0 ? replaceHtml(data.c) : m == 1 ? '[file]' : m == 2 ? '[image]' : ''
                    });
                }
            });
            /* //访客从网页结束对话并关闭窗口
             view.subscribe("__visitorClose",function (event,data) {
             __nativeAPI('visitorClose')
             });*/
            //访客评价完毕
           var  score =  ['',"angry","unsatisfied","ok","satisfied","perfect"]
            this.subscribe("__evaluate",function (event,data) {
                messager.send({
                    act:100,
                    eventAction:'visitorEvaluate',
                    eventLabel:data||''
                });
                var arr = data.split('-');
                if(arr[0]==0){
                    //取消
                    messager.send({
                        act:200,
                        eventAction:'Chat_Evaluate_Cancel',
                        eventLabel:arr[1]==1?'chatting':'end'
                    });
                }else{
                    //提交评价
                    messager.send({
                        act:200,
                        eventAction: 'Chat_Evaluate_' + score[that.evaluateScore - 0],
                        eventLabel: arr[1] == 1 ? 'chatting' : 'end'
                    });
                }
            });
            this.subscribe("__evaluateComment",function (event,data) {
                //提交建议
                messager.send({
                    act:200,
                    eventAction:'Chat_Comment_submit',
                    eventLabel:data.chatting?'chatting':'end'
                });
            });
            //访客从网页隐藏对话
            this.subscribe("__visitorHide",function (event,data) {
                messager.send({
                    act:100,
                    eventAction:'visitorHide',
                    eventLabel:data||''
                });
            });
        },
        initVisitor:function(){
            validRule = {
                email: {
                    p: /^[\w\d_\-\.]+@.+[\.].+/ig,
                    msg: lanRes.invildEmail,
                    length: 50
                },
                phone: {
                    //p: /^1[\d]{10}$/ig,
                    p: /^[0-9\-]{0,20}$/,
                    msg: lanRes.invildPhone,
                    length: 20
                },
                age: {
                    p: /^[1-9][\d]{0,2}$/ig,
                    msg: lanRes.invildAge,
                    length: 3
                },
                qq: {
                    p: /^[1-9][\d]+$/ig,
                    msg: lanRes.invildQQ,
                    length: 50
                },
                date: {
                    p: /^[\d]{4}[-\/][\d]{2}[-\/][\d]{1,2}/ig,
                    msg: lanRes.invildDate,
                    length: 50
                },
                address: {
                    length: 255
                },
                name: {length: 50},
                wechat: {length: 50},
                nickName: {length: 50},
                birthday: {length: 20},
                content:{length:1000}
            }

            $("#inputLengthTip").html(lanRes.inputLengthTip1  +' 30 '+ lanRes.inputLengthTip2);
            //INFO  chatVisitorId由ysc脚本下发
            if(window.chatVisitorId) {
                this.historyKey = "CHAT_HIS_" + window.companyId + "_" + chatVisitorId;
                $.store('ECHAT_' + window.companyId + "_chatVisitorId", chatVisitorId);

            }
            if(window.encryptVID){
                $.store('ECHAT_' + window.companyId + "_encryptVID", encryptVID);
                this.encryptVID = encryptVID;
            }

            this.dataHost = window.dataHost;
        },
        init: function () {

            //界面效果事件。菜单事件绑定、、菜单将来可能要修改、初始化滚动条
            view.initViewEvent(this);
            var that = this;
            //初始化文件传输优先顺序
            that.uploadServiceType = 1;
            //本次对话接待的客服列表
            that.currentStaffMap = {};
            // var r = parseInt(Math.random() * 2);
            // 去掉随机，只使用一个
            that.defaultVisitorImg = locationBase + "/res/imgs/visitor.png";
            //默认客服头像
            that.defaultStaffImg = locationBase + "/res/imgs/staff.png";
            //初始化参数 供对话窗口使用
            this.paramChat = {
                companyId: that.companyId,
                visitorId: that.visitorId,
                firstTitle: that.queryParams['firstTitle'] || '',
                firstUrl: that.queryParams['firstUrl'] || '',//首次落地页面
                referrer: that.queryParams['referrer'] || '',
                chatPage: (that.queryParams['enterUrl'] || that.tempReferrer||document.referrer || ''),
                chatPageTitle: that.queryParams['enterTitle'] || '',
                metaData: that.queryParams['metadata'] || '',//metaData
                myData: that.queryParams['myData'] || '',//myData
                info: that.queryParams['info'] || '',//info
                echatTag: that.queryParams['echattag'] || '',//echatTag
                lan: window.lanName,//语言
                visEvt: that.queryParams['visEvt'] || '',
                eventId:that.queryParams['eventId'] || ''
            };
            this.subscribe("setconfig", function (eventtype, msg) {
                //继续对话可能没有一些配置信息
                var chatbox;
                //eventId 继续对话
                that.eventId = msg.eventId;
                if(msg.robotConfigInfo){
                    that.isInRobot = true;
                    chatbox = that.isMobile ? msg.robotPhoneChatBox : view.windowType == 2 ? msg.robotSmallChatBox : msg.robotPCChatBox;
                }else{
                    if(that.isInRobot){
                        that.isInRobot = 0;
                        if (!msg.chatBoxInfo && !msg.chatSmallBoxInfo && !msg.mobileChatBoxInfo) {
                            msg = that.msg649;//todo 有什么问题? 有过机器人对话 可以设置多次
                        }
                    }
                    // that.isInRobot = false;
                    chatbox = view.SDK ? msg.sdkChatBoxInfo : that.isMobile ? msg.mobileChatBoxInfo : view.windowType == 2 ? msg.chatSmallBoxInfo : msg.chatBoxInfo;
                }
                if(view.hasSetAD){
                    //todo 机器人转人工 继续对话 重置广告设置
                    view.hasSetAD = false;
                    view.canSetAD = 1;//+1 =2;
                }

                if (chatbox) {//todo 多次对话 不会重复发配置
                    //设置页面标题
                    if (chatbox.chatBoxTitle) {
                        view.pageTitle = chatbox.chatBoxTitle;
                        if(view.titles)view.titles[1] = chatbox.chatBoxTitle;
                        that.changeDocTitle(chatbox.chatBoxTitle);
                        view.setDocumentTitle && view.setDocumentTitle('c');
                    }
                    //设置默认头像
                    that.defaultStaffImg = chatbox.defaultStaffImg|| that.defaultStaffImg;
                    that.defaultVisitorImg = chatbox.defaultVisitorImg|| that.defaultVisitorImg;

                    //设置忙碌时是否能回复消息 默认是可以发的
                    that.busyCanSend = chatbox.busyNotAllowSendStatus != '1';
                    $("#busyTip").html((chatbox.busyNotAllowTips||'').replace(/(<p>|<\/p>)/ig,''));
                    $("#busyTipLine").addClass('hide').hide()

                    //todo 设置广告有覆盖性设置  iframe
                    view.setConfig(that, msg,chatbox);
                }
                //排队语
                that.queueTxt = msg.queueTxt || msg.mobileQueueTxt || that.queueTxt;
                //保存留言信息
                that.leaveWordInfo = msg.leaveWordInfo || msg.mobileLeaveWordInfo || that.leaveWordInfo;
            });
            that.subscribe('sendLocationInfo',function(evt,msg){
                that.showLocation(msg);
            })
            that.leaveMsgMap = {};
            that.subscribe("getLeaveMsg", function (evt, msg) {
                if(!msg.realTalkId){
                    msg.realTalkId =msg.newsMsgId;
                    msg.talkId = that.talkId || ( msg.newsMsgId + 'leave');
                }
                var str = '<li class="clearfix '+(msg.unfold||msg.current?'unfold':'')+'" talkid="' + msg.talkId + '" id="msg'+msg.tm+'"><div class="msg-leave" k="'+msg.signature+'"><div class="msg-leave-title"><i class="msg-leave-i"></i><span class="msg-leave-t">'
                    + ((msg.staffNickName?('<span class="color0">' + msg.staffNickName + '&nbsp;</span>'):lanRes.serviceStaff) +(msg.chatInfoType==4? lanRes.staffLeave: lanRes.leaveStaffReply))
                    + '</span></div><div class="msg-leave-con" ><div class="msg-leave-content">' + that.filterEmo(msg.brief) + '</div><div class="msg-leave-dot">...</div><div class="msg-leave-link color0">'+lanRes.viewAll+'</div></div></div></li>';
                var ul = document.createElement("ul");
                ul.innerHTML ='<li class="clearfix" ><div class="color1 tc">' + that.getTimeStr(msg.tm) + '</div></li>'+str;
                var limsg = this.getListMsgEl(msg.talkId,msg.tm,!!msg.current);
                var list = ul.childNodes, node, i = 0;
                while (node = list[i++]) {
                    if (node.nodeType == 1) {
                        node = node.cloneNode(true);
                        limsg.appendChild(node);
                    }
                }
                list = null;
                ul = null;
                setTimeout(view.scrollToBottom, 100);
              /*  var item = {
                    t: data.t || (needStamp ? (time.format("hh:mm")) : undefined),//显示时间
                    tm: data.tm,//时间戳
                    mt: msg && msg.mt || data.mt,
                    f: from || "s",
                    m: mode,//0 文本 1文件 2图片 3预约确认
                    c: msg,
                    notEnd:data.notEnd,
                    id: id//消息元素ID,方便显示状态和滚动
                };*/
                if(msg.current){
                    msg.f = 's';
                    msg.c = msg.brief;
                    msg.unfold = 1;
                    delete  msg.content;
                    delete msg.current;
                    that.pushHistory(msg);
                    (msg.chatInfoType == 3) && $(limsg).addClass('new-leave');//为了展示本地历史记录
                    limsg = null;
                }
                that.leaveMsgMap[msg.signature] = msg;
            });
            that.subscribe("overLength",function () {
                _$("leave_tip_con").innerHTML = lanRes.overLength;
                $("#leave_tip").removeClass("tiphide");
                view.chat.tipTimer = setTimeout(function () {
                    $("#leave_tip").addClass("tiphide");
                }, 3000);
            })
            var baiduHack = view.chat.Browser.isAndroid && navigator.userAgent.indexOf('baiduboxapp') != -1;
            //解决ios上第三方浏览器用tap导致键盘不能收起的问题，在移动设备上如果想焦点变化不能使用tap特别是ios上
            $("#enter_btn").on((that.isIOS && view.windowType == 2)||baiduHack ? 'tap' : 'click', function (e) {
                that.publish("_sendMsg");
              try{
                  if (that.editorType == 3) {
                      window.getSelection().empty();
                  }else if (that.editorType == 2) {
                      that.win.getSelection().empty();
                  }
              }catch (e){

              }
                // e.stopPropagation && e.stopPropagation();
                // e.preventDefault && e.preventDefault();
                // e.cancelBubble = true;
                view.hideMenus();
                // if(!that.isMobile){//为了不收起键盘会不会引起焦点选择 问题
                that.getInputDocBody().blur();
                view.inputBlur&&view.inputBlur(e)
                // return false;
            });
            /**
             *
             * @param e 0/1代表来自APP
             */
            that.visitorCloseFunc = function (e) {
                that.visitorClose = true;
                if(that.chatting===false||EChatQuery.cometd.getStatus() == 'disconnected'){
                    //对话已结束
                    that.publish("__visitorCloseCallback", {type: 'close', memo: '对话已经结束/连接已经断开,可直接销毁'});
                    that.publish("_closeWin");
                }else{
                    function end() {
                        that.visitorClose = true;
                        that.publish("_endChat");
                        if(that.leaveAndClose){//留言平铺关闭
                            that.publish("_endConnect");
                            that.publish("_closeWin");
                        } else if (that.hasEntryOrCode||that.queryParams.autoChat=='0') {//没有断开连接 !that.chatting&&没有信息收集和验证码(对话和留言前)、没有自动接通对话 107不能结束
                            that.publish("entryCallback", {success: true});// 去除信息收集和验证码
                            that.publish("_endConnect");//断开连接
                            that.publish("chatEnded",{});
                            that.publish("__visitorCloseCallback", {type: 'close', memo: '信息收集/验证码,访客确认关闭'});
                            that.publish("_closeWin");//隐藏或关闭窗口
                        }else if(ECHATObjKeyMap["cometdId"].waitForRouterSelect){
                            that.publish("_endConnect");//断开连接
                            that.publish("__visitorCloseCallback", {type: 'close', memo: '咨询入口选择时,访客确认关闭'});
                            that.publish("_closeWin");//隐藏或关闭窗口
                        } else if(that.outerChatStatus&&that.outerChatStatus.match(/waiting|chatting|leaveToService/)) {
                            that.publish("__visitorCloseCallback", {type: 'wait', memo: '等待H5发送结束指令,Native将根据结束状态决定关闭view'});
                        }else{
                            that.publish("__visitorCloseCallback", {type: 'close', memo: '根据状态发现对话没有建立,访客确认关闭'});
                        }
                    }
                    if(e===1){
                        //强制关闭不弹窗
                        return end();
                    }
                    that.showDialog({
                        tip: lanRes.closeTip,
                        ok: end,
                        cancel:function () {
                            that.visitorClose = false;
                            that.publish("__visitorCloseCallback", {type: 'cancel', memo: '访客取消关闭'});
                        }
                    })
                }

            };
            $(".action-close").on("click", that.visitorCloseFunc);
            $("#pre_his").on("click", function () {
                that.loadHistory()
            });
            that.hasPreHis = that.checkHistory();
            //请输入提示
            $("#inputPlaceholder").on("mouseover touchstart",function () {
                $(this).addClass('hide');
            });

            //访客点击结束、或者离开页面时
            this.subscribe("_endChat", function (eventType, message) {
                // that.chatting = true; 等到服务端发送结束再结束状态
                //结束对话
                that.publish("sendVisitorEvent", {
                    et: 107
                }, function () {

                });
                that.postMessage(3);
            });
            $('#changelang').on('change', function (e) {
                var lantype = parseInt(this.value);
                switch (lantype) {
                    case 0:
                        lanResName = 'zhcn';
                        break;
                    case 1:
                        lanResName = 'enus';
                        break;
                    case 2:
                        lanResName = 'jp';
                        break;
                    default:
                        lanResName = 'zhcn';

                }
                var sl = document.createElement('script'),
                    nowSc = _$('langScript'),
                    sp = nowSc.parentNode;
                sl.id = 'langScript';
                sl.src = supportLang[lanResName];
                sp.replaceChild(sl, nowSc);
            });
            /*tap 是针对手机的，ISCROLL滚动中 无法触动自带的CLICK 可以使用自己扩展的TOUCH tap事件*/
            $(document).on(that.isMobile ? "tap" : "click", ".resend", function () {
                var id = $(this).attr("dataid");
                var item = that.errorList[id];
                item.id = id;
                //SDK里面的原始消息 没有这些参数
                item.m = item.m || 0;
                item.f = item.f || 'c';
                item.c = item.c || item.content;
                $("#" + id).remove();
                that.sendToServer(item);
            }).on(that.isMobile ? "tap" : "click", ".btn-restart", function () {
                if($(this).attr("id")=='restartChat') {
                    setTimeout(function () {
                        //微信 QQ 不加延时会卡死
                        that.publish("restartChat");
                    }, 10)
                }
                $(this).removeAttr("id").removeClass("btn-restart").text(lanRes.chatContinued);
            });

            //设置入口信息 选择路由
            this.subscribe('displayRouterInfo', function (eventType, msg) {
                var router = msg.routeEntranceInfo, list = JSON.parse(router.entranceDetails);
                //设置页面标题
                if (router.chatBoxTitle) {
                    //和有新消息替换着显示
                    view.pageTitle = router.chatBoxTitle;
                    that.changeDocTitle(router.chatBoxTitle);
                }
                var statusList = router.routeStatusList,statusMap = {};
                if (statusList && statusList.length) {
                    for (var j = 0; j < statusList.length; j++) {
                        statusMap[statusList[j].routeId] = statusList[j].routeStatus == 2 ? false : true;//离线false
                    }
                }
                var html = '<div id="routerTitle" class="router-title ' + (router.title ? '' : 'router-hide') + '">'
                    + (router.title)
                    + '</div><div id="routerList" class="router-list"><ul class="clearfix">';
                var itemNum = 0, lineNum = router.lines;
                var color = router.chosenColor || '#0da7db';
                for (var i = 0; i < list.length; i++) {
                    var routerId = list[i].routeId;
                    if (!routerId) continue;
                    itemNum++;
                    if (!statusMap[routerId]) {//如果是离线 且有离线配置,则使用离线配置,否则都使用在线配置
                        list[i].icon = list[i].offlineIcon || list[i].icon;
                        list[i].content = list[i].offlineContent || list[i].content;
                    }
                    var noRightBorder = itemNum % lineNum == 0;
                    if (that.needHttps && list[i].icon) {
                        list[i].icon = list[i].icon.replace(/^http:/, that.needHttps);
                    }

                    var type = list[i].icon && !list[i].content ? 1 : list[i].icon && list[i].content ? 2 : !list[i].icon && list[i].content ? 3 : !list[i].icon && !list[i].content ? 3 : '';
                    html += '<li class="router-item router-item-content' + type + '" data="' + routerId + '" dataindex="' + i + '" ' + (noRightBorder ? 'style="border-right:none;"' : '') + '><div class="router-item-content">'
                        + '<div class="router-item-icon ' + (list[i].icon ? '' : 'router-hide') + '">'
                        + (list[i].icon ? '<img src="' + list[i].icon + '"/>' : '')
                        + '</div>'

                        + (view.windowType == 1?//小浮窗使用手机的配置 只有大窗口需要
                            ('<div class="router-item-text ' + (list[i].content ? '' : 'router-hide') + '">'
                        + (list[i].content ? ('<div class="router-item-text-bg" style="background:' + color + ';"' +
                        '></div><div class="router-item-text-tx">' + list[i].content + '</div>') : '')
                        + '</div>')
                            :'')
                        + '</div>'
                        + '<div class="router-item-theme">' + list[i].theme + '</div></li>';
                }
                html += '</ul></div>';
                that.publish("removeLoading");//TODO 先加一个看看有没有问题
                if (itemNum == 0 && !window.SDK) {
                    //没有效配置 直接
                    ECHATObjKeyMap["cometdId"].waitForRouterSelect = false;
                    $("#router").hide();
                } else {
                    $("#loading").hide();
                    $("#mask").show();
                    var w = 150 * lineNum, h;
                    $("#router").html(html).css({
                        "width": view.px2rem ? (view.px2rem(w)) : (w + "px"),
                        marginLeft: view.px2rem ? (view.px2rem(-w / 2 )) : (-w / 2  + "px")
                    }).show();
                    if (!that.isMobile) {
                        $(".router-item").on('mouseover touchstart', function (e) {
                            $(this).addClass("hover");
                            $('.router-item-theme', this).css({'background': color, color: "#FFF"});
                        }).on('mouseout touchend', function (e) {
                            $(this).removeClass("hover");
                            $('.router-item-theme', this).css({'background': '#fff', color: "#323232"});
                        })
                    }
                    $(".router-item").on("click", function (e) {
                        var routeIndex = $(this).attr('dataindex');
                        var id = $(this).attr('data');
                        if (id && list[routeIndex] && list[routeIndex].routeId == id) {
                            that.routeId = id;
                            that.routeEntranceTheme = list[routeIndex].theme;
                            that.paramChat.echatTag = list[routeIndex].routeEntranceEchatTag || that.routeEntranceTheme;// 主题名字不会为空 || that.paramChat.echatTag;
                            //访客选择了咨询主题 发送109注册对话
                            $("#loading").show();
                            that.publish("routerSelect");//通知订阅访客ID频道
                            that.publish("toSetID");
                            $("#router").hide();
                            $("#mask").hide();
                            ECHATObjKeyMap["cometdId"].waitForRouterSelect = false;
                            list = null;
                            router = null;
                        }
                    });
                    var handle = view.handleRouterSelect && view.handleRouterSelect(itemNum, lineNum);
                    if (!handle) {
                        h = $("#router").height() || 200;
                        $("#router").css({
                            marginTop:view.px2rem ? (view.px2rem( -h / 2 )) : ( -h / 2 + 'px')
                        });
                    }
                }
            });
            //客服对访客离线消息的回复
            this.subscribe("getLeaveReply", function (eventtype, data) {
                //有回复内容才显示,不然就是放弃消息
                data.content && that._getMsg(data, 0, data.content);
                //todo 为了 再次发送109  928未读消息里面过来的不需要发109
                if (data.from != 928) {
                    that.publish("toSetID");
                }
            });

            //shezhi he shuaxin 访客登录后会进来
            this.subscribe("setVisitorInfo", function (eventtype, data) {
                that.visitorImg = data.photo ;
                that.visitorId = data.visitorId;
                that.companyId = data.companyId;
                window.encryptVID = data.encryptVID;
                // that.isVip = data.visitorType == 2;
                that.isVip = data.visitorType == 1;//0是游客  1是会员
                if (data.uploadFileSize) {
                    that.uploadFileSize = data.uploadFileSize || (5 * 1024 * 1024);
                    that.uploadFileType = data.uploadFileType;
                }
                /*七牛域名替换*/
                that.qiniuDomain = data.qiniuBucketDomain;
                that.qiniuHttpsDomain = data.qiniuBucketHttpsDomain;
                /*对话记录*/
                that.apiServerDomain = data.apiServerDomain;
                data.fileUploadInfos || (data.fileUploadInfos = [{
                    fileBucketDomain: that.dataHost,
                    fileBucketHttpsDomain: that.dataHost,
                    fileUploadHttpsUrl: that.dataHost + "/fup",
                    fileUploadParam: "token=${token},uploadServiceType=${uploadServiceType}",
                    fileUploadUrl: that.dataHost + "/fup",
                    uploadServiceType:3
                }]);
                that.fileUploadInfosLength = data.fileUploadInfos.length;
                that.fileUploadInfos = (function(){
                    var map = {};
                    for(var i=0;i<data.fileUploadInfos.length;i++){
                        map['uploadServiceType'+data.fileUploadInfos[i].uploadServiceType]=data.fileUploadInfos[i]
                    }
                    return map;
                })();
            });
            this.subscribe("setChatParam", function (eventtype, data) {
                //初始化参数 供对话窗口使用
                that.paramChat.country = data.country || '';
                that.paramChat.province = data.province || '';
                that.paramChat.city = data.city || '';
                that.paramChat.searcher = data.searcher || '';
                that.paramChat.keyword = data.keyword || '';

                that.paramChat.firstUrl = that.paramChat.firstUrl || data.firstUrl;//首次落地页面
                that.paramChat.referrer = that.paramChat.referrer || data.referrer;//来源

                that.paramChat.companyId = that.companyId;// 进来就有了
                that.paramChat.visitorId = that.visitorId;
                view.canSetAD++;
                view.setAD && view.setAD();
            });
            //继续对话签名
            this.subscribe("setRestartTag", function (eventtype, data) {
                that.restartParam = {
                    nonce: data.nonce,
                    reChatTag: data.reChatTag
                }
                //设置TALKID
                if (data.talkId && !that.talkId) {
                    that.talkId = data.talkId;
                }
                $.store('ECHAT_talkId',data.talkId);
                that.hasPreHis = that.checkHistory();
                view.noScrollBottom = false;
            });
            that.isAutoPop = that.queryParams['autoPop']=='1';//只用一次;
            this.subscribe('handshakeOk',function(evt,data){
                that.robotToHumanKey = null;
            });
            //访客端第一次发送的消息：设置身份，发送公司ID、token参数（可选）
            this.subscribe("toSetID", function (eventtype, msg) {
                that.talkId = "";
                that.no103 = false;
                var undefined = undefined;
                that.companyOff = undefined;
                if (window.SDK) {
                    data = {et: 109};
                    if (that.routeId) {
                        data.routeId = that.routeId;
                        data.routeEntranceTheme = that.routeEntranceTheme;
                    }
                    that.robotToHumanKey && (data.robotToHumanKey = that.robotToHumanKey);
                    var old109 = that.data109;
                    if (old109) {
                        //todo visEvt目前没有放到H5
                        //todo 防止机器人转人工丢失数据 看还有什么数据要写。
                        old109.visEvt && (data.visEvt = old109.visEvt);
                        old109.routeId && (data.routeId = old109.routeId);
                        old109.routeEntranceTheme && (data.routeEntranceTheme = old109.routeEntranceTheme);
                    } else {
                        that.data109 = data;
                    }
                    that.publish('__registChatAction', data);
                    return;
                }
                var data;
                data = {
                    et: 109,
                    windowType: view.windowType,
                    companyId: that.companyId,

                    page: that.paramChat.chatPage || undefined,
                    title: that.paramChat.chatPageTitle || undefined,
                    firstEnterUrl: that.paramChat.firstUrl || undefined,//首次落地页面
                    firstEnterTitle: that.paramChat.firstTitle || undefined,
                    referrer: that.paramChat.referrer || undefined,

                    media: that.Device.media,
                    browserName: that.Browser.browser,
                    browserVersion: that.Browser.version,
                    osName: that.Device.OS,
                    screenResolution: window.screen.width + "x" + window.screen.height,
                    // metaData: that.paramChat.metaData || undefined,
                    // myData: that.paramChat.myData || undefined,
                    echatTag: that.paramChat.echatTag || undefined,
                    routerId: (that.queryParams['routerid'] || undefined),//routerId
                    departmentId: (that.queryParams['departmentid'] || undefined),//departmentId
                    routeEntranceId: (that.queryParams['routeentranceid'] || undefined),//routeEntranceId
                    styleId: (that.queryParams['styleid'] || undefined)//styleId
                };
                if(that.robotToHumanKey){
                    data.robotToHumanKey = that.robotToHumanKey;
                }
                //自动弹出只传一次 后面都是访客操作
                if (that.queryParams['autoPop'] == '1' && that.isAutoPop) {
                    data.isAutoPop = 1;
                  //103中删除  delete that.queryParams.autoPop;
                  //   that.isAutoPop = false;
                }
                //接受邀请
                if (that.queryParams['acceptInvite'] == '1') {
                    data.acceptInvite = 1;
                }
                //咨询主题入口
                if (that.routeId) {
                    data.routeId = that.routeId;
                    data.routeEntranceTheme = that.routeEntranceTheme;
                }
                //扫一扫 手机对话
                var visitorId = that.queryParams["visitorid"];//visitorId
                if (visitorId) {
                    data.visitorId = visitorId;
                    data.chatToken = that.queryParams["chattoken"];//"chatToken";
                    data.tm = that.queryParams["tm"];//"tm";
                    //标记是否是来自扫码对话，而不是同一浏览器多窗口对话。
                    that.chatToken = data.chatToken;
                }
                //继续对话签名
                if (that.restartParam) {
                    $.extend(data, that.restartParam);
                }
                if(that.paramChat.visEvt){
                    var evtData = JSON.parse(that.paramChat.visEvt);
                    function replaceHtml(content) {
                        return content ? content.replace(/<(?:.|\s)*?>/ig, "") : content;
                    }
                    data.visEvt = {
                        customizeMsgType: 2,
                        dedup: 1,
                        eventId: evtData.eventId,
                        title: replaceHtml(evtData.title),
                        content: evtData.content,
                        imageUrl: evtData.imageUrl,
                        url: evtData.url,//已经废弃
                        urlForVisitor: evtData.urlForVisitor,
                        urlForStaff: evtData.urlForStaff,
                        memo: replaceHtml(evtData.memo),
                        visibility: evtData.visibility,
                        urlEnableForVisitor: evtData.urlEnableForVisitor,//已经废弃
                        closeURLPage: evtData.closeURLPage
                    }
                    that.initVisEvt = that.paramChat.visEvt;//有可能会被未读消息拦截
                    that.paramChat.visEvt = null;
                    delete that.paramChat.visEvt;
                }
                var old109 = that.data109;
                if (old109) {
                    //todo 防止机器人转人工丢失数据 看还有什么数据要写。
                    old109.visEvt && (data.visEvt = old109.visEvt);
                    old109.routeId && (data.routeId = old109.routeId);
                    old109.routeEntranceTheme && (data.routeEntranceTheme = old109.routeEntranceTheme);
                } else {
                    that.data109 = data;
                }
                that.publish("visitorCommonEvent", data);
                //设置状态防止外部刷新
                that.postMessage(2);
            });
            if (that.queryParams['autoPop'] == '1' || that.queryParams['acceptInvite'] == '1') {
                this.subscribe("_firstSendMsg", function (eventtype, msg) {
                    if(that.queryParams['autoChat'] == '0'){
                        delete that.queryParams.autoChat;
                        that.publish("toRegisterChat",msg);
                        //自动弹出只传一次 后面都是访客操作
                        delete that.queryParams.autoPop;
                        that.isAutoPop = false;
                    }
                    //接受邀请
                    if (that.queryParams['acceptInvite'] == '1') {
                        that.queryParams.acceptInvite = undefined;
                        delete that.queryParams.acceptInvite
                    }
                    this.unSubscribe('_firstSendMsg');
                });
            }
            /**
             * 访客订阅自己频道成功之后发送的消息：注册对话
             */
            this.subscribe("toRegisterChat", function (eventtype, msg) {
                if(that.queryParams.autoChat =='0'){
                    return;
                }
                that.talkId = "";
                if (that.no103) return;
                that.no103 = true;
                if (window.SDK) {
                    data = {et: 103};
                    console.log('__registChatAction',new Date());
                    console.trace()
                    that.publish('__registChatAction', {et: 103});

                    return;
                }
                var undefined = undefined;
                var data = {
                    et: 103,
                    //companyId: that.companyId,
                    windowType: view.windowType,

                    page: that.paramChat.chatPage || undefined,
                    title: that.paramChat.chatPageTitle || undefined,
                    firstEnterUrl: that.paramChat.firstUrl || undefined,//首次落地页面
                    firstEnterTitle: that.paramChat.firstTitle || undefined,
                    referrer: that.paramChat.referrer || undefined,

                    media: that.Device.media,
                    browserName: that.Browser.browser,
                    browserVersion: that.Browser.version,
                    osName: that.Device.OS,
                    screenResolution: window.screen.width + "x" + window.screen.height,
                    // metaData: that.paramChat.metaData || undefined,
                    // myData: that.paramChat.myData || undefined,
                    echatTag: that.paramChat.echatTag || undefined
                }
                if (msg && msg.code) {//todo 验证码??
                    data.captcha = msg.code;
                }
                if (that.eventId) {
                    data.eventId = that.eventId;
                }
                //接受邀请
                if (that.queryParams['acceptInvite'] == '1') {
                    data.acceptInvite = 1;
                }
                //咨询主题入口
                if (that.routeId) {
                    data.routeId = that.routeId;
                    data.routeEntranceTheme = that.routeEntranceTheme;
                }
                if(that.queryParams['autoPop']=='1'){
                    data.isAutoPop = 1;
                    // that.isAutoPop = false;
                    msg && msg.c &&(data.visitorWords = msg.c);
                    /*delete that.queryParams.autoPop;首次发送消息后删除
                    delete that.queryParams.autoChat;*/
                }
                that.publish("visitorCommonEvent", data,function (ack) {
                    //注册对话完了之后发送来自对话地址的图文消息
                    if(ack.successful===true){
                        that.publish("_pushVisitorEvent");
                    }
                });
            });
            this.subscribe("removeLoading", function (eventtype, msg) {
                if(that.wait874List){
                    return;
                }
                $("#loading").hide();
                window.resizeFunc && window.resizeFunc();
                //关掉之后不再删除
                if(!that.hasEntryOrCode){
                    //离线消息 会发了离线系统消息,会导致去掉遮罩
                    $("#mask").hide();
                    $("#verify").hide();
                }
                //关闭按钮 留言、机器人、不自动接通对话、也可以结束对话
                $(".btn-close").removeClass("hide");
                // $("#maskVerify").hide();
                msg && that.initQcode();
            });
            this.initQcode = function(){
                if ((that.companyOff !== true && !that.hasLeaveMsg) || that.isInRobot) {

                    if (!that.isMobile) {
                        //访客对话 请求中。收到了系统消息或客服消息，这时PC可以显示二维码了
                        if (!that.showQcode) {
                            that.showQcode = that.toShowQcode();
                        } else {
                            $(".btn-qcode").removeClass("hide");
                            _$("qcode_img").setAttribute("loaded", "");
                            _$("qcode_img").removeAttribute("loaded");
                        }
                    }
                }
            }
            /**
             * 进入留言
             */
            this.subscribe("toLeavePage", function (eventtype, msg) {
                that.companyOff = true;
                var hasEntryOrCode = false;
                //离线配置
                var leave = msg.offlineBoxInfo || msg.offlineSmallBoxInfo || msg.mobileOfflineBoxInfo|| msg.sdkOfflineBoxInfo;
                if (!leave && that.msg649) {
                    leave =  that.msg649.offlineBoxInfo ||that.msg649.offlineSmallBoxInfo || that.msg649.mobileOfflineBoxInfo|| that.msg649.sdkOfflineBoxInfo;;
                }
                if (that.leaveAndClose) {
                    hasEntryOrCode =  false;//避免出错
                    //留言平铺
                    var timeStamp = new Date().getTime();
                    var id = "msg" + timeStamp;
                    var needTime = that.checkHistoryTime(timeStamp);
                    var item = {
                        t: needTime ? (new Date()).format("hh:mm") : undefined,
                        tm: timeStamp,//时间戳
                        mt: 864,
                        f: "c",//访客消息
                        m: 0,//消息模型 0文本
                        hide: true,
                        c: that.entryVisitorMsg,
                        id: id//消息元素ID,方便显示状态和滚动
                    };
                    if(that.entryVisitorMsg) {//发送信息收集的文本消息
                        that.sendToServer(item);
                    }
                    //发送留言内容的文本消息
                    var itemContent = $.extend({}, item);
                    itemContent.c = $(".leave-entry-text").val();
                    that.sendToServer(itemContent, undefined, function () {
                        //发送成功后关闭
                        that.publish("_endConnect");//断开连接
                        that.visitorClose = true;
                        showTip(lanRes.leavelSuc.alt);
                        setTimeout(function(){
                            that.publish("_closeWin");//隐藏或关闭窗口
                            that.leaveAndClose = false;//重置
                        },2000)
                    });
                    that.entryVisitorMsg = null;
                }
                else if (leave && leave.enable == 1) {
                    hasEntryOrCode = that.showEntryAndCode(msg, false);
                    if (!hasEntryOrCode) {
                        //信息收集回来了之后 根据603再设置状态
                        that.publish('__chatStatus', 'leaveToService');
                    }
                    //留在这里 直接发送消息
                    // 内页
                    $("#staffName").html('<span>' + lanRes.leaveWord + '</span>');
                    //隐藏查看客服信息
                    view.hideStaffInfo && view.hideStaffInfo();

                    if (that.entryVisitorMsg) {
                        var timeStamp = new Date().getTime();
                        var id = "msg" + timeStamp;
                        var needTime = that.checkHistoryTime(timeStamp);
                        var item = {
                            t: needTime ? (new Date()).format("hh:mm") : undefined,
                            tm: timeStamp,//时间戳
                            mt: 864,
                            f: "c",//访客消息
                            m: 0,//消息模型 0文本
                            hide:true,
                            c: that.entryVisitorMsg,
                            id: id//消息元素ID,方便显示状态和滚动
                        };
                        that.sendToServer(item);
                        that.entryVisitorMsg = null;
                    }
                    if(view.showURLList){
                        $(".menu-more").hide();
                        view.hideMenus();
                    }

                } else if (leave && leave.enable == 2&&leave.thirdPartyUrl) {
                    that.publish('__chatStatus','leaveToUrl');
                    that.publish('__leaveToUrl',leave.thirdPartyUrl);
                    //第三方URL
                    //1.组装参数
                    if (leave.thirdPartyUrl && leave.enableThirdPartyParams == 1 && leave.thirdPartyParams) {
                        leave.thirdPartyUrl = (function (url, json, paramChat) {
                            var paramStr = '',
                                search = url.split("#"),
                                tempHash = search[1] || "",
                                tempURL = search[0],
                                paramNum = tempURL.indexOf("?") == -1 ? 0 : 1;
                            var len = json.length;
                            for (var i = 0; i < len; i++) {
                                var pName = json[i].paramName;
                                //大小写 中途有改过,都认可  有metaData需要同时加上myData
                                if (pName == 'metaData' || pName == 'metadata') {
                                    pName = 'metaData';
                                    if (paramChat[pName]) {
                                        paramStr += (paramNum != 0 ? '&' : '?') + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                                        paramNum++;
                                    }
                                    pName = 'myData';
                                    if (paramChat[pName]) {
                                        paramStr += (paramNum != 0 ? '&' : '?') + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                                        paramNum++;
                                    }
                                    //todo info是独立的 应该不需要
                                    pName = 'info';
                                    if (paramChat[pName]) {
                                        paramStr += (paramNum != 0 ? '&' : '?') + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                                        paramNum++;
                                    }
                                } else if (paramChat[pName]) {
                                    paramStr += (paramNum != 0 ? '&' : '?') + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                                    paramNum++;
                                }
                            }
                            return tempURL + paramStr + (tempHash ? ('#' + tempHash) : '');
                        })(leave.thirdPartyUrl, leave.thirdPartyParams, that.paramChat);
                    }
                    // if (leave.thirdPartyUrl) {
                        location.href = leave.thirdPartyUrl;
                        //直接return 加载地址需要时间 不能走到后面取出遮罩
                        return;
                    // }
                } else if (!leave || leave.enable == 0 || (leave && leave.enable == 2 && !leave.thirdPartyUrl)) {
                    //没有第三方URL 按留言不可用处理
                    that.publish('__chatStatus','leaveDisabled');
                    $("#inputPlaceholder").html(lanRes.disablePlaceholder);
                    $("#footer").addClass('leave-disabled');
                    var div = document.createElement('div');
                    div.className ='mask-disabled'
                    $("#footer").append(div)
                    // $("#chat").addClass('hide');
                    // $("#footer").addClass("hide");
                    $(document).off();
                    // $("#leave_disable").show();
                    // $("#leave_disable_icon").attr("src", window.isIE6 ? __uri("/visitor/pc/css/img/leaveDis8.png") :__uri("/visitor/pc/css/img/leaveDis.png"));
                    // $("#leave").addClass("inTip");
                    // $("#leave").removeClass("hide");
                    //判断是否有LOADING 有LOADING就删除。
                    that.publish("removeLoading");
                    view.handleLeave && view.handleLeave('leaveDisabled');
                    //留言不可用时,回复消息移动到
                    // view.removeUnreadToLeave();
                    //离线不再订阅频道 需要关闭窗口 保留频道
                    // that.unSubscribeAll();
                    //断开链接
                    setTimeout(function(){
                        that.publish("_endConnect");//断开连接
                        //这里么有机会再继续连接,所以可以置为true 方便URL列表展示
                        that.companyOff = true;
                    },200)
                    //隐藏查看客服信息
                    view.hideStaffInfo && view.hideStaffInfo();
                    // 隐藏URL列表
                    if(view.showURLList){
                        $(".menu-more").hide();
                        view.hideMenus();
                    }
                }
                $(".btn-qcode").addClass("hide");
                //判断是否有LOADING 有LOADING就删除。
                that.publish("removeLoading");

                //验证码需要遮罩
                if(hasEntryOrCode){
                    $("#mask").show();
                }
                //内页上方头像
                view.hideServiceIcon && view.hideServiceIcon();
                that.postMessage('toLeaveMessage');
            });
            /**
             * 初始化或验证码失败时再显示验证码
             */
            this.subscribe("refreshVerify", function (eventtype, msg) {
                //view.showVerifyCode&&view.showVerifyCode(msg.captChaToken);
                $("#verify_change").removeClass("loadin");
                if (msg.status == 0) {//访客手动刷新验证码

                } else if (msg.status == 1) {//提交错误验证码
                    $("#verify_input").addClass("error");
                }
                that.no103 = false;
                $("#verify_img").attr("src", that.dataHost+"/chatCaptCha.jpg?captChatToken=" + msg.captChaToken);
            });

            this.bookformi = 0;
            this.getBookComfirm = function (lists) {
                if (!lists || !lists[0]) {
                    return lists || "";
                }
                var configData;
                if ((view.windowType == 1 && lists[0].type == 1) || (view.windowType != 1 && lists[0].type == 3)) {//pc 预约确认表  手机预约确认表
                    configData = lists[0];
                } else configData = lists[1];
                if (!configData || !configData.configuration) {
                    return "";
                }
                var rId = this.bookformi++;
                var list = configData.configuration, len = list.length;
                var allInOneLine = updateInOneline(list);
                if (that.needHttps && configData.backImg) {
                    configData.backImg = configData.backImg.replace(/^http:/, that.needHttps);
                }
                var html = ' <div id="inviteBook' + rId + '" class="book-table ' + (configData.type == 3 ? "book-table-sm" : "book-table-bg") + (allInOneLine == '1' ? ' book-all-line' : '') + '" >'//400 / 260
                    + (configData.backImg ? ('<div><img id="inviteBookImg' + rId + '" class="book-table-img hide" src="' + configData.backImg + '" onload="imgLoadResize(this,' + rId + ')" /></div>') : '')
                    + '<form id="inviteBookForm' + rId + '" class="book-items" onsubmit="return false;">'//380 10 / 220 20
                    + ' <div class="clearfix book-items-list" style="' + configData.formPos + ';">';
                for (var i = 0; i < len; i++) {
                    var item = list[i], cls = item.configRequired == 1 ? "req" : "";
                    html += '<div class="book-half book-item ' + (item.configInline == '1' ? 'book-one-line' : '') + '">'
                        + '<label class="book-label" style="color:' + configData.labelColor + '">' + item.configDesc + '</label>'
                        + (item.configName == "gender" ? (
                            '<input type="text" lb="' + item.configDesc + '" class="book-ipt ' + cls + '" name="' + item.configName
                            + '" style="border-bottom-color:' + configData.inputColor + ';color:' + configData.inputColor
                            + ';"  value="' + (item.configValue == 2 ? lanRes.female : item.configValue == 1 ? lanRes.male : "") + '" readonly="readonly" />'

                            //'&nbsp;&nbsp;<input type="radio" class="book-radio ' + cls + '" ' + (item.configValue == 1 ? 'checked="checked"' : '') + ' name="gender" value="1" lb="' + item.configDesc + '" readonly="readonly" /><span  style="color:' + configData.inputColor + ';">男</span> '
                            //+ '<input type="radio" class="book-radio ' + cls + '" ' + (item.configValue == 2 ? 'checked="checked"' : '') + ' name="gender" value="2" readonly="readonly" /><span  style="color:' + configData.inputColor + ';">女</span>'
                        ) : item.configName == "maritalStatus" ? (
                            '<input type="text" lb="' + item.configDesc + '" class="book-ipt ' + cls + '" name="' + item.configName
                            + '" style="border-bottom-color:' + configData.inputColor + ';color:' + configData.inputColor
                            + ';"  value="' + (item.configValue == 2 ? lanRes.married : item.configValue == 1 ? lanRes.unmarried : "") + '" readonly="readonly" />'

                            //'&nbsp;&nbsp;<input type="radio" class="book-radio ' + cls + '" ' + (item.configValue == 1 ? 'checked="checked"' : '') + ' name="maritalStatus" value="1" lb="' + item.configDesc + '" readonly="readonly" /><span  style="color:' + configData.inputColor + ';">未婚</span>' +
                            //'<input type="radio" class="book-radio ' + cls + '" ' + (item.configValue == 2 ? 'checked="checked"' : '') + ' name="maritalStatus" value="2" readonly="readonly" /><span  style="color:' + configData.inputColor + ';">已婚</span>'
                        ) : (
                            '<input type="text" lb="' + item.configDesc + '" class="book-ipt ' + cls + '" name="' + item.configName
                            + '" style="border-bottom-color:' + configData.inputColor + ';color:' + configData.inputColor
                            + ';"  value="' + (item.configValue || "") + '" readonly="readonly" />'
                        ))
                        + '</div>';
                }
                html += '</div></form></div>';

                setTimeout(function () {
                    //if (configData.backImg) {
                    //} else {
                    var book = _$("inviteBookForm" + rId);
                    if (!book) {
                        return;
                    }
                    //设置最小高度
                    var h = book.offsetHeight + ( view.px2px ? view.px2px(20) : 20) + book.offsetTop;
                    _$("inviteBookLi" + rId).style.minHeight = h + 'px';
                    //}
                }, 1000);
                return '<li id="inviteBookLi' + rId + '" class="clearfix book-confirm-wrap">' + html + '</li>';
            }

            /**
             * 显示验证码和信息收集
             * @param msg
             */
            this.showEntryAndCode = function (msg, online) {
                var hasEntryOrCode = false;
                var entrance = msg.entranceInfo || msg.smallEntranceInfo || msg.mobileEntranceInfo || msg.sdkEntranceInfo;
                var enableEntrance = entrance && entrance.visitorInfoEnable == 1 && (online ? entrance.enableOnline == 1 : entrance.enableOffline == 1);
              /*  if (entrance) {
                    //第一次进来 记录留言平铺配置
                    that.leaveAndCloseConfig = entrance && entrance.visitorInfoEnable == 1 && entrance.enableOffline == 1 && entrance.offlineStartType == 1;
                    that.leaveAndCloseConfig = that.leaveAndCloseConfig ? entrance : false;
                }*/
                if (that.leaveAndCloseConfig && that.companyOff === true) {
                    entrance = that.leaveAndCloseConfig;
                    enableEntrance = true;
                }
                //留言-表单模式 只要配置了显示信息收集，就一定要显示留言表单（默认有一个留言内容）不管有没有配置项
                var entryList = entrance ? (that.companyOff === true ? [1] : entrance.visitorInfoConfiguration) : [];
                if (enableEntrance && entryList && entryList.length > 0 && that.toShowEntry(entrance, msg)) {
                    // $("#verify").remove();
                    $("#verify").hide();
                    // that.toShowEntry(entrance, msg); 可能vip或者游客选项过滤出来 没有课显示的项目
                    hasEntryOrCode = true;
                } else if (msg.captChaToken) {
                    $("#entry").html("");
                    //防止单独验证码和信息收集的验证码干扰
                    $(".verify-change").attr('id','verify_change');
                    $(".verify-img").attr('id','verify_img');
                    $(".verify-ok").attr('id','verify_ok');
                    $(".verify-input").attr('id','verify_input');
                    //显示验证码
                    that.publish("removeLoading");
                    that.toShowCode();
                    $("#verify_img").attr("src", that.dataHost + "/chatCaptCha.jpg?captChatToken=" + msg.captChaToken);
                    $("#verify").show();
                    $("#mask").show();
                    hasEntryOrCode = true;
                } else if (enableEntrance) {
                    //没有输入项 直接提交空
                    that.publish("entryCallback", {success: true, mt: 670});
                    hasEntryOrCode = false;
                }
                that.hasEntryOrCode = hasEntryOrCode;
                return hasEntryOrCode;
            }

            this.subscribe('initRobot', function (evt, msg) {
                that.isInRobot = true;
                that.publish('__chatStatus', 'robot');
                //显示菜单、图标
                that.staffImg = msg.robotConfigInfo.robotImg;
                that.staffName = (msg.robotExtInfo && msg.robotExtInfo.nickName) ||lanRes.robot;

                that.paramChat.staffId = '-1';
                that.paramChat.staffName = that.staffName;
                that.paramChat.staffPhoto = that.staffImg;

                view.initRobotInfo&&view.initRobotInfo(msg);
                that.bindPlainTextEvent();
                //机器人内部广告
                view.setInnerAD(msg);
                that.robotWordsInfo = msg.robotWordsInfo;
                //显示人工
                $("#toHumanWords").html( msg.robotWordsInfo.toHumanWords || '')
                //按钮提示文字
                $("#textInput").attr('placeholder',msg.robotWordsInfo.inputBoxWords||lanRes.inputPlaceholder2);

                //web vip非vip配置
                var switchConfig = that.isVip?msg.webVipVisitorRobotConfig:msg.webVisitorRobotConfig;
                $("#robotToStaff").hide();
                if (switchConfig.enableManualSwitch == '1') {//开启显示手动转人工按钮
                    if(that.companyOff===true){
                      if(switchConfig.enableLeaveBtnWhenStaffOffline=='1'){
                          $("#robotToStaffWord").html(lanRes.leaveWord);
                          //离线显示转留言
                          $("#robotToStaff").show();
                      }
                    }else if(switchConfig.enableSwitchBtnWhenStaffOnline=='1'){
                        $("#robotToStaffWord").html(lanRes.robotToStaff);
                        //在线显示转人工服务
                        $("#robotToStaff").show();
                    }
                }else{
                    //TODO 不开启删掉 应该没问题吧 注意将来有没有还会需要的逻辑
                    $("#robotToStaff").remove();
                }
                //反馈配置
                if (msg.robotWordsInfo.enableFedBack == '1') {
                    var robot = msg.robotWordsInfo;
                    typeof robot.solvedSubitem == 'string' ? (robot.solvedSubitem = JSON.parse(robot.solvedSubitem)) : false;
                    typeof robot.unsolvedSubitem == 'string' ? (robot.unsolvedSubitem = JSON.parse(robot.unsolvedSubitem)) : false;
                    if (robot.solvedSubitem || robot.unsolvedSubitem) {
                        if (view.dji && (!robot.unsolvedWords && !robot.solvedWords)) {//dji只显示文字按钮
                            that.robotFeedback = false;
                        } else {
                            that.robotFeedback = function (op) {
                                op = op || {};
                                var answerItem = op.answerItem;

                                var subFeed = '';
                                var html = '<div class="feedback-tip">'
                                    + (robot.fedBackWords || "")
                                    + '</div><div class="feedback-tag"><i class="feed-icon-sel"></i><span>' + lanRes.hasSelected
                                    + '</span></div><div class="feedback-btns clearfix"><div class="feedback-btn-solve ' + (op.feedback == 1 ? 'feedback-btn-solve-sel' : '') + (view.dji &&!robot.solvedWords ? ' hide' : '')  + '" type="1">'
                                    + (robot.solvedButton ? ('<img src="' + robot.solvedButton + '"/>') : '')
                                    + '<span>'
                                    + (robot.solvedWords || "")
                                    + '</span></div><div class="feedback-btn-unsolve ' + (op.feedback == 2 ? 'feedback-btn-unsolve-sel' : '') + (view.dji &&!robot.unsolvedWords ? ' hide' : '') + '" type="2">'
                                    + (robot.unsolvedButton ? ('<img src="' + robot.unsolvedButton + '"/>') : '')
                                    + '<span>'
                                    + (robot.unsolvedWords || "")
                                    + '</span></div></div>';
                                if (answerItem) {//当次机器人对话还可以评价
                                    //todo 反馈历史的处理 typeof op.feedback == 'undefined'
                                    if (op.feedback != 2 && robot.solvedSubitem && robot.solvedSubitem.length > 0) {
                                        // typeof robot.solvedSubitem == 'string' ? (robot.solvedSubitem = JSON.parse(robot.solvedSubitem)) : false;
                                        subFeed += '<div class="feedback-sub-solved"><div class="robot-tip">' + lanRes.solvedReason + '</div><ul class="feedback-sub-list ' + (op.feedbackSubitem ? 'robot-feedback-sub-had' : '') + '"' +
                                            ' did="' + answerItem.docId + '" qid="' + answerItem.queryId + '" rid="' + answerItem.robotDetailId + '" searchId="' + answerItem.searchId + '" originQuestion="' + escape(answerItem.originQuestion) + '">';
                                        for (var i = 0; i < robot.solvedSubitem.length; i++) {
                                            subFeed += '<li class="feedback-sub-li sub-solved-li ' + (op.feedbackSubitem == robot.solvedSubitem[i].content ? 'feedback-sub-sel1' : '')
                                            +'"><span class="list-style-dot">' + (i + 1) + '.</span><span class="feedback-sub-content" type="1">' + robot.solvedSubitem[i].content + '</span></li>'
                                        }
                                        subFeed += '</ul></div>';
                                    }
                                    if (op.feedback != 1 && robot.unsolvedSubitem && robot.unsolvedSubitem.length > 0) {
                                        // typeof robot.unsolvedSubitem == 'string' ? (robot.unsolvedSubitem = JSON.parse(robot.unsolvedSubitem)) : false;
                                        subFeed += '<div class="feedback-sub-unsolved"><div class="robot-tip">' + lanRes.unsolvedReason + '</div><ul class="feedback-sub-list ' + (op.feedbackSubitem ? 'robot-feedback-sub-had' : '') + '"' +
                                            ' did="' + answerItem.docId + '" qid="' + answerItem.queryId + '" rid="' + answerItem.robotDetailId + '" searchId="' + answerItem.searchId + '" originQuestion="' + escape(answerItem.originQuestion) + '">';
                                        for (var i = 0; i < robot.unsolvedSubitem.length; i++) {
                                            subFeed += '<li class="feedback-sub-li sub-unsolved-li ' + (op.feedbackSubitem == robot.unsolvedSubitem[i].content ? 'feedback-sub-sel2' : '')
                                            +'"><span class="list-style-dot">' + (i + 1) + '.</span><span class="feedback-sub-content" type="2">' + robot.unsolvedSubitem[i].content + '</span></li>'
                                        }
                                        subFeed += '</ul>';
                                    }
                                }
                                return html + subFeed + '</div></div>';
                            }
                        }
                    }else {
                        that.robotFeedback = function (op) {
                            op = op || {};
                            var html = '<div class="feedback-tip">'
                                + (robot.fedBackWords || "")
                                + '</div><div class="feedback-tag"><i class="feed-icon-sel"></i><span>' + lanRes.hasSelected
                                + '</span></div><div class="feedback-btns clearfix"><div class="feedback-btn-solve ' + (op.feedback == 1 ? 'feedback-btn-solve-sel' : '') + '" type="1">'
                                + (robot.solvedButton ? ('<img src="' + robot.solvedButton + '"/>') : '')
                                + '<span>'
                                + (robot.solvedWords || "")
                                + '</psan></div><div class="feedback-btn-unsolve ' + (op.feedback == 2 ? 'feedback-btn-unsolve-sel' : '') + '" type="2">'
                                + (robot.unsolvedButton ? ('<img src="' + robot.unsolvedButton + '"/>') : '')
                                + '<span>'
                                + (robot.unsolvedWords || "")
                                + '</span></div></div></div></div>';
                            return html;
                        }
                    }
                    /* 机器人*/
                    var btn = that.getCSSRule(".feedback-btn-solve");
                    btn && robot.solvedBackColor && (btn.style.backgroundColor = robot.solvedBackColor);
                    btn = that.getCSSRule(".sub-solved-li");
                    btn && robot.solvedBackColor && (btn.style.backgroundColor = robot.solvedBackColor);

                    btn = that.getCSSRule(".feedback-btn-solve-sel");
                    btn && robot.solvedSelectColor && (btn.style.backgroundColor = robot.solvedSelectColor);
                    btn = that.getCSSRule(".feedback-sub-sel1");
                    btn && robot.solvedSelectColor && (btn.style.backgroundColor = robot.solvedSelectColor);

                    btn = that.getCSSRule(".feedback-btn-unsolve");
                    btn && robot.unsolvedBackColor && (btn.style.backgroundColor = robot.unsolvedBackColor);
                    btn = that.getCSSRule(".sub-unsolved-li");
                    btn && robot.unsolvedBackColor && (btn.style.backgroundColor = robot.unsolvedBackColor);

                    btn = that.getCSSRule(".feedback-btn-unsolve-sel");
                    btn && robot.unsolvedSelectColor && (btn.style.backgroundColor = robot.unsolvedSelectColor);
                    btn = that.getCSSRule(".feedback-sub-sel2");
                    btn && robot.unsolvedSelectColor && (btn.style.backgroundColor = robot.unsolvedSelectColor);

                } else {
                    that.robotFeedback = false;
                }
                //常见问题
                var commonQue = msg.robotWordsInfo.commonQuestions;
                
                that.subscribe('_showCommonQue', function (evt, sysMsg) {
                    that.unSubscribe('_showCommonQue');
                    var commHtml = sysMsg.content;
                    //自己的机器人才有常见问题,第三方机器人没有
                    if (msg.robotConfigInfo.categoryType == 1 && commonQue && msg.robotWordsInfo.enableCommonQuestions == '1') {//显示常见问题
                        commonQue = JSON.parse(commonQue);
                        if (commonQue.length) {
                            if (that.msg649.robotWordsInfo.commonQuesWords) {
                                commHtml += '<div class="common-ques-tip">' + that.msg649.robotWordsInfo.commonQuesWords + '</div><ul class="common-ques-list">';
                            } else {
                                commHtml += '<ul class="common-ques-list">';
                            }
                            for (var i = 0; i < commonQue.length; i++) {
                                commHtml += '<li class="common-ques-li" did="' + commonQue[i].id
                                    + '" ques="' + escape(commonQue[i].question) + '"><span class="list-style-dot">' + (i + 1) + '.</span><span class="link-robot-ques">' + commonQue[i].question + '</span></li>';

                            }
                        }
                    }
                    that.talkId = sysMsg.talkId;
                    that.paramChat.talkId = that.talkId;
                    that.robotTalkId = sysMsg.talkId;
                    that._getMsg.call(this,
                        {
                            tm: sysMsg.tm,
                            mt: 12001,
                            ff: 'r',
                            staffImg: that.staffImg,
                            staffName: that.staffName,
                            content: commHtml
                        },
                        0, commHtml, 'r');
                    //拿到客服信息 左右对话开始后刷新广告的出发点
                    view.startChatRefreshAD && view.startChatRefreshAD();
                    commonQue = null;
                    // delete that.robotCommonQue;
                });

                //相关问题
                that.unSubscribe('_sendQuestion');
                that.subscribe('_sendQuestion', function (evt, msg) {
                    // 直接发送
                    that.publish("sendVisitorEvent", {
                        et: 130,
                        docId: msg.docId,
                        originDocId: msg.originDocId,
                        content: msg.content
                    });
                    that._getMsg({mt: 130, ff:'r',tm: new Date().getTime()}, 0, msg.content, 'c');
                    $("#input_suggest").addClass('hide').html(' ');
                });

                //todo onchange优化 正在输入联想
                that.lastText = null;//上次发送的正在输入
                that.typingTimer && clearTimeout(that.typingTimer);
                var lastInput;
                if (that.hasInputAssociation) {//输入联想权限
                    function inputing() {
                        var msg = that.getInput(false);
                        if (!msg) {
                            $('#input_suggest').addClass('hide').html(' ');
                        }
                        if (msg && ((that.lastText != msg) || lastInput != msg)) {
                            that.lastText = msg;
                            that.publish("sendVisitorEvent", {
                                et: 132,
                                content: that.lastText
                            });
                        }
                        that.typingTimer = setTimeout(inputing, 1500);
                        lastInput = msg;//主要是处理 清空了又恢复输入
                    }

                    that.typingTimer = setTimeout(inputing, 1500);
                }
                //访客可以发送消息
                that.openVisitorSend();

                //菜单隐藏和显示
                $("#toolbar").addClass('robot');
                $("body").addClass('robot');
                that.publish('startRobot');
            });

            //限制30个汉字长度
            function getByteLen(val, max) {
                var len = 0,max = max*2;
                for (var i = 0; i < val.length; i++) {
                    var a = val.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {
                        len += 2;
                    }
                    else {
                        len += 1;
                    }
                    if(len>max){
                        that.setInput(val.substr(0, len));
                        $("#inputLengthTip").html(lanRes.inputLengthTip1  +' 0 '+ lanRes.inputLengthTip2);
                        //todo 设置光标
                        return;
                    }
                    var last = (max / 2) - (parseInt(len / 2) + (len % 2));
                    // $("#inputLengthTip").html(parseInt(len / 2) +(len % 2) + "/" + (max / 2));
                    $("#inputLengthTip").html(lanRes.inputLengthTip1 +' '+ last +' '+ lanRes.inputLengthTip2);
                    // return val;
                }

            }
            that.maxRobotLength = 30;
            $("#inputLengthTip").html(lanRes.inputLengthTip1 + ' ' + that.maxRobotLength + ' ' + lanRes.inputLengthTip2);
            that.handleInputLength = function () {
                var val;
                if (view.chat.isInRobot) {
                    val = that.getInput();
                    getByteLen(val, that.maxRobotLength);
                }
                if ((view.chat.isInRobot || window.SDK) && view.urlList) {
                    if (val || that.getInput()) { 
                        // $("#menu_more_robot").hide();
                        $(".menu-more").hide();
                        $("#enter_btn").removeClass('hide')
                    } else {
                        // $("#menu_more_robot").show();
                        $(".menu-more").show();
                        $("#enter_btn").addClass("hide");
                    }
                }
            }
            this.subscribe('startRobot', function (evt, msg) {
                that.unSubscribe('startRobot');//事件只定一次
                if (view.urlList) {
                    $("#menu_more_robot").show();
                    $("#enter_btn").addClass("hide");
                }
                //常见问题
                $('#list_msg').on('click', '.common-ques-li', function (evt) {
                   /*采用发送到后台的方式 方便信息反馈*/
                    that.publish('_sendQueenstion',{
                        docId: $(this).attr("did"),
                        content: unescape($(this).attr("ques"))
                    });
                });
                //转人工
                $("#robotToStaffWord").on('click', function () {
                    if(EChatQuery.cometd.getStatus() == 'disconnected'){

                    }
                    else if (that.isInRobot) {
                        that.publish("sendVisitorEvent", {
                            et: 131
                        });
                    }
                });
                $("body").on('click', '.robot-staff', function () {
                    if (that.isInRobot) {
                        that.publish("sendVisitorEvent", {
                            et: 131
                        });
                    }
                });
                //联想
                $('#input_suggest').on('click', '.ipt-list-li', function (evt) {
                    that.setInput( unescape($(this).attr("ques")));
                    // that.publish("_sendMsg");
                    if(that.isInRobot) {
                        that.publish('_sendQuestion',{
                            docId: $(this).attr("did"),
                            content: unescape($(this).attr("ques"))
                        });
                        //清空输入框
                        var msg = that.getInput(true);
                        if(msg){
                            view.afterSend();
                        }
                    }
                });
                //相关问题、相似问题点击、引导问题
                $('#list_msg').on('click', '.question-list-li', function (evt) {
                    that.publish('_sendQuestion',{
                        docId: $(this).attr("did"),
                        originDocId: $(this).attr("oid"),
                        content: unescape($(this).attr("ques"))
                    });
                });

                //反馈 转人工后也要能点击
                // var solveFeedIndex = 0,unsolveFeedIndex = 0;
                $('#list_his').on('click', '.feedback-btn-unsolve', function (evt) {
                    var p = this.parentNode.parentNode;
                    var docId = $(p).attr("did");
                    if (!docId)return;
                    view.chat.lastFeedBack = p
                    that.publish("sendVisitorEvent", {
                        et: 133,
                        docId: docId,
                        queryId: $(p).attr("qid"),
                        robotDetailId: $(p).attr("rid"),
                        searchId: $(p).attr("searchId"),
                        originQuestion: unescape($(p).attr("originQuestion")),
                        feedBack: $(this).attr('type')
                    });
                    $(p).attr("did","").addClass('robot-feedback-had robot-feedback-had2');
                    $(this).addClass('feedback-btn-unsolve-sel');
                    // view.scrollUpdate && view.scrollUpdate();
                    var id = $(this).parents('.msg-robot').attr('id');
                    id && view.scrollToBottom(id);
                }).on('click', '.feedback-btn-solve', function (evt) {
                    var p = this.parentNode.parentNode;
                    var docId = $(p).attr("did");
                    if (!docId)return;
                    view.chat.lastFeedBack = p
                    that.publish("sendVisitorEvent", {
                        et: 133,
                        docId: docId,
                        queryId: $(p).attr("qid"),
                        robotDetailId: $(p).attr("rid"),
                        searchId: $(p).attr("searchId"),
                        originQuestion:unescape($(p).attr("originQuestion")),
                        feedBack: $(this).attr('type')
                    });
                    $(p).attr("did","").addClass('robot-feedback-had robot-feedback-had1');
                    $(this).addClass('feedback-btn-solve-sel');
                    // view.scrollUpdate && view.scrollUpdate();
                    var id = $(this).parents('.msg-robot').attr('id');
                    id && view.scrollToBottom(id);
                }).on('click', '.feedback-sub-content', function (evt) {
                    var p = this.parentNode.parentNode;
                    var docId = $(p).attr("did");
                    if (!docId)return;
                    var type = $(this).attr('type');
                    that.publish("sendVisitorEvent", {
                        et: 133,
                        docId: docId,
                        queryId: $(p).attr("qid"),
                        robotDetailId: $(p).attr("rid"),
                        searchId: $(p).attr("searchId"),
                        originQuestion: unescape($(p).attr("originQuestion")),
                        feedBackSubitem: this.innerText || this.textContent || this.innerHTML//,
                        // feedBack: type
                    });
                    $(p).attr("did","").addClass('robot-feedback-sub-had');
                    $(this.parentNode).addClass('feedback-sub-sel'+type)
                });

            });
            this.subscribe('endRobot', function (evt, msg) {
                that.typingTimer && clearTimeout(that.typingTimer);
                that.isInRobot = 0;
                $("#toolbar").removeClass('robot');
                $("body").removeClass('robot');
                $("#robotToStaff").hide();
                $(".robot-staff").removeClass('robot-staff');
                that.unSubscribe('_sendQuestion');
                // console.log(that.talkId);
                that.robotTalkId && that.handleSessionMsg({talkId: that.robotTalkId});
                that.robotTalkId = null;
            });
            $(".leave-bar-btn").on('click',function(){
                that.publish("restartChat");
            });
          /*  this.subscribe("closeConnect",function (evt,msg) {
                if(that.hasLeaveMsg){

                }else{
                    //关闭窗口?
                    // window.self.opener=null;
                    // window.self.close();
                }
            })*/

            //隐藏转人工 忙碌提示语
            $(".robot-staff-close").on('click', function () {
                var line = this.parentNode;
                $(line).addClass('hide').hide();
            });
            //处理互动窗口发送的消息
            that.unSubscribe("getCrossMessage");
            that.subscribe("getCrossMessage", function (eventName, evt) {
                var data = evt.data, targetWnd = evt.source;
                if (!data) {
                    return
                }
                if (that.hasSearchInSameScreen && data.evt == 'robot') {
                    //同屏检索发送问题
                    if (data.type == 'question' && data.content) {
                        that.publish("_sendMsg", data.content);
                    }
                } else if (data.evt == 'echatjs') {
                    if (data.type == 'echatInnerFrame'&&targetWnd) {
                            try {
                                targetWnd.postMessage({
                                    type:'echatInnerFrameCallback',
                                    companyId:that.companyId,
                                    visitorId:that.visitorId,
                                    chatVisitorId:window.chatVisitorId,
                                    encryptVID:window.encryptVID,
                                    metaData:that.queryParams['metadata'] || ''
                                }, data.origin);
                            } catch (e) {
                            }
                    }else if(data.type=='openChat'){
                        //手机隐藏该iframe?:直接隐藏URLlist打开的iframe页面和普通网站的iframe
                        (that.isMobile||view.windowType==2) && view.hideURLSite && view.hideURLSite();
                        //iframe内点击请求对话,如果对话已经结束:继续对话
                        that.publish("_triggerChat");
                    }
                }

            });
            //如果没有对话就继续对话
            that.subscribe('_triggerChat', function (evt, msg) {
                if ($.cometd.getStatus() == 'disconnected') {
                    if (_$('satisfy').style.display == 'block') {
                        if (msg.data.type == 5 || msg.type == 'openChat') {//隐藏满意度评价
                            // $("#satisfy").removeClass('satisfy-show');
                            $("#satisfy").hide();
                            $("#mask").hide();
                        } else {
                            return;
                        }
                    }
                    setTimeout(function () {
                        //微信 QQ 不加延时会卡死
                        view.chat.publish("restartChat");
                    }, 15);
                    $("#restartChat").removeAttr("id").removeClass("btn-restart").text(lanRes.chatContinued);
                }else if(!that.isMobile){
                    //获取输入框焦点
                    that.focusInput();
                }
            });
            $("#content").on("click",'.msg-leave',function () {
                var token = $(this).attr('k'),returnVal;
                var msg = that.leaveMsgMap[token];
                var url = (that.needHttps || 'http:') +'//'+ that.apiServerDomain + '/chatapi/paodm/qd?companyId='+that.companyId
                    +"&visitorId="+msg.visitorId+"&chatInfoType="+msg.chatInfoType+"&talkId="+msg.newsMsgId+"&tm="+msg.tm+"&token="+msg.signature;
                var link = (that.needHttps || 'http:') + '//' + location.host + "/visitor/common/record.html?lan=" + window.lanResName + "&url=" + encodeURIComponent(url);
                if(view.handlePushURL){
                    returnVal = view.handlePushURL(link);
                    if(returnVal == -1){
                        window.open(link,'_blank');
                    }
                }else{
                    // if (that.queryParams.echatIframeDisable == 1 || link.indexOf('echatIframeDisable=1') != -1) {
                    //     window.open(link,'_blank');
                    //     //指定新窗口打开
                    // } 因是echat自己的链接，最好非大窗口都是使用页内方式展示，方便查看和返回对话
                    //非PC大窗口 采用打开连接的方式
                    view.showURLLink && view.showURLLink(lanRes.leaveMsgTitle,link);
                }
                if($("#msg"+msg.tm).hasClass('unfold')){
                    that.handleNewMsgMid(msg.mid,msg,false);//todo点开留言不提示新消息吧
                }
                /*设置页面已读*/
                $("#msg"+msg.tm).removeClass('unfold');
                /*设置历史记录已读*/
                if (that.hasStorage) {
                    var hist = window.localStorage.getItem(that.historyKey);
                    if (hist) {
                        hist = JSON.parse(hist);
                        var talk = hist[msg.talkId];
                        if (talk && talk[msg.tm + 's']&&talk[msg.tm + 's'].unfold) {
                            delete talk[msg.tm + 's'].unfold;
                        }
                        window.localStorage.setItem(that.historyKey,JSON.stringify(hist));
                    }
                }

            });
            /**
             * 显示验证码 或直接等待对话
             */
            this.subscribe("waitingChat", function (eventtype, msg) {
                that.chatting = -1;//!! true
                $("#chat").removeClass("hide");
                $("#footer").removeClass("hide").removeClass('leave-disabled');
                $("#leave").addClass("hide");
                $("#busyTipLine").addClass('hide').hide();

                $("#leave").addClass("hide");
                $("#container").removeClass('hide');
                $('.leave-entry-foot').addClass("hide");
                $("#container_leave").addClass("hide");


                that.sendMsgNum = 0;
                $("#inputPlaceholder").html($("#inputPlaceholder").attr("placeholder") || lanRes[$("#inputPlaceholder").attr('langs')]);
                //以上是重置状态

                var first109 = !that.msg649;
                var old = !!(that.msg649 && that.msg649.robotConfigInfo);
                if (msg.robotConfigInfo||msg.robotPCChatBox || msg.offlineBoxInfo || msg.mobileOfflineBoxInfo||msg.sdkOfflineBoxInfo||msg.sdkChatBoxInfo || msg.mobileChatBoxInfo || msg.chatBoxInfo|| msg.chatSmallBoxInfo|| msg.offlineSmallBoxInfo) {
                    //有配置时才保存配置
                    that.msg649 = $.extend(that.msg649||{},msg);
                    window.SDK &&$.store('ECHAT_649', JSON.stringify(that.msg649));
                }
                if (msg.unreadMsgNumber) {
                    that.companyOff = msg.status == 2;
                    that.hasLeaveMsg = true;
                    that.publish('removeLoading');
                    view.toggleLeaveToChat && view.toggleLeaveToChat(1);
                    return;
                } else {
                    that.hasLeaveMsg = false;
                    view.toggleLeaveToChat && view.toggleLeaveToChat(0);
                }
                that.hasSearchInSameScreen = false;//同屏检索权限
                that.hasInputAssociation = false;//输入联想权限
                if (msg.robotConfigInfo){
                    var privilege = msg.privilegeCode;

                    if(privilege){
                        that.hasSearchInSameScreen = privilege.charAt(privilege.length - (1 + 45)) == 1;
                        that.hasInputAssociation = privilege.charAt(privilege.length - (1 + 4)) == 1;
                    }
                    // that.loadHistory();
                    //代表是机器人
                    that.companyOff = msg.status == 2;
                    that.publish('initRobot', msg);
                    view.toggleLeaveToChat && view.toggleLeaveToChat(2);
                    return;
                } else {
                    that.data109 = null;//已经进入非机器人了,109数据可以删除了。
                    //可能是机器人转人工

                    that.publish("endRobot");
                    //重置头像昵称  todo 可能还有其他需要重置的
                    that.staffName = '';
                    that.staffImg = that.defaultStaffImg;
                    that.staffId = undefined;
                    delete that.paramChat.staffId;
                    delete that.paramChat.staffName;
                    delete that.paramChat.staffPhoto;
                    delete that.paramChat.talkId;
                    if (old === true){
                        that.isInRobot = 0;
                        !that.isMobile && that.changeToIframe();
                        $("#textInput").attr('placeholder',lanRes.textareaInput.placeholder);
                    }//记录从机器人过来
                }
                // that.handleInputLength = undefined;
                $("#inputLengthTip").hide();
                if (!that.getInput(false)) {
                    $("#inputPlaceholder").removeClass("hide");
                }else{
                    $("#inputPlaceholder").addClass("hide");
                }

                that.companyOff = undefined;
                that.hasChatInOtherPage = false;
                $.cookie('ECHAT_' + that.companyId + "_" + window.chatVisitorId + "_chatStatus",msg.chatStatus,{path:'/'});
                if (msg.chatStatus == 2) {
                    that.wait874List = true;
                    that.hasChatInOtherPage = true;
                    // that.chatting = true 604再处理
                    //进入界面时，对话已经开始，就可不加载本地的"本次"的对话记录。 延迟到对话开始了去加载，间隔应该会很短
                }else if (msg.status == 1) {
                    //公司在线，没有对话0或正在请求对话1。
                    //等待提示语 将来会通过系统消息传过来。
                    that.showEntryAndCode(msg,true);
                    //加载本地历史记录
                    // that.loadHistory();
                  /*  setTimeout(function () {
                        that.toInitEvaluate(msg);
                    }, 10);*/
                }
                if (msg.status == 2) {//公司离线
                    //加载本地历史记录
                    // that.loadHistory();
                    that.publish("toLeavePage", msg);
                }else{
                    that.companyOff = false
                }

                setTimeout(function () {
                    that.toInitEvaluate(msg);
                }, 10);
                that.publish('__staffStatus',msg.status);
                //todo 去除入口信息  两个页面同时打开了入口信息。。。其中一个进去了另外一个也会同步进去,需要去掉入口信息
                $("#router").hide();
                ECHATObjKeyMap["cometdId"].waitForRouterSelect = false;

                //进入页面广告语 离线耶耶欧
                // if (msg.status != 2) {
                if (msg.chatBoxInfo || msg.chatSmallBoxInfo || msg.mobileChatBoxInfo || msg.sdkChatBoxInfo) {
                    view.setInnerAD(msg);
                }
                // }
                if (that.companyOff !== true && (!that.busyCanSend||that.queryParams['autoChat']=='0')&& that.chatting!==true) {
                    $(".menu-capture").addClass("hide");
                    $(".menu-file").addClass("hide");
                }else if((that.companyOff !== true && that.busyCanSend && that.chatting!==true)||that.companyOff === true) {
                    //排队中、留言中
                    $(".menu-capture").removeClass('hide');
                    $(".menu-file").removeClass("hide");
                }
                //访客可以发送消息
                that.openVisitorSend();

                if (that.isMobile) {
                    window.audioInstance || (window.audioInstance = _$s("audio")[0]);

                } else if (!window.isIE6) {
                    if (!window.audioInstance||!window.SDK) {
                        that.addJS("/visitor/common/audiojs/audiojs/audio.min.js", function () {
                            audiojs.events.ready(function () {
                                window.audioInstance = audiojs.create(_$('msgAudio'));
                            });
                        });
                    }
                }

                that.unSubscribe("_newMsg");
                that.subscribe("_newMsg", function () {
                    //默认不禁用声音 app可关闭
                    if (!that.disableSoundTip && window.audioInstance) {
                        var audio = window.audioInstance;
                        //audio.playPause().apply(audio);
                        try {
                            audio.play.apply(audio);
                        } catch (e) {
                            //ie6不支持
                        }
                    }
                });

                //发送对话链接里面的图文消息
                if (first109 && that.paramChat.visEvt) {
                    var evtData = JSON.parse(that.paramChat.visEvt);
                    that.subscribe("_pushVisitorEvent",function () {
                        return;
                    });
                    if(!that.hasEntryOrCode){
                        that.publish("_pushVisitorEvent");
                    }
                }
                //不自动接通对话的情况
                if (msg.notThroughStatus == 1) {// 不是排队中  对话中等874删除loading
                // if (that.companyOff !== true && msg.chatStatus != 1 && msg.notThroughStatus == 1) {// 不是排队中
                    // msg.notThroughChatTxt && that.showInfoTip(msg.notThroughChatTxt, "msg" + msg.tm, undefined, undefined, msg.talkId, msg.tm,false); 改为作为系统消息647发过来
                    that.publish("removeLoading");
                }
                /*else{
                    delete that.queryParams.autoPop;
                    delete that.queryParams.autoChat;
                }*/
            });
            this.subscribe('_addSendMsgNum', function (evtType, msg) {
                that.sendMsgNum++;
                //todo 处理访客
                if (that.allowEvaluateBaseWords <= that.sendMsgNum) {
                    $(".menu-satisfy").removeClass("limit-hide");
                }
            });
            var newMsgMap = {};//存储已经展示过的新消息;
            that.handleNewMsgMid = function (mid, item, newMsgFlag,msg) {
                if (!mid || newMsgMap[mid]) return;
                newMsgMap[mid] = 1;
                that.lasMid = that.lasMid || $.cookie('ECHAT_' + that.companyId + "_" + that.visitorId + "_mid") || 0;
                if (that.lasMid < mid) {
                    if (item && newMsgFlag) {
                        item.mid = mid;
                        if (msg.isFoward === false || !window.SDK) {//sdk未发送过
                            that.publish("_newMsg", item);
                            that.publish("__newMsg", item);//加载本次对话历史记录时不能调用
                        }
                    }
                    $.cookie('ECHAT_' + that.companyId + "_" + that.visitorId + "_mid", mid);
                    if (view.showChangeTitle === false || view.miniShow || window.ltIE10) {
                        //内页展开了
                        //焦点在本页
                        $.cookie('ECHAT_' + that.companyId + "_" + window.chatVisitorId + "_mid_read", mid, {
                            path: '/'
                        });
                        if (view.windowType == 1 && view.showChangeTitle === false) {
                            $.cookie('ECHAT_' + that.companyId + "_" + window.chatVisitorId + "_mid_read_click", mid, {
                                path: '/'
                            });
                        }
                    }
                }
            }
            that._getMsg = function (data, mode, msg, from) {
                data.tm || (data.tm = new Date().getTime());
                var time = new Date(data.tm ? (data.tm-0) : undefined);
                var id =  data.bridgeMsgId || data.fileIdentity ||("msg" + data.tm);
                var needStamp = that.checkHistoryTime(data.tm);
                var item = {
                    t: data.t || (needStamp ? (time.format("hh:mm")) : undefined),//显示时间
                    tm: data.tm,//时间戳
                    mt: msg && msg.mt || data.mt,
                    f: from || "s",
                    m: mode,//0 文本 1文件 2图片 3预约确认
                    c: msg,
                    hasResend:data.bridgeMsgId&&data.sendStatus==2,//为sdk重发准备按钮
                    notEnd:data.notEnd,
                    id: id//消息元素ID,方便显示状态和滚动
                };
                if(item.hasResend){//为sdk重发准备
                    that.errorList[id] = data;
                }
                //这是talkId
                item.talkId = data.talkId||that.talkId;

                if(data.staffImg){
                    item.staffImg = data.staffImg;
                }
                if(data.staffName){
                    item.staffName = data.staffName;
                }

                if(from=='f'||data.ff == 'r'){
                    //机器人
                    item.ff = 'r';
                }
                if (that.hasStorage && data.fromUnread && !that.hasLoadHis) {
                    //未读消息 会和本地历史重复
                } else {
                    //已知的空消息是预约邀请表
                    item.c && that.showMsg(item);
                }
                delete item.id;
                delete item.hasResend;
                if (!data.notStore) {
                    if (mode == 2) {
                        item.fileName = data.fileName;
                        item.bigImg = data.bigImg;
                        item.smallImg = data.smallImg;
                        item.sourceImg = data.sourceImg;
                        item.c = 'img-temp';
                        item.sourceWidth = data.sourceWidth;
                        item.sourceHeight = data.sourceHeight;
                    }

                    if (from == 'x' && item.m != 5) {//图文消息直接保存拼装好的
                        //预约表
                        item.c = data.content;
                    }else if(from=='r'){
                        item.c = data.content;
                    }
                    (msg || data) && (!that.isMobile) && view.setDocumentTitle && view.setDocumentTitle(from);
                    if (from != 'c') {//非访客消息
                        that.handleNewMsgMid(data.mid, item, true,msg);
                    }
                    item.c && that.pushHistory(item);
                }
                //最后时间的消息时间戳 在connect中设置
                //that.lastMsgTM = (data.tm && (data.tm > that.lastMsgTM)) ? data.tm : that.lastMsgTM;
            }
            this.escapeHtml = function (str) {
                // return str && str.replace(/"/, '&#34;').replace(/&/, '&#38;').replace(/</, '&#60;').replace(/>/, '&#62;')
                return str && str.replace(/"/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            }
            
            var visEvtMsg = function(bool){
                return bool?
                        '<div class="custom-event custom-event-wrap">{{imageUrl}}' +
                        '<div class="custom-event-content"><div class="custom-event-title" title="{{title1}}">{{title}}</div>' +
                        '<div class="custom-event-detail">{{content}}</div></div></div>{{memo}}':
                        '<a class="custom-event '+(that.isInRobot?'bg30':'bg3')+'" {{linkset}}><div class="custom-event-wrap">{{imageUrl}}' +
                        '<div class="custom-event-content"><div class="custom-event-title" title="{{title1}}">{{title}}</div>' +
                        '<div class="custom-event-detail">{{content}}</div></div></div>{{memo}}</a>';
            }
            this.subscribe('receiveVisEvt',function (evtType,msg) {
                if (!msg.notStore && msg.talkId && !that.talkId) {//未读消息暂时没有图文消息 所以这里应该永远都是当前回话的  排除加载历史的系统消息
                    that.talkId = msg.talkId;
                }
                if(msg.visibility==2){
                    //仅客服可见
                    if (!msg.notEnd && msg.closeURLPage == '1' || !msg.closeURLPage) {//'0'不关
                        view.hideURLSite&&view.hideURLSite();
                    }
                    return;
                }
                if (msg.notStore || msg.c) {
                    return that._getMsg(msg, 5, msg.c,msg.f);
                }
                if (msg.urlForVisitor) {
                    // http('http://m.echatsoft.com','inner') blank
                    var arr = msg.urlForVisitor.replace(/\s/g, '').match(/^http\(['"]?([^'",]+)['"]?(\,['"]?(blank|inner)['"]?)?\)/i);
                    if (arr) {
                        msg.url = arr[1];
                        msg.openType = arr[3];
                    }else{
                        msg.url = '';
                    }

                } else {
                    if (msg.urlEnableForVisitor == 0) {
                        msg.url = undefined;
                        delete msg.url;
                    }
                    if (msg.url) {
                        var match = msg.url.replace(/\s/g, '').match(/^apiUrl\(['"]?(\d+)['"]?(\,['"]?(reload|hash)['"]?)?\)/);
                        if (match) {
                            msg.toCrmUrlId = match[1];
                            // console.log(match[2]);match[3]是TYPE 可能没有2
                        } else {
                            if (!msg.url.match(/(^http[s]?:)|(^file:)/i)) {
                                msg.url = '';
                            }
                            msg.toCrmUrlId = false;
                        }
                    }
                }
                var imgElement = '';
                if (msg.imageUrl) {
                    msg.imageUrl = msg.imageUrl.replace(/["']/, '');
                    imgElement = msg.imageUrl?('<img class="custom-event-img" src="'+msg.imageUrl+'"/>'):'';
                    if(!msg.url || msg.toCrmUrlId){
                        var patt1 = /<img\b.*?(?:\>|\/>)/gi;
                        imgElement = imgElement.replace(patt1,function(){
                        var data = {
                            smallImg: msg.imageUrl,
                            bigImg: msg.imageUrl,
                            sourceImg: msg.imageUrl,
                            fileName: '预览'
                        }
                        var showImg = view.showMsgImg ? view.showMsgImg(data,'custom-event-img') : 
                        ('<img '+(!data.notEnd?'onload="javascript:view.scrollToBottom()"':'')+' id="img' + (data.tm || new Date().getTime()) 
                        + '" attname="' + (data.fileName) 
                        + '" bigimg="' + data.bigImg
                        + '" src="' + data.smallImg
                        + '" source="' + (data.sourceImg||"")
                        + '" sw="' + (data.sourceWidth||"")
                        + '" sh="' + (data.sourceHeight||"")
                        + '" class="msg-img custom-event-img"/>');
                        return showImg;
                    })
                    }
                }
                var html = visEvtMsg(!msg.url || msg.toCrmUrlId).replace(/\{\{linkset\}\}/, (!msg.url || msg.toCrmUrlId) ? '' : (' href="' + msg.url
                + (msg.openType == 'inner' ? ('" target="inner" title="' + (msg.title || lanRes.interactWnd) + '" ') : '" target="_blank" ')))
                    .replace(/\{\{title1\}\}/,that.escapeHtml(msg.title)||'').replace(/\{\{title\}\}/,msg.title||'').replace(/\{\{imageUrl\}\}/,imgElement)
                    .replace(/\{\{content\}\}/,msg.content||'')
                    .replace(/\{\{memo\}\}/,msg.memo?('<div class="custom-event-memo">'+msg.memo+'</div>'):'');
                if(msg.customizeMsgType==2||msg.mst==3){
                    //系统消息
                    that._getMsg(msg, 5,'<li class="clearfix custom-event-li" id="msg'+msg.tm+'">'+html+'</li>' ,'x');
                }else if(!msg.mst||msg.mst==1){
                    //访客消息
                    that._getMsg(msg, 5, html,'c');
                    //对话中发送订单隐藏URL列表和表情
                    !msg.notEnd && view.hideMenus && view.hideMenus();
                }else if(msg.mst==2){
                    //客服 消息
                    that._getMsg(msg, 5, html,'s');
                    //对话中发送订单隐藏URL列表和表情
                    !msg.notEnd && view.hideMenus && view.hideMenus();
                }
                //
                if (!msg.notEnd && msg.closeURLPage == '1' || !msg.closeURLPage) {
                    view.hideURLSite&&view.hideURLSite();
                }
            });
            this.subscribe("receiveURL",function (eventType,data) {
               var url = data.pushUrlDetail.url,classBlank = '';
                if (view.chat.needHttps && url.match(/^http:/i)) {
                    classBlank = ' push-blank'
                }
                if(view.pushURLParam){
                    var arr = url.split("#");
                    url = arr[0]
                        + (arr[0].indexOf("?") == -1 ? "?" : "&" )
                        + view.pushURLParam
                        + (arr[1] ? ('#' + arr[1]) : '');
                }
               /* var html = '<div class="push-url'+classBlank+'" href="'+data.pushUrlDetail.url+'"><div class="push-icon"></div><div class="push-content"><div class="push-name">'
                    +data.pushUrlDetail.urlName+" "+'</div><div><a class="push-url-link" target="info_frame3" href="'+data.pushUrlDetail.url+'">'
                    +data.pushUrlDetail.url+'</a></div></div></div>';*/
                var html = '<a class="push-url clearfix'+classBlank+'" target="info_frame3" href="' + url + '"><div class="push-icon bg1"></div><div class="push-content"><div class="push-name">'
                    +data.pushUrlDetail.urlName+" "+'</div><div class="push-url-link">'
                    +data.pushUrlDetail.url+'</div></div></a>';
                that._getMsg.call(this, data, 6, html, "s");
                if (that.queryParams.echatIframeDisable != 1 && url.indexOf('echatIframeDisable=1') == -1) {
                    view.handlePushURL && view.handlePushURL(url, undefined, data.pushUrlDetail.urlName);
                }
            });
            this.subscribe("getMsgImg", function (eventType, data) {
                if (that.needHttps) {
                    //先替换七牛域名
                    if (that.qiniuDomain && that.qiniuHttpsDomain) {
                        data.bigImg && (data.bigImg = data.bigImg.replace(that.qiniuDomain, that.qiniuHttpsDomain));
                        data.smallImg && (data.smallImg = data.smallImg.replace(that.qiniuDomain, that.qiniuHttpsDomain));
                        data.sourceImg && (data.sourceImg = data.sourceImg.replace(that.qiniuDomain, that.qiniuHttpsDomain));
                    }
                    data.bigImg && (data.bigImg = data.bigImg.replace(/^http:/, that.needHttps));
                    data.smallImg && (data.smallImg = data.smallImg.replace(/^http:/, that.needHttps));
                    data.sourceImg && (data.sourceImg = data.sourceImg.replace(/^http:/, that.needHttps));
                }
                if (!data.fileName || data.fileName == 'temp.png') {
                    data.fileName = 'Echat' + new Date().format('yyyyMMddhhmmss') + '.png';
                }
                data.sourceImg = data.sourceImg||data.bigImg;
                var msg = view.showMsgImg ? view.showMsgImg(data) :
                    ('<img '+(!data.notEnd?'onload="javascript:view.scrollToBottom()"':'')+' id="img' + (data.fileIdentity || data.tm || new Date().getTime()) + '" attname="'
                    + (data.fileName) + '" bigimg="' + (data.bigImg || data.sourceImg)
                    + '" src="' + data.smallImg
                    + '" source="' + (data.sourceImg||"")
                    + '" sw="' + (data.sourceWidth||"")
                    + '" sh="' + (data.sourceHeight||"")

                    + '" class="msg-img"/>');
                var sending;

                if (data.fileIdentity && (sending = _$(data.clientFileId||data.fileIdentity))) {
                    //sending.innerHTML = (msg.fileName || "") + "发送成功";
                    sending.parentNode.removeChild(sending);
                    that.addSendFile();
                }
                //发送文件标示
                if (that.sendingFileToken && that.sendingFileToken == data.fileIdentity) {
                    that.sendingFileToken = '';
                    that.publish("_toggleEnableFile", true);
                }
                that._getMsg.call(this, data, 2, msg, data.mt == 865 ? "c" : "s");
                view.initImgPlay&&view.initImgPlay();
            });

            this.subscribe("getMsgFile", function (eventType, data) {
                if (that.needHttps&&data.fileUrl) {
                    //已经生成过就不改了
                    //先替换七牛域名
                    if (that.qiniuDomain && that.qiniuHttpsDomain) {
                        data.fileUrl = data.fileUrl.replace(that.qiniuDomain, that.qiniuHttpsDomain);
                    }
                    data.fileUrl = data.fileUrl.replace(/^http:/, that.needHttps);
                }
                var target = 'downFile';
                if(that.isIOS){
                    target = '_blank';
                }
                var msg = view.SDK?view.getMsgFile(data):(data.c ? data.c : ('<div class="file-info"><div class="file-name">'
                + data.fileName + '</div><div class="file-size">'
                + (parseInt(data.fileSize / 1024) + 1) + 'KB</div></div><div class="file-icon">&nbsp;</div><a class="file-link file-link-a color0" href="'
                    + data.fileUrl + (data.fileUrl && (data.fileUrl.match(/http[s]?:\/\/[^\/]*(qn|qiniu)[^\/]*\//i)||!data.fileUrl.match(/http[s]?:\/\/[^\/]*(oss)[^\/]*\//i))
                        ? ((data.fileUrl.indexOf('?')==-1?'?':'&') + 'attname=' + data.fileName):'' )
                + '" target="'+target+'">' + lanRes.download + '</a>'));
                var sending;
                if (data.mt == 866 && data.fileIdentity && (sending = _$(data.clientFileId||data.fileIdentity))) {
                    //msg = "文件发送成功。"+msg;
                    sending.parentNode.removeChild(sending);
                    that.addSendFile();
                }
                //发送文件标示
                if (that.sendingFileToken && that.sendingFileToken == data.fileIdentity) {
                    that.sendingFileToken = '';
                    that.publish("_toggleEnableFile", true);
                }
                that._getMsg.call(this, data, 1, msg, data.mt == 866 ? "c" : "s");
            });

            that.subscribe("_toggleEnableFile", function (evt, flag) {
                if(that.hasFormData){
                    return;
                }
                var doc;
                if (!(doc = _$("file_up").contentDocument)) {
                    doc = document.frames["file_up"].document;
                }
                var uploadInput = doc.getElementById("uploadInput");
                if (flag) {
                    $(".menu-file").removeClass('menu-file-sending').attr('title',lanRes.selectFile);
                    uploadInput.setAttribute('disabled', '');
                    uploadInput.disabled = false;
                    uploadInput.removeAttribute('disabled');
                    uploadInput.title = lanRes.selectFile;
                    uploadInput.setAttribute('title', lanRes.selectFile);
                } else {
                    $(".menu-file").addClass('menu-file-sending').attr('title', that.sendingTitle);
                    uploadInput.disabled = 'disabled';
                    uploadInput.setAttribute('disabled', 'disabled');
                    uploadInput.title = that.sendingTitle;
                    uploadInput.setAttribute('title', that.sendingTitle);
                }
            });

            this.subscribe("getMsg", function (eventType, data) {
                var msg = data.translation || data.content;//优先使用翻译 不保存原文
                if(!msg){
                    return;
                }
                /** 拿到文本中的IMG标签，处理图片用到 */
                var patt1 = /<img\b.*?(?:\>|\/>)/gi;
                msg = msg.replace(patt1,function(img){
                    var patt2 = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i;
                    var src = patt2.exec(img)[1];
                    var data = {
                        smallImg: src,
                        bigImg: src,
                        sourceImg: src,
                        fileName: '预览'
                    }
                    var showImg = view.showMsgImg ? view.showMsgImg(data) : 
                    ('<img '+(!data.notEnd?'onload="javascript:view.scrollToBottom()"':'')+' id="img' + (data.tm || new Date().getTime()) 
                    + '" attname="' + (data.fileName) 
                    + '" bigimg="' + (data.bigImg||data.sourceImg||'')
                    + '" src="' + data.smallImg
                    + '" source="' + (data.sourceImg||"")
                    + '" sw="' + (data.sourceWidth||"")
                    + '" sh="' + (data.sourceHeight||"")
                    + '" class="msg-img"/>');
                    return showImg;
                })
                //客服发送来的 也替换掉&nbsp;避免切词问题
                msg = msg.replace(/&nbsp;([^&\s])/g,' $1');
                that._getMsg.call(this, data, 0, msg);
            });
            that.robotUnknowTime=0;
            this.subscribe("getMsgRobot", function (eventType, data) {
                /*历史记录*/
                if(data.f=='r') {
                    return that._getMsg.call(this, {
                            talkId: data.talkId, tm: data.tm,
                            mt: 12001, ff: 'r', staffImg: data.staffImg, staffName: data.staffName, content: data.c,
                            notEnd: true, notStore: true
                        },
                        0, data.c, 'r');
                }
                /**
                 * type
                 * 1普通知识结果、2菜单知识结果、3请求转人工结果、4输入联想结果、5消息反馈结果
                 */
                var answerList = data.knowledgeAnswerList||[],//只有输入联想有多个
                    needFeedBack =false,
                    answerItem,
                    question,
                    segWords,
                    lastIndex,
                    replaceStr,
                    otherList,//相关问题\//相似问题
                    msg = '', listHtml = '<ul class="question-list">', inputList = '<div class="ipt-list">';
                if (data.type == 4) {//4输入联想结果
                    //输入联想结果
                    segWords = data.segWords;
                    var word, hasMatch = false,answerLength = 0;
                    for (var i = 0; i < answerList.length; i++) {
                        answerItem = answerList[i];
                        question = answerItem.question;
                        hasMatch = false;
                        if (question == that.lastText) {
                            i++;
                            answerLength = 1;
                            inputList = '<div class="ipt-list"><a class="ipt-list-li" did="' + answerItem.docId + '" ques="' + escape(answerItem.question) + '"><b class="words-seg">' + question + '</b></a>';
                            break;
                        }
                        if (segWords) {
                            lastIndex = 0 ,replaceStr;
                            for (var j = 0; j < segWords.length; j++) {
                                word = segWords[j];
                                question = question.replace(new RegExp(word, 'igm'), function (val, index) {
                                    hasMatch = true;
                                    //span中间不替换
                                    var len = arguments.length;
                                    var idx = arguments[len - 2];
                                   /* if (idx < lastIndex) {
                                        return val;
                                    }*/
                                    if (idx > 0) {
                                        var preStr = arguments[len - 1].substring(0, idx);
                                        var nextStr = arguments[len - 1].substring(idx);
                                        if (word.match(/^s|sp|spa|span$/) && preStr.match(/<$/)) {
                                            return val;
                                        } else if (word.match(/^n|an|pan|span$/)) {
                                            var mat = '</span>'.replace(word, ',').split(',');
                                            if (preStr.match(new RegExp(mat[0]) && nextStr.match(mat[1]))) {
                                                return val;
                                            }
                                        }
                                        if (!/(\<span[^>]*>([^<]+(?!\<\/span\>))?$)|(\<[a-zA-Z]+[^>]*$)/ig.test(preStr)) {
                                            replaceStr = '<b class="words-seg">' + val + '</b>';
                                            // lastIndex = idx + replaceStr.length;
                                            return replaceStr;
                                        }
                                    } else {
                                        replaceStr = '<b class="words-seg">' + val + '</b>';
                                        // lastIndex = idx + replaceStr.length;
                                        return replaceStr;
                                    }
                                    // lastIndex = idx + val.length;
                                    return val;
                                });
                            }
                        }
                        if (hasMatch) {
                            answerLength++;
                            inputList += '<a class="ipt-list-li" did="' + answerItem.docId + '" ques="' + escape(answerItem.question) + '">' + question + '</a>';
                        }
                    }
                    if (answerLength > 0) {
                        //显示输入联想
                        $('#input_suggest').html(inputList + '</ul>').removeClass('hide');
                    }else{
                        //没有联想结果
                        $('#input_suggest').addClass('hide').html(' ');
                    }
                } else if (data.type == 3) {//3请求转人工结果
                    if (data.result == 204 || data.result == 205) {
                        that.showInfoTip(data.tips);
                        //重新发送109
                        that.robotToHumanKey = data.robotToHumanKey;
                        that.publish("toSetID");//203不允许输入联想  201不允许转人工
                        $('#input_suggest').addClass('hide').html(' ');
                    } else if (data.result == 206 || data.result == 202) {
                        console.log(data.result == 206 ? '禁用留言' : '禁用转人工');
                        // that.showInfoTip('暂时没有人工服务。');
                    }else if(data.result == 207) {
                        //todo 显示手动转人工提示
                        $("#robotToStaff").show();
                        that.showInfoTip(data.tips);
                        view.showRobotToStaff && view.showRobotToStaff(data);
                    }
                    // that.showInfoTip(data.tips);

                } else if (data.type == 5) {//5消息反馈结果
                    msg = data.tips||'';
                    msg = msg.replace(/&nbsp;([^&\s])/g, ' $1');
                    if (msg) {
                        that._getMsg.call(this,
                            {
                                tm: data.tm,
                                mt: data.mt,
                                ff: 'r',
                                staffImg: that.staffImg,
                                staffName: that.staffName,
                                content:'<div class="msg-item-robot"> ' + msg  + '</div>'
                            },
                            0, '<div class="msg-item-robot"> ' + msg  + '</div>' , 'r');
                    }
                    //设置dom
                    var el = $("#q" + data.robotDetailId), feedbackType;
                    data.feedback && $(el).attr('did', '').attr('qid', '').addClass('robot-feedback-had').addClass('robot-feedback-had' + data.feedback).attr('feedback', data.feedback);
                    data.feedback == 2 && $(".feedback-btn-unsolve", el.results[0]).addClass('feedback-btn-unsolve-sel');
                    data.feedback == 1 && $(".feedback-btn-solve", el.results[0]).addClass('feedback-btn-solve-sel');
                    if (data.feedbackSubitem) {
                        feedbackType = $(el).attr('feedback');
                        if (feedbackType == 2) {
                            $('.feedback-sub-solved', el.results[0]).remove();
                            console.log($('.feedback-sub-li', el.results[0]))
                            $('.feedback-sub-li', el.results[0]).each(function () {
                                if ($('.feedback-sub-content', this).text() == data.feedbackSubitem) {
                                    $(this).addClass('feedback-sub-sel2');
                                    $('.feedback-sub-list', el.results[0]).addClass('robot-feedback-sub-had')
                                }
                            });
                        } else if (feedbackType == 1) {
                            $('.feedback-sub-unsolved', el.results[0]).remove();
                            console.log($('.feedback-sub-li', el.results[0]));
                            $('.feedback-sub-li', el.results[0]).each(function () {
                                if ($('.feedback-sub-content', this).text() == data.feedbackSubitem) {
                                    $(this).addClass('feedback-sub-sel1');
                                    $('.feedback-sub-list', el.results[0]).addClass('robot-feedback-sub-had')
                                }
                            });
                        }
                        setTimeout(function(){
                            view.scrollUpdate()
                        },100)
                    }

                } else if (data.type == 6) {//6消息提示语
                    //客服发送来的 也替换掉&nbsp;避免切词问题
                    msg = data.tips||'';
                    msg = msg.replace(/&nbsp;([^&\s])/g, ' $1');
                    if (msg) {
                        that._getMsg.call(this,
                            {
                                tm: data.tm,
                                mt: data.mt,
                                ff: 'r',
                                staffImg: that.staffImg,
                                staffName: that.staffName,
                                content:'<div class="msg-item-robot"> ' + msg  + '</div>'
                            },
                            0, '<div class="msg-item-robot"> ' + msg  + '</div>' , 'r');
                    }
                } else if (data.type == 1 || data.type == 2) {
                    // 1普通知识结果  :访客输入发送后得到的反馈
                    // 2菜单知识结果  应该是只有准确答案
                    /**
                     *  answerType
                     *  1：没有答案
                     *  2:准确答案(relateKnowledges节点不为空根据配置显示相关问题)
                     *  3：有相似问题(suggestions相似问题)
                     *  4：寒暄库准确答案
                     *  5:docId返回的答案
                     *  6:完全匹配
                     *
                     *  answerItem.type  1.一般问题 2.引导问题
                     */

                    answerItem = answerList[0];
                    if (!answerItem) {
                        msg += data.tips||'';
                    } else if (answerItem.answerType == 1) {
                        //没有答案 只显示tips
                        msg += data.tips||'';
                    } else if (answerItem.answerType == 2) {
                        //准确答案 只有一个 并显示相关问题????  精准匹配?????
                        needFeedBack = answerItem.type == 1;
                        msg += '<div class="robot-tip">'+(data.tips||'')+'</div>'//仅准提示语
                        msg += answerItem.answer||'';
                        otherList = answerItem.relateKnowledges;
                        listHtml += '<div class="robot-tip margin-top10">'+(data.tipsExt||'')+'</div>';// 相关问题 提示语
                    } else if (answerItem.answerType == 3) {
                        //有相似问法????
                        otherList = answerItem.suggestions;
                        listHtml += '<div class="robot-tip">'+(data.tips||'')+'</div>';//相似问题 相关问题 提示语
                    } else if (answerItem.answerType == 4) {
                        // 寒暄库准确答案
                        msg += answerItem.answer||'';
                    } else if (answerItem.answerType == 5) {
                        //docid 查询而来 准确答案 只有一个
                        msg += answerItem.answer||'';
                        needFeedBack = answerItem.type == 1;
                        otherList = answerItem.relateKnowledges;
                        listHtml += '<div class="robot-tip">'+(data.tips||'')+'</div>';// 相关问题 提示语
                    }else if (answerItem.answerType == 6) {
                        //完全匹配
                        msg += answerItem.answer||'';
                        needFeedBack = answerItem.type == 1;

                        //引导问题
                        otherList = answerItem.relateKnowledges;
                        listHtml += '<div class="robot-tip margin-top10">'+(data.tips||'')+'</div>';// 引导问题 提示语
                    }
                    //显示 相关问题\//相似问题
                    if (otherList && otherList.length) {
                        for (var j = 0; j < otherList.length; j++) {
                            listHtml += '<li class="question-list-li" oid="' + answerItem.docId + '" did="' + otherList[j].docId + '" ques="' + escape(otherList[j].question) + '"><span class="list-style-dot">'+(j+1)+'. </span><span class="color-link">' + otherList[j].question + '</span></li>';
                        }
                        listHtml += '</ul>';
                    } else {
                        listHtml = '';
                    }

                    var feedback= '',tempFeedback;
                    if(needFeedBack&&that.robotFeedback){
                        
                        !answerItem.searchId&&(answerItem.searchId='')
                        !answerItem.originQuestion&&(answerItem.originQuestion='')
                        tempFeedback = data.relateId&&that.robotFeedbackTemp&&that.robotFeedbackTemp[data.relateId]||{}
                        data.feedback = data.feedback || tempFeedback.feedbackResult;
                        //显示反馈
                        feedback = '<div id="q' + answerItem.robotDetailId + '" class="robot-feedback'
                            + (data.feedback ?(' robot-feedback-had robot-feedback-had'+ data.feedback+'"') : ('" did="' + answerItem.docId + '" qid="' + answerItem.queryId + '" rid="' + answerItem.robotDetailId + '" searchId="' + answerItem.searchId + '" originQuestion="' + escape(answerItem.originQuestion) + '"'))
                            +'>' + that.robotFeedback({feedback:data.feedback,feedbackSubitem:tempFeedback.feedbackSubitem,answerItem:answerItem});
                    }


                    //显示手动转人工后台来做
                /*    if (that.msg649.robotConfigInfo && that.msg649.robotConfigInfo.switchWay == '2') {
                        if (answerItem.answerType == 1) {
                            that.robotUnknowTime++;
                            if (that.robotUnknowTime > that.msg649.robotConfigInfo.maxNotKnowTimes ) {
                                //未识别次数达到配置次数,显示转接提示
                                var tip  = '';
                                if(that.companyOff){
                                    tip = that.msg649.robotWordsInfo.manualOfflineWords;
                                }else{
                                    tip = that.msg649.robotWordsInfo.manualOnlineWords
                                }
                                // tip && that.showInfoTip(tip);
                                msg += tip;
                            }
                        } else {
                            that.robotUnknowTime = 0;
                        }
                    }*/
                    //客服发送来的 也替换掉&nbsp;避免切词问题
                    msg = msg.replace(/&nbsp;([^&\s])/g, ' $1');
                    if (msg || listHtml) {
                        that._getMsg.call(this,
                            {
                                tm: data.tm,
                                mt: data.mt,
                                ff: 'r',
                                staffImg: that.staffImg,
                                staffName: that.staffName,
                                content:'<div class="msg-item-robot"> ' + msg + listHtml + '</div>'
                            },
                            0, '<div class="msg-item-robot"> ' + msg + listHtml + '</div>' + feedback, 'r');
                    }
                }

            });
            this.subscribe("getMsgMine", function (eventType, data) {
                var msg = data.content;
                that.isInRobot && (data.ff = 'r');
                that._getMsg.call(this, data, 0, msg, "c");
            });

            //不再继续上传了返回true,需要重置表单等
            this.resendFile = function (msg,id){
                var that = this ;
                if (that.uploadServiceType < that.fileUploadInfosLength && msg.uploadServiceType < that.fileUploadInfosLength){
                    //切换方式上传
                    that.publish("sendVisitorEvent", {
                        et: 123,
                        ssl: that.needHttps ? 1 : undefined,
                        uploadServiceType: ++that.uploadServiceType,
                        ft: msg.fileType//发送文件
                    });
                    $('#'+id).remove();//删除上传中的文件消息 换了供应商id会变 可以有更好的过渡方式
                    return false;
               }else{
                    //没有方式可以切换了，直接显示上传失败 
                    that.publish("getErr", {reqInfo: id, code: -2});
                    return true;
               }
            };
            this.subscribe("getFileToken", function (eventType, msg) {
                //msg里面没有指定对应600的服务商，可以把参数放到651msg里面。
                var fileUploadInfo = that.fileUploadInfos['uploadServiceType' + (msg.uploadServiceType || that.uploadServiceType)] || msg,
                    params = {},
                    url = that.needHttps ? fileUploadInfo.fileUploadHttpsUrl : fileUploadInfo.fileUploadUrl,
                    id = msg.qiniuKey || msg.token || (msg.aliyunKey && msg.aliyunKey.match(/\/([^\/]+$)/)[1]),//跟上传成功的文件消息identity对应
                    matchArr = null, fileName, oData,
                    formParam = fileUploadInfo.fileUploadParam.split(',');
                if (msg.uploadServiceType) {
                    //后台会自动切换服务，以后台的为准，避免请求1返回2:成功下次请求2，失败重发请求2+1=3，而不是1和2
                    // 防止
                    // that.uploadServiceType = msg.uploadServiceType;
                }
                // key=${aliyunKey},success_action_status=200,OSSAccessKeyId=${ossAccessKeyId},policy=${policy},Signature=${signature},callback=${callback}"
                for (var i = 0; i < formParam.length; i++) {
                    params[formParam[i].split('=')[0]] = (matchArr = formParam[i].match(/\$\{([^\}]+)\}/)) ? msg[matchArr[1]] : formParam[i].split('=')[1]
                }
                msg.fileType = msg.fileType || 2;
                if (msg.fileType == 1) {
                    //下面是上传粘贴图片的处理 ft==1;
                    //目前已经废弃 观察一下
                    if (!that.pasteFileSource) {
                        return;
                    }

                    var form = new FormData();
                    form.append("file", that.pasteFileSource);
                }
                (msg.uploadServiceType === 3) && (url += '?token=' + msg.token);
                if (msg.fileType == 2||msg.fileType == 3||msg.fileType == 4) {//上传文件 语音、视频

                    //获取文件名
                    var doc = document;
                    if (!that.hasFormData && !(doc = _$("file_up").contentDocument)) {
                        doc = document.frames["file_up"].document;
                    }
                    var uploadInput = doc.getElementById('uploadInput');
                    var file = uploadInput.value || uploadInput.getAttribute('value');
                    if (!file) {
                        console.log('no file to send', file);
                        return;
                    }
                    if(uploadInput.files){//支持file 列表的 那么就必须有内容
                        if (!uploadInput.files[0] || !uploadInput.files[0].size) {
                            console.log('no file to send', file);
                            return;
                        }
                        if(uploadInput.files[0].name){
                            file = uploadInput.files[0].name
                        }
                    }
                    fileName = file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");  //正则表达式获取文件名

                    if (that.hasFormData) {
                        try {
                            oData = new FormData();
                            //增加表单数据
                            for (var key in params) {
                                if (key == 'Content-Disposition' || key == 'x:filename') {
                                    params[key] = fileName;
                                }
                                oData.append(key, params[key]);
                            }
                            //阿里云希望file在表单最后
                            oData.append('file', uploadInput.files[0], fileName);
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", url, true);
                            var hasResend = false;
                            xhr.onerror = xhr.ontimeout = xhr.onabort = function () {
                                !hasResend && that.resendFile(msg, id)
                                hasResend = true;
                            }
                            xhr.addEventListener("load", function (evt) {
                                if (xhr.status == 200 && xhr.responseText && (xhr.responseText == 1 || xhr.responseText.match(/\{\s*"errorCode"\s*:\s*1\s*}/))) {
                                     //error Code:1成功
                                    setTimeout(function () {
                                        document.forms.namedItem("uploadForm").reset();
                                    })
                                } else {
                                    !hasResend && that.resendFile(msg, id)
                                    hasResend = true;
                                }
                            });
                            xhr.send(oData);
                            if (!_$(id)) {
                                that.showMsg({
                                    id: id,
                                    f: "c"
                                }, '<div class="file-sending">' + lanRes.fileSending + '</div>');
                            }
                            that.sendingFileToken = id;
                        } catch (e) {
                            that.hasFormData = false;
                            that.hasInitFile = false;
                            that.addSendFile();
                            lastUploadFile = null;
                            //todo
                            console.log('变为iframe上传');
                        }
                        uploadInput = oData = null;
                    } else {
                        //这个用于保存正在上传文件 只能单个文件上传
                        var doc;
                        if (!(doc = _$("file_up").contentDocument)) {
                            doc = document.frames["file_up"].document;
                        }
                        var form = doc.getElementById("uploadForm");
                        for (var key in params) {
                            if (key == 'Content-Disposition' || key == 'x:filename') {
                                params[key] = fileName;
                            }
                            if (form[key]) {
                                form[key].value = params[key];
                            } else {
                                var input = doc.createElement('input');
                                input.name = key;
                                input.type = 'hidden';
                                input.value = params[key];
                                form.insertBefore(input,uploadInput);
                            }
                        }
                        $(form).attr("action", url);
                        form.submit();
                        that.showMsg({id: id, f: "c"}, '<div class="file-sending">' + lanRes.fileSending + '</div>');

                        setTimeout(function () {
                            that.sendingFileToken = id;
                            that.publish("_toggleEnableFile", false);
                        }, 10);
                    }
                    return;
                } else if (msg.fileType == 1) {
                    //下面是上传粘贴图片的处理 ft==1;
                } else if (msg.fileType == 5) {
                    //截图工具BASE64
                    that.fileToken = msg;
                    that.publish("_captureImg", null);
                } else if (msg.fileType == 6) {
                    //截图工具BASE64
                    that.fileToken = msg;
                    that.publish("_captureImgIE", null);
                }
            });
            this.subscribe("niuniuKey", function (evt, data) {
                if (data) {
                    var arr = data.split(',');
                    var today = new Date(), todayStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
                    today.setDate(today.getDate() + 1);
                    var tomorrowStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
                    that['niuniu' + todayStr] = arr[0];
                    that['niuniu' + tomorrowStr] = arr[1];
                }
            });

            var ua = navigator.userAgent.toLowerCase();
            var isBaidu = ua.indexOf('baidubrowser') > -1;
            var isAndroidMQQBrowser = ua.indexOf('mqqbrowser') > -1 && this.Device.OS == 'Android';

            //var is2345 = ua.indexOf('mb2345browser')>-1;
            var isUC = this.Browser.browser == 'uc';

         /*   if (isAndroidMQQBrowser || this.isIOS || this.Device.OS == 'iPhone' || this.Device.OS == 'iPAD') {
                if (!isBaidu) {
                    //ios改不用pre做富文本输入
                    this.changeToPreInput();
                } else {
                    // $("#inputPlaceholder").addClass("hide");
                    this.bindPlainTextEvent();
                }
            } else {
                this.changeToIframe();
            }*/

            if (!that.isMobile && !that.isInRobot) {
                that.changeToIframe();
            }else{
                this.bindPlainTextEvent();
            }
            if (isUC) {
                $("#footer").addClass("footer-absolute");
            }
            //发送文件
            var lastUploadFile;
            that.resetForm = function(timeout) {
                var form;
                if(that.hasFormData){

                    form = document.forms.namedItem("uploadForm").reset();
                } else {
                    //这个用于保存正在上传文件 只能单个文件上传
                    var doc = _$("file_up").contentDocument || document.frames["file_up"].document;
                    form = doc.getElementById("uploadForm");
                }
                setTimeout(function () {
                    form && form.reset()
                },timeout||10)

            }
            window.fLoad = function (doc) {
                if (!doc && !(doc = _$("file_up").contentDocument)) {
                    doc = document.frames["file_up"].document;
                }
                var uploadInput = doc.getElementById("uploadInput");
                if (view.dji) {
                    uploadInput.style.height = '62px';
                }
                uploadInput.onchange = function () {
                    //忙碌不可发消息
                    if (that.companyOff !== true && (!that.busyCanSend|| that.queryParams['autoChat'] =='0') && that.chatting!==true) {
                        $("#busyTipLine").removeClass('hide').show();
                        return;
                    }
                    var file = uploadInput.value || uploadInput.getAttribute('value');
                    if (!file) {
                        console.log('no file to send', file);
                        return;
                    }
                    var fileVal = file;
                    if(uploadInput.files){//支持file 列表的 那么就必须有内容
                        if (!uploadInput.files[0] || !uploadInput.files[0].size) {
                            console.log('no file to send', file);
                            return;
                        }
                        if(uploadInput.files[0].name){
                            file = uploadInput.files[0].name
                        }
                    }
                    var fileExt = file.replace(/.+\./, "");   //正则表达式获取后缀
                    var strFileName = file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");  //正则表达式获取文件名，不带后缀
                    that.sendingTitle = strFileName + '.' + fileExt + lanRes.fileSendWait;
                    if (fileExt && that.uploadFileType.indexOf(fileExt.toLowerCase()) == -1) {
                        that.showDialog({tip: 'ERROR: ' + lanRes.unsupportFileType + '。</br>' + lanRes.supportFileType + ': ' + that.uploadFileType,
                        cancel:false});
                        that.resetForm();
                        return;
                    }
                    var l = that.getFileSize(uploadInput);
                    if (l > that.uploadFileSize) {
                        that.showDialog({tip: lanRes.fileSizeOut + (that.uploadFileSize / 1024 / 1024) + 'M',cancel:false});
                        that.resetForm();
                        return;
                    }
                    var fileType = 2;
                    if (window.SDK) {
                        fileType = $(uploadInput).attr('filetype') || 2
                    }
                    function initSend() {
                        lastUploadFile = fileVal;
                        that.publish("sendVisitorEvent", {
                            et: 123,
                            ssl: that.needHttps ? 1 : undefined,
                            uploadServiceType:that.uploadServiceType,
                            ft: fileType//发送文件
                        });
                    }
                    if(fileVal == lastUploadFile){
                        that.showDialog({
                            tip: lanRes.uploadSameFile,
                            ok:initSend,
                            cancel:that.resetForm
                        })
                    }else{
                        initSend();
                    }

                    view.hideMenus && view.hideMenus(0, false);
                }
                uploadInput.onclick = function () {
                    view.hideMenus();
                    if (that.sendingFileToken) {
                        // alert(that.sendingTitle);
                    }
                }
            }
            that.addSendFile();
            that.emojitimer = setTimeout(function () {
                try {
                    that.loadEmoji();
                } catch (e) {
                    //alert(e.message)
                }
            }, 100);
            this.subscribe("getErr", function (evt, msg) {
                var token = msg.reqInfo;
                var m = token && _$(token);
                switch (msg.code) {
                    case 16:
                        $(".file-sending", m).html(lanRes.tooLargeUploadFail);
                        break;
                    case 17:
                        $(".file-sending", m).html(lanRes.unsupportFileType);
                        break;
                    case 18:
                        $(".file-sending", m).html(lanRes.unkownErrorUpload);
                        break;
                    default:
                        $(".file-sending", m).html(lanRes.unkownErrorUpload);
                        break;
                }
                if (msg.code == 16 || msg.code == 17 || msg.code == 18) {
                    //文件太大、不支持的文件类型、上传文件错误
                    that.addSendFile();
                }
            });

            //显示本次对话的记录
            var doubuleList = false;//防止刷新页面收到两次一样的消息
            this.subscribe("getHistory", function (eventtype, msg) {
                that.talkId = msg.talkId;
                that.hasGetHistory = true;
                if(doubuleList){
                    return;
                }
                doubuleList = true;
                setTimeout(function () {
                    doubuleList = false;
                },1000);
                //只加载一次。可能在服务器重启、访客端重连 等不稳定的情况会出现多次874历史记录消息。
                //that.unSubscribe("getHistory");
                //检查是否本地已经有消息历史记录 不可行，因为在跨设备的情况下，可能历史记录到达前 已经收到了新的消息存入了本地
                var list = msg.chatDetailList;
                var last = 0;
                that.robotFeedbackTemp = {};

                function needTime(time) {
                    if (!last || (time - last > 60000)) {
                        last = time;
                        return true;
                    }
                    return false
                }

                if (that.isArray(list)) {
                    var newWindowChat = false, fisrtHis = 0;
                    if (!that.lastMsgTM) {
                        //多窗口 或者手机PC同步窗口。这个也有可能是当前窗口只有访客发送消息没有，没有客服消息
                        newWindowChat = true;
                    }
                    //清空  内部广告没了
                    var listMsg = _$("list_msg");
                    var listChild = listMsg.childNodes, node,len = listChild.length;
                    for (var j = 0; j < len; j++) {
                        node = listChild[j];
                        if (node.nodeType == 1 && $(listChild[j]).hasClass('innerAD')) {
                            node = node.cloneNode(true);
                            break;
                        }
                    }
                    listMsg.innerHTML = '';
                    if (j < len) {
                        listMsg.appendChild(node);
                    }
                    that.sendMsgNum = 0;//重新计算访客发送消息条数
                    for (var i = 0; i < list.length; i++) {
                        var it = list[i] ,tempItem = it ;
                        if (it.dataType == 315 && it.data) {
                            it = JSON.parse(it.data);
                            if (it.mt == 864 && that.isInRobot && tempItem.feedbackResult) {
                                //feedbackResult 0未评估 1已解决 2未解决
                                //机器人历史记录中的反馈在问题中，缓存起来12001中使用
                                that.robotFeedbackTemp[tempItem.id] = { feedbackResult: tempItem.feedbackResult, feedbackSubitem: tempItem.feedbackSubitem };
                            }else{
                                it.relateId = tempItem.relateId || it.relateId;
                            }
                        }
                        if (it.mt > 1000 && it.mt != '10001'&&it.mt != '10010' && it.mt != '10011' && it.mt != '12001') continue;
                        // 没有显示过的消息才展示
                        //非访客消息没有展示过可根据页面元素，或者上次消息时间戳后面的消息

                        //if ((it.mt != 864 && it.mt != 865 && it.mt != 866 && ($("#" + "msg" + it.tm).length == 0))
                     /*   if (($("#" + "msg" + it.tm).length == 0)
                            /!*&& (newWindowChat || fisrtHis || (that.lastMsgTM < it.tm))*!/) {//todo loadhist
                            if (!newWindowChat && !fisrtHis && it.mt == 864 && (it.tm - that.lastMsgTM < 1000)) {
                                //如果第一条消息是访客的，很有可能是重连前已经显示过了的
                                continue;
                            }
                            //作为第一次展示的消息时间戳，之后的消息就不用判断可以展示了
                            if (!fisrtHis) {
                                fisrtHis = it.tm;
                            }*/
                     //已经显示过了
                         if ($("#" + "msg" + it.tm).results.length>0){
                             //TODO 待检验有木有问题-- 删了重新显示、为了保证内页广告的位置
                             $("#" + "msg" + it.tm).remove();
                         }
                            that.lastMsgTM = it.tm;
                            it.notEnd = true;
                        if (it.mt == 864) {//计算访客发送消息条数
                            that.publish("_addSendMsgNum");//增加计算访客发消息条数
                        }
                            if(it.mt=='10001'){
                                //转接消息
                                if (that.currentStaffMap[it.toStaffId]) {
                                    that.publish("getSysMsg", {
                                        talkId: msg.talkId,
                                        tm: msg.tm,
                                        mt: '10001',
                                        staffId: it.toStaffId,
                                        staffName: that.currentStaffMap[it.toStaffId].staffName//取昵称
                                    });
                                }
                                continue;
                            }else if(it.mt=='10011'){
                                that.publish("receiveVisEvt",it);
                                continue;
                            }else if (it.mt == 865 || it.mt == 641) {
                                that.publish("getMsgImg", it);
                                continue;
                            } else if (it.mt == 647 || it.mt == '10010' || it.mt == 605) {
                                if(it.type==8){//忽略排队语
                                    continue;
                                }
                                that.publish("getSysMsg", it);
                                continue;
                            } else if (it.mt == 866 || it.mt == 642) {
                                that.publish("getMsgFile", it);
                                continue;
                            }else if(it.mt==680){
                                that.publish("receiveURL", it);
                                continue;
                            }else if(it.mt ==640){
                                that.publish("getMsg", it);
                                continue;
                            }else if(it.mt == 655){
                                that.publish("getLeaveMsg", it);
                                continue;
                            } else if (it.mt == 890) { //预约确认表
                                if (it.templateInfoList[0].type == 1 || it.templateInfoList[0].type == 3) {
                                    it.content = that.getBookComfirm(it.templateInfoList);
                                    it.m = 3;
                                } else {
                                    it.content = that.showInfoTip(lanRes.receiveBookForm, undefined, undefined, true,it.talkId,it.tm,true)
                                    it.m = 4;
                                }
                            }else if(it.mt == '12001'){
                                that.publish("getMsgRobot", it);
                            }
                            var item = {
                                t: needTime(it.tm) ? (new Date(it.tm).format("hh:mm")) : undefined,
                                tm: it.tm,
                                mt: it.mt,
                                c: it.content,
                                ff: that.isInRobot?'r':undefined,//是否是机器人对话内的消息
                                f: (it.mt == 864) ? "c" : (it.mt == 890) ? 'x' : "s",
                                m: it.m || 0,//文本消息
                                id: "msg" + it.tm,
                                talkId:msg.talkId,
                                notEnd: true
                            };
                            //设置当前消息客服的名字
                            if(that.currentStaffMap[it.staffId+'']){
                                item.staffImg = that.currentStaffMap[it.staffId+''].staffImg;
                                item.staffName = that.currentStaffMap[it.staffId+''].staffName;
                            }
                            //todo 如果中途有转接 则会有问题 只会显示最后一个客服的
                            that.showMsg(item);
                            delete item.id;
                            if (item.m == 3) {
                                item.c = it.templateInfoList;
                            }
                            delete item.notEnd;
                            that.pushHistory(item);
                        /*} else {
                            continue;
                        }*/
                    }
                    setTimeout(function () {
                        view.scrollToBottom();
                        if (that.isMobile) {
                            $("#footer").removeClass('hide');
                        }
                        that.wait874List = false;
                        that.publish('removeLoading');
                    }, 500);
                    if (that.isMobile) {
                        //手机上，切换了详情后，底部栏莫名消失。隐藏重新显示OK
                        $("#footer").addClass('hide');
                    }
                    if(view.miniShow){
                        var mid = $.cookie('ECHAT_' + view.chat.companyId + "_" + view.chat.visitorId + "_mid");
                        mid && $.cookie('ECHAT_' + view.chat.companyId + "_" + window.chatVisitorId + "_mid_read", mid);
                    }
                }else{
                    that.wait874List = false;
                    that.publish('removeLoading');
                }
            });
            this.subscribe("getSysMsg", function (eventType, msg) {
                /*type 1：等待提示语
                 2：欢迎语
                 3：结束语
                 WAITMSG = 1;
                 WELCOMEMSG = 2;
                 CHATENDMSG = 3;
                 TIMEOUTMSG = 4;
                 AUTOREPLY = 5;
                 SYSTEM = 6;
                 OFFLINEMSG = 7;
                 QUEUEMSG = 8;
                 QUEUECONNECTMSG = 9;
                 ROBOTMSG = 10;*/
                if (!that.chatting && msg.type == 2) {
                    //console.log("对话未开始，忽略欢迎语");
                    return;
                }

                var c;
                if(msg.mt=='10001'){
                    //对话转接消息单独处理
                    c = (msg.staffName || lanRes.serviceStaff) +' '+ lanRes.transferStaff;
                    that.showSysTip(c, msg.tm, undefined, msg.notStore,msg.talkId);
                    msg.c = '10001';
                    msg.f = 'x';
                    if (!msg.notStore) {
                        that.pushHistory(msg);
                        that.publish('__newSysMsg',{m:0,c:c});
                    }
                    return
                }
                //设置TALKID;会重复设置,目前先这样 排队的时候会用到
                if (!msg.notStore && msg.talkId && !that.talkId) {//未读消息暂时没有系统消息 所以这里应该永远都是当前回话的  排除加载历史的系统消息
                    that.talkId = msg.talkId;
                    if (!that.hasGetHistory && that.companyOff !== true) {//todo robot no in robot
                       /* that.publish("visitorCommonEvent", {
                            et: 121,
                            content: "history"
                        });*/
                    }
                }

                //todo
                if (msg.type == 10) {
                    if(msg.type == 10){
                        that.talkId = msg.talkId;
                        that.robotTalkId = msg.talkId;
                    }
                    if(msg.from == 'r'){
                        // debugger
                    }

                    if ((msg.type == 10)/*&&that.robotCommonQue*/) {
                        //机器人欢迎语,需和常见问题一起显示
                        this.publish("_showCommonQue", msg);
                    } else {
                        /*that._getMsg.call(this,
                            {
                                tm: msg.tm,
                                mt: 647,
                                ff: 'r',
                                staffImg: that.staffImg,
                                staffName: that.staffName,
                                notStore: msg.from == 'r',
                                c: msg.content
                            },
                            0, msg.content, 'r');*/
                        that._getMsg.call(this,{tm: msg.tm, mt: 12001,ff:'r', staffImg: that.staffImg, staffName: that.staffName,content:msg.content},
                        0, msg.content, 'r');
                    }
                    return;
                }
                //没有内容不展示
                c = msg.content || msg.c;
                if (!c) {
                    return;
                }
                var patt1 = /<img\b.*?(?:\>|\/>)/gi;
                c = c.replace(patt1,function(img){
                    var patt2 = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i;
                    var src = patt2.exec(img)[1];
                    var data = {
                        smallImg: src,
                        bigImg: src,
                        sourceImg: src,
                        fileName: '预览'
                    }
                    var showImg = view.showMsgImg ? view.showMsgImg(data) : 
                    ('<img '+(!data.notEnd?'onload="javascript:view.scrollToBottom()"':'')+' id="img' + (data.tm || new Date().getTime()) 
                    + '" attname="' + (data.fileName) 
                    + '" bigimg="' + (data.bigImg||data.sourceImg||'')
                    + '" src="' + data.smallImg
                    + '" source="' + (data.sourceImg||"")
                    + '" sw="' + (data.sourceWidth||"")
                    + '" sh="' + (data.sourceHeight||"")
                    + '" class="msg-img"/>');
                    return showImg;
                })
                //客服发送来的 也替换掉&nbsp;避免切词问题
                var content = c.replace(/&nbsp;([^&\s])/g,' $1');
                if (msg.type == 5 || msg.f == 's') {//ws或本地存储
                    //个人欢迎语 使用客服形式展示
                    that._getMsg.call(this, msg, 0, content);
                    return;
                }
                that.showInfoTip(c, "msg" + msg.tm,undefined,undefined,msg.talkId,msg.tm,msg.notEnd);
                if (!msg.notStore) {
                    var item = {
                        tm: msg.tm,//时间戳
                        f: "sys",//TODO 系统信息 暂时写为来自客服 由s变为sys
                        mt: msg.mt,
                        m: 0,//0 文本 1文件 2图片 3预约确认
                        c: c
                    };
                    item.talkId = msg.talkId || that.talkId;
                    that.pushHistory(item);
                    if (item.c) {
                        that.handleNewMsgMid(msg.mid, item);

                    }
                    msg && (!that.isMobile) && view.setDocumentTitle && view.setDocumentTitle('s');//系统消息也要tishi
                    if (msg.isFoward === false || !window.SDK) {//sdk未发送过
                        that.publish('_newMsg', {from: 's'});
                        that.publish('__newSysMsg', {m: 0, c: c});
                    }
                }
            });
            that.hasWaitingStatus = false;
            this.subscribe("getPosMsg", function (eventType, msg) {
                that.companyOff = false;
                
                $("#positionInfo").remove();
                if(that.queueTxt) {
                    var str = that.queueTxt.replace('${waitcount}', msg.position);
                    that.showInfoTip(str, "positionInfo", 'warn', undefined, msg.talkId, msg.tm);
                }
                if (!that.hasWaitingStatus) {
                    that.publish('__chatStatus', 'waiting');
                    $.cookie('ECHAT_' + that.companyId + "_" + window.chatVisitorId + "_chatStatus",1,{path:'/'});
                    that.hasWaitingStatus = true;
                }
                that.publish('__chatQueue', msg.position);
                that.initQcode();//留言信息收集、提交时客服在线 要显示二维码
            });
            //客服邀请评价
            this.subscribe("inviteSatisfy", function () {
                that.showSatisfy(2);
            })
            this.subscribe("staffInfo", function (eventType, data) {
                //使用客服详细信息展示
                that.staffName = data.staffNickName || lanRes.serviceStaff;
                var msg = data.staffDetailInfo;
                if (msg && msg.staffHead) {
                    //传参数不设置默认
                    that.paramChat.staffPhoto = msg.staffHead;
                }
                that.staffImg = msg.staffHead || that.defaultStaffImg;
                view.initServiceInfo && view.initServiceInfo(that,msg);
                //todo 废弃历史记录一个头像
                msg && that.saveHistoryStaff(that.staffImg, that.staffName);
                //拿到客服信息 左右对话开始后刷新广告的出发点
                view.startChatRefreshAD && view.startChatRefreshAD();
                //设置客服MAP
                that.currentStaffMap = {};
                var staffList = data.staffDetailInfoMsgList;
                if(staffList&&staffList.length>0){
                    for (var i = 0; i < staffList.length; i++) {
                        staffList[i].staffName = staffList[i].staffNickName ||lanRes.serviceStaff;
                        staffList[i].staffImg = staffList[i].staffHead || that.defaultStaffImg;
                        that.currentStaffMap[staffList[i].staffId] = staffList[i];
                    }
                }
                /**
                 * recordId = chatType_recordId
                 chatType:
                 1:人工对话
                 3:留言
                 5:机器人对话
                 */
                that.paramChat.staffPhone = msg.staffPhone || "";
                that.publish("__chatStaffInfo",{
                    // userSetStaffPhoto: that.paramChat.staffPhoto,
                    staffId: that.paramChat.staffId,
                    staffNickName: that.paramChat.staffName || "",
                    staffPhone: that.paramChat.staffPhone,
                    staffHead: that.staffImg,//有默认值
                    staffInfo: msg.staffInfo || "",//不长期保存
                    recordId: (that.isInRobot ? '5_' : '1_') + that.talkId
                })
            });
            //开始对话
            this.subscribe("startChat", this.startChat);
            //后端传来对话结束
            this.subscribe("chatEnded", function (eventType, msg) {
                var oldChatting = that.chatting;
                that.chatting = false;
                that.isInRobot = 0;//机器人对话结束了
                that.hasGetHistory = false;//todo
                that.companyOff = undefined;
                that.hasWaitingStatus = false;//结束后继续对话又可进入等待状态
                that.endChatEvent();
                this.unSubscribe("_sendMsg");
                $(".btn-close").addClass("hide");
                $(".btn-qcode").addClass("hide");
                $(".menu-satisfy").addClass("hide");
                $(".menu-capture").addClass('hide');
                $(".menu-file").addClass("hide");
                $("#robotToStaff").addClass('hide').hide();

                if(that.leaveAndClose){
                    $("#leave").addClass("hide");
                    $("#container").removeClass('hide');
                    $("#chat").removeClass('hide');
                    $("#footer").removeClass('hide');
                    $('.leave-entry-foot').addClass("hide");
                    $("#container_leave").addClass("hide");
                    that.leaveAndClose = false;
                    that.showInfoTip('<div class="btn-restart" id="restartChat">' + lanRes.toContinueChat + '</div>',undefined,undefined,undefined,msg.talkId,msg.tm);
                }
                //未读消息拦截后需要再次发送图文消息
                if (msg.mt == '10009' && msg.type == 4) {
                    that.paramChat.visEvt = that.initVisEvt;
                    //拦截后访客再接入对话 应该自动接通了
                    delete that.queryParams.autoPop;
                    delete that.queryParams.autoChat;
                }

                $.cookie('ECHAT_' + that.companyId + "_" + window.chatVisitorId + "_chatStatus",0,{path:'/'});
                if(msg.justConnect){
                    return;
                }
                // msg.content && that.showInfoTip(msg.content,undefined,undefined,undefined,msg.talkId,msg.tm);
                msg.content && that.publish('getSysMsg', msg);
                that.showInfoTip('<div class="btn-restart" id="restartChat">' + lanRes.toContinueChat + '</div>',undefined,undefined,undefined,msg.talkId,msg.tm);
                that.visitorClose = msg.closeReason == 1 || (that.visitorClose && msg.closeReason == 0 );//兼容排队或未知

                var hasSatisfy = oldChatting===true && that.showSatisfy(1);//排队等不推送评价  只有客服开始过接待才推送
                that.postMessage(3);
                if(!hasSatisfy){
                    //无评价 关闭窗口
                    this.publish("_closeWin");
                };
                if (!msg.talkId) {
                    msg.talkId = that.talkId;
                }
                that.handleSessionMsg(msg);
                //置空评价有问题 注册对话里面去重置
                // that.talkId = "";
                /**
                 * 0 未知
                 * 1: '访客结束对话',
                 2: '客服结束对话',
                 3: '访客超时',
                 4: '客服超时',
                 5: '客服退出',
                 6: '客服系统关闭',
                 7: '转接结束',
                 8: '访客长时间未回复',
                 9: '客服处理离线对话结束',
                 10: '访客再次发起消息，离线对话结束',
                 */
                that.publish('__chatStatus', 'end-' + (msg.closeReason || '0') + '-' + (hasSatisfy ? '1' : '0'));
            });
            //关闭对话窗口
            this.subscribe("_closeWin",function () {
                if(window.SDK){
                    return;
                }
                if(!that.visitorClose){
                    return
                }
                that.leaveAndClose = false;
                if (!(window.top == self && window.EchatJsBridge)) {
                    if (view.windowType == 2) {
                        that.postMessage("hideMBmini");
                        // that.publish("__visitorHide");
                        // that.publish('__visitorClose');
                    } else {
                        var useragent = navigator.userAgent;
                        if (view.windowType == 1) {//改为只有PC大窗口关闭 手机一律不关
                            //非微信 非QQ内置 也同时杀掉了QQ浏览器
                            // that.publish('__visitorClose');
                            try {
                                window.opener = null;
                                window.open("", "_self").close();
                                window.close();
                            } catch (e) {
                                try {
                                    window.close();
                                } catch (e) {

                                }
                            }
                        }
                    }
                }
            });

            this.subscribe("entryCallback", function (eventType, msg) {
                if (msg.success == true) {
                    //验证通过
                    $("#entry").hide();
                    $("#verify").hide();
                    $("#mask").hide();
                    $("body").removeClass('entry');
                    that.hasEntryOrCode = false;
                    //信息手机反馈670 才发103 才存参数
                    if(msg.mt){
                        that.publish("toRegisterChat");
                        //本地COOKIE存储信息手机
                        var param = that.entryParam;
                        if (param) {
                            delete param.et;
                            delete param.captcha;
                            var oldParam = $.store('ECHAT_' + that.companyId + "_ENTRY_HIS");
                            oldParam = oldParam ? JSON.parse(oldParam) : {};
                            param = $.extend(oldParam, param);
                            $.store('ECHAT_' + that.companyId + "_ENTRY_HIS", JSON.stringify(param));
                        }
                    }
                } else {
                    //刷新验证码
                    that.publish("refreshVerify", {status: 1})
                }
            });

            //收到未读消息
            this.subscribe("receiveUnread", function (eventType, msg) {
                // that.talkId = msg.data.talkId;
                that.unreadMsg ? that.unreadMsg.push(msg) : (that.unreadMsg = [msg]);
                var list = msg.data.chatDetailList, len = list.length, html = '', content = '',title,data,cls,target;
                if (len) {
                    target = 'downFile';
                    if(that.isIOS){
                        target = '_blank';
                    }
                    for (var i = 0; i < len; i++) {
                        data = list[i];
                        cls='';
                        //文本
                        if(list[i].mt=='640'||list[i].mt=='675') {
                            content = list[i].content;
                        }else if(list[i].mt=='641'){
                            //图片
                            if (that.needHttps) {
                                //先替换七牛域名
                                if (that.qiniuDomain && that.qiniuHttpsDomain) {
                                    data.bigImg = data.bigImg.replace(that.qiniuDomain, that.qiniuHttpsDomain);
                                    data.smallImg = data.smallImg.replace(that.qiniuDomain, that.qiniuHttpsDomain);
                                }
                                data.bigImg = data.bigImg.replace(/^http:/, that.needHttps);
                                data.smallImg = data.smallImg.replace(/^http:/, that.needHttps);

                            }
                            content =  view.showMsgImg ? view.showMsgImg(data) :
                                ('<img attname="'
                                + (data.fileName) + '" bigimg="'
                                + (data.bigImg||data.sourceImg||'') + '" src="'
                                + data.smallImg
                                + '" class="msg-img"/>');
                        }else if(list[i].mt=='642'){
                            //文件
                            cls='unread-file';
                            if (that.needHttps) {
                                //先替换七牛域名
                                if (that.qiniuDomain && that.qiniuHttpsDomain) {
                                    data.fileUrl = data.fileUrl.replace(that.qiniuDomain, that.qiniuHttpsDomain);
                                }
                                data.fileUrl = data.fileUrl.replace(/^http:/, that.needHttps);
                            }
                            //非七牛且非是oss，就是阿里云
                            content = '<div class="file-info"><div class="file-name">'+ data.fileName
                                + '</div><a class="file-size file-link" href="'
                                + data.fileUrl + (data.fileUrl && (data.fileUrl.match(/http[s]?:\/\/[^\/]*(qn|qiniu)[^\/]*\//i)||!data.fileUrl.match(/http[s]?:\/\/[^\/]*(oss)[^\/]*\//i))  ? ((data.fileUrl.indexOf('?')==-1?'?':'&') + 'attname=' + data.fileName):'' )
                                + '" target="'+target+'"><span class="unread-size">'
                            + (parseInt(data.fileSize / 1024) + 1)
                            + 'KB</span><span class="unread-download color0">'+lanRes.download+'</span></a></div><div class="file-icon">&nbsp;</div>';
                        }else if(list[i].mt=='10012'){
                            //todo
                        }else if(list[i].mt==680){
                            var url = list[i].pushUrlDetail.url,classBlank = '';
                            if (view.chat.needHttps && url.match(/^http:/i)) {
                                classBlank = ' push-blank'
                            }
                            if(view.pushURLParam){
                                var arr = url.split("#");
                                url = arr[0]
                                    + (arr[0].indexOf("?") == -1 ? "?" : "&" )
                                    + view.pushURLParam
                                    + (arr[1] ? ('#' + arr[1]) : '');
                            }
                             content = '<a class="push-url clearfix'+classBlank+'" target="info_frame3" href="' + url + '">' +
                                 '<div class="push-icon bg1"></div>' +
                                 '<div class="push-content">'
                                 + '<div class="push-name">'+list[i].pushUrlDetail.urlName+" "+'</div>'
                                 + '<div class="push-url-link">'+list[i].pushUrlDetail.url+'</div>' +
                                 '</div></a>';
                        }
                        //客服访客发送的文本消息都需过滤表情///*客服*/消息过滤电话邮箱
                        content = list[i].mt == 680 ? content : that.filterEmailPhoneLink(content);
                        content = that.filterEmo(content).replace(/\n/g, "</br>");
                        if (that.needHttps) {
                            data.staffImg && (data.staffImg = data.staffImg.replace(/^http:/, that.needHttps));
                        }
                        html += '<li class="clearfix list-unread-li '+cls+'"><div class="avatar-icon fl staff-icons"><img class="avatar-icon-img" src="'
                            + (data.staffImg||that.defaultStaffImg) + '"></div><div class="fl unread-staff-name">'
                            + (data.staffNickName||lanRes.serviceStaff)+"："
                            + '</div><div class="fl unread-msg">'
                            + content + '</div></li>';
                    }
                    var msgLength  = 0;
                    for (var k = 0; k < that.unreadMsg.length; k++) {
                        msgLength += that.unreadMsg[k].data.chatDetailList.length;
                    }
                    $("#list_unread").append(html);
                    view.showUnread&&view.showUnread(msgLength);
                }
            });
            $("#unread_close").on('click',function () {
                view.removeUnreadMsg&&view.removeUnreadMsg();
            });

            $("#leave_tip").on("click", function () {
                that.tipTimer && clearTimeout(that.tipTimer);
                $(this).addClass("tiphide");
            });
            this.changeDocTitle = (function () {
                if ("title" in document) {
                    return function (title) {
                        document.title = title;
                    }
                } else {
                    var t = _$s("title");
                    var title;
                    if (t && t[0]) {
                        title = t[0];
                    } else {
                        title = document.createElement("title");
                        _$s("head")[0].appendChild(title);
                    }
                    if ('textContent' in title) {
                        return function (title) {
                            _$s("title")[0].textContent = title;
                        }
                    } else if ('innerText' in title) {
                        return function (title) {
                            _$s("title")[0].innerText = title;
                        }
                    } else {
                        return function () {
                            //can not
                        }
                    }
                }
            })(document);

        },
        plainTextToSendMsg:function(text){
            var that = this;
            charMap = {'<':'&lt;','>':'&gt;','"':'&quot;'}
            text = text.replace(/\[#([^#]+)#\]/g,function (label,emo) {
                return '[#'+(that.lanEmo[emo]||emo)+'#]';
            }).replace(/[<">]/g,function(char){
                return charMap[char];
            })
            return text;
        },
        openVisitorSend: function () {
            //发送图片和截图 会在获取TOKEN时断掉
            var that = this;
            this.unSubscribe('_sendMsg');
            this.subscribe("_sendMsg", function (eventType,content) {
                if (!that.isInRobot && (that.companyOff !== true && (!that.busyCanSend&& that.queryParams['autoChat'] !='0') && that.chatting!==true)) {
                    //此处只能是忙碌不可发送消息
                    $("#busyTipLine").removeClass('hide').show();
                    return;
                }
                var msg = content || that.getInput(true);
                if (!msg) {
                    //没有消息提示空
                    return;
                }
                if (that.plainText) {
                    //
                    msg = that.plainTextToSendMsg(msg);

                }
                var timeStamp = new Date().getTime();
                var id = "msg" + timeStamp;
                var needTime = that.checkHistoryTime(timeStamp);
                var item = {
                    t: needTime ? (new Date()).format("hh:mm") : undefined,
                    tm: timeStamp,//时间戳
                    mt: 864,
                    f: "c",//访客消息
                    m: 0,//消息模型 0文本
                    c: msg,
                    id: id//消息元素ID,方便显示状态和滚动
                };
                that.sendToServer(item);
                if(!content) {
                    that.lastText = null;
                    view.afterSend();
                }
                that.publish("_firstSendMsg", {c:msg});//放到后面会影响发送内容
                that.publish("_addSendMsgNum");//增加计算访客发消息条数

            });
        },
        postMessage: function (status) {
            if (view.windowType == 2 && window.top != window) {//PC 手机内页
                try {
                    //发送消息 并且限制接受的域名是打开内页的域名
                    //只推送打开的内页的域名
                    window.parent.postMessage(status, (this.queryParams['fromhost'] || '*'));
                    return true;
                } catch (e) {
                    console.log(e);
                }
            }
            return false;
        },
        getVisitorMessage: function () {
            //此功能暂不开发
            return;
            //仅在手机端监控访客是否在当前页面
        },
        initDialog:function () {
            var that = this;
            if(that.hasInitDialog){
                return;
            }else{
                that.hasInitDialog = true;
            }
            $("body").on('click','.dialog-close',function () {
                $('.dialog').remove();
                that.publish('_dialogCanel');
            }).on('click','.img-close',function () {
                $('.dialog').remove();
                that.publish('_dialogCanel');
            }).on('click','.dialog-cancel',function () {
                $('.dialog').remove();
                that.publish('_dialogCanel');
            }).on('click','.dialog-ok',function () {
                $('.dialog').remove();
                that.publish('_dialogOk');
            })
        },
        showDialog:function (op){
            $(".dialog").remove();
            var that = this;
            that.initDialog();
            var tip =op.tip ;
            var html = '<div class="dialog dialog-hide"><div class="dialog-close"><i class="img-close"></i></div>'
                + '<div class="dialog-title">' + lanRes.tip + '</div><div class="dialog-content">' + tip + '</div>'
                + '<div class="dialog-btns"><a class="dialog-btn dialog-ok bg0"><div class="bg0 fade-div"></div>'
                + '<span>' + lanRes.okay + '</span></a>'+(op.cancel!==false?('<a class="dialog-btn dialog-cancel bg0 has-fade">'
                + '<div class="bg0 fade-div"></div><span>' + lanRes.cancel + '</span></a>'):'')+'</div></div>';
            $('body').append(html);
            function hide(e) {
                var dialog = $(".dialog").results;
                var ok = $('.dialog-ok').results[0];
                if(dialog.length==0){
                    $('body').off(that.isMobile ? 'tap' : 'click', hide);
                } else {
                        //IE6 click 需延迟
                    setTimeout(function(){
                        if (ok == e.target || $.fn.contains(ok, e.target)) {
                            that.publish('_dialogOk');
                        } else if (!$.fn.contains(dialog[0], e.target)) {
                            that.publish('_dialogCanel');
                        }
                        $('.dialog').remove();
                    },50)
                }
            }

            that.unSubscribe(['_dialogOk','_dialogCanel']);
            that.subscribe('_dialogOk', function () {
                $('body').off(that.isMobile?'tap':'click',hide);
                op.ok && op.ok();
                that.unSubscribe(['_dialogOk','_dialogCanel']);
            });
            that.subscribe('_dialogCanel', function () {
                $('body').off(that.isMobile?'tap':'click',hide);
                op.cancel && op.cancel();
                that.unSubscribe(['_dialogOk','_dialogCanel']);
            });
            setTimeout(function () {
                $('body').on(that.isMobile?'tap':'click',hide);
                $('.dialog').removeClass("dialog-hide");
            },10)
        },
        /*显示信息收集*/
        toShowEntry: function (configData, msg) {
            var that = this, rId = 'entry';
            var list = (that.companyOff === true ? configData.offlineVisitorInfoConfiguration : configData.visitorInfoConfiguration)||[], len = list&&list.length||0;
            var allInOneLine = configData.captChaEnable != 1&&updateInOneline(list);
            if (that.needHttps && configData.visitorInfoBackImg){
                configData.visitorInfoBackImg = configData.visitorInfoBackImg.replace(/^http:/, that.needHttps);
            }
            $("#entry").html('')
            $("#leave").html('')
            //获取COOKIE中的值
            var hisParam = decodeURIComponent($.store('ECHAT_' + that.companyId + "_ENTRY_HIS") || "{}");
            if (that.companyOff === true && configData.offlineStartType == '0') {
                // if (!len)return false;
                //留言平铺模式
                that.leaveAndClose = true;//仅留言,发送完毕就关闭
                if (view.showLeavePage) {
                    view.showLeavePage(configData);
                } else {
                    var template = '<div class="leave-entry-title">{{offlineWelcomeWord}}</div> <div class="leave-entry-content"><form id="entryForm">{{temp.items}}</form><div class="leave-entry-item leave-entry-one-line"><div><label class="leave-entry-label" style="vertical-align: top;color:{{offlineVisitorInfoLabelColor}}"> <span class="req-span" style="visibility:visible">*</span><span class="name-span">{{lanRes.leaveWordContent}}</span></label><div class="leave-entry-inputs"><textarea class="leave-entry-text req" lb="{{lanRes.leaveWordContent}}" style="border-color:{{offlineVisitorInfoInputColor}};color:{{offlineVisitorInfoInputColor}}"></textarea></div></div></div>{{temp.code}} </div>';
                    var code = '<div class="leave-entry-item leave-entry-one-line entry-code"><div><label class="leave-entry-label" style="color:{{offlineVisitorInfoLabelColor}}"> <span class="req-span">*</span><span class="name-span" >{{lanRes.validateCode}}</span></label> <input class="book-ipt" id="verify_input" placeholder="{{lanRes.inputCode}}" style="border-color:{{offlineVisitorInfoInputColor}};color:{{offlineVisitorInfoInputColor}}"/> <img class="img-code" alt="'
                        + lanRes.validateCode + '" id="verify_img" src="' + that.dataHost + '/chatCaptCha.jpg?captChatToken='+ msg.captChaToken
                        + '"/><span class="color0 cursor-p" id="verify_change">{{lanRes.nextPic}}</span></div></div>'

                    var itemHtml = '<div class="leave-entry-item leave-entry-half {{item.online}} {{item.req}}"><div><label class="leave-entry-label" style="color:{{offlineVisitorInfoLabelColor}}"><span class="req-span">*</span><span class="name-span">{{item.configDesc}}</span></label><div class="leave-entry-inputs">';
                    var itemsHtml = [], disableLine = 0;
                    for (var i = 0; i < len; i++) {
                        var item = list[i], cls = item.configRequired == 1 ? " req " : "";
                        if ((item.configWebVipVisitor == '1' && that.isVip) || (item.configWebVisitor == '1' && !that.isVip)) {
                            //配置可显示
                        } else {
                            //不可显示
                            list[i].disabled = true;
                            continue;
                        }
                        var cName = item.configName, hisValue = hisParam[cName], type = window.ltIE10 ? "text" : (cName == "birthday" ? "date" : cName == "age" ? "number" : "text");
                        var itemH = itemHtml + (cName == "gender" ? (
                                '&nbsp;&nbsp;<input type="radio" class="book-radio {{item.req}}" name="gender" value="1" ' + (hisValue == 1 ? 'checked="checked"' : '') + ' lb="{{item.configDesc}}"/><span class="radio-span" style="color:{{offlineVisitorInfoInputColor}}">{{lanRes.male}}</span> '
                                + '<input type="radio" class="book-radio ' + cls + '" name="gender" value="2" ' + (hisValue == 2 ? 'checked="checked"' : '') + ' lb="{{item.configDesc}}"/><span class="radio-span" style="color:{{offlineVisitorInfoInputColor}}">{{lanRes.female}}</span>'
                            ) : cName == "maritalStatus" ? (
                                '&nbsp;&nbsp;<input type="radio" class="book-radio {{item.req}}" name="maritalStatus" value="1" ' + (hisValue == 1 ? 'checked="checked"' : '') + ' lb="{{item.configDesc}}"/><span class="radio-span" style="color:{{offlineVisitorInfoInputColor}}">{{lanRes.unmarried}}</span>' +
                                '<input type="radio" class="book-radio {{item.req}}" name="maritalStatus" value="2" ' + (hisValue == 2 ? 'checked="checked"' : '') + ' lb="{{item.configDesc}}"/><span class="radio-span" style="color:{{offlineVisitorInfoInputColor}}">{{lanRes.married}}</span>'
                            ) : '<input type="' + type + '" name="{{item.configName}}" value="' + (hisValue || '') + '" lb="{{item.configDesc}}" class="leave-entry-ipt {{item.req}}" style="border-color:{{offlineVisitorInfoInputColor}};color:{{offlineVisitorInfoInputColor}}"/>')
                            + '</div></div></div>';


                        itemsHtml.push(itemH.replace('{{item.online}}', item.configInline == 1 ? 'leave-entry-one-line' : '')
                            .replace(/\{\{item\.req\}\}/g, item.configRequired == 1 ? 'req' : '')
                            .replace(/\{\{item\.([a-zA-Z]+)}\}/g, function (match, sub1) {
                                return item[sub1] || '';
                            }));
                    }
                    template = template.replace('{{temp.code}}', configData.captChaEnable == 1 ? code : '')
                        .replace('{{temp.items}}', itemsHtml.length > 0 ? itemsHtml.join('') : '')
                        .replace(/\{\{([a-zA-Z]+)}\}/g, function (match, sub1) {
                            return configData[sub1] || '';
                        })
                        .replace(/\{\{lanRes\.([a-zA-Z]+)}\}/g, function (match, sub1) {
                            return lanRes[sub1] || '';
                        });

                    //防止单独验证码那边DOM干扰
                    $(".verify-change").attr('id', '');
                    $(".verify-img").attr('id', '');
                    $(".verify-ok").attr('id', '');
                    $(".verify-input").attr('id', '');

                    $("#leave").html(template).removeClass("hide");
                    that.publish("removeLoading");
                    if (!that.isMobile && view.windowType == 1 && !view.dji) {
                        $("#chat").addClass('hide');
                        // $(".btn-close").remove();
                        $(".btn-close").addClass('hide');
                        setTimeout(function () {
                            $(".btn-close").addClass('hide');
                        },100)
                    } else {
                        $("#container").addClass('hide');
                    }
                    $('.leave-entry-foot').removeClass("hide");
                    $("#container_leave").removeClass("hide");
                    $("#footer").addClass("hide");
                    setTimeout(function () {
                        $("#mask").hide();
                    },100)
                    // $(document).off();
                    view.toLeaveMessage && view.toLeaveMessage();
                    if (configData.captChaEnable == 1) {
                        that.toShowCode();
                    }
                    that.addEntryEvent(list, configData, '.leave-enter-btn');
                }
                return true;
            }
            configData = $.extend({},configData);
            if(that.companyOff === true){
                configData.welcomeWord = configData.offlineWelcomeWord
                configData.welcomeWordPos = configData.offlineWelcomeWordPos
                configData.entryCanClose = configData.offlineEntryCanClose
                configData.visitorInfoCloseImg = configData.offlineVisitorInfoCloseImg
                configData.visitorInfoClosePos = configData.offlineVisitorInfoClosePos
                configData.visitorInfoFormPos = configData.offlineVisitorInfoFormPos
                configData.visitorInfoBackImg = configData.offlineVisitorInfoBackImg
                configData.visitorInfoLabelColor = configData.offlineVisitorInfoLabelColor
                configData.visitorInfoInputColor = configData.offlineVisitorInfoInputColor
                configData.visitorInfoSubmitPos = configData.offlineVisitorInfoSubmitPos
                configData.visitorInfoSubmitTxt = configData.offlineVisitorInfoSubmitTxt
                configData.visitorInfoSubmitImg = configData.offlineVisitorInfoSubmitImg
            }
            if (view.staticPx2rem) {
                configData.welcomeWordPos = configData.welcomeWordPos && view.staticPx2rem(configData.welcomeWordPos)
                configData.visitorInfoClosePos = configData.visitorInfoClosePos && view.staticPx2rem(configData.visitorInfoClosePos)
                configData.visitorInfoFormPos = configData.visitorInfoFormPos && view.staticPx2rem(configData.visitorInfoFormPos)
                configData.visitorInfoSubmitPos = configData.visitorInfoSubmitPos && view.staticPx2rem(configData.visitorInfoSubmitPos)
            }
            var html = ' <div id="entryWrap" class="' + (allInOneLine == '1' ? 'book-all-line ' : '') + '" >'//400 / 260
                + (configData.entryCanClose==1 && configData.visitorInfoCloseImg ? ('<div id="cancelEntryBtn" style="' + configData.visitorInfoClosePos
                + '"><img src="' + configData.visitorInfoCloseImg + '" onload="imgLoadResizeSelf(this)" /></div>') : '')//(that.isMobile ? (onload = "this.style.width=this.naturalWidth/2+\'px\'") : '')
                + (configData.visitorInfoBackImg ? ('<div><img id="entryWrapImg" class="book-table-img hide" src="' + configData.visitorInfoBackImg + '" onload="imgLoadResize(this,-1)" /></div>') : '')
                + '<form id="entryForm" class="book-items" >'//380 10 / 220 20
                + '<div class="book-form-title" style="' + configData.welcomeWordPos + '">' + (configData.welcomeWord || '') + '</div>'
                + ' <div class="clearfix book-items-list" style="' + configData.visitorInfoFormPos + ';">';

            var showItems = 0, allLine = 0, nowLine = 0, disableLine = 0;
            hisParam = JSON.parse(hisParam);
            for (var i = 0; i < len; i++) {
                var item = list[i], cls = item.configRequired == 1 ? " req " : "";
                if (item.configInline == '1') {
                    allLine = parseInt(allLine + 1.5);//可能之前有一个显示半行的 要占一行
                } else {
                    allLine += 0.5;
                }
                if((item.configWebVipVisitor == '1' && that.isVip) || (item.configWebVisitor == '1' && !that.isVip)){
                    //配置可显示
                    if (item.configInline == '1') {
                        nowLine = parseInt(nowLine + 1.5)
                    } else {
                        nowLine = nowLine + 0.5
                    }
                }else{
                    //不可显示
                    list[i].disabled = true;
                    disableLine++;
                    continue;
                }
                showItems++;
                var cName = item.configName, hisValue = hisParam[cName]
                var type = window.ltIE10 ? "text" : (cName == "birthday" ? "date" : cName == "age" ? "number" : "text");
                html += '<div class="book-half book-item ' + cls + (item.configInline == '1' ? 'book-one-line' : '') + '">'
                    + '<label class="book-label" style="color:' + configData.visitorInfoLabelColor + '"><span class="req-span color0">*</span><span class="name-span">' + item.configDesc + '</span></label>'
                    + (cName == "gender" ? (
                        '&nbsp;&nbsp;<input type="radio" class="book-radio ' + cls + '" name="gender" value="1" ' + (hisValue == 1 ? 'checked="checked"' : '') + ' lb="' + item.configDesc + '"/><span class="radio-span" style="color:' + configData.visitorInfoInputColor + ';">'+lanRes.male+'</span> '
                        + '<input type="radio" class="book-radio ' + cls + '" name="gender" value="2" ' + (hisValue == 2 ? 'checked="checked"' : '') + ' lb="' + item.configDesc + '" /><span class="radio-span" style="color:' + configData.visitorInfoInputColor + ';">'+lanRes.female+'</span>'
                    ) : cName == "maritalStatus" ? (
                        '&nbsp;&nbsp;<input type="radio" class="book-radio ' + cls + '" name="maritalStatus" value="1" ' + (hisValue == 1 ? 'checked="checked"' : '') + ' lb="' + item.configDesc + '"/><span class="radio-span"  style="color:' + configData.visitorInfoInputColor + ';">'+lanRes.unmarried+'</span>' +
                        '<input type="radio" class="book-radio ' + cls + '" name="maritalStatus" value="2" ' + (hisValue == 2 ? 'checked="checked"' : '') + ' lb="' + item.configDesc + '"/><span class="radio-span"  style="color:' + configData.visitorInfoInputColor + ';">'+lanRes.married+'</span>'
                    ) : (
                        '<input type="' + type + '" lb="' + item.configDesc + '" class="book-ipt ' + cls + '" name="' + cName
                        + '" value="' + (hisValue || '') + '" style="border-bottom-color:' + configData.visitorInfoInputColor + ';color:' + configData.visitorInfoInputColor + ';"/>'
                    ))
                    + '</div>';
            }
            if (showItems == 0) {//没有显示的项目
                return false;
            }
            /*验证码*/
            if (configData.captChaEnable == 1) {
                html += '<div class="clearfix"><div class="book-half book-item req" id="verifyInner"><label class="book-label" style="color:' + configData.visitorInfoLabelColor + '"><span class="req-span color0">*</span><span class="name-span">' + lanRes.validateCode + '</span></label>'
                    + '<input type="text" id="verify_input" class="book-ipt req" lb="' + lanRes.validateCode + '" style="border-color:' + configData.visitorInfoInputColor + '"/>'
                    + '</div><div class="book-half book-item verify-line"><img alt="'+lanRes.validateCode+'" id="verify_img" src="'+that.dataHost+'/chatCaptCha.jpg?captChatToken=' + msg.captChaToken + '"/><span class="color0 cursor-p" id="verify_change">'+lanRes.nextPic+'</span>'
                    + '</div></div>';

                //防止单独验证码那边DOM干扰
                $(".verify-change").attr('id','');
                $(".verify-img").attr('id','');
                $(".verify-ok").attr('id','');
                $(".verify-input").attr('id','');

            }
            html += '</div>';
            html += '<div id="submitBtn' + rId + '" style="' + configData.visitorInfoSubmitPos + '" class="book-btn">'
                + ' <span class="book-btn-text">' + (configData.visitorInfoSubmitTxt || "") + '</span>'
                + '</div>';
            html += '</form></div>';
            $("#entry").html(html).show();
            if (view.windowType == 1) {
                allLine = parseInt(allLine + 0.5);
                nowLine = parseInt(nowLine + 0.5);
                disableLine = allLine - nowLine;
            }
            if (disableLine>0) {
                setTimeout(function () {
                    $(".book-items-list").css('paddingBottom', view.px2rem ? view.px2rem(disableLine * 30) : (disableLine * 30 + 'px'))
                }, 10)
            }

            //去loading遮罩
            that.publish("removeLoading");
            if (configData.captChaEnable == 1) {
                that.toShowCode();
            }
            // $("#maskVerify").show();
            // if (view.windowType != 1) {
            $("#mask").show();
            $("body").addClass('entry');
            // }
            //设置确定按钮
            if (configData.visitorInfoSubmitImg) {
                if (that.needHttps) {
                    configData.visitorInfoSubmitImg = configData.visitorInfoSubmitImg.replace(/^http:/, that.needHttps);
                }
                var img = new Image();
                img.onload = function () {
                    var submitBtn = _$("submitBtn" + rId).style;
                    submitBtn.backgroundImage = "url('" + configData.visitorInfoSubmitImg + "')";
                    submitBtn.lineHeight = view.px2rem ? view.px2rem(this.height) : (this.height + "px");
                    submitBtn.height = view.px2rem ? view.px2rem(this.height) : (this.height + "px");
                    submitBtn.width = view.px2rem ? view.px2rem(this.width) : (this.width + "px");
                    submitBtn = null;
                    img = null;
                    //configData = null;
                }
                img.src = configData.visitorInfoSubmitImg;
            }
            $("#cancelEntryBtn").on('click',function (e) {
                that.visitorClose = false;//不关闭窗口
                that.publish("_endChat");
                that.publish("chatEnded",{});
                if (that.hasEntryOrCode||that.queryParams.autoChat=='0') {//没有断开连接 !that.chatting&&没有信息收集和验证码(对话和留言前)、没有自动接通对话 107不能结束
                    that.publish("entryCallback", {success: true});// 去除信息收集和验证码
                    that.publish("_endConnect");//断开连接
                    // that.publish("_closeWin");//隐藏或关闭窗口
                };
                //关闭了这些参数应该不需要了
                delete that.queryParams.autoPop;
                delete that.queryParams.autoChat;
            })

            that.addEntryEvent(list,configData,"#submitBtn" + rId);
            if (that.isMobile) {
                /*  $("#inviteBookLi" + rId).bind("tap", function () {
                 //设置元素样式为fixed方便输入
                 var top = this.offsetTop-15;
                 $(this).addClass("book-hover").css("top",top+'px');
                 });*/
            }
            setTimeout(function () {
                //设置最小高度
                var h = _$("entryForm").offsetHeight + (view.px2px?view.px2px(20):20) + _$("entryForm").offsetTop;
                _$("entry").style.minHeight = h + "px";
            }, 100);
            return true;
        },
        addEntryEvent:function (list,configData,submitSelector,cb) {
            var that = this;
            $("input", _$("entryForm")).bind("blur", function () {
                //校验
                var ipt = this;
                var name = ipt.name;
                var val = ipt.value.replace(/^[\s]+|[\s]+$/ig, "");
                checkIpt(ipt, val, name, function (valid) {
                    if (valid) {

                    } else {

                    }
                });
            });
            var submiting = false;
            function submit(e) {
                if (submiting) return false;
                var form = _$("entryForm"),
                    param = {windowType:view.windowType},visitorMsg='',label,
                    valid = true, val;
                for (var i = 0, len = list.length; i < len; i++) {
                    val = null,label="";
                    var item = list[i], name = item.configName;
                    if (list[i].disabled) {
                        continue;
                    }
                    var ipt = form[name];
                    if (name == 'name') {

                    }
                    //性别 radio或者checkbox
                    if (!ipt.value && ipt.length > 1 && ipt[0]) {
                        for (var k = 0; k < ipt.length; k++) {
                            if (ipt[k].checked) {
                                val = ipt[k].value;
                                label = $(ipt[k]).attr("lb");
                            }
                        }
                    }

                    val = val || ipt.value;
                    val && (val = val.replace(/^[\s]+|[\s]+$/ig, ""));
                    valid = checkIpt(ipt, val, name, function (valid) {
                            if (ipt.nodeType) {
                                valid ? $(ipt).removeClass('error') : $(ipt).addClass('error');
                            } else {
                            }
                        }) && valid;
                    if (!valid) return false;
                    if (val && valid) {
                        label = label || $(ipt.length ? ipt[0] : ipt).attr("lb");
                        if (name == 'gender') {
                            visitorMsg += label + ' ' + (val == 1 ? lanRes.male : lanRes.female) + "\r\n "
                        } else if (name == 'maritalStatus') {
                            visitorMsg += label + ' ' + (val == 1 ? lanRes.unmarried : lanRes.married) + "\r\n "
                        } else {
                            visitorMsg += label + ' ' + val + "\r\n "
                        }
                    }
                    //param += "&" + name + "=" + val;//(form[name].value ? form[name].value : ((name == 'gender' || name == 'maritalStatus') ? 0 : ''));
                    param[name] = val;
                }

                ///留言内容
                if (that.leaveAndClose) {
                    var leaveContent = $(".leave-entry-text").results[0];
                    checkIpt(leaveContent, leaveContent.value, 'content', function (valid) {
                        if (leaveContent.nodeType) {
                            valid ? $(leaveContent).removeClass('error') : $(leaveContent).addClass('error');
                        } else {
                        }
                    })
                    if (!leaveContent.value) {
                        return false;
                    }
                }
                if (valid) {
                    if (configData.captChaEnable == 1) {
                        if ($("#verify_change").hasClass("loadin")) {
                            return false;
                        }
                        var val = $("#verify_input").val();
                        if (!val) {
                            $("#verify_input").addClass("error");
                            return false;
                        }
                        $("#verify_change").addClass("loadin");
                        param.captcha = val;
                    }
                    param.et = 106;
                    //自动弹出
                    if(that.queryParams['autoPop']=='1'){
                        param.isAutoPop = 1;
                    }
                    submiting = true;
                    that.entryParam = param;
                    that.entryVisitorMsg = visitorMsg;//保存下信息收集,进入留言第一个发出
                    that.publish("visitorCommonEvent", param, function (data) {
                        if (data && data.successful) {
                            cb && cb();
                        }
                        if (configData.captChaEnable == 1) {
                            $("#verify_change").removeClass("loadin");
                        }
                        submiting = false;

                    });
                }
                return false;
            }
            _$("entryForm").onsubmit = submit;
            $(submitSelector).off("click").on("click", submit);
        },
        /*显示验证码*/
        toShowCode: function () {
            var that = this;
            if (this.codeShowed) {
                $("#verify_change").removeClass("loadin");
                $("#verify_input").removeClass("error").val("");
                // return;
            }
            this.codeShowed = true;
            function changeImg() {
                var f = $("#verify_change").hasClass("loadin");
                if (f) return;
                $("#verify_change").addClass("loadin");
                //自动弹出
                var param = {
                    et: 122,
                    windowType: view.windowType,
                    content: "refresh code"
                }
                if(that.queryParams['autoPop']=='1'){
                    param.isAutoPop = 1;
                }
                that.publish("visitorCommonEvent", param);
            }

            $("#verify_img").off('click').bind("click", changeImg);
            $("#verify_change").off('click').bind("click", changeImg);
            $("#verify_input").off('click').bind("keydown", function () {
                $("#verify_input").removeClass("error");
            });
            $("#verify_ok").off('click').bind("click", function () {
                if ($("#verify_change").hasClass("loadin")) {
                    return;
                }
                var val = $("#verify_input").val();
                if (!val) {
                    $("#verify_input").addClass("error");
                    return;
                }
                $("#verify_change").addClass("loadin");
                var param = {et: 106, captcha: val,windowType:view.windowType};
                //自动弹出
                if(that.queryParams['autoPop']=='1'){
                    param.isAutoPop = 1;
                }
                that.publish("visitorCommonEvent", param, function () {
                });
            });
        },
        toShowQcode: function () {
            var that = this;
            if (view.qcodeWechat) {

            } else {

                that.subscribe("getChatToken", function (evttype, msg) {
                    showQcodeImg(msg.chatToken);
                });

                /**请求用于生成二维码的chattoken et=120
                 *
                 * 只有在对话过程中才有用，请求对话或者对话进行中，会返回selfmsg频道646消息
                 */
                that.subscribe("_toGetChatToken", function () {
                    that.publish("visitorCommonEvent", {
                        et: 120,
                        companyId: that.companyId
                    });
                });
            }

            function showQcodeImg(chatToken) {
                $("#qcode_loading").show();
                //先设置为加载好了,避免 多次加载
                $("#qcode_img").attr("loaded", "loaded").hide();
                if (!chatToken) {
                    //来自访客事件,展示二维码第一次触发 也要来自访客事件
                    that.publish('_toGetChatToken');
                    return;
                }
                var url = (that.dataHost || "") + '/cqr?'+(that.needHttps?'ssl=1&':'')+'chatToken=' + chatToken;
                var qcodeImg = new Image();
                qcodeImg.onload = function () {
                    $("#qcode_loading").hide();
                    $("#qcode_img").attr({"loaded": "loaded", "src": url}).show();
                    // 10分钟之后过期
                    setTimeout(function () {
                        //自动刷新二维码
                        $("#qcode_img").removeAttr("loaded");
                        // showQcodeImg();
                        that.publish('_toGetChatToken');
                    }, 540000)//9分钟再请求
                }
                qcodeImg.onerror = function (e) {
                    $("#qcode_img").removeAttr("loaded");
                }
                qcodeImg.src = url;
            }
            //pc和内页
            view.toggleQcode && view.toggleQcode(showQcodeImg);
            return true;
        },
        //初始化满意度评价
        toInitEvaluate: function (msg) {
            if (this.hasInitEvaluate) {
                return;
            }
            var that = this,
                allClose = false,//一项都没有开启
                configData = msg.evaluateInfo || msg.smallEvaluateInfo || msg.mobileEvaluateInfo || msg.sdkEvaluateInfo
                    || (that.msg649 && (that.msg649.evaluateInfo || msg.smallEvaluateInfo || that.msg649.mobileEvaluateInfo || that.msg649.sdkEvaluateInfo ));
            if(!configData){
                //todo
                console.log('error: no satisfy config ');
                that.satisfyEnable = false;
                return;
            }
            var type1 = configData.evaluateType == 1;//自定义
            that.hasInitEvaluate = true;
            var defaultValue = !type1 ? 5 :
                configData.bestEnable == 1 ? 5 :
                configData.betterEnable == 1 ? 4 :
                    configData.commonEnable == 1 ? 3 :
                        configData.worseEnable == 1 ? 2 :
                            configData.worstEnable == 1 ? 1 : false;
            if (configData.enable == 0 ) {
                that.satisfyEnable = false;
                $(".menu-satisfy").hide();
                // return;
            } else {
                $(".menu-satisfy").addClass("show"); //对话开始了展示
                that.satisfyEnable = true;
                if (configData.enableVisitorEvaluateLimit == 1 && parseInt(configData.allowEvaluateBaseWords) > 0){
                    that.allowEvaluateBaseWords = parseInt(configData.allowEvaluateBaseWords);
                    $(".menu-satisfy").addClass("limit-hide");
                }
            }
            if(!defaultValue){
                defaultValue = 5;
                //一项都没有开启,只显示五颗星
                allClose = true
            }
            $("#satisfy_ipt").val(defaultValue);
            var html = '<ul class="sa-radio clearfix">'
                    + '<li class="sa-name sa-name0">' + lanRes.satisfyTip + '</li>'
                    + '<li class="sa-name sa-name5">' + configData.bestDesc + '</li>'
                    + '<li class="sa-name sa-name4">' + configData.betterDesc + '</li>'
                    + '<li class="sa-name sa-name3">' + configData.commonDesc + '</li>'
                    + '<li class="sa-name sa-name2">' + configData.worseDesc + '</li>'
                    + '<li class="sa-name sa-name1">' + configData.worstDesc + '</li>'
                    + '</ul>'

            if (type1 && !allClose) {
                //自定义图片
                html += '<ul class="sa-imgs clearfix">';
                if (configData.worstEnable == 1) {
                    html +=
                        '<li class="sa-img sa-img1" v="1"><img class="sa-s-img" v="1" src="' + (configData.worstSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/><img class="sa-un-img" v="1" src="' + (configData.worstUnSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/></li>'
                }
                if (configData.worseEnable == 1) {
                    html +=
                        '<li class="sa-img sa-img2" v="2"><img class="sa-s-img" v="2" src="' + (configData.worseSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/><img class="sa-un-img" v="2" src="' + (configData.worseUnSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/></li>'
                }
                if (configData.commonEnable == 1) {
                    html +=
                        '<li class="sa-img sa-img3" v="3"><img class="sa-s-img" v="3" src="' + (configData.commonSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/><img class="sa-un-img" v="3" src="' + (configData.commonUnSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/></li>'
                }
                if (configData.betterEnable == 1) {
                    html +=
                        '<li class="sa-img sa-img4" v="4"><img class="sa-s-img" v="4" src="' + (configData.betterSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/><img class="sa-un-img" v="4" src="' + (configData.betterUnSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/></li>'
                }

                if (configData.bestEnable == 1) {
                    html +=
                        '<li class="sa-img sa-img5 sa-sli5" v="5"><img class="sa-s-img" v="5" src="' + (configData.bestSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/><img class="sa-un-img" v="5" src="' + (configData.bestUnSelected.replace(/^http:/, that.needHttps || 'http:')) + '"/></li>'

                }
                html += '</ul>';
            } else {
                //默认星星
                html += '<ul class="sa-stars clearfix">'
                    + '<li class="sa-sli sa-star" v="1"></li>'
                    + '<li class="sa-sli sa-star" v="2"></li>'
                    + '<li class="sa-sli sa-star" v="3"></li>'
                    + '<li class="sa-sli sa-star" v="4"></li>'
                    + '<li class="sa-sli sa-star sa-sli5" v="5"></li>'
                    + '</ul>';
            }
            //子项
            if (!type1 || !allClose) {
                html += '<div class="sub-tabs clearfix " >';
                var cfgList = ['worstConfiguration', 'worseConfiguration', 'commonConfiguration', 'betterConfiguration', 'bestConfiguration'];
                var tipList = ['worstTips', 'worseTips', 'commonTips', 'betterTips', 'bestTips'];
                for (var k = 5; k > 0; k--) {
                    var list = configData[cfgList[k - 1]] || [], len = list.length;
                    html += '<ul class="sub-tab sub-tab' + k + '" ' + (len > 0 ? '' : 'style="display:none"') + ' id="subEvaluate' + k + '"> '
                    //<div class="sa-more-info" >' + (configData[tipList[k - 1]] || '') + '</div>'
                    for (var i = 0; i < len; i++) {
                        var item = list[i];
                        html += '<li class="sa-cli" dataname="' + item.configName + '">' + item.configDesc + '</li>'
                    }
                    html += '</ul>';
                }
                html += '</div>';
            }
            $("#satisfyConfig").html(html).addClass("sa-sel-" + defaultValue);
            view.handleSatisfy && view.handleSatisfy(allClose,type1,defaultValue);
            $("#sa_ok").on("click", function () {
                $.store('ECHAT_inviteSatisfyHandle',$.store('ECHAT_inviteSatisfyId'));
                //TODO 发送访客评价
                var advise = $("#sa_advise").val(),
                    score = $("#satisfy_ipt").val();
                var subData = '';
                if (score == '0' || !score) {
                    return;
                }
                if (!allClose) {
                    var res = $('.sa-cli', _$('subEvaluate' + score));
                    var sub = res.results || [], len = sub.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            subData += "&" + [$(sub[i]).attr("dataname")]
                                + '=' + ($(sub[i]).hasClass('sub-selected') ? 1 : 0);
                        }
                    }
                }
                $.ajax({
                    url: that.dataHost + '/ces?companyId=' + that.companyId
                    + "&talkId=" + that.talkId
                    + "&visitorId=" + encodeURIComponent(that.visitorId||'')
                    + "&nonce=" + encodeURIComponent(that.restartParam.nonce||'')
                    + "&reChatTag=" + encodeURIComponent(that.restartParam.reChatTag||'')
                    + "&mainItem=" + score
                    + "&evaluateType=" + that.satisfyType + "&media=" + that.Device.media + "&windowType=" + view.windowType
                    + '&lan=' + (window.lanName || '')
                    + "&comment=" + encodeURIComponent(advise||'') + subData,
                    type: 'jsonp',
                    jsonpCB:'jsonpCallback',
                    // type:'POST',
                    // contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    success: function (res) {
                        //评价成功了才算评价过
                        that.satisfyShowed = that.talkId;
                        if (res == 1) {
                            that.evaluateScore= score;
                            _$("leave_tip_con").innerHTML = lanRes.successSubmitEval;
                            that.tipTimer && clearTimeout(that.tipTimer);
                            $("#leave_tip").removeClass("tiphide");
                            that.tipTimer = setTimeout(function () {
                                $("#leave_tip").addClass("tiphide");
                            }, 3000);
                            // $("#satisfy_ipt").val('0');
                            // if(_$("satisfyConfig")){
                            //     _$("satisfyConfig").className = 'sa-sel-0';
                            // }
                            // $("#sa_advise").val("");
                            // $(".sub-tab-sel").removeClass('sub-tab-sel');
                            // $(".sub-selected").removeClass('sub-selected');
                            view.resetSatisfy && view.resetSatisfy();
                            //对话结束后要关闭对话
                            if(that.chatting===false){
                                that.publish("_closeWin");
                                that.publish("__evaluate",'1-2');
                            }else{
                                that.publish("__evaluate",'1-1');
                            }
                            if(advise){
                                that.publish("__evaluateComment",{comment:advise,chatting:that.chatting});
                            }
                        } else {
                            var info = lanRes.unkownErrorSubmitEval;
                            if (res == 129) {
                                info = lanRes.evaluateTimeout;
                            } else if (res == 130) {
                                info = lanRes.evaluateRepeat;
                            } else if (res == 133) {
                                info = lanRes.evaluateRepeatTime;
                            }
                            _$("leave_tip_con").innerHTML = info;
                            that.tipTimer && clearTimeout(that.tipTimer);
                            $("#leave_tip").removeClass("tiphide");
                            that.tipTimer = setTimeout(function () {
                                $("#leave_tip").addClass("tiphide");
                            }, 3000);
                        }
                    },
                    error: function () {
                        _$("leave_tip_con").innerHTML = lanRes.unkownErrorSubmitEval;
                        $("#leave_tip").removeClass("tiphide");
                        that.tipTimer && clearTimeout(that.tipTimer);
                        that.tipTimer = setTimeout(function () {
                            $("#leave_tip").addClass("tiphide");
                        }, 3000);
                    }
                });
                $("#satisfy").removeClass('satisfy-show').hide();
                $("#mask").hide();
            });
            $("#sa_cancel").on("click",that.hideSatisfy);
        },
        startChat: function (eventType, msg) {
            var that = this;
            that.companyOff = false;
            //识别604转接消息
            if (this.chatting===true && this.staffId != msg.staffId && this.talkId == msg.talkId) {
                this.publish("getSysMsg", {
                    talkId:msg.talkId,
                    tm:msg.tm,
                    mt:'10001',
                    staffId: msg.staffId,
                    staffName: msg.staffNickName
                });
            }
            $.cookie('ECHAT_' + window.companyId + "_" + window.chatVisitorId + "_staffHead", msg.staffDetailInfo.staffHead,{path:'/'});
            $.cookie('ECHAT_' + that.companyId + "_" + window.chatVisitorId + "_chatStatus",2,{path:'/'});
            if (this.satisfyShowed != msg.talkId) {
                //只有每一个会话的第一次604才设置
                this.satisfyShowed = 0;
            }
            this.chatting = true;
            this.talkId = msg.talkId;
            this.staffId =  msg.staffId;
            this.staffName =  msg.staffNickName;// staffInfo 里面油设置了
            //PC刷新窗口参数
            this.paramChat.talkId = msg.talkId;
            this.paramChat.staffId = msg.staffId;
            this.paramChat.staffName = msg.staffNickName;
            that.publish('__chatStatus','chatting');
            that.initQcode();//留言信息收集、提交时客服在线 要显示二维码
            //对话开始了这些参数应该不需要了
            delete that.queryParams.autoPop;
            delete that.queryParams.autoChat;

            $("#busyTipLine").addClass('hide').hide();
            if(msg.startType==1){
                //首次对话
                that.publish('__chatStart',msg.staffNickName);
            }
            //设置客服信息
            that.publish('staffInfo', msg);

            //display(satisfyEnable优先) 和CLASS共同决定显示
            $(".menu-satisfy").removeClass("hide");
            //下面俩只有根据忙碌可否发消息来展示
            $(".menu-capture").removeClass('hide');
            $(".menu-file").removeClass("hide");

            //去除信息收集
            this.publish("entryCallback", {success: true});

            //为防止错误，先去除事件。
            this.endChatEvent();
            //移动到客服信息里面去设置了
            // view.startChatRefreshAD && view.startChatRefreshAD();

            // var isLoaded = this.loadHistory(this.talkId );
            // if (isLoaded === false) {//没有历史记录
                // if (!that.hasGetHistory) {
                //     that.publish("visitorCommonEvent", {
                //         et: 121,
                //         content: "history"
                //     });//不加载历史中的本次对话记录，直接去对话记录去取
                // }
            // }
            //正在输入
            that.lastText = null;
            function inputing() {
                var msg = that.getInput(false),sendContent = msg;
                if (msg && (that.lastText != msg)) {
                    that.lastText = msg;
                    if (that.plainText) {
                        sendContent = that.plainTextToSendMsg(msg);
                    }
                    that.publish("sendVisitorEvent", {
                        et: 104,
                        content: sendContent
                    });
                }
                that.typingTimer = setTimeout(inputing, 2000);
            }
            that.typingTimer = setTimeout(inputing, 2000);

            this.subscribe("getMsgTyping", function (evenType, msg) {
                //显示客服正在输入。。。
                that.showTyping();
            });

            this.subscribe("staffStatus", function (eventType, data) {
                //客服状态变更
                if (data.status != 1) {
                    that.publish("_staffEndChat", data);
                    var time = new Date();
                    this.showMsg({
                            f: "s",
                            t: (that.checkHistoryTime(time.getTime()) ? (time.format("hh:mm")) : undefined)
                        },lanRes.staffLeaveEnd
                    );
                }
            });

            function getBookForm(configData,talkId,tm) {
                var groupId = configData.groupId;
                var rId = that.bookformi++;
                var list = configData.configuration, len = list.length;
                var allInOneLine = configData.captChaEnable != 1&&updateInOneline(list);
                if (that.needHttps && configData.backImg) {
                    configData.backImg = configData.backImg.replace(/^http:/, that.needHttps);
                }
                var html = ' <div id="inviteBook' + rId + '" class="book-table ' + (allInOneLine == '1' ? 'book-all-line' : '') + '" >'//400 / 260
                    + (configData.backImg ? ('<div><img id="inviteBookImg' + rId + '" class="book-table-img hide" src="' + configData.backImg + '" onload="imgLoadResize(this,' + rId + ')"/></div>') : '')
                    + '<form id="inviteBookForm' + rId + '" class="book-items">'//380 10 / 220 20
                    + ' <div class="clearfix book-items-list" style="' + configData.formPos + ';">';
                for (var i = 0; i < len; i++) {
                    var item = list[i], cls = item.configRequired == 1 ? "req" : "";
                    var type = window.ltIE10 ? "text" : (item.configName == "birthday" ? "date" : item.configName == "age" ? "number" : "text");
                    html += '<div class="book-half book-item ' + (item.configInline == '1' ? 'book-one-line' : '') + '">'
                        + '<label class="book-label" style="color:' + configData.labelColor + '">' + item.configDesc + '</label>'
                        + (item.configName == "gender" ? (
                            '&nbsp;&nbsp;<input type="radio" class="book-radio ' + cls + '" name="gender" value="1" lb="' + item.configDesc + '"/><span style="color:' + configData.inputColor + ';">' + lanRes.male + '</span> '
                            + '<input type="radio" class="book-radio ' + cls + '" name="gender" value="2" /><span style="color:' + configData.inputColor + ';">' + lanRes.female + '</span>'
                            //+ '<input type="radio" checked="checked" class="book-radio" name="gender" value="0" />未知'
                        ) : item.configName == "maritalStatus" ? (
                            '&nbsp;&nbsp;<input type="radio" class="book-radio ' + cls + '" name="maritalStatus" value="1" lb="' + item.configDesc + '"/><span  style="color:' + configData.inputColor + ';">' + lanRes.unmarried + '</span>' +
                            '<input type="radio" class="book-radio ' + cls + '" name="maritalStatus" value="2" /><span  style="color:' + configData.inputColor + ';">' + lanRes.married + '</span>'
                            // +'<input type="radio" checked="checked" class="book-radio" name="maritalStatus" value="0" />未知'
                        ) : (
                            '<input type="' + type + '" lb="' + item.configDesc + '" class="book-ipt ' + cls + '" name="' + item.configName
                            + '" style="border-bottom-color:' + configData.inputColor + ';color:' + configData.inputColor + ';"/>'
                        ))
                        + '</div>';
                }
                html += '</div>';
                html += '<div id="submitBtn' + rId + '" style="' + configData.submitPos + '" class="book-btn">'
                    + ' <span class="book-btn-text">' + (configData.submitTxt || "") + '</span>'
                    + '</div>';
                html += '</form></div>';
                $(that.getListMsgEl(talkId,tm)).append('<li id="inviteBookLi' + rId + '" class="clearfix book-wrap">' + html + '</li>');

                //设置确定按钮
                if (configData.submitImg) {
                    var img = new Image();
                    if (that.needHttps) {
                        configData.submitImg = configData.submitImg.replace(/^http:/, that.needHttps);
                    }
                    img.onload = function () {
                        var submitBtn = _$("submitBtn" + rId).style;
                        submitBtn.backgroundImage = "url('" + configData.submitImg + "')";
                        submitBtn.lineHeight = view.px2rem ? view.px2rem(this.height) : (this.height + "px");
                        submitBtn.height = view.px2rem ? view.px2rem(this.height) : (this.height + "px");
                        submitBtn.width = view.px2rem ? view.px2rem(this.width) : (this.width + "px");
                        submitBtn = null;
                        img = null;
                        configData = null;
                    }
                    configData.submitImg && (img.src = configData.submitImg);
                }
                $("input", _$("inviteBook" + rId)).bind("blur", function () {
                    //校验
                    var ipt = this;
                    var name = ipt.name;
                    var val = ipt.value.replace(/^[\s]+|[\s]+$/ig, "");
                    checkIpt(ipt, val, name, function (valid) {
                        if (valid) {

                        } else {

                        }
                    });
                });
                //$(".leave-err", _$("inviteBook" + rId)).bind("click", function () {
                //    this.style.display = 'none';
                //});
                var isSubmitting = 0;
                function submit(e) {
                    if (isSubmitting) return false;
                    var form = _$("inviteBookForm" + rId),
                        param = "companyId=" + that.companyId + "&visitorId=" + that.visitorId + "&groupId=" + groupId + "&p=" + encodeURIComponent(that.encryptVID),
                        valid = true, val;
                    for (var i = 0; i < len; i++) {
                        val = null;
                        var item = list[i], name = item.configName;
                        var ipt = form[name];
                        //性别 radio或者checkbox
                        if (!ipt.value && ipt.length > 1 && ipt[0]) {
                            for (var k = 0; k < ipt.length; k++) {
                                if (ipt[k].checked) {
                                    val = ipt[k].value;
                                }
                            }
                        }
                        val = val || ipt.value;
                        val = val.replace(/^[\s]+|[\s]+$/ig, "");
                        valid = checkIpt(ipt, val, name, function (valid) {
                            }) && valid;
                        if (!valid) return false;
                        param += "&" + name + "=" + val;//(form[name].value ? form[name].value : ((name == 'gender' || name == 'maritalStatus') ? 0 : ''));
                    }
                    if (valid) {
                        isSubmitting = 1;
                        $.ajax({
                            url: that.dataHost + '/cvi?' + param,
                            type: 'jsonp',
                            jsonpCB:'jsonpCallback',
                            // type:'POST',
                            // contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                            success: function (res) {
                                isSubmitting = 0;
                                if (res == 1) {
                                    $(".book-wrap").remove();
                                    //that.showInfoTip("提交信息成功");//信息搜集/预约
                                } else {//按当前talkID和时间算 不传也行
                                    that.showInfoTip(lanRes.unkownErrorSubmit, undefined, "warn");//信息搜集/预约
                                }
                            },
                            error: function () {
                                isSubmitting = 0;
                                that.showInfoTip(lanRes.unkownErrorSubmit, undefined, "warn");//信息搜集/预约
                            }
                        });
                    }
                    return false;
                }
                $("#submitBtn" + rId).bind(that.isMobile ? "tap" : "click", submit);
                _$("inviteBookForm" + rId).onsubmit = submit;
                if (that.isMobile) {
                    /*  $("#inviteBookLi" + rId).bind("tap", function () {
                     //设置元素样式为fixed方便输入
                     var top = this.offsetTop-15;
                     $(this).addClass("book-hover").css("top",top+'px');
                     });*/
                }
                setTimeout(function () {
                    //设置最小高度
                    var h = _$("inviteBookForm" + rId).offsetHeight + (view.px2px?view.px2px(20):20) + _$("inviteBookForm" + rId).offsetTop;
                    _$("inviteBookLi" + rId).style.minHeight = h + 'px';
                    view.scrollToBottom();
                }, 100)
            }

            //收到客服预约邀请
            this.subscribe("inviteBook", function (eventType, msg) {
                var configData, list = msg.templateInfoList;
                if (((view.windowType == 1) && (list[0].type == 0 || list[0].type == 1)) || ((view.windowType != 1) && (list[0].type == 2 || list[0].type == 3))) {
                    configData = list[0];
                }
                else configData = list[1];
                if (configData.type == 0 || configData.type == 2) {
                    that._getMsg({
                            mt: msg.mt,
                            tm: msg.tm,
                            notEnd: msg.notEnd,
                            content: that.showInfoTip('客服给您发送了一个预约表。', undefined, undefined, true, msg.talkId, msg.tm, msg.notEnd)
                        }
                        , 4, getBookForm(configData,msg.talkId,msg.tm), 'x');
                } else {
                    that._getMsg({mt: msg.mt, tm: msg.tm, content: list}, 3, that.getBookComfirm(list), 'x');
                }
            });
            //收到客服预约邀请
            this.subscribe("inviteBookOK", function (eventType, msg) {
                //todo 暂时兼容
                console.log('不应发送892 inviteBookOK ');
                if (msg.success == true) {
                    //验证通过
                    $("#entry").hide();
                    $("#verify").hide();
                    $("#mask").hide();
                    that.hasEntryOrCode = false;
                    //信息手机反馈670 才发103 才存参数
                    if (msg.mt) {
                        //本地COOKIE存储信息手机
                        var param = that.entryParam;
                        if (param) {
                            delete param.et;
                            delete param.captcha;
                            var oldParam = $.store('ECHAT_' + that.companyId + "_ENTRY_HIS");
                            oldParam = oldParam ? JSON.parse(oldParam) : {};
                            param = $.extend(oldParam, param);
                            $.store('ECHAT_' + that.companyId + "_ENTRY_HIS", JSON.stringify(param));
                        }
                    }
                } else {
                    //刷新验证码
                    that.publish("refreshVerify", {status: 1})
                }


                $(".book-wrap").remove();
                that.showInfoTip(lanRes.submitInfoSucc);//信息搜集/预约
            });


            //$(window).on("unload", function () {
            //    //结束对话
            //    //that.publish("_endChat");
            //});


        },
        sendMsgNum:0,//访客发送消息条数
        sendToServer: function (item, sendContent,cb) {
            var that = this;
            var c = sendContent ? sendContent : (item.c|| item.content);//item.content sdk重发
            item.visitorImg = that.visitorImg||that.defaultVisitorImg;
            if(that.isInRobot){
                //机器人消息标示
                item.ff = 'r';
            }else {
                item.f = item.f || 'c';
            }
            if (!item.hide){
                delete item.hasResend;
                //入口信息收集发送的内容不显示
                that.showMsg(item);
            }
            //item.c = c;//设置为初始发送的值
            var id = item.id;
            console.log('sendToServer'+id);
            delete item.id;
            //没自动接通对话前 不发105 机器人没这个参数
            if(that.queryParams['autoChat'] != '0') {
                //发送中图标
                if (!item.hide){
                    $(".msg-con", _$(id)).append('<div class="msg-error">&nbsp;</div>');
                }
                this.publish("sendVisitorEvent", {
                    et: that.isInRobot ? 130 : 105,
                    content: c,
                    bridgeMsgId:item.bridgeMsgId,//sdk重发需要
                    img: sendContent ? 1 : undefined,
                    publishAck: item.publishAck || undefined//web重发需要
                }, function (publishAck) {
                    if (publishAck.successful) {
                        item.talkId = that.talkId;
                        if (!item.hide) {
                            $(".msg-error", _$(id)).remove();
                            that.pushHistory(item);
                        }
                        delete that.errorList[id];//移除失败记录
                        cb && cb();
                    } else {
                        item.c = c;
                        that.errorList[id] = item;
                        if (!item.hide) {
                            item.publishAck = publishAck;
                            $(".msg-error", _$(id)).addClass("resend").attr("dataid", id);
                        }
                        item = null;
                    }
                });
            }
            if (that.isInRobot) {
                $("#input_suggest").addClass('hide').html(' ');
            }
            that.lastMsgTM = item.tm || new Date().getTime();
        },
        //隔一分钟显示时间
        checkHistoryTime: function (time) {
            if (!this.lastHistoryTime || (time - this.lastHistoryTime > 60000)) {
                this.lastHistoryTime = time;
                return true;
            }
            return false
        },
        endChatEvent: function () {
            this.typingTimer && clearInterval(this.typingTimer);
            var evtArr = [
                // "_endChat",
                "staffStatus",
                // "getMsg",
                // "getMsgMine",
                // "_sendMsg",
                // "getFileToken",
                // "getErr",

                // "getMsgFile",
                // "getMsgImg",
                "getMsgTyping",
                "inviteBook",
                "inviteBookOK"]
            this.unSubscribe(evtArr);
        },
        showTyping: function () {
            var that = this,
                typingRes = lanRes.staffInput;
            this.serviceTypingTimer && clearInterval(this.serviceTypingTimer);
            $("#serviceTypingLine").remove();
            this.serviceTypingTime = 0;
            function ing() {
                if (that.serviceTypingTime > 5) {
                    clearInterval(that.serviceTypingTimer);
                    $("#serviceTypingLine").remove();
                }
                var str;
                switch (that.serviceTypingTime % 3) {
                    case 0:
                        str = typingRes+"&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                        break;
                    case 1:
                        str = typingRes+"&nbsp;.&nbsp;.&nbsp;&nbsp;&nbsp;"
                        break;
                    case 2:
                        str = typingRes+"&nbsp;.&nbsp;.&nbsp;.&nbsp;"
                        break;
                }
                that.serviceTypingTime++;
                var typing = _$("serviceTypingLine");
                if (typing) {
                    $(".msg-item", typing).html(str);
                }

            }

            ing();
            this.serviceTypingTimer = setInterval(ing, 500);
            this.showMsg({f: "s", m: 0, notEnd: false, id: 'serviceTypingLine'}, typingRes+'&nbsp;.&nbsp;.&nbsp;.&nbsp;');
        },
        regMail:/\b\w{1,30}([\.-]\w{1,30}){0,10}@\w{1,30}([\.-]\w{1,20}){0,10}(\.\w{1,20}){0,10}\b/g,///(\b\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+\b)/g 太耗费
        regPhone:/([^\d]|\b)((\d{11})|((\d{7,8})|(\d{4}|\d{3})[\-\s](\d{7,8})|(\d{4}|\d{3})[\-\s](\d{7,8})[\-\s](\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})[\-\s](\d{4}|\d{3}|\d{2}|\d{1})))(?=[^\d]|\b)/ig,
        regLink:/((http|ftp|https):\/\/)(([\w\._\-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})?(\/[\w,\&%_\!\*\(\)\'\;\:\@\=\+\.\/\[-~\-#\?]*)?/ig,
        filterEmailPhoneLink: function (content) {
            var isMobile = this.isMobile,that = this;
            if(content.match(/(msg\-tel)|(msg\-link)|(msg\-mail)/)){
                //如果已经处理过
                return content;
            }
            this.regPhone.lastIndex=0;
            this.regMail.lastIndex=0;
            this.regLink.lastIndex=0;

            //链接 不在链接里面取不在起始标签属性里面取
            content = content.replace(this.regLink, function (link) {
                var len = arguments.length;
                var idx = arguments[len - 2];
                if (idx > 0) {
                    var preStr = arguments[len - 1].substring(0, idx);
                    if (/(\<(a|img|link|iframe|script)[^>]*>([^<]+(?!\<\/a\>))?$)|(\<[a-zA-Z]+[^>]*$)/ig.test(preStr)) {
                        return link;
                    }
                }
                return isMobile ? ('<a class="msg-link" href="' + link + '" target="visitorSiteIframe">' + link + '</a>') : ('<a class="msg-link" target="_blank" href="' + link + '">' + link + '</a>');
            });
           //邮件 不在链接里面取 应该是没有的
            if (content.indexOf('@') > 1) {//减少正则运行
                content = content.replace(this.regMail, function (email) {
                    var len = arguments.length;
                    var idx = arguments[len - 2];
                    if (idx > 0) {
                        var preStr = arguments[len - 1].substring(0, idx);
                        if (/(\<(a|img|link|iframe|script)[^>]*>[^<]+(?!\<\/a\>)$)|(\<[a-zA-Z]+[^>]*$)/ig.test(preStr)) {
                            return email;
                        }
                    }
                    return '<a class="msg-mail" target="_blank" href="mailto:' + email + '">' + email + '</a>';
                });
            }

            //电话 不在链接和邮箱里面取
            content = content.replace(this.regPhone, function (tel1,sub1) {
                var len = arguments.length;
                var idx = arguments[len-2];
                if (idx > 0) {
                    var preStr = arguments[len - 1].substring(0, idx);
                    if (/(\<(a|img|link|iframe|script)[^>]*>[^<]+(?!\<\/a\>)$)|(\<[a-zA-Z]+[^>]*$)/ig.test(preStr)) {
                        return tel1;
                    }
                }
                //JS不支持前置断言
                var start  = sub1;
                var tel = tel1.replace(/^[^\d]|\b/,'');

                return (start?start:'')+(isMobile ? ('<a class="msg-tel" href="tel:' + tel + '">' + tel + '</a>')
                        : ('<span class="msg-tel">' + tel + '</span>'));
            });
            return content;
        },
        updateMsg: function (id, msg, option) {
            var li = _$(id),item;
            if(li){
                item = $('.msg-item',li);
                item.html(msg);
                if (option && option.newId) {
                    $(li).attr('id', option.newId);
                }
            }
        },
        showLocation:function(msg){
            var url = location.protocol + '//restapi.amap.com/v3/staticmap?location=' + msg.locationX + ','
                + msg.locationY + '&zoom=' + (msg.scale || 15) + '&size=400*400&key=5349312538cf80d1f6c008eb059b732c&markers=mid,,A:' + msg.locationX + ','
                + msg.locationY;
            var content = "<a target='_blank' href='http://uri.amap.com/marker?position=" + msg.locationX + ','
                + msg.locationY + "&name=" + encodeURIComponent(msg.label) + "&coordinate=gaode'>"//后端给的数据与qq地图的xy是反的
                + "<img class='view_img' src='" + url + "' draggable='false'/><div>" + msg.label + "</div></a>";

            view.chat.showMsg({id: new Date().getTime(), f: "c"}, '<div class="msg-map">' + content + '</div>');
        },
        showMsg: function (item, otherContent) {
            if (!item) return;
            var that = this, talkId = item.talkId || that.talkId;
            //{t:"12:04",f:0,t:0,c:"您好,我能帮你什么呢？"}
            var id = item.id || ("msg" + (item.tm || (new Date().getTime())));
            //显示时间。
            var str = (item.t ? ('<li class="clearfix" ><div class="color1 tc">' + item.t + '</div></li> ') : '');
            //现在只有文本 m:6推送URL
            var c;
            if (item.m==0) {//客服访客发送的文本消息都需过滤表情 m==0
                ///*客服*/消息过滤电话邮箱
                if (/*item.f == 's' &&*/ item.c) {
                    item.c =  that.filterEmailPhoneLink(item.c);
                }
                c = item.c ? (that.filterEmo(item.c).replace(/[\r\n]+/g, "</br>")) : otherContent;

            } else {//收到客服发送的1文件/2图片/3预约确认/4预约表/5图文消息 消息都已经组装好了
                //file img 预约确认表
                c = item.c || otherContent;
                if (item.m == 1) {

                }
            }
            item.c = c;//用于存储历史记录
            if (!c) {
                //console.trace();
                //console.log(arguments, "显示历史空消息");
                return;
            }
            var visitorImg = item.visitorImg || that.visitorImg || that.defaultVisitorImg;
            if (that.needHttps) {
                that.staffImg && (that.staffImg = that.staffImg.replace(/^http:/, that.needHttps));
                visitorImg = visitorImg.replace(/^http:/, that.needHttps);
            }

            if (view.staticPx2rem) {
                c = view.staticPx2rem(c);
            }
            if (item.f == "s"||item.f == "r") {// 客服消息
                c = c.replace(/\[\[#(toChat|endChat):(.+)\]\]/,function (match,sub1,sub2) {
                    return '<span class="link-in-msg '+(sub1=='toChat'?'robot-staff ':sub1=='endChat'?'end-chat ':'')+'">'+sub2+'</span>'
                });
                //清除客服正在输入
                str += ('<li class="clearfix '+ (item.f == "r"?'msg-robot':'')+' mode'+item.m+'" id="' + id + '" >'
                + (that.showAvatar ? ('<div class="avatar-icon fl staff-icons"><img class="avatar-icon-img" src="' + (item.staffImg || that.staffImg ||that.defaultStaffImg) + '"/></div>') : '')
                + ' <div class="msg msg-lf fl">'
                + '<div class="msg-staff-name">' + (item.staffName || that.staffName||lanRes.serviceStaff) + '</div>'
                + ' <div class="msg-con radius4 fl '+ ((/*that.isInRobot||*/item.f=='r')?'bg10':'bg1')+ ((/*item.ff=='r'||*/(item.m!=0&&item.m!=6)) ? " bgwhite" : "") + '">'
                + ' <i class="msg-angle '+ ((/*that.isInRobot||*/item.f=='r')?'border-color-angle10':'border-color-angle1')+'"></i>'
                + ((/*item.ff=='r'||*/(item.m!=0&&item.m!=6))? ' <i class="msg-angle2 bc-angle1-white"></i>' : '')
                + ' <div class="msg-item">'
                + c
                + ' </div>'
                + ' </div>'
                + ' </div>'
                + '</li>');
            } else if (item.f == "c") {//访客消息 可能是图文消息
                str += ('<li class="clearfix mode'+item.m+'" id="' + id + '" >'
                + (that.showAvatar ? ('<div class="avatar-icon fr"><img class="avatar-icon-img" src="' + visitorImg + '"/></div>') : '')
                + ' <div class="msg msg-rt fr">'
                + ' <div class="msg-con radius4 fr ' + ((/*that.isInRobot||*/item.ff=='r')?'bg30':'bg3') + ((/*item.ff=='r'||*/(item.m!=0&&item.m!=5)) ? " bgwhite" : "") + '">'
                + ' <i class="msg-angle '+ ((/*that.isInRobot||*/item.ff=='r')?'border-color-angle20':'border-color-angle2')+'"></i>'
                + ((/*item.ff=='r'||*/(item.m!=0&&item.m!=5)) ? ' <i class="msg-angle2 bc-angle2-white"></i>' : '')
                + (item.hasResend?('<div class="msg-error resend" dataid="'+item.id+'">&nbsp;</div>'):'')//重发按钮
                + ' <div class="msg-item">'
                + c.replace(/\n/g,'<br/>')
                + ' </div>'
                + ' </div>'
                + ' </div>'
                + '</li>');
                /* } else if (item.f == 'l') {//离线消息
                 str += ('<li class="clearfix" id="' + id + '" >'
                 + '<div class="msg-center msg-leave">' +
                 '<div class="reply-wrap">' +
                 '<div class="reply-title">' + lanRes.leaveStaffReply + ':</div><div class="reply-content" >' + c + '</div>'
                 + '</div></div>'
                 + '</li>');*/
            } else {//预约确认表
                str += c;
            }

            var ul = document.createElement("ul");
            ul.innerHTML = str;
            var limsg = that.getListMsgEl(talkId,item.tm);
            var list = ul.childNodes, node, i = 0;
            while (node = list[i++]) {
                if (node.nodeType == 1) {
                    node = node.cloneNode(true);
                    limsg.appendChild(node);
                }
            }
            list = null;
            ul = null;

            //新增还是会加入到消息界面，只是不做其他操作了。
            if (item.notAppend) {
                return str;
            }
            if (item.f == "c" && this.serviceTypingTimer) {
                //将客服正在输入移动到后面
                $("#list_msg").append(_$("serviceTypingLine"));
                //$("#serviceTypingLine").appendTo();
            } else if (item.id != "serviceTypingLine" && item.f == "s" && this.serviceTypingTimer) {
                clearInterval(this.serviceTypingTimer);
                $("#serviceTypingLine").remove();
            }
            //滚动到底端最后一条消息的
            if (!item.notEnd) {
                //预约确认表延时久一点，应该是绝对定位没有及时占满高度，导致滚动到底部不成功  图文消息不需要等那么久
                if (item.m != 0 && item.m != 1 && item.m != 5) {
                    setTimeout(view.scrollToBottom, (item.f == 'x') ? 1000 : (view.windowType != 1) ? 510 : 100);
                }
                !view.noScrollBottom && setTimeout(view.scrollToBottom, 5);//文字、文件、图文 一步到位
            }
        },
        initHistory: function (talkId) {
            if (!this.hasStorage) return;
            var his = window.localStorage.getItem(this.historyKey);
            his = his && JSON.parse(his);
            if (!his) {
                his = {"order": []}
            }
            if (!his[talkId]) {
                if (!his["order"]) his["order"] = [];//兼容以前的记录

                his["order"].push(talkId);
                his[talkId] = {"order": []}
            }
            if (!his[talkId]["order"]) {
                his[talkId]["order"] = [];
            }
            return his;
        },
        pushHistory: function (item) {
            if (!this.hasStorage) return;
            if (window.SDK) return;
            if (!item.c) {
                //console.trace();
                //console.log(arguments, "存储历史空消息2");
                //item.c = "存储历史空消息2";
                return;
                //return;
            }
            //  var item = {
            //t: needTime ? (new Date()).format("hh:mm") : undefined,
            //    tm: timeStamp,//时间戳
            //    f: "c",//访客消息
            //    m: 0,//消息模型 0文本\发送了预约邀请表,1预约确定表,
            //    c: msg,
            //    id: id//消息元素ID,方便显示状态和滚动
            //};
            //t是显示时间hh:mm格式,tm时间戳，f：s是客服，c是访客，m:消息类型 0文本，c:消息内容

            var talkId = item.talkId||this.talkId;
            if(!talkId){
                // debugger
            }
            item.talkId = talkId;
            var his = this.initHistory(talkId);
            if (his && item.f == "c") {
                //多窗口同步时，防止多次存储访客发送的消息
                var sessionOrder = his[talkId]["order"];
                if (sessionOrder.length > 0) {
                    var last = sessionOrder[sessionOrder.length - 1];
                    if (his[talkId][last].c == item.c && last.indexOf("c") > -1) {
                        var delta = his[talkId][last].tm - item.tm;
                        if (delta < 200 && delta > -200) {
                            //时间间距设置为200，访客一般不会在200时间内发送多次消息
                            return;
                        }
                    }
                }
            }
            //没有才保存
            if (item.f == "s" && !item.staffImg) {
                //s是客服 保存到每一条对话记录
                item.staffImg = this.staffImg;
                item.staffName = this.staffName;
            }

            if (!his[talkId][item.tm + item.f]) {
                his[talkId][item.tm + item.f] = item;
                his[talkId]["order"].push(item.tm + item.f);
            }
            window.localStorage.setItem(this.historyKey, JSON.stringify(his));
        },
        //保存本次对话的客服头像到本地历史记录。 以后存到每一条对话记录里了
        saveHistoryStaff: function (img, name) {
            if (!this.hasStorage || !this.talkId) return;
            var his = this.initHistory(this.talkId);
            if (img && !his[this.talkId]["staffImg"]) {
                his[this.talkId]["staffImg"] = img || this.defaultStaffImg;
            }
            if (img && !his[this.talkId]["staffName"]) {
                //不存默认的?
                his[this.talkId]["staffName"] = name || lanRes.serviceStaff;
            }
            window.localStorage.setItem(this.historyKey, JSON.stringify(his));
        },
        /**
         * 检查是否显示加载更多历史的按钮
         * @returns {boolean}
         */
        checkHistory:function () {
            if (!this.hasStorage){
                $("#pre_his").hide();
                return false;
            }else if(window.SDK){
                return true;//后面收到了历史列表再检查
            }
            var hist = window.localStorage.getItem(this.historyKey);
            if (hist) {
                hist = JSON.parse(hist);
                var  order = hist.order, hlen = order.length;
                if (!hlen) {
                    $("#pre_his").hide();
                    return false;
                }else if(hlen==1){
                    if (order && order[0] && order[0] == this.talkId) {
                        $("#pre_his").hide();
                        return false
                    }
                }
            }else{
                $("#pre_his").hide();
                return false;
            }
            return true;
        },
        /**
         * 现在历史记录里面记录的是已经转义过的消息，避免emoji.json没有加载上时，
         * 返回标示true,代表需要从服务器拉取本次对话记录
         * 1.不支持localstorage
         * 2.扫一扫跨设备对话，即使支持localstorage也需要删掉本次对话记录，从服务器拉取
         * 已经加载过历史记录不需要拉取（等待对话过程中会加载历史，如果对话已经开始责会延迟到对话开始后加载）
         * 为了历史记录需要先
         */

        loadHistory: function (talkId,list) {//不支持按照talkId加载了
            if (!this.hasStorage || !this.hasPreHis)
                return false;
            if (this.loadingPreHis) {
                return;
            }
            var that = this;
            if(window.SDK){
                this.publish('__loadPreHistory');
                return;
            } else {
                this.loadingPreHis = true;
                var hist = window.localStorage.getItem(this.historyKey);
                hist && (hist = JSON.parse(hist));
            }
            if (hist) {
                if (this.chatToken && this.talkId && hist[this.talkId]) {//跨设备
                    //可能是跨设备，稍后请求服务器下发::已经改为本次对话记录都由服务器发送,
                    // 改为服务器发送的历史记录只追加
                    //delete hist[this.talkId];
                }
                if (talkId && (!hist[talkId]||!hist[talkId].order||hist[talkId].order.length==0)) {
                    //进入对话,指定TALKID加载,加载本次对话记录
                    return;
                }

                var today = new Date(), now = new Date().getTime(), orders = hist.order, hlen = orders.length;
                today.setHours(0, 0, 0, 0);
                today = today.getTime();

                if (hlen < 2) {
                    //没有可以加载的历史
                    //本次会话历史记录不再从本地历史中加载
                    that.hasPreHis = false;
                    that.loadingPreHis = false;
                    return false;
                }
                // $("#content").hide();
                for (var i = hlen - 2; i > -1; i--) {//遍历talkId
                    if(!orders[i]){
                        continue;
                    }
                    if(i==0){
                        //最后 一条记录,
                        that.hasPreHis = false;
                        $("#pre_his").hide();
                    }
                    var his = hist[orders[i]];
                   /* if (his && his["order"]) { 医疗版才删除
                        //这是对话消息的ORDER.查找对话记录是否是24小时内的。
                        var startTime = his["order"][0] ? (parseInt(his["order"][0])) : 0;
                        if (now - startTime > 86400000) {
                            delete hist[orders[i]];
                            orders.shift();//删除并返回数组的第一个元素
                            hlen--;
                            i--;//i=-1;
                            continue;
                        }
                    }*/
                   //没有历史 或者已经加载过了 显示上一个历史
                    var listHisEl = _$("list_msg_" + orders[i]);
                    if (!his || listHisEl) {
                        if($(listHisEl).hasClass('new-leave')){
                            $(listHisEl).removeClass('new-leave').attr('id',"list_msg_leave_" + orders[i])
                        }else{
                            continue;
                        }
                    }
                    console.log(his)
                    that.showHis(his, orders[i]);
                    break;
                }
            }
            // return !!this.chatToken;这个是什么意思?
        },
        hidePreHistory:function () {
            var that = this;
            that.loadingPreHis = false;
            that.hasPreHis = false;
            $("#pre_his").hide();
        },
        showPreHistory:function () {
            var that = this;
            that.loadingPreHis = false;
            that.hasPreHis = true;
            $("#pre_his").show();
        },
        showHis:function (his,talkId) {
            var it, html = '', that = this,firstShowTime;
            var currentStaffImg = this.staffImg;
            var currentStaffName = this.staffName;
            if(view.handleHis){
                view.handleHis(his,talkId);
            }
            if (his && his["staffImg"]) {
                this.staffImg = his["staffImg"];
            }
            if (his && his["staffName"]) {
                this.staffName = his["staffName"];
            }
            view.preHisLoadingId =  "list_msg_" + talkId;
            for (var key in his) {
                if (key == "order" || key == "staffImg" || key == "staffName" || key == "config") continue;
                it = $.extend({}, his[key]);
                it.talkId = talkId;
                //不再存储
                it.notStore = true;
                it.notEnd = true;
                //设置时间
                if (it.t && (it.t + "").indexOf(" ") == -1) {
                    it.t = that.getTimeStr(it.tm);
                }
                if(it.mt=='10001'){
                    //转接消息
                    that.publish("getSysMsg",it);
                    continue;
                }else if(it.mt=='10011'){
                    //图文
                    that.publish("receiveVisEvt",it);
                    continue;
                }else if(it.mt =='10010'){
                    that.publish("getSysMsg", it);
                    continue;
                }
                if (it.mt > 1000 && it.f != 'r') continue;
                if (it.mt == 865 || it.mt == 641) {
                    that.publish("getMsgImg", it);
                    continue;
                } else if (it.mt == 647 ) {
                    that.publish("getSysMsg", it);
                    continue;
                } else if (it.mt == 866 || it.mt == 642) {
                    that.publish("getMsgFile", it);
                    continue;
                }else if(it.mt == '12001'){
                    that.publish("getMsgRobot", it);
                    continue;
                }else if(it.mt == 655){
                    that.publish("getLeaveMsg", it);
                    continue;
                }else if(it.mt == 127){
                    that.publish('sendLocationInfo', it);
                    continue;
                }else if(it.mt == 680) {
                    that.publish("receiveURL", it);
                    continue;
                } else if (it.mt == 605 || it.mt == 10009) {
                    (it.mt == 605) && ( that.publish("getSysMsg", it));
                    $("#restartChat").remove();
                    that.showInfoTip('<div class="btn-restart" id="restartChat">' + lanRes.toContinueChat + '</div>',undefined,undefined,undefined,talkId,it.tm);
                    continue;
                }
                /*else if(it.mt==130||it.mt==12001||it.form=='r'){
                 //机器人收发消息
                 that.showMsg(it);
                 }*/
                /*else if (it.mt == 890) { //预约确认表
                 if (it.templateInfoList[0].type == 1 || it.templateInfoList[0].type == 3) {
                 it.content = that.getBookComfirm(it.templateInfoList);
                 it.m = 3;
                 } else {
                 it.content = that.showInfoTip('客服给您发送了一个预约表。', undefined, undefined, true)
                 it.m = 4;
                 }
                 }*/


                it.notAppend = true;
                if (it.m == 3 && it.c) {//预约确认表
                    it.c = this.getBookComfirm(it.c);
                }
                if (!it.c && it.content) {
                    it.c = it.content;
                }
                it.c && (html += this.showMsg(it));
                delete it.talkId;
            }

            this.staffImg = currentStaffImg;
            this.staffName = currentStaffName;
            view.scrollToLastPre(view.preHisLoadingId);
            setTimeout(function () {
                view.scrollToLastPre(view.preHisLoadingId);
                view.preHisLoadingId = null;
            },500)
            this.loadingPreHis = false;
        }
        ,
        clearHistoryByTalkId: function (talkId) {
            var hist = window.localStorage.getItem(this.historyKey);
            hist = hist ? JSON.parse(hist) : "";
            if (hist && hist[talkId]) {
                delete hist[talkId];
            }
        },
        /**
         *
         * @param talkId
         * @param tm
         * @param after 往前插入还是往后插入
         * @returns {Element}
         */
        getListMsgEl:function (talkId,tm,after) {
            if (talkId == this.talkId||!talkId) {
                return _$("list_msg");
            } else {
                var list = _$("list_msg_" + talkId);
                if (list)return list;
                $(".list-his-hr").removeClass('hide');
                list = document.createElement("ul");
                list.id = "list_msg_" + talkId;
                list.className = 'list-msg list-msg-his';
                list.innerHTML = '<li class="clearfix list-his-hr color1 hide"><i class="hr-left"></i><span>'+this.getTimeStr(tm)+'</span><i class="hr-right"></i></li>';
                _$("list_his").insertBefore(list,
                    after ? _$("list_msg") :
                        _$("pre_his").nextSibling);
                return list;
            }
        },
        /* 将对话移入一个ul*/
        handleSessionMsg:function (msg) {
            if(!msg.talkId){
                msg.talkId = Math.random();
                // return;
            }
            var talkId = msg.talkId;
            var list = _$("list_msg_" + talkId);
            if (list)return list;

            list = document.createElement("ul");
            list.id = "list_msg_" + talkId;
            list.className = 'list-msg list-msg-his';
            var nodes = _$("list_msg").childNodes;
            var node, i = 0;
            while (node = nodes[i++]) {
                if (node.nodeType == 1 ) {//内部广告iframe不再复制到之前的历史记录里面,防止多次加载,目前有机器人转人工、继续对话会有这个问题
                    // node = node.cloneNode(true);
                    i--;
                    if (node.className.indexOf('innerAD') != -1 && node.childNodes && node.childNodes[0].tagName == 'IFRAME') {
                        $(node).remove();
                    } else {
                        list.appendChild(node);
                    }
                }
            }
            // _$("list_msg").innerHTML = '';
            _$("list_his").insertBefore(list, _$("list_msg"));
            return list;
        },
        getTimeStr:function (tm) {
            tm = tm && (tm - 0) || undefined;
            var today = new Date(),str,minute = new Date(tm).format("hh:mm");
            tm = tm || today.getTime();
            today.setHours(0, 0, 0, 0);
            today = today.getTime();
            //判断 前天、昨天、今天
            if (tm >= today) {
                str = lanRes.today;
            } else if (today - tm <= 86400000) {
                str = lanRes.yesterday;
            } else if (today - tm <= 86400000 * 2) {
                str = lanRes.beforeYesterday;
            } else {
                str = new Date(tm).format("yyyy-MM-dd");
            }
            return str + ' ' + minute;
        },
        showSysTip: function (tip,tm, id, notScroll,talkId) {
            id = id || ("msg" + tm);
            if (view.staticPx2rem && tip) {
                tip = view.staticPx2rem(tip);
            }
            var time = (new Date(tm)).format('hh:mm')
            var str = '<li class="clearfix" id="' + id + '" ><div class="color1 tc">'+time
                +'</div></li><li class="clearfix tc" id="' + id + '" ><div class="msg-sys radius4 tc">' + tip + '</div></li>';
            var ul = document.createElement("ul");
            ul.innerHTML = str;
            var limsg = this.getListMsgEl(talkId,tm);
            var list = ul.childNodes, node, i = 0;
            while (node = list[i++]) {
                if (node.nodeType == 1) {
                    node = node.cloneNode(true);
                    limsg.appendChild(node);
                }
            }
            list = null;
            ul = null;
            !notScroll && setTimeout(view.scrollToBottom, 100);
        },
        showInfoTip: function (tip, id, type, notShow,talkId,tm,notEnd) {
            var that = this;
            // talkId默认that.talkId,tm 默认当前
            if(!tip){
                return;
            }
            if (view.staticPx2rem && tip) {
                tip = view.staticPx2rem(tip);
            }
            //todo
            if(this.msg649){
                var sysIcon = that.isInRobot ? (that.isMobile ? this.msg649.robotPhoneChatBox :view.windowType==2? this.msg649.robotSmallChatBox: this.msg649.robotPCChatBox) :
                    (this.msg649.chatBoxInfo || this.msg649.chatSmallBoxInfo || this.msg649.mobileChatBoxInfo)
                sysIcon = sysIcon && sysIcon.sysMsgIcon;
            }
            if (this.needHttps && sysIcon) {
                sysIcon = sysIcon.replace(/^http:/, this.needHttps);
            }
            //替换掉&nbsp;避免断词 连续&nbsp;只替换最后一个。 字符串最后一个&nbsp;不替换。
            tip = tip.replace(/&nbsp;([^&\s])/g, ' $1');
            tip = tip.replace(/\[\[#(toChat|endChat):(.+)\]\]/,function (match,sub1,sub2) {
                return '<span class="link-in-msg '+(sub1=='toChat'?'robot-staff ':sub1=='endChat'?'end-chat ':'')+'">'+sub2+'</span>'
            });
            id = id || ("msg" + (new Date().getTime()));
            type = type || "icon";//icon(等待提示语、欢迎语) warn(排队、留言)
            var str = '<li class="clearfix '+(this.showAvatar?'msg-info-hasAvatar':'')+'" id="' + id + '" ><div class="' + (that.isInRobot ? 'msg-info0' : 'msg-info') + ' radius4"><div class="info-' + type + '">'
                + (((type == 'icon') && sysIcon) ? '<img class="info-icon-img" src="' + sysIcon + '"/>' : '') + '</div><div class="info-con">' + tip + '</div></div></li>';
            if (notShow) return str;
            var ul = document.createElement("ul");
            ul.innerHTML = str;
            var limsg = this.getListMsgEl(talkId,tm);
            var list = ul.childNodes, node, i = 0;
            while (node = list[i++]) {
                if (node.nodeType == 1) {
                    node = node.cloneNode(true);
                    limsg.appendChild(node);
                }
            }
            list = null;
            ul = null;
            !notEnd &&setTimeout(view.scrollToBottom, 100);
        },
        /**
         * 展示满意度评价 客服推送和访客点击均可立即显示,对话结束后展示 需要判断配置中是否开启以及对话过程中是否已经评价了
         * @param fromType 1 对话结束 2客服推送  3访客点击
         */
        showSatisfy: function (fromType) {
            var that = this;
            if (that.allowEvaluateBaseWords > that.sendMsgNum && fromType == 1) {//对话结束 没有达到访客评价限制、不自动展示评价
                return false;
            }
            this.satisfyType = fromType;
            if ((fromType == 2 || fromType == 3) || (this.satisfyEnable && !this.satisfyShowed)) {
                //评价成功了才算评价过 到提交返回里面去限定
                // this.satisfyShowed = this.talkId;
                $("#mask").on('click',this.hideSatisfy).show();
                $("#satisfy").show();
                view.handleShowSatisfy && view.handleShowSatisfy();//大疆在用
                return true;
            } else {
                // 来自对话结束 本次对话评价过了的不再评价
                return false;
            }
        },
        hideSatisfy:function () {
            var that = view.chat;
            $("#satisfy").removeClass('satisfy-show').hide();
            $("#mask").hide().off('click',that.hideSatisfy);
            //对话结束后要关闭对话
            if (that.chatting === false) {
                that.publish("_closeWin");
                that.publish("__evaluate", '0-2');
            } else {
                that.publish("__evaluate", '0-1');
            }
            $.store('ECHAT_inviteSatisfyHandle',$.store('ECHAT_inviteSatisfyId'));
        },
        addJS: function (url, callback) {
            var node = document.createElement('script');
            node.setAttribute("type", "text/javascript");
            var head = _$s("head")[0];
            var supportOnload = "onload" in node;

            if (supportOnload) {
                node.onload = onload
                node.onerror = function () {
                    onload(true)
                }
            }
            else {
                node.onreadystatechange = function () {
                    if (/loaded|complete/.test(node.readyState)) {
                        onload()
                    }
                }
            }

            function onload(error) {
                // Ensure only run once and handle memory leak in IE
                node.onload = node.onerror = node.onreadystatechange = null

                // Remove the script to reduce memory leak
                head.removeChild(node);

                // Dereference the node
                node = null
                callback(error)
            }

            node.src = url;
            head.appendChild(node);
        },
        addCSS: function (url) {
            //增加css
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url//"/visitor/surfer/css/surfer.css";
            link.media = "screen";
            var head = _$s("head")[0];
            head.appendChild(link);
        }
        ,
        loadEmoji: function () {
            var that = this;
            if (that.emo) return;
            if(view.loadEmoji){
                return view.loadEmoji();
            }
            this.addCSS(that.isMobile && view.px2px ? __uri('/visitor/mobile/css/emoji.css') : that.isMobile ? locationBase+'/res/emoji/emoji_x2.css' : locationBase+'/res/emoji/emoji.css');
            $.ajax({
                url: locationBase + "/res/emoji/emoji.json",
                async: true,
                type: 'get',
                contentType: 'application/json;charset=UTF-8',
                data: undefined,
                beforeSend: function (xhr) {
                    //if(JSON.stringify(packet.headers).length<4)
                },
                success: function (data) {
                    that.emo = JSON.parse(data);
                },
                error: function (xhr, reason, exception) {
                    console.log("ajax emoji error");
                }
            });
            $.ajax({
                url: locationBase + "/res/emoji/emoji_"+(window.lanName.match(/^zh/)?'zh':'en')+".json",
                async: true,
                type: 'get',
                contentType: 'application/json;charset=UTF-8',
                data: undefined,
                beforeSend: function (xhr) {
                    //if(JSON.stringify(packet.headers).length<4)
                },
                success: function (data) {
                    that.emoLan = JSON.parse(data);
                    var lanEmo = {};
                    for(var code in that.emoLan){
                        lanEmo[that.emoLan[code]] = code;
                    }
                    that.lanEmo = lanEmo;
                },
                error: function (xhr, reason, exception) {
                    console.log("ajax emoji error");
                }
            });
            //设置表情菜单
            $.ajax({
                url: locationBase + "/res/emoji/emojiFace.json",
                async: true,
                type: 'get',
                contentType: 'application/json;charset=UTF-8',
                data: undefined,
                beforeSend: function (xhr) {
                    //if(JSON.stringify(packet.headers).length<4)
                },
                success: function (data) {
                    var list = JSON.parse(data);
                    view.initEmotion.call(that, list);
                     ///生成CSS 增加了QQ表情
                 /*   var css = [];
                    var i = 0, j = -1;
                    for (var k = 0; k < list.length; k++) {
                        if (i % 15 == 0) {
                            i = 0;
                            j++;
                        }
                        var key = list[k].replace(/^\[#([\d\w_]+)#\]/g, "$1");
                        css.push(".ej-k" + key + "{background-position:");
                        css.push(-i * 36.3);//pc和客服端36.3
                        css.push("px ");
                        css.push(-j * 36.8);//客服端37 34*34.PC访客端36.8 37*37
                        css.push("px;}");
                        i++;
                    }
                    console.log(list.length);*/
                   /* var css = [];
                    var i = 0, j = -1;
                    for (var k = 0; k < list.length; k++) {
                        if (i % 15 == 0) {
                            i = 0;
                            j++;
                        }
                        var key = list[k].replace(/^\[#([\d\w_]+)#\]/g, "$1");
                        css.push(".ej-k" + key + "{background-position:");
                        css.push(-i * 36);
                        css.push("px ");
                        css.push(-j * 36);
                        css.push("px;}");
                        i++;
                    }
                    console.log(css.join(""));*/


                    $("#emotion").on((window.SDK || (that.isMobile && !view.dji)) ? 'tap' : "click", ".emoji", function (e) {
                        //click ios qq内打开无法连续点击
                        that.insertImg($(this).attr("code"));
                        view.chat.handleInputLength();
                    });
                },
                error: function (xhr, reason, exception) {
                    console.log("ajax emoji error");
                }
            });
        }
        ,
        filterEmo: function (str) {
            if (!str) return str;
            var li = this.emo;
            //if (!li)return str;//表情库暂时没有加载出来，暂时自动替换，不考虑匹配。

            ////正则匹配
            //var range = ['\ud83c[\udf00-\udfff]',
            //'\ud83d[\udc00-\ude4f]',
            //'\ud83d[\ude80-\udeff]',
            //'[\u0023-\u00ae]',//35-174
            //'[\u203c-\u3299]'];//8252-12953
            //匹配键盘输入表情
            if (li) {
                str = str.replace(this.regFace, function (emo) {
                    var eo = arguments[0];
                    var h = emo.charCodeAt(0), l = emo.charCodeAt(1);
                    var e = (((h - 0xD800) << 10) + (l - 0xDC00) + 0x10000).toString(16);
                    if (li[e]) return '<img class="img-emo" src=\"'+ locationBase +'/res/emoji/32/' + e + '.png\" />';
                    if (li[h + "_" + l]) return '<img class="img-emo" src=\"' + locationBase + '/res/emoji/32/' + (h + "_" + l) + '.png\" />';
                    return emo;
                });
            }
            //匹配我们系统处理的表情[#1f6e3#][#1f6e3_if6e3#]这类
            str = str.replace(this.regEmo, function (emo) {
                var k = emo.replace(/^\[#([\d\w_]+)#\]/g, "$1");
                if ((li && li[k]) || (!li)) {
                    return '<img class="img-emo" src=\"'+ locationBase +'/res/emoji/32/' + k + '.png\" />';
                }
                return emo;
            });
            return str;

        },
        getFileSize: function (input) {
            var objValue = input.value;
            if (objValue == "") return;
            var fileLenth = -1;
            try {
                //对于IE判断要上传的文件的大小
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                fileLenth = parseInt(fso.getFile(objValue).size);
            } catch (e) {
                try {
                    //对于非IE获得要上传文件的大小
                    fileLenth = parseInt(input.files[0].size);
                } catch (e) {
                    fileLenth = -1;

                }
            }
            return fileLenth;
        },
        hasFormData:(function () {
            var hasPasteSend = true;
            try {
                (view.windowType == 1) && (new FileReader());
                new FormData()
            } catch (e) {
                hasPasteSend = false;
            }
            return hasPasteSend;
        })(),
        hasInitFile:false,
        addSendFile: function () {
            if(view.SDK){
                return;
            }
            var that = this;
            if(that.hasInitFile){
                if(that.hasFormData){

                }else{
                    var iframe = _$("file_up");
                    if (iframe) {
                        iframe.src = "/visitor/common/upload.html?t=" + (new Date().getTime());
                    }
                }
            }else {
                if (that.hasFormData) {
                    window.fLoad(document)
                } else {
                    var iframe = _$("file_up");
                    if(iframe){
                        return;
                    }
                    $('#uploadForm').remove();
                    $(".menu-file").append('<iframe src="/visitor/common/upload.html" style="filter:alpha(opacity=0.1);opacity: 0.1;position: absolute;top:0;left:0;z-index: 999999999;" allowtransparency="true" id="file_up" frameborder="0" framespacing="0" marginheight="0" marginwidth="0" width="100%" height="100%" scrolling="no"></iframe>')
                }
            }
        },
        isImgHasPreview:function (img) {
            //是否包含在 .msg-item .msg-info 消息里面的图片
            var $img = $(img);
            if ($img.hasClass('msg-img')) {
                return true;
            } if ($img.hasClass('img-emo')||$img.hasClass('custom-event-img')) {
                return false;
            }  else if ($img.parents('.msg-info') ||$img.parents('.msg-info0') || $img.parents('.msg-item')) {
                if (!$img.hasClass('info-icon-img') && !$img.parents('.portrait-title') && !$img.parents('.feedback-btns')) {
                    return true;
                }
            }
        }//,
       /* //保存对话窗口机器人和人工的颜色配置
        setChatbox(key,data){
            data && $.store('ECHAT_' + view.chat.companyId + "_" + key, JSON.stringify({
                chatStaffBackColor: data.chatStaffBackColor,
                chatStaffTxtColor: data.chatStaffTxtColor,
                chatVisitorBackColor: data.chatVisitorBackColor,
                chatVisitorTxtColor: data.chatVisitorTxtColor,
                sysMsgBackground: data.sysMsgBackground,
                sysMsgFontColor: data.sysMsgFontColor
            }), {path: '/', expires: 365});
        },
        getChatbox(key){
            var config = $.store('ECHAT_' + view.chat.companyId + "_" + key);
            return config && JSON.parse(config);
        }*/

    }
    window.imgLoadResizeSelf = function (img) {
        if (view.px2rem) {
            img.style.width = view.px2rem(img.naturalWidth || img.width)
        }
    }
    window.imgLoadResize = function (img, rId) {
        var i = Math.random();
        var wrapId = rId == -1 ? 'entry' : ("inviteBook" + rId),
            imgId = rId == -1 ? 'entryWrapImg' : ("inviteBookImg" + rId);

        function load() {
            var max = view.windowType == 1 ? 600 : 260
            var w = this.naturalWidth||this.width;
            var book = _$(wrapId);
            if (!book) return;
            if (w > max) {
                w = max;
            }
            book.style.width = view.px2rem ? (view.px2rem(w)) : (w + "px");
            if (rId == -1) {
                book.style.marginLeft = view.px2rem ? (view.px2rem(-w / 2)) : (-w / 2 + 'px');
            }
            $("#"+imgId).removeClass('hide').css('width',view.px2rem ? (view.px2rem(w)) : (w + "px"));
            view.scrollToBottom();
        }

        if (img.naturalWidth) {
            load.call(img);
        } else {
            var image = new Image();
            image.onload = load;
            image.src = img.src;
        }
    };
    var hasChat = false;
    $(function (e) {
        console.log('ready::::')
        // if (!hasChat) {
            hasChat = true;
            var chat = new Chat();
            window.initChat();
        // }
        //禁止火狐浏览器拖拽搜索
        if (chat.Browser.browser == 'firefox') {
            //禁止火狐浏览器拖拽搜索
            $('body').on('drop', function (event) {
                event.stopPropagation();
            })
        }
    });
})
(EChatQuery,document);

/**
 * * @require ../js/query.js
 */

//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
    var touch = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
        longTapDelay = 750,
        gesture

    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    function longTap() {
        longTapTimeout = null
        if (touch.last) {
            touch.el.trigger('longTap')
            touch = {}
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout)
        longTapTimeout = null
    }

    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout)
        if (tapTimeout) clearTimeout(tapTimeout)
        if (swipeTimeout) clearTimeout(swipeTimeout)
        if (longTapTimeout) clearTimeout(longTapTimeout)
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
        touch = {}
    }

    function isPrimaryTouch(event){
        return (event.pointerType == 'touch' ||
            event.pointerType == event.MSPOINTER_TYPE_TOUCH)
            && event.isPrimary
    }

    function isPointerEventType(e, type){
        return (e.type == 'pointer'+type ||
        e.type.toLowerCase() == 'mspointer'+type)
    }

    $(function(){
        var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

        if ('MSGesture' in window) {
            gesture = new MSGesture()
            gesture.target = document.body
        }

        $(document)
            .bind('MSGestureEnd', function(e){
                var swipeDirectionFromVelocity =
                    e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                if (touch.el && swipeDirectionFromVelocity) {
                    touch.el.trigger('swipe');
                    touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
                }
            })
            .on('touchstart MSPointerDown pointerdown', function(e){
                if((_isPointerType = isPointerEventType(e, 'down')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                if (e.touches && e.touches.length === 1 && touch.x2) {
                    // Clear out touch movement data if we have it sticking around
                    // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                    touch.x2 = undefined
                    touch.y2 = undefined
                }
                now = Date.now()
                delta = now - (touch.last || now)
                touch.el = $('tagName' in firstTouch.target ?
                    firstTouch.target : firstTouch.target.parentNode)
                touchTimeout && clearTimeout(touchTimeout)
                touch.x1 = firstTouch.pageX
                touch.y1 = firstTouch.pageY
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true
                touch.last = now
                longTapTimeout = setTimeout(longTap, longTapDelay)
                // adds the current touch contact for IE gesture recognition
                if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
            })
            .on('touchmove MSPointerMove pointermove', function(e){
                if((_isPointerType = isPointerEventType(e, 'move')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                cancelLongTap()
                touch.x2 = firstTouch.pageX
                touch.y2 = firstTouch.pageY

                deltaX += Math.abs(touch.x1 - touch.x2)
                deltaY += Math.abs(touch.y1 - touch.y2)
            })
            .on('touchend MSPointerUp pointerup', function(e){
                if((_isPointerType = isPointerEventType(e, 'up')) &&
                    !isPrimaryTouch(e)) return
                cancelLongTap()

                // swipe
                if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                    (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

                    touch.el&&( swipeTimeout = setTimeout(function() {
                        if(touch.el) {
                            touch.el.trigger('swipe');
                            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                            touch = {}
                        }
                    }, 0)
                    )

                // normal tap
                else if ('last' in touch)
                // don't fire tap when delta position changed by more than 30 pixels,
                // for instance when moving to a point and back to origin
                    if (deltaX < 30 && deltaY < 30) {
                        // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                        // ('tap' fires before 'scroll')
                        tapTimeout = setTimeout(function() {

                            // trigger universal 'tap' with the option to cancelTouch()
                            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                            var event = $.Event('tap')
                            if(!touch.el)return;
                            event.cancelTouch = cancelAll
                            if(touch.el){
                                touch.el.trigger(event)
                            }
                            // trigger double tap immediately
                            if (touch.isDoubleTap) {
                                if (touch.el) touch.el.trigger('doubleTap')
                                touch = {}
                            }

                            // trigger single tap after 250ms of inactivity
                            else {
                                touchTimeout = setTimeout(function(){
                                    touchTimeout = null
                                    if (touch.el) touch.el.trigger('singleTap')
                                    touch = {}
                                }, 250)
                            }
                        }, 0)
                    } else {
                        touch = {}
                    }
                deltaX = deltaY = 0

            })
            // when the browser window loses focus,
            // for example when a modal dialog is shown,
            // cancel all ongoing events
            .on('touchcancel MSPointerCancel pointercancel', cancelAll)

        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        $(window).on('scroll', cancelAll)
    })

    ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
            $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
        })
})(window.EChatQuery);