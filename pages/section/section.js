// require引入config.js文件
var CONFIG = require("../../utils/config.js");

// 页面注册
Page({
    data: {
        themes: "",
        topic: [],
        description: "",
        themeimage: "",
        editors: "",
        curNav: ""
    },
    onLoad: function () {
        // this.getThemes();
        // this.get_hot();
    },
    findMatchingWords: function (words, list) {
        var matches = [];
        for (var i = 0; i < words.length; i++) {
            for (var j = 0; j < list.length; j++) {
                if (words[i].query.includes(list[j])) {
                    matches.push(words[i].query);
                }
            }
        }
        return matches;
    }
});


