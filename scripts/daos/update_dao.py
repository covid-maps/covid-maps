from sqlalchemy.orm import Query
from sqlalchemy.orm.session import Session

from daos.dao import DAO
from models.core import Update
from sqlalchemy.sql.expression import false


class UpdateDAO(DAO):
    def __init__(self, engine):
        super(UpdateDAO, self).__init__(Update, engine)

    def get_all(self, deleted=False, reviewed=False):
        q = self.session.query(Update)

        if not deleted:
            q = q.filter(Update.deleted == false())

        if not reviewed:
            q = q.filter(Update.reviewed == false())

        return q.all()

