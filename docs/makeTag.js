    /**
     * From "JavaScript: the Definitive Guide, by David Flanagan. Copyright 2006 O'Reilly Media, Inc."
     * 
     * make(tagname, attributes, children):
     *   create an HTML element with specified tagname, attributes and children.
     * 
     * The attributes argument is a JavaScript object: the names and values of its
     * properties are taken as the names and values of the attributes to set.
     * If attributes is null, and children is an array or a string, the attributes 
     * can be omitted altogether and the children passed as the second argument. 
     *
     * The children argument is normally an array of children to be added to 
     * the created element.  If there are no children, this argument can be 
     * omitted.  If there is only a single child, it can be passed directly 
     * instead of being enclosed in an array. (But if the child is not a string
     * and no attributes are specified, an array must be used.)
     * 
     * Example: make("p", ["This is a ", make("b", "bold"), " word."]);
     *
     * Inspired by the MochiKit library (http://mochikit.com) by Bob Ippolito
     */
    function makeTag(tagname, attributes, children) {

        // If we were invoked with two arguments the attributes argument is
        // an array or string, it should really be the children arguments.
        if (arguments.length == 2 && 
            (attributes instanceof Array || typeof attributes == "string")) {
            children = attributes;
            attributes = null;
        }

        // Create the element
        var e = document.createElement(tagname);

        // Set attributes
        if (attributes) {
            for(var name in attributes) {
                if (name == 'style') {    // handle a style object
                    for (var s in attributes[name]) {
                        e.style[s] = attributes[name][s].toString();
                    }
                }
                else e.setAttribute(name, attributes[name]);
            }
        }

        // Add children, if any were specified.
        if (children != null) {
            if (children instanceof Array) {  // If it really is an array
                for(var i = 0; i < children.length; i++) { // Loop through kids
                    var child = children[i];
                    if (typeof child == "string")          // Handle text nodes
                        child = document.createTextNode(child);
                    e.appendChild(child);  // Assume anything else is a Node
                }
            }
            else if (typeof children == "string") // Handle single text child
                e.appendChild(document.createTextNode(children));
            else e.appendChild(children);         // Handle any other single child
        }

        // Finally, return the element.
        return e;
    };
