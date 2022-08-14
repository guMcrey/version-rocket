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
    let originFileUrl = '';
    const temp = self;
    temp.onmessage = (event) => {
        oldVersion = event.data['version-key'];
        intervalTime = event.data['polling-time'];
        originFileUrl = event.data['origin-version-file-url'];
        setInterval(() => {
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
        }, intervalTime);
    };
    return temp;
};
