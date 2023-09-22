FROM postgres:latest

RUN apt-get clean && apt-get update && \
	apt-get install -y postgresql-contrib

ADD *.sql / docker-entrypoint-initdb.d/
# RUN mkdir -p /var/lib/postgresql/data
# RUN chown -R postgres:postgres /var/lib/postgresql/data
