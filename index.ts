import {versionTipDialog} from './components/versionTipDialog'

// create package version worker
function createWorker(f: () => void) {
  const blob = new Blob(['(' + f.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}

/**
 * Polling monitoring version update (No longer maintain)
 *
 * @param {string} localPackageVersion the current version of the page in the browser
 * @param {string} originVersionFileUrl remote server version file address
 * @param {number} [pollingTime = 5000] polling interval, in ms (Optional)
 * @param {function} onVersionUpdate callback when updating version, used when customizing UI (Optional)
 * @return {object}  { refreshPageVersion } new version number
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

/**
 * Polling monitoring version update v2 (Recommended)
 *
 * @param {object} config Polling the configuration parameters of the monitoring version
 * @param {string} config.originVersionFileUrl remote server version file address (Required)
 * @param {string} config.localPackageVersion  the current version of the page in the browser
 * @param {number} [config.pollingTime = 5000] polling interval, in ms (Optional)
 * @param {function} config.onVersionUpdate callback when updating version, used when customizing UI (Optional)
 *
 * @param {object} options Customize version update popup copy and themes
 * @param {string} [options.title = 'Update'] popup title (Optional)
 * @param {string} [options.description = 'V xxx is available'] popup description (Optional)
 * @param {string} [options.buttonText = 'Refresh'] popup button text (Optional)
 * @param {string} options.imageUrl custom popup image address (Optional)
 * @param {string} options.rocketColor custom popup rocket color in the picture (Optional)
 * @param {string} options.primaryColor custom popup primary color, act on image background color and button background color (Optional)
 * @param {string} options.buttonStyle custom popup button style (Optional)
 *
 * @return {object}  { refreshPageVersion } new version number
 */

export const checkVersion = (
  config: {
    originVersionFileUrl: string
    localPackageVersion: string
    pollingTime?: number
    onVersionUpdate?: (event: any) => void
  },
  options?: {
    title?: string
    description?: string
    buttonText?: string
    imageUrl?: string
    rocketColor?: string
    primaryColor?: string
    buttonStyle?: string
  }
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
    'version-key': config.localPackageVersion,
    'polling-time': config.pollingTime || 5000,
    'origin-version-file-url': config.originVersionFileUrl,
  })
  worker.onmessage = (event: any) => {
    // custom version tip UI
    if (typeof config.onVersionUpdate === 'function') {
      config.onVersionUpdate(event.data)
    } else {
      // default version tip ui
      const {
        title,
        description,
        buttonText,
        imageUrl,
        rocketColor,
        primaryColor,
        buttonStyle,
      } = options || {}
      versionTipDialog({
        title,
        description,
        buttonText,
        imageUrl,
        rocketColor,
        primaryColor,
        buttonStyle,
        newVersion: event.data.refreshPageVersion,
      })
    }
  }
}
