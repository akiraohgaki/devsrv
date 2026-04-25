# devsrv

[![JSR](https://jsr.io/badges/@akiraohgaki/devsrv)](https://jsr.io/@akiraohgaki/devsrv)

A lightweight development web server.

Designed for the rapid prototyping and testing of front-end applications.

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
| `--tls-cert <FILENAME>`        | TLS certificate file    | none       |
| `--tls-key <FILENAME>`         | TLS key file            | none       |
| `--directory-index <FILENAME>` | Directory index file    | index.html |
| `--live-reload <true/false>`   | Live reload the browser | true       |
| `--bundle <true/false>`        | TypeScript bundling     | true       |
| `--playground <true/false>`    | Playground page         | true       |

#### Example

Serves static files from the current working directory.

```sh
deno run -A jsr:@akiraohgaki/devsrv/serve
```

Serve static files from ./public directory with options specified.

```sh
deno run -A jsr:@akiraohgaki/devsrv/serve \
  -h localhost -p 3000 \
  --tls-cert=./cert.pem --tls-key=./key.pem \
  --directory-index=index.html --live-reload=true --bundle=true --playground=true \
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

Bundles scripts into a single JavaScript file.

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

Exports files into the ./public directory.

```sh
deno run -A jsr:@akiraohgaki/devsrv/export \
 --includes='./src/index.html, ./src/favicon.ico, ./src/assets' \
 ./public
```

## Web server features

### Live reload

Automatically reloads the browser when files in the document root are modified.

### Request handling

For `*.bundle.js` paths: Transpiles and bundles TypeScript files into JavaScript on-the-fly.

For `*.playground` paths: Serves the playground page.

For other paths: Attempts to serve the file from the document root.

If not found: Serves the default directory index file.

### On-the-fly TypeScript bundling

Provides seamless integration of TypeScript into front-end applications.

When a browser requests a file with a `.bundle.js` extension, the server dynamically transpiles the corresponding `.ts` file into JavaScript.

The generated JavaScript is served as an ES module, allowing it to be imported by other scripts.

This approach eliminates the need for manual pre-bundling and streamlines the development workflow.

### Code playground

Test your code snippets instantly in the browser.

When the request path ends with `.playground`, such as `http://localhost:3000/script.playground`, the playground page will be served to the browser.

## Documentation

https://jsr.io/@akiraohgaki/devsrv/doc

## License

Copyright: 2024, Akira Ohgaki

License: BSD-2-Clause
