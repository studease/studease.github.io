player.innerHTML = '';

var ui = playease.ui();
//ui.addGlobalListener(console.log);
ui.setup(player, {
    mode: '',
    // file: 'http://127.0.0.1/vod/sample.flv',
    // file: 'http://127.0.0.1/live/_definst_/stream02.flv',
    file: 'http://www.car-eye.cn:4025/flv?port=10077&app=live&stream=13751093611_channel_2',
    module: 'FLV',
    loader: {
        name: 'auto',
        mode: 'cors',        // cors, no-cors, same-origin
        credentials: 'omit', // omit, include, same-origin
    },
    sources: [{
        file: 'http://127.0.0.1/live/_definst_/stream02.flv',
        label: 'http-flv',
        default: true,
    }, {
        file: 'ws://127.0.0.1/live/_definst_/stream02.flv',
        label: 'ws-flv',
    }],
    plugins: [{
        kind: 'Poster',
        file: 'image/poster.png',
    }, {
        kind: 'Display',
        layout: '[Button:waiting=]',
    }, {
        kind: 'Controlbar',
        layout: '[Slider:timebar=Preview]|[Button:play=播放][Button:pause=暂停][Button:reload=重新加载][Button:stop=停止][Label:quote=Live broadcast][Label:time=00:00/00:00]||[Button:report=反馈][Button:mute=静音][Button:unmute=取消静音][Slider:volumebar=80][Select:definition=清晰度][Button:danmuoff=关闭弹幕][Button:danmuon=打开弹幕][Button:fullpage=网页全屏][Button:exitfullpage=退出网页全屏][Button:fullscreen=全屏][Button:exitfullscreen=退出全屏]',
        autohide: false,
        visibility: true,
    }, {
        kind: 'ContextMenu',
        items: [{
            mode: '',
            icon: 'image/github.png',
            text: 'studease',
            shortcut: '',
            handler: function () { window.open('https://github.com/studease/playease'); },
        }],
    }],
});

function onPlayClick() {
    ui.play(url.value);
}
