module.exports = {
  port: 6002,
  files: ["./dist/**/*.{html,htm,css,js,jpg,png}"],
  watchOptions: {
    ignored: 'node_modules'
  },
  server: {
    baseDir: './dist'
  }
};