BIN=node_modules/.bin/
COGS=$(BIN)cogs

dev:
	$(COGS) -w client,styles

deploy:
	$(COGS) -c
	git commit -am "Release `date`"
	git push
