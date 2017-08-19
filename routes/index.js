const router = require('koa-router')()
var WeiboUser = require('../model/WeiboUser');


router.get('/', async(ctx, next) => {
    let wuser = await WeiboUser.find();
    await ctx.render('index', {
        title: 'users',
        users: wuser
    })
})

/**
 * `
 *name: String,
  intro: String,
  photo: String,
  follows: String,
  fans: String,
  weibos: String
 */
router.get('/add', async(ctx, next) => {
    var user = new WeiboUser({ name: 'kaikai', intro: 'xixi', photo: 'xixi', follows: 'xixi', fans: 'xixi', weibos: 'xixi' });
    await user.save();
    ctx.body = 'add success!'
})


// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// })

module.exports = router