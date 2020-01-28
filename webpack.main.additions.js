const WebpackObfuscator = require('webpack-obfuscator');
let config = {
  target: 'electron-main',
}

if (process.env.NODE_ENV === "production") {
  config["devtool"] = 'eval'
  config["plugins"] = [
    new WebpackObfuscator ({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false,
      debugProtectionInterval: false,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      renameGlobals: false,
      rotateStringArray: true,
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: 'base64',
      stringArrayThreshold: 1,
      unicodeEscapeSequence: false,
      target: 'node'
    })
  ]
}

module.exports = config