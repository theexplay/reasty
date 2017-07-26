# Reasty.js
### *Command-line tool for creating components directory structure.*

```
npm i -g reasty
```

Add `.reastyrc` to the root of your project, with options.
```
{
    "basedir": "src/components",
    "newline": "\n",
    "indent": "  ",
    "file_write_options": "utf8",
    "files": {
        ".": {
            "filename": "{{NAME}}",
            "styleImport": "_",
            "content": "{{NEWLINE}}.{{NAME}} {{NEWLINE}}{{INDENT}}// your code here{{NEWLINE}}",
            "extension": "styl"
        },
        "_": {
            "filename": "__",
            "content": "// your vars and mixins here{{NEWLINE}}",
            "extension": "styl"
        },
        "z": {
            "filename": "{{NAME}}",
            "extension": "js",
            "content": "// your code here{{NEWLINE}}"
        }
    }
}

```
Use from command line to generate files.
```
reasty common/header
// src/components/common/header/header.styl
// src/components/common/header/header.js
// src/components/common/header/__.styl
```

```
reasty navigation
// src/components/navigation/navigation.styl
// src/components/navigation/navigation.js
// src/components/navigation/__.styl
```
