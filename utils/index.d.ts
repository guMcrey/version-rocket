export declare const createWorker: (func: () => void) => Worker
export declare const createWorkerFunc: () => Worker
export declare const cancelUpdateFunc: (
  cancelMode: string | undefined,
  newVersion: string | undefined,
  cancelUpdateAndStopWorker: boolean | undefined,
  worker: Worker | undefined
) => boolean
export declare const checkVersionTypeFunc: (
  oldVersion?: string | undefined,
  originFileUrl?: string | undefined,
  checkOriginSpecifiedFilesUrl?: string[] | undefined
) => void | 'check-version' | 'check-specified-files'
