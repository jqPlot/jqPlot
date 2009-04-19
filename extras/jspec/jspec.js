
// JSpec - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function(){

  JSpec = {

    version  : '1.0.4',
    main     : this,
    suites   : [],
    matchers : {},
    stats    : { specs : 0, assertions : 0, failures : 0, passes : 0 },
    options  : { profile : false },

    /**
     * Default context in which bodies are evaluated.
     * This allows specs and hooks to use the 'this' keyword in
     * order to store variables, as well as allowing the context
     * to provide helper methods or properties.
     *
     * Replace context simply by setting JSpec.context
     * to your own like below:
     *
     * JSpec.context = { foo : 'bar' }
     *
     * Contexts can be changed within any body, this can be useful
     * in order to provide specific helper methods to specific suites.
     *
     * To reset (usually in after hook) simply set to null like below:
     *
     * JSpec.context = null
     */

    defaultContext : {
      sandbox : function(name) {
        sandbox = document.createElement('div')
        sandbox.setAttribute('class', 'jspec-sandbox')
        document.body.appendChild(sandbox)
        return sandbox
      }
    },

    // --- Objects

    /**
     * Matcher.
     *
     * There are many ways to define a matcher within JSpec. The first being
     * a string that is less than 4 characters long, which is considered a simple
     * binary operation between two expressions. For example the matcher '==' simply
     * evaluates to 'actual == expected'.
     *
     * The second way to create a matcher is with a larger string, which is evaluated,
     * and then returned such as 'actual.match(expected)'.
     *
     * You may alias simply by starting a string with 'alias', such as 'be' : 'alias eql'.
     *
     * Finally an object may be used, and must contain a 'match' method, which is passed
     * both the expected, and actual values. Optionally a 'message' method may be used to
     * specify a custom message. Example:
     *
     * match : function(actual, expected) {
     *   return typeof actual == expected
     * }
     *
     * @param  {string} name
     * @param  {hash, string} matcher
     * @param  {object} actual
     * @param  {array} expected
     * @param  {bool} negate
     * @return {Matcher}
     * @api private
     */

    Matcher : function (name, matcher, actual, expected, negate) {
      self = this
      this.name = name
      this.message = ''
      this.passed = false
      
      // Define matchers from strings

      if (typeof matcher == 'string') {
        if (matcher.match(/^alias (\w+)/)) matcher = JSpec.matchers[matcher.match(/^alias (\w+)/)[1]]
        if (matcher.length < 4) body = 'actual ' + matcher + ' expected'
        else body = matcher
        matcher = { match : function(actual, expected) { return eval(body) } }
      }

      // Generate matcher message

      function generateMessage() {
         // TODO: clone expected instead of unshifting in this.match()
        expectedMessage = print.apply(this, expected.slice(1))
        return 'expected ' + print(actual) + ' to ' + (negate ? ' not ' : '') + name.replace(/_/g, ' ') + ' ' + expectedMessage
      }

      // Set message to matcher callback invocation or auto-generated message

      function setMessage() {
        self.message = typeof matcher.message == 'function' ?
          matcher.message(actual, expected, negate):
          generateMessage()
      }

      // Pass the matcher

      function pass() {
        setMessage()
        JSpec.stats.passes += 1
        self.passed = true
      }

      // Fail the matcher

      function fail() {
        setMessage()
        JSpec.stats.failures += 1
      }

      // Return result of match

      this.match = function() {
        expected.unshift(actual == null ? null : actual.valueOf())
        return matcher.match.apply(JSpec, expected)
      }

      // Boolean match result

      this.passes = function() {
        this.result = this.match()
        return negate? !this.result : this.result
      }

      // Performs match, and passes / fails the matcher

      this.exec = function() {
        this.passes() ? pass() : fail()
        return this
      }
    },


    formatters : {

      /**
       * Default formatter, outputting to the DOM.
       *
       * Options:
       *   - reportToId    id of element to output reports to, defaults to 'jspec'
       *   - failuresOnly  displays only suites with failing specs
       *
       * @api public
       */

      DOM : function(results, options) {
        id = option('reportToId') || 'jspec'
        report = document.getElementById(id)
        classes = results.stats.failures ? 'has-failures' : ''
        if (!report) error('requires the element #' + id + ' to output its reports')

        markup =
        '<div id="jspec-report" class="' + classes + '"><div class="heading">           \
        <span class="passes">Passes: <em>' + results.stats.passes + '</em></span>       \
        <span class="failures">Failures: <em>' + results.stats.failures + '</em></span> \
        </div><table class="suites">'
          
        function renderSuite(suite) {
          failuresOnly = option('failuresOnly')
          displaySuite = failuresOnly ? suite.ran && !suite.passed() : suite.ran
          if (displaySuite && suite.hasSpecs()) {
            markup += '<tr class="description"><td colspan="2">' + suite.description + '</td></tr>'
            each(suite.specs, function(i, spec){
              markup += '<tr class="' + (i % 2 ? 'odd' : 'even') + '">'
              if (spec.requiresImplementation() && !failuresOnly) {
                markup += '<td class="requires-implementation" colspan="2">' + spec.description + '</td>'
              }
              else if (spec.passed() && !failuresOnly) {
                markup += '<td class="pass">' + spec.description+ '</td><td>' + spec.assertionsGraph() + '</td>'
              }
              else if(!spec.passed()) {
                markup += '<td class="fail">' + spec.description + ' <em>' + spec.failure().message + '</em>' + '</td><td>' + spec.assertionsGraph() + '</td>'
              }
              markup += '<tr class="body" style="display: none;"><td colspan="2">' + spec.body + '</td></tr>'
            })
            markup += '</tr>'
          }
        }  
        
        function renderSuites(suites) {
          each(suites, function(suite){
            renderSuite(suite)
            if (suite.hasSuites()) renderSuites(suite.suites)
          })
        }
        
        renderSuites(results.suites)

        markup += '</table></div>'

        report.innerHTML = markup
      },

      /**
       * Console formatter, tested with Firebug and Safari 4.
       *
       * @api public
       */

      Console : function(results, options) {
        console.log('')
        console.log('Passes: ' + results.stats.passes + ' Failures: ' + results.stats.failures)
        
        function renderSuite(suite) {
          if (suite.ran) {
            console.group(suite.description)
            results.each(suite.specs, function(spec){
              assertionCount = spec.assertions.length + ':'
              if (spec.requiresImplementation())
                console.warn(spec.description)
              else if (spec.passed())
                console.log(assertionCount + ' ' + spec.description)
              else 
                console.error(assertionCount + ' ' + spec.description + ', ' + spec.failure().message)
            })
            console.groupEnd()
          }          
        }
        
        function renderSuites(suites) {
          each(suites, function(suite){
            renderSuite(suite)
            if (suite.hasSuites()) renderSuites(suite.suites)
          })
        }
        
        renderSuites(results.suites)
      }
    },

    /**
     * Specification Suite block object.
     *
     * @param {string} description
     * @param {function} body
     * @api private
     */

    Suite : function(description, body) {
      this.body = body, this.suites = [], this.specs = []
      this.description = description, this.ran = false
      this.hooks = { 'before' : [], 'after' : [], 'before_each' : [], 'after_each' : [] }

      // Add a spec to the suite

      this.addSpec = function(description, body) {
        spec = new JSpec.Spec(description, body)
        this.specs.push(spec)
        spec.suite = this
      }
      
      // Add a hook to the suite
      
      this.addHook = function(hook, body) {
        this.hooks[hook].push(body)
      }
      
      // Add a nested suite
      
      this.addSuite = function(description, body) {
        suite = new JSpec.Suite(description, body)
        suite.description = this.description + ' ' + suite.description
        this.suites.push(suite)
        suite.suite = this
      }

      // Invoke a hook in context to this suite

      this.hook = function(hook) {
        each(this.hooks[hook], function(body) {
          JSpec.evalBody(body, "Error in hook '" + hook + "', suite '" + this.description + "': ")
        })
      }
      
      // Check if nested suites are present
      
      this.hasSuites = function() {
        return this.suites.length  
      }
      
      // Check if this suite has specs
      
      this.hasSpecs = function() {
        return this.specs.length
      }
      
      // Check if the entire suite passed

      this.passed = function() {
        var passed = true
        each(this.specs, function(spec){
          if (!spec.passed()) passed = false
        })
        return passed
      }
    },
    
    /**
     * Specification block object.
     *
     * @param {string} description
     * @param {function} body
     * @api private
     */

    Spec : function(description, body) {
      this.body = body, this.description = description, this.assertions = []

      // Find first failing assertion

      this.failure = function() {
        return inject(this.assertions, null, function(failure, assertion){
          return !assertion.passed && !failure ? assertion : failure
        })
      }
      
      // Find all failing assertions
      
      this.failures = function() {
        return inject(this.assertions, [], function(failures, assertion){
          if (!assertion.passed) failures.push(assertion)
          return failures
        })
      }

      // Weither or not the spec passed

      this.passed = function() {
        return !this.failure()
      }

      // Weither or not the spec requires implementation (no assertions)

      this.requiresImplementation = function() {
        return this.assertions.length == 0
      }
      
      // Sprite based assertions graph
      
      this.assertionsGraph = function() {
        return map(this.assertions, function(assertion){
          return '<span class="assertion ' + (assertion.passed ? 'passed' : 'failed') + '"></span>'
        }).join('')
      }
    },

    // --- Methods
    
    /**
     * Get option value. This method first checks if
     * the option key has been set via the query string,
     * otherwise returning the options hash value.
     *
     * @param  {string} key
     * @return {mixed}
     * @api public
     */
     
     option : function(key) {
       if ((value = query(key)) !== null) return value
       else return JSpec.options[key] || null
     },

    /**
     * Generates a hash of the object passed.
     *
     * @param  {object} object
     * @return {string}
     * @api private
     */

    hash : function(object) {
      serialize = function(prefix) {
        return inject(object, prefix + ':', function(buffer, key, value){
          return buffer += hash(value)
        })
      }
      switch (object.constructor) {
        case Array:  return serialize('a')
        case Object: return serialize('o')
        case RegExp: return 'r:' + object.toString()
        case Number: return 'n:' + object.toString()
        case String: return 's:' + object.toString()
        default: return object.toString()
      }
    },

    /**
     * Return last element of an array.
     *
     * @param  {array} array
     * @return {object}
     * @api public
     */

    last : function(array) {
      return array[array.length - 1]
    },

    /**
     * Convert object(s) to a print-friend string.
     *
     * @param  {object, ...} object
     * @return {string}
     * @api public
     */

    print : function(object) {
      if (arguments.length > 1) {
        list = []
        for (i = 0; i < arguments.length; i++) list.push(print(arguments[i]))
        return list.join(', ')
      }
      if (object === undefined) return ''
      if (object === null) return 'null'
      if (object === true) return 'true'
      if (object === false) return 'false'
      if (object.jquery && object.selector.length > 0) return 'selector ' + print(object.selector) + ''
      if (object.jquery) return escape(object.html())
      if (object.nodeName) return escape(object.outerHTML)
      switch (object.constructor) {
        case String: return "'" + escape(object) + "'"
        case Number: return object
        case Array :
          buff = '['
          each(object, function(v){ buff += ', ' + print(v) })
          return buff.replace('[,', '[') + ' ]'
        case Object:
          buff = '{'
          each(object, function(k, v){ buff += ', ' + print(k) + ' : ' + print(v)})
          return buff.replace('{,', '{') + ' }'
        default: 
          return escape(object.toString())
      }
    },

    /**
     * Escape HTML.
     *
     * @param  {string} html
     * @return {string}
     * @api public
     */

     escape : function(html) {
       if (typeof html != 'string') return html
       return html.
         replace(/&/gmi, '&amp;').
         replace(/"/gmi, '&quot;').
         replace(/>/gmi, '&gt;').
         replace(/</gmi, '&lt;')
     },

    /**
     * Invoke a matcher.
     *
     * this.match('test', 'should', 'be_a', [String])
     *
     * @param  {object} actual
     * @param  {bool, string} negate
     * @param  {string} name
     * @param  {array} expected
     * @return {bool}
     * @api private
     */

    match : function(actual, negate, name, expected) {
      if (typeof negate == 'string') negate = negate == 'should' ? false : true
      matcher = new this.Matcher(name, this.matchers[name], actual, expected, negate)
      this.currentSpec.assertions.push(matcher.exec())
      return matcher.result
    },

    /**
     * Iterate an object, invoking the given callback.
     *
     * @param  {hash, array, string} object
     * @param  {function} callback
     * @return {JSpec}
     * @api public
     */

    each : function(object, callback) {
      if (typeof object == 'string') object = object.split(' ')
      for (key in object) {
        if (object.hasOwnProperty(key))
          callback.length == 1 ?
            callback.call(JSpec, object[key]):
            callback.call(JSpec, key, object[key])
      }
      return JSpec
    },

    /**
     * Iterate with memo.
     *
     * @param  {hash, array} object
     * @param  {object} initial
     * @param  {function} callback
     * @return {object}
     * @api public
     */

    inject : function(object, initial, callback) {
      each(object, function(key, value){
        initial = callback.length == 2 ?
          callback.call(JSpec, initial, value):
          callback.call(JSpec, initial, key, value) || initial
      })
      return initial
    },
    
    /**
     * Strim whitespace or chars.
     *
     * @param  {string} string
     * @param  {string} chars
     * @return {string}
     * @api public
     */

     strip : function(string, chars) {
       return string.
         replace(new RegExp('['  + (chars || '\\s') + ']*$'), '').
         replace(new RegExp('^[' + (chars || '\\s') + ']*'),  '')
     },
    
    /**
     * Map callback return values.
     *
     * @param  {hash, array} object
     * @param  {function} callback
     * @return {array}
     * @api public
     */

    map : function(object, callback) {
      return inject(object, [], function(memo, key, value){
        memo.push(callback.length == 1 ?
          callback.call(JSpec, value):
          callback.call(JSpec, key, value))
      })
    },
    
    /**
     * Returns true if the callback returns true at least once.
     *
     * @param  {hash, array} object
     * @param  {function} callback
     * @return {bool}
     * @api public
     */
         
    any : function(object, callback) {
      return inject(object, false, function(state, key, value){
        if (state) return true
        return callback.length == 1 ?
          callback.call(JSpec, value):
          callback.call(JSpec, key, value)
      })
    },

    /**
     * Define matchers.
     *
     * @param  {hash} matchers
     * @return {JSpec}
     * @api public
     */

    addMatchers : function(matchers) {
      each(matchers, function(name, body){ this.matchers[name] = body })
      return this
    },
    
    /**
     * Add a root suite to JSpec.
     *
     * @param  {string} description
     * @param  {body} function
     * @return {JSpec}
     * @api public
     */
    
    addSuite : function(description, body) {
      this.suites.push(new JSpec.Suite(description, body))
      return this
    },

    /**
     * Evaluate a JSpec capture body.
     *
     * @param  {function} body
     * @param  {string} errorMessage (optional)
     * @return {Type}
     * @api private
     */

    evalBody : function(body, errorMessage) {
      try { body.call(this.context || this.defaultContext) }
      catch(e) { error(errorMessage, e) }
    },

    /**
     * Pre-process a string of JSpec.
     *
     * @param  {string} input
     * @return {string}
     * @api private
     */

    preprocess : function(input) {
      return input.
        replace(/describe (.*?)$/m, 'JSpec.addSuite($1, function(){').
        replace(/describe (.*?)$/gm, 'this.addSuite($1, function(){').
        replace(/it (.*?)$/gm, 'this.addSpec($1, function(){').
        replace(/^(?: *)(before_each|after_each|before|after)(?= |\n|$)/gm, 'this.addHook("$1", function(){').
        replace(/end(?= |\n|$)/gm, '});').
        replace(/-{/g, 'function(){').
        replace(/(\d+)\.\.(\d+)/g, function(_, a, b){ return range(a, b) }).
        replace(/([\s\(]+)\./gm, '$1this.').
        replace(/\.should([_\.]not)?[_\.](\w+)(?: |$)(.*)$/gm, '.should$1_$2($3)').
        replace(/(.+?)\.(should(?:[_\.]not)?)[_\.](\w+)\((.*)\)$/gm, 'JSpec.match($1, "$2", "$3", [$4]);')
    },

    /**
     * Create a range string which can be evaluated to a native array.
     *
     * @param  {int} start
     * @param  {int} end
     * @return {string}
     * @api public
     */

    range : function(start, end) {
      current = parseInt(start), end = parseInt(end), values = [current]
      if (end > current) while (++current <= end) values.push(current)
      else               while (--current >= end) values.push(current)
      return '[' + values + ']'
    },

    /**
     * Report on the results. 
     *
     * @return {JSpec}
     * @api public
     */

    report : function() {
      this.options.formatter ? 
        new this.options.formatter(this, this.options):
        new this.formatters.DOM(this, this.options)
      return this
    },

    /**
     * Run the spec suites.
     *
     * @return {JSpec}
     * @api public
     */

    run : function() {
      if (option('profile')) console.group('Profile')
      each(this.suites, function(suite) { this.runSuite(suite) })
      if (option('profile')) console.groupEnd()
      return this
    },

    /**
     * Run a suite.
     *
     * @param  {Suite} suite
     * @return {JSpec}
     * @api public
     */

    runSuite : function(suite) {
      suite.body()
      suite.ran = true
      suite.hook('before')
      each(suite.specs, function(spec) {
        suite.hook('before_each')
        this.runSpec(spec)
        suite.hook('after_each')
      })
      suite.hook('after')
      if (suite.hasSuites()) {
        each(suite.suites, function(suite) {
          this.runSuite(suite)
        })
      }
      return this
    },

    /**
     * Run a spec.
     *
     * @param  {Spec} spec
     * @api public
     */

    runSpec : function(spec) {
      this.currentSpec = spec
      this.stats.specs++
      if (option('profile')) console.time(spec.description)
      this.evalBody(spec.body, "Error in spec '" + spec.description + "': ")
      if (option('profile')) console.timeEnd(spec.description)
      this.stats.assertions += spec.assertions.length
    },

    /**
     * Require a dependency, with optional message.
     *
     * @param  {string} dependency
     * @param  {string} message (optional)
     * @api public
     */

    requires : function(dependency, message) {
      try { eval(dependency) }
      catch (e) { error('depends on ' + dependency + ' ' + (message || '')) }
    },

    /**
     * Query against the current query strings keys
     * or the queryString specified.
     *
     * @param  {string} key
     * @param  {string} queryString
     * @return {string, null}
     * @api public
     */

    query : function(key, queryString) {
      queryString = (queryString || window.location.search || '').substring(1)
      return inject(queryString.split('&'), null, function(value, pair){
        parts = pair.split('=')
        return  parts[0] == key ? parts[1].replace(/%20|\+/gmi, ' ') : value
      })
    },

    /**
     * Throw a JSpec related error.
     *
     * @param {string} message
     * @param {Exception} e
     * @api public
     */

    error : function(message, e) {
      throw 'jspec: ' + message + (e ? e.message : '') + ' near line ' + e.line
    },

    /**
     * Load a files contents.
     *
     * @param  {string} file
     * @return {string}
     * @api public
     */

    load : function(file) {
      if ('XMLHttpRequest' in this.main) {
        request = new XMLHttpRequest
        request.open('GET', file, false)
        request.send(null)
        if (request.readyState == 4) return request.responseText
      }
      else if ('load' in this.main) {
        // TODO: workaround for IO issue / preprocessing
        load(file)
      }
      else {
        error('cannot load ' + file)
      }
    },

    /**
     * Load, pre-process, and evaluate a file.
     *
     * @param {string} file
     * @param {JSpec}
     * @api public
     */

    exec : function(file) {
      eval(this.preprocess(this.load(file)))
      return this
    }
  }

  // --- Utility functions

  map    = JSpec.map
  any    = JSpec.any
  last   = JSpec.last
  range  = JSpec.range
  each   = JSpec.each
  option = JSpec.option
  inject = JSpec.inject
  error  = JSpec.error
  escape = JSpec.escape
  print  = JSpec.print
  hash   = JSpec.hash
  query  = JSpec.query
  strip  = JSpec.strip
  addMatchers = JSpec.addMatchers

  // --- Matchers

  addMatchers({
    be                 : "alias eql",
    equal              : "===",
    be_greater_than    : ">",
    be_less_than       : "<",
    be_at_least        : ">=",
    be_at_most         : "<=",
    be_a               : "actual.constructor == expected",
    be_an              : "alias be_a",
    be_null            : "actual == null",
    be_empty           : "actual.length == 0",
    be_true            : "actual == true",
    be_false           : "actual == false",
    be_type            : "typeof actual == expected",
    match              : "typeof actual == 'string' ? actual.match(expected) : false",
    respond_to         : "typeof actual[expected] == 'function'",
    have_length        : "actual.length == expected",
    be_within          : "actual >= expected[0] && actual <= last(expected)",
    have_length_within : "actual.length >= expected[0] && actual.length <= last(expected)",

    eql : { match : function(actual, expected) {
      if (actual.constructor == Array || actual.constructor == Object) return hash(actual) == hash(expected)
      else return actual == expected
    }},

    include : { match : function(actual) {
      for (state = true, i = 1; i < arguments.length; i++) {
        arg = arguments[i]
        switch (actual.constructor) {
          case String: 
          case Number:
          case RegExp:
          case Function:
            state = actual.toString().match(arg.toString())
            break
         
          case Object:
            state = arg in actual
            break
          
          case Array: 
            state = any(actual, function(value){ return hash(value) == hash(arg) })
            break
        }
        if (!state) return false
      }
      return true
    }},

    throw_error : { match : function(actual, expected) {
      try { actual() }
      catch (e) {
        if (expected == undefined) return true 
        else return expected.constructor == RegExp ?
          expected.test(e) : e.toString() == expected
      }
    }},
    
    have : { match : function(actual, length, property) {
      return actual[property].length == length
    }},
    
    have_at_least : { match : function(actual, length, property) {
      return actual[property].length >= length
    }},
    
    have_at_most : { match : function(actual, length, property) {
      return actual[property].length <= length
    }},
    
    have_within : { match : function(actual, range, property) {
      length = actual[property].length
      return length >= range.shift() && length <= range.pop()
    }},
    
    have_prop : { match : function(actual, property, value) {
      if (actual[property] == null || typeof actual[property] == 'function') return false
      return value == null ? true : JSpec.matchers['eql'].match(actual[property], value)
    }},
    
    have_property : { match : function(actual, property, value) {
      if (actual[property] == null || typeof actual[property] == 'function') return false
      return value == null ? true : value === actual[property]
    }}
  })

  // --- Expose
  
  this.JSpec = JSpec

})();
