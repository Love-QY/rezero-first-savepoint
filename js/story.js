export const STORY = {
  start: "prologue_1",
  checkpoint: {
    id: "appa_stall",
    label: "苹果摊前",
    loop: 1,
    outcome: "bad_end_first_loop",
    invariants: [
      "艾米莉娅尚未拿回徽章",
      "菲鲁特尚未把徽章带离赃物库",
      "艾尔莎尚未杀死任何人",
    ],
    outcome_set: [
      { id: "bad_end_first_loop", requires: ["subaru_dead", "emilia_dead"] },
      { id: "save_emilia", requires: ["emilia_alive", "insignia_recovered"] },
      { id: "save_felt", requires: ["felt_alive", "insignia_recovered"] },
    ],
    convergence: ["world_consequence", "npc_intervention", "new_information", "cost"],
  },
  nodes: {
    prologue_1: {
      chapter: "第一章 · 苹果摊",
      bg: "black",
      caption: "",
      cast: [],
      lines: [
        { speaker: "narrator", text: "——喂，醒醒。" },
        { speaker: "narrator", text: "声音像是从很远的地方传来。" },
        { speaker: "narrator", text: "你睁开眼，看见一片陌生的天空。" },
      ],
      next: "prologue_2",
    },
    prologue_2: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: [],
      lines: [
        { speaker: "narrator", text: "石板路。拱廊。挂着异国文字的招牌。" },
        { speaker: "subaru", text: "……这是哪儿？" },
        { speaker: "narrator", text: "你摸口袋：手机、钱包、一张便利店收据。手机没有信号。" },
        { speaker: "subaru", text: "异世界召唤？至少给个说明书啊。" },
      ],
      next: "prologue_3",
    },
    prologue_3: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: [],
      lines: [
        { speaker: "narrator", text: "苹果的甜香飘过来。你的肚子很诚实地叫了一声。" },
      ],
      choices: [
        { text: "走向苹果摊", next: "stall_1" },
        { text: "先检查手机", next: "phone_1" },
        { text: "观察四周", next: "observe_1" },
      ],
    },
    phone_1: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: [],
      lines: [
        { speaker: "narrator", text: "手机屏幕亮了一下，又黑了。最后一条消息是凌晨三点的工作群。" },
        { speaker: "subaru", text: "……异世界也逃不掉已读不回。" },
      ],
      onEnter: function(s) { s.flags.phone_dead = true; },
      next: "stall_1",
    },
    observe_1: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "narrator", text: "人群里，一个银发少女正从小贩手里接过一袋苹果。她看起来不像本地人。" },
        { speaker: "narrator", text: "她的视线扫过人群，像是在找什么。" },
      ],
      onEnter: function(s) { s.flags.noticed_emilia = true; },
      next: "stall_1",
    },
    stall_1: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: [],
      lines: [
        { speaker: "narrator", text: "苹果摊前，小贩正把一袋袋红苹果码成小山。" },
        { speaker: "narrator", text: "「苹果！新鲜苹果！小哥，来一袋？」" },
        { speaker: "subaru", text: "多少钱？" },
        { speaker: "narrator", text: "「三枚铜币。」" },
        { speaker: "narrator", text: "你掏遍口袋，只摸出一张皱巴巴的收据。" },
        { speaker: "subaru", text: "……那个，能赊账吗？" },
        { speaker: "narrator", text: "「赊账？你当我这是王都慈善堂？」" },
      ],
      next: "stall_2",
    },
    stall_2: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "emilia", text: "请给他一袋吧。" },
        { speaker: "narrator", text: "银发少女把几枚硬币放在摊上。她甚至没有看你，像是在做一件很自然的事。" },
        { speaker: "subaru", text: "诶？" },
        { speaker: "emilia", text: "你站在苹果摊前发呆的样子，很像迷路的小狗。" },
      ],
      onEnter: function(s) {
        s.flags.met_emilia = true;
        s.memory.push({ owner: "subaru", fact: "银发少女艾米莉娅替我付了苹果钱。", source: "witnessed", turn: s.turn });
      },
      choices: [
        { text: "郑重道谢", next: "stall_thanks", effects: { trust: 1 } },
        { text: "自嘲式吐槽", next: "stall_joke", effects: { trust: 1, flags: { joked: true } } },
        { text: "问她为什么帮我", next: "stall_why", effects: { trust: 0 } },
      ],
    },
    stall_thanks: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "subaru", text: "谢谢。真的，帮大忙了。" },
        { speaker: "emilia", text: "不用谢。下次记得带钱。" },
      ],
      next: "stall_3",
    },
    stall_joke: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "subaru", text: "作为报答，我可以帮你拎苹果，或者讲一个不好笑的笑话。" },
        { speaker: "emilia", text: "……先拎苹果吧。" },
      ],
      next: "stall_3",
    },
    stall_why: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "subaru", text: "为什么帮我？" },
        { speaker: "emilia", text: "因为你看上去快饿晕了。这个理由不够吗？" },
      ],
      next: "stall_3",
    },
    stall_3: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "emilia", text: "我叫艾米莉娅。你呢？" },
        { speaker: "subaru", text: "菜月昴。叫我昴就好。" },
        { speaker: "emilia", text: "昴……是个奇怪的名字呢。" },
        { speaker: "narrator", text: "她咬了一口苹果，视线却不时扫向人群，像在找什么。" },
      ],
      choices: [
        { text: "问她丢了什么", next: "ask_insignia", effects: { flags: { knows_insignia: true } } },
        { text: "先自我介绍", next: "intro_1", effects: { trust: 1 } },
        { text: "夸她头发", next: "compliment_1", effects: { trust: -1, flags: { awkward: true } } },
      ],
    },
    ask_insignia: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "subaru", text: "你在找什么？" },
        { speaker: "emilia", text: "——徽章。很重要的东西，被人偷走了。" },
        { speaker: "subaru", text: "被偷了？那我们得报警……不对，这里没有警察吧。" },
        { speaker: "emilia", text: "有卫兵。但我不想惊动太多人。" },
      ],
      next: "felt_bump",
    },
    intro_1: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "subaru", text: "我是从很远的地方来的。" },
        { speaker: "emilia", text: "很远……有多远？" },
        { speaker: "subaru", text: "远到地图上没有。" },
        { speaker: "emilia", text: "……那还真是很远呢。" },
      ],
      next: "felt_bump",
    },
    compliment_1: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "subaru", text: "你的头发，像月光一样。" },
        { speaker: "emilia", text: "……这种话，对第一次见面的人说，很失礼。" },
        { speaker: "narrator", text: "她别过脸，但耳尖有点红。" },
      ],
      next: "felt_bump",
    },
    felt_bump: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia", "felt"],
      lines: [
        { speaker: "narrator", text: "一个金色短发的小个子从人群里钻出来，撞在艾米莉娅身上。" },
        { speaker: "felt", text: "抱歉啦——" },
        { speaker: "narrator", text: "她头也不回地钻进人群。艾米莉娅的脸色变了。" },
        { speaker: "emilia", text: "等一下！我的徽章！" },
      ],
      onEnter: function(s) {
        s.flags.insignia_stolen = true;
        s.memory.push({ owner: "subaru", fact: "金发小偷菲鲁特撞了艾米莉娅，偷走了她的徽章。", source: "witnessed", turn: s.turn });
      },
      choices: [
        { text: "立刻追", next: "chase_1", effects: { flags: { chased_fast: true } } },
        { text: "先问艾米莉娅", next: "ask_first", effects: { trust: 1, flags: { knows_slums: true } } },
        { text: "喊卫兵", next: "guard_1", effects: { flags: { guards_failed: true } } },
      ],
    },
    ask_first: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia", "felt"],
      lines: [
        { speaker: "subaru", text: "她往哪跑了？" },
        { speaker: "emilia", text: "贫民窟。那个方向。" },
        { speaker: "subaru", text: "带路。" },
      ],
      next: "chase_1",
    },
    guard_1: {
      chapter: "第一章 · 苹果摊",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia", "felt"],
      lines: [
        { speaker: "subaru", text: "抓小偷！" },
        { speaker: "narrator", text: "人群骚动。卫兵被人流挡住，等他们挤过来，金色已经不见了。" },
        { speaker: "emilia", text: "……别喊了。跟我来。" },
      ],
      next: "chase_1",
    },
    chase_1: {
      chapter: "第二章 · 贫民窟",
      bg: "slums",
      caption: "王都 · 贫民窟",
      cast: ["felt"],
      lines: [
        { speaker: "narrator", text: "你跟着那抹金色拐进狭窄的巷道。晾衣绳滴着水，墙角的污水映着夕阳。" },
        { speaker: "narrator", text: "她停在一栋仓库前，回头看了你一眼。" },
        { speaker: "felt", text: "喂，你追够了吧？" },
        { speaker: "subaru", text: "把徽章还回来。" },
        { speaker: "felt", text: "这东西是我先拿到的。想要？拿钱来。" },
      ],
      choices: [
        { text: "试着讲道理", next: "felt_talk", effects: { flags: { felt_neutral: true } } },
        { text: "吓唬她", next: "felt_threat", effects: { flags: { felt_hostile: true } } },
        { text: "直接动手", next: "felt_fight", effects: { flags: { felt_hostile: true, injured: true } } },
      ],
    },
    felt_talk: {
      chapter: "第二章 · 贫民窟",
      bg: "slums",
      caption: "王都 · 贫民窟",
      cast: ["felt"],
      lines: [
        { speaker: "subaru", text: "偷东西不好吧。失主很着急。" },
        { speaker: "felt", text: "道理？在这条街，道理不值钱。" },
        { speaker: "narrator", text: "她嘴上这么说，却没有立刻跑。" },
      ],
      next: "rom_appears",
    },
    felt_threat: {
      chapter: "第二章 · 贫民窟",
      bg: "slums",
      caption: "王都 · 贫民窟",
      cast: ["felt"],
      lines: [
        { speaker: "subaru", text: "我警告你，我可是很能打的。" },
        { speaker: "felt", text: "哈？你腿都在抖。" },
      ],
      next: "rom_appears",
    },
    felt_fight: {
      chapter: "第二章 · 贫民窟",
      bg: "slums",
      caption: "王都 · 贫民窟",
      cast: ["felt"],
      lines: [
        { speaker: "narrator", text: "你伸手去抓她。她灵活地闪开，抬脚踢在你小腿上。" },
        { speaker: "subaru", text: "好痛！" },
        { speaker: "felt", text: "就这？" },
      ],
      next: "rom_appears",
    },
    rom_appears: {
      chapter: "第二章 · 贫民窟",
      bg: "slums",
      caption: "王都 · 贫民窟",
      cast: ["felt", "rom", "emilia"],
      lines: [
        { speaker: "narrator", text: "仓库的门开了。一个巨大的老人站在门后，手里拿着一根木棍。" },
        { speaker: "rom", text: "吵死了。小姑娘，你带了客人？" },
        { speaker: "felt", text: "不是客人，是麻烦。" },
        { speaker: "rom", text: "进来吧。站在门口说话，像什么样子。" },
        { speaker: "narrator", text: "你跟着他们走进仓库。艾米莉娅从巷口追了上来。" },
      ],
      next: "loot_1",
    },
    loot_1: {
      chapter: "第二章 · 贫民窟",
      bg: "loot",
      caption: "贫民窟 · 赃物库",
      cast: ["emilia", "felt", "rom"],
      lines: [
        { speaker: "emilia", text: "把徽章还给我。那不是你该拿的东西。" },
        { speaker: "felt", text: "可以啊。十万金币。" },
        { speaker: "subaru", text: "十万？！" },
        { speaker: "rom", text: "小姑娘，别狮子大开口。" },
        { speaker: "felt", text: "罗姆，你别拆我台。" },
        { speaker: "narrator", text: "仓库里堆满赃物。一盏旧灯在头顶摇晃。" },
      ],
      next: "elsa_knock",
    },
    elsa_knock: {
      chapter: "第二章 · 贫民窟",
      bg: "loot",
      caption: "贫民窟 · 赃物库",
      cast: ["emilia", "felt", "rom", "elsa"],
      lines: [
        { speaker: "narrator", text: "门被敲响了。三下，很轻，很慢。" },
        { speaker: "rom", text: "谁？" },
        { speaker: "narrator", text: "门自己开了。一个黑发女人站在门口，衣角滴着水。" },
        { speaker: "elsa", text: "晚上好。我来取一件东西。" },
        { speaker: "felt", text: "你是谁？" },
        { speaker: "elsa", text: "雇主。或者说，替雇主跑腿的人。" },
        { speaker: "narrator", text: "她的视线扫过房间，停在艾米莉娅身上。" },
        { speaker: "elsa", text: "银发的半精灵……真是漂亮。你的肚子，一定很暖和。" },
      ],
      onEnter: function(s) {
        s.flags.elsa_arrived = true;
        s.memory.push({ owner: "subaru", fact: "艾尔莎出现在赃物库，目标是艾米莉娅。", source: "witnessed", turn: s.turn });
      },
      choices: [
        { text: "挡在艾米莉娅面前", next: "protect_1", effects: { flags: { protected: true } } },
        { text: "试图谈判", next: "negotiate_1", effects: { flags: { negotiated: true } } },
        { text: "拉艾米莉娅跑", next: "run_1", effects: { flags: { tried_run: true } } },
      ],
    },
    protect_1: {
      chapter: "第二章 · 贫民窟",
      bg: "loot",
      caption: "贫民窟 · 赃物库",
      cast: ["emilia", "felt", "rom", "elsa"],
      lines: [
        { speaker: "subaru", text: "别碰她。" },
        { speaker: "elsa", text: "哦？你要代替她？" },
        { speaker: "narrator", text: "她笑了。你甚至没看清她是怎么动的。" },
      ],
      next: "death_1",
    },
    negotiate_1: {
      chapter: "第二章 · 贫民窟",
      bg: "loot",
      caption: "贫民窟 · 赃物库",
      cast: ["emilia", "felt", "rom", "elsa"],
      lines: [
        { speaker: "subaru", text: "等等，我们可以谈。你要什么？钱？徽章？" },
        { speaker: "elsa", text: "谈？我不擅长谈话。" },
        { speaker: "narrator", text: "她歪了歪头，像是在认真考虑。然后，你听见了金属出鞘的声音。" },
      ],
      next: "death_1",
    },
    run_1: {
      chapter: "第二章 · 贫民窟",
      bg: "loot",
      caption: "贫民窟 · 赃物库",
      cast: ["emilia", "felt", "rom", "elsa"],
      lines: [
        { speaker: "narrator", text: "你抓住艾米莉娅的手腕，冲向门口。" },
        { speaker: "narrator", text: "门先一步被什么东西钉住了。" },
        { speaker: "elsa", text: "想跑？真可爱。" },
      ],
      next: "death_1",
    },
    death_1: {
      chapter: "第三章 · 第一次死亡",
      bg: "black",
      caption: "",
      cast: [],
      cg: "first_death",
      cgHideCast: true,
      lines: [
        { speaker: "narrator", text: "很疼。", if: function(s) { return !s.flags.protected && !s.flags.negotiated && !s.flags.tried_run; } },
        { speaker: "narrator", text: "你挡在艾米莉娅面前。", if: function(s) { return s.flags.protected; } },
        { speaker: "narrator", text: "你还在想怎么谈判。", if: function(s) { return s.flags.negotiated; } },
        { speaker: "narrator", text: "你没能跑到门口。", if: function(s) { return s.flags.tried_run; } },
        { speaker: "narrator", text: "然后，什么都没有了。" },
      ],
      onEnter: function(s) {
        s.flags.subaru_dead = true;
        s.flags.emilia_dead = true;
        s.deathCount += 1;
        s.memory.push({ owner: "subaru", fact: "第一次死亡：在赃物库被艾尔莎杀死。", source: "witnessed", turn: s.turn, pinned: true });
      },
      next: "death_2",
    },
    death_2: {
      chapter: "第三章 · 第一次死亡",
      bg: "black",
      caption: "",
      cast: [],
      lines: [
        { speaker: "narrator", text: "——喂，醒醒。" },
        { speaker: "narrator", text: "声音像是从很远的地方传来。" },
      ],
      next: "return_1",
    },
    return_1: {
      chapter: "第一存档点",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      lines: [
        { speaker: "narrator", text: "苹果的甜香。刺眼的阳光。你躺在同一条石板路上。" },
        { speaker: "subaru", text: "……哈？" },
        { speaker: "narrator", text: "远处，银发少女正从小贩手里接过一袋苹果。" },
        { speaker: "subaru", text: "不是梦。我记得。那个黑发女人，那间仓库，还有……" },
        { speaker: "narrator", text: "你低头看向自己的手。没有伤口。" },
      ],
      onEnter: function(s) {
        s.flags.returned_by_death = true;
        s.memory.push({ owner: "subaru", fact: "死亡回归：回到苹果摊前，除记忆外一切重置。", source: "witnessed", turn: s.turn, pinned: true });
      },
      next: "checkpoint_end",
    },
    checkpoint_end: {
      chapter: "第一存档点",
      bg: "plaza",
      caption: "王都 · 露天集市",
      cast: ["emilia"],
      cg: "checkpoint",
      lines: [
        { speaker: "narrator", text: "——死亡回归。" },
        { speaker: "narrator", text: "时间回到了苹果摊前。除了记忆，什么都没有留下。" },
        { speaker: "narrator", text: "这一次，你知道接下来会发生什么。" },
      ],
      onEnter: function(s) {
        s.checkpoint = {
          id: "appa_stall",
          label: "苹果摊前",
          loop: 1,
          outcome: "bad_end_first_loop",
          fixed: true,
          deathCount: s.deathCount,
        };
      },
      ending: {
        kicker: "BAD END 01",
        title: "第一次死亡",
        text: "你没能救下任何人。但时间回到了起点，而这一次，你记得。",
        restart: "回到苹果摊",
      },
    },
  },
};