from models.weibo import Weibo
from routes import (
    http_response,
    current_user,
    login_required,
)
from utils import template, log


# 微博相关页面
def index(request):
    u = current_user(request)
    weibos = Weibo.find_all(user_id=u.id)
    body = template('weibo_index.html', weibos=weibos, user=u)
    return http_response(body)


def route_dict():
    r = {
        '/weibo/index': login_required(index),
    }
    return r
