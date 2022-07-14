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
/**
 * Polling monitoring version update v2 (Recommended)
 *
 * @param {object} config Polling the configuration parameters of the monitoring version
 * @param {string} config.originVersionFileUrl remote server version file address (Required)
 * @param {string} config.localPackageVersion  the current version of the page in the browser
 * @param {number} [config.pollingTime = 5000] polling interval, in ms (Optional)
 * @param {function} config.onVersionUpdate callback when updating version, used when customizing UI (Optional)
 *
 * @param {object} options Customize version update popup copy and themes
 * @param {string} [options.title = 'Update'] popup title (Optional)
 * @param {string} [options.description = 'V xxx is available'] popup description (Optional)
 * @param {string} [options.buttonText = 'Refresh'] popup button text (Optional)
 * @param {string} options.imageUrl custom popup image address (Optional)
 * @param {string} options.rocketColor custom popup rocket color in the picture (Optional)
 * @param {string} options.primaryColor custom popup primary color, act on image background color and button background color (Optional)
 * @param {string} options.buttonStyle custom popup button style (Optional)
 *
 * @return {object}  { refreshPageVersion } new version number
 */
export declare const checkVersion: (config: {
    originVersionFileUrl: string;
    localPackageVersion: string;
    pollingTime?: number | undefined;
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
