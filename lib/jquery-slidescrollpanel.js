/*global define:false require:false */
(function (name, context, definition) {
	if (typeof module != 'undefined' && module.exports) module.exports = definition();
	else if (typeof define == 'function' && define.amd) define(definition);
	else context[name] = definition();
})('jquery-slidescrollpanel', this, function() {
  var $, SlideScrollPanel, jQuery,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty;

  jQuery = $ = window.jQuery || require('jquery');

  $.SlideScrollPanel = SlideScrollPanel = (function() {
    SlideScrollPanel.prototype.interval = null;

    SlideScrollPanel.prototype.config = {
      $el: null,
      $wrap: null,
      direction: 'right',
      autoContentWidth: true,
      autoContentHeight: true,
      autoWrapWidth: true,
      autoWrapHeight: true,
      wrapStyles: {
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'auto',
        'z-index': 100
      },
      contentStyles: {
        margin: 0,
        padding: 0,
        width: '100%',
        display: 'inline-block'
      }
    };

    function SlideScrollPanel(opts) {
      var $content, $wrap, key, value;

      if (opts == null) {
        opts = {};
      }
      this.leavePanelHelper = __bind(this.leavePanelHelper, this);
      this.hidePanel = __bind(this.hidePanel, this);
      this.showPanel = __bind(this.showPanel, this);
      this.resize = __bind(this.resize, this);
      this.clearInterval = __bind(this.clearInterval, this);
      this.addInterval = __bind(this.addInterval, this);
      this.active = __bind(this.active, this);
      this.$getEl = __bind(this.$getEl, this);
      this.$getContent = __bind(this.$getContent, this);
      this.$getWrapper = __bind(this.$getWrapper, this);
      this.getHideProps = __bind(this.getHideProps, this);
      this.getShowProps = __bind(this.getShowProps, this);
      this.getOffset = __bind(this.getOffset, this);
      this.getSize = __bind(this.getSize, this);
      this.getInverse = __bind(this.getInverse, this);
      this.getProperty = __bind(this.getProperty, this);
      this.getAxis = __bind(this.getAxis, this);
      this.getMargin = __bind(this.getMargin, this);
      this.addListeners = __bind(this.addListeners, this);
      this.removeListeners = __bind(this.removeListeners, this);
      this.destroy = __bind(this.destroy, this);
      this.config = JSON.parse(JSON.stringify(this.config));
      for (key in opts) {
        if (!__hasProp.call(opts, key)) continue;
        value = opts[key];
        this.config[key] = value;
      }
      $content = this.config.$el;
      if (this.config.$wrap) {
        $wrap = this.config.$wrap;
      } else {
        $wrap = $("<div/>");
        $content.wrap($wrap);
        this.config.$wrap = $wrap = $content.parent();
      }
      $wrap.hide().data('slidescrollpanel', this).addClass("slidescrollpanel-wrap").css(this.config.wrapStyles);
      $content.data('slidescrollpanel', this).addClass("slidescrollpanel-content slidescrollpanel-direction-" + (this.getDirection())).css(this.config.contentStyles);
      this.addListeners();
      this;
    }

    SlideScrollPanel.prototype.destroy = function() {
      this.clearInterval();
      this.removeListeners();
      return this;
    };

    SlideScrollPanel.prototype.removeListeners = function() {
      this.$getWrapper().off('mouseleave', this.leavePanelHelper).off('touchend', this.leavePanelHelper);
      $(window).off('resize', this.resize);
      return this;
    };

    SlideScrollPanel.prototype.addListeners = function() {
      this.removeListeners();
      this.$getWrapper().on('mouseleave', this.leavePanelHelper).on('touchend', this.leavePanelHelper);
      $(window).on('resize', this.resize);
      return this;
    };

    SlideScrollPanel.prototype.isTouchDevice = function() {
      return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    };

    SlideScrollPanel.prototype.getDirection = function() {
      return this.config.direction;
    };

    SlideScrollPanel.prototype.marginMap = {
      right: 'left',
      left: 'right',
      top: 'bottom',
      bottom: 'top'
    };

    SlideScrollPanel.prototype.getMargin = function() {
      var margin;

      margin = this.marginMap[this.getDirection()];
      return margin;
    };

    SlideScrollPanel.prototype.axisMap = {
      right: 'scrollLeft',
      left: 'scrollLeft',
      top: 'scrollTop',
      bottom: 'scrollTop'
    };

    SlideScrollPanel.prototype.getAxis = function() {
      var axis;

      axis = this.axisMap[this.getDirection()];
      return axis;
    };

    SlideScrollPanel.prototype.propertyMap = {
      right: 'width',
      left: 'width',
      top: 'height',
      bottom: 'height'
    };

    SlideScrollPanel.prototype.getProperty = function() {
      var property;

      property = this.propertyMap[this.getDirection()];
      return property;
    };

    SlideScrollPanel.prototype.inverseMap = {
      right: false,
      left: true,
      top: true,
      bottom: false
    };

    SlideScrollPanel.prototype.getInverse = function() {
      var inverse;

      inverse = this.inverseMap[this.getDirection()];
      return inverse;
    };

    SlideScrollPanel.prototype.getSize = function() {
      var $wrap, property, size;

      property = this.getProperty();
      $wrap = this.$getWrapper();
      size = $wrap[property]();
      return size;
    };

    SlideScrollPanel.prototype.getOffset = function() {
      var $wrap, axis, offset;

      axis = this.getAxis();
      $wrap = this.$getWrapper();
      offset = $wrap.prop(axis);
      return offset;
    };

    SlideScrollPanel.prototype.getShowProps = function() {
      var axis, opts;

      axis = this.getAxis();
      opts = {};
      if (this.getInverse()) {
        opts[axis] = 0;
      } else {
        opts[axis] = this.getSize();
      }
      return opts;
    };

    SlideScrollPanel.prototype.getHideProps = function() {
      var axis, opts;

      axis = this.getAxis();
      opts = {};
      if (this.getInverse()) {
        opts[axis] = this.getSize();
      } else {
        opts[axis] = 0;
      }
      return opts;
    };

    SlideScrollPanel.prototype.$getWrapper = function() {
      var $wrap;

      $wrap = this.config.$wrap;
      return $wrap;
    };

    SlideScrollPanel.prototype.$getContent = function() {
      var $content;

      $content = this.config.$el;
      return $content;
    };

    SlideScrollPanel.prototype.$getEl = function() {
      return this.$getContent();
    };

    SlideScrollPanel.prototype.active = function(active) {
      var $wrap;

      $wrap = this.$getWrapper();
      if (active === true) {
        $wrap.addClass('slidescrollpanel-active').show();
        return this;
      } else if (active === false) {
        $wrap.removeClass('slidescrollpanel-active').hide();
        return this;
      } else {
        active = $wrap.hasClass('slidescrollpanel-active');
        return active;
      }
    };

    SlideScrollPanel.prototype.addInterval = function() {
      if (this.isTouchDevice()) {
        return;
      }
      this.clearInterval();
      this.interval = setInterval(this.leavePanelHelper, 2000);
      return this;
    };

    SlideScrollPanel.prototype.clearInterval = function() {
      if (this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
      }
      return this;
    };

    SlideScrollPanel.prototype.resize = function() {
      var $container, $content, $wrap, height, width;

      $wrap = this.$getWrapper();
      $content = this.$getContent();
      $container = $wrap.parent();
      width = $container.width();
      height = $container.height();
      if (this.config.autoContentWidth) {
        $content.css({
          width: width
        });
      }
      if (this.config.autoContentHeight) {
        $content.css({
          height: height
        });
      }
      if (this.config.autoWrapWidth) {
        $wrap.css({
          width: width
        });
      }
      if (this.config.autoWrapHeight) {
        $wrap.css({
          height: height
        });
      }
      $content.css('margin-' + this.getMargin(), this.getSize());
      return this;
    };

    SlideScrollPanel.prototype.showPanel = function(next) {
      var $wrap,
        _this = this;

      this.clearInterval();
      $wrap = this.$getWrapper();
      if (this.active() === false) {
        this.resize();
        $wrap.css({
          opacity: 0
        });
        this.active(true);
        $wrap.prop(this.getHideProps()).css({
          opacity: 1
        });
      }
      $wrap.stop(true, false).animate(this.getShowProps(), 400, function() {
        $(window).trigger('resize');
        _this.addInterval();
        return typeof next === "function" ? next() : void 0;
      });
      return this;
    };

    SlideScrollPanel.prototype.hidePanel = function(next) {
      var $wrap,
        _this = this;

      this.clearInterval();
      $wrap = this.$getWrapper();
      $wrap.stop(true, false).animate(this.getHideProps(), 400, function() {
        _this.active(false);
        $(window).trigger('resize');
        return typeof next === "function" ? next() : void 0;
      });
      return this;
    };

    SlideScrollPanel.prototype.leavePanelHelper = function() {
      var offset, over, shown, size,
        _this = this;

      if (this.active()) {
        offset = this.getOffset();
        size = this.getSize();
        if (this.getInverse()) {
          shown = offset === 0;
          over = offset < size / 2;
        } else {
          shown = offset === size;
          over = offset > size / 2;
        }
        if (shown) {

        } else if (over) {
          this.showPanel(function() {
            return _this.$getEl().trigger('slidescrollpanelin');
          });
        } else {
          this.hidePanel(function() {
            return _this.$getEl().trigger('slidescrollpanelout');
          });
        }
      }
      return this;
    };

    return SlideScrollPanel;

  })();

  $.fn.slideScrollPanel = function(opts) {
    var $el, slideScrollPanel;

    if (opts == null) {
      opts = {};
    }
    $el = $(this);
    opts.$el = $el;
    slideScrollPanel = new SlideScrollPanel(opts);
    return $el;
  };

  return SlideScrollPanel;

});