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
    function DragHandler(el, direction, relationInfo, StartOrEnd) {
		
	  this.direction = direction;
	  this.relationInfo = relationInfo;
	  this.StartOrEnd = StartOrEnd;
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
		
		if( this.relationInfo && this.StartOrEnd != "") {
			
			tableGrp = SVG(".table_"+this.relationInfo[this.StartOrEnd+"_ENTITY_ID"]);
			tableRect = SVG(".rect_"+this.relationInfo[this.StartOrEnd+"_ENTITY_ID"]);
			
			
			tableGrpBox = { 
								left : Math.ceil(tableGrp.transform().translateX)
							 , top : Math.ceil(tableGrp.transform().translateY)
							 , right : Math.ceil(tableGrp.transform().translateX + tableRect.width())
							 , bottom : Math.ceil(tableGrp.transform().translateY + tableRect.height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
							};
			var mX = Math.floor(this.el.transform().translateX + box.x + box.w/2);
			var mY = Math.floor(this.el.transform().translateY + box.y + box.h/2);
			
			
			// var elBox = { x : Math.ceil(this.el.transform().translateX + box.cx) , y : Math.ceil(this.el.transform().translateY + box.cy) };
			var elBox = { x : this.el.transform().translateX + box.cx , y : this.el.transform().translateY + box.cy };
			
			// console.log( this.direction, { mX : mX, mY : mY}, elBox , tableGrpBox);
			
			//console.log( (elBox.x-1 == tableGrpBox.left || elBox.x-1 == tableGrpBox.right), this.direction );
			//console.log( elBox.y, tableGrpBox.top , (elBox.y-1 == tableGrpBox.top || elBox.y-1 == tableGrpBox.bottom), this.direction );
			
			// if( (elBox.x-1 == tableGrpBox.left || elBox.x-1 == tableGrpBox.right) && this.direction == 'h' ) {
			// if( ((mX >= tableGrpBox.left-2 && mX <= tableGrpBox.left) ||  (mX >= tableGrpBox.right && mX <= tableGrpBox.right+2)) && this.direction == 'h' ) { //  
			if( (mX <= tableGrpBox.left-1 ||  mX >= tableGrpBox.right+1) && this.direction == 'h' ) { //  
				// console.log("x",  tableGrpBox , elBox, this.direction );

				this.el.attr("cursor", "s-resize");
				this.direction = 'v';
				this.el.remember("direction", "y");

			}
			// else if( (elBox.y == tableGrpBox.top || elBox.y == tableGrpBox.top+3 || elBox.y-1 == tableGrpBox.bottom) && this.direction == 'v' ) {
			// if( ((mY >= tableGrpBox.top-1 && mY <= tableGrpBox.top-4) || (mY >= tableGrpBox.bottom && mX <= tableGrpBox.bottom+2)) && this.direction == 'v' ) { //  
			else if( (mY <= tableGrpBox.top-3  || mY >= tableGrpBox.bottom+1) && this.direction == 'v' ) { //  
				//console.log("y",   tableGrpBox , elBox, this.direction );
				
				this.el.attr("cursor", "e-resize");
				this.direction = 'h';
				this.el.remember("direction", "x");

			}
		}
	  
		
		var x = box.x + (this.direction == 'v' ? 0 : dx);
        var y = box.y + (this.direction == 'h' ? 0 : dy);
		
		var _position = "";
		
		
		if( this.relationInfo && tableGrpBox ) {
			
			console.log( mX, mY, tableGrpBox );
			
			if( mX == tableGrpBox.left ) {
				this.min.x = box.x;
				_position = 'l';
			}
			if( mX == tableGrpBox.right ) {
				this.max.x = box.x;
				_position = 'r';
			}

			if( mX <= tableGrpBox.left ) {
				x = this.min.x + (this.direction == 'v' ? 0 : dx);
				_position = 'l';
			}
			if( mX >= tableGrpBox.right ) {
				x = this.max.x + (this.direction == 'v' ? 0 : dx);
				_position = 'r';
			}

			if( mY == tableGrpBox.bottom ) {
				this.max.y = box.y;
				_position = 'b';
			}
			if( mY == tableGrpBox.top || mY == tableGrpBox.top-3) {
				this.min.y = box.y;
				_position = 't';
			}
			if( mY <= tableGrpBox.top-3 ) {
				y = this.min.y + (this.direction == 'h' ? 0 : dy);
				_position = 't';
			}
			if( mY >= tableGrpBox.bottom ) {
				y = this.max.y + (this.direction == 'h' ? 0 : dy);
				_position = 'b';
			}
			
			if( _position == "" ) {
				_position = this.el.remember("position") ;
			}
			
			this.el.remember("position", this.el.remember("position"));
			//console.log( " _position : " + _position );
		}

        this.box = new svg_js.Box(x, y, box.w, box.h);
		// this.box = new svg_js.Box(Math.round(x), Math.round(y), Math.ceil(box.w), Math.ceil(box.h));
        this.lastClick = currentClick;

        if (this.el.dispatch('dragmove', {
          event: ev,
          handler: this,
          box: this.box,
		  position : _position
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
		
		if( this.relationInfo && this.StartOrEnd != "") {
			
			tableGrp = SVG(".table_"+this.relationInfo[this.StartOrEnd+"_ENTITY_ID"]);
			tableRect = SVG(".rect_"+this.relationInfo[this.StartOrEnd+"_ENTITY_ID"]);
			
			
			tableGrpBox = { 
								left : Math.floor(tableGrp.transform().translateX)
							 , top : Math.floor(tableGrp.transform().translateY)
							 , right : Math.floor(tableGrp.transform().translateX + tableRect.width())
							 , bottom : Math.floor(tableGrp.transform().translateY + tableRect.height()) + 15  // DrawTable.CONSTANT.COLUMN_HIGHT
							};
			
			
			var elBox = { x : Math.floor(this.el.transform().translateX  + box.cx) , y : Math.floor(this.el.transform().translateY + box.cy) };
			
			
			if( (elBox.x-1 == tableGrpBox.left || elBox.x-1 == tableGrpBox.right) && this.direction == 'h' ) {
				console.log("x",  tableGrpBox , elBox, this.direction );

				this.el.attr("cursor", "s-resize");
				this.direction = 'v';
				this.el.remember("direction", "y");

			}
			else if( (elBox.y == tableGrpBox.top || elBox.y-1 == tableGrpBox.bottom) && this.direction == 'v' ) {
				console.log("y",   tableGrpBox , elBox, this.direction );
				
				this.el.attr("cursor", "e-resize");
				this.direction = 'h';
				this.el.remember("direction", "x");

			}
		}

		
		var mX = Math.floor(this.el.transform().translateX + box.x + box.w/2);
		var mY = Math.floor(this.el.transform().translateY + box.y + box.h/2);
		
		var x = box.x + (this.direction == 'v' ? 0 : dx);
        var y = box.y + (this.direction == 'h' ? 0 : dy);

		var _position = "";
		
		if( this.relationInfo && tableGrpBox ) {
			if( mX == tableGrpBox.left ) {
				this.min.x = box.x;
				_position = 'l';
			}
			if( mX == tableGrpBox.right ) {
				this.max.x = box.x;
				_position = 'r';
			}

			if( mX <= tableGrpBox.left ) {
				x = this.min.x + (this.direction == 'v' ? 0 : dx);
				_position = 'l';
			}
			if( mX >= tableGrpBox.right ) {
				x = this.max.x + (this.direction == 'v' ? 0 : dx);
				_position = 'r';
			}

			if( mY == tableGrpBox.bottom ) {
				this.max.y = box.y;
				_position = 'b';
			}
			if( mY == tableGrpBox.top || mY == tableGrpBox.top-3) {
				this.min.y = box.y;
				_position = 't';
			}
			if( mY <= tableGrpBox.top-3 ) {
				y = this.min.y + (this.direction == 'h' ? 0 : dy);
				_position = 't';
			}
			if( mY >= tableGrpBox.bottom ) {
				y = this.max.y + (this.direction == 'h' ? 0 : dy);
				_position = 'b';
			}

			if( _position == "" ) {
				_position = this.el.remember("position");
			}
			
			this.el.remember("position", this.el.remember("position"));
		}
		
		// console.log("+++++", _position, mX, mY, tableGrpBox);
		
        this.el.fire('dragend', {
          event: ev,
          handler: this,
          box: this.box,
		  position : _position
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
    draggable: function draggable(_enable, direction, relationInfo, StartOrEnd) {
      // var enable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var enable = (_enable==undefined || _enable == null) ? true : _enable;
      // console.log( this, "enable " , _enable, enable );
      var dragHandler = this.remember('_draggable') || new DragHandler(this, direction, relationInfo, StartOrEnd);
      dragHandler.init(enable);
      return this;
    }
  });

})(SVG);
//# sourceMappingURL=svg.draggable.js.map