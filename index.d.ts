/**
 * Polling monitoring version update (No longer maintain)
 *
 * @param {string} localPackageVersion the current version of the page in the browser
 * @param {string} originVersionFileUrl remote server version file address
 * @param {number} [pollingTime = 5000] polling interval, in ms (Optional)
 * @param {function} onVersionUpdate callback when updating version, used when customizing UI (Optional)
 * @return {object}  { refreshPageVersion } new version number
 */
export declare const pollingCompareVersion: (localPackageVersion: string, originVersionFileUrl: string, pollingTime: number, onVersionUpdate?: ((event: any) => void) | undefined) => void;
export declare const checkVersion: (config: {
    checkOriginSpecifiedFilesUrl?: string[] | undefined;
    checkOriginSpecifiedFilesUrlMode?: "one" | "all" | undefined;
    originVersionFileUrl?: string | undefined;
    localPackageVersion?: string | undefined;
    pollingTime?: number | undefined;
    immediate?: boolean | undefined;
    enable?: boolean | undefined;
    clearIntervalOnDialog?: boolean | undefined;
    onVersionUpdate?: ((event: any) => void) | undefined;
    onRefresh?: ((event: any) => void) | undefined;
    onCancel?: ((event: any) => void) | undefined;
}, options?: {
    title?: string;
    description?: string;
    buttonText?: string;
    cancelButtonText?: string;
    cancelMode?: string;
    cancelUpdateAndStopWorker?: boolean;
    imageUrl?: string;
    rocketColor?: string;
    primaryColor?: string;
    buttonStyle?: string;
}) => void;
/**
 * destroy checkVersion
 */
export declare const unCheckVersion: ({ closeDialog, closeWorker }: {
    closeDialog?: boolean | undefined;
    closeWorker?: boolean | undefined;
}) => void;
