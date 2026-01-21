// 基础 CDN 地址 (韦特塔罗)
const BASE_URL = "https://www.sacred-texts.com/tarot/pkt/img";

// 1. 定义大阿卡纳 (22张)
const MAJORS = [
    "愚人", "魔术师", "女祭司", "皇后", "皇帝", "教皇", "恋人", "战车",
    "力量", "隐士", "命运之轮", "正义", "倒吊人", "死神", "节制", "恶魔",
    "高塔", "星星", "月亮", "太阳", "审判", "世界"
];

// 2. 定义小阿卡纳的花色和前缀
const SUITS = [
    { name: "权杖", prefix: "wa" },
    { name: "圣杯", prefix: "cu" },
    { name: "宝剑", prefix: "sw" },
    { name: "星币", prefix: "pe" }
];

// 3. 定义宫廷牌名称映射 (11-14)
const RANKS: Record<number, string> = {
    1: "首牌", 2: "二", 3: "三", 4: "四", 5: "五",
    6: "六", 7: "七", 8: "八", 9: "九", 10: "十",
    11: "侍从", 12: "骑士", 13: "皇后", 14: "国王"
};

// --- 核心逻辑：自动生成 78 张牌的映射对象 ---
export const FULL_TAROT_DECK: Record<string, string> = {};

// 生成大阿卡纳 (ar00.jpg - ar21.jpg)
MAJORS.forEach((name, index) => {
    const fileNum = index.toString().padStart(2, '0'); // 补零: 0 -> 00, 1 -> 01
    FULL_TAROT_DECK[`${name} (大阿卡纳)`] = `${BASE_URL}/ar${fileNum}.jpg`;
});

// 生成小阿卡纳 (56张)
SUITS.forEach(suit => {
    for (let i = 1; i <= 14; i++) {
        const fileNum = i.toString().padStart(2, '0');
        const rankName = RANKS[i] || i.toString(); // 如果是1-10就是数字，否则是宫廷名
        const fullName = `${suit.name}${rankName}`;
        FULL_TAROT_DECK[fullName] = `${BASE_URL}/${suit.prefix}${fileNum}.jpg`;
    }
});

// 导出一个数组格式，方便前端随机抽取
export const TAROT_CARDS_LIST = Object.keys(FULL_TAROT_DECK);