/**
*	Created by didiong.
*   页面常量
*/

const CGI_DOMAIN = 'https://mp.weixin.qq.com';
const CGI_PREFIX = '/weappdata';

export const PREFIX_URL = CGI_DOMAIN + CGI_PREFIX;

export const CONDITION_NAME = {
	'pay_pv': '赞赏详情',
	'video_pv': '视频PV趋势',
	'transfer_pv': '消息转发详情',
	'click_pv': '消息PV趋势'
}

export const PV_CHART_NAME = {
	'mass_send_pv': '不同群发时间的消息在当天的打开PV',
	'original_transfer_pv':'原创、转载和其他文章的打开PV',
	'article_video_pv':'文章、视频图文消息的打开PV'
}