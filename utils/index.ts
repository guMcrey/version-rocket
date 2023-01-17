// create package version worker
export const createWorker = (func: () => void) => {
  const blob = new Blob(['(' + func.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}

export const createWorkerFunc = () => {
  let oldVersion = ''
  let intervalTime = 5000
  let immediate = false
  let originFileUrl = ''
  const temp: Worker = self as any
  temp.onmessage = (event: any) => {
    oldVersion = event.data['version-key']
    intervalTime = event.data['polling-time']
    immediate = event.data['immediate']
    originFileUrl = event.data['origin-version-file-url']

    const doFetch = () => {
      fetch(`${originFileUrl}?${+new Date()}`)
        .then((res) => {
          return res.json()
        })
        .then((versionJsonFile) => {
          if (oldVersion !== versionJsonFile.version) {
            temp.postMessage({
              refreshPageVersion: `${versionJsonFile.version}`,
            })
          }
        })
    }

    if (immediate) {
      doFetch()
    }
    setInterval(doFetch, intervalTime)
  }
  return temp
}

// cancel update
export const cancelUpdateFunc = (
  cancelMode: string | undefined,
  newVersion: string,
  cancelUpdateAndStopWorker: boolean | undefined,
  worker: Worker | undefined
) => {
  const cancelModeType = cancelMode || 'ignore-current-version'
  const cancelModeTypeValue =
    localStorage.getItem('version-rocket:cancelled') || ''
  const todayDate = new Date().toLocaleDateString() || ''
  const cancelModeTypeValueInSession =
    sessionStorage.getItem('version-rocket:cancelled') || ''
  const isStopWorker = cancelUpdateAndStopWorker || false

  switch (cancelModeType) {
    case 'ignore-current-version':
      if (cancelModeTypeValue === newVersion) {
        isStopWorker && worker?.terminate()
        return true
      }
      break
    case 'ignore-today':
      if (cancelModeTypeValue === todayDate) {
        isStopWorker && worker?.terminate()
        return true
      }
      break
    case 'ignore-current-window':
      if (cancelModeTypeValueInSession) {
        isStopWorker && worker?.terminate()
        return true
      }
      break
    default:
      break
  }

  return false
}
