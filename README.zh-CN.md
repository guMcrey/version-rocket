# 🔔 version-rocket 🚀

简体中文 | [English](./README.md)

> 一个用于 web 应用版本检测和部署通知的工具库。

[![](https://img.shields.io/npm/v/version-rocket)](https://www.npmjs.com/package/version-rocket)
[![](https://img.shields.io/npm/dm/version-rocket.svg)](https://npmcharts.com/compare/version-rocket?minimal=true)
[![](https://codecov.io/gh/guMcrey/version-rocket/main/graph/badge.svg)](https://codecov.io/gh/guMcrey/version-rocket)
[![](https://github.com/guMcrey/version-rocket/actions/workflows/main.yml/badge.svg)](https://github.com/guMcrey/version-rocket/actions/)
[![](https://img.shields.io/npm/l/version-rocket)](https://www.npmjs.com/package/version-rocket)

目录
- [简介](#简介)
- [功能特点](#功能特点)
- [实现原理](#实现原理)
- [安装](#安装)
- [快速开始](#快速开始)
  - [Web 应用版本实时检测](#web-应用版本实时检测)
    - [个性化设置主题](#个性化设置主题)
    - [效果截图](#效果截图)
  - [自动发送部署消息到飞书 (Lark) 或企业微信 (WeCom) 群聊](#自动发送部署消息到飞书-lark-或企业微信-wecom-群聊)
    - [飞书 (Lark)](#飞书-lark)
      - [设置动态文案](#设置动态文案)
      - [自定义消息卡片](#自定义消息卡片)
      - [效果截图](#效果截图-1)
    - [企业微信 (WeCom)](#企业微信-wecom)
      - [设置动态文案](#设置动态文案-1)
      - [自定义消息卡片](#自定义消息卡片-1)
      - [效果截图](#效果截图-2)
- [API](#api)
- [测试](#测试)
- [相关链接](#相关链接)
- [许可证](#许可证)
- [其他有趣的开源项目](#其他有趣的开源项目)

---

## 简介

**version-rocket** 包含两个功能模块: **Web 应用版本实时检测**、**自动发送部署消息到飞书 (Lark) 或企业微信 (WeCom) 群聊。**
> 你可以根据需求单独使用某个模块, 或一起使用

什么时候适合使用 **Web 应用版本实时检测**?
  - 场景: 经常会发生这样的情况, 当用户在浏览器中打开某 web 应用很长时间且未刷新页面, 在应用有新版本更新或问题修复时, 用户会无法及时知晓有新版发布, 导致用户继续使用旧的版本, 影响用户体验和后端数据准确性。
  - **version-rocket** 会实时检测应用版本, 当发现新版本时, 展示版本更新提示弹窗, 提示用户刷新页面来更新应用。

什么时候适合使用 **自动发送部署消息到飞书 (Lark) 或企业微信 (WeCom) 群聊**?
  - 场景: 在团队合作中可能会有这样的情况, 你作为前端工程师, 在联调测试或部署上线时, 每次部署后都需要跟团队成员口头传达已经部署成功, 增加了沟通成本, 不够自动化, 也没有部署记录以有迹可循。
  - **version-rocket** 利用 `WebHook` 方式, 在应用部署成功后, 通过群聊机器人, 自动帮你推送“部署成功”的消息到群聊中。 

*如果有其他平台的推送需求, 可以提 issue*

## 功能特点

- 支持所有现代浏览器
- **可用版本实时检测**提供两种方式: 1. 通过**管理版本号**; 2. 通过检测**指定文件内容是否有更新**
  1. 通过管理版本号: 支持任意版本格式, 例如: 1.1.0、1.1.1.0、1.1.0-beta 等等
  2. 通过检测指定文件内容是否有更新: 支持任意远程服务器中的文件 `v1.7.0`
- 支持**个性化设置**版本提示弹窗的文案和**主题**, 也支持自定义 UI
- 部署成功后，将**部署消息同步给群聊机器人**, 目前支持飞书 (Lark) 和企业微信 (WeCom)
- 部署信息卡片的文案和消息模版支持自定义, 并支持动态生成的字段传入
- 支持 TypeScript
- 支持 Node 14+ 🐰

## 实现原理

- **Web 应用版本实时检测:** 
  1. 通过管理版本号: **version-rocket** 将用户当前浏览器中的版本与远程服务器中的版本文件进行比较。我们使用基于 javascript 的 `Web Worker API` 来做监测轮询，不会影响浏览器渲染进程。
  2. 通过检测指定文件内容是否有更新: **version-rocket** 将依赖浏览器的协商缓存原理来判断指定的文件内容是否发生了改变。我们使用基于 javascript 的 `Web Worker API` 来做监测轮询，不会影响浏览器渲染进程。`v1.7.0`

- **自动发送部署消息到飞书 (Lark) 或企业微信 (WeCom) 群聊:** **version-rocket** 调用协同办公软件提供的 WebHook 方式, 触发群聊机器人发送消息。

## 安装

[![version-rocket](https://nodei.co/npm/version-rocket.png)](https://www.npmjs.com/package/version-rocket)

```bash
# 选择一个你喜欢的包管理器

# npm
npm install version-rocket --save

# yarn
yarn add version-rocket

# pnpm
pnpm install version-rocket

```

### 快速开始

### Web 应用版本实时检测: 通过管理版本号

第一步: 导入 `checkVersion()`, 并调用

```javascript
// 入口文件: 如 App.vue 或 App.jsx 等

import { checkVersion } from 'version-rocket'
// 推荐使用 package.json 中的 version 字段, 也可自定义 version
import { version } from '../package.json'

// 在生命周期钩子中调用 checkVersion
checkVersion({
  localPackageVersion: version,
  originVersionFileUrl: `${location.origin}/version.json`,
  // 更多配置选项请参考 API
})

// 如需终止版本检测时, 在销毁生命周期中, 调用 unCheckVersion 方法进行终止, 详情参见 API
unCheckVersion({closeDialog: false})
 
```

第二步: 执行 `generate-version-file` 自定义命令后，在 dist 目录生成 `version.json` 文件, 用于部署到远程服务器
- `VERSION` (参数可选): 需要**自定义 version** 时传入, 默认取 package.json 的 version 字段
- 文件输出目录 (参数可选): 需要**自定义 version.json 输出目录**时传入, 默认为 dist 目录
- `EXTERNAL` (参数可选)：希望将更多信息存到 `version.json` 中时传入，如当前版本的修改内容或其他需要展示在提示弹窗上时 （用于 onVersionUpdate 自定义 UI 时）`v1.6.0`
- `EXTERNAL_PATH` (参数可选)：接收一个文件路径, 推荐在需要将大量额外信息写入 `version.json` 中时使用. 当同时设置了 `EXTERNAL` 和 `EXTERNAL_PATH` 时，优先级低于 `EXTERNAL` （用于 onVersionUpdate 自定义 UI 时）`v1.6.1`

**VERSION 环境变量设置方式**

```javascript
// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    // Mac 或 Linux 系统
    "generate:version": "VERSION=1.1.0-beta generate-version-file dist public"
    // Windows 系统先安装 cross-env
    // npm install cross-env -D
    "generate:version": "cross-env VERSION=1.1.0-beta generate-version-file dist public"
    ...
  },
  ...
}

```

**EXTERNAL `v1.6.0` 和 EXTERNAL_PATH `v1.6.1` 环境变量设置方式**

JSON 格式可以通过 [这里](https://codebeautify.org/json-encode-online) 转义后再使用

```javascript
// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    // Mac 或 Linux 系统 （简单文本）
    "generate:version": "EXTERNAL='some text' generate-version-file dist public"
    // Mac 或 Linux 系统 （JSON 文本）
    "generate:version": "EXTERNAL='{\"update\":\"fix bugs\",\"content\":\"some tips\"}' generate-version-file dist public"
    // Mac 或 Linux 系统 （JSON 文件, 如 version-external.json）
    "generate:version": "EXTERNAL_PATH=version-external.json generate-version-file dist public"
    // Windows 系统 (简单文本)
    "generate:version": "set EXTERNAL=some text && generate-version-file dist public"
    // Windows 系统 (JSON 文本)
    "generate:version": "set EXTERNAL={\"update\":\"fix bugs\",\"content\":\"some tips\"} && generate-version-file dist public"
    // Windows 系统 （JSON 文件, 如 version-external.json）
    "generate:version": "set EXTERNAL_PATH=version-external.json && generate-version-file dist public"
    ...
  },
  ...
}

```

```javascript
// version-external.json 示例

{
    "update": [
        "fix some bugs",
        "improve home page",
        "update docs"
    ],
    "content": "please update to latest version"
}
```

<details>
<summary>⚠️ 注意事项</summary>
如果你的项目接入了 CDN, 强烈建议你将 version.json 文件设置为强制不缓存 (在 nginx 中配置或关闭 CDN 忽略参数缓存的功能)

``` shell
// nginx 配置示例

server {
  ...
  location / {
    ...
    if ($request_filename ~* .*\/version\.(json)$) {
      add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
    }
    ...
  }
  ...
}
```
</details>

*完成以上两个步骤, 版本监测功能(通过管理版本号)可以正常使用了 🎉🎉*

### Web 应用版本实时检测: 通过检测指定文件内容是否有更新 `v1.7.0`

> ⚠️ 温馨提示: 该方式不支持 "当前版本的修改内容或其他需要展示在提示弹窗上"的内容 (如有这样的需求, 请使用 “管理版本号” 的方式)

导入 `checkVersion()`, 并调用

```javascript
// 入口文件: 如 App.vue 或 App.jsx 等
import { checkVersion } from 'version-rocket'

// 在生命周期钩子中调用 checkVersion
checkVersion({
  // 要监听的文件列表, 一般监测某个域名下的 index.html 文件
  checkOriginSpecifiedFilesUrl: [`${location.origin}/index.html`],
  // 监听的文件列表的校验模式: 'one'(默认) | 'all'
  checkOriginSpecifiedFilesUrlMode: 'one',
  // 是否启用版本监测 (默认 true)
  enable: process.env.NODE_ENV !== 'development'
})

// 如需终止版本检测时, 在销毁生命周期中, 调用 unCheckVersion 方法进行终止, 详情参见 API
unCheckVersion({closeDialog: false})
 
```

*完成以上步骤, 版本监测功能(通过检测指定文件内容是否有更新)可以正常使用了 🎉🎉*

#### 个性化设置主题

```javascript

// 入口文件: 如 App.vue 或 App.jsx 等

import { checkVersion } from 'version-rocket'
// 推荐使用 package.json 中的 version 字段, 也可自定义 version
import { version } from '../package.json'

checkVersion(
  {
    localPackageVersion: version,
    originVersionFileUrl: `${location.origin}/version.json`,
  },
  {
    title: 'Title',
    description: 'Description',
    primaryColor: '#758bfd',
    rocketColor: '#ff8600',
    buttonText: 'Button Text',
  }
)

```

或设置提示图片

``` javascript

// 入口文件: 如 App.vue 或 App.jsx 等

import { checkVersion } from 'version-rocket'
// 推荐使用 package.json 中的 version 字段, 也可自定义 version
import { version } from '../package.json'

checkVersion(
  {
    localPackageVersion: version,
    originVersionFileUrl: `${location.origin}/version.json`,
  },
  {
    imageUrl: 'https://avatars.githubusercontent.com/u/26329117',
  }
)

```

#### 效果截图

<p align="center">
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/available-version-tips.gif?raw=true" width="500"/>
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/custom-themes.jpg?raw=true" width="500" />
</p>

---

### 自动发送部署消息到飞书 (Lark) 或企业微信 (WeCom) 群聊

#### 飞书 (Lark)

第一步: 
- 在项目根目录下**创建 lark-message-config.json**文件，用于设置消息卡片的文案
- **执行 send-lark-message**自定义命令
  - `MESSAGE_PATH` (参数可选): 需要自定义文件路径或文件名时传入 (此参数对有区分部署环境的需求时, 非常有用)。默认使用根目录下的 lark-message-config.json 文件 
  - `PACKAGE_JSON_PATH` (参数可选): 需要自定义 package.json 文件路径时传入 (此参数对于 monorepo 项目的部署时, 可能有用)。默认获取根路径下的 package.json 文件

```javascript 

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
     // Mac 或 Linux 系统
    "send-lark-message:test": "MESSAGE_PATH=./lark-message-staging-config.json PACKAGE_JSON_PATH=./packages/test/package.json send-lark-message"
    // Windows 系统先安装 cross-env
    // npm install cross-env -D
    "send-lark-message:test": "cross-env MESSAGE_PATH=./lark-message-staging-config.json PACKAGE_JSON_PATH=./packages/test/package.json send-lark-message"
    ...
  },
  ...
}

```

第二步: 配置 `lark-message-config.json` 文件

``` javascript

// lark-message-config.json

{
  // 可选: 消息卡片头部背景色, 用于设置标题背景颜色, 默认 turquoise, v1.6.2
  // 取值范围: blue | wathet | turquoise | green | yellow | orange | red | carmine | violet | purple | indigo | grey
  "headerBgColor": "red",
  // 消息卡片标题
  "title": "TEST FE Deployed Successfully",
  // 项目名称标签
  "projectNameLabel": "Project name label",
  // 项目名称
  "projectName": "TEST",
  // 项目分支标签
  "branchLabel": "Branch label",
  // 项目分支, 可用于区别部署环境
  "branch": "Staging",
  // 版本标签
  "versionLabel": "Version label",
  // 版本
  "version": "1.1.1.0",
  // 项目可访问地址标签
  "accessUrlLabel": "Access URL label",
  // 项目可访问地址
  "accessUrl": "https://test.com",
  // 是否@所有人标签
  "isNotifyAllLabel": "Is notify all label",
  // 是否@所有人: true / false
  "isNotifyAll": true,
  // Lark 机器人的 webhook 链接
  "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx",
  // 可选: 部署工具描述
  "deployToolsText": "Deploy tools text",
  // 可选: 部署所使用的方式或平台
  "deployTools": "Jenkins",
  // 可选: 部署时间想要转换成的时区，默认 "Asia/Shanghai" (当你的项目要部署的目标服务器与你所在时区不同, 可以设置此字段来转换时区)
  "expectConvertToTimezone": "America/New_York"
  // 可选: 想要展示除模版之外的更多信息
  "remark": "Trigger by bob, fix xxx bug"
}

```

#### 设置动态文案

如果你的卡片文案会根据条件来生成时, 可以传入 `MESSAGE_JSON` 字段来自定义, 如 version, title 等.

*注意: `MESSAGE_JSON` 的值需要做转义*

```javascript

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    // Mac 或 Linux 系统
    "send-lark-message:test": "MESSAGE_JSON='{\"title\":\"This is a dynamically generated title\",\"version\":\"1.1.0-beta\",\"accessUrl\":\"http://test.example.com\",\"isNotifyAll\":true}' send-lark-message"
    // Windows 系统
    "send-lark-message:test": "set MESSAGE_JSON={\"title\":\"This is a dynamically generated title\",\"version\":\"1.1.0-beta\",\"accessUrl\":\"http://test.example.com\",\"isNotifyAll\":true} && send-lark-message"
    ...
  },
  ...
}

```

或 export 变量后, 在 package.json 中引用 (不支持 Windows)

```javascript

// ci file

sh "npm run build"
sh "export messageJSON='{\"title\": \"This is a title\"}'"


// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-lark-message:test": "MESSAGE_JSON=${messageJSON} send-lark-message"
    ...
  },
  ...
}

```

#### 自定义消息卡片

```javascript

// lark-message-config.json

{
    // 消息卡片内容
    "message": {
        "msg_type": "text",
        "content": {
            "text": "New message reminder"
        }
    },
    // Lark 机器人的 webhook 链接
    "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx"
}

```

#### 效果截图

<p align="left">
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/custom-message-text.jpg?raw=true" width="400" />
  &emsp;
  <img src="./assets/deploy-failed-message.jpg?raw=true" width="400" />
</p>

#### 企业微信 (WeCom)

第一步: 
- 在项目根目录下**创建 message-config.json**文件，用于设置消息卡片的文案
- **执行 send-wecom-message**自定义命令
  - `MESSAGE_PATH` (参数可选): 需要自定义文件路径或文件名时传入 (此参数对有区分部署环境的需求时, 非常有用)。默认使用根目录下的 message-config.json 文件 
  - `PACKAGE_JSON_PATH` (参数可选): 需要自定义 package.json 文件路径时传入 (此参数对于 monorepo 项目的部署时, 可能有用)。默认获取根路径下的 package.json 文件

```javascript 

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    // Mac 或 Linux 系统
    "send-wecom-message:test": "MESSAGE_PATH=./message-config.json PACKAGE_JSON_PATH=./packages/test/package.json send-wecom-message"
    // Windows 系统先安装 cross-env
    // npm install cross-env -D
    "send-wecom-message:test": "cross-env MESSAGE_PATH=./message-config.json PACKAGE_JSON_PATH=./packages/test/package.json send-wecom-message"
    ...
  },
  ...
}

```

第二步: 配置 `message-config.json` 文件

``` javascript

{
    // 消息卡片标题
    "title": "TEST FE Deployed Successfully",
    // 可选: 项目名称标签, 默认 Project Name
    "projectNameLabel": "Project name label",
    // 项目名称
    "projectName": "TEST",
    // 可选: 项目分支标签, 默认 Branch
    "branchLabel": "Branch label",
    // 项目分支, 可用于区别部署环境
    "branch": "Staging",
    // 可选: 版本标签, 默认 Version
    "versionLabel": "Version label",
    // 版本
    "version": "1.1.1.0",
    // 可选: 项目可访问地址标签, 默认 URL
    "accessUrlLabel": "Access URL label",
    // 项目可访问地址
    "accessUrl": "https://test.com",
    // 是否@所有人: true / false
    "isNotifyAll": true,
    // 企业微信机器人的 webhook 链接
    "webHook": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxxxxxx",
    // 可选: 部署工具描述
    "deployToolsText": "Deploy tools text",
    // 可选: 部署时间想要转换成的时区，默认 "Asia/Shanghai" (当你的项目要部署的目标服务器与你所在时区不同, 可以设置此字段来转换时区)
    "expectConvertToTimezone": "America/New_York"
    // 可选: 想要展示除模版之外的更多信息
    "remark": "Trigger by bob, fix xxx bug"
}

```

#### 设置动态文案

如果你的卡片文案会根据条件来生成时, 可以传入 `MESSAGE_JSON` 字段来自定义, 如 version, title 等.

*注意: `MESSAGE_JSON` 的值需要做转义*

```javascript

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    // Mac 或 Linux 系统
    "send-wecom-message:test": "MESSAGE_JSON='{\"title\":\"This is a dynamically generated title\",\"version\":\"1.1.0-beta\",\"accessUrl\":\"http://test.example.com\",\"isNotifyAll\":true}' send-wecom-message"
    // Windows 系统
    "send-wecom-message:test": "set MESSAGE_JSON={\"title\":\"This is a dynamically generated title\",\"version\":\"1.1.0-beta\",\"accessUrl\":\"http://test.example.com\",\"isNotifyAll\":true} && send-wecom-message"
    ...
  },
  ...
}
```

或 export 变量后, 在 `package.json` 中引用 (不支持 Windows)

```javascript

// ci file
sh "npm run build"
sh "export messageJSON='{\"title\": \"This is a title\"}'"

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-wecom-message:test": "MESSAGE_JSON=${messageJSON} send-wecom-message"
    ...
  },
  ...
}

```

#### 自定义消息卡片

```javascript

// message-config.json

{
    // 消息卡片内容
    "message": {
        "msgtype": "text",
        "text": {
            "content": "This is a custom message"
        }
    }
    // 企业微信机器人的 webhook 链接
    "webHook": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxxxxxx"
}
```

#### 效果截图

<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/wecom-message.jpg?raw=true" width="500" />

## API

**checkVersion 方法**
> 开启应用版本实时检测功能

| 参数 | 类型 | 描述 | 默认值 | 必需 |
| --- | --- | --- | --- | --- |
| config | object | 版本监测配置项 |  | 是 |
| config.originVersionFileUrl | string |  远程服务器上的 version.json 文件路径 |  | 否 **`v1.7.0`** |
| config.localPackageVersion | string | 当前应用版本号, 通常取 package.json 的 version 字段, 用于与远程服务器的 version.json 文件比较 |  | 否 **`v1.7.0`** |
| config.pollingTime | number | 轮询监测的时间间隔, 单位 ms | 5000 | 否 |
| config.immediate | boolean | 第一次访问时, 立即触发版本监测, 之后按自定义时间间隔轮询 **`v1.5.0`** | false | 否 |
| config.checkOriginSpecifiedFilesUrl | array | 设置该属性后将使用 “通过检测指定文件是否有更新” 而不是 “通过管理版本号” 来监测版本, 传入希望监测的文件地址列表, 通常情况为某个域名下的 index.html 文件 (自动去重) **`v1.7.0`** |  | 否  |
| config.checkOriginSpecifiedFilesUrlMode | 'one' / 'all' | 'one' 表示列表中文件地址只要有一个内容发生改变即提示更新; 'all' 表示列表中文件地址都发生改变时才提示更新. (当 checkOriginSpecifiedFilesUrl 配置后才生效) **`v1.7.0`** | 'one' | 否 |
| config.enable | boolean | 是否启用版本监测, 通过该配置项可以设置版本监测只在指定环境下开启 **`v1.7.0`** | true | 否 |
| config.clearIntervalOnDialog | boolean | 当发现新版本提示弹窗出现后, 清空定时器 **`v1.7.0`** | false | 否 |
| config.onVersionUpdate | function(data) | 自定义版本提示 UI 的回调函数 (如果你想自定义弹窗 UI, 通过回调函数可以拿到返回值来控制弹窗的显隐 ) |  | 否 |
| config.onRefresh | function(data) | 确认更新: 自定义 refresh 事件的回调函数, data 为最新版本号 **`v1.5.0`** |  | 否 |
| config.onCancel | function(data) | 取消更新: 自定义 cancel 事件的回调函数, data 为最新版本号 **`v1.5.0`** |  | 否 |
| options | object | 弹窗文案和主题的配置项 (不自定义弹窗 UI, 但有修改文案和主题的需求时使用) |  | 否 |
| options.title | string | 弹窗的标题 | Update | 否 |
| options.description | string | 弹窗的描述 | V xxx is available | 否 |
| options.buttonText | string | 弹窗按钮的文案 | Refresh | 否 |
| options.cancelButtonText | string | 关闭弹窗按钮的文案 (如果你希望弹窗允许被关闭, 请添加此选项) **`v1.5.0`** |  | 否 |
| options.cancelMode | ignore-current-version (当前版本不再提示, 通过管理版本号监测版本更新的默认配置, 该配置只支持管理版本号的方式) / ignore-today (今天不再提示) / ignore-current-window (当前窗口不再提示, 通过监测指定文件内容是否有更新方式的默认配置) | 关闭弹窗的模式 (当 cancelButtonText 设置后生效) **`v1.5.0`** | ignore-current-version | 否 |
| options.cancelUpdateAndStopWorker | boolean | 关闭弹窗时, 也关闭 worker (当 cancelButtonText 设置后生效) **`v1.5.0`** | false | 否 |
| options.imageUrl | string | 弹窗的提示图片 |  | 否 |
| options.rocketColor | string | 弹窗提示图片中火箭的主题色, 设置后 options.imageUrl 无效 |  | 否 |
| options.primaryColor | string | 弹窗的主题色, 会作用到提示图片背景色和按钮背景色, 设置后 imageUrl 无效 | | 否 |
| options.buttonStyle | string | 弹窗按钮的 css 配置, 可以覆盖掉默认的按钮样式 |  | 否 |

**unCheckVersion 方法**
> 终止在调用 `checkVersion` 后创建的 `worker` 进程

| 参数 | 类型 | 描述 | 默认值 | 必需 |
| --- | --- | --- | --- | --- |
| closeDialog | boolean | 是否关闭版本更新提示弹窗 | false | 是 |
| closeWorker | boolean | 是否停止 worker 轮询 | true | 否 |

## 测试

```shell
npm run test
```

## 相关链接

- [时区参照表](https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html)
- [JSON 在线转义工具](https://codebeautify.org/json-encode-online)
- [Lark 消息卡片搭建工具](https://open.larksuite.com/tool/cardbuilder?from=howtoguide)
- [企业微信群聊机器人文档](https://developer.work.weixin.qq.com/document/path/91770)

## 许可证

version-rocket 是开源软件, 许可证为 [Apache License 2.0](./LICENSE.md)

## 其他有趣的开源项目

**[web-authn-completed-app](https://github.com/guMcrey/web-authn-completed-app)**

💻 [在线体验](https://web-authn.x-dev.club)

> 一个基于 WebAuthn API 实现的完整应用, 它允许**网站使用浏览器/系统内置的认证器**（如 Apple TouchID 和 Windows Hello 或移动设备的生物识别传感器）对用户进行**身份认证**. 它将会**代替密码**, 是在线身份认证的未来.


