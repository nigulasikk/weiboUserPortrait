var searchArray = ['小青龙', '辉子', '潘玮柏']

var casper = require('casper').create({
    viewportSize: { width: 1900, height: 600 }
    // verbose: true,
    // logLevel: 'debug'
});

function getPeopleLinks() {
    var links = document.querySelectorAll('.pl_personlist .person_name a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

function getThreeAccount() {
    var links = document.querySelectorAll('.tb_counter strong');
    return Array.prototype.map.call(links, function(e) {
        return e.innerText;
    });
}

/**
 * 程序开始
 * @param  {[type]} ) 
 * * @return {[type]}   [description]
 */
casper.start().eachThen(searchArray, function(response) {
    var searchUrl = 'http://s.weibo.com/user/' + response.data + '&Refer=weibo_user'

    this.thenOpen(searchUrl, function() {
        this.waitForSelector('.pl_personlist', function() {
            var links = this.evaluate(getPeopleLinks);
            this.emit("getInfo", links[0]);
        });
    });
});


/**
 * 得到一个微博的记录
 * @param  {[type]} url)       {                 this.thenOpen(url, function() {                              this.waitForSelector('.tb_counter', function() {                                       var accountArray [description]
 * @param  {[type]} function() {                                                       this.echo('获取微博个人信息');                                                       } [description]
 * @param  {[type]} 10000);                    } [description]
 * @return {[type]}            [description]
 */
casper.on('getInfo', function(url) {
    this.thenOpen(url, function() {
        this.waitForSelector('.tb_counter', function() {
            // this.capture(new Date() + '.png');
            var accountArray = this.evaluate(getThreeAccount);
            var photoUrl = this.getElementAttribute('.photo', 'src')
            if (!(/http.+/.test(photoUrl))) {
                photoUrl = 'https:' + photoUrl;
            }
            var infoObj = {
                name: this.getHTML('.username'),
                intro: this.getHTML('.pf_intro'),
                photo: photoUrl,
                follows: accountArray[0],
                fans: accountArray[1],
                weibos: accountArray[2]
            }
            /**
             * 向后台发送post存储爬取记录
             */
            this.emit('postWeiboObj', infoObj)
        }, function() {
            this.echo('获取微博个人信息');
        }, 10000);
    })
})

/**
 * 向koa发送一个存储信息post
 * @param  {[type]} weiboInfo) {               this.thenOpen('http:                                method: "post",              data: weiboInfo    } [description]
 * @param  {[type]} function() {                                       this.echo("向后台发送post成功")    });}  [description]
 * @return {[type]}            [description]
 */
casper.on('postWeiboObj', function(weiboInfo) {
    this.thenOpen('http://localhost:3000/add', {
        method: "post",
        data: weiboInfo
    }, function() {
        this.echo("向后台发送post成功")
    });
})


casper.run();