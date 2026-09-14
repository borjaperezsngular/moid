/**
 * Publisher-side Prebid bundle fixture for MOID integration QA.
 * NOT shipped by MasOrange — mimics the publisher's own prebid.js on their origin.
 * Exposes the pbjs API surface MOID relies on: que + setConfig(ortb2).
 */
;(function () {
  'use strict'

  var pbjs = window.pbjs || {}
  var queue = pbjs.que || []
  var config = {}

  var mergeTopLevel = function (target, source) {
    if (!source) {
      return target
    }

    Object.keys(source).forEach(function (key) {
      target[key] = source[key]
    })

    return target
  }

  pbjs.libLoaded = true
  pbjs.version = 'v9.53.2-publisher-fixture'

  pbjs.setConfig = function (nextConfig) {
    mergeTopLevel(config, nextConfig)
  }

  pbjs.getConfig = function (key) {
    if (typeof key === 'string') {
      return config[key]
    }

    return config
  }

  pbjs.que = {
    push: function (callback) {
      queue.push(callback)

      if (typeof callback === 'function') {
        try {
          callback()
        } catch (error) {
          console.error('pbjs.que callback error', error)
        }
      }

      return queue.length
    },
  }

  queue.forEach(function (callback) {
    if (typeof callback === 'function') {
      try {
        callback()
      } catch (error) {
        console.error('pbjs.que callback error', error)
      }
    }
  })

  window.pbjs = pbjs
})()
