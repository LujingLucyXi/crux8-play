import type { Lang, Loc } from "./gameTypes";

// UI copy dictionary (everything outside the game content).
export const UI = {
  play: { en: "PLAY", zh: "玩一玩" },
  heroLine1: { en: "What Type of", zh: "你是哪种" },
  heroLine2: { en: "Climber Are You?", zh: "攀岩搭子？" },
  heroSub: { en: "14 moves · 60 seconds · one card.", zh: "14 道题 · 60 秒 · 抽出你的人格卡。" },
  start: { en: "PULL YOUR CARD", zh: "抽卡" },
  noSignup: { en: "No sign-up. Just climbing.", zh: "免注册 · 纯攀岩" },
  joinCommunity: { en: "Join the Crux8 climbing community", zh: "加入 Crux8 攀岩社区" },
  playedCount: { en: "climbers played", zh: "位岩友已参与" },

  skip: { en: "🤷 None of these", zh: "🤷 都不太像我" },
  routeLabel: { en: "YOUR ROUTE", zh: "你的线路" },
  revealTap: { en: "👆 TAP TO REVEAL", zh: "👆 点我翻牌" },
  yourCard: { en: "YOUR CARD", zh: "你的人格卡" },
  calculating: { en: "CALCULATING YOUR\nCLIMBING DNA…", zh: "正在计算你的\n攀岩 DNA…" },
  youAre: { en: "YOU ARE", zh: "你是" },
  yourDna: { en: "YOUR CLIMBER DNA 🧬", zh: "你的攀岩 DNA 🧬" },
  sendToPartner: { en: "Send this to your climbing partner 👀", zh: "发给你的攀岩搭子看看 👀" },

  share: { en: "SHARE MY CLIMBER DNA", zh: "分享我的攀岩 DNA" },
  building: { en: "Building DNA card…", zh: "正在生成卡片…" },
  shareHint: { en: "Opens your phone's share sheet (Messages, AirDrop…)", zh: "打开手机分享菜单（信息、隔空投送…）" },
  save: { en: "⬇ Save card — IG · TikTok · WeChat · 小红书", zh: "⬇ 保存卡片 — 发 IG、TikTok、微信、小红书" },
  saveHint: { en: "Saves the image, then post it to any app", zh: "先保存图片，再发到任意 App" },
  saveHintMobile: { en: "Tap Save → “Save Image” drops it straight into your Photos 📸", zh: "点保存 → 点「存储图像」，直接进相册 📸" },
  savedNote: { en: "Saved! Post to IG, TikTok, WeChat Moments, 小红书 — anywhere 👀", zh: "已保存！发 IG、TikTok、朋友圈、小红书都行 👀" },
  invite: { en: "🔗 Invite a friend to play", zh: "🔗 邀请好友来测" },
  inviteCopied: { en: "Link copied — send it to your crew! 🧗", zh: "链接已复制，发给你的攀岩搭子！🧗" },
  savedShareNote: { en: "Saved your DNA card — post it anywhere 👀", zh: "已保存 DNA 卡片 — 随便发 👀" },
  longPressNote: { en: "Long-press the image to save it 📸", zh: "长按图片保存 📸" },
  screenshotNote: { en: "Screenshot this screen to share your result 📸", zh: "截图这个页面来分享结果 📸" },
  playAgain: { en: "Play again", zh: "再玩一次" },

  ctaTitle: { en: "Join the Crux8 app waitlist", zh: "最酷的攀岩社交 App，敬请期待 ✨" },
  ctaSub: { en: "Promos, buddies, and good vibes coming your way.", zh: "优惠、搭子和好心情，马上安排。" },
  ctaButton: { en: "Follow Crux8 Climbing →", zh: "关注 Crux8 Climbing →" },

  emailTitle: { en: "🎟️ Join the Crux8 app waitlist", zh: "🎟️ 抢先加入 waitlist · 最酷的攀岩社交 App" },
  emailSub: { en: "Find the perfect buddy for a session tonight or a group trip outdoors.", zh: "帮你找到今晚开练或周末出行的完美搭子。" },
  emailPerk: { en: "Promos, buddies & good vibes coming your way.", zh: "优惠、搭子和好心情，马上安排。" },
  emailPlaceholder: { en: "you@email.com", zh: "你的邮箱" },
  emailClaim: { en: "Claim", zh: "加入" },
  emailBusy: { en: "…", zh: "…" },
  emailError: { en: "Enter a valid email and try again.", zh: "请输入有效邮箱后再试。" },
  emailDoneTitle: { en: "You're on the list 🎉", zh: "你已加入名单 🎉" },
  emailDoneSub: {
    en: "Climber DNA saved. Promos, buddies, and good vibes are coming your way — check your inbox soon.",
    zh: "攀岩 DNA 已保存。优惠、搭子和好心情马上就到 — 记得看邮箱。",
  },
} satisfies Record<string, Loc>;

export type UiKey = keyof typeof UI;

export function tr(key: UiKey, lang: Lang): string {
  return UI[key][lang] ?? UI[key].en;
}
