BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	$(COGS) -w 'scripts/**/*' -w 'styles/**/*'

compress:
	MINIFY=1 $(COGS)

deploy: compress
	git commit -am "Release `date -u +%FT%TZ`"
	git push
