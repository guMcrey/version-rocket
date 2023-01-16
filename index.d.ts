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
    originVersionFileUrl: string;
    localPackageVersion: string;
    pollingTime?: number | undefined;
    immediate?: boolean | undefined;
    onVersionUpdate?: ((event: any) => void) | undefined;
}, options?: {
    title?: string;
    description?: string;
    buttonText?: string;
    imageUrl?: string;
    rocketColor?: string;
    primaryColor?: string;
    buttonStyle?: string;
}) => void;
/**
 * destroy checkVersion
 */
export declare const unCheckVersion: ({ closeDialog }: {
    closeDialog?: boolean | undefined;
}) => void;
