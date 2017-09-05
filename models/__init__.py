import json

from utils import log


def save(data, path):
    """
    data 是 dict 或者 list
    path 是保存文件的路径
    """
    s = json.dumps(data, indent=2, ensure_ascii=False)
    with open(path, 'w+', encoding='utf-8') as f:
        log('save', path, s, data)
        f.write(s)


def load(path):
    with open(path, 'r', encoding='utf-8') as f:
        s = f.read()
        log('load', s)
        return json.loads(s)


class Model(object):

    @classmethod
    def valid_names(cls):
        names = [
            'id',
        ]
        return names

    @classmethod
    def db_path(cls):
        classname = cls.__name__
        path = 'data/{}.txt'.format(classname)
        return path

    @classmethod
    def _new_from_dict(cls, d):
        # 因为子元素的 __init__ 需要一个 form 参数
        # 所以这个给一个空字典
        m = cls()
        for k, v in d.items():
            setattr(m, k, v)
        return m


    @classmethod
    def all(cls):
        """
        all 方法使用 load 函数得到所有的 models
        """
        path = cls.db_path()
        models = load(path)
        # 用列表推导生成一个包含所有 实例 的 list
        # m 是 dict, 用 cls._new_from_dict(m) 可以初始化一个 cls 的实例
        ms = [cls._new_from_dict(m) for m in models]
        return ms

    @classmethod
    def new(cls, form):
        m = cls()

        for name in cls.valid_names():
            value = form.get(name)
            setattr(m, name, value)

        return m

    @classmethod
    def find_by(cls, **kwargs):
        log('kwargs, ', kwargs, type(kwargs))
        for m in cls.all():
            exist = True
            for key, value in kwargs.items():
                k, v = key, value
                if v != getattr(m, k):
                    exist = False
                    break
            if exist:
                return m
        return None

    @classmethod
    def find(cls, id):
        return cls.find_by(id=id)

    @classmethod
    def find_all(cls, **kwargs):
        log('kwargs, ', kwargs, type(kwargs))
        models = []
        for m in cls.all():
            exist = True
            # 第一个查询条件不符合要求 第二个符合要求
            for key, value in kwargs.items():
                k, v = key, value
                if v != getattr(m, k):
                    exist = False
                    break
            if exist:
                models.append(m)
        return models

    def __repr__(self):
        """
        __repr__ 是一个魔法方法
        简单来说, 它的作用是得到类的 字符串表达 形式
        比如 print(u) 实际上是 print(u.__repr__())
        """
        classname = self.__class__.__name__
        properties = ['{}: ({})'.format(k, v) for k, v in self.__dict__.items()]
        s = '\n'.join(properties)
        return '< {}\n{} \n>\n'.format(classname, s)

    def save(self):
        """
        用 all 方法读取文件中的所有 model 并生成一个 list
        把 self 添加进去并且保存进文件
        """
        log('debug save')
        # 相当于 models = self.__class__.all()
        models = self.all()
        log('models', models)

        first_index = 0
        if self.id is None:
            log('id is None')
            if len(models) > 0:
                self.id = models[-1].id + 1
            else:
                log('first index', first_index)
                self.id = first_index
            models.append(self)
        else:
            log('id is not None')
            # 有 id 说明已经是存在于数据文件中的数据
            # 那么就找到这条数据并替换
            for i, m in enumerate(models):
                if m.id == self.id:
                    models[i] = self

        # 保存
        l = [m.__dict__ for m in models]
        path = self.db_path()
        save(l, path)

    @classmethod
    def delete(cls, id):
        models = cls.all()
        index = -1
        for i, e in enumerate(models):
            if e.id == id:
                index = i
                break
        # 判断是否找到了这个 id 的数据
        if index != -1:
            o = models.pop(index)
            l = [m.__dict__ for m in models]
            path = cls.db_path()
            save(l, path)
            # 返回被删除的元素
            return o

    @classmethod
    def update(cls, id, form):
        t = cls.find(id)
        for key in form:
            # 这里只应该更新想要更新的东西
            # id 不应该被更改
            if key in cls.valid_names() and key != 'id':
                setattr(t, key, form.get(key))

        return t

    def json(self):
        """
        返回当前 model 的字典表示
        """
        d = self.__dict__
        return d

    @classmethod
    def all_json(cls):
        ms = cls.all()
        jsons = [m.json() for m in ms]
        return jsons