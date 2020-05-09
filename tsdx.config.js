module.exports = {
  rollup(config, _) {
    config['output']['sourcemap'] = false
    return config
  },
}
