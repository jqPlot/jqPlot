
// JSpec - jQuery - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function($, $$){

  // --- Dependencies

  $$.requires('jQuery', 'when using jspec.jquery.js')
  
  // --- Async Support

  $.ajaxSetup({ async : false })

  // --- Helpers

  $$.defaultContext.element = $
  $$.defaultContext.elements = $
  $$.defaultContext.defaultSandbox = $$.defaultContext.sandbox
  $$.defaultContext.sandbox = function() { return $($$.defaultContext.defaultSandbox()) }

  // --- Matchers

  $$.addMatchers({
    have_tag      : "jQuery(expected, actual).length == 1",
    have_one      : "alias have_tag",
    have_tags     : "jQuery(expected, actual).length > 1",
    have_many     : "alias have_tags",
    have_child    : "jQuery(actual).children(expected).length == 1",
    have_children : "jQuery(actual).children(expected).length > 1",
    have_class    : "jQuery(actual).hasClass(expected)",
    have_text     : "jQuery(actual).text() == expected",
    have_value    : "jQuery(actual).val() == expected",
    be_visible    : "!jQuery(actual).is(':hidden')",
    be_hidden     : "jQuery(actual).is(':hidden')",
    be_enabled    : "!jQuery(actual).attr('disabled')",
    
    have_attr : { match : function(actual, attr, value) {
        if (value) return $(actual).attr(attr) == value
        else return $(actual).attr(attr)
      }
    }
  })
  
  // --- be_BOOLATTR
  
  $$.each('disabled selected checked', function(attr){
    $$.matchers['be_' + attr] = "jQuery(actual).attr('" + attr + "')"
  })
  
  // --- have_ATTR
  
  $$.each('type id title alt href src rel rev name target', function(attr){
    $$.matchers['have_' + attr] = { match : function(actual, value) {
        return $$.matchers.have_attr.match(actual, attr, value)
      }
    }
  })
  
  // --- be_a_TYPE_input (deprecated)
  
  $$.each('checkbox radio file password submit image text reset button', function(type){
    //console.warn("be_a_" + type + "_input is deprected; use have_type('" + type + "')");
    JSpec.matchers['be_a_' + type + '_input'] = "jQuery(actual).get(0).type == '" + type + "'"
  })
  
})(jQuery, JSpec)


