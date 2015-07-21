/*! ng-dialog - v0.4.0 (https://github.com/likeastore/ngDialog) */ ! function(a, b) {
 "undefined" != typeof module && module.exports ? module.exports = b(require("angular")) : "function" == typeof define && define.amd ? define(["angular"], b) : b(a.angular)
}(this, function(a) {
 "use strict";
 var b = a.module("ngDialog", []),
  c = a.element,
  d = a.isDefined,
  e = (document.body || document.documentElement).style,
  f = d(e.animation) || d(e.WebkitAnimation) || d(e.MozAnimation) || d(e.MsAnimation) || d(e.OAnimation),
  g = "animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",
  h = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
  i = "ngdialog-disabled-animation",
  j = !1,
  k = {},
  l = [],
  m = !1;
 return b.provider("ngDialog", function() {
  var b = this.defaults = {
   className: "ngdialog-theme-default",
   disableAnimation: !1,
   plain: !1,
   showClose: !0,
   closeByDocument: !0,
   closeByEscape: !0,
   closeByNavigation: !1,
   appendTo: !1,
   preCloseCallback: !1,
   overlay: !0,
   cache: !0,
   trapFocus: !0,
   preserveFocus: !0,
   ariaAuto: !0,
   ariaRole: null,
   ariaLabelledById: null,
   ariaLabelledBySelector: null,
   ariaDescribedById: null,
   ariaDescribedBySelector: null
  };
  this.setForceBodyReload = function(a) {
   j = a || !1
  }, this.setDefaults = function(c) {
   a.extend(b, c)
  };
  var d, e = 0,
   n = 0,
   o = {};
  this.$get = ["$document", "$templateCache", "$compile", "$q", "$http", "$rootScope", "$timeout", "$window", "$controller", "$injector", function(p, q, r, s, t, u, v, w, x, y) {
   var z = p.find("body");
   if (j) {
    var A = B.getRouterLocationEventName();
    u.$on(A, function() {
     z = p.find("body")
    })
   }
   var B = {
     onDocumentKeydown: function(a) {
      27 === a.keyCode && C.close("$escape")
     },
     activate: function(a) {
      var b = a.data("$ngDialogOptions");
      b.trapFocus && (a.on("keydown", B.onTrapFocusKeydown), z.on("keydown", B.onTrapFocusKeydown))
     },
     deactivate: function(a) {
      a.off("keydown", B.onTrapFocusKeydown), z.off("keydown", B.onTrapFocusKeydown)
     },
     deactivateAll: function() {
      a.forEach(function(b) {
       var c = a.element(b);
       B.deactivate(c)
      })
     },
     setBodyPadding: function(a) {
      var b = parseInt(z.css("padding-right") || 0, 10);
      z.css("padding-right", b + a + "px"), z.data("ng-dialog-original-padding", b)
     },
     resetBodyPadding: function() {
      var a = z.data("ng-dialog-original-padding");
      a ? z.css("padding-right", a + "px") : z.css("padding-right", "")
     },
     performCloseDialog: function(a, b) {
      var c = a.data("$ngDialogOptions"),
       e = a.attr("id"),
       h = k[e];
      if (h) {
       if ("undefined" != typeof w.Hammer) {
        var i = h.hammerTime;
        i.off("tap", d), i.destroy && i.destroy(), delete h.hammerTime
       } else a.unbind("click");
       1 === n && z.unbind("keydown"), a.hasClass("ngdialog-closing") || (n -= 1);
       var j = a.data("$ngDialogPreviousFocus");
       j && j.focus(), u.$broadcast("ngDialog.closing", a, b), n = 0 > n ? 0 : n, f && !c.disableAnimation ? (h.$destroy(), a.unbind(g).bind(g, function() {
        a.remove(), 0 === n && (z.removeClass("ngdialog-open"), B.resetBodyPadding()), u.$broadcast("ngDialog.closed", a, b)
       }).addClass("ngdialog-closing")) : (h.$destroy(), a.remove(), 0 === n && (z.removeClass("ngdialog-open"), B.resetBodyPadding()), u.$broadcast("ngDialog.closed", a, b)), o[e] && (o[e].resolve({
        id: e,
        value: b,
        $dialog: a,
        remainingDialogs: n
       }), delete o[e]), k[e] && delete k[e], l.splice(l.indexOf(e), 1), l.length || (z.unbind("keydown", B.onDocumentKeydown), m = !1)
      }
     },
     closeDialog: function(b, c) {
      var d = b.data("$ngDialogPreCloseCallback");
      if (d && a.isFunction(d)) {
       var e = d.call(b, c);
       a.isObject(e) ? e.closePromise ? e.closePromise.then(function() {
        B.performCloseDialog(b, c)
       }) : e.then(function() {
        B.performCloseDialog(b, c)
       }, function() {}) : e !== !1 && B.performCloseDialog(b, c)
      } else B.performCloseDialog(b, c)
     },
     onTrapFocusKeydown: function(b) {
      var c, d = a.element(b.currentTarget);
      if (d.hasClass("ngdialog")) c = d;
      else if (c = B.getActiveDialog(), null === c) return;
      var e = 9 === b.keyCode,
       f = b.shiftKey === !0;
      e && B.handleTab(c, b, f)
     },
     handleTab: function(a, b, c) {
      var d = B.getFocusableElements(a);
      if (0 === d.length) return void(document.activeElement && document.activeElement.blur());
      var e = document.activeElement,
       f = Array.prototype.indexOf.call(d, e),
       g = -1 === f,
       h = 0 === f,
       i = f === d.length - 1,
       j = !1;
      c ? (g || h) && (d[d.length - 1].focus(), j = !0) : (g || i) && (d[0].focus(), j = !0), j && (b.preventDefault(), b.stopPropagation())
     },
     autoFocus: function(a) {
      var b = a[0],
       d = b.querySelector("*[autofocus]");
      if (null === d || (d.focus(), document.activeElement !== d)) {
       var e = B.getFocusableElements(a);
       if (e.length > 0) return void e[0].focus();
       var f = B.filterVisibleElements(b.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span"));
       if (f.length > 0) {
        var g = f[0];
        c(g).attr("tabindex", "-1").css("outline", "0"), g.focus()
       }
      }
     },
     getFocusableElements: function(a) {
      var b = a[0],
       c = b.querySelectorAll(h);
      return B.filterVisibleElements(c)
     },
     filterVisibleElements: function(a) {
      for (var b = [], c = 0; c < a.length; c++) {
       var d = a[c];
       (d.offsetWidth > 0 || d.offsetHeight > 0) && b.push(d)
      }
      return b
     },
     getActiveDialog: function() {
      var a = document.querySelectorAll(".ngdialog");
      return 0 === a.length ? null : c(a[a.length - 1])
     },
     applyAriaAttributes: function(a, b) {
      if (b.ariaAuto) {
       if (!b.ariaRole) {
        var c = B.getFocusableElements(a).length > 0 ? "dialog" : "alertdialog";
        b.ariaRole = c
       }
       b.ariaLabelledBySelector || (b.ariaLabelledBySelector = "h1,h2,h3,h4,h5,h6"), b.ariaDescribedBySelector || (b.ariaDescribedBySelector = "article,section,p")
      }
      b.ariaRole && a.attr("role", b.ariaRole), B.applyAriaAttribute(a, "aria-labelledby", b.ariaLabelledById, b.ariaLabelledBySelector), B.applyAriaAttribute(a, "aria-describedby", b.ariaDescribedById, b.ariaDescribedBySelector)
     },
     applyAriaAttribute: function(a, b, d, e) {
      if (d && a.attr(b, d), e) {
       var f = a.attr("id"),
        g = a[0].querySelector(e);
       if (!g) return;
       var h = f + "-" + b;
       return c(g).attr("id", h), a.attr(b, h), h
      }
     },
     detectUIRouter: function() {
      try {
       return a.module("ui.router"), !0
      } catch (b) {
       return !1
      }
     },
     getRouterLocationEventName: function() {
      return B.detectUIRouter() ? "$stateChangeSuccess" : "$locationChangeSuccess"
     }
    },
    C = {
     open: function(f) {
      function g(a, b) {
       return u.$broadcast("ngDialog.templateLoading", a), t.get(a, b || {}).then(function(b) {
        return u.$broadcast("ngDialog.templateLoaded", a), b.data || ""
       })
      }

      function h(b) {
       return b ? a.isString(b) && j.plain ? b : "boolean" != typeof j.cache || j.cache ? g(b, {
        cache: q
       }) : g(b, {
        cache: !1
       }) : "Empty template"
      }
      var j = a.copy(b),
       p = ++e,
       A = "ngdialog" + p;
      l.push(A), f = f || {}, a.extend(j, f);
      var D;
      o[A] = D = s.defer();
      var E;
      k[A] = E = a.isObject(j.scope) ? j.scope.$new() : u.$new();
      var F, G, H = a.extend({}, j.resolve);
      return a.forEach(H, function(b, c) {
       H[c] = a.isString(b) ? y.get(b) : y.invoke(b, null, null, c)
      }), s.all({
       template: h(j.template || j.templateUrl),
       locals: s.all(H)
      }).then(function(b) {
       var e = b.template,
        f = b.locals;
       if (j.showClose && (e += '<div class="ngdialog-close"></div>'), F = c('<div id="ngdialog' + p + '" class="ngdialog"></div>'), F.html(j.overlay ? '<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">' + e + "</div>" : '<div class="ngdialog-content" role="document">' + e + "</div>"), F.data("$ngDialogOptions", j), E.ngDialogId = A, j.data && a.isString(j.data)) {
        var g = j.data.replace(/^\s*/, "")[0];
        E.ngDialogData = "{" === g || "[" === g ? a.fromJson(j.data) : j.data, E.ngDialogData.ngDialogId = A
       } else j.data && a.isObject(j.data) && (E.ngDialogData = j.data, E.ngDialogData.ngDialogId = A);
       if (j.controller && (a.isString(j.controller) || a.isArray(j.controller) || a.isFunction(j.controller))) {
        var h;
        j.controllerAs && a.isString(j.controllerAs) && (h = j.controllerAs);
        var k = x(j.controller, a.extend(f, {
         $scope: E,
         $element: F
        }), null, h);
        F.data("$ngDialogControllerController", k)
       }
       if (j.className && F.addClass(j.className), j.disableAnimation && F.addClass(i), G = j.appendTo && a.isString(j.appendTo) ? a.element(document.querySelector(j.appendTo)) : z, B.applyAriaAttributes(F, j), j.preCloseCallback) {
        var l;
        a.isFunction(j.preCloseCallback) ? l = j.preCloseCallback : a.isString(j.preCloseCallback) && E && (a.isFunction(E[j.preCloseCallback]) ? l = E[j.preCloseCallback] : E.$parent && a.isFunction(E.$parent[j.preCloseCallback]) ? l = E.$parent[j.preCloseCallback] : u && a.isFunction(u[j.preCloseCallback]) && (l = u[j.preCloseCallback])), l && F.data("$ngDialogPreCloseCallback", l)
       }
       if (E.closeThisDialog = function(a) {
         B.closeDialog(F, a)
        }, v(function() {
         var a = document.querySelectorAll(".ngdialog");
         B.deactivateAll(a), r(F)(E);
         var b = w.innerWidth - z.prop("clientWidth");
         z.addClass("ngdialog-open");
         var c = b - (w.innerWidth - z.prop("clientWidth"));
         c > 0 && B.setBodyPadding(c), G.append(F), B.activate(F), j.trapFocus && B.autoFocus(F), j.name ? u.$broadcast("ngDialog.opened", {
          dialog: F,
          name: j.name
         }) : u.$broadcast("ngDialog.opened", F)
        }), m || (z.bind("keydown", B.onDocumentKeydown), m = !0), j.closeByNavigation) {
        var o = B.getRouterLocationEventName();
        u.$on(o, function() {
         B.closeDialog(F)
        })
       }
       if (j.preserveFocus && F.data("$ngDialogPreviousFocus", document.activeElement), d = function(a) {
         var b = j.closeByDocument ? c(a.target).hasClass("ngdialog-overlay") : !1,
          d = c(a.target).hasClass("ngdialog-close");
         (b || d) && C.close(F.attr("id"), d ? "$closeButton" : "$document")
        }, "undefined" != typeof w.Hammer) {
        var q = E.hammerTime = w.Hammer(F[0]);
        q.on("tap", d)
       } else F.bind("click", d);
       return n += 1, C
      }), {
       id: A,
       closePromise: D.promise,
       close: function(a) {
        B.closeDialog(F, a)
       }
      }
     },
     openConfirm: function(b) {
      var d = s.defer(),
       e = {
        closeByEscape: !1,
        closeByDocument: !1
       };
      a.extend(e, b), e.scope = a.isObject(e.scope) ? e.scope.$new() : u.$new(), e.scope.confirm = function(a) {
       d.resolve(a);
       var b = c(document.getElementById(f.id));
       B.performCloseDialog(b, a)
      };
      var f = C.open(e);
      return f.closePromise.then(function(a) {
       return a ? d.reject(a.value) : d.reject()
      }), d.promise
     },
     isOpen: function(a) {
      var b = c(document.getElementById(a));
      return b.length > 0
     },
     close: function(a, b) {
      var d = c(document.getElementById(a));
      if (d.length) B.closeDialog(d, b);
      else if ("$escape" === a) {
       var e = l[l.length - 1];
       d = c(document.getElementById(e)), d.data("$ngDialogOptions").closeByEscape && B.closeDialog(d, b)
      } else C.closeAll(b);
      return C
     },
     closeAll: function(a) {
      for (var b = document.querySelectorAll(".ngdialog"), d = b.length - 1; d >= 0; d--) {
       var e = b[d];
       B.closeDialog(c(e), a)
      }
     },
     getOpenDialogs: function() {
      return l
     },
     getDefaults: function() {
      return b
     }
    };
   return C
  }]
 }), b.directive("ngDialog", ["ngDialog", function(b) {
  return {
   restrict: "A",
   scope: {
    ngDialogScope: "="
   },
   link: function(c, d, e) {
    d.on("click", function(d) {
     d.preventDefault();
     var f = a.isDefined(c.ngDialogScope) ? c.ngDialogScope : "noScope";
     a.isDefined(e.ngDialogClosePrevious) && b.close(e.ngDialogClosePrevious);
     var g = b.getDefaults();
     b.open({
      template: e.ngDialog,
      className: e.ngDialogClass || g.className,
      controller: e.ngDialogController,
      controllerAs: e.ngDialogControllerAs,
      bindToController: e.ngDialogBindToController,
      scope: f,
      data: e.ngDialogData,
      showClose: "false" === e.ngDialogShowClose ? !1 : "true" === e.ngDialogShowClose ? !0 : g.showClose,
      closeByDocument: "false" === e.ngDialogCloseByDocument ? !1 : "true" === e.ngDialogCloseByDocument ? !0 : g.closeByDocument,
      closeByEscape: "false" === e.ngDialogCloseByEscape ? !1 : "true" === e.ngDialogCloseByEscape ? !0 : g.closeByEscape,
      overlay: "false" === e.ngDialogOverlay ? !1 : "true" === e.ngDialogOverlay ? !0 : g.overlay,
      preCloseCallback: e.ngDialogPreCloseCallback || g.preCloseCallback
     })
    })
   }
  }
 }]), b
});
