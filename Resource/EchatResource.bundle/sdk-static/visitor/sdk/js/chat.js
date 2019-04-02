!function(t,i,s){function e(s,e){this.wrapper="string"==typeof s?i.querySelector(s):s,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this.options={resizeScrollbars:!0,mouseWheelSpeed:20,snapThreshold:.334,disablePointer:!h.hasPointer,disableTouch:h.hasPointer||!h.hasTouch,disableMouse:h.hasPointer||h.hasTouch,startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/},HWCompositing:!0,useTransition:!0,useTransform:!0,bindToWrapper:"undefined"==typeof t.onmousedown};for(var o in e)this.options[o]=e[o];this.translateZ=this.options.HWCompositing&&h.hasPerspective?" translateZ(0)":"",this.options.useTransition=h.hasTransition&&this.options.useTransition,this.options.useTransform=h.hasTransform&&this.options.useTransform,this.options.eventPassthrough=this.options.eventPassthrough===!0?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault,this.options.scrollY="vertical"!=this.options.eventPassthrough&&this.options.scrollY,this.options.scrollX="horizontal"!=this.options.eventPassthrough&&this.options.scrollX,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,this.options.bounceEasing="string"==typeof this.options.bounceEasing?h.ease[this.options.bounceEasing]||h.ease.circular:this.options.bounceEasing,this.options.resizePolling=void 0===this.options.resizePolling?60:this.options.resizePolling,this.options.tap===!0&&(this.options.tap="tap"),this.options.useTransition||this.options.useTransform||/relative|absolute/i.test(this.scrollerStyle.position)||(this.scrollerStyle.position="relative"),"scale"==this.options.shrinkScrollbars&&(this.options.useTransition=!1),this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1,3==this.options.probeType&&(this.options.useTransition=!1),this.x=0,this.y=0,this.directionX=0,this.directionY=0,this._events={},this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY),this.enable()}function o(t,s,e){var o=i.createElement("div"),n=i.createElement("div");return e===!0&&(o.style.cssText="position:absolute;z-index:9999",n.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),n.className="iScrollIndicator","h"==t?(e===!0&&(o.style.cssText+=";height:7px;left:2px;right:2px;bottom:0",n.style.height="100%"),o.className="iScrollHorizontalScrollbar"):(e===!0&&(o.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px",n.style.width="100%"),o.className="iScrollVerticalScrollbar"),o.style.cssText+=";overflow:hidden",s||(o.style.pointerEvents="none"),o.appendChild(n),o}function n(s,e){this.wrapper="string"==typeof e.el?i.querySelector(e.el):e.el,this.wrapperStyle=this.wrapper.style,this.indicator=this.wrapper.children[0],this.indicatorStyle=this.indicator.style,this.scroller=s,this.options={listenX:!0,listenY:!0,interactive:!1,resize:!0,defaultScrollbars:!1,shrink:!1,fade:!1,speedRatioX:0,speedRatioY:0};for(var o in e)this.options[o]=e[o];if(this.sizeRatioX=1,this.sizeRatioY=1,this.maxPosX=0,this.maxPosY=0,this.options.interactive&&(this.options.disableTouch||(h.addEvent(this.indicator,"touchstart",this),h.addEvent(t,"touchend",this)),this.options.disablePointer||(h.addEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.addEvent(t,h.prefixPointerEvent("pointerup"),this)),this.options.disableMouse||(h.addEvent(this.indicator,"mousedown",this),h.addEvent(t,"mouseup",this))),this.options.fade){this.wrapperStyle[h.style.transform]=this.scroller.translateZ;var n=h.style.transitionDuration;if(!n)return;this.wrapperStyle[n]=h.isBadAndroid?"0.0001ms":"0ms";var a=this;h.isBadAndroid&&r(function(){"0.0001ms"===a.wrapperStyle[n]&&(a.wrapperStyle[n]="0s")}),this.wrapperStyle.opacity="0"}}var r=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(i){t.setTimeout(i,1e3/60)},h=function(){function e(t){return r!==!1&&(""===r?t:r+t.charAt(0).toUpperCase()+t.substr(1))}var o={},n=i.createElement("div").style,r=function(){for(var t,i=["t","webkitT","MozT","msT","OT"],s=0,e=i.length;s<e;s++)if(t=i[s]+"ransform",t in n)return i[s].substr(0,i[s].length-1);return!1}();o.getTime=Date.now||function(){return(new Date).getTime()},o.extend=function(t,i){for(var s in i)t[s]=i[s]},o.addEvent=function(t,i,s,e){t.addEventListener(i,s,!!e)},o.removeEvent=function(t,i,s,e){t.removeEventListener(i,s,!!e)},o.prefixPointerEvent=function(i){return t.MSPointerEvent?"MSPointer"+i.charAt(7).toUpperCase()+i.substr(8):i},o.momentum=function(t,i,e,o,n,r){var h,a,l=t-i,c=s.abs(l)/e;return r=void 0===r?6e-4:r,h=t+c*c/(2*r)*(l<0?-1:1),a=c/r,h<o?(h=n?o-n/2.5*(c/8):o,l=s.abs(h-t),a=l/c):h>0&&(h=n?n/2.5*(c/8):0,l=s.abs(t)+h,a=l/c),{destination:s.round(h),duration:a}};var h=e("transform");return o.extend(o,{hasTransform:h!==!1,hasPerspective:e("perspective")in n,hasTouch:"ontouchstart"in t,hasPointer:!(!t.PointerEvent&&!t.MSPointerEvent),hasTransition:e("transition")in n}),o.isBadAndroid=function(){var i=t.navigator.appVersion;if(/Android/.test(i)&&!/Chrome\/\d/.test(i)){var s=i.match(/Safari\/(\d+.\d)/);return!(s&&"object"==typeof s&&s.length>=2)||parseFloat(s[1])<535.19}return!1}(),o.extend(o.style={},{transform:h,transitionTimingFunction:e("transitionTimingFunction"),transitionDuration:e("transitionDuration"),transitionDelay:e("transitionDelay"),transformOrigin:e("transformOrigin"),touchAction:e("touchAction")}),o.hasClass=function(t,i){var s=new RegExp("(^|\\s)"+i+"(\\s|$)");return s.test(t.className)},o.addClass=function(t,i){if(!o.hasClass(t,i)){var s=t.className.split(" ");s.push(i),t.className=s.join(" ")}},o.removeClass=function(t,i){if(o.hasClass(t,i)){var s=new RegExp("(^|\\s)"+i+"(\\s|$)","g");t.className=t.className.replace(s," ")}},o.offset=function(t){for(var i=-t.offsetLeft,s=-t.offsetTop;t=t.offsetParent;)i-=t.offsetLeft,s-=t.offsetTop;return{left:i,top:s}},o.preventDefaultException=function(t,i){for(var s in i)if(i[s].test(t[s]))return!0;return!1},o.extend(o.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3}),o.extend(o.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(t){return t*(2-t)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(t){return s.sqrt(1- --t*t)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(t){var i=4;return(t-=1)*t*((i+1)*t+i)+1}},bounce:{style:"",fn:function(t){return(t/=1)<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}},elastic:{style:"",fn:function(t){var i=.22,e=.4;return 0===t?0:1==t?1:e*s.pow(2,-10*t)*s.sin((t-i/4)*(2*s.PI)/i)+1}}}),o.tap=function(t,s){var e=i.createEvent("Event");e.initEvent(s,!0,!0),e.pageX=t.pageX,e.pageY=t.pageY,t.target.dispatchEvent(e)},o.click=function(s){var e,o=s.target;/(SELECT|INPUT|TEXTAREA)/i.test(o.tagName)||(e=i.createEvent(t.MouseEvent?"MouseEvents":"Event"),e.initEvent("click",!0,!0),e.view=s.view||t,e.detail=1,e.screenX=o.screenX||0,e.screenY=o.screenY||0,e.clientX=o.clientX||0,e.clientY=o.clientY||0,e.ctrlKey=!!s.ctrlKey,e.altKey=!!s.altKey,e.shiftKey=!!s.shiftKey,e.metaKey=!!s.metaKey,e.button=0,e.relatedTarget=null,e._constructed=!0,o.dispatchEvent(e))},o.getTouchAction=function(t,i){var s="none";return"vertical"===t?s="pan-y":"horizontal"===t&&(s="pan-x"),i&&"none"!=s&&(s+=" pinch-zoom"),s},o.getRect=function(t){if(t instanceof SVGElement){var i=t.getBoundingClientRect();return{top:i.top,left:i.left,width:i.width,height:i.height}}return{top:t.offsetTop,left:t.offsetLeft,width:t.offsetWidth,height:t.offsetHeight}},o}();e.prototype={version:"5.2.0-snapshot",_init:function(){this._initEvents(),(this.options.scrollbars||this.options.indicators)&&this._initIndicators(),this.options.mouseWheel&&this._initWheel(),this.options.snap&&this._initSnap(),this.options.keyBindings&&this._initKeys()},destroy:function(){this._initEvents(!0),clearTimeout(this.resizeTimeout),this.resizeTimeout=null,this._execEvent("destroy")},_transitionEnd:function(t){t.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,this._execEvent("scrollEnd")))},_start:function(t){if(1!=h.eventType[t.type]){var i;if(i=t.which?t.button:t.button<2?0:4==t.button?1:2,0!==i)return}if(this.enabled&&(!this.initiated||h.eventType[t.type]===this.initiated)){!this.options.preventDefault||h.isBadAndroid||h.preventDefaultException(t.target,this.options.preventDefaultException)||t.preventDefault();var e,o=t.touches?t.touches[0]:t;this.initiated=h.eventType[t.type],this.moved=!1,this.distX=0,this.distY=0,this.directionX=0,this.directionY=0,this.directionLocked=0,this.startTime=h.getTime(),this.options.useTransition&&this.isInTransition?(this._transitionTime(),this.isInTransition=!1,e=this.getComputedPosition(),this._translate(s.round(e.x),s.round(e.y)),this._execEvent("scrollEnd")):!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd")),this.startX=this.x,this.startY=this.y,this.absStartX=this.x,this.absStartY=this.y,this.pointX=o.pageX,this.pointY=o.pageY,this._execEvent("beforeScrollStart")}},_move:function(t){if(this.enabled&&h.eventType[t.type]===this.initiated){this.options.preventDefault&&t.preventDefault();var i,e,o,n,r=t.touches?t.touches[0]:t,a=r.pageX-this.pointX,l=r.pageY-this.pointY,c=h.getTime();if(this.pointX=r.pageX,this.pointY=r.pageY,this.distX+=a,this.distY+=l,o=s.abs(this.distX),n=s.abs(this.distY),!(c-this.endTime>300&&o<10&&n<10)){if(this.directionLocked||this.options.freeScroll||(o>n+this.options.directionLockThreshold?this.directionLocked="h":n>=o+this.options.directionLockThreshold?this.directionLocked="v":this.directionLocked="n"),"h"==this.directionLocked){if("vertical"==this.options.eventPassthrough)t.preventDefault();else if("horizontal"==this.options.eventPassthrough)return void(this.initiated=!1);l=0}else if("v"==this.directionLocked){if("horizontal"==this.options.eventPassthrough)t.preventDefault();else if("vertical"==this.options.eventPassthrough)return void(this.initiated=!1);a=0}a=this.hasHorizontalScroll?a:0,l=this.hasVerticalScroll?l:0,i=this.x+a,e=this.y+l,(i>0||i<this.maxScrollX)&&(i=this.options.bounce?this.x+a/3:i>0?0:this.maxScrollX),(e>0||e<this.maxScrollY)&&(e=this.options.bounce?this.y+l/3:e>0?0:this.maxScrollY),this.directionX=a>0?-1:a<0?1:0,this.directionY=l>0?-1:l<0?1:0,this.moved||this._execEvent("scrollStart"),this.moved=!0,this._translate(i,e),c-this.startTime>300&&(this.startTime=c,this.startX=this.x,this.startY=this.y,1==this.options.probeType&&this._execEvent("scroll")),this.options.probeType>1&&this._execEvent("scroll")}}},_end:function(t){if(this.enabled&&h.eventType[t.type]===this.initiated){this.options.preventDefault&&!h.preventDefaultException(t.target,this.options.preventDefaultException)&&t.preventDefault();var i,e,o=(t.changedTouches?t.changedTouches[0]:t,h.getTime()-this.startTime),n=s.round(this.x),r=s.round(this.y),a=s.abs(n-this.startX),l=s.abs(r-this.startY),c=0,p="";if(this.isInTransition=0,this.initiated=0,this.endTime=h.getTime(),!this.resetPosition(this.options.bounceTime)){if(this.scrollTo(n,r),!this.moved)return this.options.tap&&h.tap(t,this.options.tap),this.options.click&&h.click(t),void this._execEvent("scrollCancel");if(this._events.flick&&o<200&&a<100&&l<100)return void this._execEvent("flick");if(this.options.momentum&&o<300&&(i=this.hasHorizontalScroll?h.momentum(this.x,this.startX,o,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:n,duration:0},e=this.hasVerticalScroll?h.momentum(this.y,this.startY,o,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:r,duration:0},n=i.destination,r=e.destination,c=s.max(i.duration,e.duration),this.isInTransition=1),this.options.snap){var d=this._nearestSnap(n,r);this.currentPage=d,c=this.options.snapSpeed||s.max(s.max(s.min(s.abs(n-d.x),1e3),s.min(s.abs(r-d.y),1e3)),300),n=d.x,r=d.y,this.directionX=0,this.directionY=0,p=this.options.bounceEasing}return n!=this.x||r!=this.y?((n>0||n<this.maxScrollX||r>0||r<this.maxScrollY)&&(p=h.ease.quadratic),void this.scrollTo(n,r,c,p)):void this._execEvent("scrollEnd")}}},_resize:function(){var t=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){t.refresh()},this.options.resizePolling)},resetPosition:function(t){var i=this.x,s=this.y;return t=t||0,!this.hasHorizontalScroll||this.x>0?i=0:this.x<this.maxScrollX&&(i=this.maxScrollX),!this.hasVerticalScroll||this.y>0?s=0:this.y<this.maxScrollY&&(s=this.maxScrollY),(i!=this.x||s!=this.y)&&(this.scrollTo(i,s,t,this.options.bounceEasing),!0)},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){h.getRect(this.wrapper),this.wrapperWidth=this.wrapper.clientWidth,this.wrapperHeight=this.wrapper.clientHeight;var t=h.getRect(this.scroller);this.scrollerWidth=t.width,this.scrollerHeight=t.height,this.maxScrollX=this.wrapperWidth-this.scrollerWidth,this.maxScrollY=this.wrapperHeight-this.scrollerHeight,this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),this.endTime=0,this.directionX=0,this.directionY=0,h.hasPointer&&!this.options.disablePointer&&(this.wrapper.style[h.style.touchAction]=h.getTouchAction(this.options.eventPassthrough,!0),this.wrapper.style[h.style.touchAction]||(this.wrapper.style[h.style.touchAction]=h.getTouchAction(this.options.eventPassthrough,!1))),this.wrapperOffset=h.offset(this.wrapper),this._execEvent("refresh"),this.resetPosition()},on:function(t,i){this._events[t]||(this._events[t]=[]),this._events[t].push(i)},off:function(t,i){if(this._events[t]){var s=this._events[t].indexOf(i);s>-1&&this._events[t].splice(s,1)}},_execEvent:function(t){if(this._events[t]){var i=0,s=this._events[t].length;if(s)for(;i<s;i++)this._events[t][i].apply(this,[].slice.call(arguments,1))}},scrollBy:function(t,i,s,e){t=this.x+t,i=this.y+i,s=s||0,this.scrollTo(t,i,s,e)},scrollTo:function(t,i,s,e){e=e||h.ease.circular,this.isInTransition=this.options.useTransition&&s>0;var o=this.options.useTransition&&e.style;!s||o?(o&&(this._transitionTimingFunction(e.style),this._transitionTime(s)),this._translate(t,i)):this._animate(t,i,s,e.fn)},scrollToElement:function(t,i,e,o,n){if(t=t.nodeType?t:this.scroller.querySelector(t)){var r=h.offset(t);r.left-=this.wrapperOffset.left,r.top-=this.wrapperOffset.top;var a=h.getRect(t),l=h.getRect(this.wrapper);e===!0&&(e=s.round(a.width/2-l.width/2)),o===!0&&(o=s.round(a.height/2-l.height/2)),r.left-=e||0,r.top-=o||0,r.left=r.left>0?0:r.left<this.maxScrollX?this.maxScrollX:r.left,r.top=r.top>0?0:r.top<this.maxScrollY?this.maxScrollY:r.top,i=void 0===i||null===i||"auto"===i?s.max(s.abs(this.x-r.left),s.abs(this.y-r.top)):i,this.scrollTo(r.left,r.top,i,n)}},_transitionTime:function(t){if(this.options.useTransition){t=t||0;var i=h.style.transitionDuration;if(i){if(this.scrollerStyle[i]=t+"ms",!t&&h.isBadAndroid){this.scrollerStyle[i]="0.0001ms";var s=this;r(function(){"0.0001ms"===s.scrollerStyle[i]&&(s.scrollerStyle[i]="0s")})}if(this.indicators)for(var e=this.indicators.length;e--;)this.indicators[e].transitionTime(t)}}},_transitionTimingFunction:function(t){if(this.scrollerStyle[h.style.transitionTimingFunction]=t,this.indicators)for(var i=this.indicators.length;i--;)this.indicators[i].transitionTimingFunction(t)},_translate:function(t,i){if(this.options.useTransform?this.scrollerStyle[h.style.transform]="translate("+t+"px,"+i+"px)"+this.translateZ:(t=s.round(t),i=s.round(i),this.scrollerStyle.left=t+"px",this.scrollerStyle.top=i+"px"),this.x=t,this.y=i,this.indicators)for(var e=this.indicators.length;e--;)this.indicators[e].updatePosition()},_initEvents:function(i){var s=i?h.removeEvent:h.addEvent,e=this.options.bindToWrapper?this.wrapper:t;s(t,"orientationchange",this),s(t,"resize",this),this.options.click&&s(this.wrapper,"click",this,!0),this.options.disableMouse||(s(this.wrapper,"mousedown",this),s(e,"mousemove",this),s(e,"mousecancel",this),s(e,"mouseup",this)),h.hasPointer&&!this.options.disablePointer&&(s(this.wrapper,h.prefixPointerEvent("pointerdown"),this),s(e,h.prefixPointerEvent("pointermove"),this),s(e,h.prefixPointerEvent("pointercancel"),this),s(e,h.prefixPointerEvent("pointerup"),this)),h.hasTouch&&!this.options.disableTouch&&(s(this.wrapper,"touchstart",this),s(e,"touchmove",this),s(e,"touchcancel",this),s(e,"touchend",this)),s(this.scroller,"transitionend",this),s(this.scroller,"webkitTransitionEnd",this),s(this.scroller,"oTransitionEnd",this),s(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var i,s,e=t.getComputedStyle(this.scroller,null);return this.options.useTransform?(e=e[h.style.transform].split(")")[0].split(", "),i=+(e[12]||e[4]),s=+(e[13]||e[5])):(i=+e.left.replace(/[^-\d.]/g,""),s=+e.top.replace(/[^-\d.]/g,"")),{x:i,y:s}},_initIndicators:function(){function t(t){if(h.indicators)for(var i=h.indicators.length;i--;)t.call(h.indicators[i])}var i,s=this.options.interactiveScrollbars,e="string"!=typeof this.options.scrollbars,r=[],h=this;this.indicators=[],this.options.scrollbars&&(this.options.scrollY&&(i={el:o("v",s,this.options.scrollbars),interactive:s,defaultScrollbars:!0,customStyle:e,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenX:!1},this.wrapper.appendChild(i.el),r.push(i)),this.options.scrollX&&(i={el:o("h",s,this.options.scrollbars),interactive:s,defaultScrollbars:!0,customStyle:e,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenY:!1},this.wrapper.appendChild(i.el),r.push(i))),this.options.indicators&&(r=r.concat(this.options.indicators));for(var a=r.length;a--;)this.indicators.push(new n(this,r[a]));this.options.fadeScrollbars&&(this.on("scrollEnd",function(){t(function(){this.fade()})}),this.on("scrollCancel",function(){t(function(){this.fade()})}),this.on("scrollStart",function(){t(function(){this.fade(1)})}),this.on("beforeScrollStart",function(){t(function(){this.fade(1,!0)})})),this.on("refresh",function(){t(function(){this.refresh()})}),this.on("destroy",function(){t(function(){this.destroy()}),delete this.indicators})},_initWheel:function(){h.addEvent(this.wrapper,"wheel",this),h.addEvent(this.wrapper,"mousewheel",this),h.addEvent(this.wrapper,"DOMMouseScroll",this),this.on("destroy",function(){clearTimeout(this.wheelTimeout),this.wheelTimeout=null,h.removeEvent(this.wrapper,"wheel",this),h.removeEvent(this.wrapper,"mousewheel",this),h.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(t){if(this.enabled){t.preventDefault();var i,e,o,n,r=this;if(void 0===this.wheelTimeout&&r._execEvent("scrollStart"),clearTimeout(this.wheelTimeout),this.wheelTimeout=setTimeout(function(){r.options.snap||r._execEvent("scrollEnd"),r.wheelTimeout=void 0},400),"deltaX"in t)1===t.deltaMode?(i=-t.deltaX*this.options.mouseWheelSpeed,e=-t.deltaY*this.options.mouseWheelSpeed):(i=-t.deltaX,e=-t.deltaY);else if("wheelDeltaX"in t)i=t.wheelDeltaX/120*this.options.mouseWheelSpeed,e=t.wheelDeltaY/120*this.options.mouseWheelSpeed;else if("wheelDelta"in t)i=e=t.wheelDelta/120*this.options.mouseWheelSpeed;else{if(!("detail"in t))return;i=e=-t.detail/3*this.options.mouseWheelSpeed}if(i*=this.options.invertWheelDirection,e*=this.options.invertWheelDirection,this.hasVerticalScroll||(i=e,e=0),this.options.snap)return o=this.currentPage.pageX,n=this.currentPage.pageY,i>0?o--:i<0&&o++,e>0?n--:e<0&&n++,void this.goToPage(o,n);o=this.x+s.round(this.hasHorizontalScroll?i:0),n=this.y+s.round(this.hasVerticalScroll?e:0),this.directionX=i>0?-1:i<0?1:0,this.directionY=e>0?-1:e<0?1:0,o>0?o=0:o<this.maxScrollX&&(o=this.maxScrollX),n>0?n=0:n<this.maxScrollY&&(n=this.maxScrollY),this.scrollTo(o,n,0),this.options.probeType>1&&this._execEvent("scroll")}},_initSnap:function(){this.currentPage={},"string"==typeof this.options.snap&&(this.options.snap=this.scroller.querySelectorAll(this.options.snap)),this.on("refresh",function(){var t,i,e,o,n,r,a,l=0,c=0,p=0,d=this.options.snapStepX||this.wrapperWidth,u=this.options.snapStepY||this.wrapperHeight;if(this.pages=[],this.wrapperWidth&&this.wrapperHeight&&this.scrollerWidth&&this.scrollerHeight){if(this.options.snap===!0)for(e=s.round(d/2),o=s.round(u/2);p>-this.scrollerWidth;){for(this.pages[l]=[],t=0,n=0;n>-this.scrollerHeight;)this.pages[l][t]={x:s.max(p,this.maxScrollX),y:s.max(n,this.maxScrollY),width:d,height:u,cx:p-e,cy:n-o},n-=u,t++;p-=d,l++}else for(r=this.options.snap,t=r.length,i=-1;l<t;l++)a=h.getRect(r[l]),(0===l||a.left<=h.getRect(r[l-1]).left)&&(c=0,i++),this.pages[c]||(this.pages[c]=[]),p=s.max(-a.left,this.maxScrollX),n=s.max(-a.top,this.maxScrollY),e=p-s.round(a.width/2),o=n-s.round(a.height/2),this.pages[c][i]={x:p,y:n,width:a.width,height:a.height,cx:e,cy:o},p>this.maxScrollX&&c++;this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0),this.options.snapThreshold%1===0?(this.snapThresholdX=this.options.snapThreshold,this.snapThresholdY=this.options.snapThreshold):(this.snapThresholdX=s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold),this.snapThresholdY=s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold))}}),this.on("flick",function(){var t=this.options.snapSpeed||s.max(s.max(s.min(s.abs(this.x-this.startX),1e3),s.min(s.abs(this.y-this.startY),1e3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,t)})},_nearestSnap:function(t,i){if(!this.pages.length)return{x:0,y:0,pageX:0,pageY:0};var e=0,o=this.pages.length,n=0;if(s.abs(t-this.absStartX)<this.snapThresholdX&&s.abs(i-this.absStartY)<this.snapThresholdY)return this.currentPage;for(t>0?t=0:t<this.maxScrollX&&(t=this.maxScrollX),i>0?i=0:i<this.maxScrollY&&(i=this.maxScrollY);e<o;e++)if(t>=this.pages[e][0].cx){t=this.pages[e][0].x;break}for(o=this.pages[e].length;n<o;n++)if(i>=this.pages[0][n].cy){i=this.pages[0][n].y;break}return e==this.currentPage.pageX&&(e+=this.directionX,e<0?e=0:e>=this.pages.length&&(e=this.pages.length-1),t=this.pages[e][0].x),n==this.currentPage.pageY&&(n+=this.directionY,n<0?n=0:n>=this.pages[0].length&&(n=this.pages[0].length-1),i=this.pages[0][n].y),{x:t,y:i,pageX:e,pageY:n}},goToPage:function(t,i,e,o){o=o||this.options.bounceEasing,t>=this.pages.length?t=this.pages.length-1:t<0&&(t=0),i>=this.pages[t].length?i=this.pages[t].length-1:i<0&&(i=0);var n=this.pages[t][i].x,r=this.pages[t][i].y;e=void 0===e?this.options.snapSpeed||s.max(s.max(s.min(s.abs(n-this.x),1e3),s.min(s.abs(r-this.y),1e3)),300):e,this.currentPage={x:n,y:r,pageX:t,pageY:i},this.scrollTo(n,r,e,o)},next:function(t,i){var s=this.currentPage.pageX,e=this.currentPage.pageY;s++,s>=this.pages.length&&this.hasVerticalScroll&&(s=0,e++),this.goToPage(s,e,t,i)},prev:function(t,i){var s=this.currentPage.pageX,e=this.currentPage.pageY;s--,s<0&&this.hasVerticalScroll&&(s=0,e--),this.goToPage(s,e,t,i)},_initKeys:function(i){var s,e={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40};if("object"==typeof this.options.keyBindings)for(s in this.options.keyBindings)"string"==typeof this.options.keyBindings[s]&&(this.options.keyBindings[s]=this.options.keyBindings[s].toUpperCase().charCodeAt(0));else this.options.keyBindings={};for(s in e)this.options.keyBindings[s]=this.options.keyBindings[s]||e[s];h.addEvent(t,"keydown",this),this.on("destroy",function(){h.removeEvent(t,"keydown",this)})},_key:function(t){if(this.enabled){var i,e=this.options.snap,o=e?this.currentPage.pageX:this.x,n=e?this.currentPage.pageY:this.y,r=h.getTime(),a=this.keyTime||0,l=.25;switch(this.options.useTransition&&this.isInTransition&&(i=this.getComputedPosition(),this._translate(s.round(i.x),s.round(i.y)),this.isInTransition=!1),this.keyAcceleration=r-a<200?s.min(this.keyAcceleration+l,50):0,t.keyCode){case this.options.keyBindings.pageUp:this.hasHorizontalScroll&&!this.hasVerticalScroll?o+=e?1:this.wrapperWidth:n+=e?1:this.wrapperHeight;break;case this.options.keyBindings.pageDown:this.hasHorizontalScroll&&!this.hasVerticalScroll?o-=e?1:this.wrapperWidth:n-=e?1:this.wrapperHeight;break;case this.options.keyBindings.end:o=e?this.pages.length-1:this.maxScrollX,n=e?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:o=0,n=0;break;case this.options.keyBindings.left:o+=e?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:n+=e?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:o-=e?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:n-=e?1:5+this.keyAcceleration>>0;break;default:return}if(e)return void this.goToPage(o,n);o>0?(o=0,this.keyAcceleration=0):o<this.maxScrollX&&(o=this.maxScrollX,this.keyAcceleration=0),n>0?(n=0,this.keyAcceleration=0):n<this.maxScrollY&&(n=this.maxScrollY,this.keyAcceleration=0),this.scrollTo(o,n,0),this.keyTime=r}},_animate:function(t,i,s,e){function o(){var d,u,m,f=h.getTime();return f>=p?(n.isAnimating=!1,n._translate(t,i),void(n.resetPosition(n.options.bounceTime)||n._execEvent("scrollEnd"))):(f=(f-c)/s,m=e(f),d=(t-a)*m+a,u=(i-l)*m+l,n._translate(d,u),n.isAnimating&&r(o),void(3==n.options.probeType&&n._execEvent("scroll")))}var n=this,a=this.x,l=this.y,c=h.getTime(),p=c+s;this.isAnimating=!0,o()},handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(t);break;case"wheel":case"DOMMouseScroll":case"mousewheel":this._wheel(t);break;case"keydown":this._key(t);break;case"click":this.enabled&&!t._constructed&&(t.preventDefault(),t.stopPropagation())}}},n.prototype={handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t)}},destroy:function(){this.options.fadeScrollbars&&(clearTimeout(this.fadeTimeout),this.fadeTimeout=null),this.options.interactive&&(h.removeEvent(this.indicator,"touchstart",this),h.removeEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.removeEvent(this.indicator,"mousedown",this),h.removeEvent(t,"touchmove",this),h.removeEvent(t,h.prefixPointerEvent("pointermove"),this),h.removeEvent(t,"mousemove",this),h.removeEvent(t,"touchend",this),h.removeEvent(t,h.prefixPointerEvent("pointerup"),this),h.removeEvent(t,"mouseup",this)),this.options.defaultScrollbars&&this.wrapper.parentNode&&this.wrapper.parentNode.removeChild(this.wrapper)},_start:function(i){var s=i.touches?i.touches[0]:i;i.preventDefault(),i.stopPropagation(),this.transitionTime(),this.initiated=!0,this.moved=!1,this.lastPointX=s.pageX,this.lastPointY=s.pageY,this.startTime=h.getTime(),this.options.disableTouch||h.addEvent(t,"touchmove",this),this.options.disablePointer||h.addEvent(t,h.prefixPointerEvent("pointermove"),this),this.options.disableMouse||h.addEvent(t,"mousemove",this),this.scroller._execEvent("beforeScrollStart")},_move:function(t){var i,s,e,o,n=t.touches?t.touches[0]:t,r=h.getTime();this.moved||this.scroller._execEvent("scrollStart"),this.moved=!0,i=n.pageX-this.lastPointX,this.lastPointX=n.pageX,s=n.pageY-this.lastPointY,this.lastPointY=n.pageY,e=this.x+i,o=this.y+s,this._pos(e,o),1==this.scroller.options.probeType&&r-this.startTime>300?(this.startTime=r,this.scroller._execEvent("scroll")):this.scroller.options.probeType>1&&this.scroller._execEvent("scroll"),t.preventDefault(),t.stopPropagation()},_end:function(i){if(this.initiated){if(this.initiated=!1,i.preventDefault(),i.stopPropagation(),h.removeEvent(t,"touchmove",this),h.removeEvent(t,h.prefixPointerEvent("pointermove"),this),h.removeEvent(t,"mousemove",this),this.scroller.options.snap){var e=this.scroller._nearestSnap(this.scroller.x,this.scroller.y),o=this.options.snapSpeed||s.max(s.max(s.min(s.abs(this.scroller.x-e.x),1e3),s.min(s.abs(this.scroller.y-e.y),1e3)),300);this.scroller.x==e.x&&this.scroller.y==e.y||(this.scroller.directionX=0,this.scroller.directionY=0,this.scroller.currentPage=e,this.scroller.scrollTo(e.x,e.y,o,this.scroller.options.bounceEasing))}this.moved&&this.scroller._execEvent("scrollEnd")}},transitionTime:function(t){t=t||0;var i=h.style.transitionDuration;if(i&&(this.indicatorStyle[i]=t+"ms",!t&&h.isBadAndroid)){this.indicatorStyle[i]="0.0001ms";var s=this;r(function(){"0.0001ms"===s.indicatorStyle[i]&&(s.indicatorStyle[i]="0s")})}},transitionTimingFunction:function(t){this.indicatorStyle[h.style.transitionTimingFunction]=t},refresh:function(){this.transitionTime(),this.options.listenX&&!this.options.listenY?this.indicatorStyle.display=this.scroller.hasHorizontalScroll?"block":"none":this.options.listenY&&!this.options.listenX?this.indicatorStyle.display=this.scroller.hasVerticalScroll?"block":"none":this.indicatorStyle.display=this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none",this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll?(h.addClass(this.wrapper,"iScrollBothScrollbars"),h.removeClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="8px":this.wrapper.style.bottom="8px")):(h.removeClass(this.wrapper,"iScrollBothScrollbars"),h.addClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="2px":this.wrapper.style.bottom="2px")),h.getRect(this.wrapper),this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.options.resize?(this.indicatorWidth=s.max(s.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8),this.indicatorStyle.width=this.indicatorWidth+"px"):this.indicatorWidth=this.indicator.clientWidth,this.maxPosX=this.wrapperWidth-this.indicatorWidth,"clip"==this.options.shrink?(this.minBoundaryX=-this.indicatorWidth+8,this.maxBoundaryX=this.wrapperWidth-8):(this.minBoundaryX=0,this.maxBoundaryX=this.maxPosX),this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX),this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.options.resize?(this.indicatorHeight=s.max(s.round(this.wrapperHeight*this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8),this.indicatorStyle.height=this.indicatorHeight+"px"):this.indicatorHeight=this.indicator.clientHeight,this.maxPosY=this.wrapperHeight-this.indicatorHeight,"clip"==this.options.shrink?(this.minBoundaryY=-this.indicatorHeight+8,this.maxBoundaryY=this.wrapperHeight-8):(this.minBoundaryY=0,
this.maxBoundaryY=this.maxPosY),this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY),this.updatePosition()},updatePosition:function(){var t=this.options.listenX&&s.round(this.sizeRatioX*this.scroller.x)||0,i=this.options.listenY&&s.round(this.sizeRatioY*this.scroller.y)||0;this.options.ignoreBoundaries||(t<this.minBoundaryX?("scale"==this.options.shrink&&(this.width=s.max(this.indicatorWidth+t,8),this.indicatorStyle.width=this.width+"px"),t=this.minBoundaryX):t>this.maxBoundaryX?"scale"==this.options.shrink?(this.width=s.max(this.indicatorWidth-(t-this.maxPosX),8),this.indicatorStyle.width=this.width+"px",t=this.maxPosX+this.indicatorWidth-this.width):t=this.maxBoundaryX:"scale"==this.options.shrink&&this.width!=this.indicatorWidth&&(this.width=this.indicatorWidth,this.indicatorStyle.width=this.width+"px"),i<this.minBoundaryY?("scale"==this.options.shrink&&(this.height=s.max(this.indicatorHeight+3*i,8),this.indicatorStyle.height=this.height+"px"),i=this.minBoundaryY):i>this.maxBoundaryY?"scale"==this.options.shrink?(this.height=s.max(this.indicatorHeight-3*(i-this.maxPosY),8),this.indicatorStyle.height=this.height+"px",i=this.maxPosY+this.indicatorHeight-this.height):i=this.maxBoundaryY:"scale"==this.options.shrink&&this.height!=this.indicatorHeight&&(this.height=this.indicatorHeight,this.indicatorStyle.height=this.height+"px")),this.x=t,this.y=i,this.scroller.options.useTransform?this.indicatorStyle[h.style.transform]="translate("+t+"px,"+i+"px)"+this.scroller.translateZ:(this.indicatorStyle.left=t+"px",this.indicatorStyle.top=i+"px")},_pos:function(t,i){t<0?t=0:t>this.maxPosX&&(t=this.maxPosX),i<0?i=0:i>this.maxPosY&&(i=this.maxPosY),t=this.options.listenX?s.round(t/this.sizeRatioX):this.scroller.x,i=this.options.listenY?s.round(i/this.sizeRatioY):this.scroller.y,this.scroller.scrollTo(t,i)},fade:function(t,i){if(!i||this.visible){clearTimeout(this.fadeTimeout),this.fadeTimeout=null;var s=t?250:500,e=t?0:300;t=t?"1":"0",this.wrapperStyle[h.style.transitionDuration]=s+"ms",this.fadeTimeout=setTimeout(function(t){this.wrapperStyle.opacity=t,this.visible=+t}.bind(this,t),e)}}},e.utils=h,"undefined"!=typeof module&&module.exports?module.exports=e:"function"==typeof define&&define.amd?define(function(){return e}):t.IScroll=e}(window,document,Math);
/**
 * Created by lihong on 15-8-4.
 * 手机界面处理
 */
(function(){
    var echatPageService = {};
window.view = {
    SDK:true,
    media:6,
    urlList:[],//菜单列表
    fileMsgs:{},//记录文件消息信息，方便快速查找
    windowType:'',
    // windowType: "3",//手机对话窗口
    initViewEvent: function (chat) {
        if(view.chat)return;
        view.chat = chat;
        chat.Device.media = 6;
        chat.mobile = true;
        view.bindEvent(chat);
        view.checkView(chat);//变形、滑动
        view.bindMenu(chat);//TODO 菜单事件
        view.initScroll(chat);
        //识别网址并打开
        view.initInnerSite();
        //nativeApi交互
        view.initNativeAPI(chat);
        // view.loadLanguage(function () {
            // ECHATObjKeyMap["chatId"] && ECHATObjKeyMap["chatId"].initVisitor()
        // });
        //根据返回的配置设置广告
    },
    //todo 初始化页面语言
    loadLanguage: function (cb) {
        view.__nativeAPI("getLan", undefined, function (lan) {
            console.log('getLan callback')
            //加载语言文件，这和后端一致
            var lang = window.lanName = lan || navigator.language || navigator.browserLanguage || 'zh-CN';

            lang = lang.toLowerCase();
            window.supportLang = {
                zhcn: "../common/lang/langzhcn.js",
                enus: "../common/lang/langenus.js",
                fr: "../common/lang/langfr.js",
                ja: "../common/lang/langja.js",
                de: "../common/lang/langde.js",
                ko: "../common/lang/langko.js",
                zhtw: "../common/lang/langzhtw.js"
            }
            //这个用来加载资源，这里有支持语言的列表,需要在增加语种的时候也维护这里的列表
            var path = lang.replace('-', ''),
                langPf = lang.split('-')[0],
                langMap = {zhhk: 'zhtw', zhmo: 'zhtw', zhcht: 'zhtw', zhsg: 'zhcn', jp: 'ja'};
            if (!supportLang[path]) {
                if (langMap[path]) {//不支持的，找转换列表的
                    path = langMap[path];
                } else {
                    path = 'zhcn';//默认
                    for (var sl in supportLang) {//类似语种
                        if (sl.indexOf(langPf) == 0) {
                            path = sl
                            break;
                        }
                    }
                }
            }
            window.lanResName = path;

            view.chat.addJS(supportLang[path], function () {
                console.log('添加语言成功');
                cb && cb()
            })
        });
    },
    changeTitle: function () {
        // console.log('changeTitle sdk');

    },
    setDocumentTitle: function (from) {
        return;
        // console.log('setDocumentTitle  sdk');
        //显示提示
        if (!view.showChangeTitle || from == "c") {//from client访客操作
            //清除提示
            view.changeTitle(view.pageTitle);
            clearInterval(view.pageTitleTimer);
            view.pageTitleTimer = null;
        } else {
            //显示提示
            view.changeTitle(view.titles[0]);
            if (!view.pageTitleTimer) {
                var i = 1;
                view.pageTitleTimer = setInterval(function () {
                    view.changeTitle(view.titles[(i++) % 2]);
                }, 800);
            }
        }
    },
    initNativeAPI: function (chat) {
        UTIL.call(view, true);
        ECHATObjKeyMap["viewId"] = view;

        //native调用JS的方法
        window.callEchatJs = function (params) {
            console.log('callEchatJs:',params);
            try{
                var json;
                if (typeof params == 'string') {
                    json = JSON.parse(params + "");
                } else {
                    json = params;
                }
                json.functionName &&echatPageService[json.functionName] && echatPageService[json.functionName](json.value);
            }catch (e){
                console.log(e);
            }
        }
        var echatPageService = {
            closeChat:function (type) {
                // 跟访客点击我们的关闭按钮一样 0访客端弹出确认提示再关闭对话（默认）1访客端直接关闭对话
                chat.visitorCloseFunc(type == 1 ? 1 : 0);
            },
            switchSoundTip:function (type) {
                if(type==1){
                    chat.disableSoundTip = false
                }else if(type==0){
                    chat.disableSoundTip = true
                }
            }, /*params暂时没用*/
            triggerFile: function (params) {
                view.triggerFile(params);
            },
            voice:function (params) {
                var json;
                if (typeof params == 'string') {
                    json = JSON.parse(params + "");
                } else {
                    json = params;
                }
                var s = (json.db ? ('db:' + json.db + '</br>') : '') + (json.time ? ('time:' + json.time) : '')
                // $(".icon-record-sound").html((json.db ? ('db:' + json.db + '</br>') : '') + (json.time ? ('time:' + json.time) : ''));
                //超时未显示交互效果 直接发送
                if (json.type == 'db') {
                    var level;
                    if (json.db < 3) {
                        level = 0;
                    } else {
                        level = parseInt((json.db - 0 ) / 16);//0-100的范围分成6份
                        level = level > 6 ? 6 : level < 1 ? 1 : level;
                    }
                    $(".icon-record-sound").results[0].className = 'icon-record-sound icon icon-record-sound' + level;
                } else if (json.type == 'timeout') {
                    console.log('record-countdown', json.time);
                    //record-canceling如果有这个还返回倒计时说明出错了。canceling的时候是暂停了录音?
                    $("body").addClass('record-countdown');
                    $(".icon-record-countdown").html(json.time);
                } else if (json.type == 'success') {
                    alert(JSON.stringify(json))
                    //已经发送了 去除
                    view.endRecord && view.endRecord();
                }else{
                    alert(JSON.stringify(json))
                }
            },
            uploadType:function (type) {
                if(type) {
                    var fileType = 2;//默认为传文件
                    if(type=='record'){//视频
                        fileType = 4
                    }else if(type=='gallery'){//照片
                        fileType = 2
                    }else if(type=='voice'){//语言
                        fileType = 3;
                    }
                    var ipt = document.getElementById('uploadInput');
                    $(ipt).attr('filetype', fileType);
                }
            },
            location:function (params) {
                alert(JSON.stringify(params));
                var data = {
                    et:127,
                    locationX:params.latitude,//纬度
                    locationY:params.longitude,//经度
                    scale:parseInt(params.zoom||15),
                    label:params.title

                }
                view.chat.publish("visitorCommonEvent", data);
                //409692e555a9a66ca9a94f3b8b868d38
                view.chat.showLocation(data);
            }

        }

        //js调用native的方法
        function replaceHtml(content) {
            return content.replace(/<(?:.|\s)*?>/ig, "").substring(0,100);
        }
        //对话状态(未包含机器人状态)
        view.subscribe("__chatStatus",function (event,data) {
            // __nativeAPI('chatStatus',data)
        });
        //排队位置
        view.subscribe("__chatQueue",function (event,data) {
            // __nativeAPI('queuePostion',data)
        });
        //客服信息
        view.subscribe("__chatStaffInfo",function (event,data) {
            // __nativeAPI('chatStaffInfo',JSON.stringify(data))
        });
        //todo sdk 新消息不由H5处理 客服新消息(未包含系统消息)
        // view.subscribe("__newMsg",function (event,data) {
            //0 文本 1文件 2图片 3预约确认 4 5...
            // var m = data.m;
            // data.f == 's' && data.c && __nativeAPI('newMsg', m == 0 ? replaceHtml(data.c) : m == 1 ? '[file]' : m == 2 ? '[image]' : '');
        // });
       /* //访客从网页结束对话并关闭窗口
        view.subscribe("__visitorClose",function (event,data) {
            __nativeAPI('visitorClose')
        });*/
        //访客评价完毕
        view.subscribe("__evaluate",function (event,data) {
            __nativeAPI('visitorEvaluate',data)
        });
        //访客从网页隐藏对话
        view.subscribe("__visitorHide",function (event,data) {
            __nativeAPI('closeView');
        });


        /**
         * JS调用native的方法
         * @param name string类型
         * @param param string类型
         * @private
         */
        var __nativeAPI = view.__nativeAPI;
        //api ready
        // __nativeAPI('echatApiReady','1');

    },
    callbackIndex:0,
    __nativeAPI:function (name, param, callback) {
        if (!name) {
            return;
        }
        // console.log(arguments)
        try {
            var mutiParams = {
                "functionName": name
            };
            if(param){
                mutiParams.value = param;
            }
            if (callback && typeof callback == 'function') {
                mutiParams.callback = "callbackview_" + view.callbackIndex;
                echatPageService[mutiParams.callback] = function () {
                    console.log('callbackview_***' + mutiParams.callback,arguments);
                    callback.apply(callback, arguments);
                    window[mutiParams.callback] = null;
                }
                view.callbackIndex++;
            }
            if (!window.wkWebkit) {
                window.EchatJsBridge && EchatJsBridge.callEchatNative(JSON.stringify(mutiParams))
            }else{
                window.webkit && window.webkit.messageHandlers.callEchatNative.postMessage(JSON.stringify(mutiParams));
            }
        } catch (e) {
            // console.log(e.message);
        }
    },
    initInnerSite:function () {
        function backToChat() {
            if ($("#visitorSite").hasClass('show-site')) {
                setTimeout(function () {
                    //避免与外层返回网站冲突
                    $("#visitorSite").removeClass('show-site');
                }, 10);
                history.replaceState(null, document.title, location.href.split("#")[0]);
                //清空网站
                _$('visitorSite').innerHTML='';
            }
            if ($("#menuSite").hasClass('show-site')) {
                setTimeout(function () {
                    //避免与外层返回网站冲突
                    $("#menuSite").removeClass('show-site');
                }, 10);
                history.replaceState(null, document.title, location.href.split("#")[0]);
                //清空网站
                _$('menuSite').innerHTML='';
            }
            $("#mask").hide().off('click', backToChat);
            $("#footer").show();
        }

        view.hideURLSite = function () {
            // if($('.site-back').results.length>0){
                backToChat();
            // }
        }

        //返回对话
        $('#menuSite').on('click', '.menu-site-back-icon', function () {
            // console.log('menu-site-back');
            backToChat();
        });
        $('#visitorSite').on('click', '.site-back', function () {
            backToChat();
        });
        //返回事件一律隐藏网页窗口
        window.addEventListener("popstate", function () {
            backToChat()
        });
        var is360 = view.chat.companyId == 72;
        if(is360){
            $("#menuSite").addClass('can-scroll');
            $("#visitorSite").addClass('can-scroll');
        }
        $("#urlList").on('click','.list-url-item',function (e) {
            //配置的URL列表
            var a = this,data = view.urlList[a.getAttribute('data-index')];
            if(!data){
                return;
            }
            var title = data.title,href = data.url;
            if (!href)return;
            //推入历史记录
            if (history.pushState) {
                history.pushState({title: 'handle back'}, document.title, location.href.split("#")[0] + "#" + "TOSITE");
            }
            //设置参数
            href = view.getADURL(true,
                view.chat.paramChat.staffId?(data.openWindowParamList.concat(data.afterConnectParamList)):data.openWindowParamList,
                href, view.chat.paramChat, false);
            a.setAttribute('target', 'menuSiteIframe');
            view.showURLLink(title,href);
        });

        $('body').on("click",'a', function (e) {
            var a = this;
            //必须是消息列表里面的
            if ($.fn.contains(_$('list_his'), a) || $.fn.contains(_$('unread'), a) ) {
                var href = a.getAttribute('href');
                if (!href)return false;
                var target = a.getAttribute('target');
                //机器人回答等富文本内容,在业内展示
                if(target=='inner'||target=='menuSiteIframe'){
                    a.setAttribute('target', 'menuSiteIframe');
                    view.__nativeAPI('openUrl', {
                        url: href,
                        openType: 'default'
                    });
                    // return;
                }else if (target && _$(target)) {
                    // 比如下载文件
                    view.__nativeAPI('openUrl', {
                        url: href,
                        openType: 'default'
                    });
                    // return;
                }else {
                    view.__nativeAPI('openUrl', {
                        url: href,
                        openType: 'default'
                    });
                }
                e.preventDefault && e.preventDefault();
                return false;

            }
        });
        view.showURLLink = function (title,href,normalHeight) {
            view.__nativeAPI('openUrl', {
                url: href,
                openType: 'default'
            });
            return;

        }
    },
    //以chathandle实例调用
    setConfig: function (chat, msg,chatbox) {
        var datas = chatbox || (view.chat.isInRobot ? msg.robotSdkChatBox : msg.sdkChatBoxInfo);
        view.chat.showAvatar = datas.chatBoxStaffImgEnable == 1;
        if (!datas) {
            //没有配置 设置默认LOGO
            return ;//view.setLogo();
        }
        // 设置logo  目前没有LOGO
        view.setLogo(datas.chatLogoImg);
        //设置颜色
        var data = {
            chatColor: datas.chatColor||datas.chatThemeBackColor,
            ADThemeColor: datas.chatColor||datas.chatThemeBackColor,
            chatThemeTxtColor: datas.chatThemeTxtColor,
            chatStaffBackColor: datas.chatStaffBackColor,
            chatStaffTxtColor: datas.chatStaffTxtColor,
            chatVisitorBackColor: datas.chatVisitorBackColor,
            chatVisitorTxtColor: datas.chatVisitorTxtColor,
            timeColor: "#bdbdbd",
            inputBg: "#eeeeee",
            inputColor: "#333333",
            pageBg: "#ebebeb",
            pageColor: "#000000",
            inputBorder: "#dddddd",
            pageADBg: "#e1f0f5",//客服信息页面背景
            ADBg: "ffffff",//客服信息背景颜色
            ADColor: "#333333",
            footBorder: datas.chatColor//输入框上面的颜色设置为和主题色相同
        };

        (document.body || document.documentElement).style.display = "none";
        /*主题色:logo广告栏、发送按钮、*/
        var bg0 = chat.getCSSRule(".bg0");
        data.chatColor && (bg0.style.backgroundColor = data.chatColor);
        data.chatThemeTxtColor && (bg0.style.color = data.chatThemeTxtColor);

        // setColor(true,msg.robotPhoneChatBox||view.chat.getChatbox('robotPhoneChatBox'));
        setColor(false,msg.sdkChatBoxInfo||view.chat.getChatbox('sdkChatBoxInfo'));
        // view.chat.setChatbox('robotPhoneChatBox',msg.robotPhoneChatBox);
        view.chat.setChatbox('sdkChatBoxInfo',msg.sdkChatBoxInfo);
        function setColor(isRobot,datas) {
            if(!datas)return;
            /*客服发送信息 背景色*/
            var bg1 = chat.getCSSRule(isRobot ? ".bg10" : ".bg1");
            datas.chatStaffBackColor && (bg1.style.backgroundColor = datas.chatStaffBackColor);
            datas.chatStaffBackColor && (bg1.style.borderColor = datas.chatStaffBackColor);
            datas.chatStaffTxtColor && (bg1.style.color = datas.chatStaffTxtColor);
            /*客服尖角*/
            var staffAngle = chat.getCSSRule(isRobot ? ".border-color-angle10" : ".border-color-angle1");
            datas.chatStaffBackColor && (staffAngle.style.borderColor = (datas.chatStaffBackColor + " " + datas.chatStaffBackColor + " transparent transparent"));


            /*访客文字 背景色*/
            var bg3 = chat.getCSSRule(isRobot ? ".bg30" : ".bg3");
            datas.chatVisitorBackColor && (bg3.style.backgroundColor = datas.chatVisitorBackColor);
            datas.chatVisitorBackColor && (bg3.style.borderColor = datas.chatVisitorBackColor);
            datas.chatVisitorTxtColor && (bg3.style.color = datas.chatVisitorTxtColor);

            /*访客尖角*/
            var visitorAngle = chat.getCSSRule(isRobot ? ".border-color-angle20" : ".border-color-angle2");
            datas.chatVisitorBackColor && (visitorAngle.style.borderColor = (datas.chatVisitorBackColor + " " + data.pageBg + " " + data.pageBg + " " + datas.chatVisitorBackColor));

            /* 系统消息*/
            var sysMsg = chat.getCSSRule(isRobot ? ".msg-info0" : ".msg-info");
            datas.sysMsgBackground && (sysMsg.style.backgroundColor = datas.sysMsgBackground);
            datas.sysMsgFontColor && (sysMsg.style.color = datas.sysMsgFontColor);
        }
        /*客服信息标签文字颜色*/
        var ADThemeColor = chat.getCSSRule(".color0");
        data.ADThemeColor && (ADThemeColor.style.color = data.ADThemeColor);

        /* 输入框与工具栏边框间隔*/
        // var footBorder = chat.getCSSRule(".border-t1");
        // data.footBorder && (footBorder.style.borderTopColor = data.footBorder);


/*        if (datas.enableMinimizeBtn != 1 || typeof window.EchatJsBridge == 'undefined') {
            // $(".header-btn-back").hide();//.off("click tap mousemover mouseout").remove();
        }else{
            // $(".header-btn-back").show();
            // $(".header-back-img").attr('src', (datas.minimizeBtnImg||'/res/imgs/mini.png').replace(/^http:/i, view.chat.needHttps || 'http:'));
        }
        if(datas.enableCloseBtn!=1){
            // $(".header-btn-close").hide();//.off("click tap mousemover mouseout").remove();
        }else{
            // $(".header-btn-close").show();
            // $(".header-close-img").attr('src',(datas.chatEndBtnImg||'/res/imgs/end.png').replace(/^http:/i, view.chat.needHttps || 'http:'));
        }*/
        /*设置标题展示enableTop*/
        $("#enter_btn").addClass("hide");
        /*设置URL列表*/
        if(datas.sdkUrlList){
            var urlList = JSON.parse(datas.sdkUrlList);
            if (!urlList || urlList.length == 0) {
                view.urlList = new Array(5);
            }else{
                $('.menu-url').remove();//避免重复设置
                var html = '',echatMenuLength = 5;
                var listdot = ['<li class="dot-list-li hover radius4">0</li>'], p = 0;
                view.urlList = new Array(5).concat(urlList);
                for (var i = 0; i < urlList.length; i++) {
                    if (view.chat.needHttps) {
                        urlList[i].url = urlList[i].url.replace(/^http:/i, view.chat.needHttps);
                        urlList[i].icon = urlList[i].icon.replace(/^http:/i, view.chat.needHttps);
                    }
                    html +=
                        '<li class="list-url-item menu-url" data-index="' + (i + 5) + '">'
                        + '<div class="list-url-img">'
                        + '<div class="menu-item-icon"><img src="' + urlList[i].icon + '" class="list-url-icon" /></div>'
                        + '</div>'
                        + '<div class="list-url-title">' + urlList[i].title + '</div>'
                        + '</li>';
                    /*html += '<li class="list-url-item" data-index="'+i+'"><div class="list-url-img"><img src="' + urlList[i].icon
                        + '" class="list-url-icon" /></div><span class="list-url-title">' + urlList[i].title + '</span></li>'*/
                    if (i == 2) {
                        //列表里面原先有系统菜单内容
                        $(".url-list-page").append(html);
                        html = '<ul class="clearfix url-list-page flex1">';
                        listdot.push("<li class='dot-list-li radius4'>" + p + "</li>");
                    } else if (i == 3) {
                        p++;
                    } else if (i > 4 && (echatMenuLength + i) % 8 == 0) {
                        p++;
                        html += '</ul><ul class="clearfix url-list-page flex1">';
                        listdot.push("<li class='dot-list-li radius4'>" + p + "</li>");
                    }
                }
                html += '</ul></div>';
                $("#urlListWrap").css({
                    width: 100 * (p + 1) + '%'
                });
                // $('.url-list-page').append(html);
                $(".url-list-page").append(html).css({
                    width: 100.0 / (p + 1) + '%'
                });

                if ((urlList.length + echatMenuLength) < 5) {
                    //只有一排
                    $("#urlList").css({
                        height:'114px',
                        bottom:view.chat.isInRobot?'-138px':'-134px'
                    })
                }else{
                    $("#urlList").css({
                        height:'232px',
                        bottom:'-232px'
                    })
                }
                var page = 0;
                function endCB(delta) {
                    if (delta == 0)return;
                    page = page + delta;
                    $(".dot-list-li", _$("url_dot_list")).removeClass("hover");
                    $($(".dot-list-li", _$("url_dot_list")).removeClass("hover").results[page]).addClass("hover");
                }
                if(p==0){
                    $("#url_dot_list").hide()
                }else{
                    _$("url_dot_list").innerHTML = listdot.join("");
                    view.chat.pageSlide("#urlListWrap", endCB);
                }
                view.hideMenus();
             /*   setTimeout(function () {
                    if (!view.chat.hasLeaveMsg && !view.chat.companyOff) {
                        view.showURLList('urlList');
                    }
                }, 600);*/
            }
        }else{
            view.urlList = [];//sdk 有菜单
        }
        (document.body || document.documentElement).style.display = "block";
        if (view.chat.isIOS) {
            _$s('body')[0].className += ' ios';
        }
    },
    setUrlHeight:function () {
        var listItems = $(".list-url-item");
        var visibleLength = 0;
        $.each(function( i, item){

        })
    },
    setLogo: function (logo) {
        return;
    },
    //根据参数获取右侧广告栏的地址
    /**
     *
     * @param enable 是否开启广告栏传参数
     * @param json
     * @param url
     * @param paramChat
     * @param hash
     * @param lan 来自地址栏的语言,开启传参数就加
     * @returns {*}
     */
    getADURL: function (enable, json, url, paramChat, hash, lan) {
        if (!url) {
            return '';
        }
        if (!enable || !json) {
            return url;
        }
        var paramStr = '',
            search = url.split("#"),
            tempHash = search[1] || "",
            tempURL = search[0],
            paramNum = tempURL.indexOf("?") == -1 ? 0 : 1,
            firstChar = '?';
        if (!hash) {

        } else {
            //hash链接参数的时候第一个字符不用问号
            firstChar = '';
            if (!tempHash) {
                paramNum = 0;
            } else {
                paramNum = 1;
            }
        }
        //初始化参数只要有?就认为是一个 需要用& 链接参数
        if (typeof json == "string") {
            json = JSON.parse(json);
        }
        /*保证参数顺序*/
        var allParam= [
            'companyId',
            'visitorId',
            'echatTag',
            'lan',
            'country',
            'province',
            'city',
            'searcher',
            'keyword',
            'metaData',
            'referrer',
            'firstUrl',
            'chatPage',
            'chatPageTitle',
            'eventId',
            /*对话开始后的*/
            'staffId',
            'staffName',
            'staffPhoto',
            'talkId'];
        var len ,i,j,name,pName;
        if (view.chat.isArray(json) && json.length) {
            len = json.length;
            for (j = 0; j < allParam.length; j++) {
                name = allParam[j];
                //如果对话没截图 就不加后面四个对话接通才有的参数
                if (name == 'staffId' && !paramChat.staffId) {
                    break;
                }
                for (i = 0; i < len; i++) {
                    pName = json[i].paramName;
                    if (pName == 'metaData' || pName == 'metadata') {
                        pName = 'metaData';
                    }
                    if (pName == name) {
                        //大小写 中途有改过,都认可  有metaData需要同时加上myData
                        if (pName == 'metaData') {
                            // if (paramChat[pName]) {
                            paramStr += (paramNum != 0 ? '&' : firstChar) + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                            paramNum++;
                            // }
                            pName = 'myData';
                            // if (paramChat[pName]) {
                            paramStr += (paramNum != 0 ? '&' : firstChar) + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                            paramNum++;

                            pName = 'info';
                            if (paramChat[pName]) {
                                paramStr += (paramNum != 0 ? '&' : firstChar) + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                                paramNum++;
                            }
                        } else {
                            paramStr += (paramNum != 0 ? '&' : firstChar) + pName + "=" + encodeURIComponent(paramChat[pName] || '');
                            paramNum++;
                        }
                        break;
                    }
                }
            }
        }
        if (!hash) {
            return tempURL + paramStr + (tempHash ? ('#' + tempHash) : '');
        } else {
            return url + "#" + tempHash + paramStr;
        }
    },
    setInnerAD: function (msg) {
        var data = view.chat.isInRobot ? msg.robotSdkChatBox : msg.sdkChatBoxInfo, c;
        if (data.chatBoxInnerAdType == 2) {
            (c = data.chatBoxInnerAdContent ) && $("#list_msg").append('<li class="clearfix innerAD"><div>' + c + '</div></li>');
        } else if (data.chatBoxInnerAdType == 3) {
            c = data.chatBoxInnerAdImg;
            if (c && view.chat.needHttps) {
                c = c.replace(/^http:/, view.chat.needHttps);
            }
            c && $("#list_msg").append('<li class="clearfix innerAD"><img style="height:' + data.chatBoxAdHeight + 'px" src="' + c + '"/></li>');
        } else {
            c = data.chatBoxInnerAdUrl;
            if (c && view.chat.needHttps) {
                c = c.replace(/^http:/, view.chat.needHttps);
            }
            c && (data.chatBoxAdHeight!='0')&& $("#list_msg").append('<li class="clearfix innerAD"><iframe class="ps-child" height="' + (data.chatBoxAdHeight) + '" border="0" allowtransparency="true" scrolling="no" frameborder="0" style="width:100%;height:'
                + (data.chatBoxAdHeight) + 'px" src="' + view.chat.addEchatInnerFrameParam(c) + '" ></iframe></li>');
        }
    },
    /**
     * 离线时隐藏客服信息界面
     */
    hideStaffInfo:function () {
        // view.hasStaffInfo = false;
        // $("#to_detail").hide();
    },
    initServiceInfo: function (that, msg) {
        view.hasStaffInfo = true;
        var staffName = that.staffName || "";
        $("#staffName").html('<span>' + staffName + '</span>');
        if (msg.staffPhone) {
            // $("#staffName").attr('href', "tel:" + msg.staffPhone).addClass("icon-tel");
            $(".menu-phone-a").attr('href','tel:'+ msg.staffPhone);
            $(".menu-phone").removeClass('hide');
        }else{
            $(".menu-phone").addClass('hide');
        }
        var data = {
            name: staffName || lanRes.onlineService,
            url: view.chat.staffImg,
            tel: msg.staffPhone,
            list: [
                {
                    name: lanRes.intro,
                    content: msg.staffInfo
                },
                {name: lanRes.telephone, content: msg.staffPhone}
            ]
        }
        if (view.chat.needHttps && data.url) {
            data.url = data.url.replace(/^http:/, view.chat.needHttps);
        }
        //设置头像两侧按钮高度。
        var image = new Image();
        image.onload = function () {
            var h = this.height;
            h = h > 140 ? 140 : h;
            $(".flex1", _$("portrait")).css("height", h + "px");
        }
        $("#portrait").html(' <div class="flex1"><a id="back_chat"><div class="portrait-back"></div><div>' + lanRes.backToChat + '</div></a></div>' +
            '<div id="service_icon" class=""><div class="portrait-wrap"><img src="'
            + data.url + '" ></div><h2 class="tc portrait-name">'
            + data.name + '</h2></div><div class="flex1">'
            + (data.tel ? ('<a href="tel:' + data.tel + '"><div class="portrait-tel" ></div><div>' + lanRes.makeCall + '</div></a>') : '')
            + '</div>');
        image.src = data.url;
        var html = [], html2 = ['<section class="info bg6">'];
        var list = data.list;
        for (var i = 0; i < list.length; i++) {
            if (!list[i].content) continue
            if (list[i].name == lanRes.telephone) {
                html2.push('<div class="info-item"><label class="info-name inline color0">');
                html2.push(list[i].name);
                html2.push('</label><a class="info-content inline" href="tel:' + data.tel + '">');
                html2.push(list[i].content);
                html2.push('</a></div>');
            } else {
                if (list[i].content.length > 18) {
                    html.push('<section class="info bg6"><div class="info-item"><label class="info-name block color0">');
                    html.push(list[i].name);
                    html.push('</label><div class="info-content block">');
                    html.push(list[i].content);
                    html.push('</div></div></section>');
                } else {
                    html2.push('<div class="info-item"><label class="info-name inline color0">');
                    html2.push(list[i].name);
                    html2.push('</label><div class="info-content inline">');
                    html2.push(list[i].content);
                    html2.push('</div></div>');
                }
            }
        }
        html2.push('<section>');
        $("#info_list").html(html.join("") + html2.join(""));
        setTimeout(function () {
            view.infoScroll.refresh();
            _$("back_chat").addEventListener("tap", function () {
                view.backToChat();
            })
        }, 150)
    },
    initRobotInfo: function (that, msg) {
        var staffName = $("#staffName");
        staffName.html(view.chat.staffName || lanRes.robotName);
    },
    //showInfoTip: function (tip) {
    //    var id = "info" + (new Date().getTime());
    //    $("#list_msg").append('<li id="' + id + '" class="clearfix"><div class="msg-info">' + tip + '</div></li>');
    //    view.scrollToBottom(id);
    //},
    afterSend: function () {
        view.textInputChange();
        $(".menu-more-robot").show();
        $("#enter_btn").addClass('hide');
        return view.hideMenus(null, true);

    },
    toLeaveMessage: function () {
        view.leaveScroll = new IScroll('#container_leave', {
            preventDefault: false,
            useTransform: false,
            tap: true, click: true
        });
        setTimeout(function () {
            view.leaveScroll.refresh();
        }, 100);
    },
    initScroll: function () {
        view.chatScroll = new IScroll('#content', {
            preventDefault: false,
            preventDefaultException:/^(A|PRE|INPUT|TEXTAREA|BUTTON|SELECT)$/,
            useTransform: false,
            tap: true, click: true
            // useTransition:false,
            // mouseWheel: true,
        });
/*        setTimeout(function () {

            //only in scroll-probe.js edition
            // view.chatScroll.on('scroll', function (e) {
               /!* if (this.y < 20 && view.chat.hasPreHis) {
                    view.chat.loadHistory();
                }*!/
            // });
            view.chatScroll.on('scrollStart', function (e) {
                // console.log(view.chatScroll.y)
                if (view.chatScroll.y > -1 && view.chat.hasPreHis) {
                    view.chat.loadHistory();
                }
            });
        },1000);*/
        view.infoScroll = new IScroll("#detail", {
            // preventDefault: false,
            useTransform: false,
            tap: true, click: true
        });
        //防止页面弹性滚动
        document.addEventListener('touchmove', function (e) {
            var t = e.target;
            if (t.tagName=='A'||t.id == 'textInput' || t.id == 'html_input' || t.id == 'html_pre_input'||$(t).hasClass('menu-item')||$(t).hasClass('menu-item-icon')) {
                //输入框可滚动
                return true;
            }
            // e.preventDefault&&e.preventDefault();
            e.preventDefault && e.preventDefault();
        }, false);
    },
    enter: function (e) {
        var e = e || window.event;
        var currKey = e.keyCode || e.which || e.charCode || 0;
        if (currKey == 13) {
            //发送消息
            view.chat.publish("_sendMsg");
            e.preventDefault && e.preventDefault();
            return false;
        }
    },
    bindEvent: function (that) {
        //发送消息快捷键,界面进来就绑定。可根据状态操作。
        // $("#textInput").on("keydown", view.enter);
        $("#textInput").on('input',function () {
            view.chat.handleInputLength();
        })
        $("#content").on("swipeLeft", function (e) {
            if ($.fn.contains(_$("toolbar"), e.target)) {
                return;
            }
            view.showDetailPage();
            view.chat.getInputDocBody().blur();
        }).on("tap", function (e) {
            view.chat.getInputDocBody().blur();
        }).on("tap", ".staff-icons", function (e) {
            view.showDetailPage();
            view.chat.getInputDocBody().blur();
        }).on("tap", ".msg-voice", function (e) {
            play('voice', {
                type: 'play',
                url: $(this).attr('data')
            });
        }).on("tap", ".msg-video", function (e) {
            play('video', {
                type: 'play',
                url: $(this).attr('data')
            });
        }).on("tap", ".file-resend", function (e) {
            var identity = $(this).attr('identity');
            var msg = view.fileMsgs[identity];
            identity && view.chat.publish('__callNative', {
                functionName: 'resendFile',
                value: { identityKey: msg.fileIdentity, clientFileId: msg.clientFileId }
            });
           $(this).html('重发中...');
        }).on("tap", ".file-load-btn", function (e) {
            var el = this, identity = $(this).attr('identity'),
            msg = view.fileMsgs[identity];
            if(!msg){
                return;
            }
            if (msg.loadStatus == 0 || msg.loadStatus == 3) {//点击下载
                msg.loadStatus = 2;
                view.chat.publish('__callNative', {
                    functionName: 'downloadFile',
                    value: { identityKey: msg.fileIdentity, isNeedOpen: 0, downloadType: 0 }
                });
                el.className = 'file-load-btn file-load-status2';
                el.innerHTML ='文件下载中，点击取消下载';
            } else if (msg.loadStatus == 2) {//取消下载
                view.chat.publish('__callNative', {
                    functionName: 'cancelDownloadFile',
                    value: { identityKey: msg.fileIdentity }
                });
                msg.loadStatus = 3;
                el.className = 'file-load-btn file-load-status3';
                el.innerHTML ='文件下载取消，点击重新下载';
            }

        });
        var playing = false;

        function play(type, param) {
            if (playing)return;
            playing = true;
            view.__nativeAPI(type, param);
            setTimeout(function () {
                playing = false;
            }, 1000);
        }
        $("#container").on("click", ".msg-img", function (e) {
            setTimeout(function () {
                view.showImg.call(this, view.chat, e);
            },500);//iOS QQ浏览器会有问题 点开了又自动关闭
        })
        $("#detail").on("swipeRight", function (e) {
            view.backToChat();
        });
        $("#to_detail").bind("click", function () {
            view.showDetailPage.call(that, this);
        });

        $(".header-btn-back").on("click", function () {
            view.chat.publish("__visitorHide");
        });
        $("#textInput").on("propertychange input",view.textInputChange);

    },

    inputBlur:function (e) {
        if (view.inputFocus !== true || (e && e.target && e.target.id == 'textInput')) {
            return;
        }
        _$("textInput").blur();
        setTimeout(function () {
            // _$("textInput").trigger("blur");
            _$("textInput").blur();
            window.scrollTo(0,0)
        },10)
        window.blur();
    },
    bindPlainTextEvent:function () {
        var browser = view.chat.Browser.browser;
        var version = navigator.userAgent.match(/os ([\d]+)/i);
        version = version && version[1];
        //手机百度浏览器
        var baiduHack = view.chat.Device.isAndroid && (navigator.userAgent.indexOf('baiduboxapp') != -1&&navigator.userAgent.indexOf('lite') == -1);
        var iosBaiduHack = view.chat.Device.isIOS && navigator.userAgent.indexOf('baidubrowser') != -1;
        var bottomInit = window.innerHeight;//初始化时距离手机浏览器窗口顶部的位置  这个是大概位置
        var minBottomDistance = 0;
        var hackTimer, canFocusHackTimer = 0;
        $("#textInput").on('focus', function () {
            view.inputFocus = true;
            view.hideMenus();
            // $('.menu').on('click', view.inputBlur);
            var top = 600;
            if (view.chat.Device.isIOS) {
                if (window.top == window) {
                    if (view.chat.Device.isUCBrowserMobile || ((browser == 'safari'||browser == 'wexin'||browser == 'qq') && version >= 11)) {
                        if(canFocusHackTimer==0) {
                            hackTimer = setTimeout(function () {
                                var bottom = document.getElementById('textInput').getBoundingClientRect().bottom;
                                minBottomDistance = Math.min(bottom, minBottomDistance || bottom);
                                if (minBottomDistance < bottom) {
                                    _$('footer').style.marginBottom = bottom - minBottomDistance + 'px';
                                }
                                console.log('set bottom')
                            }, 600);
                        }
                        return;
                    }
                    setTimeout(function () {
                        _$("textInput").scrollIntoView();
                        _$("textInput").scrollIntoViewIfNeeded();
                    }, 560);
                } else {
                    var b = view.chat.Browser.browser;
                    if (!b.match(/baidu|sougou|uc|chrome|opera/)) {
                        _$('footer').style.marginBottom = '24px';
                    }

                }
                if (iosBaiduHack && canFocusHackTimer == 0) {
                    hackTimer = setTimeout(function () {
                        var bottom = document.getElementById('textInput').getBoundingClientRect().bottom;
                        if (bottomInit - bottom < 100) {
                            _$('chat').style.height = window.innerHeight-Math.min((window.innerHeight * 0.46), 320) + 'px';
                            _$('footer').style.marginBottom = Math.min((window.innerHeight * 0.46), 320) + 'px';
                            setTimeout(function () {
                                view.chatScroll&&view.chatScroll.refresh();
                            },100);
                        }
                    }, 600)
                }
            }
            if(baiduHack){
                _$('chat').style.height = window.innerHeight-Math.min((window.innerHeight * 0.4), 320) + 'px';
                _$('footer').style.marginBottom = Math.min((window.innerHeight * 0.4), 320) + 'px';
                view.chatScroll&&view.chatScroll.refresh();
            }
        }).on("blur", function (e) {
            hackTimer && clearTimeout(hackTimer);
            if (view.chat.Device.isIOS && (browser == 'safari' || browser == 'wexin') && version >= 11) {
                var bottom = document.getElementById('textInput').getBoundingClientRect().bottom;
                minBottomDistance = Math.min(bottom, minBottomDistance || bottom);
            }
            canFocusHackTimer && clearTimeout(canFocusHackTimer);
            canFocusHackTimer = setTimeout(function () {//中文没打完 按发送按钮,会发不出去 自动再次触发focus
                canFocusHackTimer = 0;
            },600);
            view.inputFocus = false;
            $('.menu').off('click', view.inputBlur);
            _$('chat').style.height ='100%';
            _$('footer').style.marginBottom = '0px';
            view.scrollToBottom();
            view.chat.postMessage("inputScrollStop");
        });
    },
    textInputChange:function () {
        var fake = _$("fakeInput");
        var text = _$("textInput");
        fake.innerText = text.value||' ';
        var h = fake.clientHeight;
        if (h > 93) {
            h = 93;
        } else if (h < 33) {
            h = 33;
        }
        text.style.height = h + 'px';
       /* $("#enter_btn").css({
            marginTop:h-32+'px'
        })*/
        text = fake = null;
    },
    initHtmlEdit: function (win) {
        /*_$("html_input").contentWindow.onscroll = function (e) {
         var input = _$("html_input");
         var h = input.clientHeight;
         if (h < 34) {
         input.style.height = "40px";
         //$("#footer").css("height","52px");
         } else if (h < 46) {
         input.style.height = "55px";
         //$("#footer").css("height","67px");
         }
         }*/

        var body = view.chat.getInputDocBody();
        $(body).on("focus", function (e) {
            if (view.chatScroll) {
                var wh = window.innerHeight;
                setTimeout(function () {
                    var wh2 = window.innerHeight;
                    if (wh - wh2 > 100) {//检测窗口变形，确认键盘有弹出
                        view.scrollToBottom()
                    }
                }, 500);
            }
        });
    },
    checkView: function (chat) {
        //防止页面滚动。
        /*   document.ontouchmove = function (e) {
         e.preventDefault();
         return false;
         }*/
        //窗口变形
        window.resizeFunc = function () {
            try {
                // window.scrollTop = 0;
                // document.body.scrollTop = 0;
            } catch (e) {

            }
            if (view.chatScroll) {
                setTimeout(view.scrollToBottom, 500);
            }
        }

        window.addEventListener("resize", resizeFunc);
        window.onorientationchange = resizeFunc;
        //window.onscroll = function (e) {
        //    e.preventDefault();
        //return false;
        //}
        resizeFunc();
        try {
            window.scrollTop = 0;
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
        } catch (e) {
        }
    },
    triggerFile: function (type) {
        console.log('triggerFile',type);
        var fileType = 2;//默认为传文件
        if(type=='record'){//视频
            fileType = 4
        }else if(type=='gallery'){//照片
            fileType = 2
        }else if(type=='voice'){//语言
            fileType = 3;
        }
        var ipt = document.getElementById('uploadInput');
        $(ipt).attr('filetype', fileType);
        if (document.createEvent) {
            try {
                var evt = document.createEvent('mouseEvent');
                evt.initEvent('click', true, true);
                ipt.dispatchEvent(evt);
            } catch (e) {
                ipt.click();
                console.log(e)
            }
        } else {
            ipt.click();
        }
    },
    
    bindMenu: function (that) {
    //tap会比click早导致click点到TAP后的界面。
        $("#menu_emotion").on("click", function () {
            if(view.inputFocus){
                setTimeout(function () {
                    view.showMenu("emotion");
                },550)
            }else{
                view.showMenu("emotion");
            }
        });
        $("#menu_more").off("tap").on("tap", function (e) {
            if ($(this).hasClass('open')) {
                view.hideMenus();
            } else {
                // view.showURLList('urlList');
                view.showMenu("urlList");
            }
            e && e.preventDefault && e.preventDefault();
            e.stopPropagation&&e.stopPropagation();
            return false;
        })
        $(".menu-satisfy").on("click", function () {
            that.showSatisfy(3);
        });

        //拍照片
        $(".menu-camera").on("click", function () {
            view.__nativeAPI("uploadMedia", "camera")
        });
        //拍视频
        $(".menu-video").on("click", function () {
            view.__nativeAPI("uploadMedia", "camera");
        });
        //相册
        $(".menu-file").on("click", function () {
            view.__nativeAPI("uploadMedia", "gallery");
        });
        //位置
        $(".menu-map").on("click", function () {
            view.__nativeAPI("map");
        });

        $(".record-switch").on("click", function () {
            if($("#chat_text").hasClass('recording')){
                $("#chat_text").removeClass('recording')
            }else{
                $("#chat_text").addClass('recording')
            }
        });
        function isPointerEventType(e, type){
            return (e.type == 'pointer'+type ||
            e.type.toLowerCase() == 'mspointer'+type)
        }
        function isPrimaryTouch(event){
            return (event.pointerType == 'touch' ||
                event.pointerType == event.MSPOINTER_TYPE_TOUCH)
                && event.isPrimary
        }
        var _clearSlct = "getSelection" in window ? function () {
            window.getSelection().removeAllRanges();
        } : function () {
            document.selection.empty();
        };
        var _isPointerType;
        var status = -1;//已经结束 或者从未开始
        $(".btn-record").on("contextmenu", function (e) {
            e.preventDefault && e.preventDefault();
        }).on("touchstart", function (e) {
            _clearSlct();
            var  deltaX, deltaY;//准备录音
            $("body").addClass('record-touching');
            $("body").removeClass('record-canceling');
            $("body").removeClass('record-countdown');
            var firstTouch = _isPointerType ? e : e.touches[0];
            if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) return
            var touch = {
                x1: firstTouch.pageX,
                y1: firstTouch.pageY,
                start: new Date().getTime()
            }
            status = 0;

            $(".btn-record").html('松开&nbsp;&nbsp;结束');
            setTimeout(function () {
                if (status == 0) {
                    //准备录音
                    view.__nativeAPI('voice',{type: 'init', record_time: 13})
                    view.__nativeAPI('voice',{type: 'startrecord'});
                    status = 1;
                }
            }, 100);
            function touchmove(e) {
                _clearSlct();
                // if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) return;
                firstTouch = _isPointerType ? e : e.touches[0]
                touch.x2 = firstTouch.pageX;
                touch.y2 = firstTouch.pageY;

                if (status == 1 || status == 2) {
                    deltaX = Math.abs(touch.x1 - touch.x2)
                    deltaY = Math.abs(touch.y1 - touch.y2)
                    if (deltaY > 30) {
                        if(status == 1) {
                            $("body").addClass('record-canceling');
                            //准备暂停录音
                            view.__nativeAPI('voice',{type: 'willcancelrecord'});
                            status = 2;
                        }
                    }else {
                        if (status == 2) {
                            //取消暂停录音
                            $("body").removeClass('record-canceling');
                            view.__nativeAPI('voice', {type: 'continuerecord'});
                            status = 1;
                        }
                    }
                }
            }
            view.endRecord = function () {
                status = -1;
                $("body").removeClass('record-touching');
                $("body").removeClass('record-canceling');
                $(".btn-record").html('按住&nbsp;&nbsp;说话');

                $(document).off('touchmove',touchmove);
                $(document).off('touchend',touchend);
                _clearSlct();
                view.endRecord = null;
            }
            function touchend(e) {
                view.__nativeAPI('voice', {type: 'stoprecord'});
                view.endRecord && view.endRecord();
            }
            $(document).on('touchmove', touchmove).on('touchend', touchend);
            e.preventDefault && e.preventDefault();
        });
    },

    sendClick: function () {
        this.publish("_sendMsg");
    },
    showDetailPage: function (evt) {
        if (!view.hasStaffInfo)return;
        var from = $("#chat"), to = $("#detail");
        $("#detail").css("z-index", "999999");
        view.animate(from, to, false, "slide", function () {
            //加载切页面回调
        });
        $("#footer").hide();
        setTimeout(function () {
            view.infoScroll.refresh();
        }, 550);
    },
    backToChat: function () {
        var to = $("#chat"), from = $("#detail");
        view.animate(from, to, true, "slide", function () {
            //加载切页面回调
            //setTimeout(function(){
            //    $("#footer").show();
            //},100);
        })
        setTimeout(function () {
            view.chatScroll.refresh();
            $("#footer").show();
        }, 550);
    },
    showMenu: function (id) {
        id = '#' + (id || 'urlList');
        var h, menu = $(id), otherId;
        if (id == "#emotion") {
            h = 152;
            otherId = '#urlList';
            $("#chat_text").removeClass('recording')
        } else if (id == '#urlList') {
            h = 232;
            otherId = '#emotion';
        }
        $("#chat").off("touchstart", view.hideMenus);
        $("#chat").on("touchstart", view.hideMenus);
        $("#container").css("bottom", (h + 51) + "px");
        $("#footer").css("bottom", h + "px");
        $(id).removeClass('hide');
        $(otherId).addClass('ani-hide');
        if (id == '#urlList') {
            $(".menu-more").addClass('open');
            $(".menu-more-i").addClass('bg0');
        } else {
            $(".menu-more").removeClass('open');
            $(".menu-more-i").removeClass('bg0');
        }
        setTimeout(function () {
            menu.removeClass('hide');
        }, 200);
        setTimeout(function () {
            $(otherId).addClass('hide').removeClass('ani-hide');
            view.scrollToBottom();
        }, 550);
    },
    showURLList:function (id) {
        return view.showMenu(id);
    },
    hideMenus: function (e, fromEnter) {
        var target;
        if (!fromEnter && e) {
            target = (e && e.target) ? e.target : window.event ? window.event.srcElement : null;
            var menu_emo = _$("menu_emotion");
            var emo_list = _$("emotion");
            var menu_more = _$("menu_more");
            var url_list = _$("urlList");
            var menu_emo_icon = document.querySelector('.menu-item-icon')
            if (target &&( target == menu_emo_icon || target == menu_emo || menu_more == target || url_list == target || emo_list == target
                || $.fn.contains(menu_emo, target) || $.fn.contains(menu_more, target)
                || $.fn.contains(emo_list, target) || $.fn.contains(url_list, target))) {
                return;
            }
        }
        $("#chat").off("touchstart", view.hideMenus);
        setTimeout(function () {
            $("#container").css("bottom", '51px');
            $("#footer").css("bottom", "0px");
        }, 100);

        if(!$("#emotion").hasClass('hide')){
            $("#emotion").addClass('ani-hide')
        }else if($("#urlList").hasClass('hide')){
            $("#urlList").addClass('ani-hide')
        }
        setTimeout(function () {
            view.scrollToBottom();
            $("#emotion").addClass('hide').removeClass('ani-hide');
            $("#urlList").addClass('hide').removeClass('ani-hide');
        }, 500);
        $(".menu-more").removeClass('open');
        $(".menu-more-i").removeClass('bg0');
      /*  if (e && !fromEnter && target != _$("enter_btn")) {
            e = e || window.event;
            e.preventDefault && e.preventDefault();
            return false;
        }*/
    },
    showImg: function (chat, e) {
        var items = [],imgIdx=0;
        var target = e.target;
        $(".msg-img", _$("container")).each(function (index, el) {
            var id = $(el).attr("id"),
                small = $(el).attr("src"),
                big = $(el).attr("bigimg"),
                source = $(el).attr("source");//兼容旧版
            source = (source=='undefined'||!source)?big:source;
            if (view.chat.needHttps) {
                big && (big = big.replace(/^http:/, view.chat.needHttps));
                small && (small = small.replace(/^http:/, view.chat.needHttps));
                source && (source = source.replace(/^http:/, view.chat.needHttps));
            }
            if (target == el) {
                imgIdx = items.length;
            }
            items.push({
                bigImg: big,
                smallImg: small,
                sourceImg:source,
                fileName:id
            })
        });
        view.__nativeAPI('previewImage',{
            urls:items,
            current:imgIdx
        })
    },
    animate: function (from, to, back, transition, cb) {
        if (view.curPage == to.attr("id"))return;
        var that = this;
        window.setTimeout(function () {
            if (from == "") {
                to.show();
                return;
            }
            from.addClass(transition + ' out');
            to.show();
            to.addClass(transition + ' in');
            if (back) {
                from.addClass('reverse');
                to.addClass('reverse');
            }
        }, 1);
        window.setTimeout(function () {
            if (from == "") {
                return;
            }
            from.removeClass(transition + ' out');
            to.removeClass(transition + ' in');
            from.removeClass('reverse');
            to.removeClass('reverse');
            from.hide();
            to.show();
            //cb()
            view.curPage = to.attr("id");
        }, 505);
    },
    animateUpShow: function (el, back) {
        setTimeout(function () {
            el.addClass("slideup in");
            el.show();
            if (back) {
                el.addClass("reverse");
            }
            setTimeout(function () {
                el.removeClass("slideup in");
                el.removeClass("reverse");
                el.removeClass("reverse");
            }, 505)
        }, 1)
    },
    animateUpHide: function (el, back) {
        setTimeout(function () {
            el.addClass("slideup out");
            //el.show();
            if (back) {
                el.addClass("reverse");
            }
            setTimeout(function () {
                el.removeClass("slideup in");
                el.removeClass("reverse");
                el.removeClass("reverse");
                el.hide();
            }, 505)
        }, 1)
    },
    scrollToBottom: function (id) {
        if (view.preHisLoadingId) {
            return view.scrollToLastPre(view.preHisLoadingId);
        }
        var elH = id ? (_$(id).offsetTop + $("#" + id).height() + 15) : _$('list_his').scrollHeight;
        var contentH = $("#content").height();
        if ((elH > contentH) && view.chatScroll) {
            if (!view.listInBottom) {
                $("#list_his").removeClass("bottom-scroll");
                view.listInBottom = true;
                //重新渲染，解决微信对话里，超出一页消息不显示的问题。
                $("#content").css({"display": "none"});
                setTimeout(function () {
                    $("#content").css({"display": "block"});
                    if (view.infoScroll) {
                        view.infoScroll.refresh();
                    }
                }, 10);
            }
            setTimeout(function () {
                view.chatScroll.refresh();
                setTimeout(function () {
                    var elH = id ? (_$(id).offsetTop + $("#" + id).height() + 15) : _$('list_his').scrollHeight;
                    view.chatScroll.scrollTo(0, contentH - elH);//padding
                }, 5);
            }, 5);
        }
        //TODO 转人工成功后 gethistory的时候,会覆盖机器人历史
        view.chatScroll && view.chatScroll.refresh();
    },
    scrollToLastPre:function (id) {
        view.chatScroll.refresh();
        var elH = _$('list_his').scrollHeight;
        var contentH = $("#content").height();
        var hideLength = elH - contentH, newLength = $("#" + id).height() + 70
        if (elH > contentH) {
            setTimeout(function () {
                view.chatScroll.scrollTo(0, -Math.min(hideLength, newLength));
            }, 5);
        }
    },
    handleSatisfy: function (allClose,type1,defaultVal) {
        defaultVal && $(".sub-tab" + defaultVal).addClass('sub-tab-sel');
        function select(value, setVal) {
            var val = parseInt(value) - 1;
            if(!type1) {
                var list = $(".sa-sli").results;
                for (var i = 0; i < 5; i++) {
                    if (i <= val) {
                        $(list[i]).addClass("sa-star");
                    } else {
                        $(list[i]).removeClass("sa-star");
                    }
                }
            }
            _$("satisfyConfig").className = 'sa-sel-' + (val + 1);
            if (setVal) {
                $("#satisfy_ipt").val(val + 1);
            }
        }

        function set() {
            var val = parseInt($("#satisfy_ipt").val() || 5) - 1;
            if(!type1) {
                var list = $(".sa-sli").results;
                for (var i = 0; i < 5; i++) {
                    if (i <= val) {
                        $(list[i]).addClass("sa-star");
                    } else {
                        $(list[i]).removeClass("sa-star");
                    }
                }
            }
            _$("satisfyConfig").className = 'sa-sel-' + (val + 1);
            $(".sub-tab-sel").removeClass('sub-tab-sel');
            $(".sub-tab"+(val+1)).addClass('sub-tab-sel');

        }

        //星星选择
        $(".sa-stars").on("touchstart touchmove touchend",function (event) {
            var element;
            try{
                element = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
            }catch(e){
                element = document.elementFromPoint(event.clientX, event.clientY);
            }
            element = element || event.target || event.srcElement;
            if($(element).hasClass('sa-sli')){
                var v = $(element).attr("v");
                select(v, true);
            }
        });
        $(".sa-stars").on('touchend',set);
        $(".sa-imgs").on('touchend',set);
        $(".sa-imgs").on("touchstart touchmove touchend",function (event) {
            var element;
            try{
                element = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
            }catch(e){
                element = document.elementFromPoint(event.clientX, event.clientY);
            }
            element = element || event.target || event.srcElement;
            if($(element).hasClass('sa-un-img')||$(element).hasClass('sa-s-img')){
                var v = $(element).attr("v");
                select(v, true);
            }
        });

        //子项选中
        $(".sa-cli").on("click", function (e) {
            //.sub-selected
            if ($(this).hasClass('sub-selected')) {
                $(this).removeClass('sub-selected');
            } else {
                $(this).addClass('sub-selected');
            }
        });
    },
    toggleLeaveToChat: function (type) {
        if(type===1){
            //未读
            if(view.chat.companyOff){
                $("#leaveBar").html(lanRes.leaveToLeaveBtn)
            }else{
                $("#leaveBar").html(lanRes.leaveToChatBtn)
            }
            $("#list_msg").hide();//避免显示'本次对话'
            $("#leaveBar").show();
            $("#toolbar").addClass('height0');
            $("#chat_text").addClass('hide');
        } else  if(type===0){
            $("#list_msg").show();//避免显示'本次对话'
            $("#leaveBar").hide();
            $("#toolbar").removeClass('height0');
            $("#chat_text").removeClass("hide");
        }else if(type===2){
            //机器人
            $("#toolbar").addClass('height0');
            $("#leaveBar").hide();
        }
        $("#urlList").addClass('hide');
    },
    initEmotion: function (list) {
        //var dot = '<li class="dot-list-li"></li>';
        var arr = ['<li class="emo-page hover flex1"><ul class="clearfix">'];
        var listdot = ['<li class="dot-list-li hover radius4">0</li>'], p = 0
        var len = list.length > 63 ? 63 : list.length, reg = /(^\[#)|(#\]$)/g;
        for (var i = 0; i < len; i++) {
            if (i != 0 && (i-0) % 7 == 0) {
                arr.push("</ul>");
                if ((i-0) % 21 == 0) {
                    arr.push('</li><li class="emo-page flex1"><ul class="clearfix">');
                    listdot.push('<li class="dot-list-li radius4">' + (++p) + '</li>');
                } else {
                    arr.push('<ul class="clearfix">');
                }
            }
            var k = list[i], n = k.replace(reg, "");
            arr.push('<li class="emoji ej-k' + n + '" code="' + n + '"></li>');
        }
        arr.push("</ul></li></ul>");
        _$("emo_list").innerHTML = arr.join("");
        _$("emo_list").style.width = ((p + 1) * 100) + "%";
        _$("emo_dot_list").innerHTML = listdot.join("");
        var page = 0;

        function endCB(delta) {
            if (delta == 0)return;
            page = page + delta;
            var li = $(".dot-list-li", _$("emo_dot_list")).removeClass("hover");
            $($(".dot-list-li", _$("emo_dot_list")).removeClass("hover").results[page]).addClass("hover");
        }

        this.pageSlide("#emo_list", endCB);

    },
    removeUnreadToLeave:function () {
        // if (view.chat.unreadMsg) {
            //未读消息
            var unread = _$('unread');
            $('.container',_$('leave')).results[0].appendChild(unread);
        // }
    },
    showUnread:function (num) {
        $("#unread_tip").html((lanRes.hasUnreadMsgNum.replace('${num}',num)));
        $("#unread").show();
        //检查高度设置高度
        //resize事件
        //去除resize事件
        setTimeout(function () {//头和脚之间
            var wHeight = _$s('body')[0].clientHeight - 101, height = $("#unread_wrap").height();
            if (wHeight - height < 160) {
                $("#unread_wrap").css('height', wHeight - 160 + 'px');
                view.unreadScroll = new IScroll('#unread_wrap', {
                    preventDefault: false,
                    useTransform: false,
                    tap: true, click: true
                });
            } else {
                view.unreadScroll = null;
            }
        }, 500)
    },
    removeUnreadMsg:function () {
        $("#unread").hide();
        $("#list_unread").html('');
        $("#unread_tip").html('');
    },
    //显示图片消息
    showMsgImg:function(data){
        return ('<img '+(!data.notEnd?'onload="javascript:view.scrollToBottom()"':'')+' id="img' + (data.fileIdentity || data.tm || new Date().getTime()) + '" attname="'
        + (data.fileName) + '" bigimg="' + (data.bigImg || data.sourceImg)
        + '" src="' + data.smallImg
        + '" source="' + (data.sourceImg||"")
        + '" sw="' + (data.sourceWidth||"")
        + '" sh="' + (data.sourceHeight||"")

        + '" class="msg-img"/>');
    },
    //已经送成功 或者接收到的文件
    getMsgFile:function (data) {
        if(_$(json.clientFileId)){
        }
        view.fileMsgs[data.fileIdentity] = data;
        var width,len,s ,loadMap;
        if(data.fileType==1) {
            //语音
            width = 50, len = data.voiceDuration;//时长是秒
            s = '<div class="msg-media msg-voice" data="' + data.fileUrl + '" style="width:' + width + 'px;"><i class="msg-voice-icon"></i><span>' + len + 's</span></div>'
        }else if(data.fileType==2){
            //视频
            s = '<div class="msg-media msg-video" data="' + data.fileUrl + '"><img class="msg-video-poster" src="'+data.videoThumbUrl+'" alt="这里是视频封面"/><div class="msg-video-angle"></div></div>';
        }else{
             loadMap = {
                0:'未下载',
                1:'下载完成',
                2:'下载中',
                3:'暂停下载'
            }
            //文件，只有文件才有下载
            s =  '<div class="file-info"><div class="file-name">'
            + data.fileName + '</div><div class="file-size">'
            + (parseInt(data.fileSize / 1024) + 1) + 'KB</div></div><div class="file-icon">&nbsp;</div>'
                + ((!json.loadStatus || json.loadStatus == 0|| json.loadStatus == 3) ? '<div identity="' + json.fileIdentity + '" class="file-load-btn file-load-status0">点击下载</div>' : '')
                + ((json.loadStatus == 1) ? '<div identity="' + json.fileIdentity + '" class="file-load-status file-load-status1">下载完成</div>' : '')
                + ((json.loadStatus==2) ? '<div identity="' + json.fileIdentity + '" class="file-load-btn file-load-status2">文件下载中，点击取消下载</div>' : '')

        }
        return s;
    },
    //尚未发送成功的文件消息
    getMsgSendingFile: function (json) {
        view.fileMsgs[json.clientFileId] = json;
        var fileTypeMap = {
            0: '文件',
            1: '图片',
            2: '文件',
            3: '语音',
            4: '视频',
        }
        var preview = '';
        if (json.fileType == 1||json.fileType == 4) { 
            preview = '<img alt="'+json.localFile+'" src="'+json.localFile+'"/>'
        }
        var content = '<div class="file-sending">' + fileTypeMap[json.fileType || 0]
            + ((!json.sendStatus || json.sendStatus == 0|| json.sendStatus == 1) ? ('上传中...' + (json.progress||0) + '%')
                : json.sendStatus == 2 ? ('文件上传' + '100%'):
                json.sendStatus == 3 ? '<div><span>'+lanRes.sendFail+'</span></div>':
                json.sendStatus == 4?'收到866965':'发送状态未知')
            + '</div>' + (json.sendStatus == 3 ? ('<div class="file-resend" identity="' + json.clientFileId + '">重新上传</div>') : '')
        if (json.localFile) {
            content += '<div class="file-prev file-prev'+json.fileType+'">' + preview+'<div></div>';
        }
        return content;
    },
    handleHis:function (his,talkId) {
        //设置配置
        //拿到头像
        var config = his.config, msg;
        if (!config)return;
        for (var i = 0; i < config.length; i++) {
            msg = config[i];
            if (msg.mt == 604) {
                his.staffName = msg.staffNickName || lanRes.serviceStaff;
                his.staffImg = msg.staffDetailInfo.staffHead || '';
            } else if (msg.mt == 649) {
                //设置界面样式
                var chatbox = msg.sdkChatBoxInfo;
                chatbox.sdkUrlList = null;
                view.setConfig(view.chat, msg);
                his.staffImg = his.staffImg||chatbox.defaultStaffImg;
                view.chat.defaultVisitorImg = view.chat.defaultVisitorImg||chatbox.defaultVisitorImg;

                msg.sdkEntranceInfo = null
                msg.captChaToken = null
            }else if (msg.mt == 600) {
                msg.routeEntranceInfo = null;
            }

        }
    },
    loadEmoji:function () {
        var that = view.chat;
        that.emo = window.emojiJson;
        that.emoLan = window.emojiLanJson;
        var lanEmo = {};
        for (var code in that.emoLan) {
            lanEmo[that.emoLan[code]] = code;
        }
        that.lanEmo = lanEmo;
        //设置表情菜单
        var list = window.emojiFaceJson;
        view.initEmotion.call(that, list);
        $("#emotion").on('tap', ".emoji", function (e) {
            //click ios qq内打开无法连续点击
            that.insertImg($(this).attr("code"));
            view.chat.handleInputLength();
        });
    }
}
})()