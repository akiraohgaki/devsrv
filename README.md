# devsrv

[![JSR](https://jsr.io/badges/@akiraohgaki/devsrv)](https://jsr.io/@akiraohgaki/devsrv)

A lightweight development web server.

Designed for rapid prototyping and testing of front-end applications.

## Usage

### Web server

```sh
deno run jsr:@akiraohgaki/devsrv/serve [OPTIONS] [DOCUMENT_ROOT]
```

| Arguments         | Description             | Default                   |
| ----------------- | ----------------------- | ------------------------- |
| `[DOCUMENT_ROOT]` | Document root directory | Current working directory |

| Options                        | Description             | Default    |
| ------------------------------ | ----------------------- | ---------- |
| `-h, --host <HOSTNAME>`        | Host name               | 0.0.0.0    |
| `-p, --port <PORT>`            | Port number             | 3000       |
| `--directory-index <FILENAME>` | Directory index file    | index.html |
| `--live-reload <true/false>`   | Live reload the browser | true       |
| `--bundle <true/false>`        | TypeScript bundling     | true       |
| `--playground <true/false>`    | Playground page         | true       |

#### Example

Serve static files from the current working directory.

```sh
deno run -A jsr:@akiraohgaki/devsrv/serve
```

Serve static files from ./public directory with options specified.

```sh
deno run -A jsr:@akiraohgaki/devsrv/serve \
  -h localhost -p 3000 --directory-index=index.html --live-reload=true --bundle=true --playground=true \
  ./public
```

### Build helper program: bundle

```sh
deno run jsr:@akiraohgaki/devsrv/bundle [OPTIONS] [ENTRY_POINT] [OUT_FILE]
```

| Arguments       | Description           | Default |
| --------------- | --------------------- | ------- |
| `[ENTRY_POINT]` | Entry point to bundle | none    |
| `[OUT_FILE]`    | Output file           | none    |

| Options                        | Description                                                        | Default |
| ------------------------------ | ------------------------------------------------------------------ | ------- |
| `--minify <true/false>`        | Minification                                                       | false   |
| `--externals <PACKAGES/PATHS>` | A comma-separated list of packages and paths that allowed wildcard | none    |

#### Example

Bundle scripts into single JavaScript file.

```sh
deno run -A jsr:@akiraohgaki/devsrv/bundle \
  --minify=true \
  --externals='package, jsr:*, npm:*, https:*, ./node_modules/*' \
  ./src/main.ts ./public/main.bundle.js
```

### Build helper program: export

```sh
deno run jsr:@akiraohgaki/devsrv/export [OPTIONS] [OUT_DIRECTORY]
```

| Arguments         | Description      | Default |
| ----------------- | ---------------- | ------- |
| `[OUT_DIRECTORY]` | Output directory | none    |

| Options                          | Description                                                | Default |
| -------------------------------- | ---------------------------------------------------------- | ------- |
| `--includes <FILES/DIRECTORIES>` | A comma-separated list of files and directories to include | none    |

#### Example

Export files into ./public directory.

```sh
deno run -A jsr:@akiraohgaki/devsrv/export \
 --includes='./src/index.html, ./src/favicon.ico, ./src/assets' \
 ./public
```

## Features

### Web server

#### Live reload

Live reload the browser when files in the document root directory are changed.

#### Request handling

For `*.bundle.js` path: Transpile and bundle TypeScript files into JavaScript on-the-fly.

For `*.playground` path: Serve the playground page.

For other paths: Attempt to serve the file from the document root.

If not found: Serve the default index file.

#### On-the-fly TypeScript bundling

Allows for seamless integration of TypeScript code into front-end applications.

When a browser requests a file with the `.bundle.js` extension, the server dynamically transpiles the corresponding TypeScript file with the same name into JavaScript.

This generated JavaScript is then served as a module, enabling it to be imported into other modules within the application.

This approach eliminates the need for pre-building JavaScript bundles and provides a more efficient development workflow.

#### Code playground

You can test your code instantly.

When the request path ends with `.playground`, such as `http://localhost:3000/script.playground`, the playground page will be served to the browser.

## Documentation

https://jsr.io/@akiraohgaki/devsrv/doc

## License

Copyright: 2024, Akira Ohgaki

License: BSD-2-Clause
