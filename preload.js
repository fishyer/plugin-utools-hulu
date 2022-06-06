'use strict';

const {
  utools
} = window;

const axios = require('axios');

const addHulu = (content) => {
  const api = utools.db.get('api');
  console.log(api)
  if (!api) {
    utools.showNotification('请先设置个人 API');
    return
  }
  const data = JSON.stringify({
    "content": content
  });

  const config = {
    method: 'post',
    // 登录葫芦笔记笔记库首页，点击头像，进入个人中心，然后点击获取API链接，即可得到API链接 https://www.hulunote.com/app
    // 类似于这样的url: 'https://www.hulunote.com/myapi/quick-text-put/868253a542864a498090260f2462af3f',
    url: api.api,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      utools.showNotification('发送成功！');
    })
    .catch(function (error) {
      console.log(error);
      utools.showNotification('发送失败！');
    });

}

window.exports = {
  'set_api': {
    mode: 'list',
    args: {
      enter: () => {
        utools.subInputFocus();
      },
      search: (action, searchWord, callbackSetList) => {
        callbackSetList([{
          title: '确定',
          description: '设置 hulu API',
          icon: 'icons/setapi.png',
          api: searchWord,
        }]);
      },
      select: (action, itemData, callbackSetList) => {
        const api = utools.db.get('api');
        const data = {
          _id: 'api',
          api: itemData.api,
        };
        //rev 属性，这是代表此文档的版本，每次对文档进行更新时，都要带上最新的版本号，否则更新将失败，版本化的意义在于解决同步时数据冲突
        if (api) {
          data._rev = api._rev;
        }
        utools.db.put(data);
        utools.hideMainWindow();
        utools.showNotification('设置 个人API 成功！');
        utools.outPlugin();
      },
      placeholder: "输入"
    }
  },
  'send_to_hulu': {
    mode: 'none',
    args: {
      enter: (action, callbackSetList) => {
        utools.hideMainWindow();
        const {
          payload
        } = action;
        addHulu(payload)
        utools.outPlugin();
      },
    }
  },
  'add_to_hulu': {
    mode: 'list',
    args: {
      // 进入插件时调用（可选）
      enter: () => {
        utools.subInputFocus();
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        callbackSetList([{
          title: '添加笔记到hulu',
          description: '随便记点什么吧',
          icon: 'icons/setapi.png',
          content: searchWord
        }]);
      },
      // 用户选择列表中某个条目时被调用
      select: (action, itemData, callbackSetList) => {
        utools.hideMainWindow();
        addHulu(itemData.content)
        utools.outPlugin();
      },
      placeholder: "输入"
    }
  },
}