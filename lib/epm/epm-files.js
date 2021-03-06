/*!
 * This file is part of EPM.
 *
 * please see the LICENSE
 */

'use strict';

var sys = require('sys')
  , events = require('events')
  , extend = require('extend')
  , FileGateway = require('file-gateway')
  ;

/**
 * 
 * Initialize a new customized FileGateway instance for `dir` with `conf`.
 *
 * @param {String} dir working directory
 * @param {Object} conf
 */
var EpmFiles = module.exports = function(dir, conf) {
  var self = this;

  if(false === (self instanceof EpmFiles)) {
      return new EpmFiles();
  }

  self.conf = extend(true, {
    process: true,
    cache: {
      expire: ((1000 * 60) * 10 ),
      length: 30
    },
    extend: true,
    encoding: 'utf-8',
    saveOnSet: true
  }, conf)

  self.reponame = conf.reponame;
  
  // inherits
  FileGateway.call(self, dir, self.conf);

  self.configure();

  return self;
}

sys.inherits(EpmFiles, FileGateway);

/**
 * 
 * Configure epm files and directories
 *
 */
EpmFiles.prototype.configure = function() {
  var self = this;

  // set files
  self.add([
    { 
      key: "config-file",
      mode: "dynamic", type: "file", name: "CONFIG", json: true,
      defaults: { name: self.reponame }
    },
    { 
      key: "packages-file",
      mode: "dynamic", type: "file", name: "files/PACKAGES", json: true,
      defaults: { packages: {}, files: {} }
    },
    { 
      key: "files-file",
      mode: "dynamic", type: "file", name: "files/FILES", json: true,
      defaults: {}
    },
    { 
      key: "tags-file",
      mode: "dynamic", type: "file", name: "cache/TAGS", json: true,
      defaults: {}
    },
    { 
      key: "remotes-file",
      mode: "dynamic", type: "file", name: "REMOTES", json: true,
      defaults: {}
    },
    { key: "cache-folder", mode: "cache", type: "folder", name: "cache" },
    { key: "tmp-folder", mode: "temp", type: "folder", name: "tmp" },
    { key: "data-folder", mode: "cache", type: "folder", name: "cache/data" },
    { key: "remote-folder", mode: "dynamic", type: "folder", name: "remote" }
  ]);

  return self;
};