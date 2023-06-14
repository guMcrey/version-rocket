// create package version worker
export const createWorker = (func) => {
    const blob = new Blob(['(' + func.toString() + ')()']);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);
    return worker;
};
export const createWorkerFunc = () => {
    let oldVersion = '';
    const flagSet = new Set();
    let intervalTime = 5000;
    let immediate = false;
    let originFileUrl = '';
    let checkOriginSpecifiedFilesUrl = [];
    let checkOriginSpecifiedFilesUrlMode = 'one';
    // TODO: 类型定义
    let timer = null;
    let clearIntervalOnDialog = false;
    const temp = self;
    temp.onmessage = (event) => {
        oldVersion = event.data['version-key'];
        intervalTime = event.data['polling-time'];
        immediate = event.data['immediate'];
        originFileUrl = event.data['origin-version-file-url'];
        checkOriginSpecifiedFilesUrl =
            event.data['check-origin-specified-files-url'];
        checkOriginSpecifiedFilesUrlMode =
            event.data['check-origin-specified-files-url-mode'];
        clearIntervalOnDialog = event.data['clear-interval-on-dialog'];
        const checkVersionType = oldVersion && originFileUrl
            ? 'check-version'
            : (checkOriginSpecifiedFilesUrl === null || checkOriginSpecifiedFilesUrl === void 0 ? void 0 : checkOriginSpecifiedFilesUrl.length)
                ? 'check-specified-files'
                : '';
        if (!checkVersionType)
            return console.warn('Not found localPackageVersion, originVersionFileUrl or originSpecifiedFilesUrl');
        console.log('You are use check version type is', checkVersionType);
        const doFetch = () => {
            if (checkVersionType === 'check-version') {
                fetch(`${originFileUrl}?${+new Date()}`)
                    .then((res) => {
                    return res.json();
                })
                    .then((versionJsonFile) => {
                    if (oldVersion !== versionJsonFile.version) {
                        temp.postMessage({
                            refreshPageVisible: true,
                            refreshPageVersion: `${versionJsonFile.version}`,
                            external: versionJsonFile.external,
                        });
                        if (clearIntervalOnDialog) {
                            clearInterval(timer);
                        }
                    }
                });
            }
            if (checkVersionType === 'check-specified-files') {
                if (!(checkOriginSpecifiedFilesUrl === null || checkOriginSpecifiedFilesUrl === void 0 ? void 0 : checkOriginSpecifiedFilesUrl.length))
                    return;
                checkOriginSpecifiedFilesUrl.forEach((url) => {
                    fetch(url)
                        .then((res) => {
                        return res.headers.get('ETag') || res.headers.get('Last-Modified');
                    })
                        .then((flag) => {
                        if (flag) {
                            flagSet.add(flag);
                        }
                        if (checkOriginSpecifiedFilesUrlMode === 'one' &&
                            (flagSet === null || flagSet === void 0 ? void 0 : flagSet.size) > (checkOriginSpecifiedFilesUrl === null || checkOriginSpecifiedFilesUrl === void 0 ? void 0 : checkOriginSpecifiedFilesUrl.length)) {
                            temp.postMessage({
                                refreshPageVisible: true,
                                refreshPageVersion: '',
                                external: '',
                            });
                            flagSet.clear();
                            if (clearIntervalOnDialog) {
                                clearInterval(timer);
                            }
                        }
                        if (checkOriginSpecifiedFilesUrlMode === 'all' &&
                            (flagSet === null || flagSet === void 0 ? void 0 : flagSet.size) === (checkOriginSpecifiedFilesUrl === null || checkOriginSpecifiedFilesUrl === void 0 ? void 0 : checkOriginSpecifiedFilesUrl.length) * 2) {
                            temp.postMessage({
                                refreshPageVisible: true,
                                refreshPageVersion: '',
                                external: '',
                            });
                            flagSet.clear();
                            if (clearIntervalOnDialog) {
                                clearInterval(timer);
                            }
                        }
                    });
                });
            }
        };
        if (immediate) {
            doFetch();
        }
        timer = setInterval(doFetch, intervalTime);
    };
    return temp;
};
// cancel update
export const cancelUpdateFunc = (cancelMode, newVersion, cancelUpdateAndStopWorker, worker) => {
    const cancelModeType = cancelMode ||
        (newVersion ? 'ignore-current-version' : 'ignore-current-window');
    const cancelModeTypeValue = localStorage.getItem('version-rocket:cancelled') || '';
    const todayDate = new Date().toLocaleDateString();
    const cancelModeTypeValueInSession = sessionStorage.getItem('version-rocket:cancelled') || '';
    const isStopWorker = cancelUpdateAndStopWorker || false;
    switch (cancelModeType) {
        case 'ignore-current-version':
            if (newVersion && cancelModeTypeValue === newVersion) {
                isStopWorker && (worker === null || worker === void 0 ? void 0 : worker.terminate());
                return true;
            }
        case 'ignore-today':
            if (cancelModeTypeValue === todayDate) {
                isStopWorker && (worker === null || worker === void 0 ? void 0 : worker.terminate());
                return true;
            }
            break;
        case 'ignore-current-window':
            if (cancelModeTypeValueInSession) {
                isStopWorker && (worker === null || worker === void 0 ? void 0 : worker.terminate());
                return true;
            }
            break;
        default:
            break;
    }
    return false;
};
