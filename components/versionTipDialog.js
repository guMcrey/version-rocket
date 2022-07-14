import versionBg from './../assets/version-bg.png';
import './version-tip-dialog.css';
import { setVersionTipTheme } from './versionTipTheme';
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
        `V ${params.newVersion} ${defaultParams.description}`}
                </div>
                <div style="${params.primaryColor
        ? `background-color: ${params.primaryColor};`
        : ''} ${params.buttonStyle || ''}"  class="refresh-button">
                  ${params.buttonText || defaultParams.buttonText}
                </div>
            </div>
        </div>
   </div>`;
    let rootNode = document.createElement('div');
    rootNode.innerHTML = template;
    document.body.appendChild(rootNode);
    const refreshBtnNode = document.querySelector('#version-rocket .refresh-button');
    refreshBtnNode.onclick = () => {
        window.location.reload();
    };
};
