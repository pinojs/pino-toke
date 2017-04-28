# pino-http-format &nbsp; &nbsp; [![Build Status](https://travis-ci.org/pinojs/pino-http-format.svg?branch=master)](https://travis-ci.org/pinojs/pino-http-format)

Transform Pino HTTP log messages with a format string

This CLI tool and module is a transform [transport](https://github.com/pinojs/pino/blob/master/docs/transports.md) for the [pino](http://npm.im/logger), specifically for processing HTTP
log messages (see the [Supports](#supports) section). Output is configured using the tokenized
format string as used in the [`morgan`](http://npm.im/morgan) logger.


## Supports

* [express-pino-logger](http://npm.im/express-pino-logger)
* [restify-pino-logger](http://npm.im/restify-pino-logger)
* [koa-pino-logger](http://npm.im/koa-pino-logger)
* [pino-http](http://npm.im/pino-http)
* [hapi-pino](http://npm.im/hapi-pino)

## Usage

```sh
$ npm install -g pino-http-format
```

```sh
$ pino-http-format -h
```

```sh
  
    pino-http-format [-d] [-a] [-k] [tokens]

    -d | --dest |       stderr | stdout (default) or Number. Specify output fd
    --destination
    
    -a | --ancillary    stderr | stdout or Number. Specify JSON logs fd
    
    -k | --keep         true | false (default) Retain transformed logs in ancillary output

    tokens              :id :pid :level :hostname :url :date[format] :time[format] 
                        :method :response-time :status :referrer :remote-addr 
                        :remote-user :http-version :user-agent :req[header] :res[header]
```


### Example

Spin up a server that uses a pino http logger (see the [Supports](#supports) section),
pipe it to `pino-http-format` and desribe the format in tokenized form

```sh
$ node server | pino-http-format :method :url :status :res[content-length] - :response-time ms
```

## Destination (`-d`)

By default, logs are output to STDOUT, however we can set the `-d` (alias, `--dest`, `--destination`), flag to a a `stderr`, or a number (`1` for stdout, `2` for stderr, `3` or more for custom file descriptor):

```sh
$ node server | pino-http-format -d stderr :status :get :url - :response-time ms
```

The above is equivalent to:

```sh
$ node server | pino-http-format -d 2 :status :get :url - :response-time ms
```

We can also direct formatted log output to custom file descriptors, but we *must*
use bash redirection (in some form) from that file descriptor, otherwise the process
will most likely immediately crash (this is to do with how unix works).

```sh
$ node server | pino-http-format -d 8 :status :get :url - :response-time ms 8> ./http-logs
```

## Ancillary Output (`-a`)

By default, any logs which aren't an HTTP log (meaning, they don't have `req` and `res`
properties and the `msg` isn't "request complete") are filtered out.

However, we can specify an ancillary (secondary) output for other log messages, using
the `-a` (alias `--ancillary`) flag.

The following will write reformatted HTTP logs to STDOUT and original JSON logs
which *are not* HTTP logs to STDERR.

```sh
$ node server | pino-http-format -a 2 :status :get :url - :response-time ms
```

The following achieves the reverse effect:

```sh
$ node server | pino-http-format -d 2 -a 1 :status :get :url - :response-time ms
```

The next example creates an custom file descriptor, and redirects output from that
descriptor to a `./logs` file, whilst outputting formatted HTTP logs to STDOUT

```sh
$ node server | pino-http-format  -a 4 :status :get :url - :response-time ms 4> ./logs
```

This will sends formatted HTTP logs to the `./http-logs` file and pipe all other log messages to [`pino-elasticsearch`](http://npm.im/pino-elasticsearch)

```sh
$ node server | pino-http-format -a 1 -d 4 :status :get :url - :response-time ms 4> ./http-logs | pino-elasticsearch
```

## Keep Original HTTP JSON Logs (`k`)

The `-a` (`--ancillary`) flag can be coupled with the `-k` (`--keep`) flag so that
raw HTTP JSON logs are also piped to the ancillary output stream, along with any
filtered output.

The following will pipe all formatted logs to the `4` file descriptor which is redirected to a file,
while *all* original JSON logs (instead of non-HTTP logs) are written to STDOUT.

```
$ node server | pino-http-format -k -a 1 -d 4 :status :get :url - :response-time ms 4> ./http-logs 
```


### Tokens

`pino-http-format` supports all the same tokens found in the [`morgan`](http://npm.im/morgan) 
logger, with additional tokens based on the information we have in the pino HTTP log format.

Tokens supported in addition to `morgan`'s token set are `:id`, `:pid`, `:level`,
`:hostname`, and `:time`.

#### :id

Logs from `pino-http` add a unique identifer to each request, this gives the unique id

#### :pid

Process Id (as in all pino logs)

#### :level

Log level (as in all pino logs)

#### :hostname

Server hostname (as in all pino logs)

#### :url

URL of the request (as per `req.url`, so does not include domain name)

#### :date[format]

Date and time based on the `time` key in the pino log.

`[format]` can be:

* web - RFC 1123 format (default) - `Fri, 28 Apr 2017 14:12:42 GMT`
* iso - ISO 8601 format - `2017-04-28T14:12:42.454Z`
* clf - date format used in Common Log Format `28/Apr/2017:14:12:42 -0060`

When format is omitted, or not recognized, defaults to `web`

#### :time[format]

The time based on the `time` key in the pino log

`[format]` can be:

* ms - milliseconds (default)
* iso - the time format after `T` and before the decimal (`.`) in ISO 8601 string `14:12:42`

When format is omitted, or not recognized, defaults to `ms`

#### :method

Request method

#### :response-time

Response time as recorded by `pino-http` in the `res` object.

#### :status

HTTP Status

#### :referrer

Referrer header (normalizes alternative "referer" heading)

#### :remote-addr

Remote address (IP)

#### :remote-user

If Basic auth is being used, this will contain the user name provided via basic auth

#### :http-version

HTTP version (e.g. `1.0`, `1.1`)

#### :user-agent

Contents of the `User-Agent` header

#### :req[header]

Given header in the request

#### :res[header]

Given header in the response


### Programmatic Usage

#### format(fmt, destination, ancillary)

Returns a stream that we write Pino JSON logs to.

The `fmt` parameter is required and can be a format string, a function or 
an object. 

A format string represents how a log line should be written out, using a "tokens",
which are essentially placholder elements in the `:token`. The string
can also contain normal text, which will appear between the tokens.
Unrecognized tokens will appear in the output as normal text.

```js
format(':method :url :status')
```

If `fmt` is a function it should have the signature `(o, tokens)`. 
The `tokens` parameter is an object of mapping functions, which pick 
properties from the `o` object (see `./tokens.js` file. 
The `o` parameter will be an object representation each HTTP JSON log line.
It's return value will be the contents of the transformed log line.


```
format((o, tokens) => 'some log line')
```

If `fmt` is an object, should have a property called `fmt` that contains the
`fmt` string or a function.

 ```js
format({fmt: ':method :url :status'})
```

 ```js
format({fmt: (o, tokens) => 'some log line'})
```


When `fmt` is an object, additional options can be provided. 
There's only one valid option, `keep`:

 ```js
format({fmt: ':method :url :status', keep: true})
```

When `keep` is `true` all JSON log messages will be written verbatim 
to the `ancillary` write stream. It `keep` is `false`, only messages
which we not processed as HTTP related messages will be written to 
the `ancillary` write stream. This only applies if an `ancillary` stream
is provided.


The optional `destination` parameter is a writeable stream that receives
the reformatted log messages. It defaults to `process.stdout`.

The optional `ancillary` parameter is a writable stream that 


#### format.compile(fmt)

Compile a format string (`fmt`) in a function. The returned function 
takes a `tokens` and `o` parameters. The `tokens` parameter is an object
of mapping functions, which pick properties from the `o` object. The
`o` parameter is an object representation of a pino JSON log line.

This can be useful for pre- and post-processing when providing a a function to `format`.

## LICENSE

MIT

## Acknowledgements

* Inspired by the [`morgan`](http://npm.im/morgan) logger
* Sponsored by [nearForm](http://nearform.com)

