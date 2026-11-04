# 角色立绘生成规格（MOSS-Image）

> 目标：为 Demo 生成 4 张可用的半身立绘，优先“单张主立绘”，再考虑表情差分。
> 这不是官方美术，而是按原作特征做的非商业同人原型；不要直接使用官方立绘/截图。

## 统一风格前缀

~~~text
Japanese visual novel character portrait, soft cel shading, clean lineart,
gentle rim light, muted warm palette, expressive eyes, half-body,
plain dark neutral background, no text, no watermark, all-ages,
highly detailed face, consistent character design
~~~

负面词：

~~~text
nsfw, text, watermark, logo, extra fingers, bad anatomy, bad hands,
blurry, lowres, photorealistic, 3d render, multiple people, official art
~~~

## 艾米莉娅 · emilia

~~~text
[统一风格前缀], silver long hair, violet eyes, pointed elf ears,
white and lavender fantasy dress, small flower hairpin,
kind but slightly distant expression, hands held in front,
half-body, facing viewer, plain dark background
~~~

表情差分关键词：`gentle smile` / `worried` / `looking away`

## 菲鲁特 · felt

~~~text
[统一风格前缀], short blonde hair, red eyes, sharp grin,
black and red hooded streetwear, small earring,
confident tomboy posture, one hand on hip, chin up,
half-body, facing viewer, plain dark background
~~~

表情差分关键词：`smug grin` / `angry` / `surprised`

## 罗姆 · rom

~~~text
[统一风格前缀], huge older man, bald head, thick grey-brown beard,
worn brown merchant coat, wooden club over shoulder,
lazy but protective expression, heavy build,
half-body, facing viewer, plain dark background
~~~

表情差分关键词：`neutral` / `angry` / `concerned`

## 艾尔莎 · elsa

~~~text
[统一风格前缀], long black hair, red eyes, dark elegant coat,
red scarf, polite unsettling smile, one hand raised,
beautiful but dangerous atmosphere, no blood, no weapon close-up,
half-body, facing viewer, plain dark background
~~~

表情差分关键词：`polite smile` / `cold stare` / `amused`

## 生成顺序

1. 每个角色先生成 4 张，选 1 张最好的做“主立绘”。
2. 固定 seed / 同一段 prompt，只改表情关键词，生成 2 张差分。
3. 先不要追求 3 个表情全齐；Demo 阶段每个角色 1 张就够。
4. 主立绘定稿后，再决定要不要做透明背景或 Live2D 分层。

## 透明背景

MOSS 输出是 RGB，不会直接给 alpha。三个方案：

- 生成时用纯色/深色背景，后期用抠图工具（rembg / Photoshop）去背；
- 不做透明，改成“角色卡”式立绘，带暗色背景和边框；
- 只做半身像，底部用 CSS 渐隐到对话框，避免硬边。

## 一致性提醒

MOSS-Image 不是角色一致性模型。跨图保持同一张脸，需要：

- 固定 seed + 固定服装/发型/瞳色描述；
- 只改表情关键词，不改镜头和服装；
- 生成 4 张选 1 张，不要期待每张都能用；
- 如果要 3 个表情完全一致，最稳的是“一张主图 + 局部重绘/修脸”，而不是重新生成。
