// TODO API
// 获取所有 todo
var apiTodoAll = function(callback) {
    var path = '/api/todo/all'
    ajax('GET', path, '', callback)
}

// 增加一个 todo
var apiTodoAdd = function(form, callback) {
    var path = '/api/todo/add'
    ajax('POST', path, form, callback)
}

// 删除一个 todo
var apiTodoDelete = function(id, callback) {
    var path = '/api/todo/delete?id=' + id
    ajax('GET', path, '', callback)
}

// 更新一个 todo
var apiTodoUpdate = function(form, callback) {
    var path = '/api/todo/update'
    ajax('POST', path, form, callback)
}


// TODO DOM   // 返回todo-cell
var todoTemplate = function(todo) {
    var task = todo.task
    var id = todo.id
    var updated_time = timeString(todo.updated_time)
    // data-* 是 HTML5 新增的自定义标签属性的方法
    // data-id="1" 获取属性的方式是 .dataset.id
    var t = `
        <div class="todo-cell" data-id="${id}">
            <button class="todo-edit" data-id="${id}">编辑</button>
            <button class="todo-delete" data-id="${id}">删除</button>
            <span class="todo-task">${task}</span>
            <span>${updated_time}</span>
        </div>
    `
    return t
}

var todoUpdateFormTemplate = function(todo) {
    var t = `
        <div class="todo-update-form">
            <input class="todo-update-input">
            <button class="todo-update">更新</button>
        </div>
    `
    return t
}

var insertTodo = function(todo) {
    var todoCell = todoTemplate(todo)
    // 插入 todo-list
    var todoList = e('#todo-list')
    todoList.insertAdjacentHTML('beforeend', todoCell)
}

var loadTodos = function() {
    // 调用 ajax api 来载入数据
    apiTodoAll(function(r) {   // === ajax('GET', path, '', function(r){···})
        console.log('load all', r)
        // 解析为 数组
        var todos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            insertTodo(todo)
        }
    })
}

var bindEventTodoAdd = function() {
    var b = e('#id-button-add')
    b.addEventListener('click', function() {
        var input = e('#id-input-todo')
        var task = input.value
        log('click add', task)
        var form = {
            task: task,
        }
        log('form', form)
        apiTodoAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var todo = JSON.parse(r)
            insertTodo(todo)
        })
    })
}

var bindEventTodoDelete = function() {
    var todoList = e('#todo-list')
    log(todoList)
    todoList.addEventListener('click', function(event){
        log(event)
        // 通过 event.target 来得到被点击的对象
        var self = event.target
        // 通过比较被点击元素的 class
        // 来判断元素是否是想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('todo-delete')) {
            log('点到了 删除按钮')
            var todoId = self.dataset.id
            apiTodoDelete(todoId, function(r) {
                log('服务器响应删除成功', r)
                // 收到返回的数据, 删除 self 的父节点
                self.parentElement.remove()
            })
        }
    })
}

var bindEventTodoEdit = function() {
    var todoList = e('#todo-list')
    log(todoList)
    todoList.addEventListener('click', function(event){
        log(event)
        // 通过 event.target 来得到被点击的对象
        var self = event.target
        // 通过比较被点击元素的 class
        // 来判断元素是否是想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('todo-edit')) {
            var t = todoUpdateFormTemplate()
            self.parentElement.insertAdjacentHTML('beforeend', t)
        }
    })
}

var bindEventTodoUpdate = function() {
    var todoList = e('#todo-list')
    log(todoList)
    todoList.addEventListener('click', function(event){
        log(event)
        // 通过 event.target 来得到被点击的对象
        var self = event.target

        if (self.classList.contains('todo-update')) {
            var todoCell = self.closest('.todo-cell')
            var input = todoCell.querySelector('.todo-update-input')
            var id = todoCell.dataset.id
            var form = {
                id: id,
                task: input.value,
            }
            log('update form', form)
            apiTodoUpdate(form, function(r) {
                log('update', r)
                var updateForm = todoCell.querySelector('.todo-update-form')
                updateForm.remove()

                var todo = JSON.parse(r)
                var task = todoCell.querySelector('.todo-task')
                task.innerHTML = todo.task
            })
        }
    })
}


var bindEvents = function() {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoEdit()
    bindEventTodoUpdate()
}

var __main = function() {
    bindEvents()
    loadTodos()
}

__main()