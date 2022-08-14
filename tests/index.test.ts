/**
 * @jest-environment jsdom
 */

import {createWorker, createWorkerFunc} from '../utils/index'
import {
  mockCreateObjectUrl,
  mockWorker,
  mockSetInterval,
  mockFetch,
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
      'origin-version-file-url': 'https://www.example.com',
    },
  })
  temp.postMessage = (obj: {refreshPageVersion: string}) => {
    expect(typeof obj === 'object' && obj.refreshPageVersion).toBeTruthy()
  }
})
