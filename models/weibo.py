from models import Model
from models.comment import Comment


class Weibo(Model):
    """
    微博类
    """
    @classmethod
    def valid_names(cls):
        names = super().valid_names()
        names = names + [
            'content',
            'user_id',
        ]
        return names

    @classmethod
    def new(cls, form, user_id):
        m = super().new(form)
        m.user_id = user_id
        m.save()
        return m

    def is_owner(self, id):
        return self.user_id == id

    def comments(self):
        return Comment.find_all(weibo_id=self.id)