/**
 * 消息通道信息 国际化信息
 */
export default {
  trans: true,
  key: 'smart.message.channel',
  data: {
    title: {
      channelCode: 'Channel Code',
      channelName: 'Channel Name',
      channelType1: 'Channel Type1',
      channelType2: 'Channel Type2',
      channelProperties: 'Properties',
      builtInYn: 'Built-In',
    },
    validate: {
      channelCode: '请输入通道编码',
      channelName: '请输入通道名称',
      channelType1: '请输入一级通道类型',
      channelType2: '请输入二级通道类型',
      channelProperties: '请输入通道参数',
    },
    rules: {},
    search: {
      channelCode: '请输入通道编码',
      channelName: '请输入通道名称',
      channelType1:
        '请输入一级通道类型，SYSTEM系统消息、SMS短信、EMAIL邮件、WECHAT微信、DINGDING钉钉、WEB_SOCKET',
    },
    message: {
      builtInValidateMessage: '内置的消息通道不能编辑或删除',
    },
  },
};
