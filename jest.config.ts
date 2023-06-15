import type {Config} from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  testPathIgnorePatterns: ['node_modules', '.history'],
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['node_modules', '\\.mock\\.ts$'],
}
export default config
