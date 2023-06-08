import versionBg from './../assets/version-bg.png';
import './version-tip-dialog.css';
import { setVersionTipTheme } from './versionTipTheme';
import { unCheckVersion } from '../index';
const defaultParams = {
    title: 'Update',
    description: 'is available',
    buttonText: 'Refresh',
};
export const versionTipDialog = (params) => {
    const dialogElement = document.querySelector('#version-rocket');
    if (dialogElement)
        return;
    const template = `
   <div id="version-rocket">
        <div class="version-area">
            ${params.primaryColor || params.rocketColor
        ? `<div class="version-img">${setVersionTipTheme(params.primaryColor, params.rocketColor)}</div>`
        : `<img class="version-img" src="${params.imageUrl || versionBg}" alt="version" />`} 
            <div class="version-content">
                <div class="version-title">
                  ${params.title || defaultParams.title}
                </div>
                <div class="version-subtitle">
                  ${params.description ||
        (params.newVersion
            ? `V ${params.newVersion} ${defaultParams.description}`
            : `A new version ${defaultParams.description}`)}
                </div>
                <div style="${params.primaryColor
        ? `background-color: ${params.primaryColor};`
        : ''} ${params.buttonStyle || ''}"  class="refresh-button">
                  ${params.buttonText || defaultParams.buttonText}
                </div>
                ${params.cancelButtonText
        ? `<div class="cancel-button">
                    ${params.cancelButtonText}
                  </div>`
        : ''}
            </div>
        </div>
   </div>`;
    let rootNode = document.createElement('div');
    rootNode.innerHTML = template;
    document.body.appendChild(rootNode);
    // refresh
    const refreshBtnNode = document.querySelector('#version-rocket .refresh-button');
    refreshBtnNode.onclick = () => {
        if (typeof (params === null || params === void 0 ? void 0 : params.onRefresh) === 'function') {
            params.onRefresh({
                newVersion: params.newVersion,
                needRefresh: params.needRefresh || false,
            });
        }
        else {
            window.location.reload();
        }
    };
    // cancel
    const cancelBtnNode = document.querySelector('#version-rocket .cancel-button');
    if (!cancelBtnNode)
        return;
    cancelBtnNode.onclick = () => {
        if (typeof (params === null || params === void 0 ? void 0 : params.onCancel) === 'function') {
            params.onCancel({
                newVersion: params.newVersion,
                needRefresh: params.needRefresh || false,
            });
            return;
        }
        const cancelMode = (params === null || params === void 0 ? void 0 : params.cancelMode) || 'ignore-current-version';
        switch (cancelMode) {
            case 'ignore-current-version':
                localStorage.setItem('version-rocket:cancelled', params.newVersion || '');
                break;
            case 'ignore-today':
                localStorage.setItem('version-rocket:cancelled', new Date().toLocaleDateString());
                break;
            case 'ignore-current-window':
                sessionStorage.setItem('version-rocket:cancelled', 'true');
                break;
            default:
                break;
        }
        unCheckVersion({ closeDialog: true, closeWorker: false });
    };
};
