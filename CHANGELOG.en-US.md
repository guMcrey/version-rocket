#### Release cycle

- Revision number: hotfix fixed
- Minor Version Number: Releases a backward compatible version with new features
- Major version number: Contains breaking updates and new features, not in the release cycle

---

## 1.6.2

`2023-02-13`

- 🆕 lark-message-config added `headerBgColor` variable, support set card header's background color, default is turquoise. available values: blue、wathet、turquoise(default)、green、yellow、orange、red、carmine、violet、purple、indigo、grey
- 💄 update README.md and README.zh-CN.md

## 1.6.1

`2023-02-05`

[#22](https://github.com/guMcrey/version-rocket/issues/22)
- 🆕 generate-version-file added the `EXTERNAL_PATH` environment variable, which supports passing in the path of a file. It is recommended to use it when a large amount of additional information needs to be written into `version.json`. When `EXTERNAL` and `EXTERNAL_PATH` are set at the same time, the priority is lower than that of `EXTERNAL`
- 💄 update README.md and README.zh-CN.md

## 1.6.0

`2023-02-04`

[#22](https://github.com/guMcrey/version-rocket/issues/22)
- 🆕 generate-version-file add EXTERNAL env，can be used to display richer content when customizing the popup UI. Such as current version updates or other information
- 💄 update README.md and README.zh-CN.md

## 1.5.0

`2023-01-17`

[#15](https://github.com/guMcrey/version-rocket/issues/15)
- 🆕 the checkVersion method adds immediate to support immediate version monitoring when visiting the home page, and then polling at custom longer intervals (reducing the number of requests to the server)
- 🆕 new version monitoring pop-up window allows closing function: cancelButtonText is used to customize button text; CancelMode enumerates the frequency of the next update after canceling the update; CancelUpdateAndStopWorker is used to set whether to close the worker at the same time when canceling the update
- 🆕 new callback functions for version monitoring: onRefresh for confirming refresh; onCancel for canceling the callback after refresh
- 💄 update README.md and README.zh-CN.md API

## 1.4.0

`2022-12-03`

- 🆕 add unCheckVersion function, to support that real-time monitor of the version to be terminated when need. [#15](https://github.com/guMcrey/version-rocket/issues/15)
- 🪲 fix checkVersion function be called multiple, will create multiple worker processes.
- 💄 update README.md and README.zh-CN.md


## 1.3.2

`2022-11-08`

- 🪲 fix setDeployInfoInMainCard is true in send-lark-message.config, remark no display [#12](https://github.com/guMcrey/version-rocket/issues/12)

## 1.3.1

`2022-11-07`

- 💄 send-lark-message.config add new field setDeployInfoInMainCard to support deploy info display in main card [#12](https://github.com/guMcrey/version-rocket/issues/12)

## 1.3.0

`2022-08-21`

- 🆕 Supports sending deployment messages to enterprise WeChat bots [#8](https://github.com/guMcrey/version-rocket/issues/8)
- 💄 Update README.md and README.zh-CN.md documentation

## 1.2.4

`2022-07-28`
- 🆕 Send lark message supports incoming runtime fields [#3](https://github.com/guMcrey/version-rocket/issues/3)

## 1.2.1

`2022-07-15`

- 🆕 Support custom version update pop-up theme [#1](https://github.com/guMcrey/version-rocket/issues/1)