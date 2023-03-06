const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const storage = require('electron-localStorage');
var fs=require('fs')


// 函数实现，参数单位 毫秒 ；
// 以下代码来自于互联网，具体出处已经不记得了；
function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
};

let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload2.js')
    }
  })
  //mainWindow.loadFile('index.html')
  //mainWindow.loadURL()
  mainWindow.loadURL('https://www.baidu.com/')
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  //监听地址的变化
  mainWindow.webContents.on('did-navigate',(event,str) =>{
    console.log('---监听地址的变化---:'+str);
    if(str.startsWith("/xxmh/html/index_login.html")){
      //发送登录成功的消息给主进程，在主进程中获取当前的cookie，并将localStrorage数据传输到主进程
      //console.log(typeof window.electronAPI.loginSecusse)
      let token = storage.getItem('token');
      let _um_cn_umsvtn = storage.getItem("_um_cn_umsvtn")

      let token1
      mainWindow.webContents
      .executeJavaScript('localStorage.getItem("token");', true)
      .then((result) => {
        token1 = result;
      });
      let _um_cn_umsvtn1
      mainWindow.webContents
      .executeJavaScript('localStorage.getItem("_um_cn_umsvtn");', true)
      .then((result) => {
        _um_cn_umsvtn1 = result;
      });

      // 查询所有 cookies。
      mainWindow.webContents.session.cookies.get({url:''})
      .then((cookies) => {
        console.log(cookies)
        var cookiesStr = '';
        for(var i = 0;i<cookies.length;i++){
          cookiesStr +=JSON.stringify(cookies[i]) + '\r\n'
        }
        cookiesStr += 'token='+token+'##'+'_um_cn_umsvtn='+_um_cn_umsvtn+'token='+token1+'##'+'_um_cn_umsvtn='+_um_cn_umsvtn1
        fs.writeFile('cookie.txt',cookiesStr,function(err,data){//同步：writeFileSync
          if(err){
              throw err
            }
            console.log(data)
        })
      }).catch((error) => {
        console.log(error)
      })
      

      console.log("----------调用主进程写cookie成功---------")
    }
  })


  try {
    mainWindow.webContents.debugger.attach('1.3');
  } catch (err) {
    console.log('Debugger attach failed: ', err);
  }
  mainWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to: ', reason);
  });
  mainWindow.webContents.debugger.on('message', (event, method, params) => {
    //if(params.response.url.startsWith('')){
      if (method === 'Network.responseReceived') {
        //console.log('url---:'+params.response.url);
        if(params.response.url.startsWith('')){
          mainWindow.webContents.debugger.sendCommand('Network.getResponseBody', {
            requestId: params.requestId
          })
          .then(function(response) {
            console.log("-------返回报文-----"+JSON.stringify(response));
          });
        }
        
      }else if(method === 'Network.getResponseBody'){
        //if(params.response.url.startsWith('')){
          console.log("-------Network.getResponseBodyd 返回报文-----")
        //}
      }
    //}
  }) 
  mainWindow.webContents.debugger.sendCommand('Network.enable');


  const filter = {
    urls: ['', '*://electron.github.io/*']
  }
  
  //截取ajax的响应
  /*mainWindow.webContents.session.webRequest.onCompleted(filter, (details, cb2) => {
    cb2(details)
  })*/  

  function cb2(parm){
    console.log('回调结果：')
  }

  ipcMain.on('loginSecusse', async (event,parm) => {
    //获取当前的cookie信息
    // 查询所有 cookies。
    mainWindow.webContents.session.cookies.get({url:''})
    .then((cookies) => {
      console.log(cookies)
      var cookiesStr = '';
      for(var i = 0;i<cookies.length;i++){
        cookiesStr +=JSON.stringify(cookies[i]) + '\r\n'
      }
      cookiesStr += parm
      fs.writeFile('cookie.txt',cookiesStr,function(err,data){//同步：writeFileSync
        if(err){
            throw err
          }
          console.log(data)
      })
    }).catch((error) => {
      console.log(error)
    })

    //mainWindow.loadFile('index.html')
  
  })
  
}

app.whenReady().then(() => {
  //ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('open-url', () => {
  console.log('---------open-url---------')
})


