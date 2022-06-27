/**
 * polling loop compare version
 * @param localPackageVersion: the current version of the page in the browser
 * @param originVersionFileUrl: remote server version file address
 * @param pollingTime: polling interval, in ms
 * @param onVersionUpdate?: callback when updating version, used when customizing UI
 * @return refreshPageVersion: new version number
 */
export declare const pollingCompareVersion: (localPackageVersion: string, originVersionFileUrl: string, pollingTime: number, onVersionUpdate?: ((event: any) => void) | undefined) => void;
