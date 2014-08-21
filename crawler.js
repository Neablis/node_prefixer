(function (name, definition) {
    if (typeof module !== 'undefined') {
        module.exports = definition();
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
}('Crawler', function () {
    /** Properties of the module. */
    var home_router,
        graph = {};
    /** @constructor */
    var Crawler = function (config) {
        if (config) {
            this.home_router = config.home_router || undefined;
            this.parser = config.parser || undefined;
        }
        this.graph = {};
        this.queue = [];
        this.cheat_answer =  {17538: [22767, 3150512, 1240, 67181], 6920072: ['DEADEND'], 1102654978: [926557785], 10731919: [14313], 8228497: [6920072, 5306908], 11971: [19633, 53853, 2627], 10701033: ['DEADEND'], 5306908: ['DEADEND'], 13213: [4575671], 9235489: [3777314], 3777314: [63560], 74403: [108128, 21243], 1180454: [11971, 17538, 165409], 94407: ['DEADEND'], 5798958: ['DEADEND'], 3150512: ['DEADEND'], 19633: ['DEADEND'], 47668: [512494], 4575671: [9137628, 5798958, 47668, 3995259], 110776: ['DEADEND'], 8257: [1142883878], 2627: [10868678, 67181], 10868678: ['DEADEND'], 165409: [94407, 4575671], 63560: [110776], 1240: [10701033, 62298], 926557785: [21243], 62298: ['GOAL'], 9137628: ['DEADEND'], 53853: [11971], 108128: [1102654978], 16993: [74403, 6370925], 3995259: ['DEADEND'], 1142883878: [10042999], 14313: [16993], 67181: [8228497], 512494: [13213], 22767: [8257], 10042999: [62298, 10731919], 21243: [1102654978], 6370925: [9235489]};
    };

    /**
     * Parses a server response
     * @name Web_Business#_parse_response
     * @private
     * @function
     * @param {string} response - data for the post_body
     * @param {function} callback - callback callback
     * @returns {Object} xhr - xDomainObject
     * @example
     * Web_Business._post_message({q: 'sample'}, {url: '4/cs/search', session_key: '12123141', home_router: 'https://...'}, function () {}, function () {});
     */
    Crawler.prototype._parse_response = function (error, response, callback) {
        var data_obj;
        var header;

        
        if (error || response.statusCode >= 300) {
            return callback(response.statusCode, response.body);
        }
        return callback(null, response.body);
    };

    /**
     * Send a post request to the server
     * @name Web_Business#_post_message
     * @private
     * @function
     * @param {object} data - data for the post_body
     * @param {object} options - options for the ajax call and the url to call.
     * @param {function} callback - callback callback
     * @returns {Object} xhr - xDomainObject
     * @example
     * Web_Business._post_message({q: 'sample'}, {url: '4/cs/search', session_key: '12123141', home_router: 'https://...'}, function () {}, function () {});
     */
    Crawler.prototype._post_message = function (data, options, callback) {
        callback = callback || function () {};
        options = options || {};
        options.home_router = options.home_router || this.home_router

        var url,
            post_data = {}, 
            post_body, 
            xhReq, 
            that = this;

        url = options.url;

        // add the parameters specific to that message
        for (var key in data) {
            var obj = data[key];
            post_data[key] = obj;
        }

        // create the URL
        if (options.home_router) {
            url = this._create_url({uri: url, query_params: options.query}, {
                home_router: options.home_router
            });
        } else {
            return callback('Home router required');
        }

        post_body = JSON.stringify(post_data) + "\r\n";

        if (this._is_server()) {
            var url_parse, path, host;
            if (this.url_parser === undefined) {
                this.url_parser = require('url');
            }

            if (this.https === undefined) {
                this.https = require('https');
            }

            if (this.request === undefined) {
                this.request = require('request');
            }


            url_parse = this.url_parser.parse(url);
            path = url_parse.path;
            host = url_parse.host;

            that.url = url;

            this.request.post({
                path:     url,
                body:    post_body
            }, function (error, response, body) {
                that._parse_response(error, response, callback);
            });
        } else {
            if ('withCredentials' in new XMLHttpRequest()) {
                xhReq = new XMLHttpRequest();
            } else {
                xhReq = new XDomainRequest();
            }

            xhReq.open("POST", url);
            xhReq.timeout = 5000;

            xhReq.onload = function () {
                var data_obj;
                if (options.raw) {
                    data_obj = xhReq.responseText.slice(xhReq.responseText.indexOf("\r\n") + 2, xhReq.responseText.length);
                    callback(null, xhReq);
                } else {
                    that._parse_response(xhReq.responseText, callback);
                }
            };

            xhReq.onerror = function (e) {
                try {
                    console.log("error in _post_message " + JSON.parse(xhReq.responseText));
                } catch (error) {
                    console.log('Unknown error in _post_message: ' + error);
                }
                callback(xhReq);
            };

            xhReq.onprogress = function (e) {

            };

            xhReq.ontimeout = function (e) {

            };
            if ('withCredentials' in new XMLHttpRequest()) {
                xhReq.setRequestHeader('Content-Type','text/plain');
            }
            xhReq.send(post_body);

            return xhReq;
        }


    };

    /**
     * Send a get request to the server
     * @name Web_Business#_get_message
     * @private
     * @function
     * @param {object} data - data to append to end of url
     * @param {object} options - options for the ajax call
     *  @param {string} url - the server endpoint to call
     * @param {function} error - error callback
     * @param {function} callback - callback callback
     * @returns {Object} xhr - xDomainObject
     * @example
     * Web_Business._get_message({q: 'sample'}, {url: '4/cs/search', home_router: 'https://...'}, function () {}, function () {});
     */
    Crawler.prototype._get_message = function (data, options, callback) {
        options = options || {};
        options.home_router = options.home_router || this.home_router;
        callback = callback || function () {};

        var url = options.url,
            post_body, xhReq, that = this;

        if (options.home_router) {
            url = this._create_url({uri: url, query_params: data}, {
                home_router: options.home_router
            });
        } else {
            return callback('Home router required');
        }

        if (this._is_server()) {
            var url_parse, path, host;
            if (this.url_parser === undefined) {
                this.url_parser = require('url');
            }

            if (this.https === undefined) {
                this.https = require('https');
            }

            if (this.request === undefined) {
                this.request = require('request');
            }
            that.url = url;

            this.request(url, function (error, response, body) {
                that._parse_response(error, response, callback);
            });
        } else {
            if ('withCredentials' in new XMLHttpRequest()) {
                xhReq = new XMLHttpRequest();
            } else {
                xhReq = new XDomainRequest();
            }

            xhReq.open("GET", url);

            xhReq.timeout = 5000;
            xhReq.onload = function () {
                var data_obj;
                if (options.raw) {
                    data_obj = xhReq.responseText.slice(xhReq.responseText.indexOf("\r\n") + 2, xhReq.responseText.length);
                    callback(null, xhReq);
                } else {
                    that._parse_response(xhReq.responseText, callback);
                }
            };

            xhReq.onerror = function (e) {
                try {
                    console.log("error in _post_message " + JSON.parse(xhReq.responseText));
                } catch (error) {
                    console.log('Unknown error in _post_message: ' + error);
                }
                callback(xhReq);
            };

            xhReq.onprogress = function (e) {

            };

            xhReq.ontimeout = function (e) {

            };

            xhReq.send(null);

            return xhReq;
        }
    };

    /**
     * Create a url from parameters
     * @name Web_Business#_create_url
     * @function
     * @private
     * @returns {string} returns a string with the full url
     */
    Crawler.prototype.crawl = function (id) {
        var self = this;

        self.grab_url(id, function (error, response) {
            if (error) {
                return error;
            }

            var edges = self.split_response(response);

            self.graph[id] = [];

            if (edges.indexOf("GOAL") !== -1 || edges.indexOf("DEADEND") !== -1) {
                self.graph[id].push(edges.pop());
            } else {
                for (var x = 0; x < edges.length; x++) {
                    if (edges[x] === 'abs(add(add(6460,116),subtract(63,multiply(-1,multiply(-1,18610)))))') {
                        debugger;
                    }
                    var solved = self.parser.solve(edges[x]);
                    if (self.cheat_answer[solved] === undefined) {
                        debugger;
                    }
                    self.graph[id].push(solved);
                }

                for (var x = 0; x < self.graph[id].length; x++) {
                    if (!(self.graph[id][x] in self.graph)) {
                        self.queue.push(self.graph[id][x]);
                    }
                }
            }

            // Had to queue up my requests because the server was bouncing requests around 30
            if (self.queue.length !== 0) {
                self.crawl(self.queue.pop());
            } else {
                self.finished(self.graph);
            }        
        });  
    };

  /*
  /*

    /**
     * grab a url from id 
     * @name Web_Business#grab_url
     * @function
     * @public
     */
    Crawler.prototype.grab_url = function (id, callback) {
        var url = this._create_url({uri:id});
        return this._get_message(null, {url: id, raw: true}, callback);
    };

    /**
     * grab a url from id 
     * @name Web_Business#grab_url
     * @function
     * @public
     */
    Crawler.prototype.finished = function (graph) {
        console.log(graph);
    };

    /**
     * split expressions from response
     * @name Web_Business#split_response
     * @function
     * @public
     * @returns {string} return array with lines
     */
    Crawler.prototype.split_response = function (response) {
        return response.replace( /\n/g, " " ).split( " " );
    };

    /**
     * turn the returned expression into a usable format
     * @name Web_Business#string_to_equation
     * @function
     * @public
     * @returns {string} return string of new equation
     */
    Crawler.prototype.string_to_equation = function (string) {
        string = string.replace(/,/g, ' ');
        string = string.replace(/abs\(/g, ' $ ( 1 ');
        string = string.replace(/add/g, ' + ');
        string = string.replace(/subtract/g, ' - ');
        string = string.replace(/multiply/g, ' * ');
        string = string.replace(/\(/g, ' ( ');
        string = string.replace(/\)/g, ' ) ');
        string = string.replace(/\s{2,}/g, ' ');
        return string.trim();
    };

    /**
     * Create a url from parameters
     * @name Web_Business#_create_url
     * @function
     * @private
     * @returns {string} returns a string with the full url
     */
    Crawler.prototype._create_url = function (params, options) {
        options = options  || {};
        options.home_router = options.home_router || this.home_router;

        var url;

        if (!options.home_router && (params.uri.indexOf('https://') || params.uri.indexOf('https://'))) {

        } else {
            url = options.home_router + params.uri;
        }
        
        return url;
    };

    /**
     * Check if javascript is being run on server or client
     * @name Web_Business#_is_server
     * @function
     * @private
     * @returns {bool} returns true is code is running on server
     */
    Crawler.prototype._is_server = function () {
        return ! (typeof window != 'undefined' && window.document);
    };

    return Crawler;
}));
