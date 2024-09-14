# devsrv

[![JSR](https://jsr.io/badges/@akiraohgaki/devsrv)](https://jsr.io/@akiraohgaki/devsrv)

A lightweight development web server.

For rapid prototyping and testing of front-end applications.

## Usage

### Server

```sh
deno run jsr:@akiraohgaki/devsrv/serve [OPTIONS] [DOCUMENT_ROOT]
```

| Arguments         | Description             | Default           |
| ----------------- | ----------------------- | ----------------- |
| `[DOCUMENT_ROOT]` | Document root directory | Current directory |

| Options                        | Description          | Default    |
| ------------------------------ | -------------------- | ---------- |
| `-h, --host <HOSTNAME>`        | Host name            | 0.0.0.0    |
| `-p, --port <PORT>`            | Port number          | 3000       |
| `--directory-index <FILENAME>` | Directory index file | index.html |
| `--bundle <true/false>`        | TypeScript bundling  | true       |

### Helper program: bundle

```sh
deno run jsr:@akiraohgaki/devsrv/bundle [OPTIONS] [ENTRY_POINT] [OUTFILE]
```

| Arguments       | Description               | Default |
| --------------- | ------------------------- | ------- |
| `[ENTRY_POINT]` | Entry point of the module | none    |
| `[OUTFILE]`     | Output file               | none    |

| Options                 | Description  | Default |
| ----------------------- | ------------ | ------- |
| `--minify <true/false>` | Minification | false   |

### Helper program: remkdir

```sh
deno run jsr:@akiraohgaki/devsrv/remkdir [OPTIONS] [TARGET_DIRECTORY]
```

| Arguments            | Description      | Default |
| -------------------- | ---------------- | ------- |
| `[TARGET_DIRECTORY]` | Target directory | none    |

| Options                          | Description                                                                      | Default |
| -------------------------------- | -------------------------------------------------------------------------------- | ------- |
| `--includes <FILES/DIRECTORIES>` | A comma-separated list of files or directories to copy into the target directory | none    |

### Examples

Serve current directory.

```sh
deno run -A jsr:@akiraohgaki/devsrv/serve
```

Serve specific directory with options.

```sh
deno run -A jsr:@akiraohgaki/devsrv/serve \
  -h localhost -p 3000 --directory-index=index.html --bundle=true \
  ./public
```

Bundle scripts into single JavaScript file.

```sh
deno run -A jsr:@akiraohgaki/devsrv/bundle \
  --minify=true \
  ./src/main.ts ./public/main.bundle.js
```

Re-make destination directory and copy files.

```sh
deno run -A jsr:@akiraohgaki/devsrv/remkdir \
 --includes='./src/index.html, ./src/favicon.ico, ./src/assets' \
 ./public
```

## Features

### Request handling

For `.bundle.js` files: Transpile TypeScript files into JavaScript on-the-fly.

For other paths: Attempt to serve the file from the document root.

If not found: Serve the default index file.

### On-the-fly TypeScript bundling

Allows for seamless integration of TypeScript code into front-end applications.

When a browser requests a file with the `.bundle.js` extension, the server dynamically transpiles the corresponding TypeScript file with the same name into JavaScript.

This generated JavaScript is then served as a module, enabling it to be imported into other modules within the application.

This approach eliminates the need for pre-building JavaScript bundles and provides a more efficient development workflow.

## Documentation

https://jsr.io/@akiraohgaki/devsrv/doc

## License

Copyright: 2024, Akira Ohgaki

License: BSD-2-Clause
