// create package version worker
export const createWorker = (func: () => void) => {
  const blob = new Blob(['(' + func.toString() + ')()'])
  const url = window.URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}
