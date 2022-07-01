import {versionTipDialog} from './components/versionTipDialog'

// create package version worker
function createWorker(f: () => void) {
  const blob = new Blob(['(' + f.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}

/**
 * polling loop compare version
 * @param localPackageVersion: the current version of the page in the browser
 * @param originVersionFileUrl: remote server version file address
 * @param pollingTime: polling interval, in ms
 * @param onVersionUpdate?: callback when updating version, used when customizing UI
 * @return refreshPageVersion: new version number
 */

export const pollingCompareVersion = (
  localPackageVersion: string,
  originVersionFileUrl: string,
  pollingTime: number,
  onVersionUpdate?: (event: any) => void
) => {
  const worker = createWorker(() => {
    let oldVersion = ''
    let intervalTime = 5000
    let originFileUrl = ''
    const temp: Worker = self as any
    temp.onmessage = (event: any) => {
      oldVersion = event.data['version-key']
      intervalTime = event.data['polling-time']
      originFileUrl = event.data['origin-version-file-url']

      setInterval(() => {
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
      }, intervalTime)
    }
  })

  worker.postMessage({
    'version-key': localPackageVersion,
    'polling-time': pollingTime,
    'origin-version-file-url': originVersionFileUrl,
  })
  worker.onmessage = (event: any) => {
    // custom version tip UI
    if (typeof onVersionUpdate === 'function') {
      onVersionUpdate(event.data)
    } else {
      // default version tip ui
      versionTipDialog(event.data.refreshPageVersion)
    }
  }
}
