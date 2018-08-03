/**
*	Created by didiong.
*   页面常量
*/

const CGI_DOMAIN = 'https://mp.weixin.qq.com';
const CGI_PREFIX = '/weappdata';

export const PREFIX_URL = CGI_DOMAIN + CGI_PREFIX;

export const CONDITION_NAME = {
	pay_pv: '赞赏详情',
	video_pv: '视频PV趋势',
	transfer_pv: '消息转发详情',
	earn_detail: '收入详情'
}

export const PV_CHART_NAME = {
	mass_send_pv: '不同群发时间的消息在当天的打开PV',
	original_transfer_pv:'原创、转载和其他文章的打开PV',
	article_video_pv:'文章、视频图文消息的打开PV'
}

export const PV_CHART_LEGEND = {
	mass_send_pv: {
		today: '当天',
		yesterday: '昨天',
		two_day_before: '2-7天前',
		eight_day_before: '8-30天前',
		thirty_one_daya_before: '31天前'
	},
	original_transfer_pv: {
		original: '原创',
		transfer: '转载',
		other: '其他',
	},	
	article_video_pv: {
		appmsg: '图文消息',
		share: '分享页',
		other: '其他'
	}
}