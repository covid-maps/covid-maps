from sqlalchemy import inspect, and_, func
from sqlalchemy.orm import sessionmaker, scoped_session

import logging

logger = logging.getLogger(__name__)


class DAO:
    """
    This is the base data access object class
    """

    def __init__(self, table, engine=None):
        self.engine = engine
        self.session = scoped_session(sessionmaker(bind=self.engine))()
        self.table = table

    def get(self, id):
        return self.session.query(self.table).get(id)

    def update(self, entity):
        self.session.merge(entity)
        return entity

    def bulk_update(self, entities):
        for entity in entities:
            self.session.merge(entity)