BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	$(COGS) -w client,styles

compress:
	$(COGS) -c

deploy: compress
	git commit -am "Release `date -u +%FT%TZ`"
	git push
