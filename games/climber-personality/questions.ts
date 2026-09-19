import type { Question } from "@/lib/gameTypes";

// 12 questions. Dimensions: power, beta, social, adventure, chill, stoke
export const questions: Question[] = [
  {
    id: "q1",
    prompt: { en: "Your climbing session starts at 7 PM. You…", zh: "约好晚上 7 点开练。你…" },
    answers: [
      { id: "A", label: { en: "Already warming up at 6:30.", zh: "6 点半就到了，热身中。" }, scores: { power: 2, stoke: 2, beta: 1 } },
      { id: "B", label: { en: "7:05 is basically 7.", zh: "7 点 05 也算 7 点吧。" }, scores: { chill: 1, social: 1, stoke: 1 } },
      { id: "C", label: { en: "Depends who's going.", zh: "看有谁去再说。" }, scores: { social: 3 } },
      { id: "D", label: { en: "I might be 30 minutes late.", zh: "大概会迟到半小时。" }, scores: { chill: 2, adventure: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: { en: "Your partner says: “One more try.” You…", zh: "搭子说：“再来最后一次。” 你…" },
    answers: [
      { id: "A", label: { en: "Let's send it.", zh: "冲！这把过。" }, scores: { power: 2, stoke: 2 } },
      { id: "B", label: { en: "One more = five more.", zh: "最后一次 = 再来五次。" }, scores: { power: 2, beta: 1, stoke: 1 } },
      { id: "C", label: { en: "Film it first.", zh: "先拍个视频。" }, scores: { social: 2, beta: 1 } },
      { id: "D", label: { en: "I need food.", zh: "我先去吃点东西。" }, scores: { chill: 2, social: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: { en: "You fall off your project. Your next move?", zh: "在你的项目上掉了。下一步？" },
    answers: [
      { id: "A", label: { en: "Immediately try again.", zh: "立刻再来一次。" }, scores: { power: 2, stoke: 2 } },
      { id: "B", label: { en: "Study the beta before the next go.", zh: "先研究一下 beta 再上。" }, scores: { beta: 3 } },
      { id: "C", label: { en: "Brush the holds like crazy, soak my hands in chalk, try again.", zh: "疯狂刷点，把手泡进镁粉，再来一次。" }, scores: { beta: 2 } },
      { id: "D", label: { en: "Take a break and talk it out.", zh: "歇一下，边聊边分析。" }, scores: { social: 2, chill: 2 } },
    ],
  },
  {
    id: "q4",
    prompt: { en: "Your perfect climbing session is…", zh: "你心目中的完美攀岩日是…" },
    answers: [
      { id: "A", label: { en: "Hours of pure sending.", zh: "几个小时，纯冲线。" }, scores: { power: 3, stoke: 1 } },
      { id: "B", label: { en: "Good climbs + good people.", zh: "好线 + 好人。" }, scores: { social: 2, chill: 1, stoke: 1 } },
      { id: "C", label: { en: "Trying routes I've never touched.", zh: "尝试从没碰过的线。" }, scores: { adventure: 3, beta: 1 } },
      { id: "D", label: { en: "80% sitting on the mat, 20% climbing, 100% vibes.", zh: "80% 坐垫子，20% 爬，100% 氛围。" }, scores: { social: 2, chill: 2 } },
    ],
  },
  {
    id: "q5",
    prompt: { en: "Real talk — why do you climb?", zh: "说实话 — 你为啥攀岩？" },
    answers: [
      { id: "A", label: { en: "To get strong and stay in shape.", zh: "为了变强、保持身材。" }, scores: { power: 2, stoke: 1 } },
      { id: "B", label: { en: "To switch my brain off — it's my meditation.", zh: "为了放空 — 这就是我的冥想。" }, scores: { chill: 3 } },
      { id: "C", label: { en: "For the back muscles, obviously. 💪", zh: "当然是为了背肌啊。💪" }, scores: { power: 1, stoke: 2 } },
      { id: "D", label: { en: "The gym homies (and hotties).", zh: "为了岩馆的搭子（和帅哥美女）。" }, scores: { social: 3 } },
    ],
  },
  {
    id: "q7",
    prompt: { en: "The gym just set new routes. You…", zh: "岩馆刚定了新线。你…" },
    answers: [
      { id: "A", label: { en: "Already tried them all before warming up.", zh: "还没热身就全试了一遍。" }, scores: { power: 2, stoke: 2 } },
      { id: "B", label: { en: "Watch someone crush it, then steal their beta.", zh: "看别人爬，顺手偷 beta。" }, scores: { beta: 3 } },
      { id: "C", label: { en: "Ask everyone which ones are good.", zh: "挨个问大家哪条好玩。" }, scores: { social: 3 } },
      { id: "D", label: { en: "Go straight for the wildest-looking line.", zh: "直冲看起来最野的那条。" }, scores: { adventure: 3 } },
    ],
  },
  {
    id: "q8",
    prompt: { en: "Your energy during a session is best described as…", zh: "你在岩馆的状态最像…" },
    answers: [
      { id: "A", label: { en: "Loud and amped — LET'S GO.", zh: "又吵又燃 — 冲就完了！" }, scores: { power: 1, stoke: 3 } },
      { id: "B", label: { en: "Quiet and focused, in my own zone.", zh: "安静专注，沉浸自己的世界。" }, scores: { chill: 3, beta: 1 } },
      { id: "C", label: { en: "Chatting and hyping everyone up.", zh: "到处聊天，给大家加油打气。" }, scores: { social: 3 } },
      { id: "D", label: { en: "Restless — always onto the next new thing.", zh: "坐不住 — 永远想试下一个新东西。" }, scores: { adventure: 3, chill: 1 } },
    ],
  },
  {
    id: "q10",
    prompt: { en: "Right after a session, you're…", zh: "刚爬完，你会…" },
    answers: [
      { id: "A", label: { en: "Logging every attempt in an app.", zh: "在 App 里记录每一次尝试。" }, scores: { beta: 3, power: 1 } },
      { id: "B", label: { en: "Food / drinks / boba — the real crux.", zh: "吃的 / 喝的 / 奶茶 — 真正的难点。" }, scores: { social: 3, chill: 1 } },
      { id: "C", label: { en: "Already plotting the next session before I've even left.", zh: "还没走就在计划下一次了。" }, scores: { adventure: 3, stoke: 1 } },
      { id: "D", label: { en: "Flat on the mat, cooked, content.", zh: "瘫在垫子上，累瘫，但很满足。" }, scores: { chill: 3 } },
    ],
  },
  {
    id: "q11",
    prompt: { en: "It's comp day at the gym. You…", zh: "岩馆比赛日。你…" },
    answers: [
      { id: "A", label: { en: "Signed up weeks ago — I'm here to win.", zh: "几周前就报名了 — 我是来赢的。" }, scores: { power: 1, stoke: 2 } },
      { id: "B", label: { en: "Cheering the loudest from the crowd.", zh: "在人群里喊得最大声。" }, scores: { social: 3 } },
      { id: "C", label: { en: "Doing the fun-looking problems, ignoring the scorecard.", zh: "挑好玩的爬，不管计分卡。" }, scores: { adventure: 2, chill: 1 } },
      { id: "D", label: { en: "Comp? I'll just do my normal session.", zh: "比赛？我就正常爬我的。" }, scores: { chill: 2, beta: 1 } },
    ],
  },
  {
    id: "q12",
    prompt: { en: "Your dream climbing trip is…", zh: "你的梦想攀岩之旅是…" },
    answers: [
      { id: "A", label: { en: "A hard crag with one perfect project.", zh: "去硬岩场，磕一条完美项目。" }, scores: { power: 2, beta: 1 } },
      { id: "B", label: { en: "Multi-day, tent, no wifi, no plan.", zh: "多日露营，没 wifi，没计划。" }, scores: { adventure: 3, chill: 1 } },
      { id: "C", label: { en: "Wherever the crew is going.", zh: "搭子去哪我去哪。" }, scores: { social: 3 } },
      { id: "D", label: { en: "A few easy climbs and a big lunch.", zh: "爬几条简单的，再来顿大餐。" }, scores: { chill: 3 } },
    ],
  },
  {
    id: "q13",
    prompt: { en: "A newer climber asks you for help. You…", zh: "新手向你求助。你…" },
    answers: [
      { id: "A", label: { en: "Break down the beta, move by move.", zh: "一个动作一个动作地拆解 beta。" }, scores: { beta: 3 } },
      { id: "B", label: { en: "Hype them up until they send it.", zh: "疯狂打气直到他们爬上去。" }, scores: { social: 2, stoke: 2 } },
      { id: "C", label: { en: "Just show them — by trying it yourself.", zh: "直接示范 — 自己先爬一遍。" }, scores: { power: 2, stoke: 1 } },
      { id: "D", label: { en: "Point them to someone else — I'm resting.", zh: "指个别人吧 — 我在休息。" }, scores: { chill: 2 } },
    ],
  },
  {
    id: "q14",
    prompt: { en: "What matters most in a climbing partner?", zh: "攀岩搭子最重要的是什么？" },
    answers: [
      { id: "A", label: { en: "Someone strong who pushes me onto harder grades.", zh: "够强，能推着我上更难的线。" }, scores: { power: 2, beta: 1 } },
      { id: "B", label: { en: "Rock-solid and reliable — great catch, always on time.", zh: "稳当可靠 — 保护给力，从不迟到。" }, scores: { beta: 1, chill: 1, social: 1 } },
      { id: "C", label: { en: "Good vibes — turns any session into a proper hangout.", zh: "氛围感 — 把每次训练都变成聚会。" }, scores: { social: 2, stoke: 1 } },
      { id: "D", label: { en: "Down for anything — new crags, road trips, wild ideas.", zh: "什么都愿意试 — 新岩场、公路旅行、奇葩点子。" }, scores: { adventure: 2, stoke: 1 } },
    ],
  },
  {
    id: "q15",
    prompt: { en: "You feel the best when…", zh: "你最爽的时刻是…" },
    answers: [
      { id: "A", label: { en: "A stranger praises your send.", zh: "陌生人夸你的完成。" }, scores: { social: 1, stoke: 2 } },
      { id: "B", label: { en: "You bump into an old climbing friend.", zh: "偶遇一位老岩友。" }, scores: { social: 3 } },
      { id: "C", label: { en: "You finally send a long-time project.", zh: "终于磕下磕了很久的项目。" }, scores: { power: 1, beta: 2 } },
      { id: "D", label: { en: "You break in shiny new gear / shoes.", zh: "开箱全新的装备 / 岩鞋。" }, scores: { adventure: 1, beta: 1, stoke: 1 } },
    ],
  },
  {
    id: "q16",
    prompt: { en: "Your biggest disappointment is…", zh: "最让你失落的是…" },
    answers: [
      { id: "A", label: { en: "Your gym crush cancels their membership.", zh: "你在岩馆的暗恋对象退卡了。" }, scores: { social: 2, stoke: 1 } },
      { id: "B", label: { en: "You flashed a new line but forgot to film it.", zh: "flash 了新线，却忘了录像。" }, scores: { social: 1, stoke: 2 } },
      { id: "C", label: { en: "The gym closes right as you're about to send.", zh: "眼看就要完成，岩馆关门了。" }, scores: { power: 2, stoke: 1 } },
      { id: "D", label: { en: "Your climbing buddy stands you up.", zh: "约好的搭子放你鸽子。" }, scores: { social: 2, chill: 1 } },
    ],
  },
];
