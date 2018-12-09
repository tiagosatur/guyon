function slickResize(slider, settings) {
$(window).on('load resize orientationchange', function() {
    if ($(window).width() > 1023) {
      if (slider.hasClass('slick-initialized')) {
        slider.slick('unslick');
      }
      return
    }
    if (!slider.hasClass('slick-initialized')) {
      return slider.slick(settings);
    }
  });
};


export { slickResize }
