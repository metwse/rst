# RST / ShotCut
Rich Subtitle (rst) library for ShotCut


You can define styles with a CSS-like syntax
```css
* { 
    color: color;
    background: background;
    padding: padding;
    line-gap: line-gap;
    geometry: left top width height;
    font: font-style font-size font-family font-weight; 
    outline: outline-width outline-color;
    align: horizontal-align vertical-align;
}

metw { color: white; outline-color: red }
```

Subtitle example:
```html
# 0s - 1s
<metw>multi line
subtitle</metw> coming soon 

# 1s - 5000ms
text with defaults
@metw single line subtitle

# 00:00:05,00 - 0.2m
text
```

Merge two files with --- in between
```css
[styles]
---
[subtiles]
```
