# 🔔 version-rocket 🚀

English | [简体中文](./README.zh-CN.md)

> A tool library for web application version detection and deployment notification.

[![](https://img.shields.io/npm/v/version-rocket)](https://www.npmjs.com/package/version-rocket)
[![](https://img.shields.io/npm/dm/version-rocket.svg)](https://npmcharts.com/compare/version-rocket?minimal=true)
[![](https://codecov.io/gh/guMcrey/version-rocket/main/graph/badge.svg)](https://codecov.io/gh/guMcrey/version-rocket)
[![](https://github.com/guMcrey/version-rocket/actions/workflows/main.yml/badge.svg)](https://github.com/guMcrey/version-rocket/actions/)
[![](https://img.shields.io/npm/l/version-rocket)](https://www.npmjs.com/package/version-rocket)

**Catalogue**
- [About](#about)
- [Features](#features)
- [Implementation Principle](#implementation-principle)
- [Install](#install)
- [Quick Start](#quick-start)
  - [Web application version real-time detection](#web-application-version-real-time-detection)
    - [Personalize the theme](#personalize-the-theme)
    - [Screenshot](#screenshot)
  - [Automatically send deployment messages to Lark or Wecom group chat](#automatically-send-deployment-messages-to-lark-or-wecom-group-chat)
    - [Lark](#lark)
      - [Set dynamic text](#set-dynamic-text)
      - [Custom message card](#custom-message-card)
      - [Screenshot](#screenshot-1)
    - [WeCom](#wecom)
      - [Set dynamic text](#set-dynamic-text-1)
      - [Custom message card](#custom-message-card-1)
      - [Screenshot](#screenshot-2)
- [API](#api)
- [Test](#test)
- [Links](#links)
- [License](#license)

---

## About

**version-rocket** contains two functional modules: **Web application version real-time detection**, **Automatic deployment message to lark or WeCom group chat**
> You can use a module separately according to the needs, or use it together

When is it suitable to use the **web application version real-time detection**?
  -The scene: This kind of situation often happens. When the user opens a web application in the browser for a long time and has not refresh the page. When the application has a new version update or the problem repair, the user will not know that there is a new version of the release, which will lead to the user. Continue to use old versions to affect user experience and back-end data accuracy.
  - **version-rocket** will detect the application version in real time. When a new version is found, the display version updates the pop-up window, prompting the user to refresh the page to update the application.

When is it suitable to use **to automatically send deployment messages to Lark or WeCom group chat**?
  -The scene: There may be such a situation in team cooperation. As a front-end engineer, you need to verbally communicate with team members after each deployment. There are no deployment records to follow.
  - **version-rocket** Use the `Webhook` method. After the application deployment is successful, through group chat robots, the news of" successful deployment "will be automatically pushed to the group chat.

*If you have the push needs of other platforms, you can mention issues*

## Features

- Support all modern browsers
- Available version real-time monitoring, support any version format, such as: 1.1.0, 1.1.1.0, 1.1.0-beta, etc.
- Support personalized version popup text and theme, also support custom UI
- Sync deployment message to Lark or WeCom group chat after successful deploy
- Card text and templates for deployment messages support customization, and support the dynamically generated fields.
- Support TypeScript
- [Npm package support](https://www.npmjs.com/package/version-rocket)

## Implementation Principle

- **Web application version real-time detection:** **version-rocket** compares the version of the user's current browser with the version files in the remote server. We use JavaScript's `Web Worker API` to make monitoring rotation, which will not affect the browser rendering process.

- **Automatically send deployment messages to Lark or WeCom group chat:** **version-rocket** call the webhook method provided by collaborative office software to trigger group chat robots send messages.

## Install

[![version-rocket](https://nodei.co/npm/version-rocket.png)](https://www.npmjs.com/package/version-rocket)

```bash
# Choose a package manager you prefer

// npm
npm install version-rocket --save

// yarn
yarn add version-rocket

# pnpm
pnpm install version-rocket

```

### Quick Start

### Web application version real-time detection

Step 1: Import `checkVersion()`, and use it

```javascript
// Entry file: such as App.vue or App.jsx, etc

import { checkVersion } from 'version-rocket'
// It is recommended to use the version field in package.json, or you can customize versions
import { version } from '../package.json'

checkVersion({
  localPackageVersion: version,
  originVersionFileUrl: `${location.origin}/version.json`,
})

// To terminate version detection, call the unCheckVersion method during the destruction life cycle. For details, see the API
unCheckVersion({closeDialog: false})
 
```

Step 2: after executing the `generate-version-file` custom command, generate the `version.json` file, used to deploy to a remote server

- `VERSION` (optional): when **custom version** is required, it is passed in. The default value is package.json version field

- File output directory (optional): **user defined version.json output directory**, which is the dist directory by default

```javascript
// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "generate:version": "VERSION=1.1.0-beta generate-version-file dist public"
    ...
  },
  ...
}

```

<details>
<summary>⚠️ Notice:</summary>
If your project is connected to CDN, it is strongly recommended that you set the `version.json` file is set to always no caching (configure in nginx or turn off the function of CDN ignoring the parameter cache)

``` shell
// nginx example

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

*Complete the above two steps, the version monitoring function can be used normally 🎉🎉*

#### Personalize the theme

```javascript

// Entry file: such as App.vue or App.jsx, etc

import { checkVersion } from 'version-rocket'
// It is recommended to use the version field in package.json, or you can customize versions
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

Or set prompt picture

``` javascript

// Entry file: such as App.vue or App.jsx, etc

import { checkVersion } from 'version-rocket'
// It is recommended to use the version field in package.json, or you can customize versions
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

#### Screenshot

<p align="center">
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/available-version-tips.gif?raw=true" width="410"/>
  <img src="https://github.com/guMcrey/version-rocket/blob/main/assets/custom-themes.jpg?raw=true" width="410" />
</p>

---

### Automatically send deployment messages to Lark or WeCom group chat

#### Lark

Step 1: 
- **Create the `lark-message-config.json`** file in the project root directory to set the text of the message card
- **execute the send-lark-message** custom command
  - `MESSAGE_PATH` (optional): passed if you need to customize the file path or filename (this parameter is useful if you need to differentiate the deployment environment). By default, the lark-message-config.json file in the root directory is used 
  - `PACKAGE_JSON_PATH` (optional): passed if you need to customize the path to the package.json file (this parameter may be useful for deployments of monorepo projects). The default is to get the package.json file in the root path

```javascript 

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-lark-message:test": "MESSAGE_PATH=./lark-message-staging-config.json PACKAGE_JSON_PATH=./packages/test/package.json send-lark-message"
    ...
  },
  ...
}

```

Step 2: Set `lark-message-config.json`

``` javascript

// lark-message-config.json
{
  // card title
  "title": "TEST FE Deployed Successfully",
  // project name label
  "projectNameLabel": "Project name label",
  // deploy project name
  "projectName": "TEST",
  // project branch label
  "branchLabel": "Branch label",
  // deploy branch name
  "branch": "Staging",
  // version label
  "versionLabel": "Version label",
  // version
  "version": "1.1.1.0",
  // project access url label
  "accessUrlLabel": "Access URL label",
  // project access url
  "accessUrl": "https://test.com",
  // remind group chat members label
  "isNotifyAllLabel": "Is notify all label",
  // remind group chat members: true/false
  "isNotifyAll": true,
  // lark robot webhook url
  "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx",
  // deploy type description
  "deployToolsText": "Deploy tools text",
  // deploy type
  "deployTools": "Jenkins",
  // the deploy time zone that you want to display, default "Asia/Shanghai"
  "expectConvertToTimezone": "America/New_York"
  // more information want to show
  "remark": "Trigger by bob, fix xxx bug"
}

```

#### Set dynamic text

If your card copy will be generated according to conditions, you can pass in `MESSAGE_JSON` field is self-defined, such as version, title, etc

*Note: `MESSAGE_JSON` needs to be escaped*

```javascript

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-lark-message:test": "MESSAGE_JSON='{\"title\":\"This is a dynamically generated title\",\"version\":\"1.1.0-beta\",\"accessUrl\":\"http://test.example.com\",\"isNotifyAll\":true}' send-lark-message"
    ...
  },
  ...
}

```

Or after export variables, quote in package.json

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

#### Custom message card

```javascript

// lark-message-config.json

{
    // Message card content
    "message": {
        "msg_type": "text",
        "content": {
            "text": "New message reminder"
        }
    },
    // Lark robot's webhook link
    "larkWebHook": "https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxx"
}

```

#### Screenshot

<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/custom-message-text.jpg?raw=true" width="500" />

#### WeCom

Step 1: 
- **Create the `message-config.json`** file in the project root directory to set the text of the message card
- **execute the send-wecom-message** custom command
  - `MESSAGE_PATH` (optional): passed when you need to customize the file path or filename (this parameter is useful if you need to differentiate the deployment environment). The default is to use the message-config.json file in the root directory 
  - `PACKAGE_JSON_PATH` (optional): passed when a custom path to the package.json file is required (this parameter may be useful for deployments of monorepo projects). The default is to get the package.json file in the root path

```javascript 

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-wecom-message:test": "MESSAGE_PATH=./message-config.json PACKAGE_JSON_PATH=./packages/test/package.json send-wecom-message"
    ...
  },
  ...
}

```

Step 2: Set `message-config.json`

``` javascript

{
  // card title
  "title": "TEST FE Deployed Successfully",
  // project name label
  "projectNameLabel": "Project name label",
  // deploy project name
  "projectName": "TEST",
  // project branch label
  "branchLabel": "Branch label",
  // deploy branch name
  "branch": "Staging",
  // version label
  "versionLabel": "Version label",
  // version
  "version": "1.1.1.0",
  // project access url label
  "accessUrlLabel": "Access URL label",
  // project access url
  "accessUrl": "https://test.com",
  // remind group chat members label
  "isNotifyAllLabel": "Is notify all label",
  // remind group chat members: true/false
  "isNotifyAll": true,
  // WeCom robot webhook url
  "webHook": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxxxxxxxxx",
  // deploy type description
  "deployToolsText": "Deploy tools text",
  // deploy type
  "deployTools": "Jenkins",
  // the deploy time zone that you want to display, default "Asia/Shanghai"
  "expectConvertToTimezone": "America/New_York"
  // more information want to show
  "remark": "Trigger by bob, fix xxx bug"
}

```

#### Set dynamic text

If your card copy will be generated according to conditions, you can pass in `MESSAGE_JSON` field is self-defined, such as version, title, etc

*Note: `MESSAGE_JSON ` needs to be escaped*

```javascript

// package.json

{
  "name": "test",
  "description": "test",
  "private": true,
  "version": "0.0.1",
  "scripts": {
    ...
    "send-wecom-message:test": "MESSAGE_JSON='{\"title\":\"This is a dynamically generated title\",\"version\":\"1.1.0-beta\",\"accessUrl\":\"http://test.example.com\",\"isNotifyAll\":true}' send-wecom-message"
    ...
  },
  ...
}
```

Or after export variables, quote in package.json

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

#### Custom message card

```javascript

// message-config.json

{
    // message card template content
    "message": {
        "msgtype": "text",
        "text": {
            "content": "This is a custom message"
        }
    }
    // webhook link for the WeCom bot
    "webHook": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxxxxxx"
}
```

#### Screenshot

<img src="https://github.com/guMcrey/version-rocket/blob/main/assets/wecom-message.jpg?raw=true" width="500" />

---

## API

**checkVersion Function**
> Enable real-time app version detection

| Params | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
| config | object | Version monitoring configuration item |  | Yes |
| config.originVersionFileUrl | string |  The path to the version.json file on the remote server | | Yes |
| config.localPackageVersion | string | The version of the current application usually takes the version field of package.json for comparison with the version.json file of the remote server |  | Yes |
| config.pollingTime | number | Time interval for polling monitoring, in ms | 5000 | No |
| config.onVersionUpdate | function(data) | Callback function for custom version hint UI (if you want to customize the popup UI, you can get the return value through the callback function to control the appearance of the popup) |  | No |
| options | object | Configuration items for popup text and themes (not customize the popup UI, but use it if you need to modify the text and themes) | | No |
| options.title | string | Popup title | Update | No |
| options.description | string | Popup description | V xxx is available | No |
| options.buttonText | string | Popup button text | Refresh | No |
| options.imageUrl | string | Popup image |  | No |
| options.rocketColor | string | The popup picture's theme color of the rocket, after setting Options.imageUrl is invalid | | No |
| options.primaryColor | string | The theme color of the popup, it will affect the hint image background color and button background color, after setting imageUrl is invalid | | No |
| options.buttonStyle | string | The CSS configuration of pop-up buttons can override the default button style | | No |

**unCheckVersion Function**
> Terminate the `worker` process created after calling `checkVersion`

| Params | Type | Description | Default | Required |
| --- | --- | --- | --- | --- |
closeDialog | boolean | Whether to close the version update prompt pop-up window | - | Yes

## Test

```shell
npm run test
```

## Links
- [Timezone List](https://jp.cybozu.help/general/zh/admin/list_systemadmin/list_localization/timezone.html)
- [JSON Escape](https://codebeautify.org/json-encode-online)

## License

version-rocket is open source software with [Apache License 2.0](./LICENSE.md)





