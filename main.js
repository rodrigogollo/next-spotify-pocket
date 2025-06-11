const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 480,
    height: 640,
    autoHideMenuBar: true,
    transparent:true,
  })
  win.setResizable(false)

  win.loadFile('src/page.tsx')
  win.loadURL("http://localhost:1420")
}

app.whenReady().then(() => {
  createWindow()
})