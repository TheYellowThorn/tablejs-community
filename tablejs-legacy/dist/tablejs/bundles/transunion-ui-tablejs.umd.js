(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators'), require('css-element-queries'), require('@angular/cdk/overlay'), require('@angular/cdk/portal'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('@transunion-ui/tablejs', ['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators', 'css-element-queries', '@angular/cdk/overlay', '@angular/cdk/portal', '@angular/platform-browser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global["transunion-ui"] = global["transunion-ui"] || {}, global["transunion-ui"].tablejs = {}), global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators, global.cssElementQueries, global.ng.cdk.overlay, global.ng.cdk.portal, global.ng.platformBrowser));
})(this, (function (exports, i0, common, rxjs, operators, cssElementQueries, overlay, portal, platformBrowser) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    var HorizResizeGripComponent = /** @class */ (function () {
        function HorizResizeGripComponent() {
        }
        return HorizResizeGripComponent;
    }());
    HorizResizeGripComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'tablejs-horiz-resize-grip',
                    template: "<i class=\"fas fa-angle-left fa-xs\"></i><i class=\"fas fa-angle-right fa-xs\"></i>",
                    host: { class: 'resize-grip' },
                    encapsulation: i0.ViewEncapsulation.None,
                    styles: [".resize-grip{cursor:ew-resize;position:absolute;right:0px;top:0px;height:100%;width:30px;padding:0;margin:0;display:block}.resize-grip i{left:.5px;color:#fff;position:relative;top:50%;transform:translateY(-8px)}\n"]
                },] }
    ];
    HorizResizeGripComponent.ctorParameters = function () { return []; };

    var ReorderGripComponent = /** @class */ (function () {
        function ReorderGripComponent() {
        }
        return ReorderGripComponent;
    }());
    ReorderGripComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'tablejs-reorder-grip',
                    template: "<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>\n<span class=\"dots-3\"></span>",
                    host: { class: 'col-dots-container' },
                    encapsulation: i0.ViewEncapsulation.None,
                    styles: ["@charset \"UTF-8\";.col-dots-container{cursor:move;cursor:grab;position:absolute;display:block;left:0px;top:0px;height:100%;width:30px;z-index:5}.col-dots-container .dots-3{display:inline-block;opacity:.5}th:hover .dots-3{display:inline-block;opacity:1}.dots-3{position:relative;top:50%;width:4px;display:inline-block;overflow:hidden;transform:translateY(-50%)}.dots-3:after{content:\"\\2807\";font-size:14px}\n"]
                },] }
    ];
    ReorderGripComponent.ctorParameters = function () { return []; };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function () { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }
    function __classPrivateFieldIn(state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function"))
            throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    }

    var DragAndDropGhostComponent = /** @class */ (function () {
        function DragAndDropGhostComponent(viewContainerRef, cdr) {
            this.viewContainerRef = viewContainerRef;
            this.cdr = cdr;
            this.left = 0;
            this.top = 0;
            this._contextToLoad = null;
        }
        DragAndDropGhostComponent.prototype.ngAfterViewInit = function () {
            this.ref.clear();
            if (this._templateToLoad) {
                this.ref.createEmbeddedView(this._templateToLoad, this._contextToLoad);
                this.cdr.detectChanges();
            }
        };
        DragAndDropGhostComponent.prototype.updateView = function (template, context) {
            if (context === void 0) { context = null; }
            this._templateToLoad = template;
            this._contextToLoad = context;
        };
        DragAndDropGhostComponent.prototype.getTransform = function () {
            return 'translate(' + this.left + 'px, ' + this.top + 'px';
        };
        return DragAndDropGhostComponent;
    }());
    DragAndDropGhostComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'tablejs-drag-and-drop-ghost',
                    template: "<div class=\"drag-and-drop-ghost\" [ngStyle]=\"{ 'transform': getTransform() }\">\n    <div #ref style=\"display: none;\"></div>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    host: { class: 'drag-and-drop-ghost' },
                    styles: [".drag-and-drop-ghost{position:fixed;display:block;width:100%;height:100px;top:0px;left:0px;padding:0;margin:0;align-items:center;cursor:move!important;font-size:14px;overflow:visible;text-overflow:ellipsis;-webkit-user-select:none;user-select:none;z-index:10;opacity:1}.drag-and-drop-ghost img{pointer-events:none;position:inherit;border:1px solid #dddddd}\n"]
                },] }
    ];
    DragAndDropGhostComponent.ctorParameters = function () { return [
        { type: i0.ViewContainerRef },
        { type: i0.ChangeDetectorRef }
    ]; };
    DragAndDropGhostComponent.propDecorators = {
        ref: [{ type: i0.ViewChild, args: ['ref', { read: i0.ViewContainerRef },] }]
    };

    var TablejsGridProxy = /** @class */ (function () {
        function TablejsGridProxy() {
        }
        return TablejsGridProxy;
    }());
    TablejsGridProxy.GRID_COUNT = 0;

    var GridService = /** @class */ (function () {
        function GridService() {
            this.linkedDirectiveObjs = {};
            this.containsInitialWidthSettings = new rxjs.BehaviorSubject(undefined);
        }
        GridService.prototype.getParentTablejsGridDirective = function (el) {
            while (el !== null && el.getAttribute('tablejsGrid') === null) {
                el = el.parentElement;
            }
            return el;
        };
        GridService.prototype.triggerHasInitialWidths = function (hasWidths) {
            this.containsInitialWidthSettings.next(hasWidths);
        };
        return GridService;
    }());
    GridService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function GridService_Factory() { return new GridService(); }, token: GridService, providedIn: "root" });
    GridService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    GridService.ctorParameters = function () { return []; };

    var DirectiveRegistrationService = /** @class */ (function () {
        function DirectiveRegistrationService(gridService) {
            this.gridService = gridService;
            this.nexuses = [];
        }
        DirectiveRegistrationService.prototype.setVirtualNexus = function (virtualForDirective, scrollViewportDirective) {
            var nexus = {
                scrollViewportDirective: scrollViewportDirective,
                virtualForDirective: virtualForDirective
            };
            this.nexuses.push(nexus);
            return nexus;
        };
        DirectiveRegistrationService.prototype.getVirtualNexusFromViewport = function (scrollViewportDirective) {
            return this.nexuses.filter(function (nexus) { return nexus.scrollViewportDirective === scrollViewportDirective; })[0];
        };
        DirectiveRegistrationService.prototype.registerNodeAttributes = function (node) {
            if (node.getAttribute) {
                if (node.getAttribute('reordergrip') !== null) {
                    this.registerReorderGripOnGridDirective(node, true);
                }
                if (node.getAttribute('resizablegrip') !== null) {
                    this.registerResizableGripOnGridDirective(node, true);
                }
                if (node.getAttribute('tablejsDataColClasses') !== null) {
                    this.registerDataColClassesOnGridDirective(node, true);
                }
                if (node.getAttribute('tablejsDataColClass') !== null) {
                    this.registerDataColClassOnGridDirective(node, true);
                }
                if (node.getAttribute('tablejsGridRow') !== null) {
                    this.registerRowsOnGridDirective(node, true);
                }
            }
        };
        DirectiveRegistrationService.prototype.registerReorderGripOnGridDirective = function (node, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            var el = this.gridService.getParentTablejsGridDirective(node);
            if (el !== null) {
                el['gridDirective'].addReorderGrip(node, fromMutation);
            }
        };
        DirectiveRegistrationService.prototype.registerResizableGripOnGridDirective = function (node, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            var el = this.gridService.getParentTablejsGridDirective(node);
            if (el !== null) {
                el['gridDirective'].addResizableGrip(node, fromMutation);
            }
        };
        DirectiveRegistrationService.prototype.registerDataColClassesOnGridDirective = function (node, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            var el = this.gridService.getParentTablejsGridDirective(node);
            node.dataClasses = node.getAttribute('tablejsdatacolclasses').replace(new RegExp(' ', 'g'), '').split(',');
            el['gridDirective'].addColumnsWithDataClasses(node, fromMutation);
        };
        DirectiveRegistrationService.prototype.registerDataColClassOnGridDirective = function (node, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            var el = this.gridService.getParentTablejsGridDirective(node);
            if (!el) {
                return;
            }
            var cls = node.getAttribute('tablejsDataColClass');
            if (cls) {
                node.classList.add(cls);
            }
            var initialWidth = node.getAttribute('initialWidth');
            this.gridService.triggerHasInitialWidths(initialWidth ? true : false);
            el['gridDirective'].initialWidths[cls] = initialWidth;
        };
        DirectiveRegistrationService.prototype.registerRowsOnGridDirective = function (node, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            node.classList.add('reorderable-table-row');
            var el = this.gridService.getParentTablejsGridDirective(node);
            if (el !== null) {
                el['gridDirective'].addRow(node, fromMutation);
            }
        };
        DirectiveRegistrationService.prototype.registerViewportOnGridDirective = function (node) {
            var el = this.gridService.getParentTablejsGridDirective(node);
            if (el !== null) {
                el['gridDirective'].infiniteScrollViewports = [node];
            }
        };
        return DirectiveRegistrationService;
    }());
    DirectiveRegistrationService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function DirectiveRegistrationService_Factory() { return new DirectiveRegistrationService(i0__namespace.ɵɵinject(GridService)); }, token: DirectiveRegistrationService, providedIn: "root" });
    DirectiveRegistrationService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    DirectiveRegistrationService.ctorParameters = function () { return [
        { type: GridService }
    ]; };

    var ColumnReorderEvent = /** @class */ (function () {
        function ColumnReorderEvent() {
        }
        return ColumnReorderEvent;
    }());
    ColumnReorderEvent.ON_REORDER = 'onReorder';
    ColumnReorderEvent.ON_REORDER_START = 'onReorderStart';
    ColumnReorderEvent.ON_REORDER_END = 'onReorderEnd';

    var ColumnResizeEvent = /** @class */ (function () {
        function ColumnResizeEvent() {
        }
        return ColumnResizeEvent;
    }());
    ColumnResizeEvent.ON_RESIZE = 'onResize';
    ColumnResizeEvent.ON_RESIZE_START = 'onResizeStart';
    ColumnResizeEvent.ON_RESIZE_END = 'onResizeEnd';

    var GridEvent = /** @class */ (function () {
        function GridEvent() {
        }
        return GridEvent;
    }());
    GridEvent.ON_INITIALIZED = 'onInitialized';

    var ScrollViewportEvent = /** @class */ (function () {
        function ScrollViewportEvent() {
        }
        return ScrollViewportEvent;
    }());
    ScrollViewportEvent.ON_ITEM_ADDED = 'onItemAdded';
    ScrollViewportEvent.ON_ITEM_REMOVED = 'onItemRemoved';
    ScrollViewportEvent.ON_ITEM_UPDATED = 'onItemUpdated';
    ScrollViewportEvent.ON_RANGE_UPDATED = 'onRangeUpdated';
    ScrollViewportEvent.ON_VIEWPORT_SCROLLED = 'onViewportScrolled';
    ScrollViewportEvent.ON_VIEWPORT_READY = 'onViewportReady';
    ScrollViewportEvent.ON_VIEWPORT_INITIALIZED = 'onViewportInitialized';

    var ScrollDispatcherService = /** @class */ (function () {
        function ScrollDispatcherService() {
        }
        ScrollDispatcherService.prototype.dispatchAddItemEvents = function (eventEmitter, element, i, viewport, viewportElement) {
            eventEmitter.emit({
                element: element,
                index: i,
                viewport: viewport,
                viewportElement: viewportElement
            });
            var itemAddedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_ADDED, {
                detail: {
                    element: element,
                    index: i,
                    viewport: viewport,
                    viewportElement: viewportElement
                }
            });
            viewportElement.dispatchEvent(itemAddedEvent);
        };
        ScrollDispatcherService.prototype.dispatchUpdateItemEvents = function (eventEmitter, element, index, viewport, viewportElement) {
            eventEmitter.emit({
                element: element,
                index: index,
                viewport: viewport,
                viewportElement: viewportElement
            });
            var itemUpdatedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_UPDATED, {
                detail: {
                    element: element,
                    index: index,
                    viewport: viewport,
                    viewportElement: viewportElement
                }
            });
            viewportElement.dispatchEvent(itemUpdatedEvent);
        };
        ScrollDispatcherService.prototype.dispatchRemoveItemEvents = function (eventEmitter, element, i, viewport, viewportElement) {
            eventEmitter.emit({
                element: element,
                index: i,
                viewport: viewport,
                viewportElement: viewportElement
            });
            var itemRemovedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_REMOVED, {
                detail: {
                    element: element,
                    index: i,
                    viewport: viewport,
                    viewportElement: viewportElement
                }
            });
            viewportElement.dispatchEvent(itemRemovedEvent);
        };
        ScrollDispatcherService.prototype.dispatchViewportReadyEvents = function (eventEmitter, viewport, viewportElement) {
            eventEmitter.emit({
                viewport: viewport,
                viewportElement: viewportElement
            });
            var viewportReadyEvent = new CustomEvent(ScrollViewportEvent.ON_VIEWPORT_READY, {
                detail: {
                    viewport: viewport,
                    viewportElement: viewportElement
                }
            });
            viewportElement.dispatchEvent(viewportReadyEvent);
        };
        ScrollDispatcherService.prototype.dispatchViewportInitializedEvents = function (eventEmitter, viewport, viewportElement) {
            eventEmitter.emit({
                viewport: viewport,
                viewportElement: viewportElement
            });
            var viewportInitializedEvent = new CustomEvent(ScrollViewportEvent.ON_VIEWPORT_INITIALIZED, {
                detail: {
                    viewport: viewport,
                    viewportElement: viewportElement
                }
            });
            viewportElement.dispatchEvent(viewportInitializedEvent);
        };
        ScrollDispatcherService.prototype.dispatchRangeUpdateEvents = function (eventEmitter, range, viewport, viewportElement) {
            eventEmitter.emit({
                range: range,
                viewport: viewport,
                viewportElement: viewportElement
            });
            var rangeUpdatedEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_ADDED, {
                detail: {
                    range: range,
                    viewport: viewport,
                    viewportElement: viewportElement
                }
            });
            viewportElement.dispatchEvent(rangeUpdatedEvent);
        };
        ScrollDispatcherService.prototype.dispatchViewportScrolledEvents = function (eventEmitter, scrollTop, overflow, viewport, viewportElement) {
            eventEmitter.emit({
                scrollTop: scrollTop,
                firstItemOverflow: overflow,
                viewport: viewport,
                viewportElement: viewportElement
            });
            var viewportScrolledEvent = new CustomEvent(ScrollViewportEvent.ON_ITEM_ADDED, {
                detail: {
                    scrollTop: scrollTop,
                    firstItemOverflow: overflow,
                    viewport: viewport,
                    viewportElement: viewportElement
                }
            });
            viewportElement.dispatchEvent(viewportScrolledEvent);
        };
        return ScrollDispatcherService;
    }());
    ScrollDispatcherService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function ScrollDispatcherService_Factory() { return new ScrollDispatcherService(); }, token: ScrollDispatcherService, providedIn: "root" });
    ScrollDispatcherService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    ScrollDispatcherService.ctorParameters = function () { return []; };

    var TablejsForOfContext = /** @class */ (function () {
        function TablejsForOfContext($implicit, tablejsVirtualForOf, index, count) {
            this.$implicit = $implicit;
            this.tablejsVirtualForOf = tablejsVirtualForOf;
            this.index = index;
            this.count = count;
        }
        Object.defineProperty(TablejsForOfContext.prototype, "first", {
            get: function () {
                return this.index === 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TablejsForOfContext.prototype, "last", {
            get: function () {
                return this.index === this.count - 1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TablejsForOfContext.prototype, "even", {
            get: function () {
                return this.index % 2 === 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TablejsForOfContext.prototype, "odd", {
            get: function () {
                return !this.even;
            },
            enumerable: false,
            configurable: true
        });
        return TablejsForOfContext;
    }());
    var VirtualForDirective = /** @class */ (function () {
        function VirtualForDirective(_viewContainer, _template, _differs, elementRef, directiveRegistrationService) {
            var _this = this;
            this._viewContainer = _viewContainer;
            this._template = _template;
            this._differs = _differs;
            this.elementRef = elementRef;
            this.directiveRegistrationService = directiveRegistrationService;
            this.changes = new rxjs.Subject();
            this._tablejsForOf = null;
            this._differ = null;
            var parent = this._viewContainer.element.nativeElement.parentElement;
            while (parent !== null && parent !== undefined && parent.scrollViewportDirective === undefined) {
                parent = parent.parentElement;
            }
            if (parent === null || parent === undefined) {
                throw Error('No scrollViewportDirective found for tablejsForOf.  Declare a scrollViewport using the scrollViewportDirective.');
            }
            else {
                this._scrollViewportDirective = parent.scrollViewportDirective;
                this.virtualNexus = this.directiveRegistrationService.setVirtualNexus(this, this._scrollViewportDirective);
                this._lastRange = this._scrollViewportDirective.range;
                this.rangeUpdatedSubscription$ = this._scrollViewportDirective.rangeUpdated.subscribe(function (rangeObj) {
                    if (_this.rangeIsDifferent(_this._lastRange, rangeObj.range)) {
                        _this._lastRange = rangeObj.range;
                        _this._renderedItems = Array.from(_this._tablejsForOf).slice(_this._lastRange.extendedStartIndex, _this._lastRange.extendedEndIndex);
                        _this._onRenderedDataChange(false);
                    }
                });
            }
        }
        Object.defineProperty(VirtualForDirective.prototype, "tablejsVirtualForOf", {
            set: function (tablejsVirtualForOf) {
                this._tablejsForOf = tablejsVirtualForOf;
                this._onRenderedDataChange();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Asserts the correct type of the context for the template that `TablejsForOf` will render.
         *
         * The presence of this method is a signal to the Ivy template type-check compiler that the
         * `TablejsForOf` structural directive renders its template with a specific context type.
         */
        VirtualForDirective.ngTemplateContextGuard = function (dir, ctx) {
            return true;
        };
        Object.defineProperty(VirtualForDirective.prototype, "tablejsVirtualForTemplate", {
            /**
             * A reference to the template that is stamped out for each item in the iterable.
             * @see [template reference variable](guide/template-reference-variables)
             */
            set: function (value) {
                if (value) {
                    this._template = value;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VirtualForDirective.prototype, "template", {
            get: function () {
                return this._template;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VirtualForDirective.prototype, "tablejsVirtualForTrackBy", {
            get: function () {
                return this._tablejsVirtualForTrackBy;
            },
            set: function (fn) {
                var _this = this;
                this._tablejsVirtualForTrackBy = fn ?
                    function (index, item) { return fn(index + (_this._lastRange ? _this._lastRange.extendedStartIndex : 0), item); } :
                    undefined;
                this._onRenderedDataChange();
            },
            enumerable: false,
            configurable: true
        });
        VirtualForDirective.prototype.rangeIsDifferent = function (range1, range2) {
            return range1.endIndex === range2.endIndex && range1.extendedEndIndex === range2.extendedEndIndex && range1.startIndex === range2.startIndex && range1.extendedStartIndex === range2.extendedStartIndex;
        };
        VirtualForDirective.prototype.renderedItemsNeedUpdate = function () {
            return this._renderedItems.length !== this._lastRange.extendedEndIndex - this._lastRange.extendedStartIndex;
        };
        VirtualForDirective.prototype._onRenderedDataChange = function (updateRenderedItems) {
            var _this = this;
            if (updateRenderedItems === void 0) { updateRenderedItems = true; }
            if (!this._renderedItems) {
                return;
            }
            if (updateRenderedItems) {
                this._renderedItems = Array.from(this._tablejsForOf).slice(this._lastRange.extendedStartIndex, this._lastRange.extendedEndIndex);
            }
            if (!this._differ) {
                this._differ = this._differs.find(this._renderedItems).create(function (index, item) {
                    return _this.tablejsVirtualForTrackBy ? _this.tablejsVirtualForTrackBy(index, item) : item;
                });
            }
        };
        VirtualForDirective.prototype.ngDoCheck = function () {
            this.updateItems();
        };
        VirtualForDirective.prototype.updateItems = function () {
            var _this = this;
            if (this._differ) {
                var scrollToOrigin = this._tablejsForOf !== this._lastTablejsForOf;
                var diffChanges = null;
                if (this.renderedItemsNeedUpdate()) {
                    this._onRenderedDataChange();
                }
                try {
                    diffChanges = this._differ.diff(this._renderedItems);
                }
                catch (_a) {
                    this._differ = this._differs.find(this._renderedItems).create(function (index, item) {
                        return _this.tablejsVirtualForTrackBy ? _this.tablejsVirtualForTrackBy(index, item) : item;
                    });
                }
                if (scrollToOrigin) {
                    this._lastTablejsForOf = this._tablejsForOf;
                }
                if (diffChanges || scrollToOrigin) {
                    this.changes.next({ tablejsForOf: this._tablejsForOf, scrollToOrigin: scrollToOrigin });
                }
            }
        };
        VirtualForDirective.prototype.ngOnDestroy = function () {
            this.rangeUpdatedSubscription$.unsubscribe();
        };
        return VirtualForDirective;
    }());
    VirtualForDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[tablejsVirtualFor][tablejsVirtualForOf]' },] }
    ];
    VirtualForDirective.ctorParameters = function () { return [
        { type: i0.ViewContainerRef },
        { type: i0.TemplateRef },
        { type: i0.IterableDiffers },
        { type: i0.ElementRef },
        { type: DirectiveRegistrationService }
    ]; };
    VirtualForDirective.propDecorators = {
        tablejsVirtualForOf: [{ type: i0.Input }],
        tablejsVirtualForTemplate: [{ type: i0.Input }],
        tablejsVirtualForTrackBy: [{ type: i0.Input }]
    };

    var OperatingSystemService = /** @class */ (function () {
        function OperatingSystemService() {
        }
        OperatingSystemService.prototype.getOS = function () {
            var userAgent = window.navigator.userAgent;
            var platform = window.navigator.platform;
            var macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
            var windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
            var iosPlatforms = ['iPhone', 'iPad', 'iPod'];
            var os = null;
            if (macosPlatforms.indexOf(platform) !== -1) {
                os = 'Mac OS';
            }
            else if (iosPlatforms.indexOf(platform) !== -1) {
                os = 'iOS';
            }
            else if (windowsPlatforms.indexOf(platform) !== -1) {
                os = 'Windows';
            }
            else if (/Android/.test(userAgent)) {
                os = 'Android';
            }
            else if (!os && /Linux/.test(platform)) {
                os = 'Linux';
            }
            return os;
        };
        OperatingSystemService.prototype.isMac = function () {
            return this.getOS() === 'Mac OS' || this.getOS() === 'iOS';
        };
        OperatingSystemService.prototype.isPC = function () {
            return this.getOS() === 'Windows';
        };
        return OperatingSystemService;
    }());
    OperatingSystemService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function OperatingSystemService_Factory() { return new OperatingSystemService(); }, token: OperatingSystemService, providedIn: "root" });
    OperatingSystemService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    OperatingSystemService.ctorParameters = function () { return []; };

    var ScrollPrevSpacerComponent = /** @class */ (function () {
        function ScrollPrevSpacerComponent(elementRef) {
            this.elementRef = elementRef;
        }
        return ScrollPrevSpacerComponent;
    }());
    ScrollPrevSpacerComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'tablejs-scroll-prev-spacer',
                    template: "\n<ng-template #template>\n    <tr tablejsPrevSpacer style=\"display: block; position: relative;\"></tr>\n</ng-template>\n",
                    styles: [""]
                },] }
    ];
    ScrollPrevSpacerComponent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    ScrollPrevSpacerComponent.propDecorators = {
        template: [{ type: i0.ViewChild, args: ['template', { static: true },] }]
    };

    var ScrollViewportDirective = /** @class */ (function () {
        function ScrollViewportDirective(elementRef, gridService, document, directiveRegistrationService, scrollDispatcherService, operatingSystem, componentFactoryResolver, cdr, rendererFactory) {
            this.elementRef = elementRef;
            this.gridService = gridService;
            this.document = document;
            this.directiveRegistrationService = directiveRegistrationService;
            this.scrollDispatcherService = scrollDispatcherService;
            this.operatingSystem = operatingSystem;
            this.componentFactoryResolver = componentFactoryResolver;
            this.cdr = cdr;
            this.rendererFactory = rendererFactory;
            this.templateRef = null;
            this.templateID = '';
            this.generateCloneMethod = null;
            this._arrowUpSpeed = 1;
            this._arrowDownSpeed = 1;
            this._preItemOverflow = 1;
            this._postItemOverflow = 1;
            this._itemLoadLimit = Infinity;
            this.items = null;
            // Custom Elements Inputs
            this.templateid = null;
            this.preitemoverflow = 1;
            this.postitemoverflow = 1;
            this.arrowupspeed = 1;
            this.arrowdownspeed = 1;
            this.itemloadlimit = Infinity;
            this.itemAdded = new i0.EventEmitter();
            this.itemRemoved = new i0.EventEmitter();
            this.itemUpdated = new i0.EventEmitter();
            this.rangeUpdated = new i0.EventEmitter();
            this.viewportScrolled = new i0.EventEmitter();
            this.viewportReady = new i0.EventEmitter();
            this.viewportInitialized = new i0.EventEmitter();
            this.containerHeight = null;
            this.heightLookup = {};
            this.itemVisibilityLookup = {};
            this.listElm = null;
            this.listContent = null;
            this.prevSpacer = null;
            this.postSpacer = null;
            this.gridDirective = null;
            this.pauseViewportRenderUpdates = false;
            this.range = { startIndex: 0, endIndex: 1, extendedStartIndex: 0, extendedEndIndex: 1 };
            this.lastRange = { startIndex: this.range.startIndex, endIndex: this.range.endIndex, extendedStartIndex: this.range.extendedStartIndex, extendedEndIndex: this.range.extendedEndIndex };
            this.lastScrollTop = 0;
            this.currentScrollTop = 0;
            this.currentScrollChange = 0;
            this.template = null;
            this.estimatedFullContentHeight = 0;
            this.estimatedPreListHeight = 0;
            this.estimatedPostListHeight = 0;
            this.totalItemsCounted = 0;
            this.totalHeightCount = 0;
            this.itemName = '';
            this.overflowHeightCount = 0;
            this.scrollChangeByFirstIndexedItem = 0;
            this.lastVisibleItemHeight = Infinity;
            this.adjustedStartIndex = null;
            this.forcedEndIndex = undefined;
            this.placeholderObject = {};
            this.postItemOverflowCount = -1;
            this.preItemOverflowCount = -1;
            this.lastVisibleItemOverflow = 0;
            this.preOverflowHeight = 0;
            this.mouseIsOverViewport = false;
            this.lastHeight = 0;
            this.observer = null;
            this.handleMouseOver = null;
            this.handleMouseOut = null;
            this.handleKeyDown = null;
            this.cloneFromTemplateRef = false;
            this.viewportHasScrolled = false;
            this.templateContext = null;
            this.virtualNexus = null;
            this._cloneMethod = null;
            this.onTransitionEnd = function (e) {
            };
            this.onTransitionRun = function (e) {
            };
            this.onTransitionStart = function (e) {
            };
            this.onTransitionCancel = function (e) {
            };
            this.renderer = this.rendererFactory.createRenderer(null, null);
            this.elementRef.nativeElement.scrollViewportDirective = this;
        }
        Object.defineProperty(ScrollViewportDirective.prototype, "arrowUpSpeed", {
            get: function () {
                return Number(this._arrowUpSpeed);
            },
            set: function (value) {
                this._arrowUpSpeed = Number(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ScrollViewportDirective.prototype, "arrowDownSpeed", {
            get: function () {
                return Number(this._arrowDownSpeed);
            },
            set: function (value) {
                this._arrowDownSpeed = Number(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ScrollViewportDirective.prototype, "preItemOverflow", {
            get: function () {
                return Number(this._preItemOverflow);
            },
            set: function (value) {
                this._preItemOverflow = Number(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ScrollViewportDirective.prototype, "postItemOverflow", {
            get: function () {
                return Number(this._postItemOverflow);
            },
            set: function (value) {
                this._postItemOverflow = Number(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ScrollViewportDirective.prototype, "itemLoadLimit", {
            get: function () {
                return Number(this._itemLoadLimit);
            },
            set: function (value) {
                this._itemLoadLimit = Number(value);
            },
            enumerable: false,
            configurable: true
        });
        ScrollViewportDirective.prototype.handleScroll = function (e) {
            e.preventDefault();
            this.currentScrollTop = this.listContent.scrollTop;
            this.currentScrollChange = this.currentScrollTop - this.lastScrollTop;
            this.scrollChangeByFirstIndexedItem += this.currentScrollChange;
            this.lastVisibleItemOverflow -= this.currentScrollChange;
            var newRange = this.getRangeChange(this.scrollChangeByFirstIndexedItem);
            this.updateScrollFromRange(newRange);
            this.scrollDispatcherService.dispatchViewportScrolledEvents(this.viewportScrolled, this.lastScrollTop, this.scrollChangeByFirstIndexedItem, this, this.elementRef.nativeElement);
        };
        ScrollViewportDirective.prototype.registerViewportToElement = function () {
            this.elementRef.nativeElement.scrollViewport = this;
        };
        ScrollViewportDirective.prototype.attachMutationObserver = function () {
            var ths = this;
            this.observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    ths.updateMutations(mutation);
                });
            });
            this.observer.observe(this.listContent, {
                // configure it to listen to attribute changes
                attributes: true,
                subtree: true,
                childList: true
            });
        };
        ScrollViewportDirective.prototype.updateMutations = function (mutation) {
            var _this = this;
            if (mutation.type === 'childList') {
                var addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(function (node) {
                    _this.directiveRegistrationService.registerNodeAttributes(node);
                    _this.getChildNodes(node);
                });
            }
        };
        ScrollViewportDirective.prototype.getChildNodes = function (node) {
            var _this = this;
            node.childNodes.forEach(function (childNode) {
                _this.directiveRegistrationService.registerNodeAttributes(childNode);
                if (childNode.childNodes) {
                    _this.getChildNodes(childNode);
                }
            });
        };
        ScrollViewportDirective.prototype.registerCustomElementsInputs = function (viewport) {
            this.templateID = viewport.getAttribute('templateID');
            this.preItemOverflow = Number(viewport.getAttribute('preItemOverflow'));
            this.postItemOverflow = Number(viewport.getAttribute('postItemOverflow'));
            this.itemLoadLimit = Number(viewport.getAttribute('itemLoadLimit'));
            this.arrowUpSpeed = Number(viewport.getAttribute('arrowUpSpeed'));
            this.arrowDownSpeed = Number(viewport.getAttribute('arrowDownSpeed'));
            this.fillViewportScrolling = viewport.getAttribute('fillViewportScrolling');
        };
        ScrollViewportDirective.prototype.convertCustomElementsVariables = function () {
            if (this.templateid) {
                this.templateID = this.templateid;
            }
            if (this.preitemoverflow) {
                this.preItemOverflow = Number(this.preitemoverflow);
            }
            if (this.postitemoverflow) {
                this.postItemOverflow = Number(this.postitemoverflow);
            }
            if (this.arrowdownspeed) {
                this.arrowDownSpeed = Number(this.arrowdownspeed);
            }
            if (this.arrowupspeed) {
                this.arrowUpSpeed = Number(this.arrowupspeed);
            }
            if (this.itemloadlimit !== null) {
                this.itemLoadLimit = Number(this.itemloadlimit);
            }
        };
        ScrollViewportDirective.prototype.createTBodies = function () {
            this.listElm = this.elementRef.nativeElement;
            var body = this.listElm.getElementsByTagName('tbody')[0];
            if (body) {
                body = body.getAttribute('tablejsViewport') !== null ? body : null;
            }
            this.listContent = body ? body : document.createElement('tbody');
            this.listContent.setAttribute('tablejsListContent', '');
            this.listContent.setAttribute('tablejsViewport', '');
            this.listContent.style.display = 'block';
            this.listContent.style.position = 'relative';
            this.listContent.style.height = '350px';
            this.listContent.style.overflowY = 'auto';
            this.listElm.appendChild(this.listContent);
            if (this.fillViewportScrolling !== undefined && this.fillViewportScrolling !== null) {
                var coverBody = document.createElement('tbody');
                coverBody.style.display = 'block';
                coverBody.style.position = 'absolute';
                coverBody.style.width = '100%';
                coverBody.style.height = '100%';
                coverBody.style.overflow = 'auto';
                coverBody.style.pointerEvents = 'none';
                coverBody.style.visibility = 'false';
                this.listElm.appendChild(coverBody);
            }
            this.directiveRegistrationService.registerViewportOnGridDirective(this.listContent);
            var compFactory = this.componentFactoryResolver.resolveComponentFactory(ScrollPrevSpacerComponent);
            var componentRef = this.virtualNexus.virtualForDirective._viewContainer.createComponent(compFactory, null, this.virtualNexus.virtualForDirective._viewContainer.injector);
            this.virtualNexus.virtualForDirective._viewContainer.detach(0);
            var ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(componentRef.instance.template, undefined, 0);
            this.prevSpacer = ref.rootNodes[0];
            this.postSpacer = document.createElement('tr');
            this.postSpacer.setAttribute('tablejsPostSpacer', '');
            this.postSpacer.style.display = 'block';
            this.postSpacer.style.position = 'relative';
            this.listContent.appendChild(this.postSpacer);
        };
        ScrollViewportDirective.prototype.addScrollHandler = function () {
            var _this = this;
            this.listContent.addEventListener('scroll', function (e) {
                _this.handleScroll(e);
            });
        };
        ScrollViewportDirective.prototype.rerenderRowAt = function (index, updateScrollPosition) {
            if (updateScrollPosition === void 0) { updateScrollPosition = false; }
            if (!this.viewportHasScrolled) {
                return;
            }
            var ind = index - this.adjustedStartIndex;
            var itemName = 'item' + index;
            if (ind > this.items.length - 1 || this.itemVisibilityLookup[this.itemName] !== true) {
                return;
            }
            var indexMap = {};
            for (var i = 1; i < this.virtualNexus.virtualForDirective._viewContainer.length; i++) {
                indexMap[this.virtualNexus.virtualForDirective._viewContainer.get(i).rootNodes[0].index] = i;
            }
            ;
            var detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(indexMap[index]);
            var child = detachedRef.rootNodes[0];
            detachedRef.destroy();
            this.templateContext = new TablejsForOfContext(this.items[index], this.virtualNexus.virtualForDirective._tablejsForOf, index, this.items.length);
            var ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus.virtualForDirective._template, this.templateContext, indexMap[index]);
            this.virtualNexus.virtualForDirective._viewContainer.move(ref, indexMap[index]);
            var clone = ref.rootNodes[0];
            clone.index = index;
            this.cdr.detectChanges();
            this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, child, index, this, this.elementRef.nativeElement);
            var lookupHeight = clone.offsetHeight;
            var oldHeight = this.heightLookup[itemName];
            this.heightLookup[itemName] = lookupHeight;
            clone.lastHeight = lookupHeight;
            this.addResizeSensor(clone, index);
            if (oldHeight) {
                this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
            }
            else {
                this.updateEstimatedHeight(lookupHeight);
            }
            if (updateScrollPosition) {
                this.refreshViewport();
            }
            this.scrollDispatcherService.dispatchUpdateItemEvents(this.itemUpdated, clone, index, this, this.elementRef.nativeElement);
            this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, clone, index, this, this.elementRef.nativeElement);
        };
        ScrollViewportDirective.prototype.viewportRendered = function () {
            var _this = this;
            this.virtualNexus = this.directiveRegistrationService.getVirtualNexusFromViewport(this);
            if (this.virtualNexus && this.virtualNexus.virtualForDirective) {
                this.items = this.virtualNexus.virtualForDirective._tablejsForOf;
                this.virtualForChangesSubscription$ = this.virtualNexus.virtualForDirective.changes.subscribe(function (item) {
                    var isTheSameArray = _this.items === item.tablejsForOf;
                    _this.items = item.tablejsForOf;
                    var scrollToOptions = { index: 0, scrollAfterIndexedItem: 0 };
                    if (isTheSameArray) {
                        scrollToOptions.index = _this.range.startIndex;
                        scrollToOptions.scrollAfterIndexedItem = _this.scrollChangeByFirstIndexedItem;
                        // array has changed...rerender current elements
                        var listChildren = Array.from(_this.listContent.childNodes);
                    }
                    else {
                        _this.updateItems(item.tablejsForOf, scrollToOptions);
                    }
                });
            }
            // this.convertCustomElementsVariables();
            this.createTBodies();
            this.addScrollHandler();
            // this.attachMutationObserver();
            if (this.items && (this.generateCloneMethod || this.virtualNexus.virtualForDirective._template)) {
                this.initScroll({
                    items: this.items,
                    generateCloneMethod: this._cloneMethod
                });
            }
            this.scrollDispatcherService.dispatchViewportReadyEvents(this.viewportReady, this, this.elementRef.nativeElement);
        };
        ScrollViewportDirective.prototype.scrollToBottom = function () {
            this.range.startIndex = this.items.length;
            this.scrollToExact(this.range.startIndex, 0);
        };
        ScrollViewportDirective.prototype.scrollToTop = function () {
            this.scrollToExact(0, 0);
        };
        ScrollViewportDirective.prototype.pageUp = function () {
            var heightCount = this.scrollChangeByFirstIndexedItem;
            if (this.range.startIndex === 0) {
                this.scrollToExact(0, 0);
                return;
            }
            for (var i = this.range.startIndex - 1; i >= 0; i--) {
                var lookupHeight = this.heightLookup['item' + i] ? this.heightLookup['item' + i] : this.avgItemHeight;
                heightCount += lookupHeight;
                if (heightCount >= this.containerHeight || i === 0) {
                    var overflowDifference = heightCount >= this.containerHeight ? heightCount - this.containerHeight : 0;
                    this.scrollToExact(i, overflowDifference);
                    break;
                }
            }
        };
        ScrollViewportDirective.prototype.pageDown = function () {
            this.range.startIndex = this.range.endIndex - 1;
            var overflowDifference = this.heightLookup['item' + (this.range.endIndex - 1).toString()] - this.lastVisibleItemOverflow;
            this.scrollToExact(this.range.startIndex, overflowDifference);
        };
        ScrollViewportDirective.prototype.addArrowListeners = function () {
            var _this = this;
            this.elementRef.nativeElement.addEventListener('mouseenter', this.handleMouseOver = function (e) {
                _this.mouseIsOverViewport = true;
            });
            this.elementRef.nativeElement.addEventListener('mouseleave', this.handleMouseOut = function (e) {
                _this.mouseIsOverViewport = false;
            });
            document.addEventListener('keydown', this.handleKeyDown = function (e) {
                if (_this.mouseIsOverViewport) {
                    var isMac = _this.operatingSystem.isMac();
                    switch (e.code) {
                        case 'ArrowDown':
                            if (isMac && e.metaKey) {
                                e.preventDefault();
                                _this.scrollToBottom();
                            }
                            else {
                                e.preventDefault();
                                _this.range.startIndex += Number(_this.arrowDownSpeed);
                                _this.scrollToExact(_this.range.startIndex, 0);
                            }
                            break;
                        case 'ArrowUp':
                            if (isMac && e.metaKey) {
                                e.preventDefault();
                                _this.scrollToTop();
                            }
                            else {
                                if (_this.scrollChangeByFirstIndexedItem === 0) {
                                    e.preventDefault();
                                    _this.range.startIndex -= Number(_this.arrowUpSpeed);
                                    _this.scrollToExact(_this.range.startIndex, 0);
                                }
                                else {
                                    e.preventDefault();
                                    _this.scrollChangeByFirstIndexedItem = 0;
                                    _this.scrollToExact(_this.range.startIndex, 0);
                                }
                            }
                            break;
                        case 'PageDown':
                            e.preventDefault();
                            _this.pageDown();
                            break;
                        case 'PageUp':
                            e.preventDefault();
                            _this.pageUp();
                            break;
                        case 'End':
                            e.preventDefault();
                            _this.scrollToBottom();
                            break;
                        case 'Home':
                            e.preventDefault();
                            _this.scrollToTop();
                            break;
                    }
                }
            });
        };
        ScrollViewportDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.gridDirective = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement)['gridDirective'];
            this.gridDirective.scrollViewportDirective = this;
            this.gridDirective.preGridInitialize.pipe(operators.take(1)).subscribe(function (res) {
                _this.cdr.detectChanges();
                _this.refreshContainerHeight();
                _this.refreshViewport();
                // placeholder object is used only to initialize first grid render
                if (_this.items[0] === _this.placeholderObject) {
                    _this.items.shift();
                }
            });
            this.viewportRendered();
            this.addArrowListeners();
        };
        ScrollViewportDirective.prototype.ngOnInit = function () {
            this.registerViewportToElement();
            this._cloneMethod = this.generateCloneMethod;
        };
        ScrollViewportDirective.prototype.ngOnDestroy = function () {
            this.elementRef.nativeElement.removeEventListener('mouseenter', this.handleMouseOver);
            this.elementRef.nativeElement.removeEventListener('mouseleave', this.handleMouseOut);
            document.removeEventListener('keydown', this.handleKeyDown);
            if (this.virtualForChangesSubscription$) {
                this.virtualForChangesSubscription$.unsubscribe();
            }
        };
        ScrollViewportDirective.prototype.setScrollSpacers = function () {
            var numItemsAfterShownList = this.items.length - this.range.extendedEndIndex;
            var numItemsBeforeShownList = this.adjustedStartIndex;
            var totalUnshownItems = numItemsBeforeShownList + numItemsAfterShownList;
            var beforeItemHeightPercent = totalUnshownItems !== 0 ? numItemsBeforeShownList / totalUnshownItems : 0;
            var afterItemHeightPercent = totalUnshownItems !== 0 ? numItemsAfterShownList / totalUnshownItems : 0;
            var remainingHeight = this.estimatedFullContentHeight - this.lastHeight;
            this.estimatedPreListHeight = Math.round(beforeItemHeightPercent * remainingHeight);
            this.estimatedPostListHeight = Math.round(afterItemHeightPercent * remainingHeight);
            // account for rounding both up
            this.estimatedPostListHeight = this.estimatedPostListHeight - (afterItemHeightPercent * remainingHeight) === 0.5 ? this.estimatedPostListHeight - 1 : this.estimatedPostListHeight;
            if (this.forcedEndIndex) {
                this.estimatedPreListHeight = 0;
                this.estimatedPostListHeight = 0;
            }
            this.prevSpacer.style.height = this.estimatedPreListHeight.toString() + 'px';
            this.postSpacer.style.height = this.estimatedPostListHeight.toString() + 'px';
        };
        ScrollViewportDirective.prototype.setHeightByListHeightDifference = function (liHeight, listHeight) {
            return liHeight - listHeight;
        };
        ScrollViewportDirective.prototype.removePreScrollItems = function (lastIndex, index) {
            if (lastIndex < index) {
                for (var i = lastIndex; i < index; i++) {
                    var firstRef = this.virtualNexus.virtualForDirective._viewContainer.get(1);
                    if (firstRef) {
                        var firstChild = firstRef.rootNodes[0];
                        var itemName = 'item' + i;
                        this.itemVisibilityLookup[itemName] = false;
                        var detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(1);
                        detachedRef.destroy();
                        this.cdr.detectChanges();
                        this.removeResizeSensor(firstChild, i);
                        this.lastHeight -= this.heightLookup[itemName];
                        this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, firstChild, i, this, this.elementRef.nativeElement);
                    }
                }
            }
        };
        ScrollViewportDirective.prototype.removePostScrollItems = function (lastEndIndex, endIndex) {
            if (lastEndIndex >= this.items.length) {
                lastEndIndex = this.items.length - 1;
            }
            for (var i = lastEndIndex; i >= endIndex; i--) {
                var lastChild = this.getPreviousSibling(this.listContent.lastElementChild);
                if (lastChild) {
                    var itemName = 'item' + i;
                    this.itemVisibilityLookup[itemName] = false;
                    var detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(this.virtualNexus.virtualForDirective._viewContainer.length - 1);
                    detachedRef.destroy();
                    this.cdr.detectChanges();
                    this.removeResizeSensor(lastChild, i);
                    this.lastHeight -= this.heightLookup[itemName];
                    this.scrollDispatcherService.dispatchRemoveItemEvents(this.itemRemoved, detachedRef.rootNodes[0], i, this, this.elementRef.nativeElement);
                }
            }
        };
        ScrollViewportDirective.prototype.updateItems = function (items, scrollToOptions) {
            if (scrollToOptions === void 0) { scrollToOptions = { index: -1, scrollAfterIndexedItem: 0 }; }
            if (this.pauseViewportRenderUpdates) {
                return;
            }
            for (var i = this.virtualNexus.virtualForDirective._viewContainer.length - 1; i > 0; i--) {
                var detachedRef = this.virtualNexus.virtualForDirective._viewContainer.detach(i);
                detachedRef.destroy();
            }
            this.cdr.detectChanges();
            this.resetToInitialValues();
            this.items = items;
            if (this.virtualNexus) {
                this.virtualNexus.virtualForDirective._tablejsForOf = items;
            }
            if (scrollToOptions.index !== -1) {
                this.scrollToExact(scrollToOptions.index, scrollToOptions.scrollAfterIndexedItem);
            }
        };
        ScrollViewportDirective.prototype.resetToInitialValues = function () {
            this.lastScrollTop = 0;
            this.currentScrollTop = 0;
            this.currentScrollChange = 0;
            this.estimatedFullContentHeight = 0;
            this.estimatedPreListHeight = 0;
            this.estimatedPostListHeight = 0;
            this.totalItemsCounted = 0;
            this.totalHeightCount = 0;
            this.avgItemHeight = undefined;
            this.heightLookup = {};
            this.itemVisibilityLookup = {};
            this.overflowHeightCount = 0;
            this.scrollChangeByFirstIndexedItem = 0;
            this.lastVisibleItemHeight = Infinity;
            this.preOverflowHeight = 0;
            this.lastHeight = 0;
            this.range.startIndex = 0;
            this.range.endIndex = 0;
            this.range.extendedStartIndex = 0;
            this.range.extendedEndIndex = 0;
            this.lastRange.startIndex = this.range.startIndex;
            this.lastRange.endIndex = this.range.endIndex;
            this.lastRange.extendedStartIndex = this.range.extendedStartIndex;
            this.lastRange.extendedEndIndex = this.range.extendedEndIndex;
            this.forcedEndIndex = undefined;
        };
        ScrollViewportDirective.prototype.recalculateRowHeight = function (index) {
            var itemName = 'item' + index;
            var indexMap = {};
            for (var i = 1; i < this.virtualNexus.virtualForDirective._viewContainer.length; i++) {
                indexMap[this.virtualNexus.virtualForDirective._viewContainer.get(i).rootNodes[0].index] = i;
            }
            ;
            var rowRef = this.virtualNexus.virtualForDirective._viewContainer.get(indexMap[index]);
            var rowEl = rowRef.rootNodes[0];
            var lookupHeight = rowEl.offsetHeight;
            var heightDifference = lookupHeight - this.heightLookup[itemName];
            this.updateEstimatedHeightFromResize(this.heightLookup[itemName], lookupHeight);
            this.heightLookup[itemName] = lookupHeight;
            rowEl.lastHeight = lookupHeight;
            this.lastHeight += heightDifference;
        };
        ScrollViewportDirective.prototype.updateEstimatedHeightFromResize = function (oldHeight, newHeight) {
            this.totalHeightCount += (newHeight - oldHeight);
            this.avgItemHeight = (this.totalHeightCount / this.totalItemsCounted);
            this.estimatedFullContentHeight = this.avgItemHeight * this.items.length;
        };
        ScrollViewportDirective.prototype.updateEstimatedHeight = function (height) {
            this.totalHeightCount += height;
            this.totalItemsCounted++;
            this.avgItemHeight = (this.totalHeightCount / this.totalItemsCounted);
            this.estimatedFullContentHeight = this.avgItemHeight * this.items.length;
        };
        ScrollViewportDirective.prototype.getPreviousSibling = function (el) {
            if (!el) {
                return null;
            }
            var prev = el.previousSibling;
            while (prev !== null && prev !== undefined && prev.nodeType !== 1) {
                prev = prev.previousSibling;
            }
            return prev;
        };
        ScrollViewportDirective.prototype.getNextSibling = function (el) {
            if (!el) {
                return null;
            }
            var next = el.nextSibling;
            while (next !== null && next !== undefined && next.nodeType !== 1) {
                next = next.nextSibling;
            }
            return next;
        };
        ScrollViewportDirective.prototype.getEstimatedChildInsertions = function (remainingHeight) {
            return Math.ceil(remainingHeight / this.avgItemHeight);
        };
        ScrollViewportDirective.prototype.setLastRangeToCurrentRange = function () {
            this.lastRange.startIndex = this.range.startIndex;
            this.lastRange.endIndex = this.range.endIndex;
            this.lastRange.extendedStartIndex = this.range.extendedStartIndex;
            this.lastRange.extendedEndIndex = this.range.extendedEndIndex;
        };
        ScrollViewportDirective.prototype.resetLastHeight = function () {
            if (!this.lastHeight) {
                this.lastHeight = 0;
            }
        };
        ScrollViewportDirective.prototype.maintainIndexInBounds = function (index) {
            if (index > this.items.length - 1) {
                index = this.items.length - 1;
            }
            else if (index < 0) {
                index = 0;
            }
            return index;
        };
        ScrollViewportDirective.prototype.maintainEndIndexInBounds = function (index) {
            if (index > this.items.length) {
                index = this.items.length;
            }
            else if (index < 0) {
                index = 0;
            }
            return index;
        };
        ScrollViewportDirective.prototype.showRange = function (startIndex, endIndex, overflow) {
            if (overflow === void 0) { overflow = 0; }
            this.updateItems(this.items, { index: startIndex, scrollAfterIndexedItem: endIndex });
            startIndex = this.maintainIndexInBounds(startIndex);
            endIndex = this.maintainEndIndexInBounds(endIndex);
            if (endIndex <= startIndex) {
                endIndex = startIndex + 1;
            }
            var oldContainerHeight = this.containerHeight;
            var oldPreItemOverflow = Number(this.preItemOverflow);
            var oldPostItemOverflow = Number(this.postItemOverflow);
            this.preItemOverflow = 0;
            this.postItemOverflow = 0;
            this.containerHeight = 100000;
            this.forcedEndIndex = endIndex;
            this.scrollToExact(startIndex, overflow);
            var rangeToKeep = Object.assign({}, this.range);
            var lastRangeToKeep = Object.assign({}, this.lastRange);
            this.preItemOverflow = oldPreItemOverflow;
            this.postItemOverflow = oldPostItemOverflow;
            this.containerHeight = oldContainerHeight;
            this.forcedEndIndex = undefined;
            this.range = rangeToKeep;
            this.lastRange = lastRangeToKeep;
        };
        ScrollViewportDirective.prototype.getDisplayedContentsHeight = function () {
            return this.lastHeight;
        };
        ScrollViewportDirective.prototype.refreshContainerHeight = function () {
            this.containerHeight = this.listContent.clientHeight;
        };
        ScrollViewportDirective.prototype.allItemsFitViewport = function (recalculateContainerHeight, refreshViewport) {
            if (recalculateContainerHeight === void 0) { recalculateContainerHeight = false; }
            if (refreshViewport === void 0) { refreshViewport = false; }
            if (recalculateContainerHeight) {
                this.cdr.detectChanges();
                this.refreshContainerHeight();
            }
            if (refreshViewport) {
                this.refreshViewport(true);
            }
            return this.range.startIndex === this.range.extendedStartIndex &&
                this.range.endIndex === this.range.extendedEndIndex &&
                this.lastHeight <= this.containerHeight;
        };
        ScrollViewportDirective.prototype.getCurrentScrollPosition = function () {
            return {
                index: this.range.startIndex,
                overflow: this.scrollChangeByFirstIndexedItem,
                lastItemOverflow: this.lastVisibleItemOverflow > 0 ? 0 : this.lastVisibleItemOverflow
            };
        };
        ScrollViewportDirective.prototype.setHeightsForOverflowCalculations = function (itemIndex, scrollToIndex, itemHeight) {
            this.lastHeight += itemHeight;
            if (itemIndex < scrollToIndex) {
                this.preOverflowHeight += itemHeight;
            }
            if (itemIndex >= scrollToIndex) {
                this.overflowHeightCount += itemHeight;
                if (this.overflowHeightCount >= this.containerHeight) {
                    this.postItemOverflowCount++;
                    if (this.postItemOverflowCount === 0) {
                        this.lastVisibleItemHeight = this.heightLookup['item' + itemIndex];
                    }
                }
            }
        };
        ScrollViewportDirective.prototype.addResizeSensor = function (el, index) {
        };
        ScrollViewportDirective.prototype.removeResizeSensor = function (el, index) {
        };
        ScrollViewportDirective.prototype.getCloneFromTemplateRef = function (index) {
            var clone;
            this.templateContext = new TablejsForOfContext(this.items[index], this.virtualNexus.virtualForDirective._tablejsForOf, index, this.items.length);
            var viewRef = this.virtualNexus.virtualForDirective._template.createEmbeddedView(this.templateContext);
            viewRef.detectChanges();
            clone = viewRef.rootNodes[0];
            return clone;
        };
        ScrollViewportDirective.prototype.addScrollItems = function (index, overflow) {
            var scrollingUp = index < this.lastRange.startIndex;
            this.range.extendedStartIndex = this.adjustedStartIndex;
            this.range.startIndex = index;
            this.overflowHeightCount = -overflow;
            this.preOverflowHeight = 0;
            var firstEl = this.getNextSibling(this.listContent.firstElementChild);
            this.lastHeight = 0;
            var batchSize = this.avgItemHeight !== undefined && isNaN(this.avgItemHeight) === false ? this.getEstimatedChildInsertions(this.containerHeight - this.lastHeight) + Number(this.preItemOverflow) + Number(this.postItemOverflow) : 1;
            var itemsToBatch = [];
            var itemBefore;
            var indexBefore;
            var firstRef = this.virtualNexus.virtualForDirective._viewContainer.get(1);
            var appendToEnd = firstRef === null;
            for (var i = this.adjustedStartIndex; i < this.adjustedStartIndex + Number(this.itemLoadLimit); i++) {
                if (i < 0) {
                    continue;
                }
                if (i > this.items.length - 1) {
                    break;
                }
                this.itemName = 'item' + i;
                // only insert item if it is not already visible
                var itemIsInvisible = this.itemVisibilityLookup[this.itemName] !== true;
                if (itemIsInvisible) {
                    itemBefore = !scrollingUp ? this.postSpacer : firstEl;
                    indexBefore = !scrollingUp || appendToEnd ? this.virtualNexus.virtualForDirective._viewContainer.length : this.virtualNexus.virtualForDirective._viewContainer.indexOf(firstRef);
                    this.itemVisibilityLookup[this.itemName] = true;
                    this.templateContext = new TablejsForOfContext(this.items[i], this.virtualNexus.virtualForDirective._tablejsForOf, i, this.items.length);
                    var ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus.virtualForDirective._template, this.templateContext, indexBefore);
                    this.virtualNexus.virtualForDirective._viewContainer.move(ref, indexBefore);
                    var prev = ref.rootNodes[0];
                    prev.index = i;
                    itemsToBatch.push({ index: i, name: this.itemName, item: prev, before: itemBefore });
                    this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, prev, i, this, this.elementRef.nativeElement);
                }
                else {
                    itemsToBatch.push({ index: i, name: this.itemName, item: null, before: null });
                    this.setHeightsForOverflowCalculations(i, index, this.heightLookup[this.itemName]);
                }
                if (itemsToBatch.length === batchSize || i === this.items.length - 1 || this.postItemOverflowCount >= Number(this.postItemOverflow)) {
                    for (var j = 0; j < itemsToBatch.length; j++) {
                        var batchObj = itemsToBatch[j];
                        var name = batchObj.name;
                        var ind = batchObj.index;
                        var oldHeight = this.heightLookup[name];
                        if (batchObj.item === null) {
                            continue;
                        }
                        this.cdr.detectChanges();
                        var lookupHeight = batchObj.item.offsetHeight;
                        this.heightLookup[name] = lookupHeight;
                        batchObj.item.lastHeight = lookupHeight;
                        this.addResizeSensor(batchObj.item, batchObj.index);
                        if (oldHeight) {
                            this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
                        }
                        else {
                            this.updateEstimatedHeight(lookupHeight);
                        }
                        this.setHeightsForOverflowCalculations(ind, index, lookupHeight);
                    }
                    batchSize = this.getEstimatedChildInsertions(this.containerHeight - this.lastHeight) + Number(this.preItemOverflow) + Number(this.postItemOverflow);
                    if (batchSize <= 0) {
                        batchSize = Number(this.postItemOverflow);
                    }
                    itemsToBatch = [];
                }
                if (this.postItemOverflowCount <= 0) {
                    this.range.endIndex = i + 1;
                }
                this.range.extendedEndIndex = i + 1;
                // if item height is lower than the bottom of the container area, stop adding items
                if (this.forcedEndIndex === undefined) {
                    if (this.postItemOverflowCount >= Number(this.postItemOverflow)) {
                        break;
                    }
                }
                else {
                    if (i === this.forcedEndIndex - 1) {
                        break;
                    }
                }
            }
            var itemName;
            var endIndexFound = false;
            var heightCount = -overflow;
            for (var i = this.range.startIndex; i < this.range.extendedEndIndex; i++) {
                itemName = 'item' + i;
                heightCount += this.heightLookup[itemName];
                if (this.forcedEndIndex !== undefined) {
                    if (i === this.forcedEndIndex - 1) {
                        this.range.endIndex = i + 1;
                        this.lastVisibleItemOverflow = heightCount - this.containerHeight;
                        endIndexFound = true;
                        break;
                    }
                }
                else {
                    if (heightCount >= this.containerHeight && !endIndexFound) {
                        this.range.endIndex = i + 1;
                        this.lastVisibleItemOverflow = heightCount - this.containerHeight;
                        endIndexFound = true;
                        break;
                    }
                }
            }
        };
        ScrollViewportDirective.prototype.addMissingPostScrollItemsAndUpdateOverflow = function (index, overflow) {
            var firstEl;
            var itemsToBatch = [];
            var batchSize;
            if (this.overflowHeightCount <= this.containerHeight) {
                batchSize = this.getEstimatedChildInsertions(this.containerHeight) + Number(this.preItemOverflow);
                this.preItemOverflowCount = -1;
                this.preOverflowHeight = 0;
                firstEl = this.getNextSibling(this.listContent.firstElementChild);
                var heightCount = 0;
                var count = 0;
                for (var i = this.range.endIndex - 1; i >= 0; i--) {
                    this.itemName = 'item' + i;
                    count++;
                    if (i <= this.range.extendedStartIndex && this.itemVisibilityLookup[this.itemName] !== true) {
                        this.itemVisibilityLookup[this.itemName] = true;
                        this.templateContext = new TablejsForOfContext(this.items[i], this.virtualNexus.virtualForDirective._tablejsForOf, i, this.items.length);
                        var ref = this.virtualNexus.virtualForDirective._viewContainer.createEmbeddedView(this.virtualNexus.virtualForDirective._template, this.templateContext, 1);
                        this.virtualNexus.virtualForDirective._viewContainer.move(ref, 1);
                        var prev = ref.rootNodes[0];
                        prev.index = i;
                        this.cdr.detectChanges();
                        itemsToBatch.push({ index: i, name: this.itemName, item: prev, before: firstEl });
                        this.scrollDispatcherService.dispatchAddItemEvents(this.itemAdded, prev, i, this, this.elementRef.nativeElement);
                        firstEl = prev;
                        this.range.extendedStartIndex = i;
                        this.adjustedStartIndex = i;
                    }
                    else {
                        itemsToBatch.push({ index: i, name: this.itemName, item: null, before: null });
                        heightCount += this.heightLookup[this.itemName];
                        if (heightCount > this.containerHeight) {
                            this.preItemOverflowCount++;
                            if (this.preItemOverflowCount === 0) {
                                overflow = heightCount - this.containerHeight;
                                this.range.startIndex = i;
                                index = i;
                            }
                            else {
                                this.preOverflowHeight += this.heightLookup[this.itemName];
                            }
                            this.range.extendedStartIndex = i;
                            this.adjustedStartIndex = i;
                        }
                    }
                    if (itemsToBatch.length === batchSize || i === 0) {
                        for (var j = 0; j < itemsToBatch.length; j++) {
                            var batchObj = itemsToBatch[j];
                            if (batchObj.item === null) {
                                continue;
                            }
                            var name = batchObj.name;
                            var ind = batchObj.index;
                            var lookupHeight = batchObj.item.offsetHeight;
                            var oldHeight = this.heightLookup[name];
                            this.heightLookup[name] = lookupHeight;
                            batchObj.item.lastHeight = lookupHeight;
                            this.addResizeSensor(batchObj.item, batchObj.index);
                            if (oldHeight) {
                                this.updateEstimatedHeightFromResize(oldHeight, lookupHeight);
                            }
                            else {
                                this.updateEstimatedHeight(lookupHeight);
                            }
                            heightCount += lookupHeight;
                            if (heightCount > this.containerHeight) {
                                this.preItemOverflowCount++;
                                if (this.preItemOverflowCount === 0) {
                                    overflow = heightCount - this.containerHeight;
                                    this.range.startIndex = batchObj.index;
                                    index = batchObj.index;
                                }
                                else {
                                    this.preOverflowHeight += lookupHeight;
                                }
                                this.range.extendedStartIndex = batchObj.index;
                                this.adjustedStartIndex = batchObj.index;
                            }
                        }
                        batchSize = this.getEstimatedChildInsertions(this.containerHeight - this.lastHeight) + Number(this.preItemOverflow);
                        if (batchSize <= 0) {
                            batchSize = Number(this.preItemOverflow);
                        }
                        itemsToBatch = [];
                    }
                    if (this.preItemOverflowCount >= this.preItemOverflow) {
                        break;
                    }
                }
            }
            return overflow;
        };
        ScrollViewportDirective.prototype.scrollToExact = function (index, overflow) {
            if (overflow === void 0) { overflow = 0; }
            if (!this.items || this.items.length === 0) {
                return;
            }
            this.resetLastHeight();
            index = this.maintainIndexInBounds(index);
            overflow = index === 0 && overflow < 0 ? 0 : overflow;
            this.adjustedStartIndex = index - Number(this.preItemOverflow) <= 0 ? 0 : index - Number(this.preItemOverflow);
            this.preItemOverflowCount = -1;
            this.postItemOverflowCount = -1;
            this.lastVisibleItemOverflow = 0;
            this.range.endIndex = 0;
            this.range.extendedEndIndex = 0;
            this.removePreScrollItems(this.lastRange.extendedStartIndex, Math.min(this.adjustedStartIndex, this.lastRange.extendedEndIndex));
            this.addScrollItems(index, overflow);
            this.removePostScrollItems(this.lastRange.extendedEndIndex - 1, Math.max(this.lastRange.extendedStartIndex, this.range.extendedEndIndex));
            if (!this.forcedEndIndex) {
                overflow = this.addMissingPostScrollItemsAndUpdateOverflow(index, overflow);
            }
            this.setLastRangeToCurrentRange();
            this.setScrollSpacers();
            this.lastScrollTop = this.preOverflowHeight + overflow + this.estimatedPreListHeight;
            this.listContent.scrollTop = this.lastScrollTop;
            this.currentScrollTop = this.lastScrollTop;
            this.scrollChangeByFirstIndexedItem = overflow;
            this.scrollDispatcherService.dispatchRangeUpdateEvents(this.rangeUpdated, this.range, this, this.elementRef.nativeElement);
            this.viewportHasScrolled = true;
        };
        ScrollViewportDirective.prototype.getRangeChange = function (scrollChange) {
            var heightCount = 0;
            var rangeStartCount = 0;
            var overflow = 0;
            var newRange = { startIndex: null, endIndex: null, extendedStartIndex: null, extendedEndIndex: null };
            var itemName;
            if (scrollChange > 0) {
                for (var i = this.range.startIndex; i <= this.range.endIndex + Number(this.itemLoadLimit); i++) {
                    overflow = scrollChange - heightCount;
                    itemName = 'item' + i;
                    if (this.heightLookup[itemName]) {
                        heightCount += this.heightLookup[itemName];
                    }
                    else {
                        heightCount += this.avgItemHeight;
                    }
                    if (heightCount >= scrollChange) {
                        break;
                    }
                    rangeStartCount++;
                }
                newRange.startIndex = this.range.startIndex + rangeStartCount;
                newRange.endIndex = rangeStartCount < this.range.endIndex - this.range.startIndex ? this.range.endIndex : newRange.startIndex + 1;
            }
            if (scrollChange < 0) {
                rangeStartCount = -1;
                overflow = scrollChange;
                for (var i = this.range.startIndex - 1; i >= 0; i--) {
                    itemName = 'item' + i;
                    if (this.heightLookup[itemName]) {
                        overflow += this.heightLookup[itemName];
                        heightCount += this.heightLookup[itemName];
                    }
                    else {
                        overflow += this.avgItemHeight;
                        heightCount += this.avgItemHeight;
                    }
                    if (overflow >= 0) {
                        break;
                    }
                    rangeStartCount--;
                }
                newRange.startIndex = this.range.startIndex + rangeStartCount >= 0 ? this.range.startIndex + rangeStartCount : 0;
                newRange.endIndex = rangeStartCount < this.range.endIndex - this.range.startIndex ? this.range.endIndex : newRange.startIndex + 1;
            }
            this.scrollChangeByFirstIndexedItem = overflow;
            return newRange;
        };
        ScrollViewportDirective.prototype.refreshViewport = function (recalculateRows) {
            if (recalculateRows === void 0) { recalculateRows = false; }
            if (recalculateRows) {
                for (var i = this.range.extendedStartIndex; i < this.range.extendedEndIndex; i++) {
                    this.recalculateRowHeight(i);
                }
            }
            this.scrollToExact(this.range.startIndex, this.scrollChangeByFirstIndexedItem);
        };
        ScrollViewportDirective.prototype.updateScrollFromRange = function (newRange) {
            if (newRange.startIndex !== null) {
                if (this.range.startIndex !== newRange.startIndex || this.lastVisibleItemOverflow < 0) {
                    this.range.startIndex = newRange.startIndex;
                    this.range.endIndex = newRange.endIndex;
                    this.refreshViewport();
                }
                else {
                    this.lastScrollTop = this.currentScrollTop;
                }
            }
            this.lastScrollTop = this.currentScrollTop;
        };
        ScrollViewportDirective.prototype.initScroll = function (options) {
            var _this = this;
            this.items = options.items;
            this._cloneMethod = options.generateCloneMethod;
            var itemsAreEmpty = this.items.length === 0;
            var index = options.initialIndex ? options.initialIndex : 0;
            if (this.virtualNexus && this.virtualNexus.virtualForDirective._template) {
                setTimeout(function () {
                    _this.cloneFromTemplateRef = true;
                    _this.verifyViewportIsReady();
                    _this.initFirstScroll(index);
                });
            }
            else {
                this.template = document.getElementById(this.templateID);
                this.verifyViewportIsReady();
                this.initFirstScroll(index);
            }
        };
        ScrollViewportDirective.prototype.verifyViewportIsReady = function () {
            if (this.templateID === '' && !this.templateIsSet()) {
                throw Error('Scroll viewport template ID is not set.');
            }
            if (!this.itemsAreSet()) {
                throw new Error('Scroll viewport requires an array of items.  Please supply an items array.');
            }
            if (!this.cloneMethodIsSet() && !this.templateIsSet()) {
                throw new Error('Scroll viewport requires a cloning method or a template.  Please supply a method as follows:\n\n (template: HTMLElement, items: any[], index: number) => Node\n\n or supply a tablejsVirtualFor');
            }
        };
        ScrollViewportDirective.prototype.initFirstScroll = function (index) {
            var itemsAreEmpty = this.items.length === 0;
            this.refreshContainerHeight();
            if (itemsAreEmpty) {
                this.items.push(this.placeholderObject);
                this.scrollToExact(index, 0);
                var node = this.virtualNexus.virtualForDirective._viewContainer.get(1).rootNodes[0];
                this.renderer.setStyle(node, 'height', '0px');
                this.renderer.setStyle(node, 'minHeight', '0px');
                this.renderer.setStyle(node, 'overflow', 'hidden');
            }
            else {
                this.scrollToExact(index, 0);
            }
            this.scrollDispatcherService.dispatchViewportInitializedEvents(this.viewportInitialized, this, this.elementRef.nativeElement);
        };
        ScrollViewportDirective.prototype.itemsAreSet = function () {
            return !!this.items;
        };
        ScrollViewportDirective.prototype.cloneMethodIsSet = function () {
            return !!this._cloneMethod;
        };
        ScrollViewportDirective.prototype.templateIsSet = function () {
            return this.virtualNexus.virtualForDirective._template !== undefined && this.virtualNexus.virtualForDirective._template !== null;
        };
        return ScrollViewportDirective;
    }());
    ScrollViewportDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsScrollViewport], [tablejsscrollviewport], [tablejs-scroll-viewport]',
                    host: { style: 'contain: content;' }
                },] }
    ];
    ScrollViewportDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService },
        { type: undefined, decorators: [{ type: i0.Inject, args: [common.DOCUMENT,] }] },
        { type: DirectiveRegistrationService },
        { type: ScrollDispatcherService },
        { type: OperatingSystemService },
        { type: i0.ComponentFactoryResolver },
        { type: i0.ChangeDetectorRef },
        { type: i0.RendererFactory2 }
    ]; };
    ScrollViewportDirective.propDecorators = {
        templateRef: [{ type: i0.ContentChild, args: ['templateRef', { static: true },] }],
        templateID: [{ type: i0.Input }],
        generateCloneMethod: [{ type: i0.Input }],
        arrowUpSpeed: [{ type: i0.Input }],
        arrowDownSpeed: [{ type: i0.Input }],
        preItemOverflow: [{ type: i0.Input }],
        postItemOverflow: [{ type: i0.Input }],
        itemLoadLimit: [{ type: i0.Input }],
        templateid: [{ type: i0.Input }],
        preitemoverflow: [{ type: i0.Input }],
        postitemoverflow: [{ type: i0.Input }],
        arrowupspeed: [{ type: i0.Input }],
        arrowdownspeed: [{ type: i0.Input }],
        itemloadlimit: [{ type: i0.Input }],
        fillViewportScrolling: [{ type: i0.Input }],
        itemAdded: [{ type: i0.Output }],
        itemRemoved: [{ type: i0.Output }],
        itemUpdated: [{ type: i0.Output }],
        rangeUpdated: [{ type: i0.Output }],
        viewportScrolled: [{ type: i0.Output }],
        viewportReady: [{ type: i0.Output }],
        viewportInitialized: [{ type: i0.Output }]
    };

    var GridDirective = /** @class */ (function (_super) {
        __extends(GridDirective, _super);
        function GridDirective(viewContainerRef, elementRef, resolver, gridService, directiveRegistrationService, document, overlay, scrollDispatcherService, operatingSystem, rendererFactory) {
            var _this = _super.call(this) || this;
            _this.viewContainerRef = viewContainerRef;
            _this.elementRef = elementRef;
            _this.resolver = resolver;
            _this.gridService = gridService;
            _this.directiveRegistrationService = directiveRegistrationService;
            _this.document = document;
            _this.overlay = overlay;
            _this.scrollDispatcherService = scrollDispatcherService;
            _this.operatingSystem = operatingSystem;
            _this.rendererFactory = rendererFactory;
            _this.dragging = false;
            _this.reordering = false;
            _this.startX = 0;
            _this.startY = 0;
            _this.stylesByClass = [];
            _this.id = null;
            _this.viewport = null;
            _this.viewportID = null;
            _this.currentClassesToResize = [];
            _this.startingWidths = [];
            _this.minWidths = [];
            _this.totalComputedMinWidth = 0;
            _this.totalComputedWidth = 0;
            _this.defaultTableMinWidth = 25;
            _this.gridTemplateClasses = [];
            _this.gridOrder = [];
            _this.classWidths = [];
            _this.gridTemplateTypes = [];
            _this.draggingColumn = null;
            _this.colRangeGroups = [];
            _this.lastDraggedOverElement = null;
            _this.lastDraggedGroupIndex = -1;
            _this.lastDraggedOverRect = null;
            _this.lastDraggedGroupBoundingRects = null;
            _this.lastMoveDirection = -1;
            _this.resizableColumns = [];
            _this.resizableGrips = [];
            _this.reorderGrips = [];
            _this.reorderableColumns = [];
            _this.columnsWithDataClasses = [];
            _this.rows = [];
            _this.infiniteScrollViewports = [];
            _this.mutationResizableColumns = [];
            _this.mutationResizableGrips = [];
            _this.mutationReorderGrips = [];
            _this.mutationReorderableColumns = [];
            _this.mutationColumnsWithDataClasses = [];
            _this.mutationRows = [];
            _this.mutationInfiniteScrollViewports = [];
            _this.headTag = _this.document.getElementsByTagName('head')[0];
            _this.styleContent = '';
            _this.headStyle = null;
            _this.styleList = [];
            _this.initialWidths = [];
            _this.initialWidthsAreSet = undefined;
            _this.lastColumns = [];
            _this.contentResizeSensor = null;
            _this.observer = null;
            _this.isCustomElement = false;
            _this.parentGroups = [];
            _this.colData = null;
            _this.colDataGroups = [];
            _this.elementsWithHighlight = [];
            _this.dragAndDropGhostComponent = null;
            _this.dragOffsetX = 0;
            _this.dragOffsetY = 0;
            _this.reorderHandleColOffset = 0;
            _this.scrollbarWidth = 0;
            // class used for setting order
            _this.reorderableClass = 'reorderable-table-row';
            // fragments
            _this.widthStyle = null;
            _this.widthStyleFragment = null;
            _this.reorderHighlightStyle = null;
            _this.reorderHighlightStyleFragment = null;
            _this.subGroupStyles = [];
            _this.subGroupFragments = [];
            _this.gridOrderStyles = [];
            _this.gridOrderFragments = [];
            _this.subGroupStyleObjs = {};
            _this.scrollbarAdjustmentFragment = null;
            _this.scrollbarAdjustmentStyle = null;
            _this.resizeMakeUpPercent = 0;
            _this.resizeMakeUpPerColPercent = 0;
            _this.scrollViewportDirective = null;
            _this.hiddenColumnIndices = [];
            _this.hiddenColumnChanges = new rxjs.Subject();
            _this.HIDDEN_COLUMN_CLASS = 'column-is-hidden';
            _this.DRAG_AND_DROP_GHOST_OVERLAY_DATA = new i0.InjectionToken('DRAG_AND_DROP_GHOST_OVERLAY_DATA');
            _this.linkClass = undefined;
            _this.resizeColumnWidthByPercent = false;
            _this.columnResizeStart = new i0.EventEmitter();
            _this.columnResize = new i0.EventEmitter();
            _this.columnResizeEnd = new i0.EventEmitter();
            _this.columnReorder = new i0.EventEmitter();
            _this.columnReorderStart = new i0.EventEmitter();
            _this.dragOver = new i0.EventEmitter();
            _this.columnReorderEnd = new i0.EventEmitter();
            _this.preGridInitialize = new i0.EventEmitter(true);
            _this.gridInitialize = new i0.EventEmitter(true);
            _this.registerDirectiveToElement();
            _this.attachMutationObserver();
            return _this;
        }
        GridDirective.prototype.registerDirectiveToElement = function () {
            this.elementRef.nativeElement.gridDirective = this;
            this.elementRef.nativeElement.parentElement.gridDirective = this;
        };
        GridDirective.prototype.attachMutationObserver = function () {
            var ths = this;
            this.observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    ths.updateMutations(mutation);
                });
            });
            this.observer.observe(this.elementRef.nativeElement, {
                // configure it to listen to attribute changes
                attributes: true,
                subtree: true,
                childList: true,
                characterData: false
            });
        };
        GridDirective.prototype.updateMutations = function (mutation) {
            var _this = this;
            if (mutation.type === 'childList') {
                var addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(function (node) {
                    _this.directiveRegistrationService.registerNodeAttributes(node);
                    _this.getChildNodes(node);
                });
            }
        };
        GridDirective.prototype.getChildNodes = function (node) {
            var _this = this;
            node.childNodes.forEach(function (childNode) {
                _this.directiveRegistrationService.registerNodeAttributes(childNode);
                if (childNode.getAttribute) {
                    _this.getChildNodes(childNode);
                }
            });
        };
        GridDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            var viewport = this.elementRef.nativeElement.querySelector('*[tablejsScrollViewport]');
            if (viewport !== null && (viewport.scrollViewportDirective === null || viewport.scrollViewportDirective === undefined)) {
                // attach directive
                var viewportRef = new i0.ElementRef(viewport);
                this.scrollViewportDirective = new ScrollViewportDirective(viewportRef, this.gridService, this.document, this.directiveRegistrationService, this.scrollDispatcherService, this.operatingSystem, this.resolver, null, this.rendererFactory);
                this.scrollViewportDirective.registerCustomElementsInputs(viewport);
                this.scrollViewportDirective.ngOnInit();
                this.scrollViewportDirective.ngAfterViewInit();
            }
            // Close observer if directives are registering
            this.elementRef.nativeElement.directive = this;
            if (!this.document['hasPointerDownListener']) {
                this.document.addEventListener('pointerdown', function (e) {
                    var el = e.target;
                    if (el) {
                        while (el !== null && el.getAttribute('tablejsGrid') === null) {
                            el = el.parentElement;
                        }
                        if (el) {
                            el['directive'].onPointerDown(e);
                        }
                    }
                });
                this.document['hasPointerDownListener'] = true;
            }
            window.requestAnimationFrame(function (timestamp) {
                _this.onEnterFrame(_this, timestamp);
            });
        };
        GridDirective.prototype.onEnterFrame = function (ths, timestamp) {
            var _this = this;
            if (this.columnsWithDataClasses.length > 0) {
                this.observer.disconnect();
            }
            if (this.columnsWithDataClasses.length === 0 && this.mutationColumnsWithDataClasses.length === 0) {
                window.requestAnimationFrame(function (tmstamp) {
                    ths.onEnterFrame(ths, tmstamp);
                });
                return;
            }
            if (this.columnsWithDataClasses.length === 0 && this.mutationColumnsWithDataClasses.length !== 0) {
                this.isCustomElement = true;
                this.resizableColumns = this.mutationResizableColumns.concat();
                this.resizableGrips = this.mutationResizableGrips.concat();
                this.reorderGrips = this.mutationReorderGrips.concat();
                this.reorderableColumns = this.mutationReorderableColumns.concat();
                this.columnsWithDataClasses = this.mutationColumnsWithDataClasses.concat();
                this.rows = this.mutationRows.concat();
                this.infiniteScrollViewports = this.mutationInfiniteScrollViewports.concat();
                this.mutationResizableColumns = [];
                this.mutationResizableGrips = [];
                this.mutationReorderGrips = [];
                this.mutationReorderableColumns = [];
                this.mutationColumnsWithDataClasses = [];
                this.mutationRows = [];
                this.mutationInfiniteScrollViewports = [];
            }
            var allElementsWithDataResizable = this.columnsWithDataClasses;
            var el = allElementsWithDataResizable[0];
            var resizeClasses = this.getResizableClasses(el);
            var resizeCls = resizeClasses[0];
            var firstEl = this.elementRef.nativeElement.getElementsByClassName(resizeCls)[0];
            this.initialWidthSettingsSubscription$ = this.gridService.containsInitialWidthSettings.subscribe(function (hasWidths) {
                _this.initialWidthsAreSet = hasWidths;
            });
            if (!this.hiddenColumnChangesSubscription$) {
                this.hiddenColumnChangesSubscription$ = this.hiddenColumnChanges.subscribe(function (change) {
                    if (change) {
                        var relatedHeader = _this.getRelatedHeader(change.hierarchyColumn.element);
                        relatedHeader.hideColumn = change.hidden;
                        if (change.wasTriggeredByThisColumn) {
                            _this.updateHiddenColumnIndices();
                            var hideColumnIf = change.hierarchyColumn.element.hideColumnIf;
                            hideColumnIf.updateHeadersThatCanHide();
                        }
                        if (!change.hidden) {
                            if (change.wasTriggeredByThisColumn) {
                                _this.currentClassesToResize = _this.getResizableClasses(relatedHeader);
                                var avgWidthPerColumn_1 = _this.getAverageColumnWidth();
                                _this.setMinimumWidths();
                                var totalTableWidth_1 = _this.viewport.clientWidth;
                                var newWidth = avgWidthPerColumn_1 * _this.currentClassesToResize.length;
                                _this.currentClassesToResize.forEach(function (className) {
                                    var classIndex = _this.gridTemplateClasses.indexOf(className);
                                    if (_this.resizeColumnWidthByPercent) {
                                        _this.classWidths[classIndex] = (avgWidthPerColumn_1 / totalTableWidth_1 * 100).toString() + '%';
                                        // average all percentages
                                    }
                                    else {
                                        _this.classWidths[classIndex] = Math.max(avgWidthPerColumn_1, _this.minWidths[classIndex]);
                                    }
                                });
                                if (_this.resizeColumnWidthByPercent) {
                                    _this.fitWidthsToOneHundredPercent();
                                }
                                _this.updateWidths(newWidth);
                            }
                        }
                        _this.setGridOrder();
                    }
                });
            }
            if (this.parentGroups.length === 0) {
                this.setParentGroups(allElementsWithDataResizable);
            }
            var maxColumnsPerRow = this.parentGroups[this.parentGroups.length - 1].length;
            if (firstEl === undefined || firstEl === null) {
                window.requestAnimationFrame(function (tmstamp) {
                    ths.onEnterFrame(ths, tmstamp);
                });
            }
            else {
                var keys = Object.keys(this.initialWidths);
                if (this.initialWidthsAreSet === true && keys.length < maxColumnsPerRow) {
                    window.requestAnimationFrame(function (tmstamp) {
                        ths.awaitWidths(ths, tmstamp);
                    });
                }
                else {
                    this.checkForGridInitReady();
                }
            }
        };
        GridDirective.prototype.canHideColumn = function (column) {
            return column.hideColumnIf.canHide;
        };
        GridDirective.prototype.getFlattenedHierarchy = function () {
            var _this = this;
            var hierarchy = this.getColumnHierarchy();
            return hierarchy.columnGroups.reduce(function (prev, curr) {
                var arr = [curr];
                if (curr.subColumns) {
                    arr = arr.concat(_this.getSubColumns(curr));
                }
                return prev.concat(arr);
            }, []);
        };
        GridDirective.prototype.getSubColumns = function (item) {
            if (item.subColumns.length === 0) {
                return [];
            }
            var arr = [];
            for (var i = 0; i < item.subColumns.length; i++) {
                var subItem = item.subColumns[i];
                arr = arr.concat(subItem);
                if (subItem.subColumns.length > 0) {
                    arr = arr.concat(this.getSubColumns(subItem));
                }
            }
            return arr;
        };
        GridDirective.prototype.getColumnHierarchy = function () {
            var _this = this;
            var hierarchy = {
                columnGroups: []
            };
            var highestLevelGroup = this.colDataGroups[0];
            var hierarchyGroup = highestLevelGroup.map(function (item) {
                var levelCount = 0;
                return {
                    level: levelCount,
                    element: item.child,
                    parent: item.parent,
                    parentColumn: null,
                    subColumns: _this.getHierarchySubColumns(item, levelCount)
                };
            });
            hierarchy.columnGroups = hierarchyGroup;
            return hierarchy;
        };
        GridDirective.prototype.getHierarchySubColumns = function (item, levelCount) {
            var _this = this;
            levelCount++;
            if (!item.subGroups || item.subGroups.length === 0) {
                return [];
            }
            var subColumns = item.subGroups.map(function (subItem) {
                return {
                    level: levelCount,
                    element: subItem.child,
                    parent: subItem.parent,
                    parentColumn: item.child,
                    subColumns: _this.getHierarchySubColumns(subItem, levelCount)
                };
            });
            return subColumns;
        };
        GridDirective.prototype.checkForGridInitReady = function () {
            var _this = this;
            var allElementsWithDataResizable = this.columnsWithDataClasses;
            var el = allElementsWithDataResizable[0];
            var resizeClasses = this.getResizableClasses(el);
            var resizeCls = resizeClasses[0];
            var keys = Object.keys(this.initialWidths);
            var maxColumnsPerRow = this.parentGroups[this.parentGroups.length - 1].length;
            if (this.initialWidthsAreSet === true && (keys.length < maxColumnsPerRow || !this.initialWidths[resizeCls])) {
                window.requestAnimationFrame(function (tmstamp) {
                    _this.awaitWidths(_this, tmstamp);
                });
            }
            else if (this.initialWidthsAreSet === undefined) {
                window.requestAnimationFrame(function (tmstamp) {
                    _this.awaitWidths(_this, tmstamp);
                });
            }
            else {
                if (!this.linkClass) {
                    this.initGrid();
                }
                else {
                    window.requestAnimationFrame(function (tmstamp) {
                        _this.awaitSingleFrame(_this, tmstamp);
                    });
                }
            }
        };
        GridDirective.prototype.awaitWidths = function (ths, timestamp) {
            this.checkForGridInitReady();
        };
        GridDirective.prototype.awaitSingleFrame = function (ths, timestamp) {
            this.initGrid();
        };
        GridDirective.prototype.onPointerDown = function (event) {
            var _this = this;
            this.addPointerListeners();
            if (!this.getResizeGripUnderPoint(event)) {
                return;
            }
            // only drag on left mouse button
            if (event.button !== 0) {
                return;
            }
            // disables unwanted drag and drop functionality for selected text in browsers
            this.clearSelection();
            var el = this.elementRef.nativeElement;
            var resizeHandles;
            if (this.elementRef.nativeElement.reordering) {
                return;
            }
            var reorderHandlesUnderPoint = this.getReorderHandlesUnderPoint(event);
            var colsUnderPoint = this.getReorderColsUnderPoint(event);
            if (reorderHandlesUnderPoint.length > 0 && colsUnderPoint.length > 0) {
                this.elementRef.nativeElement.reordering = true;
                this.draggingColumn = colsUnderPoint[0];
                this.columnReorderStart.emit({
                    pointerEvent: event,
                    columnDragged: this.draggingColumn,
                    columnHovered: this.draggingColumn
                });
                var customReorderStartEvent = new CustomEvent(ColumnReorderEvent.ON_REORDER_START, {
                    detail: {
                        pointerEvent: event,
                        columnDragged: this.draggingColumn,
                        columnHovered: this.draggingColumn
                    }
                });
                this.elementRef.nativeElement.parentElement.dispatchEvent(customReorderStartEvent);
                var elRect = this.draggingColumn.getBoundingClientRect();
                this.dragOffsetX = (event.pageX - elRect.left) - window.scrollX;
                this.dragOffsetY = (event.pageY - elRect.top) - window.scrollY;
                this.removeDragAndDropComponent();
                this.createDragAndDropComponent();
                var dragNDropX = event.pageX - this.dragOffsetX;
                var dragNDropY = event.pageY - this.dragOffsetY;
                this.setDragAndDropPosition(dragNDropX, dragNDropY);
                this.attachReorderGhost(this.draggingColumn);
                this.setReorderHighlightHeight(this.draggingColumn);
                this.lastDraggedOverElement = this.draggingColumn;
                this.parentGroups.forEach(function (arr, index) {
                    if (arr.indexOf(_this.lastDraggedOverElement) !== -1) {
                        _this.lastDraggedGroupIndex = index;
                    }
                });
                this.reorderHandleColOffset = reorderHandlesUnderPoint[0].getBoundingClientRect().left - this.draggingColumn.getBoundingClientRect().left;
                this.lastDraggedGroupBoundingRects = this.parentGroups[this.lastDraggedGroupIndex].map(function (item) {
                    var boundingRect = item.getBoundingClientRect();
                    var rect = {
                        left: item.getBoundingClientRect().left + _this.getContainerScrollCount(item),
                        right: boundingRect.right + window.scrollX,
                        top: boundingRect.top,
                        bottom: boundingRect.bottom,
                        width: boundingRect.width,
                        height: boundingRect.height
                    };
                    rect.x = rect.left;
                    rect.y = rect.top;
                    rect.toJSON = {};
                    return rect;
                });
            }
            resizeHandles = this.resizableGrips;
            if (resizeHandles.length === 0) {
                return;
            }
            // if no handle exists, allow whole row to be resizable
            if (resizeHandles.length > 0) {
                var resizableElements = document.elementsFromPoint(event.clientX, event.clientY);
                var els = resizableElements.filter(function (item) {
                    var handleItem = null;
                    resizeHandles.forEach(function (resizeHandle) {
                        if (item === resizeHandle) {
                            handleItem = resizeHandle;
                        }
                    });
                    return handleItem !== null;
                });
                if (els.length === 0) {
                    return;
                }
            }
            this.dragging = true;
            var elements = this.getResizableElements(event);
            if (elements.length === 0) {
                return;
            }
            this.totalComputedMinWidth = 0;
            this.totalComputedWidth = 0;
            this.minWidths = [];
            this.startingWidths = [];
            this.currentClassesToResize = this.getResizableClasses(elements[0]);
            // disallow resizing the rightmost column with percent sizing
            if (this.resizeColumnWidthByPercent) {
                var lastColumnClass = this.getLastVisibleColumnClass();
                if (this.currentClassesToResize.indexOf(lastColumnClass) !== -1) {
                    this.dragging = false;
                }
            }
            this.currentClassesToResize.forEach(function (className) {
                var wdth = _this.getClassWidthInPixels(className);
                if (!_this.columnIsHiddenWithClass(className)) {
                    _this.totalComputedWidth += wdth;
                }
                _this.startingWidths.push(wdth);
            });
            this.setMinimumWidths();
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.columnResizeStart.emit({
                pointerEvent: event,
                columnWidth: this.totalComputedWidth,
                columnMinWidth: this.totalComputedMinWidth,
                classesBeingResized: this.currentClassesToResize
            });
            var customResizeStartEvent = new CustomEvent(ColumnResizeEvent.ON_RESIZE_START, {
                detail: {
                    pointerEvent: event,
                    columnWidth: this.totalComputedWidth,
                    columnMinWidth: this.totalComputedMinWidth,
                    classesBeingResized: this.currentClassesToResize
                }
            });
            this.elementRef.nativeElement.parentElement.dispatchEvent(customResizeStartEvent);
            // stop interference with reordering columns
            event.preventDefault();
            event.stopImmediatePropagation();
        };
        GridDirective.prototype.getClassWidthInPixels = function (className) {
            var classIndex = this.gridTemplateClasses.indexOf(className);
            var wdth = this.classWidths[classIndex];
            if (this.resizeColumnWidthByPercent) {
                wdth = wdth.replace('%', ''); // remove px
                var totalTableWidth = this.viewport.clientWidth;
                wdth = (Number(wdth) / 100 * totalTableWidth).toString();
            }
            return Number(wdth);
        };
        GridDirective.prototype.setMinimumWidths = function () {
            var _this = this;
            this.gridTemplateClasses.forEach(function (className) {
                var firstEl = _this.elementRef.nativeElement.querySelector('.' + className);
                var minWidth = window.getComputedStyle(firstEl).getPropertyValue('min-width');
                var wdth = Number(minWidth.substring(0, minWidth.length - 2)); // remove px
                wdth = Number(wdth) < _this.defaultTableMinWidth ? _this.defaultTableMinWidth : wdth; // account for minimum TD size in tables
                if (_this.currentClassesToResize.indexOf(className) !== -1 && !_this.columnIsHiddenWithClass(className)) {
                    _this.totalComputedMinWidth += wdth;
                }
                _this.minWidths.push(wdth);
            });
        };
        GridDirective.prototype.attachReorderGhost = function (column) {
            var _a;
            (_a = this.dragAndDropGhostComponent) === null || _a === void 0 ? void 0 : _a.updateView(column.reorderGhost, column.reorderGhostContext);
        };
        GridDirective.prototype.getContainerScrollCount = function (el) {
            if (!el) {
                return 0;
            }
            var scrollXCount = el.scrollLeft;
            while (el !== document.body) {
                el = el.parentElement;
                scrollXCount += el.scrollLeft;
            }
            // include scrolling on tablejs-grid component
            scrollXCount += el.parentElement.scrollLeft;
            return scrollXCount;
        };
        GridDirective.prototype.onPointerMove = function (event) {
            var e_1, _b;
            var ths = document['currentGridDirective'];
            if (ths.elementRef.nativeElement.reordering) {
                ths.clearSelection();
                var dragNDropX = event.pageX - ths.dragOffsetX;
                var dragNDropY = event.pageY - ths.dragOffsetY;
                ths.setDragAndDropPosition(dragNDropX, dragNDropY);
                var trueMouseX = event.pageX - ths.reorderHandleColOffset + ths.getContainerScrollCount(ths.draggingColumn);
                if (!ths.lastDraggedOverElement) {
                    return;
                }
                ths.columnReorder.emit({
                    pointerEvent: event,
                    columnDragged: ths.draggingColumn,
                    columnHovered: ths.lastDraggedOverElement
                });
                var customReorderEvent = new CustomEvent(ColumnReorderEvent.ON_REORDER, {
                    detail: {
                        pointerEvent: event,
                        columnDragged: ths.draggingColumn,
                        columnHovered: ths.lastDraggedOverElement
                    }
                });
                ths.elementRef.nativeElement.parentElement.dispatchEvent(customReorderEvent);
                var moveDirection_1 = 0;
                var currentRect = void 0;
                var currentColIndex = void 0;
                try {
                    for (var _c = __values(ths.lastDraggedGroupBoundingRects), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var rect = _d.value;
                        if (trueMouseX > rect.left && trueMouseX < rect.left + rect.width) {
                            var elX = rect.left;
                            var elW = rect.width;
                            if ((trueMouseX - elX) >= elW / 2) {
                                moveDirection_1 = 1;
                            }
                            else {
                                moveDirection_1 = 0;
                            }
                            currentRect = rect;
                            currentColIndex = ths.lastDraggedGroupBoundingRects.indexOf(rect);
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (currentColIndex === undefined) {
                    return;
                }
                if (ths.lastDraggedOverRect === currentRect && ths.lastMoveDirection === moveDirection_1) {
                    return;
                }
                ths.lastMoveDirection = moveDirection_1;
                ths.lastDraggedOverRect = currentRect;
                ths.removeElementHighlight(ths.lastDraggedOverElement);
                ths.removeHighlights(ths.lastDraggedOverElement, moveDirection_1);
                var draggableInColumn = ths.parentGroups[ths.lastDraggedGroupIndex][currentColIndex];
                ths.lastDraggedOverElement = draggableInColumn;
                var colRangeDraggedParentInd_1 = -1;
                var colRangeDraggedChildInd_1 = -1;
                var colRangeDroppedParentInd_1 = -1;
                var colRangeDroppedChildInd_1 = -1;
                var draggedInd_1 = -1;
                var droppedInd_1 = -1;
                var draggedGroup_1 = null;
                var pGroup = ths.colDataGroups.forEach(function (group, groupInd) { return group.forEach(function (columnData, index) {
                    var item = columnData.child;
                    if (item === ths.getRelatedHeader(ths.draggingColumn)) {
                        colRangeDraggedParentInd_1 = groupInd;
                        colRangeDraggedChildInd_1 = ths.getRangePosition(columnData); // index;
                        draggedInd_1 = index;
                        draggedGroup_1 = group;
                    }
                    if (item === ths.getRelatedHeader(ths.lastDraggedOverElement)) {
                        colRangeDroppedParentInd_1 = groupInd;
                        colRangeDroppedChildInd_1 = ths.getRangePosition(columnData); // index;
                        droppedInd_1 = index;
                    }
                }); });
                if (ths.draggingColumn === ths.lastDraggedOverElement) {
                    return;
                }
                var parentRanges_1 = null;
                var tempRanges = ths.colRangeGroups.concat();
                var parentRangeIndex_1 = -1;
                tempRanges.sort(function (a, b) { return b.length - a.length; });
                tempRanges.forEach(function (item, index) {
                    if (!parentRanges_1 && item.length < draggedGroup_1.length) {
                        parentRanges_1 = item;
                        parentRangeIndex_1 = ths.colRangeGroups.indexOf(item);
                    }
                });
                var fromOrder_1 = (colRangeDraggedChildInd_1 + 1);
                var toOrder_1 = (colRangeDroppedChildInd_1 + 1);
                // if has to stay within ranges, get ranges and swap
                if (parentRanges_1 !== null) {
                    ths.colRangeGroups[parentRangeIndex_1].forEach(function (range) {
                        var lowRange = range[0];
                        var highRange = range[1];
                        if (fromOrder_1 >= lowRange && fromOrder_1 < highRange && toOrder_1 >= lowRange && toOrder_1 < highRange) {
                            if (colRangeDraggedParentInd_1 === colRangeDroppedParentInd_1) {
                                if (moveDirection_1 === 1) {
                                    ths.lastDraggedOverElement.classList.add('highlight-right');
                                }
                                else {
                                    ths.lastDraggedOverElement.classList.add('highlight-left');
                                }
                                ths.elementsWithHighlight.push({ el: ths.lastDraggedOverElement, moveDirection: moveDirection_1 });
                            }
                        }
                    });
                }
                else {
                    if (colRangeDraggedParentInd_1 === colRangeDroppedParentInd_1) {
                        if (moveDirection_1 === 1) {
                            ths.lastDraggedOverElement.classList.add('highlight-right');
                        }
                        else {
                            ths.lastDraggedOverElement.classList.add('highlight-left');
                        }
                        ths.elementsWithHighlight.push({ el: ths.lastDraggedOverElement, moveDirection: moveDirection_1 });
                    }
                }
            }
            if (!ths.dragging) {
                return;
            }
            var mouseOffset = Math.round(event.clientX) - Math.round(ths.startX);
            var widthsNeedUpdating = Math.round(event.clientX) !== ths.startX;
            ths.startX = Math.round(event.clientX); // reset starting X
            var newWidth = ths.totalComputedWidth + mouseOffset;
            var allowableWidthChange = newWidth - ths.totalComputedMinWidth;
            if (allowableWidthChange <= 0) {
                return;
            }
            if (widthsNeedUpdating) {
                ths.updateWidths(newWidth);
            }
            ths.columnResize.emit({
                pointerEvent: event,
                columnWidth: ths.totalComputedWidth,
                columnMinWidth: ths.totalComputedMinWidth
            });
            var customResizeEvent = new CustomEvent(ColumnResizeEvent.ON_RESIZE, {
                detail: {
                    pointerEvent: event,
                    columnWidth: ths.totalComputedWidth,
                    columnMinWidth: ths.totalComputedMinWidth
                }
            });
            ths.elementRef.nativeElement.parentElement.dispatchEvent(customResizeEvent);
        };
        GridDirective.prototype.getLastVisibleColumnClass = function () {
            var _this = this;
            var highestOrderIndex = 0;
            var lastVisibleColumnClass = '';
            this.gridTemplateClasses.forEach(function (className) {
                var classNameIndex = _this.gridTemplateClasses.indexOf(className);
                var gridOrderIndex = _this.gridOrder.indexOf(classNameIndex + 1);
                if (_this.hiddenColumnIndices.indexOf(gridOrderIndex + 1) === -1) {
                    if (gridOrderIndex > highestOrderIndex) {
                        highestOrderIndex = gridOrderIndex;
                        lastVisibleColumnClass = className;
                    }
                }
            });
            return lastVisibleColumnClass;
        };
        GridDirective.prototype.getRangePosition = function (columnData) {
            var subGroups = columnData.subGroups;
            var child = columnData;
            while (subGroups.length > 0) {
                child = subGroups[0];
                subGroups = child.subGroups;
            }
            return child.nthChild - 1;
        };
        GridDirective.prototype.columnIsHiddenWithClass = function (className) {
            var classNameIndex = this.gridTemplateClasses.indexOf(className);
            var gridOrderIndex = this.gridOrder.indexOf(classNameIndex + 1);
            return this.hiddenColumnIndices.indexOf(gridOrderIndex + 1) !== -1;
        };
        GridDirective.prototype.getTotalGroupedColumnsVisible = function (sortableWidths) {
            var len = sortableWidths.length;
            var totalGroupedColumnsVisible = 0;
            for (var i = 0; i < len; i++) {
                var item = sortableWidths[i];
                if (!this.columnIsHiddenWithClass(item.className)) {
                    totalGroupedColumnsVisible++;
                }
            }
            return totalGroupedColumnsVisible;
        };
        GridDirective.prototype.getFirstGridOrderIndexAfterColumnGroup = function (sortableWidthGroup) {
            var _this = this;
            var maxIndex = -1;
            sortableWidthGroup.forEach(function (classItem) {
                var columnIndx = _this.gridTemplateClasses.indexOf(classItem.className);
                var gridOrderIndex = _this.gridOrder.indexOf(columnIndx + 1);
                if (maxIndex < gridOrderIndex) {
                    maxIndex = gridOrderIndex;
                }
            });
            return maxIndex + 1;
        };
        // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
        GridDirective.prototype.getPostColumnWidthTotal = function (startingIndex) {
            var count = 0;
            for (var i = startingIndex; i < this.gridOrder.length; i++) {
                var clsIndex = this.gridOrder[i] - 1;
                var perc = Number(this.classWidths[clsIndex].toString().replace('%', ''));
                if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
                    count += perc;
                }
            }
            return count;
        };
        // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
        GridDirective.prototype.getPostColumnMinimumWidthTotal = function (startingIndex) {
            var count = 0;
            for (var i = startingIndex; i < this.gridOrder.length; i++) {
                var clsIndex = this.gridOrder[i] - 1;
                var perc = Number(this.minWidths[clsIndex].toString().replace('%', ''));
                if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
                    count += perc;
                }
            }
            return count;
        };
        // returns a number in percent moved two decimal places over (10.245 is equal to 10.245%)
        GridDirective.prototype.getPreviousColumnWidthTotal = function (sortableWidthGroup) {
            var _this = this;
            var count = 0;
            var minIndex = Infinity;
            sortableWidthGroup.forEach(function (classItem) {
                var columnIndx = _this.gridTemplateClasses.indexOf(classItem.className);
                var gridOrderIndex = _this.gridOrder.indexOf(columnIndx + 1);
                if (minIndex > gridOrderIndex) {
                    minIndex = gridOrderIndex;
                }
            });
            for (var i = 0; i < minIndex; i++) {
                var classIndx = this.gridOrder[i] - 1;
                var wdth = Number(this.classWidths[classIndx].toString().replace('%', ''));
                count += wdth;
            }
            return count;
        };
        GridDirective.prototype.updateWidthsInPercent = function (newWidth, sortableWidths, totalGroupedColumnsVisible, sortableWidthGroup) {
            var _this = this;
            var totalTableWidth = this.viewport.clientWidth;
            var newWidthInPercent = newWidth / totalTableWidth * 100;
            var classMinWidths = sortableWidths.map(function (item) { return item.minWidth; });
            var groupMinWidthCalc = classMinWidths.reduce(function (prev, curr) { return prev + curr; });
            var firstGridOrderIndexAfterColumnGroup = this.getFirstGridOrderIndexAfterColumnGroup(sortableWidthGroup);
            var colsPastMinWidthCalc = this.getPostColumnMinimumWidthTotal(firstGridOrderIndexAfterColumnGroup);
            var colsPastMinWidthInPercent = colsPastMinWidthCalc / totalTableWidth * 100;
            var colsPastWidthPerc = this.getPostColumnWidthTotal(firstGridOrderIndexAfterColumnGroup);
            var prevColPercentTotal = 0;
            prevColPercentTotal = this.getPreviousColumnWidthTotal(sortableWidthGroup);
            var percentMoved = (prevColPercentTotal + newWidthInPercent + colsPastWidthPerc) - 100;
            if (prevColPercentTotal + newWidthInPercent + colsPastMinWidthInPercent > 100) {
                var actualPerCanMove = 100 - (prevColPercentTotal + colsPastMinWidthInPercent);
                newWidthInPercent = actualPerCanMove;
            }
            if (newWidth < groupMinWidthCalc) {
                newWidthInPercent = groupMinWidthCalc / totalTableWidth * 100;
            }
            sortableWidths.sort(function (item1, item2) {
                var wdth1 = item1.width;
                var wdth2 = item2.width;
                if (wdth1 === wdth2) {
                    return 0;
                }
                return wdth1 < wdth2 ? -1 : 1;
            });
            var mappedGroupWidthsInPixels = sortableWidths.map(function (item) { return item.width; });
            var totalPrevGroupWidths = mappedGroupWidthsInPixels.reduce(function (prev, curr) { return prev + curr; });
            var dispersedPercs = sortableWidths.map(function (item) { return item.width / totalPrevGroupWidths; });
            var totalPercMoved = newWidthInPercent - (totalPrevGroupWidths / totalTableWidth * 100);
            var additionalPercentFromColumnsToSmall = 0;
            var sortableWidthsLen = sortableWidths.length;
            sortableWidths.forEach(function (item, index) {
                var classIndex = _this.gridTemplateClasses.indexOf(item.className);
                var minWidthInPercent = _this.minWidths[classIndex] / totalTableWidth * 100;
                var calculatedPercent = dispersedPercs[index] * newWidthInPercent;
                if (calculatedPercent < minWidthInPercent) {
                    additionalPercentFromColumnsToSmall += minWidthInPercent - calculatedPercent;
                    calculatedPercent = minWidthInPercent;
                }
                else {
                    var itemsRemaining = sortableWidthsLen - index - 1;
                    if (itemsRemaining !== 0) {
                        var extraAmtToRemove = additionalPercentFromColumnsToSmall / itemsRemaining;
                        calculatedPercent -= extraAmtToRemove;
                        additionalPercentFromColumnsToSmall -= extraAmtToRemove;
                    }
                }
                var colWidthInPercent = calculatedPercent.toString() + '%';
                _this.classWidths[classIndex] = colWidthInPercent;
            });
            var remainingPercToDisperse = totalPercMoved + additionalPercentFromColumnsToSmall;
            var maxPercsCanMovePerCol = [];
            for (var i = firstGridOrderIndexAfterColumnGroup; i < this.gridOrder.length; i++) {
                var clsIndex = this.gridOrder[i] - 1;
                var perc = Number(this.classWidths[clsIndex].toString().replace('%', ''));
                var minWidthPerc = (this.minWidths[clsIndex] / totalTableWidth * 100);
                if (this.hiddenColumnIndices.indexOf(i + 1) === -1) {
                    maxPercsCanMovePerCol.push({
                        moveAmt: percentMoved > 0 ? perc - minWidthPerc : perc,
                        classIndex: clsIndex
                    });
                }
            }
            var totalPercsCanMove = maxPercsCanMovePerCol.reduce(function (prev, curr) { return prev + curr.moveAmt; }, 0.0000001);
            maxPercsCanMovePerCol.forEach(function (item) {
                var percOfTotalMovementAllowed = item.moveAmt / totalPercsCanMove;
                var percOfRemainingDispersement = percOfTotalMovementAllowed * remainingPercToDisperse;
                var perc = Number(_this.classWidths[item.classIndex].toString().replace('%', ''));
                var dispersedWidth = perc - percOfRemainingDispersement;
                _this.classWidths[item.classIndex] = dispersedWidth + '%';
            });
            newWidth = newWidthInPercent / 100 * totalTableWidth;
            var amountMoved = newWidth - totalPrevGroupWidths;
            amountMoved = Math.round(amountMoved * 100) / 100; // round to 2 decimal points
            this.totalComputedWidth += amountMoved;
            var gridTemplateColumns = this.constructGridTemplateColumns();
            this.gridTemplateTypes.forEach(function (styleObj) {
                styleObj.style.innerHTML = _this.id + ' .' + _this.reorderableClass + ' { display: grid; grid-template-columns:' + gridTemplateColumns + '; }';
                _this.setStyleContent();
            });
        };
        GridDirective.prototype.updateWidthsInPixels = function (newWidth, sortableWidths, totalGroupedColumnsVisible) {
            var _this = this;
            var remainingWidth = this.totalComputedWidth - newWidth;
            sortableWidths.forEach(function (item) {
                var maxPercOfRemaining = 1 / totalGroupedColumnsVisible;
                var amountMoved = 0;
                var resizeID = _this.id + ' .' + item.className;
                if (item.width - item.minWidth < maxPercOfRemaining * remainingWidth) {
                    amountMoved = item.width - item.minWidth;
                }
                else {
                    amountMoved = maxPercOfRemaining * remainingWidth;
                }
                amountMoved = Math.round(amountMoved * 100) / 100; // round to 2 decimal points
                var classIndex = _this.gridTemplateClasses.indexOf(item.className);
                _this.classWidths[classIndex] = (item.width - amountMoved);
                var markupItem = _this.stylesByClass.filter(function (style) { return style.id === resizeID; })[0];
                var markup = resizeID + ' { width: ' + (item.width - amountMoved) + 'px }';
                markupItem.markup = markup;
                markupItem.width = (item.width - amountMoved).toString();
                _this.totalComputedWidth -= amountMoved;
            });
            var gridTemplateColumns = this.constructGridTemplateColumns();
            this.gridTemplateTypes.forEach(function (styleObj) {
                styleObj.style.innerHTML = _this.id + ' .' + _this.reorderableClass + ' { display: grid; grid-template-columns:' + gridTemplateColumns + '; }';
                _this.setStyleContent();
            });
        };
        GridDirective.prototype.fitWidthsToOneHundredPercent = function () {
            var _this = this;
            var numericalWidths = this.classWidths.map(function (wdth, index) { return Number(wdth.replace('%', '')); });
            var widthTotal = numericalWidths.reduce(function (prev, wdth) {
                return prev + wdth;
            }, 0);
            var scaledWidths = numericalWidths.map(function (wdth, index) {
                return {
                    width: wdth / widthTotal * 100,
                    index: index
                };
            });
            scaledWidths.forEach(function (item, index) {
                _this.classWidths[item.index] = scaledWidths[item.index].width.toString() + '%';
            });
        };
        GridDirective.prototype.updateWidths = function (newWidth) {
            var _this = this;
            var currentWidths = this.currentClassesToResize.map(function (resizeClass) {
                return _this.getClassWidthInPixels(resizeClass);
            });
            var sortableWidths = currentWidths.map(function (w, index) {
                return {
                    minWidth: _this.minWidths[index],
                    width: w,
                    className: _this.currentClassesToResize[index]
                };
            });
            var visibleSortableWidths = sortableWidths.filter(function (item) {
                return !_this.columnIsHiddenWithClass(item.className);
            });
            var totalGroupedColumnsVisible = this.getTotalGroupedColumnsVisible(visibleSortableWidths);
            if (this.resizeColumnWidthByPercent) {
                this.updateWidthsInPercent(newWidth, visibleSortableWidths, totalGroupedColumnsVisible, sortableWidths);
            }
            else {
                this.updateWidthsInPixels(newWidth, visibleSortableWidths, totalGroupedColumnsVisible);
            }
            this.generateWidthStyle();
        };
        GridDirective.prototype.generateWidthStyle = function () {
            var innerHTML = '';
            this.stylesByClass.forEach(function (item) {
                innerHTML += item.markup;
            });
            this.widthStyle.innerHTML = innerHTML;
            this.setStyleContent();
        };
        GridDirective.prototype.getResizableClasses = function (el) {
            return el ? el['dataClasses'] : null;
        };
        GridDirective.prototype.setResizableStyles = function () {
            var _this = this;
            var allElementsWithDataResizable = this.columnsWithDataClasses;
            var el;
            var classesUsed = [];
            var fragment;
            var style;
            var styleText = '';
            if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
                fragment = document.createDocumentFragment();
                style = document.createElement('style');
                style.type = 'text/css';
            }
            else {
                fragment = this.gridService.linkedDirectiveObjs[this.linkClass].widthStyleFragment;
                style = this.gridService.linkedDirectiveObjs[this.linkClass].widthStyle;
            }
            var markup;
            if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
                for (var i = 0; i < allElementsWithDataResizable.length; i++) {
                    el = allElementsWithDataResizable[i];
                    var resizeClasses = this.getResizableClasses(el);
                    resizeClasses.forEach(function (resizeCls) {
                        if (classesUsed.indexOf(resizeCls) === -1) {
                            var firstEl = _this.elementRef.nativeElement.getElementsByClassName(resizeCls)[0];
                            var startingWidth = !!_this.initialWidths[resizeCls] ? _this.initialWidths[resizeCls] : firstEl.offsetWidth;
                            // Override percentage if we have widthPercent enabled
                            var startingWidthPercent = _this.initialWidths[resizeCls];
                            var resizeID = _this.id + ' .' + resizeCls;
                            if (_this.resizeColumnWidthByPercent || startingWidth.toString().includes('%')) {
                                markup = resizeID + ' { width: ' + 100 + '%}';
                                _this.resizeColumnWidthByPercent = true;
                            }
                            else {
                                markup = resizeID + ' { width: ' + startingWidth + 'px }';
                            }
                            styleText += markup;
                            _this.stylesByClass.push({ style: style, id: resizeID, resizeClass: resizeCls, markup: markup, width: startingWidth });
                            classesUsed.push(resizeCls);
                        }
                    });
                }
            }
            else {
                this.stylesByClass = this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass;
            }
            if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
                style.innerHTML = styleText;
            }
            fragment.appendChild(style);
            this.widthStyle = style;
            this.widthStyleFragment = fragment;
            this.addStyle(style, false);
            if (this.linkClass) {
                if (this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
                    this.gridService.linkedDirectiveObjs[this.linkClass] = {};
                    this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective = this;
                    this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass = this.stylesByClass;
                }
                this.gridService.linkedDirectiveObjs[this.linkClass].widthStyleFragment = fragment;
                this.gridService.linkedDirectiveObjs[this.linkClass].widthStyle = style;
            }
        };
        GridDirective.prototype.addStyle = function (style, addToContent) {
            if (addToContent === void 0) { addToContent = true; }
            if (this.styleList.indexOf(style) === -1) {
                this.styleList.push(style);
            }
            if (addToContent) {
                this.setStyleContent();
            }
        };
        GridDirective.prototype.setStyleContent = function () {
            var _this = this;
            this.styleContent = '';
            this.styleList.forEach(function (style) {
                _this.styleContent += style.innerHTML;
            });
            this.headStyle.innerHTML = this.styleContent;
        };
        GridDirective.prototype.moveStyleContentToProminent = function () {
            this.headTag.appendChild(this.headStyle);
        };
        GridDirective.prototype.setReorderStyles = function () {
            if (this.linkClass === undefined || (this.gridService.linkedDirectiveObjs[this.linkClass] && this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle === undefined)) {
                var fragment = document.createDocumentFragment();
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = this.id + ' .highlight-left div:after, ' + this.id + ' .highlight-right div:after { height: 200px !important }';
                fragment.appendChild(style);
                this.reorderHighlightStyle = style;
                this.reorderHighlightStyleFragment = fragment;
                this.addStyle(style, false);
                if (this.linkClass) {
                    this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle = this.reorderHighlightStyle;
                    this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyleFragment = this.reorderHighlightStyleFragment;
                }
            }
            else {
                this.reorderHighlightStyle = this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyle;
                this.reorderHighlightStyleFragment = this.gridService.linkedDirectiveObjs[this.linkClass].reorderHighlightStyleFragment;
            }
        };
        GridDirective.prototype.getColSpan = function (element) {
            var colSpan = element.getAttribute('colspan');
            return colSpan === null ? 1 : Number(colSpan);
        };
        GridDirective.prototype.validateColumnSpansAreTheSame = function (colSpans) {
            if (colSpans.length === 0) {
                throw Error('No columns appear to exist.');
            }
            var colLength = colSpans[0];
            var invalidColLengths = colSpans.filter(function (item) { return item !== colLength; });
            if (invalidColLengths.length > 0) {
                throw Error('Grid column lengths do not match.  Please check your colspans.');
            }
        };
        GridDirective.prototype.onPointerUp = function (event) {
            var ths = document['currentGridDirective'];
            ths.removePointerListeners();
            if (ths.elementRef.nativeElement.reordering) {
                ths.elementRef.nativeElement.reordering = false;
                ths.removeDragAndDropComponent();
                if (!ths.lastDraggedOverElement) {
                    return;
                }
                ths.removeElementHighlight(ths.lastDraggedOverElement);
                ths.removeHighlights();
                if (ths.reorderGrips.length !== 0) {
                    ths.reorderColumns(event);
                }
                ths.columnReorderEnd.emit({
                    pointerEvent: event,
                    columnDragged: ths.draggingColumn,
                    columnHovered: ths.lastDraggedOverElement
                });
                var customReorderEndEvent = new CustomEvent(ColumnReorderEvent.ON_REORDER_END, {
                    detail: {
                        pointerEvent: event,
                        columnDragged: ths.draggingColumn,
                        columnHovered: ths.lastDraggedOverElement
                    }
                });
                ths.elementRef.nativeElement.parentElement.dispatchEvent(customReorderEndEvent);
                ths.lastDraggedOverElement = null;
                ths.lastMoveDirection = -1;
                ths.draggingColumn.classList.remove('dragging');
                ths.draggingColumn = null;
            }
            if (!ths.dragging) {
                return;
            }
            ths.columnResizeEnd.emit({
                pointerEvent: event,
                columnWidth: ths.totalComputedWidth,
                columnMinWidth: ths.totalComputedMinWidth,
                classesBeingResized: ths.currentClassesToResize
            });
            var customResizeEndEvent = new CustomEvent(ColumnResizeEvent.ON_RESIZE_END, {
                detail: {
                    pointerEvent: event,
                    columnWidth: ths.totalComputedWidth,
                    columnMinWidth: ths.totalComputedMinWidth,
                    classesBeingResized: ths.currentClassesToResize
                }
            });
            ths.elementRef.nativeElement.parentElement.dispatchEvent(customResizeEndEvent);
            ths.endDrag(event);
        };
        GridDirective.prototype.addPointerListeners = function () {
            this.document['currentGridDirective'] = this;
            this.document.addEventListener('pointermove', this.onPointerMove);
            this.document.addEventListener('pointerup', this.onPointerUp);
        };
        GridDirective.prototype.removePointerListeners = function () {
            this.document['currentGridDirective'] = null;
            this.document.removeEventListener('pointermove', this.onPointerMove);
            this.document.removeEventListener('pointerup', this.onPointerUp);
        };
        GridDirective.prototype.endDrag = function (event) {
            if (!this.dragging) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            event.stopImmediatePropagation();
            this.totalComputedMinWidth = 0;
            this.totalComputedWidth = 0;
            this.currentClassesToResize = [];
            this.minWidths = [];
            this.startingWidths = [];
            this.dragging = false;
        };
        GridDirective.prototype.initGrid = function () {
            if (this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass] === undefined) {
                this.headStyle = document.createElement('style');
                this.headStyle.type = 'text/css';
                this.headTag.appendChild(this.headStyle);
            }
            else {
                this.headStyle = this.gridService.linkedDirectiveObjs[this.linkClass].headStyle;
            }
            this.generateContainerID();
            this.generateViewportID();
            this.attachContentResizeSensor();
            this.setResizableStyles();
            this.setReorderStyles();
            this.generateColumnGroups();
            this.setGridTemplateClasses();
            if (this.linkClass !== undefined && this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass) {
                this.stylesByClass = this.gridService.linkedDirectiveObjs[this.linkClass].stylesByClass;
                this.classWidths = this.gridService.linkedDirectiveObjs[this.linkClass].classWidths;
            }
            if (this.linkClass !== undefined && this.gridService.linkedDirectiveObjs[this.linkClass].classWidths) {
                this.classWidths = this.gridService.linkedDirectiveObjs[this.linkClass].classWidths;
            }
            else {
                this.classWidths = this.calculateWidthsFromStyles();
                if (this.linkClass) {
                    this.gridService.linkedDirectiveObjs[this.linkClass].classWidths = this.classWidths;
                }
            }
            this.setGridOrder();
            this.emitGridInitialization();
        };
        GridDirective.prototype.setGridTemplateClasses = function () {
            var _this = this;
            var ind = -1;
            var highestLen = 0;
            var group;
            for (var index = 0; index < this.parentGroups.length; index++) {
                group = this.parentGroups[index];
                if (group.length > highestLen) {
                    highestLen = group.length;
                    ind = index;
                }
            }
            if (this.parentGroups.length !== 0) {
                this.parentGroups[ind].forEach(function (item2, index) {
                    _this.gridTemplateClasses.push(_this.getResizableClasses(item2)[0]);
                });
            }
            if (this.linkClass) {
                if (!this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses) {
                    this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses = this.gridTemplateClasses;
                }
                else {
                    this.verifyLinkedTemplateClassesMatch();
                }
            }
        };
        GridDirective.prototype.verifyLinkedTemplateClassesMatch = function () {
            var _this = this;
            var columnsAreTheSame = true;
            this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses.forEach(function (item, index) {
                if (item !== _this.gridTemplateClasses[index]) {
                    columnsAreTheSame = false;
                }
            });
            if (!columnsAreTheSame) {
                throw Error("Column classes must match for linked tables:\n\n " + this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateClasses + "\n   does not match\n " + this.gridTemplateClasses + "\n");
            }
        };
        GridDirective.prototype.calculateWidthsFromStyles = function () {
            var _this = this;
            if (!this.stylesByClass[0].width.toString().includes('%') && this.classWidths.length === 0 && this.resizeColumnWidthByPercent) {
                return this.stylesByClass.map(function (styleObj, index) {
                    return (Math.round((1 / _this.stylesByClass.length) * 10000) / 100).toString() + '%';
                });
            }
            else {
                return this.stylesByClass.map(function (styleObj, index) {
                    if (styleObj.width.toString().includes('%')) {
                        return styleObj.width;
                    }
                    else {
                        return Number(styleObj.width);
                    }
                });
            }
        };
        GridDirective.prototype.emitGridInitialization = function () {
            var emitterObj = {
                gridComponent: this,
                gridElement: this.elementRef.nativeElement
            };
            this.preGridInitialize.emit(emitterObj);
            this.gridInitialize.emit(emitterObj);
            var customGridInitializedEvent = new CustomEvent(GridEvent.ON_INITIALIZED, {
                detail: {
                    gridComponent: emitterObj.gridComponent,
                    gridElement: emitterObj.gridComponent,
                    type: GridEvent.ON_INITIALIZED
                }
            });
            this.elementRef.nativeElement.parentElement.dispatchEvent(customGridInitializedEvent);
        };
        GridDirective.prototype.createDragAndDropComponent = function () {
            var componentRef = this.openModal(DragAndDropGhostComponent, this.DRAG_AND_DROP_GHOST_OVERLAY_DATA, {});
            this.dragAndDropGhostComponent = componentRef.instance;
        };
        GridDirective.prototype.openModal = function (componentType, token, data, positionStrategy, overlayConfig) {
            if (positionStrategy === void 0) { positionStrategy = null; }
            if (overlayConfig === void 0) { overlayConfig = null; }
            if (!positionStrategy) {
                positionStrategy = this.overlay
                    .position()
                    .global()
                    .centerHorizontally()
                    .centerVertically();
            }
            if (!overlayConfig) {
                overlayConfig = new overlay.OverlayConfig({
                    hasBackdrop: true,
                    backdropClass: 'modal-bg',
                    panelClass: 'modal-container',
                    scrollStrategy: this.overlay.scrollStrategies.block(),
                    positionStrategy: positionStrategy
                });
            }
            this.overlayRef = this.overlay.create(overlayConfig);
            this.injector = this.createInjector(data, token);
            var containerPortal = new portal.ComponentPortal(componentType, null, this.injector);
            var containerRef = this.overlayRef.attach(containerPortal);
            return containerRef;
        };
        GridDirective.prototype.createInjector = function (dataToPass, token) {
            return i0.Injector.create({
                parent: this.injector,
                providers: [
                    { provide: token, useValue: dataToPass }
                ]
            });
        };
        GridDirective.prototype.setDragAndDropPosition = function (x, y) {
            this.dragAndDropGhostComponent.left = x;
            this.dragAndDropGhostComponent.top = y;
        };
        GridDirective.prototype.removeDragAndDropComponent = function () {
            if (this.overlayRef) {
                this.overlayRef.detach();
            }
        };
        GridDirective.prototype.setParentGroups = function (allElementsWithDataResizable) {
            var colSpans = [];
            var currSpanCount = 0;
            var lastParent = null;
            var children;
            var columnStart = 1;
            var colRanges = [];
            this.colRangeGroups.push(colRanges);
            var item;
            for (var index = 0; index < allElementsWithDataResizable.length; index++) {
                var item_1 = allElementsWithDataResizable[index];
                var span = this.getColSpan(item_1);
                if (item_1.parentElement !== lastParent) {
                    if (index !== 0) {
                        colSpans.push(currSpanCount);
                        columnStart = 1;
                        colRanges = [];
                        this.colRangeGroups.push(colRanges);
                    }
                    currSpanCount = 0;
                    lastParent = item_1.parentElement;
                    children = [];
                    this.parentGroups.push(children);
                }
                colRanges.push([columnStart, (span + columnStart)]);
                currSpanCount += span;
                columnStart += span;
                children.push(item_1);
            }
            colSpans.push(currSpanCount);
            this.validateColumnSpansAreTheSame(colSpans);
        };
        GridDirective.prototype.generateColumnGroups = function () {
            var allElementsWithDataResizable = this.columnsWithDataClasses;
            var arr = allElementsWithDataResizable;
            var colOrder = 1;
            var lastParent = null;
            var lastGroup = null;
            var lastOrder = 0;
            var lastIndex = 0;
            var spanCount = 0;
            var colDataGroup = [];
            this.colDataGroups.push(colDataGroup);
            for (var index = 0; index < arr.length; index++) {
                var item = arr[index];
                if (item.parentElement !== lastParent) {
                    if (index !== 0) {
                        colOrder = 1;
                        lastGroup = colDataGroup;
                        lastOrder = index;
                        lastIndex = 0;
                        colDataGroup = [];
                        this.colDataGroups.push(colDataGroup);
                    }
                    lastParent = item.parentElement;
                }
                colOrder = index + 1 - lastOrder;
                if (lastGroup !== null) {
                    if (lastGroup[lastIndex].span < (colOrder - spanCount)) {
                        spanCount += lastGroup[lastIndex].span;
                        lastIndex++;
                    }
                }
                this.colData = {
                    order: colOrder,
                    lastDataSpan: (colOrder - spanCount),
                    nthChild: colOrder,
                    span: this.getColSpan(item),
                    subGroups: [],
                    parent: item.parentElement,
                    child: item,
                    linkedChildren: [],
                    subColumnLength: 0
                };
                colDataGroup.push(this.colData);
            }
            var groupsWereSet = false;
            if (this.linkClass && this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups) {
                this.verifyLinkedGroupStructuresMatch(this.colDataGroups, this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups);
                groupsWereSet = true;
                this.colDataGroups = this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups;
                this.colDataGroups = this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups;
            }
            if (this.linkClass) {
                this.gridService.linkedDirectiveObjs[this.linkClass].colDataGroups = this.colDataGroups;
            }
            if (!groupsWereSet) {
                var columnGroup = void 0;
                for (var index = 0, len = this.colDataGroups.length; index < len; index++) {
                    columnGroup = this.colDataGroups[index];
                    if (index < this.colDataGroups.length - 1) {
                        this.generateSubGroup(columnGroup, this.colDataGroups[index + 1]);
                    }
                    if (index === len - 1) {
                        this.orderSubGroups(columnGroup);
                    }
                }
            }
            else {
                this.setLinkedHeaderContainerClasses();
                this.setLinkedChildren();
                if (this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs) {
                    this.gridTemplateTypes = this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateTypes;
                    this.styleList = this.gridService.linkedDirectiveObjs[this.linkClass].styleList;
                    this.subGroupStyleObjs = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs;
                    this.subGroupStyles = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles;
                    this.subGroupFragments = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments;
                    this.gridOrder = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder;
                }
            }
        };
        GridDirective.prototype.verifyLinkedGroupStructuresMatch = function (colDataGroups1, colDataGroups2) {
            var columnGroupsAreTheSame = true;
            if (colDataGroups1.length !== colDataGroups2.length) {
                columnGroupsAreTheSame = false;
            }
            for (var i = 0; i < colDataGroups1.length; i++) {
                var colDataGroup1 = colDataGroups1[i];
                var colDataGroup2 = colDataGroups2[i];
                if (colDataGroup1.length !== colDataGroup2.length) {
                    columnGroupsAreTheSame = false;
                }
            }
            if (!columnGroupsAreTheSame) {
                throw Error("The header structure for linked tables does not match.\nPlease check your column spans.");
            }
        };
        GridDirective.prototype.setHiddenClassForAllLinkedParentHeaders = function () {
            var flattenedHierarchy = this.getFlattenedHierarchy();
            var flattenedHeirarchyLenMin1 = flattenedHierarchy.length - 1;
            // start at the end to get the deepest child possible
            for (var i = flattenedHeirarchyLenMin1; i >= 0; i--) {
                var columnHierarchy = flattenedHierarchy[i];
            }
            var elementsReshown = [];
            var startIndex = this.colDataGroups.length - 2;
            for (var i = startIndex; i >= 0; i--) {
                var colDataGroup = this.colDataGroups[i];
                for (var j = 0; j < colDataGroup.length; j++) {
                    var columnData = colDataGroup[j];
                    var parentElement = columnData.child;
                    var parentWasHidden = parentElement.hideColumn;
                    var hiddenChildCount = 0;
                    for (var k = 0; k < columnData.subGroups.length; k++) {
                        var subGroup = columnData.subGroups[k];
                        if (subGroup.child.hideColumn) {
                            hiddenChildCount++;
                        }
                    }
                    if (columnData.subGroups.length !== 0) {
                        if (!parentWasHidden && hiddenChildCount === columnData.subGroups.length) {
                            parentElement.hideColumn = true;
                            this.setHiddenClassForColumnGroup(columnData.child, colDataGroup[j]);
                        }
                        else if (parentWasHidden && hiddenChildCount < columnData.subGroups.length) {
                            parentElement.hideColumn = false;
                            elementsReshown.push(parentElement);
                        }
                    }
                }
            }
            return elementsReshown;
        };
        GridDirective.prototype.setHiddenClassForAllLinkedHeaders = function (element) {
            for (var i = 0; i < this.colDataGroups.length; i++) {
                var colDataGroup = this.colDataGroups[i];
                for (var j = 0; j < colDataGroup.length; j++) {
                    this.setHiddenClassForColumnGroup(element, colDataGroup[j]);
                }
            }
        };
        GridDirective.prototype.setHiddenClassForColumnGroup = function (element, columnGroup) {
            var _this = this;
            var columnData = columnGroup;
            if (columnData.child === element) {
                element.classList.remove(this.HIDDEN_COLUMN_CLASS);
                var hideColumn_1 = element.hideColumn;
                if (hideColumn_1) {
                    element.classList.add(this.HIDDEN_COLUMN_CLASS);
                }
                columnData.linkedChildren.forEach(function (header) {
                    header.hideColumn = hideColumn_1;
                    header.classList.remove(_this.HIDDEN_COLUMN_CLASS);
                    if (hideColumn_1) {
                        header.classList.add(_this.HIDDEN_COLUMN_CLASS);
                    }
                });
                for (var i = 0; i < columnData.subGroups.length; i++) {
                    var subGroup = columnData.subGroups[i];
                    subGroup.child.hideColumn = hideColumn_1;
                    this.setHiddenClassForColumnGroup(subGroup.child, subGroup);
                }
            }
        };
        GridDirective.prototype.getRelatedHeaders = function (element) {
            if (element.relatedElements) {
                return element.relatedElements;
            }
            var relatedElements = [];
            for (var i = 0; i < this.colDataGroups.length; i++) {
                var colDataGroup = this.colDataGroups[i];
                for (var j = 0; j < colDataGroup.length; j++) {
                    var columnData = colDataGroup[j];
                    if (element === columnData.child || this.getRelatedHeader(element) === columnData.child) {
                        relatedElements.push(columnData.child);
                        columnData.linkedChildren.forEach(function (child) {
                            relatedElements.push(child);
                        });
                    }
                }
            }
            return relatedElements;
        };
        GridDirective.prototype.getRelatedHeader = function (element) {
            if (element.relatedElement) {
                return element.relatedElement;
            }
            var relatedElement = null;
            for (var i = 0; i < this.colDataGroups.length; i++) {
                var colDataGroup = this.colDataGroups[i];
                for (var j = 0; j < colDataGroup.length; j++) {
                    var columnData = colDataGroup[j];
                    var filteredChildren = columnData.linkedChildren.filter(function (child) { return child === element; });
                    if (filteredChildren.length > 0) {
                        relatedElement = columnData.child;
                    }
                }
            }
            element.relatedElement = relatedElement ? relatedElement : element;
            return element.relatedElement;
        };
        GridDirective.prototype.setLinkedChildren = function () {
            var dataIndex = 0;
            for (var i = 0; i < this.colDataGroups.length; i++) {
                var colDataGroup = this.colDataGroups[i];
                for (var j = 0; j < colDataGroup.length; j++) {
                    var columnData = colDataGroup[j];
                    var column = this.columnsWithDataClasses[dataIndex + j];
                    columnData.linkedChildren.push(column);
                }
                dataIndex += colDataGroup.length;
            }
        };
        GridDirective.prototype.setLinkedHeaderContainerClasses = function () {
            var dataIndex = 0;
            for (var i = 0; i < this.colDataGroups.length; i++) {
                var colDataGroup = this.colDataGroups[i];
                var column = this.columnsWithDataClasses[dataIndex];
                dataIndex += colDataGroup.length;
                var containerClass = 'column-container-' + i;
                this.addClassToLinkedHeader(column.parentElement, containerClass);
            }
        };
        GridDirective.prototype.addClassToLinkedHeader = function (element, cls) {
            if (!element.classList.contains(cls)) {
                element.classList.add(cls);
            }
        };
        GridDirective.prototype.generateSubGroup = function (currentGroup, subGroup) {
            var indexCount = 0;
            currentGroup.forEach(function (group, index) {
                var classLen = group.child.dataClasses.length;
                var subClassCount = 0;
                var numOfSubColumns = 0;
                while (subClassCount < classLen) {
                    subClassCount += subGroup[indexCount].child.dataClasses.length;
                    group.subGroups.push(subGroup[indexCount]);
                    indexCount++;
                    numOfSubColumns++;
                }
                currentGroup[index].subColumnLength = numOfSubColumns;
            });
        };
        GridDirective.prototype.orderSubGroups = function (columnGroup, columnPlacement, placementStart, order) {
            var _this = this;
            if (columnPlacement === void 0) { columnPlacement = 1; }
            if (placementStart === void 0) { placementStart = 0; }
            if (order === void 0) { order = 1; }
            var style;
            var containerID;
            var fragment;
            var selector;
            if (this.linkClass) {
                if (this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs) {
                    this.headStyle = this.gridService.linkedDirectiveObjs[this.linkClass].headStyle;
                    this.gridTemplateTypes = this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateTypes;
                    this.styleList = this.gridService.linkedDirectiveObjs[this.linkClass].styleList;
                    this.subGroupStyleObjs = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs;
                    this.subGroupStyles = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles;
                    this.subGroupFragments = this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments;
                    this.gridOrder = this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder;
                }
                else {
                    this.gridService.linkedDirectiveObjs[this.linkClass].headStyle = this.headStyle;
                    this.gridService.linkedDirectiveObjs[this.linkClass].gridTemplateTypes = this.gridTemplateTypes;
                    this.gridService.linkedDirectiveObjs[this.linkClass].styleList = this.styleList;
                    this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyleObjs = this.subGroupStyleObjs;
                    this.gridService.linkedDirectiveObjs[this.linkClass].subGroupStyles = this.subGroupStyles;
                    this.gridService.linkedDirectiveObjs[this.linkClass].subGroupFragments = this.subGroupFragments;
                    this.gridService.linkedDirectiveObjs[this.linkClass].gridOrder = this.gridOrder;
                }
            }
            placementStart = columnPlacement - 1;
            columnGroup.sort(function (columnData1, columnData2) {
                return columnData1.order - columnData2.order;
            });
            columnGroup.forEach(function (columnData) {
                columnData.order = columnPlacement;
                var tagName = columnData.child.tagName.toLowerCase();
                containerID = 'column-container-' + Array.from(columnData.parent.parentElement.children).indexOf(columnData.parent);
                var parentIndex = Array.from(columnData.parent.parentElement.children).indexOf(columnData.parent);
                _this.addClassToLinkedHeader(columnData.parent, containerID);
                selector = _this.id + ' .' + containerID + ' ' + tagName + ':nth-child(' + (columnData.nthChild).toString() + ')';
                fragment = document.createDocumentFragment();
                if (_this.subGroupStyleObjs[selector]) {
                    style = _this.subGroupStyleObjs[selector];
                }
                else {
                    style = document.createElement('style');
                    style.type = 'text/css';
                    _this.subGroupStyles.push(style);
                    _this.subGroupFragments.push(fragment);
                }
                _this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
                if (_this.parentGroups[parentIndex]) {
                    if ((_this.parentGroups[parentIndex].length) === (columnData.order)) {
                        _this.lastColumns[parentIndex] = columnData;
                    }
                }
                if (columnData.subGroups.length > 0) {
                    _this.orderSubGroups(columnData.subGroups, columnPlacement, placementStart, order++);
                }
                else {
                    selector = _this.id + ' ' + tagName + ':nth-child(' + (columnData.nthChild).toString() + ')';
                    fragment = document.createDocumentFragment();
                    if (_this.subGroupStyleObjs[selector]) {
                        style = _this.subGroupStyleObjs[selector];
                    }
                    else {
                        style = document.createElement('style');
                        style.type = 'text/css';
                        _this.subGroupStyles.push(style);
                        _this.subGroupFragments.push(fragment);
                    }
                    _this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
                    _this.gridOrder[columnPlacement - 1] = columnData.nthChild;
                    var hasSisterTag = tagName === 'th' || tagName === 'td';
                    var sisterTag = null;
                    if (hasSisterTag) {
                        sisterTag = tagName === 'th' ? 'td' : 'th';
                        selector = _this.id + ' ' + sisterTag + ':nth-child(' + (columnData.nthChild).toString() + ')';
                        fragment = document.createDocumentFragment();
                        if (_this.subGroupStyleObjs[selector]) {
                            style = _this.subGroupStyleObjs[selector];
                        }
                        else {
                            style = document.createElement('style');
                            style.type = 'text/css';
                            _this.subGroupStyles.push(style);
                            _this.subGroupFragments.push(fragment);
                        }
                        _this.setColumnStyle(style, fragment, selector, columnPlacement, columnPlacement + columnData.span, columnData.order);
                    }
                }
                columnPlacement += columnData.span;
            });
        };
        GridDirective.prototype.setColumnStyle = function (style, fragment, selector, gridStart, gridEnd, order) {
            style.innerHTML = selector + ' { grid-column-start: ' + (gridStart).toString() + '; grid-column-end: ' + (gridEnd).toString() + '; order: ' + (order).toString() + '; }';
            fragment.appendChild(style);
            this.addStyle(style);
            this.subGroupStyleObjs[selector] = style;
        };
        GridDirective.prototype.setGridOrder = function () {
            var _this = this;
            var gridTemplateColumns = this.constructGridTemplateColumns();
            if (this.colDataGroups[0].length === 0) {
                return;
            }
            var reqiresNewStyleObjects = this.linkClass === undefined || this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles === undefined;
            this.colDataGroups.forEach(function (columnGroup, index) {
                var style;
                var fragment;
                var selector = _this.id + ' .' + _this.reorderableClass;
                var styleAlreadyExisted = false;
                if (_this.subGroupStyleObjs[selector]) {
                    style = _this.subGroupStyleObjs[selector];
                    styleAlreadyExisted = true;
                }
                else if (reqiresNewStyleObjects) {
                    fragment = document.createDocumentFragment();
                    style = document.createElement('style');
                    style.type = 'text/css';
                    fragment.appendChild(style);
                }
                else {
                    fragment = _this.gridService.linkedDirectiveObjs[_this.linkClass].gridOrderFragments[index];
                    style = _this.gridService.linkedDirectiveObjs[_this.linkClass].gridOrderStyles[index];
                    fragment.appendChild(style);
                }
                style.innerHTML = selector + ' { display: grid; grid-template-columns: ' + gridTemplateColumns + '; }';
                if (!_this.subGroupStyleObjs[selector] && reqiresNewStyleObjects) {
                    _this.gridOrderStyles.push(style);
                    _this.gridOrderFragments.push(fragment);
                }
                _this.subGroupStyleObjs[selector] = style;
                _this.addStyle(style);
                if (!styleAlreadyExisted) {
                    _this.moveStyleContentToProminent();
                    _this.gridTemplateTypes.push({ style: style });
                }
                if (index === 0) {
                    _this.orderSubGroups(columnGroup);
                }
            });
            if (this.linkClass && this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles === undefined) {
                this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderFragments = this.gridOrderFragments;
                this.gridService.linkedDirectiveObjs[this.linkClass].gridOrderStyles = this.gridOrderStyles;
            }
        };
        GridDirective.prototype.getOffset = function (el) {
            var rect = el.getBoundingClientRect();
            return {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY
            };
        };
        GridDirective.prototype.getParentTablejsGridDirective = function (el) {
            while (el !== null && el.getAttribute('tablejsGrid') === null) {
                el = el.parentElement;
            }
            return el;
        };
        GridDirective.prototype.elementRefUnderPoint = function (event) {
            var _this = this;
            var elements = document.elementsFromPoint(event.clientX, event.clientY);
            return elements.filter(function (item) { return item === _this.elementRef.nativeElement; }).length > 0;
        };
        GridDirective.prototype.getResizeGripUnderPoint = function (event) {
            var resizableElements = document.elementsFromPoint(event.clientX, event.clientY);
            var elements = resizableElements.filter(function (item) {
                return item.getAttribute('resizableGrip') !== null;
            });
            return elements;
        };
        GridDirective.prototype.getReorderColsUnderPoint = function (event) {
            var reorderColElements = document.elementsFromPoint(event.clientX, event.clientY);
            var elements = reorderColElements.filter(function (item) {
                return item.getAttribute('reorderCol') !== null;
            });
            return elements;
        };
        GridDirective.prototype.getReorderHandlesUnderPoint = function (event) {
            var reorderGripElements = document.elementsFromPoint(event.clientX, event.clientY);
            var elements = reorderGripElements.filter(function (item) {
                return item.getAttribute('reorderGrip') !== null;
            });
            return elements;
        };
        GridDirective.prototype.getResizableElements = function (event) {
            var resizableElements = document.elementsFromPoint(event.clientX, event.clientY);
            var elements = resizableElements.filter(function (item) {
                return item.getAttribute('tablejsDataColClasses') !== null;
            });
            var noElementsFound = elements.length === 0;
            var iterationLen = noElementsFound ? 1 : elements.length;
            for (var i = 0; i < iterationLen; i++) {
                var item = resizableElements[0];
                var parentElement = item.parentElement;
                while (parentElement !== null) {
                    var foundGripParent = !noElementsFound && parentElement === elements[i];
                    var foundParentWithColClasses = noElementsFound && parentElement.getAttribute('tablejsDataColClasses') !== null;
                    if (foundGripParent || foundParentWithColClasses) {
                        elements = [parentElement];
                        parentElement = null;
                    }
                    else {
                        parentElement = parentElement.parentElement;
                    }
                }
            }
            return elements;
        };
        GridDirective.prototype.removeHighlights = function (elToExclude, moveDirection) {
            var _this = this;
            if (elToExclude === void 0) { elToExclude = null; }
            if (moveDirection === void 0) { moveDirection = -2; }
            this.elementsWithHighlight.forEach(function (item) {
                if (item.el !== elToExclude || item.moveDirection !== moveDirection) {
                    _this.removeElementHighlight(item.el);
                }
            });
        };
        GridDirective.prototype.removeElementHighlight = function (el) {
            el.classList.remove('highlight-left');
            el.classList.remove('highlight-right');
        };
        GridDirective.prototype.reorderColumns = function (event) {
            var _this = this;
            var draggableElement = this.lastDraggedOverElement;
            var elRect = draggableElement.getBoundingClientRect();
            var elX = elRect.left;
            var elW = elRect.width;
            this.removeElementHighlight(draggableElement);
            if (this.draggingColumn === draggableElement) {
                return;
            }
            var moveDirection = 0;
            if ((event.clientX - elX) >= elW / 2) {
                moveDirection = 1;
            }
            else {
                moveDirection = 0;
            }
            var colRangeDraggedParentInd = -1;
            var colRangeDraggedChildInd = -1;
            var colRangeDroppedParentInd = -1;
            var colRangeDroppedChildInd = -1;
            var draggedInd = -1;
            var droppedInd = -1;
            var draggedGroup = null;
            var pGroup = this.parentGroups.forEach(function (group, groupInd) { return group.forEach(function (item, index) {
                if (item === _this.draggingColumn) {
                    colRangeDraggedParentInd = groupInd;
                    colRangeDraggedChildInd = index;
                    draggedInd = index;
                    draggedGroup = group;
                }
                if (item === draggableElement) {
                    colRangeDroppedParentInd = groupInd;
                    colRangeDroppedChildInd = index;
                    droppedInd = index;
                }
            }); });
            var parentRanges = null;
            var tempRanges = this.colRangeGroups.concat();
            var parentRangeIndex = -1;
            tempRanges.sort(function (a, b) { return b.length - a.length; });
            tempRanges.forEach(function (item, index) {
                if (!parentRanges && item.length < draggedGroup.length) {
                    parentRanges = item;
                    parentRangeIndex = _this.colRangeGroups.indexOf(item);
                }
            });
            var fromOrder = (colRangeDraggedChildInd + 1);
            var toOrder = (colRangeDroppedChildInd + 1);
            // if has to stay within ranges, get ranges and swap
            if (parentRangeIndex === this.colRangeGroups.length - 1) {
                this.colRangeGroups[parentRangeIndex].forEach(function (range) {
                    var lowRange = range[0];
                    var highRange = range[1];
                    if (fromOrder >= lowRange && fromOrder < highRange && toOrder >= lowRange && toOrder < highRange) {
                        var data1 = _this.colDataGroups[colRangeDraggedParentInd].filter(function (item) { return item.nthChild === fromOrder; })[0];
                        var data2 = _this.colDataGroups[colRangeDraggedParentInd].filter(function (item) { return item.nthChild === toOrder; })[0];
                        var rangeGroup = _this.colDataGroups[colRangeDraggedParentInd].slice(range[0] - 1, range[1] - 1);
                        rangeGroup.sort(function (item1, item2) {
                            return item1.order - item2.order;
                        });
                        rangeGroup.splice(rangeGroup.indexOf(data1), 1);
                        rangeGroup.splice(rangeGroup.indexOf(data2) + moveDirection, 0, data1);
                        rangeGroup.forEach(function (item, index) {
                            item.order = index + 1;
                        });
                    }
                });
            }
            else {
                var data1 = this.colDataGroups[colRangeDraggedParentInd].filter(function (item) { return item.nthChild === fromOrder; })[0];
                var data2 = this.colDataGroups[colRangeDraggedParentInd].filter(function (item) { return item.nthChild === toOrder; })[0];
                var rangeGroup = this.colDataGroups[colRangeDraggedParentInd].concat();
                rangeGroup.sort(function (item1, item2) {
                    return item1.order - item2.order;
                });
                rangeGroup.splice(rangeGroup.indexOf(data1), 1);
                rangeGroup.splice(rangeGroup.indexOf(data2) + moveDirection, 0, data1);
                rangeGroup.forEach(function (item, index) {
                    item.order = index + 1;
                });
            }
            this.setGridOrder();
            // need to set a class to resize - default to first so column widths are updated
            var firstItemWidth = this.getFirstVisibleItemWidth();
            this.setMinimumWidths();
            // update widths by first item
            this.totalComputedWidth = firstItemWidth;
            this.updateWidths(firstItemWidth);
        };
        GridDirective.prototype.getAverageColumnWidth = function () {
            var totalTableWidth = this.viewport.clientWidth;
            return totalTableWidth / this.classWidths.length;
        };
        GridDirective.prototype.getFirstVisibleItemWidth = function () {
            var _this = this;
            var firstVisibleItemIndex = 0;
            for (var i = 0; i < this.gridOrder.length; i++) {
                var classIndex = this.gridOrder[i] - 1;
                if (!this.columnIsHiddenWithClass(this.gridTemplateClasses[classIndex])) {
                    firstVisibleItemIndex = i;
                    break;
                }
            }
            this.currentClassesToResize = [this.stylesByClass[this.gridOrder[firstVisibleItemIndex] - 1].resizeClass];
            return this.currentClassesToResize.map(function (resizeClass) {
                return _this.getClassWidthInPixels(resizeClass);
            })[0];
        };
        GridDirective.prototype.setLinkedColumnIndicesFromMaster = function () {
            if (this.linkClass) {
                this.hiddenColumnIndices = this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective.hiddenColumnIndices;
            }
        };
        GridDirective.prototype.updateMasterColumnIndices = function () {
            if (this.linkClass) {
                this.gridService.linkedDirectiveObjs[this.linkClass].gridDirective.hiddenColumnIndices = this.hiddenColumnIndices;
            }
        };
        GridDirective.prototype.updateHiddenColumnIndices = function () {
            this.setLinkedColumnIndicesFromMaster();
            this.hiddenColumnIndices = this.getHiddenColumnIndices();
            this.updateMasterColumnIndices();
        };
        GridDirective.prototype.constructGridTemplateColumns = function () {
            var _this = this;
            this.updateHiddenColumnIndices();
            this.resizeMakeUpPercent = 0;
            this.resizeMakeUpPerColPercent = 0;
            var remainingCols = this.gridOrder.length - this.hiddenColumnIndices.length;
            this.hiddenColumnIndices.forEach(function (index) {
                var classWidthIndex = _this.gridOrder[index - 1];
                var amt = _this.classWidths[classWidthIndex - 1].toString();
                if (amt.includes('%')) {
                    _this.resizeMakeUpPercent += Number(amt.replace('%', ''));
                }
            });
            if (this.resizeMakeUpPercent !== 0) {
                this.resizeMakeUpPerColPercent = this.resizeMakeUpPercent / remainingCols;
            }
            var str = '';
            this.gridOrder.forEach(function (order, index) {
                var wdth = Number(_this.classWidths[order - 1].toString().replace('%', ''));
                wdth = wdth < 0 ? 0 : wdth;
                if (_this.classWidths[order - 1].toString().includes('%')) {
                    if (_this.hiddenColumnIndices.indexOf(index + 1) !== -1) {
                        str += ' 0%';
                        _this.classWidths[order - 1] = '0%';
                    }
                    else {
                        str += ' ' + (wdth + _this.resizeMakeUpPerColPercent).toString() + '%';
                        _this.classWidths[order - 1] = (wdth + _this.resizeMakeUpPerColPercent).toString() + '%';
                    }
                }
                else {
                    if (_this.hiddenColumnIndices.indexOf(index + 1) !== -1) {
                        str += ' 0px';
                    }
                    else {
                        str += ' ' + wdth.toString() + 'px';
                    }
                }
            });
            return str;
        };
        GridDirective.prototype.getHiddenColumnIndices = function () {
            var _this = this;
            var hiddenColumnIndices = [];
            this.colDataGroups.forEach(function (columnGroup, index) {
                if (index === 0) {
                    _this.orderSubCols(hiddenColumnIndices, columnGroup);
                }
            });
            return hiddenColumnIndices;
        };
        GridDirective.prototype.orderSubCols = function (arr, columnGroup, columnPlacement, placementStart, parentIsHidden) {
            var _this = this;
            if (columnPlacement === void 0) { columnPlacement = 1; }
            if (placementStart === void 0) { placementStart = 0; }
            if (parentIsHidden === void 0) { parentIsHidden = false; }
            placementStart = columnPlacement - 1;
            columnGroup.sort(function (columnData1, columnData2) {
                return columnData1.order - columnData2.order;
            });
            columnGroup.forEach(function (columnData) {
                var startIndex = columnPlacement;
                var columnElement = _this.getRelatedHeader(columnData.child);
                var hasSubGroups = columnData.subGroups.length > 0;
                if ((columnElement.hideColumn || parentIsHidden) && !hasSubGroups && arr.indexOf(startIndex) === -1) {
                    arr.push(startIndex);
                }
                if (hasSubGroups) {
                    _this.orderSubCols(arr, columnData.subGroups, columnPlacement, placementStart, columnElement.hideColumn);
                }
                columnPlacement += columnData.span;
            });
        };
        GridDirective.prototype.setReorderHighlightHeight = function (draggableElement) {
            var draggableTop = this.getOffset(draggableElement).top;
            var containerTop = this.getOffset(this.elementRef.nativeElement).top;
            var containerHeightStr = window.getComputedStyle(this.elementRef.nativeElement).getPropertyValue('height');
            var containerHeight = Number(containerHeightStr.substr(0, containerHeightStr.length - 2));
            var highlightHeight = containerHeight - (draggableTop - containerTop) - 1;
            this.reorderHighlightStyle.innerHTML = this.id + ' .highlight-left div:after, ' + this.id + ' .highlight-right div:after { height: ' + highlightHeight + 'px !important }';
            this.setStyleContent();
        };
        GridDirective.prototype.retrieveOrCreateElementID = function (el, hasLinkClass) {
            if (hasLinkClass === void 0) { hasLinkClass = false; }
            var id = document.body.getAttribute('id');
            if (id === undefined || id === null) {
                id = 'tablejs-body-id';
            }
            document.body.setAttribute('id', id);
            var someID = hasLinkClass ? '' : this.generateGridID(el);
            return '#' + id + someID;
        };
        GridDirective.prototype.generateGridID = function (el) {
            var gridID = el.getAttribute('id');
            if (gridID === null) {
                var i = 0;
                while (document.getElementById('grid-id-' + i.toString()) !== null) {
                    i++;
                }
                gridID = 'grid-id-' + i.toString();
                el.classList.add(gridID);
                el.setAttribute('id', gridID);
            }
            return ' .' + gridID; // ' #' + gridID;
        };
        GridDirective.prototype.generateContainerID = function () {
            TablejsGridProxy.GRID_COUNT++;
            var hasLinkClass = this.linkClass !== undefined;
            if (!hasLinkClass) {
                this.id = this.retrieveOrCreateElementID(this.elementRef.nativeElement);
            }
            else {
                this.id = '.' + this.linkClass;
            }
            var parentGridID = this.getParentTablejsGridDirective(this.elementRef.nativeElement.parentElement);
            if (parentGridID !== null) {
                this.id = this.retrieveOrCreateElementID(parentGridID, hasLinkClass) + ' ' + this.id;
            }
        };
        GridDirective.prototype.generateViewportID = function () {
            var viewports = this.infiniteScrollViewports;
            if (viewports.length > 0) {
                this.viewport = viewports[0];
                this.viewportID = this.viewport.getAttribute('id');
                var i = 0;
                while (document.getElementById('scroll-viewport-id-' + i.toString()) !== null) {
                    i++;
                }
                this.viewportID = 'scroll-viewport-id-' + i.toString();
                this.viewport.setAttribute('id', this.viewportID);
            }
        };
        GridDirective.prototype.attachContentResizeSensor = function () {
            var _this = this;
            if (this.resizeColumnWidthByPercent) {
                if (this.viewport === undefined || this.viewport === null) {
                    throw Error('A viewport has not be declared.  Try adding the tablejsViewport directive to your tbody tag.');
                }
                this.contentResizeSensor = new cssElementQueries.ResizeSensor(this.viewport.firstElementChild, function () {
                    _this.setScrollbarAdjustmentStyle();
                });
                this.scrollbarAdjustmentFragment = document.createDocumentFragment();
                this.scrollbarAdjustmentStyle = document.createElement('style');
                this.setScrollbarAdjustmentStyle();
                this.scrollbarAdjustmentFragment.appendChild(this.scrollbarAdjustmentStyle);
                this.addStyle(this.scrollbarAdjustmentStyle, false);
            }
        };
        GridDirective.prototype.setScrollbarAdjustmentStyle = function () {
            this.scrollbarWidth = this.viewport.offsetWidth - this.viewport.clientWidth;
            this.scrollbarAdjustmentStyle.innerHTML = '#' + this.viewportID + ' .reorderable-table-row { margin-right: -' + this.scrollbarWidth + 'px; }';
            this.setStyleContent();
        };
        GridDirective.prototype.clearSelection = function () {
            if (window.getSelection) {
                var selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                }
            }
            else if (this.document['selection']) {
                this.document['selection'].empty();
            }
        };
        GridDirective.prototype.addResizableGrip = function (el, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            if (fromMutation && !this.isCustomElement) {
                this.mutationResizableGrips.push(el);
            }
            else {
                this.resizableGrips.push(el);
            }
        };
        GridDirective.prototype.addResizableColumn = function (el, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            if (fromMutation && !this.isCustomElement) {
                this.mutationResizableColumns.push(el);
            }
            else {
                this.resizableColumns.push(el);
            }
        };
        GridDirective.prototype.addReorderGrip = function (el, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            if (fromMutation && !this.isCustomElement) {
                this.mutationReorderGrips.push(el);
            }
            else {
                this.reorderGrips.push(el);
            }
        };
        GridDirective.prototype.addReorderableColumn = function (el, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            if (fromMutation && !this.isCustomElement) {
                this.mutationReorderableColumns.push(el);
            }
            else {
                this.reorderableColumns.push(el);
            }
        };
        GridDirective.prototype.addColumnsWithDataClasses = function (el, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            if (fromMutation && !this.isCustomElement) {
                this.mutationColumnsWithDataClasses.push(el);
            }
            else {
                this.columnsWithDataClasses.push(el);
            }
        };
        GridDirective.prototype.addRow = function (el, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            if (fromMutation && !this.isCustomElement) {
                this.mutationRows.push(el);
            }
            else {
                this.rows.push(el);
            }
        };
        GridDirective.prototype.addInfiniteScrollViewport = function (el, fromMutation) {
            if (fromMutation === void 0) { fromMutation = false; }
            if (fromMutation && !this.isCustomElement) {
                this.mutationInfiniteScrollViewports.push(el);
            }
            else {
                this.infiniteScrollViewports.push(el);
            }
        };
        GridDirective.prototype.removeStylesFromHead = function () {
            if (this.headTag.contains(this.headStyle)) {
                this.headTag.removeChild(this.headStyle);
            }
            if (this.headTag.contains(this.widthStyle)) {
                this.headTag.removeChild(this.widthStyle);
                this.widthStyleFragment = null;
            }
            if (this.headTag.contains(this.reorderHighlightStyle)) {
                this.headTag.removeChild(this.reorderHighlightStyle);
                this.reorderHighlightStyleFragment = null;
            }
            for (var i = 0, len = this.subGroupFragments.length; i < len; i++) {
                if (this.headTag.contains(this.subGroupStyles[i])) {
                    this.headTag.removeChild(this.subGroupStyles[i]);
                    this.subGroupFragments[i] = null;
                }
            }
            for (var i = 0, len = this.gridOrderFragments.length; i < len; i++) {
                if (this.headTag.contains(this.gridOrderStyles[i])) {
                    this.headTag.removeChild(this.gridOrderStyles[i]);
                    this.gridOrderFragments[i] = null;
                }
            }
        };
        GridDirective.prototype.ngOnDestroy = function () {
            this.document['hasPointerDownListener'] = false;
            this.observer.disconnect();
            if (this.linkClass === undefined) {
                this.removeStylesFromHead();
            }
            if (this.initialWidthSettingsSubscription$) {
                this.initialWidthSettingsSubscription$.unsubscribe();
            }
            if (this.hiddenColumnChangesSubscription$) {
                this.hiddenColumnChangesSubscription$.unsubscribe();
            }
        };
        return GridDirective;
    }(TablejsGridProxy));
    GridDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsGrid],[tablejsgrid]',
                    host: { class: 'tablejs-table-container tablejs-table-width' }
                },] }
    ];
    GridDirective.ctorParameters = function () { return [
        { type: i0.ViewContainerRef },
        { type: i0.ElementRef },
        { type: i0.ComponentFactoryResolver },
        { type: GridService },
        { type: DirectiveRegistrationService },
        { type: undefined, decorators: [{ type: i0.Inject, args: [common.DOCUMENT,] }] },
        { type: overlay.Overlay },
        { type: ScrollDispatcherService },
        { type: OperatingSystemService },
        { type: i0.RendererFactory2 }
    ]; };
    GridDirective.propDecorators = {
        linkClass: [{ type: i0.Input }],
        resizeColumnWidthByPercent: [{ type: i0.Input }],
        columnResizeStart: [{ type: i0.Output }],
        columnResize: [{ type: i0.Output }],
        columnResizeEnd: [{ type: i0.Output }],
        columnReorder: [{ type: i0.Output }],
        columnReorderStart: [{ type: i0.Output }],
        dragOver: [{ type: i0.Output }],
        columnReorderEnd: [{ type: i0.Output }],
        preGridInitialize: [{ type: i0.Output }],
        gridInitialize: [{ type: i0.Output }]
    };

    var GridRowDirective = /** @class */ (function () {
        function GridRowDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
        }
        GridRowDirective.prototype.ngAfterViewInit = function () {
            this.registerRowsOnGridDirective();
        };
        GridRowDirective.prototype.registerRowsOnGridDirective = function () {
            var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
            if (el !== null) {
                el['gridDirective'].addRow(this.elementRef.nativeElement);
            }
        };
        return GridRowDirective;
    }());
    GridRowDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsGridRow], [tablejsgridrow], [tablejs-grid-row]',
                    host: { class: 'reorderable-table-row' }
                },] }
    ];
    GridRowDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };

    var ResizableGripDirective = /** @class */ (function () {
        function ResizableGripDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
        }
        ResizableGripDirective.prototype.ngAfterViewInit = function () {
            this.registerGripOnGridDirective();
        };
        ResizableGripDirective.prototype.registerGripOnGridDirective = function () {
            var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
            if (el !== null) {
                el['gridDirective'].addResizableGrip(this.elementRef.nativeElement);
            }
        };
        return ResizableGripDirective;
    }());
    ResizableGripDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsResizableGrip], [resizableGrip], [resizablegrip]'
                },] }
    ];
    ResizableGripDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };

    var InfiniteScrollDirective = /** @class */ (function () {
        function InfiniteScrollDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
        }
        InfiniteScrollDirective.prototype.ngAfterViewInit = function () {
            this.registerColumnOnGridDirective();
        };
        InfiniteScrollDirective.prototype.registerColumnOnGridDirective = function () {
            var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
            if (el !== null) {
                el['gridDirective'].addInfiniteScrollViewport(this.elementRef.nativeElement);
            }
        };
        return InfiniteScrollDirective;
    }());
    InfiniteScrollDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: "[tablejsInfiniteScroll], [tablejsinfinitescroll], [tablejs-infinite-scroll],\n  [tablejsViewport], [tablejsviewport], [tablejs-viewport]",
                    host: { class: 'tablejs-infinite-scroll-viewport tablejs-table-width' }
                },] }
    ];
    InfiniteScrollDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };

    var GridComponent = /** @class */ (function () {
        function GridComponent(elementRef) {
            this.elementRef = elementRef;
            this.linkClass = undefined;
            this.resizeColumnWidthByPercent = false;
            this.columnResizeStart = new i0.EventEmitter();
            this.columnResize = new i0.EventEmitter();
            this.columnResizeEnd = new i0.EventEmitter();
            this.columnReorder = new i0.EventEmitter();
            this.columnReorderStart = new i0.EventEmitter();
            this.columnReorderEnd = new i0.EventEmitter();
            this.gridInitialize = new i0.EventEmitter();
        }
        Object.defineProperty(GridComponent.prototype, "gridDirective", {
            get: function () {
                return this.elementRef.nativeElement.gridDirective;
            },
            enumerable: false,
            configurable: true
        });
        GridComponent.prototype.ngOnInit = function () {
            if (this.linkClass !== undefined) {
                this.elementRef.nativeElement.classList.add(this.linkClass);
            }
        };
        GridComponent.prototype.columnResizeStarted = function (e) {
            e.type = ColumnResizeEvent.ON_RESIZE_START;
            this.columnResizeStart.emit(e);
        };
        GridComponent.prototype.columnResized = function (e) {
            e.type = ColumnResizeEvent.ON_RESIZE;
            this.columnResize.emit(e);
        };
        GridComponent.prototype.columnResizeEnded = function (e) {
            e.type = ColumnResizeEvent.ON_RESIZE_END;
            this.columnResizeEnd.emit(e);
        };
        GridComponent.prototype.columnReorderStarted = function (e) {
            e.type = ColumnReorderEvent.ON_REORDER_START;
            this.columnReorderStart.emit(e);
        };
        GridComponent.prototype.columnReordered = function (e) {
            e.type = ColumnReorderEvent.ON_REORDER;
            this.columnReorder.emit(e);
        };
        GridComponent.prototype.columnReorderEnded = function (e) {
            e.type = ColumnReorderEvent.ON_REORDER_END;
            this.columnReorderEnd.emit(e);
        };
        GridComponent.prototype.gridInitialized = function (e) {
            e.type = GridEvent.ON_INITIALIZED;
            this.gridInitialize.emit(e);
        };
        return GridComponent;
    }());
    GridComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'tablejs-grid',
                    template: "<div tablejsGrid class=\"grid-component\" [linkClass]=\"linkClass\" [resizeColumnWidthByPercent]=\"resizeColumnWidthByPercent\"\n(columnResizeStart)=\"columnResizeStarted($event)\"\n(columnResize)=\"columnResized($event)\"\n(columnResizeEnd)=\"columnResizeEnded($event)\"\n(columnReorderStart)=\"columnReorderStarted($event)\"\n(columnReorder)=\"columnReordered($event)\"\n(columnReorderEnd)=\"columnReorderEnded($event)\"\n(gridInitialize)=\"gridInitialized($event)\"\n>\n\n\t<ng-content></ng-content>\n</div>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    styles: [".tablejs-table-container{display:inline-block;padding:0!important;vertical-align:top}.tablejs-infinite-scroll-viewport{position:relative;height:301px;overflow:hidden;overflow-y:auto}.example-viewport table{overflow:visible}.tablejs-table-width{width:auto}.tablejs-table-container tr td,.tablejs-table-container tr th{padding:0}.grid-component tr td div,.grid-component tr th div{padding:.75rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tablejs-resizeable{cursor:ew-resize}.tablejs-editable-cell{display:inline-block;width:100%;padding:5px;margin:-5px;border:1px solid rgba(0,0,0,.1);box-shadow:inset 0 0 2px 1px #0000000d}.tablejs-editable-cell div{position:absolute;display:block;left:-3px;top:-3px;width:100%}.tablejs-editable-cell input{position:relative;top:0px;left:0px;display:block;width:100%}.tablejs-editable-cell input.error{outline-color:#900}\n"]
                },] }
    ];
    GridComponent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    GridComponent.propDecorators = {
        linkClass: [{ type: i0.Input }],
        resizeColumnWidthByPercent: [{ type: i0.Input }],
        columnResizeStart: [{ type: i0.Output }],
        columnResize: [{ type: i0.Output }],
        columnResizeEnd: [{ type: i0.Output }],
        columnReorder: [{ type: i0.Output }],
        columnReorderStart: [{ type: i0.Output }],
        columnReorderEnd: [{ type: i0.Output }],
        gridInitialize: [{ type: i0.Output }]
    };

    var EditableCellDirective = /** @class */ (function () {
        function EditableCellDirective(elementRef) {
            this.elementRef = elementRef;
            this.validator = null;
            this.validatorParams = [];
            this.regExp = null;
            this.regExpFlags = 'gi';
            this.list = [];
            this.cellInput = new i0.EventEmitter();
            this.cellFocusOut = new i0.EventEmitter();
            this.cellValidation = new i0.EventEmitter();
            this.option = null;
            this.lastText = null;
            this.originalText = null;
            this.lastValidInput = null;
            this.containerDiv = document.createElement('div');
            this.input = document.createElement('input'); // Create an <input> node
            this.input.type = 'text';
            this.dataList = document.createElement('datalist');
        }
        EditableCellDirective.prototype.onKeyDownHandler = function (event) {
            if (document.activeElement === this.input) {
                this.input.blur();
                this.input.removeEventListener('focusout', this.onFocusOut);
            }
        };
        EditableCellDirective.prototype.onClick = function (event) {
            var _this = this;
            var hasInput = false;
            if (this.elementRef.nativeElement.children) {
                for (var i = 0; i < this.elementRef.nativeElement.children.length; i++) {
                    if (this.elementRef.nativeElement.children[i] === this.containerDiv) {
                        hasInput = true;
                    }
                }
            }
            if (!hasInput) {
                this.input.value = this.elementRef.nativeElement.innerText;
                this.lastText = this.input.value;
                this.originalText = this.elementRef.nativeElement.innerText;
                this.elementRef.nativeElement.appendChild(this.containerDiv);
                this.containerDiv.appendChild(this.input);
                if (this.list.length > 0) {
                    this.createDataList();
                }
                this.validateInput();
                this.input.focus();
                this.onFocusOut = function () {
                    if (_this.elementRef.nativeElement.contains(_this.containerDiv)) {
                        _this.elementRef.nativeElement.removeChild(_this.containerDiv);
                    }
                    _this.cellInput.emit(_this.getCellObject());
                    _this.cellFocusOut.emit(_this.getCellObject());
                    _this.input.removeEventListener('focusout', _this.onFocusOut);
                };
                this.input.addEventListener('focusout', this.onFocusOut);
            }
            this.cellInput.emit(this.getCellObject());
        };
        EditableCellDirective.prototype.createDataList = function () {
            var _this = this;
            var count = 0;
            var id = 'data-list-' + count.toString();
            while (document.getElementById(id) !== null && document.getElementById(id) !== undefined) {
                count++;
                id = 'data-list-' + count.toString();
            }
            this.dataList.setAttribute('id', id);
            this.elementRef.nativeElement.appendChild(this.containerDiv);
            this.containerDiv.appendChild(this.dataList);
            this.list.forEach(function (value) {
                var filteredDataList = Array.from(_this.dataList.options).filter(function (option) { return option.value === value; });
                if (filteredDataList.length === 0) {
                    _this.option = document.createElement('option');
                    _this.dataList.appendChild(_this.option);
                    _this.option.value = value;
                }
            });
            this.input.setAttribute('list', id);
        };
        EditableCellDirective.prototype.ngOnInit = function () {
            this.input.value = this.elementRef.nativeElement.innerText;
        };
        EditableCellDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.input.value = this.elementRef.nativeElement.innerText;
            this.lastText = this.input.value;
            this.input.addEventListener('input', function () {
                if (_this.regExp) {
                    var regEx = new RegExp(_this.regExp, _this.regExpFlags);
                    if (regEx.test(_this.input.value)) {
                        _this.validateInput();
                        _this.lastText = _this.input.value;
                        _this.cellInput.emit(_this.getCellObject());
                    }
                    else {
                        _this.input.value = _this.lastText;
                    }
                }
                else {
                    _this.validateInput();
                    _this.cellInput.emit(_this.getCellObject());
                }
            });
        };
        EditableCellDirective.prototype.getCellObject = function () {
            return {
                currentValue: this.input.value,
                lastValidInput: this.lastValidInput,
                originalValue: this.originalText,
                inputHasFocus: document.activeElement === this.input
            };
        };
        EditableCellDirective.prototype.validateInput = function () {
            var validationOk = this.validator ? this.validator.apply(null, [this.input.value].concat(this.validatorParams)) : true;
            if (validationOk) {
                this.input.classList.remove('error');
                this.lastValidInput = this.input.value;
            }
            else {
                this.input.classList.add('error');
            }
            this.cellValidation.emit(validationOk);
        };
        return EditableCellDirective;
    }());
    EditableCellDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsEditableCell], [tablejseditablecell], [tablejs-editable-cell]',
                    host: { class: 'tablejs-editable-cell' }
                },] }
    ];
    EditableCellDirective.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    EditableCellDirective.propDecorators = {
        initialData: [{ type: i0.Input, args: ['tablejsEditableCell',] }],
        validator: [{ type: i0.Input }],
        validatorParams: [{ type: i0.Input }],
        regExp: [{ type: i0.Input }],
        regExpFlags: [{ type: i0.Input }],
        list: [{ type: i0.Input }],
        cellInput: [{ type: i0.Output }],
        cellFocusOut: [{ type: i0.Output }],
        cellValidation: [{ type: i0.Output }],
        onKeyDownHandler: [{ type: i0.HostListener, args: ['document:keydown.enter', ['$event'],] }],
        onClick: [{ type: i0.HostListener, args: ['click', ['$event'],] }]
    };

    var ReorderGripDirective = /** @class */ (function () {
        function ReorderGripDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
        }
        ReorderGripDirective.prototype.ngAfterViewInit = function () {
            this.registerGripOnGridDirective();
        };
        ReorderGripDirective.prototype.registerGripOnGridDirective = function () {
            var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
            if (el !== null) {
                el['gridDirective'].addReorderGrip(this.elementRef.nativeElement);
            }
        };
        return ReorderGripDirective;
    }());
    ReorderGripDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[reorderGrip]'
                },] }
    ];
    ReorderGripDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };

    var ReorderColDirective = /** @class */ (function () {
        function ReorderColDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
            this.reorderGhostContext = null;
        }
        ReorderColDirective.prototype.ngAfterViewInit = function () {
            this.registerColumnOnGridDirective();
        };
        ReorderColDirective.prototype.registerColumnOnGridDirective = function () {
            var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
            if (el !== null) {
                this.elementRef.nativeElement.reorderGhost = this.reorderGhost;
                this.elementRef.nativeElement.reorderGhostContext = this.reorderGhostContext;
                el['gridDirective'].addReorderableColumn(this.elementRef.nativeElement);
            }
        };
        return ReorderColDirective;
    }());
    ReorderColDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[reorderCol], [reordercol]'
                },] }
    ];
    ReorderColDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };
    ReorderColDirective.propDecorators = {
        reorderGhost: [{ type: i0.Input }],
        reorderGhostContext: [{ type: i0.Input }]
    };

    var DataColClassesDirective = /** @class */ (function () {
        function DataColClassesDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
            this.tablejsDataColClasses = '';
        }
        DataColClassesDirective.prototype.ngAfterViewInit = function () {
            this.cacheClassesOnElement();
            this.registerColumnsWithDataClassesOnGridDirective();
        };
        DataColClassesDirective.prototype.cacheClassesOnElement = function () {
            if (this.tablejsDataColClasses) {
                this.elementRef.nativeElement.setAttribute('tablejsDataColClasses', this.tablejsDataColClasses);
            }
            this.elementRef.nativeElement.dataClasses = this.elementRef.nativeElement.getAttribute('tablejsDataColClasses').replace(new RegExp(' ', 'g'), '').split(',');
        };
        DataColClassesDirective.prototype.registerColumnsWithDataClassesOnGridDirective = function () {
            var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
            if (el !== null) {
                el['gridDirective'].addColumnsWithDataClasses(this.elementRef.nativeElement);
            }
        };
        return DataColClassesDirective;
    }());
    DataColClassesDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsDataColClasses], [tablejsdatacolclasses], [tablejs-data-col-classes]'
                },] }
    ];
    DataColClassesDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };
    DataColClassesDirective.propDecorators = {
        tablejsDataColClasses: [{ type: i0.Input }]
    };

    var DataColClassDirective = /** @class */ (function () {
        function DataColClassDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
            this.tablejsDataColClass = '';
        }
        DataColClassDirective.prototype.ngAfterViewInit = function () {
            var _this = this;
            if (this.tablejsDataColClass !== '') {
                this.elementRef.nativeElement.classList.add(this.tablejsDataColClass);
                this.elementRef.nativeElement.setAttribute('tablejsDataColClass', this.tablejsDataColClass);
                if (this.initialWidth) {
                    this.elementRef.nativeElement.setAttribute('initialWidth', this.initialWidth);
                }
            }
            else {
                throw Error('A class name must be supplied to the tablejsDataColClass directive.');
            }
            setTimeout(function () {
                _this.registerInitialColumnWidthOnGridDirective();
            }, 1);
        };
        DataColClassDirective.prototype.registerInitialColumnWidthOnGridDirective = function () {
            if (this.initialWidth === undefined) {
                this.gridService.triggerHasInitialWidths(false);
                console.log('[Performance Alert] Add an initialWidth value on the tablejsDataColClass directive for a significant performance boost.');
                return;
            }
            this.gridService.triggerHasInitialWidths(true);
            var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
            if (el !== null) {
                el['gridDirective'].initialWidths[this.tablejsDataColClass] = this.initialWidth;
            }
        };
        return DataColClassDirective;
    }());
    DataColClassDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsDataColClass], [tablejsdatacolclass], [tablejs-data-col-class]'
                },] }
    ];
    DataColClassDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };
    DataColClassDirective.propDecorators = {
        tablejsDataColClass: [{ type: i0.Input }],
        initialWidth: [{ type: i0.Input }]
    };

    var HideColumnIfDirective = /** @class */ (function () {
        function HideColumnIfDirective(elementRef, gridService) {
            this.elementRef = elementRef;
            this.gridService = gridService;
            this._hideColumn = false;
            this.HIDDEN_COLUMN_CLASS = 'column-is-hidden';
            this.showOffspringLimited = false;
            this.changeTriggeredBy = null;
            this.canHide = true;
            this.elementRef.nativeElement.hideColumnIf = this;
        }
        Object.defineProperty(HideColumnIfDirective.prototype, "tablejsHideColumnIf", {
            get: function () {
                return this._hideColumn;
            },
            set: function (hide) {
                var _this = this;
                var wasLimited = this.showOffspringLimited;
                var wasTriggeredBy = this.changeTriggeredBy;
                this.showOffspringLimited = false;
                this.changeTriggeredBy = null;
                var el = this.gridService.getParentTablejsGridDirective(this.elementRef.nativeElement);
                if (el !== null) {
                    this.gridDirective = el['gridDirective'];
                    var columnVisibilityChanged = this._hideColumn !== hide;
                    if (!columnVisibilityChanged) {
                        this.gridDirective.hiddenColumnChanges.next(null);
                        return;
                    }
                    this._hideColumn = hide;
                    var flattenedColumnHierarchy = this.gridDirective.getFlattenedHierarchy();
                    var currentColumnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                        return hierarchy.element === _this.gridDirective.getRelatedHeader(_this.elementRef.nativeElement);
                    })[0];
                    if (!wasTriggeredBy) {
                        this.changeTriggeredBy = currentColumnHierarchy;
                    }
                    if (hide) {
                        var lowestLevelColHierarchiesVisible = this.getLowestLevelColumnHierarchiesVisible(flattenedColumnHierarchy);
                        var allLowestLevelColumnsHidden = lowestLevelColHierarchiesVisible.length === 0;
                        if (allLowestLevelColumnsHidden || this.allColumnsShareTheSameAncestor(currentColumnHierarchy, lowestLevelColHierarchiesVisible, flattenedColumnHierarchy)) {
                            this._hideColumn = false;
                            this.gridDirective.hiddenColumnChanges.next(null);
                            return;
                        }
                        this.gridDirective.getRelatedHeaders(this.elementRef.nativeElement).forEach(function (element) {
                            element.classList.add(_this.HIDDEN_COLUMN_CLASS);
                        });
                        this.hideAllOffspring(currentColumnHierarchy);
                        if (this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy)) {
                            this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, true);
                        }
                    }
                    else {
                        this.gridDirective.getRelatedHeaders(this.elementRef.nativeElement).forEach(function (element) {
                            element.classList.remove(_this.HIDDEN_COLUMN_CLASS);
                        });
                        this.setAllAncestors(currentColumnHierarchy, flattenedColumnHierarchy, false);
                        if (!wasLimited) {
                            this.showAllOffspring(currentColumnHierarchy);
                        }
                    }
                    var triggerHierarchy = !wasTriggeredBy ? currentColumnHierarchy : null;
                    this.changeTriggeredBy = null;
                    this.gridDirective.hiddenColumnChanges.next({ hierarchyColumn: currentColumnHierarchy, wasTriggeredByThisColumn: triggerHierarchy !== null, hidden: this._hideColumn === true });
                }
            },
            enumerable: false,
            configurable: true
        });
        HideColumnIfDirective.prototype.getVisibleSiblingsByColumn = function (hierarchyList, level) {
            var visibleSiblings = hierarchyList.filter(function (hierarchy) {
                return hierarchy.level === level && hierarchy.element.hideColumnIf.tablejsHideColumnIf === false;
            });
            return visibleSiblings;
        };
        HideColumnIfDirective.prototype.updateHeadersThatCanHide = function () {
            var flattenedColumnHierarchy = this.gridDirective.getFlattenedHierarchy();
            for (var i = 0; i < flattenedColumnHierarchy.length; i++) {
                var columnHierarchy = flattenedColumnHierarchy[i];
                var element = columnHierarchy.element;
                var hideColumnIf = element.hideColumnIf;
                hideColumnIf.canHide = true;
            }
            var visibleSiblings = this.getVisibleSiblingsByColumn(flattenedColumnHierarchy, 0);
            if (visibleSiblings.length === 1) {
                var solitarySibling = visibleSiblings[0];
                solitarySibling.element.hideColumnIf.canHide = false;
                var subColumns = solitarySibling.subColumns;
                var count = 0;
                while (solitarySibling && subColumns.length !== 0) {
                    visibleSiblings = this.getVisibleSiblingsByColumn(subColumns, ++count);
                    solitarySibling = visibleSiblings.length === 1 ? visibleSiblings[0] : null;
                    if (solitarySibling) {
                        solitarySibling.element.hideColumnIf.canHide = false;
                        subColumns = solitarySibling.subColumns;
                    }
                }
            }
        };
        HideColumnIfDirective.prototype.getLowestLevelColumnHierarchiesVisible = function (flattenedColumnHierarchy) {
            var lowestLevelColHierarchiesVisible = [];
            var sortedByLevelColumnHierarchy = flattenedColumnHierarchy.concat().sort(function (colHier1, colHier2) {
                return colHier2.level - colHier1.level;
            });
            var baseLevel = sortedByLevelColumnHierarchy[0].level;
            for (var i = 0; i < sortedByLevelColumnHierarchy.length; i++) {
                var hierarchy = sortedByLevelColumnHierarchy[i];
                if (hierarchy.level !== baseLevel) {
                    break;
                }
                if (!hierarchy.element.hideColumnIf.tablejsHideColumnIf) {
                    lowestLevelColHierarchiesVisible.push(hierarchy);
                }
            }
            return lowestLevelColHierarchiesVisible;
        };
        HideColumnIfDirective.prototype.allColumnsShareTheSameAncestor = function (commonAncestor, columnHierarchies, flattenedColumnHierarchy) {
            var hierarchiesWithCommonAncestor = [];
            var _loop_1 = function (i) {
                var currentColumnHierarchy = columnHierarchies[i];
                var parentColumnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                    return hierarchy.element === currentColumnHierarchy.parentColumn;
                })[0];
                var _loop_2 = function () {
                    if (parentColumnHierarchy === commonAncestor) {
                        hierarchiesWithCommonAncestor.push(currentColumnHierarchy);
                        return "break";
                    }
                    var columnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                        return hierarchy.element === parentColumnHierarchy.element;
                    })[0];
                    parentColumnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                        return hierarchy.element === columnHierarchy.parentColumn;
                    })[0];
                };
                while (parentColumnHierarchy) {
                    var state_1 = _loop_2();
                    if (state_1 === "break")
                        break;
                }
            };
            for (var i = 0; i < columnHierarchies.length; i++) {
                _loop_1(i);
            }
            return columnHierarchies.length === hierarchiesWithCommonAncestor.length;
        };
        HideColumnIfDirective.prototype.hideAllOffspring = function (columnHierarchy) {
            for (var i = 0; i < columnHierarchy.subColumns.length; i++) {
                var child = this.gridDirective.getRelatedHeader(columnHierarchy.subColumns[i].element);
                child.hideColumnIf.changeTriggeredBy = columnHierarchy;
                child.hideColumnIf.tablejsHideColumnIf = true;
            }
        };
        HideColumnIfDirective.prototype.showAllOffspring = function (columnHierarchy) {
            for (var i = 0; i < columnHierarchy.subColumns.length; i++) {
                var child = this.gridDirective.getRelatedHeader(columnHierarchy.subColumns[i].element);
                child.hideColumnIf.changeTriggeredBy = columnHierarchy;
                child.hideColumnIf.tablejsHideColumnIf = false;
                child.hideColumnIf.canHide = true;
            }
        };
        HideColumnIfDirective.prototype.allSiblingsAreHidden = function (columnHierarchy, flattenedColumnHierarchy) {
            var _this = this;
            var parentColumnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                return hierarchy.element === columnHierarchy.parentColumn;
            })[0];
            var hiddenSiblingCount = 0;
            var totalSiblings;
            if (parentColumnHierarchy) {
                totalSiblings = parentColumnHierarchy.subColumns.length;
                parentColumnHierarchy.subColumns.forEach(function (subColumn) {
                    if (_this.gridDirective.getRelatedHeader(subColumn.element).hideColumnIf.tablejsHideColumnIf) {
                        hiddenSiblingCount++;
                    }
                });
            }
            else {
                var topLevelSiblings = flattenedColumnHierarchy.filter(function (hierarchy) {
                    return hierarchy.level === 0;
                });
                totalSiblings = topLevelSiblings.length;
                for (var i = 0; i < topLevelSiblings.length; i++) {
                    var topLevelSibling = topLevelSiblings[i];
                    if (this.gridDirective.getRelatedHeader(topLevelSibling.element).hideColumnIf.tablejsHideColumnIf) {
                        hiddenSiblingCount++;
                    }
                }
            }
            return hiddenSiblingCount === totalSiblings;
        };
        HideColumnIfDirective.prototype.setAllAncestors = function (currentColumnHierarchy, flattenedColumnHierarchy, hidden) {
            var parentColumnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                return hierarchy.element === currentColumnHierarchy.parentColumn;
            })[0];
            var allSiblingsHidden = this.allSiblingsAreHidden(currentColumnHierarchy, flattenedColumnHierarchy);
            var parentSiblingsAreAllHidden = hidden ? allSiblingsHidden : true;
            var _loop_3 = function () {
                var parentElement = parentColumnHierarchy.element;
                parentElement.hideColumnIf.changeTriggeredBy = currentColumnHierarchy;
                parentElement.hideColumnIf.showOffspringLimited = true;
                parentElement.hideColumnIf.tablejsHideColumnIf = hidden;
                parentElement.hideColumnIf.canHide = true;
                var columnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                    return hierarchy.element === parentColumnHierarchy.element;
                })[0];
                parentColumnHierarchy = flattenedColumnHierarchy.filter(function (hierarchy) {
                    return hierarchy.element === columnHierarchy.parentColumn;
                })[0];
            };
            while (parentColumnHierarchy && parentSiblingsAreAllHidden) {
                _loop_3();
            }
        };
        return HideColumnIfDirective;
    }());
    HideColumnIfDirective.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[tablejsHideColumnIf], [tablejshidecolumnif], [tablejs-hide-column-if]'
                },] }
    ];
    HideColumnIfDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: GridService }
    ]; };
    HideColumnIfDirective.propDecorators = {
        tablejsHideColumnIf: [{ type: i0.Input }]
    };

    var TablejsModule = /** @class */ (function () {
        function TablejsModule() {
        }
        return TablejsModule;
    }());
    TablejsModule.decorators = [
        { type: i0.NgModule, args: [{
                    entryComponents: [
                        DragAndDropGhostComponent,
                        ScrollPrevSpacerComponent
                    ],
                    declarations: [
                        GridDirective,
                        GridRowDirective,
                        ResizableGripDirective,
                        InfiniteScrollDirective,
                        HorizResizeGripComponent,
                        ReorderGripComponent,
                        GridComponent,
                        EditableCellDirective,
                        DragAndDropGhostComponent,
                        ReorderGripDirective,
                        ReorderColDirective,
                        DataColClassesDirective,
                        DataColClassDirective,
                        VirtualForDirective,
                        ScrollViewportDirective,
                        ScrollPrevSpacerComponent,
                        HideColumnIfDirective
                    ],
                    imports: [
                        common.CommonModule
                    ],
                    providers: [
                        GridService,
                        OperatingSystemService,
                        DirectiveRegistrationService,
                        ScrollDispatcherService
                    ],
                    exports: [
                        GridDirective,
                        GridRowDirective,
                        ResizableGripDirective,
                        InfiniteScrollDirective,
                        HorizResizeGripComponent,
                        ReorderGripComponent,
                        GridComponent,
                        EditableCellDirective,
                        DragAndDropGhostComponent,
                        ReorderGripDirective,
                        ReorderColDirective,
                        DataColClassesDirective,
                        DataColClassDirective,
                        VirtualForDirective,
                        ScrollViewportDirective,
                        HideColumnIfDirective
                    ],
                    schemas: [i0.CUSTOM_ELEMENTS_SCHEMA]
                },] }
    ];

    var Comparator = /** @class */ (function () {
        function Comparator() {
        }
        Comparator.getCurrentSortOptions = function () {
            var _a;
            return (_a = Comparator.filterSortService) === null || _a === void 0 ? void 0 : _a.currentSortOptions;
        };
        Comparator.getCurrentFilterOptions = function () {
            var _a;
            return (_a = Comparator.filterSortService) === null || _a === void 0 ? void 0 : _a.currentFilterOptions;
        };
        Comparator.isString = function (val) {
            return typeof val === 'string' || val instanceof String;
        };
        return Comparator;
    }());
    Comparator.filterSortService = null;

    exports["ɵb"] = void 0;
    (function (SortDirection) {
        SortDirection.DESCENDING = -1;
        SortDirection.NONE = 0;
        SortDirection.ASCENDING = 1;
    })(exports["ɵb"] || (exports["ɵb"] = {}));

    var FilterSortService = /** @class */ (function () {
        function FilterSortService() {
            this.autoDefineUnsetProperties = false;
            Comparator.filterSortService = this;
        }
        Object.defineProperty(FilterSortService.prototype, "currentFilterOptions", {
            get: function () {
                return this._currentFilterOptions;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FilterSortService.prototype, "currentSortOptions", {
            get: function () {
                return this._currentSortOptions;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(FilterSortService.prototype, "itemsBeingFilteredAndSorted", {
            get: function () {
                return this._items;
            },
            enumerable: false,
            configurable: true
        });
        FilterSortService.prototype.filterAndSortItems = function (items, filterOptions, sortOptions) {
            var filteredItems;
            this._items = items;
            filteredItems = items;
            if (filterOptions) {
                if (Array.isArray(filterOptions)) {
                    var filterOptionsLen = filterOptions.length;
                    for (var i = 0; i < filterOptionsLen; i++) {
                        var options = filterOptions[i];
                        this._currentFilterOptions = options;
                        filteredItems = this.filterItemsByVarNames(filteredItems, options);
                    }
                }
                else {
                    filteredItems = this.filterItemsByVarNames(filteredItems, filterOptions);
                }
            }
            if (sortOptions) {
                if (Array.isArray(sortOptions)) {
                    filteredItems = this.multiSortItemsByVarName(filteredItems, sortOptions);
                }
                else {
                    filteredItems = this.sortItemsByVarName(filteredItems, sortOptions);
                }
            }
            return filteredItems;
        };
        FilterSortService.prototype.isString = function (val) {
            return typeof val === 'string' || val instanceof String;
        };
        FilterSortService.prototype.filterItemsByVarNames = function (items, filterOptions) {
            this._currentFilterOptions = filterOptions;
            if (!filterOptions) {
                throw Error('A FilterOptions object is not defined. Please supply filter options to sort items by.');
            }
            var varNames = this.isString(filterOptions.variableIdentifiers)
                ? [filterOptions.variableIdentifiers]
                : filterOptions.variableIdentifiers;
            this.ignoreCase = filterOptions.ignoreCase;
            if (items === null || items === undefined) {
                throw Error('Item array is not defined. Please supply a defined array to filter.');
            }
            if (items.length === 0) {
                return items;
            }
            this.filterSplits = [];
            var numOfVarNames = varNames && varNames.length > 0 ? varNames.length : 0;
            for (var i = 0; i < numOfVarNames; i++) {
                this.splitVariablesFromIdentifier(varNames[i]);
                this.filterSplits.push(this.splits);
            }
            this.filterSplitsLen = this.filterSplits.length;
            items = items.concat();
            items = items.filter(filterOptions.comparator);
            return items;
        };
        FilterSortService.prototype.splitVariablesFromIdentifier = function (varName) {
            if (varName === null || varName === undefined || varName === '') {
                this.splits = [];
                this.splitsLen = this.splits.length;
                return;
            }
            var containsBrackets = varName.includes('[');
            this.splits = varName.split('.');
            this.splitsLen = this.splits.length;
            if (containsBrackets) {
                var bracketSplits = [];
                for (var i = 0; i < this.splitsLen; i++) {
                    var split = this.splits[i];
                    var startBracketIndex = split.indexOf('[');
                    if (startBracketIndex !== -1) {
                        while (split !== '') {
                            var endBracketIndex = split.indexOf(']') + 1;
                            var preBracketVar = split.substring(0, startBracketIndex);
                            var brackets = split.substring(startBracketIndex + 1, endBracketIndex - 1);
                            var postBracketVar = split.substring(endBracketIndex, split.length);
                            split = postBracketVar;
                            startBracketIndex = split.indexOf('[');
                            if (preBracketVar !== '') {
                                bracketSplits.push(preBracketVar);
                            }
                            bracketSplits.push(brackets);
                        }
                    }
                    else {
                        bracketSplits.push(split);
                    }
                }
                this.splits = bracketSplits;
            }
            this.splitsLen = this.splits.length;
            var varStr = '(array item)';
            this.varNames = [varStr];
            for (var i = 0; i < this.splitsLen; i++) {
                this.vName = this.splits[i];
                if (isNaN(Number(this.vName))) {
                    varStr += '.' + this.vName;
                }
                else {
                    varStr += '[' + this.vName + ']';
                }
                this.varNames.push(varStr);
            }
        };
        FilterSortService.prototype.sortItemsByVarName = function (items, sortOptions) {
            this._currentSortOptions = sortOptions;
            if (!sortOptions) {
                throw Error('A SortOptions object is not defined. Please supply filter options to sort items by.');
            }
            var varName = sortOptions.variableIdentifier;
            this.sortDirection = sortOptions.sortDirection;
            this.ignoreCase = sortOptions.ignoreCase;
            if (items === null || items === undefined) {
                throw Error('Item array is not defined. Please supply a defined array to sort.');
            }
            if (items.length === 0) {
                return items;
            }
            this.splitVariablesFromIdentifier(varName);
            items = items.concat();
            if (this.sortDirection !== exports["ɵb"].NONE) {
                items.sort(sortOptions.comparator);
            }
            return items;
        };
        FilterSortService.prototype.multiSortItemsByVarName = function (items, sortOptionsGroup) {
            var _this = this;
            sortOptionsGroup.sort(function (sortOptionsA, sortOptionsB) {
                if (!sortOptionsA || !sortOptionsB) {
                    return 0;
                }
                var orderA = sortOptionsA.sortOrder;
                var orderB = sortOptionsB.sortOrder;
                if (orderA === orderB) {
                    return 0;
                }
                return orderA > orderB ? 1 : -1;
            });
            sortOptionsGroup.forEach(function (sortOptions) {
                items = _this.sortItemsByVarName(items, sortOptions);
            });
            return items;
        };
        FilterSortService.prototype.getFilterValuesFromPropertyIndentifiers = function (value) {
            this.filterSplitsLen = this.filterSplits.length;
            var vals = this.filterSplitsLen === 0 ? [value] : [];
            for (var j = 0; j < this.filterSplitsLen; j++) {
                var varA = value;
                var splits = this.filterSplits[j];
                var splitsLen = splits.length;
                for (var i = 0; i < splitsLen; i++) {
                    this.vName = splits[i];
                    if (!varA.hasOwnProperty(this.vName)) {
                        if (!this.autoDefineUnsetProperties) {
                            throw Error("Property " + this.vName + " not found on " + this.varNames[i]);
                        }
                        this.defineProperty(varA, this.vName);
                    }
                    else {
                        varA = varA[this.vName];
                    }
                }
                vals.push(varA);
            }
            return vals;
        };
        FilterSortService.prototype.defineProperty = function (obj, propName, value, writable) {
            if (value === void 0) { value = undefined; }
            if (writable === void 0) { writable = true; }
            Object.defineProperty(obj, propName, {
                value: value,
                writable: writable
            });
        };
        FilterSortService.prototype.getSortValuesFromPropertyIdentifiers = function (valueA, valueB) {
            var varA = valueA;
            var varB = valueB;
            for (var i = 0; i < this.splitsLen; i++) {
                this.vName = this.splits[i];
                if (!varA.hasOwnProperty(this.vName) ||
                    !varB.hasOwnProperty(this.vName)) {
                    throw Error("Property " + this.vName + " not found on " + this.varNames[i]);
                }
                varA = varA[this.vName];
                varB = varB[this.vName];
            }
            return [varA, varB];
        };
        return FilterSortService;
    }());
    FilterSortService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function FilterSortService_Factory() { return new FilterSortService(); }, token: FilterSortService, providedIn: "root" });
    FilterSortService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    FilterSortService.ctorParameters = function () { return []; };

    var SortOptions = /** @class */ (function () {
        function SortOptions(variableIdentifier, comparator, initialSortDirection, ignoreCase, sortOrder, useLocalCompare, localeCompareOptions) {
            if (initialSortDirection === void 0) { initialSortDirection = exports["ɵb"].NONE; }
            if (ignoreCase === void 0) { ignoreCase = true; }
            if (sortOrder === void 0) { sortOrder = 0; }
            if (useLocalCompare === void 0) { useLocalCompare = false; }
            if (localeCompareOptions === void 0) { localeCompareOptions = null; }
            this.ignoreTimeOfDay = true;
            this._directionOrder = [exports["ɵb"].ASCENDING, exports["ɵb"].DESCENDING, exports["ɵb"].NONE];
            this._sortDirectionIndex = -1;
            this.variableIdentifier = variableIdentifier;
            this.comparator = comparator;
            this.initialSortDirection = initialSortDirection;
            this.ignoreCase = ignoreCase;
            this.sortOrder = sortOrder;
            this.useLocaleCompare = useLocalCompare;
            this.localeCompareOptions = localeCompareOptions;
            this.sortDirection = this.initialSortDirection;
        }
        Object.defineProperty(SortOptions.prototype, "directionOrder", {
            get: function () {
                return this._directionOrder;
            },
            set: function (order) {
                this._sortDirectionIndex = -1;
                this._directionOrder = order;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SortOptions.prototype, "sortDirection", {
            get: function () {
                return this._sortDirectionIndex === -1
                    ? exports["ɵb"].NONE
                    : this._directionOrder[this._sortDirectionIndex];
            },
            set: function (direction) {
                this._sortDirectionIndex = this._directionOrder.indexOf(direction);
            },
            enumerable: false,
            configurable: true
        });
        SortOptions.prototype.nextSortDirection = function () {
            this._sortDirectionIndex++;
            if (this._sortDirectionIndex >= this._directionOrder.length) {
                this._sortDirectionIndex = 0;
            }
        };
        return SortOptions;
    }());

    exports["ɵc"] = void 0;
    (function (MatchType) {
        MatchType.ALL = 'all';
        MatchType.ANY = 'any';
    })(exports["ɵc"] || (exports["ɵc"] = {}));

    var FilterOptions = /** @class */ (function () {
        function FilterOptions(variableIdentifiers, comparator, filterValue, matchType, ignoreCase) {
            if (filterValue === void 0) { filterValue = null; }
            if (matchType === void 0) { matchType = exports["ɵc"].ANY; }
            if (ignoreCase === void 0) { ignoreCase = true; }
            this.ignoreTimeOfDay = true;
            this.variableIdentifiers = variableIdentifiers;
            this.comparator = comparator;
            this.ignoreCase = ignoreCase;
            this.filterValue = filterValue;
            this.matchType = matchType;
        }
        return FilterOptions;
    }());

    var SortComparator = /** @class */ (function (_super) {
        __extends(SortComparator, _super);
        function SortComparator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SortComparator.DATE = function (valueA, valueB) {
            var values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
            var varA = values[0];
            var varB = values[1];
            var currentSortOptions = Comparator.getCurrentSortOptions();
            if (!currentSortOptions) {
                this.triggerNoSortOptionsError();
            }
            if (currentSortOptions.ignoreTimeOfDay) {
                varA = new Date(varA);
                varB = new Date(varB);
                varA.setHours(0, 0, 0, 0);
                varB.setHours(0, 0, 0, 0);
            }
            var modifier = currentSortOptions.variableMapper;
            if (modifier !== null && modifier !== undefined) {
                varA = modifier.apply(null, [varA]);
                varB = modifier.apply(null, [varB]);
            }
            if (varA === varB) {
                return 0;
            }
            return Comparator.filterSortService.sortDirection === 1
                ? varA - varB
                : varB - varA;
        };
        SortComparator.NUMERIC = function (valueA, valueB) {
            var values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
            var varA = values[0];
            var varB = values[1];
            var currentSortOptions = Comparator.getCurrentSortOptions();
            if (!currentSortOptions) {
                this.triggerNoSortOptionsError();
            }
            var modifier = currentSortOptions.variableMapper;
            if (modifier !== null && modifier !== undefined) {
                varA = modifier.apply(null, [varA]);
                varB = modifier.apply(null, [varB]);
            }
            if (varA === varB) {
                return 0;
            }
            return varA > varB
                ? 1 * Comparator.filterSortService.sortDirection
                : -1 * Comparator.filterSortService.sortDirection;
        };
        SortComparator.BOOLEAN = function (valueA, valueB) {
            var values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
            var varA = values[0];
            var varB = values[1];
            var currentSortOptions = Comparator.getCurrentSortOptions();
            if (!currentSortOptions) {
                this.triggerNoSortOptionsError();
            }
            var modifier = currentSortOptions.variableMapper;
            if (modifier !== null && modifier !== undefined) {
                varA = modifier.apply(null, [varA]);
                varB = modifier.apply(null, [varB]);
            }
            if (varA === varB) {
                return 0;
            }
            return Comparator.filterSortService.sortDirection === 1
                ? varA - varB
                : varB - varA;
        };
        SortComparator.TRUTHY = function (valueA, valueB) {
            var values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
            var varA = values[0];
            var varB = values[1];
            var currentSortOptions = Comparator.getCurrentSortOptions();
            if (!currentSortOptions) {
                this.triggerNoSortOptionsError();
            }
            var modifier = currentSortOptions.variableMapper;
            if (modifier !== null && modifier !== undefined) {
                varA = modifier.apply(null, [varA]);
                varB = modifier.apply(null, [varB]);
            }
            var varAIsFalsy = varA ? 1 : 0;
            var varBIsFalsy = varB ? 1 : 0;
            if (varAIsFalsy === varBIsFalsy) {
                return 0;
            }
            return Comparator.filterSortService.sortDirection === 1
                ? varAIsFalsy - varBIsFalsy
                : varBIsFalsy - varAIsFalsy;
        };
        SortComparator.ALPHABETICAL = function (valueA, valueB) {
            var values = Comparator.filterSortService.getSortValuesFromPropertyIdentifiers(valueA, valueB);
            var varA = values[0];
            var varB = values[1];
            var currentSortOptions = Comparator.getCurrentSortOptions();
            if (!currentSortOptions) {
                this.triggerNoSortOptionsError();
            }
            var modifier = currentSortOptions.variableMapper;
            if (modifier !== null && modifier !== undefined) {
                varA = modifier.apply(null, [varA]);
                varB = modifier.apply(null, [varB]);
            }
            if (Comparator.filterSortService.ignoreCase) {
                if ((typeof varA === 'string' || varA instanceof String) &&
                    (typeof varB === 'string' || varB instanceof String)) {
                    varA = varA.toLowerCase();
                    varB = varB.toLowerCase();
                }
            }
            varA = varA.toString();
            varB = varB.toString();
            if (varA == varB || !Comparator.filterSortService.currentSortOptions) {
                return 0;
            }
            if (Comparator.filterSortService.currentSortOptions.useLocaleCompare) {
                if (Comparator.filterSortService.currentSortOptions.localeCompareOptions) {
                    var locales = Comparator.filterSortService.currentSortOptions
                        .localeCompareOptions[0];
                    var options = Comparator.filterSortService.currentSortOptions.localeCompareOptions.length > 1 ? Comparator.filterSortService.currentSortOptions.localeCompareOptions[1] : null;
                    if (options) {
                        return (varA.localeCompare(varB, locales, options) *
                            Comparator.filterSortService.sortDirection);
                    }
                    else {
                        return varA.localeCompare(varB, locales) *
                            Comparator.filterSortService.sortDirection;
                    }
                }
                else {
                    return (varA.localeCompare(varB) * Comparator.filterSortService.sortDirection);
                }
            }
            else {
                return varA > varB
                    ? Comparator.filterSortService.sortDirection * 1
                    : Comparator.filterSortService.sortDirection * -1;
            }
        };
        SortComparator.triggerNoSortOptionsError = function () {
            throw Error("Please supply a SortOptions object to sort your array by.");
        };
        return SortComparator;
    }(Comparator));

    var FilterComparator = /** @class */ (function (_super) {
        __extends(FilterComparator, _super);
        function FilterComparator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FilterComparator.getRequiredMatches = function (numOfValues) {
            if (!Comparator.filterSortService.currentFilterOptions) {
                return 1;
            }
            else {
                return Comparator.filterSortService.currentFilterOptions.matchType ===
                    exports["ɵc"].ANY
                    ? 1
                    : numOfValues;
            }
        };
        FilterComparator.escapeRegExp = function (str) {
            var regExp = /[.*+?^${}()|[\]\\]/g;
            return str.replace(regExp, '\\$&'); // $& means the whole matched string
        };
        FilterComparator.getModifiedValue = function (value, variableMappers, index) {
            if (Array.isArray(variableMappers)) {
                if (index > variableMappers.length - 1) {
                    throw Error(value + " does not have a variable mapper assigned to it.");
                }
            }
            var modifier;
            modifier = Array.isArray(variableMappers)
                ? variableMappers[index]
                : variableMappers;
            if (modifier !== null && modifier !== undefined) {
                return modifier.apply(null, [value]);
            }
            return value;
        };
        FilterComparator.CONTAINS_STRING = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var containsString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = ignoreCase ? val.toString().toLowerCase() : val.toString();
                if (val.includes(filterValue)) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        containsString = true;
                    }
                }
            }
            return containsString;
        };
        FilterComparator.DOES_NOT_CONTAIN_STRING = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var doesNotContainString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = ignoreCase ? val.toString().toLowerCase() : val.toString();
                if (!val.includes(filterValue)) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        doesNotContainString = true;
                    }
                }
            }
            return doesNotContainString;
        };
        FilterComparator.CONTAINS_WORD = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var startsWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            var regExFlags = currentFilterOptions.ignoreCase
                ? 'mi'
                : 'm';
            var punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
                + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
            var startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
            var escapedValue = FilterComparator.escapeRegExp(filterValue);
            var regex = new RegExp(startsWithOrSpace +
                '(' +
                escapedValue +
                '$|' +
                escapedValue +
                '(\\s|' +
                punctuation +
                '))', regExFlags);
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                var found = regex.test(val);
                if (found) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        startsWithString = true;
                    }
                }
            }
            return startsWithString;
        };
        FilterComparator.DOES_NOT_CONTAIN_WORD = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var doesNotContainWord = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            var regExFlags = currentFilterOptions.ignoreCase
                ? 'mi'
                : 'm';
            var punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
                + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
            var startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
            var escapedValue = FilterComparator.escapeRegExp(filterValue);
            var regex = new RegExp(startsWithOrSpace +
                '(' +
                escapedValue +
                '$|' +
                escapedValue +
                '(\\s|' +
                punctuation +
                '))', regExFlags);
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                var found = regex.test(val);
                if (!found) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        doesNotContainWord = true;
                    }
                }
            }
            return doesNotContainWord;
        };
        FilterComparator.STARTS_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var startsWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = ignoreCase ? val.toLowerCase() : val;
                if (val.toString().substring(0, filterValue.length) === filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        startsWithString = true;
                    }
                }
            }
            return startsWithString;
        };
        FilterComparator.DOES_NOT_START_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var doesNotStartWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = ignoreCase ? val.toLowerCase() : val;
                if (val.toString().substring(0, filterValue.length) !== filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        doesNotStartWithString = true;
                    }
                }
            }
            return doesNotStartWithString;
        };
        FilterComparator.ENDS_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var endsWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = ignoreCase ? val.toLowerCase() : val;
                if (val
                    .toString()
                    .substr(val.length - filterValue.length, filterValue.length) ===
                    filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        endsWithString = true;
                    }
                }
            }
            return endsWithString;
        };
        FilterComparator.DOES_NOT_END_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var doesNotEndWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = ignoreCase ? val.toLowerCase() : val;
                if (val
                    .toString()
                    .substr(val.length - filterValue.length, filterValue.length) !==
                    filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        doesNotEndWithString = true;
                    }
                }
            }
            return doesNotEndWithString;
        };
        FilterComparator.WORD_STARTS_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var startsWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            var regExFlags = currentFilterOptions.ignoreCase
                ? 'mi'
                : 'm';
            var escapedValue = FilterComparator.escapeRegExp(filterValue);
            var punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
                + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
            var startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
            var regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                var found = regex.test(val);
                if (found) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        startsWithString = true;
                    }
                }
            }
            return startsWithString;
        };
        FilterComparator.WORD_DOES_NOT_START_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var doesNotStartsWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            var regExFlags = currentFilterOptions.ignoreCase
                ? 'mi'
                : 'm';
            var escapedValue = FilterComparator.escapeRegExp(filterValue);
            var punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
                + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
            var startsWithOrSpace = '(?:^|\\s|' + punctuation + ')';
            var regex = new RegExp(startsWithOrSpace + escapedValue, regExFlags);
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                var found = regex.test(val);
                if (!found) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        doesNotStartsWithString = true;
                    }
                }
            }
            return doesNotStartsWithString;
        };
        FilterComparator.WORD_ENDS_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var endsWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            var regExFlags = currentFilterOptions.ignoreCase
                ? 'mi'
                : 'm';
            var escapedValue = FilterComparator.escapeRegExp(filterValue);
            var punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
                + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
            var regex = new RegExp('(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))', regExFlags);
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                var found = regex.test(val);
                if (found) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        endsWithString = true;
                    }
                }
            }
            return endsWithString;
        };
        FilterComparator.WORD_DOES_NOT_END_WITH = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var doesNotEndWithString = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            var regExFlags = currentFilterOptions.ignoreCase
                ? 'mi'
                : 'm';
            var escapedValue = FilterComparator.escapeRegExp(filterValue);
            var punctuation = ',|:|;|\\[|\\]|\\{|\\}|\\(|\\)|\'|"|(\\.\\.\\.)|(\\.\\.\\.\\.)|(…)|(\\?)|!|\\.|-|—|@|#|\\$|%|\\^|&|\\*|_|\\+|=|/|>|<|`|~|('
                + FilterComparator.escapeRegExp('\\') + ')|(' + FilterComparator.escapeRegExp('|') + ')';
            var regex = new RegExp('(' + escapedValue + '$)|(' + escapedValue + '(\\s|' + punctuation + '))', regExFlags);
            filterValue = ignoreCase ? filterValue.toLowerCase() : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                var found = regex.test(val);
                if (!found) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        doesNotEndWithString = true;
                    }
                }
            }
            return doesNotEndWithString;
        };
        FilterComparator.EQUALS = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var equals = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue =
                Comparator.isString(filterValue) && ignoreCase
                    ? filterValue.toLowerCase()
                    : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val =
                    Comparator.isString(val) && ignoreCase
                        ? val.toString().toLowerCase()
                        : val;
                if (val == filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        equals = true;
                    }
                }
            }
            return equals;
        };
        FilterComparator.NOT_EQUAL = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var notEquals = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue =
                Comparator.isString(filterValue) && ignoreCase
                    ? filterValue.toLowerCase()
                    : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val =
                    Comparator.isString(val) && ignoreCase
                        ? val.toString().toLowerCase()
                        : val;
                if (val != filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        notEquals = true;
                    }
                }
            }
            return notEquals;
        };
        FilterComparator.STRICT_EQUALS = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var equals = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue =
                Comparator.isString(filterValue) && ignoreCase
                    ? filterValue.toLowerCase()
                    : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val =
                    Comparator.isString(val) && ignoreCase
                        ? val.toString().toLowerCase()
                        : val;
                if (val === filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        equals = true;
                    }
                }
            }
            return equals;
        };
        FilterComparator.NOT_STRICT_EQUALS = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var notStrictEquals = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            var ignoreCase = currentFilterOptions.ignoreCase;
            filterValue =
                Comparator.isString(filterValue) && ignoreCase
                    ? filterValue.toLowerCase()
                    : filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val =
                    Comparator.isString(val) && ignoreCase
                        ? val.toString().toLowerCase()
                        : val;
                if (val !== filterValue) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        notStrictEquals = true;
                    }
                }
            }
            return notStrictEquals;
        };
        FilterComparator.LESS_THAN = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var lessThan = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = Number(val);
                if (val < Number(filterValue)) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        lessThan = true;
                    }
                }
            }
            return lessThan;
        };
        FilterComparator.GREATER_THAN = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var greaterThan = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = Number(val);
                if (val > Number(filterValue)) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        greaterThan = true;
                    }
                }
            }
            return greaterThan;
        };
        FilterComparator.LESS_THAN_OR_EQUAL = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var lessThan = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = Number(val);
                if (val <= Number(filterValue)) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        lessThan = true;
                    }
                }
            }
            return lessThan;
        };
        FilterComparator.GREATER_THAN_OR_EQUAL = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var greaterThan = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                val = Number(val);
                if (val >= Number(filterValue)) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        greaterThan = true;
                    }
                }
            }
            return greaterThan;
        };
        FilterComparator.IS_AFTER_DATE = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var afterDate = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            if (currentFilterOptions.ignoreTimeOfDay) {
                filterValue = new Date(filterValue);
                filterValue.setHours(0, 0, 0, 0);
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = new Date(vals[i]);
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (currentFilterOptions.ignoreTimeOfDay) {
                    val = new Date(val);
                    val.setHours(0, 0, 0, 0);
                }
                if (val.getTime() > filterValue.getTime()) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        afterDate = true;
                    }
                }
            }
            return afterDate;
        };
        FilterComparator.IS_BEFORE_DATE = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var beforeDate = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            if (currentFilterOptions.ignoreTimeOfDay) {
                filterValue = new Date(filterValue);
                filterValue.setHours(0, 0, 0, 0);
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = new Date(vals[i]);
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (currentFilterOptions.ignoreTimeOfDay) {
                    val = new Date(val);
                    val.setHours(0, 0, 0, 0);
                }
                if (val.getTime() < filterValue.getTime()) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        beforeDate = true;
                    }
                }
            }
            return beforeDate;
        };
        FilterComparator.DATE_IS = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var beforeDate = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            if (currentFilterOptions.ignoreTimeOfDay) {
                filterValue = new Date(filterValue);
                filterValue.setHours(0, 0, 0, 0);
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = new Date(vals[i]);
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (currentFilterOptions.ignoreTimeOfDay) {
                    val = new Date(val);
                    val.setHours(0, 0, 0, 0);
                }
                if (val.getTime() === filterValue.getTime()) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        beforeDate = true;
                    }
                }
            }
            return beforeDate;
        };
        FilterComparator.DATE_IS_NOT = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var isNotDate = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            if (currentFilterOptions.ignoreTimeOfDay) {
                filterValue = new Date(filterValue);
                filterValue.setHours(0, 0, 0, 0);
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = new Date(vals[i]);
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (currentFilterOptions.ignoreTimeOfDay) {
                    val = new Date(val);
                    val.setHours(0, 0, 0, 0);
                }
                if (val.getTime() !== filterValue.getTime()) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        isNotDate = true;
                    }
                }
            }
            return isNotDate;
        };
        FilterComparator.IS_ON_OR_AFTER_DATE = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var afterDate = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            if (currentFilterOptions.ignoreTimeOfDay) {
                filterValue = new Date(filterValue);
                filterValue.setHours(0, 0, 0, 0);
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = new Date(vals[i]);
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (currentFilterOptions.ignoreTimeOfDay) {
                    val = new Date(val);
                    val.setHours(0, 0, 0, 0);
                }
                if (val.getTime() >= filterValue.getTime()) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        afterDate = true;
                    }
                }
            }
            return afterDate;
        };
        FilterComparator.IS_ON_OR_BEFORE_DATE = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var beforeDate = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            var filterValue = currentFilterOptions.filterValue;
            if (currentFilterOptions.ignoreTimeOfDay) {
                filterValue = new Date(filterValue);
                filterValue.setHours(0, 0, 0, 0);
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = new Date(vals[i]);
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (currentFilterOptions.ignoreTimeOfDay) {
                    val = new Date(val);
                    val.setHours(0, 0, 0, 0);
                }
                if (val.getTime() <= filterValue.getTime()) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        beforeDate = true;
                    }
                }
            }
            return beforeDate;
        };
        FilterComparator.IS_TRUE = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var isTrue = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (val === true) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        isTrue = true;
                    }
                }
            }
            return isTrue;
        };
        FilterComparator.IS_FALSE = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var isFalse = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (val === false) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        isFalse = true;
                    }
                }
            }
            return isFalse;
        };
        FilterComparator.IS_TRUTHY = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var isTruthy = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (val) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        isTruthy = true;
                    }
                }
            }
            return isTruthy;
        };
        FilterComparator.IS_FALSY = function (value, index, array) {
            var vals = Comparator.filterSortService.getFilterValuesFromPropertyIndentifiers(value);
            var numOfValues = vals.length;
            var requiredMatches = FilterComparator.getRequiredMatches(numOfValues);
            var matchCount = 0;
            var isFalsy = false;
            var currentFilterOptions = Comparator.getCurrentFilterOptions();
            if (!currentFilterOptions) {
                this.triggerNoFilterOptionsError();
            }
            for (var i = 0; i < numOfValues; i++) {
                var val = vals[i];
                val = FilterComparator.getModifiedValue(val, currentFilterOptions.variableMappers, i);
                if (!val) {
                    matchCount++;
                    if (matchCount === requiredMatches) {
                        isFalsy = true;
                    }
                }
            }
            return isFalsy;
        };
        FilterComparator.triggerNoFilterOptionsError = function () {
            throw Error("Please supply a FilterOptions object to filter your array by.");
        };
        return FilterComparator;
    }(Comparator));

    var FilterAndSortModule = /** @class */ (function () {
        function FilterAndSortModule() {
        }
        return FilterAndSortModule;
    }());
    FilterAndSortModule.decorators = [
        { type: i0.NgModule, args: [{
                    imports: [platformBrowser.BrowserModule],
                    declarations: [],
                    providers: [FilterSortService],
                    exports: [],
                    bootstrap: [],
                },] }
    ];

    var Range = /** @class */ (function () {
        function Range() {
        }
        return Range;
    }());

    /*
     * Public API Surface of tablejs
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ColumnReorderEvent = ColumnReorderEvent;
    exports.ColumnResizeEvent = ColumnResizeEvent;
    exports.Comparator = Comparator;
    exports.DataColClassDirective = DataColClassDirective;
    exports.DataColClassesDirective = DataColClassesDirective;
    exports.DirectiveRegistrationService = DirectiveRegistrationService;
    exports.DragAndDropGhostComponent = DragAndDropGhostComponent;
    exports.EditableCellDirective = EditableCellDirective;
    exports.FilterAndSortModule = FilterAndSortModule;
    exports.FilterComparator = FilterComparator;
    exports.FilterOptions = FilterOptions;
    exports.FilterSortService = FilterSortService;
    exports.GridComponent = GridComponent;
    exports.GridDirective = GridDirective;
    exports.GridEvent = GridEvent;
    exports.GridRowDirective = GridRowDirective;
    exports.GridService = GridService;
    exports.HideColumnIfDirective = HideColumnIfDirective;
    exports.HorizResizeGripComponent = HorizResizeGripComponent;
    exports.InfiniteScrollDirective = InfiniteScrollDirective;
    exports.MatchType = exports["ɵc"];
    exports.OperatingSystemService = OperatingSystemService;
    exports.Range = Range;
    exports.ReorderColDirective = ReorderColDirective;
    exports.ReorderGripComponent = ReorderGripComponent;
    exports.ReorderGripDirective = ReorderGripDirective;
    exports.ResizableGripDirective = ResizableGripDirective;
    exports.ScrollDispatcherService = ScrollDispatcherService;
    exports.ScrollPrevSpacerComponent = ScrollPrevSpacerComponent;
    exports.ScrollViewportDirective = ScrollViewportDirective;
    exports.ScrollViewportEvent = ScrollViewportEvent;
    exports.SortComparator = SortComparator;
    exports.SortDirection = exports["ɵb"];
    exports.SortOptions = SortOptions;
    exports.TablejsForOfContext = TablejsForOfContext;
    exports.TablejsModule = TablejsModule;
    exports.VirtualForDirective = VirtualForDirective;
    exports["ɵa"] = TablejsGridProxy;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=transunion-ui-tablejs.umd.js.map
