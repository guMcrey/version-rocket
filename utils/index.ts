// create package version worker
export const createWorker = (func: () => void) => {
  const blob = new Blob(['(' + func.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}

export const createWorkerFunc = () => {
  let oldVersion = ''
  const flagSet = new Set()
  let intervalTime = 5000
  let immediate = false
  let originFileUrl = ''
  let checkOriginSpecifiedFilesUrl: string[] = []
  let checkOriginSpecifiedFilesUrlMode: 'one' | 'all' = 'one'
  // TODO: 类型定义
  let timer: any = null
  let clearIntervalOnDialog = false
  const temp: Worker = self as any
  temp.onmessage = (event: any) => {
    oldVersion = event.data['version-key']
    intervalTime = event.data['polling-time']
    immediate = event.data['immediate']
    originFileUrl = event.data['origin-version-file-url']
    checkOriginSpecifiedFilesUrl =
      event.data['check-origin-specified-files-url']
    checkOriginSpecifiedFilesUrlMode =
      event.data['check-origin-specified-files-url-mode']
    clearIntervalOnDialog = event.data['clear-interval-on-dialog']

    const checkVersionType =
      oldVersion && originFileUrl
        ? 'check-version'
        : checkOriginSpecifiedFilesUrl?.length
        ? 'check-specified-files'
        : ''

    if (!checkVersionType)
      return console.warn(
        'Not found localPackageVersion, originVersionFileUrl or originSpecifiedFilesUrl'
      )
    console.log('You are use check version type is', checkVersionType)

    const doFetch = () => {
      if (checkVersionType === 'check-version') {
        fetch(`${originFileUrl}?${+new Date()}`)
          .then((res) => {
            return res.json()
          })
          .then((versionJsonFile) => {
            if (oldVersion !== versionJsonFile.version) {
              temp.postMessage({
                refreshPageVisible: true,
                refreshPageVersion: `${versionJsonFile.version}`,
                external: versionJsonFile.external,
              })
              if (clearIntervalOnDialog) {
                clearInterval(timer)
              }
            }
          })
      }

      if (checkVersionType === 'check-specified-files') {
        if (!checkOriginSpecifiedFilesUrl?.length) return
        checkOriginSpecifiedFilesUrl.forEach((url: string) => {
          fetch(url)
            .then((res) => {
              return res.headers.get('ETag') || res.headers.get('Last-Modified')
            })
            .then((flag: string | null) => {
              if (flag) {
                console.log('flag', flag, flagSet)
                flagSet.add(flag)
              }

              // TODO: 第一次轮训不生效, 需要第二次轮训才生效, 需要考虑如果用户的循环时间很长怎么办
              if (
                checkOriginSpecifiedFilesUrlMode === 'one' &&
                flagSet?.size > checkOriginSpecifiedFilesUrl?.length
              ) {
                temp.postMessage({
                  refreshPageVisible: true,
                  refreshPageVersion: '',
                  // TODO: 本版本的修改内容
                  external: '',
                })
                flagSet.clear()
                if (clearIntervalOnDialog) {
                  clearInterval(timer)
                }
              }

              if (
                checkOriginSpecifiedFilesUrlMode === 'all' &&
                flagSet?.size === checkOriginSpecifiedFilesUrl?.length * 2
              ) {
                temp.postMessage({
                  refreshPageVisible: true,
                  refreshPageVersion: '',
                  // TODO: 本版本的修改内容
                  external: '',
                })
                flagSet.clear()
                if (clearIntervalOnDialog) {
                  clearInterval(timer)
                }
              }
            })
        })
      }
    }

    if (immediate) {
      doFetch()
    }
    timer = setInterval(doFetch, intervalTime)
  }
  return temp
}

// cancel update
export const cancelUpdateFunc = (
  cancelMode: string | undefined,
  newVersion: string | undefined,
  cancelUpdateAndStopWorker: boolean | undefined,
  worker: Worker | undefined
) => {
  const cancelModeType =
    cancelMode ||
    (newVersion ? 'ignore-current-version' : 'ignore-current-window')
  const cancelModeTypeValue =
    localStorage.getItem('version-rocket:cancelled') || ''
  const todayDate = new Date().toLocaleDateString()
  const cancelModeTypeValueInSession =
    sessionStorage.getItem('version-rocket:cancelled') || ''
  const isStopWorker = cancelUpdateAndStopWorker || false

  switch (cancelModeType) {
    case 'ignore-current-version':
      if (newVersion && cancelModeTypeValue === newVersion) {
        isStopWorker && worker?.terminate()
        return true
      }
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
