/*!
* @svgdotjs/svg.draggable.js - An extension for svg.js which allows to drag elements with your mouse
* @version 3.0.3
* https://github.com/svgdotjs/svg.draggable.js
*
* @copyright Wout Fierens
* @license MIT
*
* BUILT: Mon Mar 20 2023 18:56:35 GMT+0100 (Central European Standard Time)
*/;
(function (svg_js) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  var getCoordsFromEvent = function getCoordsFromEvent(ev) {
    if (ev.changedTouches) {
      ev = ev.changedTouches[0];
    }

    return {
      x: ev.clientX,
      y: ev.clientY
    };
  }; // Creates handler, saves it


  var DragHandler = /*#__PURE__*/function () { 
    function DragHandler(el, direction, tableInfo) {
        
      this.direction = direction;
      this.tableInfo = tableInfo;
      this.min = {x:0, y:0};
      this.max = {x:0, y:0}
      
      _classCallCheck(this, DragHandler);
        
      el.remember('_draggable', this);
      this.el = el;
      this.drag = this.drag.bind(this);
      this.startDrag = this.startDrag.bind(this);
      this.endDrag = this.endDrag.bind(this);
    } // Enables or disabled drag based on input


    _createClass(DragHandler, [{
      key: "init",
      value: function init(enabled) {
        //console.log( "enabled --- ", enabled);
        if (enabled) {
          this.el.on('mousedown.drag', this.startDrag);
          this.el.on('touchstart.drag', this.startDrag, {
            passive: false
          });
        } else {
          this.el.off('mousedown.drag');
          this.el.off('touchstart.drag');
        }
      } // Start dragging

    }, {
      key: "startDrag",
      value: function startDrag(ev) {
        var isMouse = !ev.type.indexOf('mouse'); // Check for left button

        if (isMouse && ev.which !== 1 && ev.buttons !== 0) {
          return;
        } // Fire beforedrag event

        if (this.el.dispatch('beforedrag', {
          event: ev,
          handler: this
        }).defaultPrevented) {
          return;
        } // Prevent browser drag behavior as soon as possible


        var tableGrp = null;
        var tableRect = null;
        var tableGrpBox = null;
        
        if( this.tableInfo["ENTITY_ID"]) {
            
            tableGrp = SVG(".table_"+this.tableInfo["SUBJECT_ID"]+"_"+this.tableInfo["ENTITY_ID"]);
            tableRect = SVG(".rect_"+this.tableInfo["SUBJECT_ID"]+"_"+this.tableInfo["ENTITY_ID"]);
            
            
            tableGrpBox = { 
                                left : Math.ceil(tableGrp.transform().translateX)
                             , top : Math.ceil(tableGrp.transform().translateY)
                             , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
                             , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
                            };
                            
                if( this.el.remember("position") == "l" 
                    || this.el.remember("position") == "tl" 
                    || this.el.remember("position") == "bl" ) {
                    this.minX = tableGrpBox.right-500;
                    this.maxX = tableGrpBox.right-50;
                } else if( this.el.remember("position") == "r" 
                    || this.el.remember("position") == "tr" 
                    || this.el.remember("position") == "br" ) {
                    this.minX = tableGrpBox.left+50;
                    this.maxX = tableGrpBox.left+500;
                } 

                if( this.el.remember("position") == "t" 
                    || this.el.remember("position") == "tl" 
                    || this.el.remember("position") == "tr" ) {
                    this.minY = tableGrpBox.bottom-1000;
                    this.maxY = tableGrpBox.bottom-100;
                } else if( this.el.remember("position") == "b" 
                    || this.el.remember("position") == "bl" 
                    || this.el.remember("position") == "br" ) {
                    this.minY = tableGrpBox.top+100;
                    this.maxY = tableGrpBox.top+1000;
                }
                
                this.minX = Math.max(0, this.minX);
                this.minY = Math.max(0, this.minY);
        }
        
        ev.preventDefault(); // Prevent propagation to a parent that might also have dragging enabled

        ev.stopPropagation(); // Make sure that start events are unbound so that one element
        // is only dragged by one input only

        this.init(false);
        this.box = this.el.bbox();
        this.lastClick = this.el.point(getCoordsFromEvent(ev));
        var eventMove = (isMouse ? 'mousemove' : 'touchmove') + '.drag';
        var eventEnd = (isMouse ? 'mouseup' : 'touchend') + '.drag'; // Bind drag and end events to window

        svg_js.on(window, eventMove, this.drag, this, {
          passive: false
        });
        svg_js.on(window, eventEnd, this.endDrag, this, {
          passive: false
        }); // Fire dragstart event

        this.el.fire('dragstart', {
          event: ev,
          handler: this,
          box: this.box
        });
      } // While dragging

    }, {
      key: "drag",
      value: function drag(ev) {
        var box = this.box,
            lastClick = this.lastClick;
        var currentClick = this.el.point(getCoordsFromEvent(ev));
        var dx = currentClick.x - lastClick.x;
        var dy = currentClick.y - lastClick.y;
        if (!dx && !dy) return box;
        
        var tableGrp = null;
        var tableRect = null;
        var tableGrpBox = null;
        
        if( this.tableInfo["ENTITY_ID"]) {
            
            tableGrp = SVG(".table_"+this.tableInfo["SUBJECT_ID"]+"_"+this.tableInfo["ENTITY_ID"]);
            tableRect = SVG(".rect_"+this.tableInfo["SUBJECT_ID"]+"_"+this.tableInfo["ENTITY_ID"]);
            
            
            tableGrpBox = { 
                                left : Math.ceil(tableGrp.transform().translateX)
                             , top : Math.ceil(tableGrp.transform().translateY)
                             , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
                             , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
                            };
        }
        
        var x = box.x + (this.direction == 'v' ? 0 : dx);
        var y = box.y + (this.direction == 'h' ? 0 : dy);
        
        if( this.tableInfo["ENTITY_ID"]) {
            
            if( this.el.remember("position") == "l" 
                || this.el.remember("position") == "tl" 
                || this.el.remember("position") == "bl"
                || this.el.remember("position") == "r" 
                || this.el.remember("position") == "tr" 
                || this.el.remember("position") == "br" ) {
                    if( x < this.minX) {
                        x = this.minX;
                    } else if( x > this.maxX) {
                        x = this.maxX;
                    }
            }
            if( this.el.remember("position") == "t" 
                || this.el.remember("position") == "tl" 
                || this.el.remember("position") == "tr"
                || this.el.remember("position") == "b" 
                || this.el.remember("position") == "bl" 
                || this.el.remember("position") == "br") {
                    if( y < this.minY) {
                        y = this.minY;
                    } else if( y > this.maxY) {
                        y = this.maxY;
                    }
            }  
        }
        
        
        this.box = new svg_js.Box(x, y, box.w, box.h);
        // this.box = new svg_js.Box(Math.round(x), Math.round(y), Math.ceil(box.w), Math.ceil(box.h));
        this.lastClick = currentClick;

        if (this.el.dispatch('dragmove', {
          event: ev,
          handler: this,
          box: this.box
        }).defaultPrevented) {
          return;
        }

        this.move(x, y);
        // this.move(Math.ceil(x), Math.ceil(y));
      }
    }, {
      key: "move",
      value: function move(x, y) {
        // Svg elements bbox depends on their content even though they have
        // x, y, width and height - strange!
        // Thats why we handle them the same as groups
        if (this.el.type === 'svg') {
          svg_js.G.prototype.move.call(this.el, x, y);
        } else {
          this.el.move(x, y);
        }
      }
    }, {
      key: "endDrag",
      value: function endDrag(ev) {
        // final drag
        this.drag(ev); // fire dragend event

        var box = this.box,
            lastClick = this.lastClick;
        var currentClick = this.el.point(getCoordsFromEvent(ev));
        var dx = currentClick.x - lastClick.x;
        var dy = currentClick.y - lastClick.y;

        var tableGrp = null;
        var tableRect = null;
        var tableGrpBox = null;
        
        var tableGrp = null;
        var tableRect = null;
        var tableGrpBox = null;
        
        if( this.tableInfo["ENTITY_ID"]) {
            
            tableGrp = SVG(".table_"+this.tableInfo["SUBJECT_ID"]+"_"+this.tableInfo["ENTITY_ID"]);
            tableRect = SVG(".rect_"+this.tableInfo["SUBJECT_ID"]+"_"+this.tableInfo["ENTITY_ID"]);
            
            
            tableGrpBox = { 
                                left : Math.ceil(tableGrp.transform().translateX)
                             , top : Math.ceil(tableGrp.transform().translateY)
                             , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
                             , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
                            };
        }
      
        
        var x = box.x + (this.direction == 'v' ? 0 : dx);
        var y = box.y + (this.direction == 'h' ? 0 : dy);
        
        
        if( this.tableInfo["ENTITY_ID"]) {
            if( tableGrpBox.right - tableGrpBox.left <= 50 ) {
                x = tableGrpBox.left+51;
            } else if( tableGrpBox.right - tableGrpBox.left >= 250 ) {
                x = tableGrpBox.left+249;
            }
            if( tableGrpBox.bottom - tableGrpBox.top <= 100 ) {
                y = tableGrpBox.top+101;
            } else if( tableGrpBox.bottom - tableGrpBox.top >= 1000 ) {
                y = tableGrpBox.top+999;
            }
        }
        
        this.el.fire('dragend', {
          event: ev,
          handler: this,
          box: this.box
        }); // unbind events

        svg_js.off(window, 'mousemove.drag');
        svg_js.off(window, 'touchmove.drag');
        svg_js.off(window, 'mouseup.drag');
        svg_js.off(window, 'touchend.drag'); // Rebind initial Events

        this.init(true);
      }
    }]);

    return DragHandler;
  }();

  svg_js.extend(svg_js.Element, {
    draggableResizer: function draggableResizer(_enable, direction, tableInfo) {
      // var enable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var enable = (_enable==undefined || _enable == null) ? true : _enable;
      // console.log( this, "enable " , _enable, enable );
      var dragHandler = this.remember('_draggable') || new DragHandler(this, direction, tableInfo);
      dragHandler.init(enable);
      return this;
    }
  });

})(SVG);
//# sourceMappingURL=svg.draggable.js.map