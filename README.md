# Re:0 — 起始的存档点

> 一个 15–20 分钟的 Re:0 第一存档点压缩演示。
> 非商业同人 / 全年龄向 / 多智能体叙事原型。

## 这是什么

这不是完整游戏，而是一个 **可玩的垂直切片**：

- 场景导演决定「时间、地点、在场角色」；
- 每个角色只看到自己该看到的信息；
- 玩家的选择改变信任、旗标与记忆；
- 结尾 checkpoint 把时间拉回苹果摊，完成第一次「死亡回归」。

当前版本是 **脚本模式**：NPC 台词来自 `js/story.js`，保证没有模型也能完整试玩。
`AI 对话` 按钮预留了本地 Ollama 接口，用于测试角色自由对话与拒绝能力。

## 运行

在本目录打开终端：

~~~powershell
py serve.py
~~~

然后浏览器打开：

~~~text
http://127.0.0.1:8080/
~~~

不需要安装依赖、不需要构建。

> `serve.py` 会禁用浏览器缓存，避免改了代码却看到旧版本。
> 如果 `python` 是 Windows Store 的占位程序，请用 `py`，或安装 Python 3.11+。

## 让别人访问

默认 `http://127.0.0.1:8080/` 只在本机可用。

### 同一局域网

用 `0.0.0.0` 监听：

~~~powershell
py serve.py 8080 0.0.0.0
~~~

查本机 IPv4：

~~~powershell
ipconfig
~~~

把 `http://<你的IPv4>:8080/?play=1` 发给同一 Wi-Fi/局域网的人。Windows 防火墙弹窗要允许 Python 访问专用网络。

> 这是无鉴权的静态页面，只适合可信局域网。

### 公网

最省事是部署到静态托管（Cloudflare Pages / Netlify / GitHub Pages），把 `rezero-demo` 目录上传即可；或者临时用 Cloudflare Tunnel：

~~~powershell
cloudflared tunnel --url http://127.0.0.1:8080
~~~

注意：`AI 对话` 依赖本机 Ollama，公网用户点了不会工作；脚本主线不受影响。

## 操作

| 操作 | 说明 |
|---|---|
| 点击画面 / 空格 / 回车 | 推进对话；打字中则立即显示全文 |
| 自动 | 自动播放，遇到选项暂停 |
| 跳过 | 快速推进；遇到选项暂停 |
| 记录 | 查看已读对话 |
| 保存 / 读取 | localStorage 存档（每次推进也会自动保存） |
| 设置 | 文字速度、自动播放间隔 |
| DEV | 查看导演 / 角色 / checkpoint / 记忆状态 |
| AI 对话 | 连接本地 Ollama，与在场角色自由对话 |

## 剧情压缩

演示覆盖第一存档点的核心因果链：

1. 昴在王都醒来，没钱，遇到艾米莉娅；
2. 菲鲁特偷走徽章，昴追到贫民窟；
3. 赃物库里，艾尔莎出现；
4. 第一次死亡，回到苹果摊。

角色：菜月昴、艾米莉娅、菲鲁特、罗姆、艾尔莎。
没有官方美术；背景、CG 与 4 张角色立绘由 MOSS-Image 生成，立绘已做绿幕抠图与透明处理。

## 架构映射

| 层 | 文件 | 说明 |
|---|---|---|
| 剧本 / 分支 | `js/story.js` | 节点、台词、选项、effects、checkpoint 规格 |
| 导演 / 引擎 | `js/engine.js` | 场景切换、条件台词、选项、存档序列化 |
| 角色 | `js/characters.js` | 人设、AI persona、颜色 |
| 立绘 | `js/portraits.js` | SVG 回退；优先加载 `assets/portraits/*.png` |
| UI | `js/ui.js` | 打字机、立绘、选项、记录、设置、DEV、AI 弹窗 |
| 本地模型 | `js/llm.js` | Ollama `/api/chat` 流式适配 |
| 素材覆盖 | `js/art.js` | 背景/立绘路径映射 |

### checkpoint

`js/story.js` 顶部的 `STORY.checkpoint` 是规格示例：

- `invariants`：艾米莉娅未拿回徽章、菲鲁特未带离徽章、艾尔莎未杀人；
- `outcome_set`：`bad_end_first_loop` / `save_emilia` / `save_felt`；
- `convergence`：世界内后果 → NPC 介入 → 新信息 → 代价。

当前演示只实现 `bad_end_first_loop`。后续周目可以按同一规格扩展。

## 本地 AI 对话（可选）

当前电脑是 8GB 内存 + Intel 核显，建议 **Qwen3-4B** 级别：

~~~powershell
ollama pull qwen3:4b
$env:OLLAMA_ORIGINS="*"
ollama serve
~~~

打开游戏右上角 `AI 对话`，选角色，输入内容即可。

默认配置在 `js/config.js`：

~~~js
ollama: {
  baseUrl: "http://127.0.0.1:11434",
  model: "qwen3:4b",
  numCtx: 4096,
  numPredict: 180,
  temperature: 0.85,
}
~~~

如果你的模型名不同，改 `model` 即可。

**注意**：4B 在 8GB 机器上也会和浏览器抢内存；建议关掉不用的应用。7B 会很慢。

## MOSS API Key（只在重跑素材时需要）

游戏运行不需要 key。当前生成用的 key 已删除。

如果以后要重跑立绘/CG，你自己新建下面任意一个文件即可（不需要我来创建）：

~~~text
rezero-demo/moss_key.txt
rezero-demo/.moss_key
~~~

用记事本打开，把 `platform.moss.cn` 控制台 `Configuration → API Keys` 创建的 key 粘贴进去，保存。脚本会优先读 `.moss_key`，没有就读 `moss_key.txt`。两个文件都不会进 git，也不会被游戏前端读取。

## 当前素材状态

已接入 MOSS-Image 生成的完整素材：

- `assets/bg/plaza.jpg`：王都露天集市
- `assets/bg/slums.jpg`：贫民窟巷道
- `assets/bg/loot.jpg`：赃物库内部
- `assets/cg/first_death.jpg`：第一次死亡 CG
- `assets/cg/title.jpg`：标题主视觉
- `assets/cg/checkpoint.jpg`：死亡回归 CG
- `assets/portraits/emilia.png` / `felt.png` / `rom.png` / `elsa.png`：透明背景立绘

## 替换成 Moss 图片

1. 按 `assets/moss-prompts.md` 生成图片；
2. 按下面的命名放进 `assets/`；
3. 刷新页面即可，不需要改代码。

~~~text
assets/bg/plaza.jpg
assets/bg/slums.jpg
assets/bg/loot.jpg
assets/portraits/emilia.png
assets/portraits/felt.png
assets/portraits/rom.png
assets/portraits/elsa.png
assets/cg/first_death.jpg
assets/cg/checkpoint.jpg
assets/cg/title.jpg
~~~

`js/art.js` 已预置这些路径；文件不存在会自动回退到 SVG/CSS，不会报错。详细尺寸与命名见 `assets/README.md`。

## 测试

- 主线已在 jsdom 中自动走通：到 `BAD END 01`，`deathCount=1`，`checkpoint=appa_stall`，记忆 5 条。
- 手动检查建议：三个最终选项都走一遍；保存后刷新再读取；DEV 面板四个 tab 都能打开。
- 浏览器截图在当前执行环境受沙箱限制未生成；以实际打开页面为准。

## 已知限制

- 只有一条主线，选项影响信任/旗标/台词，不改变结局；
- NPC 是脚本台词，不是实时生成；AI 对话是旁路，不改变主线；
- 立绘/背景是占位，不是正式美术；
- 没有 BGM/语音；
- 没有多周目继承、没有路线分支。

## 下一步（V1 多路线）

1. 把 `STORY` 扩成「共通线 + 3 条 15–20 分钟短线」；
2. 每个 route 一个 `route_id`，checkpoint 的 `outcome_set` 按 route 分开；
3. 记忆加 `source_type` / `propagate`，支持二手信息；
4. 把 `AI 对话` 升级成「只影响关系/记忆，不改变主线」的自由互动；
5. 用 Moss 出正式立绘，按 `js/art.js` 替换。

## 版权

角色与世界观版权归原作者及 KADOKAWA 所有。
本演示不包含官方素材，仅用于技术原型与私人研究，非商业用途。