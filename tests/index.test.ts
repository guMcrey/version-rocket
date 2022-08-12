/**
 * @jest-environment jsdom
 */

import {createWorker} from '../utils/index'
import {mockCreateObjectUrl, mockWorker} from './index.mock'

test('create web worker', () => {
  mockCreateObjectUrl()
  mockWorker()
  expect(createWorker(() => console.log(1)) instanceof Worker).toBeTruthy()
})
