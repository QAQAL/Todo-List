// WEIBO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}

// 增加一个 weibo
var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

// 删除一个 weibo
var apiWeiboDelete = function(id, callback) {
    var path = '/api/weibo/delete?id=' + id
    ajax('GET', path, '', callback)
}

// 更新一个 weibo
var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

// 获取所有 comment
var apiCommentAll = function(id, callback) {
    var path = '/api/weibo/allcomments?id=' + id
    ajax('GET', path, '', callback)
}

//增加一个 comment
var apiCommentAdd = function(form, callback) {
    var path = '/api/weibo/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(id, callback) {
    var path = '/api/weibo/comment/delete?id=' + id
    ajax('GET', path, '', callback)
}


// WEIBO DOM   // 返回weibo-cell
var weiboTemplate = function(weibo) {
    var content = weibo.content
    var id = weibo.id
    // data-* 是 HTML5 新增的自定义标签属性的方法
    // data-id="1" 获取属性的方式是 .dataset.id
    var w = `
        <div class="weibo-cell" data-id="${id}">
            <span class="weibo-content pure-button">${content}</span>
            <button class="weibo-edit pure-button-primary" data-id="${id}">编辑</button>
            <button class="weibo-delete pure-button-primary" data-id="${id}">删除</button>
        </div>
        <br>
    `
    return w
}

var weiboUpdateFormTemplate = function() {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input">
            <button class="weibo-update pure-button-primary">更新</button>
        </div>
    `
    return t
}

var commentTemplate = function(comment) {
    var content = comment.content
    var id = comment.id
    var t = `
        <div class="comment-cell" data-comment_id="${id}">
            <span class="comment-content" data-comment_id="${id}">${content}</span>
            <button class="comment-delete pure-button-primary" data-comment_id="${id}">删除评论</button>
        </div>
    `
    return t
}

var commentAddFormTemplate = function(weibo) {
    var id = weibo.id
    log('weibo.id', weibo.id)
    var t = `
        <div class="comment-add-form" data-weibo_id="${id}">
            <input class="comment-add-input" data-weibo_id="${id}">
            <button class="comment-add-button pure-button-primary" data-weibo_id="${id}">添加评论</button>
        </div>
    `
    return t
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('#weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertCommentButton = function(weibo) {
    var commentButton = commentAddFormTemplate(weibo)
    var id = weibo.id
    log('weibo_id', id)
    var weiboCell = e(`.weibo-cell[data-id="${id}"]`)
    weiboCell.insertAdjacentHTML('beforeend', commentButton)
}

var insertComment = function(comment) {
    var commentCell = commentTemplate(comment)
    log('commentCell', commentCell)
    var id = comment.weibo_id
    log('weibo_id', id)
    var weiboCell = e(`.weibo-cell[data-id="${id}"]`)
    weiboCell.insertAdjacentHTML('beforeend', commentCell)
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    apiWeiboAll(function(r) {   // === ajax('GET', path, '', function(r){···})
        console.log('load all weibo', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
            var weibo_id = weibo.id
            apiCommentAll(weibo_id, function(r) {   // === ajax('GET', path, '', function(r){···})
                console.log('load all comment', r)
                // 解析为 数组
                var comments = JSON.parse(r)
                // 循环添加到页面中
                for(var i = 0; i < comments.length; i++) {
                    var comment = comments[i]
                    insertComment(comment)
                }
            })
            insertCommentButton(weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    b.addEventListener('click', function() {
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        log('form', form)
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            log('weibo', r)
            var weibo = JSON.parse(r)
            insertWeibo(weibo)
            insertCommentButton(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var weiboList = e('#weibo-list')
    log(weiboList)
    weiboList.addEventListener('click', function(event){
        log(event)
        // 通过 event.target 来得到被点击的对象
        var self = event.target
        // 通过比较被点击元素的 class
        // 来判断元素是否是想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('weibo-delete')) {
            log('点到了 删除按钮')
            var weiboId = self.dataset.id
            apiWeiboDelete(weiboId, function(r) {
                log('服务器响应删除成功', r)
                // 收到返回的数据, 删除 self 的父节点
                self.parentElement.remove()
            })
          }
      })

}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#weibo-list')
    log(weiboList)
    weiboList.addEventListener('click', function(event){
        log(event)
        // 通过 event.target 来得到被点击的对象
        var self = event.target

        if (self.classList.contains('weibo-update')) {
            var weiboCell = self.closest('.weibo-cell')
            var input = weiboCell.querySelector('.weibo-update-input')
            var id = weiboCell.dataset.id
            var form = {
                id: id,
                content: input.value,
            }
            log('update form', form)
            apiWeiboUpdate(form, function(r) {
                log('update', r)
                var updateForm = weiboCell.querySelector('.weibo-update-form')
                updateForm.remove()

                var weibo = JSON.parse(r)
                var content = weiboCell.querySelector('.weibo-content')
                content.innerHTML = weibo.content
            })
        }
    })
}

var bindEventWeiboEdit = function() {
    var weiboList = e('#weibo-list')
    log(weiboList)
    weiboList.addEventListener('click', function(event){
        log(event)
        // 通过 event.target 来得到被点击的对象
        var self = event.target
        // 通过比较被点击元素的 class
        // 来判断元素是否是想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('weibo-edit')) {
            var w = weiboUpdateFormTemplate()
            self.parentElement.insertAdjacentHTML('afterBegin', w)
        }
    })
}

var bindEventCommentAdd = function() {
    var weiboList = e('#weibo-list')
    weiboList.addEventListener('click', function(event){
        //  通过 event.target 来得到被点击的对象
        var self = event.target
        if (self.classList.contains('comment-add-button')){
            log('点到了 添加按钮')
            var commentForm = self.closest('.comment-add-form')
            log('commentForm', commentForm)
            var input = commentForm.querySelector('.comment-add-input')
            var id = commentForm.dataset.weibo_id
            log('id', id)
            var form = {
                weibo_id: parseInt(id),
                content: input.value
            }
            log('add form', form)
            apiCommentAdd(form, function(r) {
                log('add comment', r)
                var comment = JSON.parse(r)
                insertComment(comment)
            })
        }
    })
}

var bindEventCommentDelete = function() {
    var weiboList = e('#weibo-list')
    log(weiboList)
    weiboList.addEventListener('click', function(event){
        log(event)
        // 通过 event.target 来得到被点击的对象
        var self = event.target
        // 通过比较被点击元素的 class
        // 来判断元素是否是想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('comment-delete')) {
            log('点到了 删除评论按钮')
            var commentId = self.dataset.comment_id
            apiCommentDelete(commentId, function(r) {
                log('删除评论成功', r)
                // 收到返回的数据, 删除 self 的父节点
                self.parentElement.remove()
            })
        }
    })
}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
}


var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()