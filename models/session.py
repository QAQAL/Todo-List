from models import Model


class Session(Model):
    """
    Session 是用来保存 session 的 model
    """
    @classmethod
    def valid_names(cls):
        names = super().valid_names()
        names = names + [
            'session_id',
            'user_id',
        ]
        return names

    @classmethod
    def new(cls, form):
        m = super().new(form)
        m.save()
        return m