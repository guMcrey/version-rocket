# 🔔 version-rocket 🚀

简体中文 | [English](./README.md)

一个用于 web 应用检测版本更新的小工具。
<br/>

**经常会发生这样的情况:** 当用户在浏览器中打开某 web 应用较长时间且未刷新页面, 在应用有新版本更新或问题修复时, 用户会无法及时知晓有新版发布, 导致用户继续使用旧的版本, 影响用户体验和后端数据准确性。

**在团队合作中可能会有这样的情况**: 你作为前端工程师, 在联调测试或部署上线时, 每次部署后都需要跟团队成员口头传达已经部署成功, 增加了沟通成本, 不够自动化, 也没有部署记录以有迹可循。

使用 **version-rocket** 可以帮你解决以上困扰。

## 简介

**version-rocket** 将用户当前浏览器中的版本与远程服务器中的版本文件进行比较。

如果有新的版本发布，将在页面中展示一个新版本更新提示弹窗，用户可以通过点击刷新按钮来更新版本。另外，**version-rocket** 也可传入一个回调函数来自定义版本更新提示界面。

我们使用基于 javascript 的 **Web Worker API** 来做监测轮询，不会影响浏览器渲染进程。

---

另外, 如果你所在的团队, 使用 Lark 或 飞书来团队协作, **version-rocket** 可以帮你推送“部署成功”的消息到 Lark 群聊中 (通过 Lark 机器人)。 使用方法非常快捷简单, 使用方法见下文。

*如果有其他平台的推送需求, 可以提 issue*

## 功能特点

- 支持所有现代浏览器
- 可用版本实时监测
- 部署成功后，将部署消息同步到 Lark 群聊
- 版本提示界面支持自定义，部署信息卡片的内容也可以自定义
- [支持 Npm 安装](https://www.npmjs.com/package/version-rocket)

## 效果截图

- **第一张图:** 当有新版本更新时, 及时提醒用户刷新页面的功能弹窗。
- **第二张图:** 在项目成功部署后，部署信息将被发送到群聊，以通知团队成员, 卡片文案通过一个 json 文件来配置, 请参见下文。
- **第三张图:** 基于第二张图片的可选设置, 可以配置是否要@全员, 设置后所有人会收到提示。

<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/available-version-tips.gif?raw=true" />
<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/deploy-success-message.jpg?raw=true" />
<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/deploy-success-message-with-all.jpg?raw=true" />

## 使用方法

### Npm 安装 version-rocket 包
```shell
npm install version-rocket -S
```

### 开始使用

```javascript

// 1. 导入 version-rocket 包的 pollingCompareVersion 方法, 并调用
import { pollingCompareVersion } from 'version-rocket'
import { version } from '../package.json'

/**
 * @参数 1: 当前应用版本号, 通常取 package.json 的 version 字段
 * @参数 2: 远程服务器上的 version.json 文件路径
 * @参数 3: 轮询监测的时间间隔(毫秒)，默认为 5000 毫秒 (比较当前应用版本号和远程服务器中 version.json 中的版本号是否相同, 不同时展示版本更新弹窗。)
 * @参数 4: 自定义版本提示 UI 的回调函数 (如果你想自定义提示 UI, 通过回调函数可以拿到返回值来控制提示的显隐, 此参数可选)
 */
pollingCompareVersion(version, `${location.origin}/version.json`, 30000, (data) => {
    console.log(data)
})

```

```javascript

/**
 * 2.
 * 执行 generate-version-file 快捷命令，即可创建 version.json 文件
 * version.json 文件默认生成在 dist 目录下, 如果需要自定义目录, 可传入目录参数, 参见以下示例:
*/ 

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "generate:version": "generate-version-file dist public"
    ...
  },
  ...
}

```

#### 如果你想把成功部署的消息推送到 Lark 机器人所在的群聊，请继续 👇

```javascript 

/**
 * 3.
 * 你需要在项目根目录下创建一个 send-lark-config.json 文件，它存储了用于设置消息卡展示文案的字段
 * 然后, 执行 send-lark-message 快捷命令。默认情况下，当前路径中的 send-lark-config.json 文件被选中
 * 如果你想自定义文件路径或文件名，你可以设置 MESSAGE_PATH 参数，将其传入 (此参数对有区分部署环境的需求时, 非常有用。) 设置方法如下:
*/

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-lark-message:test": "MESSAGE_PATH=./lark-message-staging-config.json send-lark-message"
    ...
  },
  ...
}


// send-lark-config.json 文件及字段
{
    // 消息卡片标题
    "title": "TEST FE Deployed Successfully",
    // 项目名称
    "projectName": "TEST",
    // 项目分支, 可用于区别部署环境
    "branch": "Staging",
    // 项目可访问地址
    "accessUrl": "https://test.com",
    // 是否@所有人: true / false
    "isNotifyAll": true,
    // Lark 机器人的 webhook 链接
    "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx",
    // 部署所使用的方式或平台
    "deployTools": "Jenkins",
    // 可选: 部署时间想要转换成的时区，默认 "Asia/Shanghai" (当你的项目要部署的目标服务器与你所在时区不同, 可以设置此字段转换时区)
    "expectConvertToTimezone": "America/New_York"
}

```

## 链接
- [时区参照表](https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html)





