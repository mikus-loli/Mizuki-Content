// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "昆明湖 blog",
		imgurl: "https://image.mikus.ink/uploads/HayasakaAi/2026/06/12/4e0cda919430.webp",
		desc: "最喜欢宁宁",
		siteurl: "https://blog.91vip.ink",
		tags: ["Blog"],
	},
	{
		id: 2,
		title: "超天酱",
		imgurl: "https://image.mikus.ink/uploads/HayasakaAi/2026/06/12/ab3580181e65.webp",
		desc: "超绝最可爱天使酱",
		siteurl: "https://www.pr80.bid",
		tags: ["Blog"],
	},

	{
		id: 3,
		title: "璃奈的小窝",
		imgurl: "https://image.mikus.ink/uploads/HayasakaAi/2026/06/12/dc8156d1b724.webp",
		desc: "欢迎来到猪咪的小窝喵！",
		siteurl: "https://arkn.icu/",
		tags: ["Blog"],
	},

	{
		id: 4,
		title: "WitchCat",
		imgurl: "https://image.mikus.ink/uploads/HayasakaAi/2026/06/12/73c298ad44b6.webp",
		desc: "可爱的女巫的折耳猫的小站",
		siteurl: "https://www.witchcat.cn",
		tags: ["Blog"],
	},


];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
