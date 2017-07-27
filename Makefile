PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
SRC := src
DIST := dist

# run jshint on ALL javascript files, but ony build the three entrypoints
# find -name will recursively list all files that end in *.js including those on the root
javascript_all := $(wildcard $(shell find $(SRC)/ -name '*.js'))
javascript_main := $(SRC)/background.js $(SRC)/content_scripts/main.js $(SRC)/popup/popup.js
javascript_dist := $(javascript_main:$(SRC)/%.js=$(DIST)/%.js)

css_src := $(wildcard $(shell find $(SRC)/ -name '*.css'))
css_dist := $(css_src:$(SRC)/%.css=$(DIST)/%.css)

html_src := $(wildcard $(shell find $(SRC)/ -name '*.html'))
html_dist := $(html_src:$(SRC)/%.html=$(DIST)/%.html)

icons := dist/icons/**.*

UGLIFYFLAGS = --source-map includeSources=true,url=$(shell basename $@).map --output $@

.PHONY: all clean

all: jshint $(javascript_dist) $(css_dist) $(html_dist) static

jshint: $(javascript_all)
	jshint $?
	touch jshint

$(DIST)/%.js : $(SRC)/%.js
	@mkdir -p $(@D)
	browserify $< | uglifyjs $(UGLIFYFLAGS)

$(DIST)/%.css : $(SRC)/%.css
	@mkdir -p $(@D)
	cleancss $< -o $@

$(DIST)/%.html : $(SRC)/%.html
	@mkdir -p $(@D)
	html-minifier --collapse-whitespace --html5 $< -o $@

static: $(icons) dist/manifest.json

$(icons):
	cp -r $(SRC)/icons $(DIST)/icons

$(DIST)/manifest.json: $(SRC)/manifest.json
	cp $< $@
	
clean:
	rm -rf dist
	rm -f jshint