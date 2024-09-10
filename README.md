# devsrv

A lightweight development web server for rapid prototyping and testing of front-end applications.

## Usage

```sh
deno run --allow-env --allow-read --allow-write --allow-net \
  jsr:@akiraohgaki/devsrv/server -h localhost -p 3000 ./public
```

## Options

| Option                         | Description             | Default           |
| ------------------------------ | ----------------------- | ----------------- |
| `-h,--host <hostname>`         | Host name               | 0.0.0.0           |
| `-p,--port <port>`             | Port number             | 3000              |
| `--directory-index <filename>` | Directory index file    | index.html        |
| `--bundle <true/false>`        | TypeScript bundling     | true              |
| `<directory>`                  | Document root directory | Current directory |

## Request handling

For `.bundle.js` files: Transpile TypeScript files into JavaScript on-the-fly.

For other paths: Attempt to serve the file from the document root.

If not found: Serve the default index file.

## On-the-fly TypeScript bundling

Allows for seamless integration of TypeScript code into front-end applications.

When a browser requests a file with the `.bundle.js` extension, the server dynamically transpiles the corresponding TypeScript file with the same name into JavaScript.

This generated JavaScript is then served as a module, enabling it to be imported into other modules within the application.

This approach eliminates the need for pre-building JavaScript bundles and provides a more efficient development workflow.

## Documents

https://jsr.io/@akiraohgaki/devsrv/doc

## License

Copyright: 2024, Akira Ohgaki

License: BSD-2-Clause
