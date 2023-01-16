import versionBg from './../assets/version-bg.png'
import './version-tip-dialog.css'
import {setVersionTipTheme} from './versionTipTheme'
import {unCheckVersion} from '../index'

const defaultParams = {
  title: 'Update',
  description: 'is available',
  buttonText: 'Refresh',
}

export const versionTipDialog = (params: {
  title?: string
  description?: string
  buttonText?: string
  cancelButtonText?: string
  cancelMode?: string
  imageUrl?: string
  rocketColor?: string
  primaryColor?: string
  buttonStyle?: string
  newVersion: string
}) => {
  const dialogElement = document.querySelector('#version-rocket')
  if (dialogElement) return
  const template = `
   <div id="version-rocket">
        <div class="version-area">
            ${
              params.primaryColor || params.rocketColor
                ? `<div class="version-img">${setVersionTipTheme(
                    params.primaryColor,
                    params.rocketColor
                  )}</div>`
                : `<img class="version-img" src="${
                    params.imageUrl || versionBg
                  }" alt="version" />`
            } 
            <div class="version-content">
                <div class="version-title">
                  ${params.title || defaultParams.title}
                </div>
                <div class="version-subtitle">
                  ${
                    params.description ||
                    `V ${params.newVersion} ${defaultParams.description}`
                  }
                </div>
                <div style="${
                  params.primaryColor
                    ? `background-color: ${params.primaryColor};`
                    : ''
                } ${params.buttonStyle || ''}"  class="refresh-button">
                  ${params.buttonText || defaultParams.buttonText}
                </div>
                ${
                  params.cancelButtonText ?
                  `<div class="cancel-button">
                    ${params.cancelButtonText}
                  </div>` : ''
                }
            </div>
        </div>
   </div>`
  let rootNode = document.createElement('div')
  rootNode.innerHTML = template
  document.body.appendChild(rootNode)

  const refreshBtnNode = document.querySelector(
    '#version-rocket .refresh-button'
  ) as HTMLElement
  refreshBtnNode.onclick = () => {
    window.location.reload()
  }

  const cancelBtnNode = document.querySelector(
    '#version-rocket .cancel-button'
  ) as HTMLElement
  if (!cancelBtnNode) return

  cancelBtnNode.onclick = () => {
    const cancelMode = params?.cancelMode || 'ignore-current-version'
    switch (cancelMode) {
      case 'ignore-current-version':
        localStorage.setItem('version-rocket:cancelled', params.newVersion)
        break
      case 'ignore-today':
        localStorage.setItem('version-rocket:cancelled', new Date().toLocaleDateString())
        break
      case 'ignore-current-window':
        sessionStorage.setItem('version-rocket:cancelled', 'true')
        break
      default:
        break
    }

    unCheckVersion({closeDialog: true, closeWorker: false})
  }
}
