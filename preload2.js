/**
 * preload.js
 */
 const xhrProxy = require('./xhr_proxy.js');
 const {ipcRenderer} = require('electron');
  
 xhrProxy.addHandler(function(xhr){
     let data = {};
     //TODO 具体业务代码
     //通过ipcRenderer.sendToHost即可将xhr内容发送到BrowserWindow中
     ipcRenderer.sendToHost('channel',data);
 });