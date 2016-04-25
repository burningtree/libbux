NODE = node
SED = sed
VERSION = $(shell cat package.json | jq -r .version)

all: version test

test: .
	mocha --compilers coffee:coffee-script/register

version:
	@echo Replacing version in README.md ..
	@perl -p -i -e 's/<span bux-data="version">([\d\.]+)<\/span>/<span bux-data="version">$(VERSION)<\/span>/g' README.md
	@echo Replacing version in lib/bux.js ..
	@perl -p -i -e "s/BUXVersion = '([\d\.]+)'/BUXVersion = '$(VERSION)'/g" lib/bux.js
	@echo Version $(VERSION) done.

make-docs:
	@echo "TODO"

help:
	@echo ""
	@echo " Available commands:"
	@echo "   all docs"

.PHONY: all
