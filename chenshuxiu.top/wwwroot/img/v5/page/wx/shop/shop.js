$(function () {
    var app = {
        init: function () {
            var self = this;
            self.initMask();
            //渲染购物车
            self.renderAddProductHtml();
            //渲染填写地址页
            self.initCartApp();
            //num组件
            self.handleNumBox();
            self.handleClose();
        },
        initMask: function () {
            var h = $(document).height();
            $(".mask").height(h);
        },
        handleClose: function () {
            var self = this;
            $(document).on("click", ".closeBtn", function () {
                var me = $(this);
                //var jboxNode = me.parents(".JBox");
                var jboxNode = $(".JBox");
                jboxNode.hide();
                self.hideNodes([".mask"]);
            })
        },
        renderAddProductHtml: function () {
            if ($("#app").length == 0) {
                return;
            }
            var vm = new Vue({
                el: '#app',
                data: {
                    shopproductid: 0,
                    title: "",
                    price: 0,
                    left_cnt: "",
                    imgurl: ""
                },
                computed: {
                    price_yuan: function () {
                        return this.price / 100;
                    }
                },
                mounted: function () {
                },
                methods: {
                    showAddProductBox: function (shopproductid) {
                        this.fetchData(shopproductid);
                    },
                    AddToCart: function (isDetailPage) {
                        var self = this;
                        var shopproductid = this.shopproductid;
                        var node = $(".numBox").find(".numBox-c");
                        var cnt = parseInt(node.text());
                        $.ajax({
                            url: '/shoporder/addToCartJson',
                            type: 'GET',
                            dataType: 'text',
                            data: {shopproductid: shopproductid, cnt: cnt},
                            success: function (json) {
                                if (isDetailPage === true) {
                                    window.location.href = document.referrer;
                                } else {
                                    window.location.href = fc.updateUrl(window.location.href);
                                }
                            }
                        })
                    },
                    AddToCartForCancer: function (isDetailPage) {
                        var self = this;
                        var shopproductid = this.shopproductid;
                        var node = $(".numBox").find(".numBox-c");
                        var cnt = parseInt(node.text());
                        $.ajax({
                            url: '/shoporder/addToCartForCancerJson',
                            type: 'GET',
                            dataType: 'text',
                            data: {shopproductid: shopproductid, cnt: cnt},
                            success: function (json) {
                                if (isDetailPage === true) {
                                    window.location.href = document.referrer;
                                } else {
                                    window.location.href = fc.updateUrl(window.location.href);
                                }
                            }
                        })
                    },
                    AddToCartForEKD: function (isDetailPage) {
                        var self = this;
                        var shopproductid = this.shopproductid;
                        var node = $(".numBox").find(".numBox-c");
                        var cnt = parseInt(node.text());
                        $.ajax({
                            url: '/shoporder/addToCartForEKDJson',
                            type: 'GET',
                            dataType: 'text',
                            data: {shopproductid: shopproductid, cnt: cnt},
                            success: function (json) {
                                if (isDetailPage === true) {
                                    window.location.href = document.referrer;
                                } else {
                                    window.location.href = fc.updateUrl(window.location.href);
                                }
                            }
                        })
                    },
                    AddToCartForMultDisease: function (isDetailPage) {
                        var self = this;
                        var shopproductid = this.shopproductid;
                        var node = $(".numBox").find(".numBox-c");
                        var cnt = parseInt(node.text());
                        $.ajax({
                            url: '/shoporder/addToCartForMultDiseaseJson',
                            type: 'GET',
                            dataType: 'json',
                            data: {shopproductid: shopproductid, cnt: cnt},
                            success: function (response) {
                                if (response.errno === "0") {
                                    if (isDetailPage === true) {
                                        window.location.href = document.referrer;
                                    } else {
                                        window.location.href = fc.updateUrl(window.location.href);
                                    }
                                } else {
                                    alert(response.errmsg);
                                }
                            }
                        })
                    },
                    fetchData: function (shopproductid) {
                        var self = this;
                        $.ajax({
                            url: '/shopproduct/onejson',
                            type: 'GET',
                            dataType: 'json',
                            data: {shopproductid: shopproductid},
                            beforeSend: function () {
                                $(".loading").show();
                                $(".mask").show();
                            },
                            success: function (json) {
                                var d = json["data"];
                                self.shopproductid = d.id;
                                self.title = d.title;
                                self.price = d.price;
                                self.left_cnt = d.left_cnt;
                                self.imgurl = d.imgurl;
                                $(".loading").hide();
                                $(".mask").show();
                                $(".addProductBox").show();
                            }
                        })
                    }
                }
            });
        },
        handleNumBox: function () {
            $(document).on("click", ".numBox-l", function () {
                var me = $(this);
                var numNode = me.parents(".numBox").find(".numBox-c");
                var num = parseInt(numNode.text());
                if (num <= 1) {
                    me.addClass('numBox-lgray');
                    return;
                }
                num = num - 1;
                numNode.text(num);
                if (num == 1) {
                    me.addClass('numBox-lgray');
                }
            })

            $(document).on("click", ".numBox-r", function () {
                var me = $(this);
                var numLeftNode = me.parents(".numBox").find(".numBox-l");
                var numNode = me.parents(".numBox").find(".numBox-c");
                var num = parseInt(numNode.text());
                numNode.text(num + 1);
                numLeftNode.removeClass('numBox-lgray');
            })
        },
        initCartApp: function () {
            if ($("#cart-app").length == 0) {
                return;
            }
            var vm = new Vue({
                el: '#cart-app',
                data: {
                    addressShow: {
                        shopaddressid: 0,
                        linkman_name: "",
                        linkman_mobile: "",
                        xprovince_name: "",
                        xcity_name: "",
                        xcounty_name: "",
                        content: ""
                    },
                    addressBox: {
                        shopaddressid: 0,
                        linkman_name: "",
                        linkman_mobile: "",
                        selected_xprovinceid: 0,
                        selected_xcityid: 0,
                        selected_xcountyid: 0,
                        content: "",
                        postcode: ""
                    },
                    xprovinces: [],
                    xcitys: [],
                    xcountys: []
                },
                computed: {
                    detail_address: function () {
                        var it = this.addressShow;
                        var four = ['北京市', '天津市', '上海市', '重庆市'];
                        if ($.inArray(it.xprovince_name, four) != -1) {
                            return it.xprovince_name + it.xcounty_name + it.content;
                        } else {
                            return it.xprovince_name + it.xcity_name + it.xcounty_name + it.content;
                        }
                    }
                },
                mounted: function () {
                    this.ShowAddressShow();
                },
                methods: {
                    ShowAddressShow: function () {
                        var self = this;
                        $.ajax({
                            url: '/shopaddress/onejson',
                            type: 'GET',
                            dataType: 'json',
                            data: {ismaster: true},
                            beforeSend: function () {
                                $(".loading").show();
                                $(".mask").show();
                            },
                            success: function (json) {
                                var d = json["data"];
                                var it = self.addressShow;

                                it.shopaddressid = d.id;
                                it.linkman_name = d.linkman_name;
                                it.linkman_mobile = d.linkman_mobile;
                                it.xprovince_name = d.xprovince_name;
                                it.xcity_name = d.xcity_name;
                                it.xcounty_name = d.xcounty_name;
                                it.content = d.content;

                                $(".loading").hide();
                                $(".mask").hide();
                            }
                        })
                    },
                    showAddressBox: function (shopaddressid) {
                        var self = this;
                        self.getXProvinces();
                        $.ajax({
                            url: '/shopaddress/onejson',
                            type: 'GET',
                            dataType: 'json',
                            data: {shopaddressid: shopaddressid},
                            beforeSend: function () {
                                $(".loading").show();
                                $(".mask").show();
                            },
                            success: function (json) {
                                var d = json["data"];
                                var it = self.addressBox;
                                if (d.id) {
                                    self.getXCitys(d.xprovinceid);
                                    self.getXcountys(d.xcityid);

                                    it.shopaddressid = d.id;

                                    it.linkman_name = d.linkman_name;
                                    it.linkman_mobile = d.linkman_mobile;
                                    it.selected_xprovinceid = d.xprovinceid;

                                    it.selected_xcityid = d.xcityid;
                                    it.selected_xcountyid = d.xcountyid;
                                    it.content = d.content;
                                    it.postcode = d.postcode;
                                } else {
                                    it.shopaddressid = 0;

                                    it.linkman_name = "";
                                    it.linkman_mobile = "";
                                    it.selected_xprovinceid = 0;

                                    it.selected_xcityid = 0;
                                    it.selected_xcountyid = 0;
                                    it.content = "";
                                    it.postcode = "";

                                    self.xcitys = [];
                                    self.xcountys = [];
                                }
                                $(".loading").hide();
                                $(".mask").show();
                                $(".addressBox").show();
                            }
                        })
                    },
                    changeMasterAddress: function (shopaddressid, event) {
                        var self = this;
                        var it = this.addressShow;
                        $(".addressListBox-masterCheck").removeClass('am-icon-check-circle blue');
                        $(".addressListBox-masterCheck").addClass('am-icon-circle gray');
                        var thenode = $(event.srcElement).parents(".addressListBox-item").find(".addressListBox-masterCheck");
                        thenode.addClass('am-icon-check-circle blue');
                        thenode.removeClass('am-icon-circle gray');
                        $.ajax({
                            url: '/shopaddress/changeMasterJson',
                            type: 'GET',
                            dataType: 'text',
                            data: {shopaddressid: shopaddressid},
                            success: function (json) {
                                it.shopaddressid = shopaddressid;
                                $(".addressListBox").hide();
                                self.ShowAddressShow();
                            }
                        })
                    },
                    handleXProvinceChange: function () {
                        var it = this.addressBox;
                        this.getXCitys(it.selected_xprovinceid);
                        it.selected_xcityid = 0;
                        it.selected_xcountyid = 0;
                    },
                    handleXCityChange: function () {
                        var it = this.addressBox;
                        this.getXcountys(it.selected_xcityid);
                        it.selected_xcountyid = 0;
                    },
                    getXProvinces: function () {
                        var self = this;
                        $.ajax({
                            url: '/shopaddress/getXProvincesJson',
                            type: 'GET',
                            dataType: 'json',
                            async: false,
                            success: function (json) {
                                var d = json["data"];
                                self.xprovinces = d;
                            }
                        })
                    },
                    getXCitys: function (xprovinceid) {
                        var self = this;
                        $.ajax({
                            url: '/shopaddress/getXCitysJson',
                            type: 'GET',
                            dataType: 'json',
                            data: {xprovinceid: xprovinceid},
                            async: false,
                            success: function (json) {
                                var d = json["data"];
                                self.xcitys = d;
                            }
                        })
                    },
                    getXcountys: function (xcityid) {
                        var self = this;
                        $.ajax({
                            url: '/shopaddress/getXcountysJson',
                            type: 'GET',
                            dataType: 'json',
                            data: {xcityid: xcityid},
                            async: false,
                            success: function (json) {
                                var d = json["data"];
                                self.xcountys = d;
                            }
                        })
                    },
                    saveAddress: function () {
                        var cango = this.checkAddressData();
                        if (cango) {
                            var data = this.addressBox;
                            var url = data.shopaddressid > 0 ? '/shopaddress/modifyJson' : '/shopaddress/addJson';
                            $.ajax({
                                url: url,
                                type: 'POST',
                                dataType: 'json',
                                data: data,
                                success: function (response) {
                                    if (response.errno === '0') {
                                        window.location.href = fc.updateUrl(window.location.href);
                                    } else {
                                        $.alert(response.errmsg);
                                    }
                                }
                            })
                        }
                    },
                    checkAddressData: function () {
                        var it = this.addressBox;
                        var linkman_name = it.linkman_name;
                        if (linkman_name == "") {
                            alert("请填写收件人");
                            return false;
                        }

                        var linkman_mobile = it.linkman_mobile;
                        var reg = /^1\d{10}$/;
                        if (!reg.test(linkman_mobile)) {
                            alert("请填写正确的手机号");
                            return false;
                        }

                        var xprovinceid = it.selected_xprovinceid;
                        var xcityid = it.selected_xcityid;
                        var xcountyid = it.selected_xcountyid;

                        if (xprovinceid == 0 || xcityid == 0 || xcountyid == 0) {
                            alert("请填写地区");
                            return false;
                        }

                        var content = it.content;
                        if (content == "") {
                            alert("请填写详细地址");
                            return false;
                        }

                        return true;
                    },
                    ShowAddressListBox: function () {
                        $(".mask").show();
                        $(".addressListBox").show();
                    },
                    jiaCnt: function (shoporderitemid) {
                        $.ajax({
                            url: '/shoporderitem/jiaCntJson',
                            type: 'GET',
                            dataType: 'text',
                            data: {shoporderitemid: shoporderitemid},
                            success: function (err_code) {
                                if (err_code == "too_more") {
                                    alert("超出了最大购买数量!");
                                }
                                window.location.href = fc.updateUrl(window.location.href);
                            }
                        })
                    },
                    jianCnt: function (shoporderitemid) {
                        $.ajax({
                            url: '/shoporderitem/jianCntJson',
                            type: 'GET',
                            dataType: 'text',
                            data: {shoporderitemid: shoporderitemid},
                            success: function (json) {
                                window.location.href = fc.updateUrl(window.location.href);
                            }
                        })
                    },
                    delShopOrderItem: function (shoporderitemid) {
                        if (confirm("确定要删除吗？")) {
                            $.ajax({
                                url: '/shoporderitem/deleteJson',
                                type: 'GET',
                                dataType: 'text',
                                data: {shoporderitemid: shoporderitemid},
                                success: function (err_msg) {
                                    if (err_msg == "ok") {
                                        window.location.href = fc.updateUrl(window.location.href);
                                    } else {
                                        window.location.href = document.referrer;
                                    }
                                }
                            })
                        }
                    },
                    lackjiaCnt: function (shoporderitem_lackid) {
                        $.ajax({
                            url: '/shoporderitem_lack/jiaCntJson',
                            type: 'GET',
                            dataType: 'json',
                            data: {shoporderitem_lackid: shoporderitem_lackid},
                            success: function (data) {
                                if (data.errmsg == "too_more") {
                                    alert("超出了最大购买数量!");
                                }
                                window.location.href = fc.updateUrl(window.location.href);
                            }
                        })
                    },
                    lackjianCnt: function (shoporderitem_lackid) {
                        $.ajax({
                            url: '/shoporderitem_lack/jianCntJson',
                            type: 'GET',
                            dataType: 'json',
                            data: {shoporderitem_lackid: shoporderitem_lackid},
                            success: function (data) {
                                window.location.href = fc.updateUrl(window.location.href);
                            }
                        })
                    },
                    delMedicineShopOrderItem_lack: function (shoporderitem_lackid) {
                        if (confirm("确定要删除吗？")) {
                            $.ajax({
                                url: '/shoporderitem_lack/deleteJson',
                                type: 'GET',
                                dataType: 'json',
                                data: {shoporderitem_lackid: shoporderitem_lackid},
                                success: function (data) {
                                    if (data.errmsg == "ok") {
                                        window.location.href = fc.updateUrl(window.location.href);
                                    } else {
                                        window.location.href = document.referrer;
                                    }
                                }
                            })
                        }
                    },
                    setNotice: function (shoporderitem_lackid, event) {
                        var e = event.srcElement;
                        var node = $(e);
                        if (node.hasClass("default")) {
                            return;
                        }
                        $.ajax({
                            url: '/shopproductnotice/addJson',
                            type: 'GET',
                            dataType: 'json',
                            data: {shoporderitem_lackid: shoporderitem_lackid},
                            success: function (data) {
                                if (data.errmsg == "ok") {
                                    node.addClass("default");
                                    node.text('已设置');
                                } else {
                                    alert("设置失败！");
                                }
                            }
                        })
                    },
                    delMedicineShopOrderItem: function (shoporderitemid) {
                        if (confirm("确定要删除吗？")) {
                            $.ajax({
                                url: '/shoporderitem/deleteJson',
                                type: 'GET',
                                dataType: 'text',
                                data: {shoporderitemid: shoporderitemid},
                                success: function (err_msg) {
                                    if (err_msg == "ok") {
                                        window.location.href = fc.updateUrl(window.location.href);
                                    } else {
                                        window.location.href = "/shopmedicine/index";
                                    }
                                }
                            })
                        }
                    }
                }
            });
        },
        hideNodes: function (hideArr) {
            $.each(hideArr, function (i, v) {
                $(v).hide();
            })
        }
    };

    app.init();
})
