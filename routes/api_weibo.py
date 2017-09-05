from models.weibo import Weibo
from models.comment import Comment
from routes import (
    current_user,
    json_response,
)
from utils import log


def all(request):
    weibos = Weibo.all_json()
    return json_response(weibos)


def add(request):
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 用新增加的 json 函数来获取格式化后的 json 数据
    jsons = request.json()
    u = current_user(request)
    # 创建一个 weibo
    w = Weibo.new(jsons, u.id)
    # 把创建好的 weibo 返回给浏览器
    return json_response(w.json())


def delete(request):
    weibo_id = int(request.query.get('id'))
    w = Weibo.delete(weibo_id)
    return json_response(w.json())


def update(request):
    form = request.json()
    weibo_id = int(form.get('id'))
    w = Weibo.update(weibo_id, form)
    return json_response(w.json())


def comment_all(request):
    weibo_id = int(request.query.get('id'))
    w = Weibo.find(weibo_id)
    comments = w.comments()
    cs = [c.json() for c in comments]
    return json_response(cs)


def comment_add(request):
    jsons = request.json()
    u = current_user(request)
    c = Comment.new(jsons, u.id)
    return json_response(c.json())


def comment_delete(request):
    comment_id = int(request.query.get('id'))
    c = Comment.delete(comment_id)
    return json_response(c.json())


def route_dict():
    r = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
        '/api/weibo/allcomments': comment_all,
        '/api/weibo/comment/add': comment_add,
        '/api/weibo/comment/delete': comment_delete,
    }
    return r
