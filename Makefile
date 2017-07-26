PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
content_scripts_src := src/content_scripts/main.js
content_scripts := dist/content_scripts/bundle.js
background_scripts := dist/background.js
icons := dist/icons/**.*

UGLIFYFLAGS = --source-map includeSources=true,url=$(shell basename $@).map --output $@

.PHONY: all clean

all: jshint $(background_scripts) $(content_scripts) static

jshint: src/**/*.js
	jshint $?
	touch jshint

$(background_scripts): src/background.js
	mkdir -p $(dir $@)
	uglifyjs $< $(UGLIFYFLAGS)

$(content_scripts): $(content_scripts_src)
	mkdir -p $(dir $@)
	browserify $< | uglifyjs $(UGLIFYFLAGS)

static: $(icons) dist/manifest.json

$(icons):
	cp -r src/icons dist/icons

dist/manifest.json: src/manifest.json
	cp $< $@
	
clean:
	rm -rf dist
	rm jshint