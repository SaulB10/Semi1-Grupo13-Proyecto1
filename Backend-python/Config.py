from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import scoped_session, sessionmaker

DATABASE_URI = "mysql+mysqldb://admin:Usac2s2023@database-1.cp3za1qipyxl.us-east-2.rds.amazonaws.com:3306/semi1"
bucket_name = 'proyecto1-semi1-grupo13'

#engine = create_engine(DATABASE_URI, echo=True, pool_recycle=3600)
#db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

#meta = MetaData()
#meta.reflect(bind=engine)
