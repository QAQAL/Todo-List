from models.session import Session
from routes import (
    random_str,
    redirect,
    http_response
)
from utils import log
from utils import template
from models.user import User


def route_login(request):
    """
    登录页面的路由函数
    """
    log('login, cookies', request.cookies)
    if request.method == 'POST':
        form = request.form()
        u = User.new(form)
        if u.validate_login():
            session_id = random_str()
            u = User.find_by(username=u.username)
            s = Session.new(dict(
                session_id=session_id,
                user_id=u.id,
            ))
            log('session', s)
            headers = {
                'Set-Cookie': 'sid={}'.format(session_id)
            }
            # 登录后定向到 /
            return redirect('/', headers)
    # 显示登录页面
    body = template('login.html')
    return http_response(body)


def route_register(request):
    """
    注册页面的路由函数
    """
    if request.method == 'POST':
        form = request.form()
        u = User.new(form)
        if u.validate_register():
            # 注册成功再保存
            u.save()
            # 注册成功后 定向到登录页面
            return redirect('/login')
        else:
            # 注册失败 定向到注册页面
            return redirect('/register')
    # 显示注册页面
    body = template('register.html')
    return http_response(body)


def route_dict():
    r = {
        '/login': route_login,
        '/register': route_register,
    }
    return r
