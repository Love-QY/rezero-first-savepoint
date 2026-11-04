# 素材替换说明

当前演示已接入完整的 **MOSS-Image 生成素材**：3 张背景、2 张 CG、4 张透明背景立绘。SVG 仅作为加载失败时的回退。

不包含任何官方美术。

## 目录约定

~~~text
assets/
  bg/
    plaza.jpg      王都露天集市（白天，暖色）
    slums.jpg      贫民窟巷道（黄昏，冷青）
    loot.jpg       赃物库内部（昏暗，木色）
  portraits/
    emilia.png     艾米莉娅（透明背景）
    felt.png       菲鲁特（透明背景）
    rom.png        罗姆（透明背景）
    elsa.png       艾尔莎（透明背景）
  cg/
    first_death.jpg  第一次死亡 CG
    checkpoint.jpg   死亡回归 / 苹果摊 CG
    title.jpg        标题页主视觉
~~~

推荐尺寸：

- 背景：1920×1080，JPG/WebP，单张 < 500KB
- 立绘：900×1200，PNG 透明背景，单张 < 1MB
- 立绘底部对齐，人物脚部可以裁掉，但头顶留 40px 余量
- CG：1920×1080，JPG/WebP；标题主视觉可以留出中间偏左的标题区

## 接入方式

把文件按上面的命名放到对应目录，刷新即可。`js/art.js` 已经预置路径；如果你想换成别的文件名，再改它：

~~~js
export const ART = {
  backgrounds: {
    plaza: "assets/bg/plaza.jpg",
    slums: "assets/bg/slums.jpg",
    loot: "assets/bg/loot.jpg",
    black: "",
  },
  portraits: {
    emilia: "assets/portraits/emilia.png",
    felt: "assets/portraits/felt.png",
    rom: "assets/portraits/rom.png",
    elsa: "assets/portraits/elsa.png",
  },
  cg: {
    first_death: "assets/cg/first_death.jpg",
    checkpoint: "assets/cg/checkpoint.jpg",
    title: "assets/cg/title.jpg",
  },
};
~~~

留空则自动回退到内置 SVG/CSS，不会报错。

## Moss 图片管线

如果 Moss 只有网页端：按 `moss-prompts.md` 里的 prompt 批量生成，下载后按上面的命名放入目录。

如果 Moss 有 API：需要提供以下信息，才能写自动生成脚本：

- API base URL 与鉴权方式
- 模型/风格 ID
- 单次可生成张数、并发/速率限制
- 商用/非商用许可、水印规则
- 是否支持参考图/固定 seed（角色一致性）

## 版权与内容

- 本演示是 Re:0 非商业同人原型，角色版权归原作者及 KADOKAWA 所有。
- 不要使用官方立绘、动画截图、官方 Logo 直接作为素材。
- 全年龄向：避免血腥、性暗示、恐怖过度写实的画面。
- 记录每张图的来源与许可，方便后续替换。