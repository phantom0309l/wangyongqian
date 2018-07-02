/**
 * 现在需要监听的消息，只在前端过滤，未在服务端处理
 *
 * @param params
 * @constructor
 */

function FCWebSocket(params) {
    this.sid = params.sid || '';

    this.url = params.url || '';
    if (this.url !== '') {
        if (this.url.indexOf('?') > -1) {
            this.url += '&sid=' + this.sid;
        } else {
            this.url += '?sid=' + this.sid;
        }
    }

    this.socket = null;

    /**
     * 事件
     * @type {{}}
     */
    this.events = {};

    /**
     * 需要监听的事件code
     * @type {Array}
     */
    this.event_codes = params.event_codes || [];

    /**
     * 需要监听的通用事件code
     * @type {[string]}
     */
    const event_commonCodes = [
        'wsdemo:sayhello'
    ];

    this.event_codes = this.event_codes.concat(event_commonCodes);
}

/**
 * 权限验证
 */
FCWebSocket.prototype._auth = function (reqData) {

};

/**
 * 连接
 */
FCWebSocket.prototype.connect = function () {
    let self = this;

    if (self.socket !== null) {
        console.log('请不要重复连接');
        return false;
    }

    if (self.url === '') {
        console.log('错误的连接地址');
        return false;
    }

    // 创建一个Socket实例
    try {
        self.socket = new WebSocket(self.url);

        // 打开Socket
        self.socket.onopen = function () {
            // self.showOneUINotify('WebSocket 连接成功', '', 'fa fa-check', 'success');
            console.log('WebSocket 连接成功');
        };

        // 监听Socket的报错
        self.socket.onerror = function (event) {
            let options = {
                body: 'WebSocket 出错了',
                icon: 'fa fa-times',
                type: 'warning',
            };
            self.showOneUINotify(options);
            console.log('Client notified socket has an error', event);
        };

        // 监听Socket的关闭
        self.socket.onclose = function (event) {
            let options = {
                body: 'WebSocket 连接已断开',
                icon: 'fa fa-times',
                type: 'danger',
            };
            self.showOneUINotify(options);
            console.log('Client notified socket has closed', event);
        };

        // 监听消息
        self.socket.onmessage = function (event) {
            let d = eval('(' + event.data + ')'),
                data = d.data,
                cls = data.class,
                mtd = data.method,
                event_code = cls + ":" + mtd;
            console.log(d);

            // 检查是否需要监听
            if (!self.isWatch(event_code)) {
                console.log('未监听 ' + event_code);
                return false;
            }

            // 事件之前执行
            let before_callback = self.events[event_code + ":before"];
            if (typeof before_callback === 'function') {
                if (!before_callback(data)) { // 回调函数可以停止后续的代码执行
                    return false;
                }
            }

            switch (cls) {
                case 'wsdemo':
                    switch (mtd) {
                        case 'sayhello':
                            alert(data.msg);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'wsoptask':
                    switch (mtd) {
                        case 'getNewOptaskCnt':
                            $('#span-optaskcnt').html(data.cnt);
                            break;
                        default:
                            break;
                    }
                    break;
                case 'wsquickpass':
                    switch (mtd) {
                        case 'pushMessage':
                            self.showOneUINotify(data);
                            self.showNotify(data, function (callback_data) {
                                let url = callback_data.url || "";
                                if (url !== "") {
                                    window.open(url);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                    break;
                case 'wsquickconsult':
                    switch (mtd) {
                        case 'pushMessage':
                            self.showOneUINotify(data);
                            self.showNotify(data, function (callback_data) {
                                let url = callback_data.url || "";
                                if (url !== "") {
                                    window.open(url);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }

            // 事件之后执行
            let after_callback = self.events[event_code + ":after"];
            if (typeof after_callback === 'function') {
                after_callback(data);
            }
        };
    } catch (e) {
        let options = {
            body: 'WebSocket 连接失败',
            icon: 'fa fa-times',
            type: 'danger',
        };
        self.showOneUINotify(options);
    }
};

/**
 * 发送消息
 *
 * @param reqData
 */
FCWebSocket.prototype.send = function (reqData) {
    // 发送一个初始化消息
    this.socket.send(JSON.stringify(reqData));
};

/**
 * 添加需要监听的事件code
 *
 * @param event_code
 */
FCWebSocket.prototype.addEventCode = function (event_code) {
    if (Array.isArray(event_code)) {
        this.event_codes = this.event_codes.concat(event_code);
    } else if (typeof event_code === 'string') {
        this.event_codes.push(event_code);
    }
};

/**
 * 是否监听
 *
 * @returns {boolean}
 */
FCWebSocket.prototype.isWatch = function (event_code) {
    return $.inArray(event_code, this.event_codes) !== -1;
};

/**
 * 添加监听
 *
 * @param event: class+":"+method+":"+"after|before"
 * @param callback
 */
FCWebSocket.prototype.watch = function (event, callback) {
    this.events[event] = callback;
};

/**
 * 关闭
 *
 * @param {number} [code]
 * @param {string} [reason]
 */
FCWebSocket.prototype.close = function (code, reason) {
    this.socket.close(code, reason);
};


/* 为socket提供的控件 */
/**
 * 显示OneUI样式的通知
 *
 * @param options
 */
FCWebSocket.prototype.showOneUINotify = function (options) {
    let $notifyMsg = options.body || '',
        data = options.data || {},
        $notifyUrl = data.url || '',
        $notifyIcon = options.icon || 'si si-link',
        $notifyType = options.type || 'info',
        $notifyFrom = options.from || 'top',
        $notifyAlign = options.align || 'right';

    $.notify({
            icon: $notifyIcon,
            message: $notifyMsg,
            url: $notifyUrl
        },
        {
            element: 'body',
            type: $notifyType,
            allow_dismiss: true,
            newest_on_top: true,
            showProgressbar: false,
            placement: {
                from: $notifyFrom,
                align: $notifyAlign
            },
            offset: 20,
            spacing: 10,
            z_index: 1031,
            delay: 5000,
            timer: 1000,
            animate: {
                enter: 'animated fadeIn',
                exit: 'animated fadeOutDown'
            }
        });
};

/**
 * Chrome 通知
 *
 * @param options
 * @param onclick
 */
FCWebSocket.prototype.showNotify = function (options, onclick) {
    let title = options.title || "",
        body = options.body || "",
        tag = options.tag || "",
        icon = options.icon || "",
        sound = options.sound || "",
        data = options.data || "";

    if (window.Notification) {
        let popNotice = function () {
            if (Notification.permission === "granted") {
                let notification = new Notification(title, {
                    body: body,
                    tag: tag,
                    renotify: true,
                    icon: icon,
                    silent: true,
                    sound: sound
                });

                if (typeof onclick === 'function') {
                    notification.onclick = function () {
                        onclick(data);
                    };
                }

                // notification.close();
            }
        };

        if (Notification.permission === "granted") {
            popNotice();
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                console.log(permission);
                popNotice();
            });
        }
    } else {
        alert('浏览器不支持Notification');
    }
};