//Main-features slide carousel function
window.slideTransition = function(parent, next, prev) {
  $(parent + ' img').each(function(i) {
    $(this).addClass('state' + (i + 1));
  });


  var moveSlide = function(i) {
    $(parent + ' img').each(function() {
      var classname = $(this).attr('class');
      var index = parseInt(/state(\d)/.exec(classname)[1]) - 1;
      index = ((index + i) % $(parent + ' img').length);
      index = index < 0 ? $(parent + ' img').length - 1 : index;
      index =  index + 1;
      $(this).attr('class', 'state' + index);
    });
  }

  $(prev).click(function() { moveSlide(-1) });
  $(next).click(function() { moveSlide(+1) });
}



$(function() {

  var video = document.getElementById("video-element");

  var updateVideoTime = function() {
    console.log(video.duration, video.currentTime);
    var counter = parseFloat(Math.round((video.duration/60)).toFixed(2));

    var remaing = video.duration - video.currentTime;
    var minutes = Math.floor(remaing / 60);
    var seconds = Math.floor(remaing - minutes * 60)
    var x = minutes < 10 ? "0" + minutes : minutes;
    var y = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("video__timer").innerHTML = x + ":" + y;
  };


  $(video).on('canplay', updateVideoTime);



  $(".video__playpause").click(function(){
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



  slideTransition('.slidd', '.slidd-prev', '.slidd-next')


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
    useTransform:false,

    //if need, just use the following code as selector for arrows
    // nextArrow: $('.cards__slider-nav--next'),
    // prevArrow: $('.cards__slider-nav--prev'),
  });




  //Menu scroll down to page sections

  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
        &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function() {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            };
          });
        }
      }
    });

});


$(document).ready(function() {

  $('#js-main-screenshots__slider').slick({
    appendDots: $('.js-main-screenchots-dots'),
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  })

  $('#js-boards-carousel').slick({
    appendDots: $('.js-boards-carousel-dots'),
    arrows: false,
    autoplay: false,
    centerMode: true,
    dots: true,

    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 768,
      settings: "unslick"
    }]
  })

  $('#js-posts-carousel').slick({
    appendDots: $('.js-posts-carousel-dots'),
    arrows: false,
    autoplay: false,
    centerMode: false,
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  })
});
