from models import Model
from models.todo import Todo

import hashlib


class User(Model):
    """
    User 是一个保存用户数据的 model
    """
    @classmethod
    def valid_names(cls):
        names = super().valid_names()
        names = names + [
            'username',
            'password',
        ]
        return names

    @staticmethod
    def salted_password(password, salt='$!@><?>HUI&DWQa`'):
        salted = password + salt
        hash = hashlib.sha256(salted.encode('ascii')).hexdigest()
        return hash

    def validate_login(self):
        u = User.find_by(username=self.username)
        if u is not None:
            return u.password == self.salted_password(self.password)
        else:
            return False

    def validate_register(self):
        u = User.find_by(username=self.username)
        valid = u is None and len(self.username) > 2 and len(self.password) > 2
        if valid:
            p = self.password
            self.password = self.salted_password(p)
            return True
        else:
            return False
