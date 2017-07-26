PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
content_scripts_src := src/content_scripts/main.js
content_scripts := dist/content_scripts/bundle.js
background_scripts := dist/background.js
icons := dist/icons/**.*
popup_dir := dist/popup

UGLIFYFLAGS = --source-map includeSources=true,url=$(shell basename $@).map --output $@

.PHONY: all clean

all: jshint $(background_scripts) $(content_scripts) popup static

jshint: src/**/*.js src/*.js
	jshint $?
	touch jshint

$(background_scripts): src/background.js
	mkdir -p $(dir $@)
	uglifyjs $< $(UGLIFYFLAGS)

$(content_scripts): $(content_scripts_src)
	mkdir -p $(dir $@)
	browserify $< | uglifyjs $(UGLIFYFLAGS)

popup: $(popup_dir) $(popup_dir)/popup.css $(popup_dir)/*.html $(popup_dir)/popup.js

$(popup_dir):
	mkdir -p $@

$(popup_dir)/popup.css: src/popup/popup.css
	cleancss $< -o $@

$(popup_dir)/*.html: src/popup/*.html
	html-minifier --collapse-whitespace --html5 --input-dir $(dir $<) --output-dir $(dir $@)

$(popup_dir)/popup.js: src/popup/popup.js
	uglifyjs $< $(UGLIFYFLAGS)

static: $(icons) dist/manifest.json

$(icons):
	cp -r src/icons dist/icons

dist/manifest.json: src/manifest.json
	cp $< $@
	
clean:
	rm -rf dist
	rm jshint