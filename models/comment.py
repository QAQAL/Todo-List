from models import Model
from models.user import User


class Comment(Model):
    """
    评论类
    """
    @classmethod
    def valid_names(cls):
        names = super().valid_names()
        names = names + [
            'content',
            'user_id',
            'weibo_id',
        ]
        return names

    @classmethod
    def new(cls, form, user_id):
        m = super().new(form)
        m.user_id = user_id
        m.save()
        return m

    def user(self):
        u = User.find_by(id=self.user_id)
        return u