PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash
SRC := src
DIST := dist

javascript_src := $(wildcard $(shell find $(SRC)/ -name '*.js'))
javascript_dist := $(javascript_src:$(SRC)/%.js=$(DIST)/%.js)

css_src := $(wildcard $(shell find $(SRC)/ -name '*.css'))
css_dist := $(css_src:$(SRC)/%.css=$(DIST)/%.css)

html_src := $(wildcard $(shell find $(SRC)/ -name '*.html'))
html_dist := $(html_src:$(SRC)/%.html=$(DIST)/%.html)

icons := dist/icons/**.*

UGLIFYFLAGS = --source-map includeSources=true,url=$(shell basename $@).map --output $@

.PHONY: all clean

all: $(javascript_dist) $(css_dist) $(html_dist) static

$(DIST)/%.js : $(SRC)/%.js
	@mkdir -p $(@D)
	jshint $<
	browserify $< | uglifyjs $(UGLIFYFLAGS)

$(DIST)/%.css : $(SRC)/%.css
	@mkdir -p $(@D)
	cleancss $< -o $@

$(DIST)/%.html : $(SRC)/%.html
	@mkdir -p $(@D)
	html-minifier --collapse-whitespace --html5 $< -o $@

static: $(icons) dist/manifest.json

$(icons):
	cp -r src/icons dist/icons

$(DIST)/manifest.json: $(SRC)/manifest.json
	cp $< $@
	
clean:
	rm -rf dist