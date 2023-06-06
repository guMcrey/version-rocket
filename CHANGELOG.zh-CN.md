#### 发布周期

- 修订版本号：hotfix 修复
- 次版本号：发布带有新特性的向下兼容的版本
- 主版本号：含有破坏性更新和新特性，不在发布周期内

---

## 1.6.6

`2023-06-06`

- 🪲 修复 .npmignore 文件过滤掉了 jest.config.ts 文件

## 1.6.5

`2023-06-06`

- 🪲 修复 .npmignore 文件过滤掉了 utils 文件夹

## 1.6.3

`2023-06-05`

- 💄 优化 npm 包体积, 通过 .npmignore 文件过滤不需要打包的文件

## 1.6.2

`2023-02-13`

- 🆕 lark-message-config 新增 `headerBgColor` 变量，支持自定义消息卡片头部背景色, 以方便区分部署成功或失败的消息推送. 取值范围: blue、wathet、turquoise(默认)、green、yellow、orange、red、carmine、violet、purple、indigo、grey
- 💄 更新 README.md 和 README.zh-CN.md 文档

## 1.6.1

`2023-02-05`

[#22](https://github.com/guMcrey/version-rocket/issues/22)
- 🆕 generate-version-file 新增 `EXTERNAL_PATH` 环境变量，支持传入文本文件路径，推荐在需要将大量额外信息写入 `version.json` 中时使用. 当同时设置了 `EXTERNAL` 和 `EXTERNAL_PATH` 时，优先级低于 `EXTERNAL`。
- 💄 更新 README.md 和 README.zh-CN.md 文档


## 1.6.0

`2023-02-04`

[#22](https://github.com/guMcrey/version-rocket/issues/22)
- 🆕 generate-version-file 新增 `EXTERNAL` 环境变量，可用于在自定义弹窗 UI 时展示更丰富内容。如当前版本更新内容或其他信息
- 💄 更新 README.md 和 README.zh-CN.md 文档

## 1.5.0

`2023-01-17`

[#15](https://github.com/guMcrey/version-rocket/issues/15)
- 🆕 checkVersion 方法新增 immediate, 以支持首页访问时, 立即触发版本监测, 之后按自定义的较长时间间隔轮询 (减少请求服务器次数)
- 🆕 新增版本监测弹窗允许关闭功能: cancelButtonText 用于自定义按钮文案; cancelMode 枚举取消更新后, 下一次更新的频率; cancelUpdateAndStopWorker 用于设置是否在取消更新时同时关闭 worker
- 🆕 新增版本监测回调函数: onRefresh 用于确认刷新后的回调; onCancel 用于取消刷新后的回调
- 💄 更新 README.md 和 README.zh-CN.md 文档 API 部分

## 1.4.0

`2022-12-03`

- 🆕 新增 unCheckVersion 函数, 以支持在需要时终止版本实时监测 [#15](https://github.com/guMcrey/version-rocket/issues/15)
- 🪲 修复 checkVersion 函数在重复调用时, 创建多个 worker 进程
- 💄 更新 README.md 和 README.zh-CN.md 文档

## 1.3.2

`2022-11-08`

- 🪲 修复 send-lark-message.config 中 setDeployInfoInMainCard 为真时, remark 未显示 [#12](https://github.com/guMcrey/version-rocket/issues/12)

## 1.3.1

`2022-11-07`

- 💄 send-lark-message.config 新增字段 setDeployInfoInMainCard 以支持 Deploy 信息显示在主卡片中 [#12](https://github.com/guMcrey/version-rocket/issues/12)

## 1.3.0

`2022-08-21`

- 🆕 支持发送部署消息至企业微信机器人 [#8](https://github.com/guMcrey/version-rocket/issues/8)
- 💄 更新 README.md 和 README.zh-CN.md 文档

## 1.2.4

`2022-07-28`
- 🆕 发送 lark 消息支持传入运行时字段 [#3](https://github.com/guMcrey/version-rocket/issues/3)

## 1.2.1

`2022-07-15`

- 🆕 支持自定义版本更新弹窗主题 [#1](https://github.com/guMcrey/version-rocket/issues/1)
