# PATH  := node_modules/.bin:$(PATH)
# SHELL := /bin/bash
# SRC := src
# DIST := dist

# css_src := $(wildcard $(shell find $(SRC)/ -name '*.css'))
# css_dist := $(css_src:$(SRC)/%.css=$(DIST)/%.css)

# html_src := $(wildcard $(shell find $(SRC)/ -name '*.html'))
# html_dist := $(html_src:$(SRC)/%.html=$(DIST)/%.html)

# icons := dist/icons/**.*

# .PHONY: all clean

# all: $(css_dist) $(html_dist) static
# 	webpack

# $(DIST)/%.css : $(SRC)/%.css
# 	@mkdir -p $(@D)
# 	cleancss $< -o $@

# $(DIST)/%.html : $(SRC)/%.html
# 	@mkdir -p $(@D)
# 	html-minifier --collapse-whitespace --html5 $< -o $@

# static: $(icons) dist/manifest.json

# $(icons):
# 	cp -r $(SRC)/icons $(DIST)/icons

# $(DIST)/manifest.json: $(SRC)/manifest.json
# 	cp $< $@
	
# clean:
# 	rm -rf dist


PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
SRC := src
DIST := dist

# run jshint on ALL javascript files, but ony build the three entrypoints
# find -name will recursively list all files that end in *.js including those on the root
javascript_all := $(wildcard $(shell find $(SRC)/ -name '*.js'))
javascript_main := $(SRC)/background/background.js $(SRC)/content_scripts/main.js $(SRC)/popup/popup.js
javascript_dist := $(javascript_main:$(SRC)/%.js=$(DIST)/%.js)

css_src := $(wildcard $(shell find $(SRC)/ -name '*.less'))
css_dist := $(css_src:$(SRC)/%.less=$(DIST)/%.css)

html_src := $(wildcard $(shell find $(SRC)/ -name '*.html'))
html_dist := $(html_src:$(SRC)/%.html=$(DIST)/%.html)

icons := dist/icons/**.*

UGLIFYFLAGS = --source-map includeSources=true,url=$(shell basename $@).map,content=inline --output $@

.PHONY: all static clean

all: static $(javascript_dist) $(css_dist) $(html_dist) 

# jshint: $(javascript_all)
# 	jshint $?
# 	touch jshint

$(DIST)/%.js : $(SRC)/%.ts
	@mkdir -p $(@D)
	rollup -i $< -c rollup.config.js -o $@

$(DIST)/%.css : $(SRC)/%.less
	@mkdir -p $(@D)
	lessc $< | cleancss -o $@

$(DIST)/%.html : $(SRC)/%.html
	@mkdir -p $(@D)
	html-minifier --collapse-whitespace --html5 $< -o $@

static:
	@mkdir -p $(DIST)/static
	cp $(SRC)/manifest.json $(DIST)
	cp -r $(SRC)/static $(DIST)

clean:
	rm -rf dist
	rm -f jshint