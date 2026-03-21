import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'

function registerAutoUpdater(mainWindow: BrowserWindow): void {
  autoUpdater.autoDownload = false

  autoUpdater.on('error', (error) => {
    const errMessage = error == null ? 'Unknown error' : `${error.name}: ${error.message}`
    console.error('Auto updater error:', errMessage)
    // Only show error dialog for unexpected errors, not for missing latest.yml during development
    if (!errMessage.includes('latest.yml') && !errMessage.includes('404')) {
      dialog.showErrorBox('Update Error', errMessage)
    }
  })

  autoUpdater.on('update-available', (info) => {
    const result = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      title: 'Update available',
      message: `A new version (${info.version}) is available.`,
      detail: 'Do you want to download it now?',
      buttons: ['Download', 'Later'],
      defaultId: 0,
      cancelId: 1,
    })
    if (result === 0) {
      autoUpdater.downloadUpdate()
    }
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No updates available')
  })

  autoUpdater.on('download-progress', (progress) => {
    console.log(`Download progress: ${progress.percent?.toFixed(1)}%`)
  })

  autoUpdater.on('update-downloaded', () => {
    const result = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      title: 'Update ready',
      message: 'The update has been downloaded. Restart to install now?',
      buttons: ['Restart', 'Later'],
      defaultId: 0,
      cancelId: 1,
    })
    if (result === 0) {
      autoUpdater.quitAndInstall()
    }
  })
}

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  registerAutoUpdater(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.folio')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // IPC handler for app version
  ipcMain.handle('get-app-version', () => app.getVersion())

  createWindow()

  // Start auto-update check on app start (only in production builds)
  if (!is.dev) {
    autoUpdater.checkForUpdates().catch((err) => {
      console.warn('Error checking for updates:', err)
    })
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
