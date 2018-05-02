BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	$(COGS) -w scripts,styles

compress:
	JAVA_OPTS=-Xmx1024m $(COGS) -c

deploy: compress
	git commit -am "Release `date -u +%FT%TZ`"
	git push
