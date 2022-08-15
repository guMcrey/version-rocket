import { versionTipDialog } from './components/versionTipDialog';
import { createWorker, createWorkerFunc } from './utils/index';
/**
 * Polling monitoring version update (No longer maintain)
 *
 * @param {string} localPackageVersion the current version of the page in the browser
 * @param {string} originVersionFileUrl remote server version file address
 * @param {number} [pollingTime = 5000] polling interval, in ms (Optional)
 * @param {function} onVersionUpdate callback when updating version, used when customizing UI (Optional)
 * @return {object}  { refreshPageVersion } new version number
 */
export const pollingCompareVersion = (localPackageVersion, originVersionFileUrl, pollingTime, onVersionUpdate) => {
    const worker = createWorker(createWorkerFunc);
    worker.postMessage({
        'version-key': localPackageVersion,
        'polling-time': pollingTime,
        'origin-version-file-url': originVersionFileUrl,
    });
    worker.onmessage = (event) => {
        // custom version tip UI
        if (typeof onVersionUpdate === 'function') {
            onVersionUpdate(event.data);
        }
        else {
            // default version tip ui
            versionTipDialog({ newVersion: event.data.refreshPageVersion });
        }
    };
};
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
export const checkVersion = (config, options) => {
    const worker = createWorker(createWorkerFunc);
    worker.postMessage({
        'version-key': config.localPackageVersion,
        'polling-time': config.pollingTime || 5000,
        'origin-version-file-url': config.originVersionFileUrl,
    });
    worker.onmessage = (event) => {
        // custom version tip UI
        if (typeof config.onVersionUpdate === 'function') {
            config.onVersionUpdate(event.data);
        }
        else {
            // default version tip ui
            const { title, description, buttonText, imageUrl, rocketColor, primaryColor, buttonStyle, } = options || {};
            versionTipDialog({
                title,
                description,
                buttonText,
                imageUrl,
                rocketColor,
                primaryColor,
                buttonStyle,
                newVersion: event.data.refreshPageVersion,
            });
        }
    };
};
