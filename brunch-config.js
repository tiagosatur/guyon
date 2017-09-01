exports.files = {
  javascripts: {
    joinTo: {
      'js/vendor.js': /^(?!app)/,
      'js/app.js': /^(app)/,
    },
  },
  stylesheets: { joinTo: 'css/app.css' },
};


exports.plugins = {
  babel: { presets: ['latest', 'stage-0'] },
  pleeease: {
    sass: true,
    autoprefixer: {
      browsers: ['> 1%'],
    },
  },
  copycat: {
    fonts: ['node_modules/bootstrap/dist/fonts'],
    onlyChanged: true,
  },
};

exports.modules = {
  autoRequire: {
    'js/app.js': ['js/initialize'],
  },
};

exports.npm = {
  globals: {
    jQuery: 'jquery',
    $: 'jquery',
    bootstrap: 'bootstrap',
  },
  styles: {
    bootstrap: ['dist/css/bootstrap.css'],
  },
};
