FROM mysql:8

ADD config/my.cnf /etc/my.cnf
RUN chmod 644 /etc/my.cnf

COPY docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d/