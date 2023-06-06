const _global: any =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
    ? window
    : {}

export const mockCreateObjectUrl = () => {
  if (!_global.window) {
    _global.window = Object.create(window)
  }
  Object.defineProperty(window, 'URL', {
    value: {
      createObjectURL: (blob: Blob): string =>
        '7584ef69-b1ca-46aa-95ac-35472a7a6b06',
    },
  })
}

export const mockWorker = () => {
  class Worker {
    url: string
    onmessage: (msg: string) => void
    constructor(url: string) {
      this.url = url
      this.onmessage = () => {}
    }
    postMessage(msg: string) {
      this.onmessage(msg)
    }
    terminate() {
      console.log('stop')
    }
  }

  if (!_global.window) {
    _global.window = Object.create(window)
  }

  window.Worker = Worker as any
}

export const mockSetInterval = () => {
  if (!_global.window) {
    ;(_global as any).window = Object.create(window)
  }
  ;(window as any).setInterval = (func: () => void) => {
    func()
  }
}

export const mockFetch = () => {
  if (!_global.window) {
    _global.window = Object.create(window) as any
  }

  ;(window as any).fetch = (url: string) => {
    return new Promise((resolve, reject) => {
      resolve({
        json: () => {
          return Promise.resolve({version: '1.2.0'})
        },
      })
    })
  }
}

export const mockDateToLocaleDateString = () => {
  if (!_global.window) {
    _global.window = Object.create(window)
  }
  class MyDate {
    toLocaleDateString() {
      return '2023/1/18'
    }
  }
  Object.defineProperty(window, 'Date', {
    value: MyDate,
  })
}
