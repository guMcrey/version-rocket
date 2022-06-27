import versionBg from './version-bg.png'
import './version-tip-dialog.css'

export const versionTipDialog = (newVersion: string) => {
  const dialogElement = document.querySelector('#version-rocket')
  if (dialogElement) return
  const template = `
   <div id="version-rocket">
        <div class="version-area">
            <img class="version-img" src="${versionBg}" alt="version" />
            <div class="version-content">
                <div class="version-title">Update</div>
                <div class="version-subtitle">V ${newVersion} is available</div>
                <div class="refresh-button">Refresh</div>
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
}
