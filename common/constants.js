/**
*	Created by didiong.
*   页面常量
*/

const CGI_DOMAIN = 'https://mp.weixin.qq.com';
const CGI_PREFIX = '/wxastatistics/biz_v2_data';

export const PREFIX_URL = CGI_DOMAIN + CGI_PREFIX;

export const STORAGE_KEY = {
  SESSION: 'app_session',
  DRAFT: 'draft_article',
  INDEX_DATA:"index_data"
}

/**
 * 各种返回码
 */
export const RET_CODE = {
  NO_CREATE_AUTHOR: 10000, // 10000: 未创建作者，需要创建
  SESSION_EXPIRE: 200003, // session失效
}

export const CONDITION_KEY = {
	msg_pv: 1,
	share_pv: 2,
	video_pv: 3,	
	money: 4
}

export const CONDITION_NAME = {
	msg_pv: '消息PV趋势',
	share_pv: '消息转发详情',
	video_pv: '视频VV趋势',	
	money: '收入详情'
}

export const PV_CHART_NAME = {
	sendtime: '不同群发时间的消息在当天的打开PV',
	reprinttype:'原创、转载和其他文章的打开PV',
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

export const MSG_PV_KEY = {
	sendtime: 1,
	reprinttype: 2,
	article_video_pv: 3
}

export const PV_CHART_KEY = {
	sendtime: ['当天','昨天','2-7天前','8-30天前','31天前'],
	reprinttype: ['原创','转载','其他'],	
	article_video_pv: ['图文消息','分享页','其他']
}

export const REQUESY_TYPE = {
	tab_data: 1,
	tab_trend_data: 2,
	pv_data: 3
}