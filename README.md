stylecow plugin media-queries
=============================

[![Build Status](https://travis-ci.org/stylecow/stylecow-plugin-media-queries.svg)](https://travis-ci.org/stylecow/stylecow-plugin-media-queries)

Stylecow plugin to add support for some syntax of [Media Queries Level 4](https://drafts.csswg.org/mediaqueries4/)

You write:

```css
@media (width < 500px) {
	body {
		color: blue;
	}
}
@media (500px <= width <= 800px) {
	body {
		color: red;
	}
}
```

And stylecow converts to:

```css
@media (max-width: 499.999px) {
	body {
		color: blue;
	}
}
@media (min-width: 500px) and (max-width: 800px) {
	body {
		color: red;
	}
}
```

More demos in [the tests folder](https://github.com/stylecow/stylecow-plugin-media-queries/tree/master/tests/cases)
