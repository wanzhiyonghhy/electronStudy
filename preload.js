const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs');
//const session = require('electron').remote.session; 

//contextBridge.exposeInMainWorld('electronAPI',{
let  loginSecusse = (parm) => ipcRenderer.send('loginSecusse',parm)
//})

//注入脚本，拦截渲染进程中发起的网络请求XMLHttpRequset
window.onload = function(){
  window.name = '1234'
  let open = window.XMLHttpRequest.prototype.open
  console.log('监听的返回报文：open111'+open)
  window.XMLHttpRequest.prototype.open = function (method, url, async,user,pass){
    /*this.addEventListener("readystatechange",function () {
      console.log('监听的返回报文：--------------------3222222222222222')
      if (this.readyState === 4 && this.status === 200){ 
        console.log(this.responseText); //这是服务端响应的数据
      }
      },false)*/
      this.addEventListener('load', function() {
        console.log('data: ' + this.responseText);
       });
    open.apply(this,arguments);
  }
  console.log('监听的返回报文：open222'+window.XMLHttpRequest.prototype.open)
}

function countSecond() 
{　
    

    let open = window.XMLHttpRequest.prototype.open
    console.log('定时器监听的返回报文：open111'+open)
    console.log('当前window的对象'+window.name)
    window.XMLHttpRequest.prototype.open = function (method, url, async,user,pass){
      this.addEventListener("readystatechange",function () {
        console.log('定时器监听的返回报文：--------------------3222222222222222')
        if (this.readyState === 4 && this.status === 200){ 
          console.log(this.responseText); //这是服务端响应的数据
        }
        },false)
      open.apply(this,arguments);
    }
    console.log('定时器监听的返回报文：open222'+window.XMLHttpRequest.prototype.open)
    setTimeout(logXMLOpen,10000)
    
};

//setTimeout(countSecond, 2000);
//countSecond();

function logXMLOpen(){
  console.log('定时器监听的返回报文：open333'+window.XMLHttpRequest.prototype.open)
}
