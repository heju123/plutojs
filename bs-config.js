module.exports = {
  port: 6002,
  files: ["./test/src/**/*.{html,htm,css,js,jpg,png}","./test/libs/**/*.{html,htm,css,js,jpg,png}","./test/build/**/*.{html,htm,css,js,jpg,png}"],
  watchOptions: {
    ignored: 'node_modules'
  },
  server: {
    baseDir: './test/'
  }
};