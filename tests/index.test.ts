/**
 * @jest-environment jsdom
 */

import {
  createWorker,
  createWorkerFunc,
  cancelUpdateFunc,
  checkVersionTypeFunc,
} from '../utils/index'
import {
  mockCreateObjectUrl,
  mockWorker,
  mockSetInterval,
  mockFetch,
  mockDateToLocaleDateString,
  mockFetchHeader,
} from './index.mock'

test('create web worker', () => {
  mockCreateObjectUrl()
  mockWorker()
  expect(createWorker(() => console.log(1)) instanceof Worker).toBeTruthy()
})

test('create worker function', () => {
  mockSetInterval()
  mockFetch()
  const temp = createWorkerFunc() as any
  temp.onmessage({
    data: {
      'version-key': '1.1.0',
      'polling-time': 0,
      immediate: false,
      'origin-version-file-url': 'https://www.example.com',
      'clear-interval-on-dialog': true,
    },
  })

  temp.postMessage = (obj: {refreshPageVersion: string}) => {
    expect(typeof obj === 'object' && obj.refreshPageVersion).toBeTruthy()
  }
})

test('cancel update function', () => {
  mockWorker()
  const worker = new Worker('https://test.com')

  // ignore-current-version -> true
  localStorage.setItem('version-rocket:cancelled', '1.0.0')
  expect(
    cancelUpdateFunc('ignore-current-version', '1.0.0', true, worker)
  ).toBeTruthy()
  expect(
    cancelUpdateFunc('ignore-current-version', '1.0.0', true, undefined)
  ).toBeTruthy()
  expect(cancelUpdateFunc(undefined, '1.0.0', true, undefined)).toBeTruthy()

  // ignore-current-version -> false
  localStorage.setItem('version-rocket:cancelled', '1.1.0')
  expect(
    cancelUpdateFunc('ignore-current-version', '1.0.0', false, worker)
  ).toBeFalsy()

  // ignore-today -> true
  mockDateToLocaleDateString()
  localStorage.setItem('version-rocket:cancelled', '2023/1/18')
  expect(cancelUpdateFunc('ignore-today', '1.0.0', true, worker)).toBeTruthy()
  expect(
    cancelUpdateFunc('ignore-today', '1.0.0', true, undefined)
  ).toBeTruthy()

  // ignore-today -> false
  localStorage.setItem('version-rocket:cancelled', '2023/1/19')
  expect(cancelUpdateFunc('ignore-today', '1.0.0', false, worker)).toBeFalsy()

  // ignore-current-version -> true
  sessionStorage.setItem('version-rocket:cancelled', 'true')
  expect(
    cancelUpdateFunc('ignore-current-window', '1.0.0', true, worker)
  ).toBeTruthy()
  expect(
    cancelUpdateFunc('ignore-current-window', '1.0.0', true, undefined)
  ).toBeTruthy()

  // ignore-current-version -> false
  sessionStorage.setItem('version-rocket:cancelled', '')
  expect(
    cancelUpdateFunc('ignore-current-window', '1.0.0', false, worker)
  ).toBeFalsy()

  // default
  expect(cancelUpdateFunc('ignore-test', '1.0.0', false, worker)).toBeFalsy()

  // no args
  localStorage.setItem('version-rocket:cancelled', '1.1.0')
  expect(cancelUpdateFunc(undefined, '', undefined, undefined)).toBeFalsy()

  localStorage.setItem('version-rocket:cancelled', '')
  expect(cancelUpdateFunc('ignore-today', '', undefined, undefined)).toBeFalsy()

  sessionStorage.setItem('version-rocket:cancelled', '')
  expect(cancelUpdateFunc('ignore-today', '', undefined, undefined)).toBeFalsy()
})

test('check version type', () => {
  // check-version
  expect(
    checkVersionTypeFunc('1.0.0', 'https://test.com/version.json')
  ).toEqual('check-version')

  // check-specific-files
  expect(checkVersionTypeFunc('', '', ['https://test.com/index.html'])).toEqual(
    'check-specified-files'
  )

  // undefined
  expect(checkVersionTypeFunc('', '', [])).toEqual(undefined)
  expect(checkVersionTypeFunc()).toEqual(undefined)
})

test('check origin specified files url one mode', async () => {
  mockSetInterval()
  mockFetchHeader()

  const temp = createWorkerFunc() as any
  temp.onmessage({
    data: {
      'polling-time': 0,
      immediate: true,
      'check-origin-specified-files-url': [
        'https://www.example.com/index.html',
      ],
      'check-origin-specified-files-url-mode': 'one',
      'clear-interval-on-dialog': true,
    },
  })

  temp.postMessage = (obj: {
    refreshPageVisible: string
    refreshPageVersion: string
    external: string
  }) => {
    expect(
      typeof obj === 'object' &&
        obj.refreshPageVisible &&
        obj.refreshPageVersion === '' &&
        obj.external === ''
    ).toBeTruthy()
  }
})

test('check origin specified files url all mode', async () => {
  mockSetInterval()
  mockFetchHeader()

  const temp = createWorkerFunc() as any
  temp.onmessage({
    data: {
      'version-key': '1.1.0',
      'polling-time': 0,
      immediate: true,
      'check-origin-specified-files-url': [
        'https://www.example.com/index.html',
        'https://www.example.com/index.html?useEtag',
      ],
      'check-origin-specified-files-url-mode': 'all',
      'clear-interval-on-dialog': true,
    },
  })

  temp.postMessage = (obj: {
    refreshPageVisible: string
    refreshPageVersion: string
    external: string
  }) => {
    console.log('obj', obj)
    expect(
      typeof obj === 'object' &&
        obj.refreshPageVisible &&
        obj.refreshPageVersion === '' &&
        obj.external === ''
    ).toBeTruthy()
  }
})

test('Not found localPackageVersion, originVersionFileUrl or originSpecifiedFilesUrl', async () => {
  mockSetInterval()
  mockFetchHeader()

  const temp = createWorkerFunc() as any
  temp.postMessage = (obj: {invalidParams}) => {
    expect(typeof obj === 'object' && obj.invalidParams).toBeTruthy()
  }

  temp.onmessage({
    data: {
      'version-key': '',
      'polling-time': 0,
      immediate: true,
      'check-origin-specified-files-url-mode': 'all',
    },
  })
})
