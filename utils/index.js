// create package version worker
export const createWorker = (func) => {
    const blob = new Blob(['(' + func.toString() + ')()']);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);
    return worker;
};
export const createWorkerFunc = () => {
    let oldVersion = '';
    let intervalTime = 5000;
    let immediate = false;
    let originFileUrl = '';
    const temp = self;
    temp.onmessage = (event) => {
        oldVersion = event.data['version-key'];
        intervalTime = event.data['polling-time'];
        immediate = event.data['immediate'];
        originFileUrl = event.data['origin-version-file-url'];
        const doFetch = () => {
            fetch(`${originFileUrl}?${+new Date()}`)
                .then((res) => {
                return res.json();
            })
                .then((versionJsonFile) => {
                if (oldVersion !== versionJsonFile.version) {
                    temp.postMessage({
                        refreshPageVersion: `${versionJsonFile.version}`,
                    });
                }
            });
        };
        if (immediate) {
            doFetch();
        }
        setInterval(doFetch, intervalTime);
    };
    return temp;
};
