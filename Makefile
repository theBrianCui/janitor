PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
content_scripts_src := src/content_scripts/*.js
content_scripts := dist/content_scripts/janitor.js
background_scripts := dist/background.js
icons := dist/icons/**.*

.PHONY: all clean

all: $(content_scripts) $(background_scripts) static

$(content_scripts): $(content_scripts_src)
	mkdir -p $(dir $@)
	uglifyjs $(content_scripts_src) > $@

$(background_scripts): src/background.js
	uglifyjs src/background.js > $@

static: $(icons) dist/manifest.json

$(icons):
	cp -r src/icons dist/icons

dist/manifest.json: src/manifest.json
	cp $< $@
	
clean:
	rm -rf dist