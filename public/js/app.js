(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("js/commons.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function slickResize(slider, settings) {
  $(window).on('load resize orientationchange', function () {
    if ($(window).width() > 1023) {
      if (slider.hasClass('slick-initialized')) {
        slider.slick('unslick');
      }
      return;
    }
    if (!slider.hasClass('slick-initialized')) {
      return slider.slick(settings);
    }
  });
};

exports.slickResize = slickResize;
});

;require.register("js/initialize.js", function(exports, require, module) {
'use strict';

var _commons = require('./commons');

//Main-features slide carousel function
window.slideTransition = function (parent, next, prev) {
  $(parent + ' img').each(function (i) {
    $(this).addClass('state' + (i + 1));
  });

  var moveSlide = function moveSlide(i) {
    $(parent + ' img').each(function () {
      var classname = $(this).attr('class');
      var index = parseInt(/state(\d)/.exec(classname)[1]) - 1;
      index = (index + i) % $(parent + ' img').length;
      index = index < 0 ? $(parent + ' img').length - 1 : index;
      index = index + 1;
      $(this).attr('class', 'state' + index);
    });
  };

  $(prev).click(function () {
    moveSlide(-1);
  });
  $(next).click(function () {
    moveSlide(+1);
  });
};

$(function () {

  var video = document.getElementById("video-element");

  var updateVideoTime = function updateVideoTime() {
    console.log(video.duration, video.currentTime);
    var counter = parseFloat(Math.round(video.duration / 60).toFixed(2));

    var remaing = video.duration - video.currentTime;
    var minutes = Math.floor(remaing / 60);
    var seconds = Math.floor(remaing - minutes * 60);
    var x = minutes < 10 ? "0" + minutes : minutes;
    var y = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("video__timer").innerHTML = x + ":" + y;
  };

  $(video).on('canplay', updateVideoTime);

  $(".video__playpause").click(function () {
    var video = document.getElementById("video-element");
    var button = document.getElementById("video__playpause");

    setInterval(updateVideoTime, 1000);

    //Make the video text hides
    $('.video__text').fadeOut(4000);

    if (video.paused) {
      video.play();
      $(this).css("background", "url(/images/video__pause-button.png) no-repeat");
      $(this).css("opacity", "0.5");
      //  $('.video__text').fadeIn();
    } else {
      video.pause();
      $(this).css("background", "url(/images/video__play-button.png) no-repeat");
      $(this).css("opacity", "1");
    }
  });

  // function restart() {
  //     var video = document.getElementById("Video1");
  //     video.currentTime = 0;
  // }
  //
  // function skip(value) {
  //     var video = document.getElementById("Video1");
  //     video.currentTime += value;
  // }


  slideTransition('.slidd', '.slidd-prev', '.slidd-next');

  //Buzz section Slider Cycle 2
  // $('.screenshots__slideshow').cycle({
  //
  // });


  //Had to change the cycle plugin because of the centered active slider
  // $('.cards__slideshow').cycle({
  //   next: '.cards__slider-nav--next',
  //   prev: '.cards__slider-nav--prev',
  // });

  //Stops autoinitializations of slider
  // $('.cards__slideshow').cycle('pause');
  // $('.cards__slideshow').cycle('cover');

  var slick = require("slick-carousel/slick/slick.js");

  $('#js-cards__slider').slick({
    // autoplay: true,
    // autoplaySpeed: 3000,
    arrows: true,
    centerMode: true,
    centerPadding: '18%',
    cssEase: 'linear',
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    useTransform: false

    //if need, just use the following code as selector for arrows
    // nextArrow: $('.cards__slider-nav--next'),
    // prevArrow: $('.cards__slider-nav--prev'),
  });

  //Menu scroll down to page sections

  // Select all links with hashes
  $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]').not('[href="#0"]').click(function (event) {
    // On-page links
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function () {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) {
            // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
});

$(document).ready(function () {

  var mainScreenshots__slider = $('#js-main-screenshots__slider');

  if (mainScreenshots__slider) {
    mainScreenshots__slider.slick({
      appendDots: $('.js-main-screenchots-dots'),
      arrows: false,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: 'linear',
      dots: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });
  }

  var boardsCarousel = $('#js-boards-carousel');
  var boardsCarouselSettings = {
    appendDots: $('.js-boards-carousel-dots'),
    arrows: false,
    autoplay: false,
    centerMode: false,
    dots: true,
    infinite: false,
    slidesToShow: 1.3,
    slidesToScroll: 1,
    mobileFirst: true,
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 2
      }
    }]
  };

  if (boardsCarousel) {
    (0, _commons.slickResize)(boardsCarousel, boardsCarouselSettings);
  }

  var postsCarousel = $('#js-posts-carousel');
  var postsCarouselSettings = {
    appendDots: $('.js-posts-carousel-dots'),
    arrows: false,
    autoplay: false,
    centerMode: false,
    dots: true,
    infinite: false,
    slidesToShow: 1.3,
    slidesToScroll: 1,
    mobileFirst: true,
    responsive: [{
      breakpoint: 767,
      settings: {
        slidesToShow: 2
      }
    }]

  };

  if (postsCarousel) {
    (0, _commons.slickResize)(postsCarousel, postsCarouselSettings);
  }

  $('.btn-nav-toggler').click(function () {

    $('.main-menu').toggleClass('is-active');
  });
});
});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  

// Auto-loaded modules from config.npm.globals.
window.jQuery = require("jquery");
window["$"] = require("jquery");
window.bootstrap = require("bootstrap");


});})();require('___globals___');

require('js/initialize');
//# sourceMappingURL=app.js.map