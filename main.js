/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";

    // Load dependent modules
    var AppInit             = brackets.getModule("utils/AppInit"),
        CodeHintManager     = brackets.getModule("editor/CodeHintManager"),
        ArcGIS_JS_JSON      = require("text!jsapi.json"),
        ArcGIS_JS;

    /**
     * @constructor
     */
    function ArcGISHints() {
        this.globalAttributes = this.readGlobalArcGISHints();
        this.cachedHints = null;
        this.exclusion = "";
    }

    /**
     * @private
     * Parse the code hints from JSON data and extract all hints from property names.
     * @return {!Array.<string>} An array of code hints read from the JSON data source.
     */
    ArcGISHints.prototype.readGlobalArcGISHints = function () {
        return $.map(ArcGIS_JS, function (value, key) {
            if (value.global === "true") {
                return key;
            }
        });
    };
    
    /**
     * Determines whether HTML attribute hints are available in the current 
     * editor context.
     * 
     * @param {Editor} editor 
     * A non-null editor object for the active window.
     *
     * @param {string} implicitChar 
     * Either null, if the hinting request was explicit, or a single character
     * that represents the last insertion and that indicates an implicit
     * hinting request.
     *
     * @return {boolean} 
     * Determines whether the current provider is able to provide hints for
     * the given editor context and, in case implicitChar is non-null,
     * whether it is appropriate to do so.
     */
    ArcGISHints.prototype.hasHints = function (editor, implicitChar) {
        
        console.log(editor);
        console.log(implicitChar);
        
        
        /*
        var pos = editor.getCursorPos(),
            tokenType,
            offset,
            query,
            textAfterCursor;
        
        this.editor = editor;
        
        
        
        this.tagInfo = HTMLUtils.getTagInfo(editor, pos);
        tokenType = this.tagInfo.position.tokenType;
        offset = this.tagInfo.position.offset;
        if (implicitChar === null) {
            query = null;
             
            if (tokenType === HTMLUtils.ATTR_NAME) {
                if (offset >= 0) {
                    query = this.tagInfo.attr.name.slice(0, offset);
                }
            } else if (tokenType === HTMLUtils.ATTR_VALUE) {
                if (this.tagInfo.position.offset >= 0) {
                    query = this.tagInfo.attr.value.slice(0, offset);
                } else {
                    // We get negative offset for a quoted attribute value with some leading whitespaces 
                    // as in <a rel= "rtl" where the cursor is just to the right of the "=".
                    // So just set the queryStr to an empty string. 
                    query = "";
                }
                
                // If we're at an attribute value, check if it's an attribute name that has hintable values.
                if (this.tagInfo.attr.name) {
                    var hintsAndSortFunc = this._getValueHintsForAttr({queryStr: query},
                                                                      this.tagInfo.tagName,
                                                                      this.tagInfo.attr.name);
                    var hints = hintsAndSortFunc.hints;
                    if (hints instanceof Array) {
                        // If we got synchronous hints, check if we have something we'll actually use
                        var i, foundPrefix = false;
                        for (i = 0; i < hints.length; i++) {
                            if (hints[i].indexOf(query) === 0) {
                                foundPrefix = true;
                                break;
                            }
                        }
                        if (!foundPrefix) {
                            query = null;
                        }
                    }
                }
            }

            if (offset >= 0) {
                if (tokenType === HTMLUtils.ATTR_NAME && offset === 0) {
                    this.exclusion = this.tagInfo.attr.name;
                } else {
                    this.updateExclusion(false);
                }
            }
            
            return query !== null;
        } else {
            if (implicitChar === " " || implicitChar === "'" ||
                    implicitChar === "\"" || implicitChar === "=") {
                if (tokenType === HTMLUtils.ATTR_NAME) {
                    this.exclusion = this.tagInfo.attr.name;
                }
                return true;
            }
            return false;
        }
        */
        
        return true; // added
        
        
    };
    
    /**
     * Returns a list of availble HTML attribute hints if possible for the 
     * current editor context. 
     *
     * @return {jQuery.Deferred|{
     *              hints: Array.<string|jQueryObject>,
     *              match: string,
     *              selectInitial: boolean,
     *              handleWideResults: boolean}}
     * Null if the provider wishes to end the hinting session. Otherwise, a
     * response object that provides:
     * 1. a sorted array hints that consists of strings
     * 2. a string match that is used by the manager to emphasize matching
     *    substrings when rendering the hint list
     * 3. a boolean that indicates whether the first result, if one exists,
     *    should be selected by default in the hint list window.
     * 4. handleWideResults, a boolean (or undefined) that indicates whether
     *    to allow result string to stretch width of display.
     */
    ArcGISHints.prototype.getHints = function (implicitChar) {
        /*
        var cursor = this.editor.getCursorPos(),
            query = {queryStr: null},
            tokenType,
            offset,
            result = [],
            textAfterCursor;
 
        this.tagInfo = HTMLUtils.getTagInfo(this.editor, cursor);
        tokenType = this.tagInfo.position.tokenType;
        offset = this.tagInfo.position.offset;
        if (tokenType === HTMLUtils.ATTR_NAME || tokenType === HTMLUtils.ATTR_VALUE) {
            query.tag = this.tagInfo.tagName;
            
            if (offset >= 0) {
                if (tokenType === HTMLUtils.ATTR_NAME) {
                    query.queryStr = this.tagInfo.attr.name.slice(0, offset);
                } else {
                    query.queryStr = this.tagInfo.attr.value.slice(0, offset);
                    query.attrName = this.tagInfo.attr.name;
                }
                this.updateExclusion(false);
            } else if (tokenType === HTMLUtils.ATTR_VALUE) {
                // We get negative offset for a quoted attribute value with some leading whitespaces 
                // as in <a rel= "rtl" where the cursor is just to the right of the "=".
                // So just set the queryStr to an empty string. 
                query.queryStr = "";
                query.attrName = this.tagInfo.attr.name;
            }

            query.usedAttr = HTMLUtils.getTagAttributes(this.editor, cursor);
        }

        if (query.tag && query.queryStr !== null) {
            var tagName = query.tag,
                attrName = query.attrName,
                filter = query.queryStr,
                unfiltered = [],
                hints = [],
                sortFunc = null;

            if (attrName) {
                var hintsAndSortFunc = this._getValueHintsForAttr(query, tagName, attrName);
                hints = hintsAndSortFunc.hints;
                sortFunc = hintsAndSortFunc.sortFunc;
                
            } 
            
            if (hints instanceof Array && hints.length) {
                console.assert(!result.length);
                result = $.map(hints, function (item) {
                    if (item.indexOf(filter) === 0) {
                        return item;
                    }
                }).sort(sortFunc);
                return {
                    hints: result,
                    match: query.queryStr,
                    selectInitial: true,
                    handleWideResults: false
                };
            } else if (hints instanceof Object && hints.hasOwnProperty("done")) { // Deferred hints
                var deferred = $.Deferred();
                hints.done(function (asyncHints) {
                    deferred.resolveWith(this, [{
                        hints: asyncHints,
                        match: query.queryStr,
                        selectInitial: true,
                        handleWideResults: false
                    }]);
                });
                return deferred;
            } else {
                return null;
            }
        }
        */
        
        return null; // added
        
    };
    
    /**
     * Inserts a given HTML attribute hint into the current editor context.
     * 
     * @param {string} hint 
     * The hint to be inserted into the editor context.
     * 
     * @return {boolean} 
     * Indicates whether the manager should follow hint insertion with an
     * additional explicit hint request.
     */
    ArcGISHints.prototype.insertHint = function (completion) {
        /*
        var cursor = this.editor.getCursorPos(),
            start = {line: -1, ch: -1},
            end = {line: -1, ch: -1},
            tokenType = this.tagInfo.position.tokenType,
            offset = this.tagInfo.position.offset,
            charCount = 0,
            insertedName = false,
            replaceExistingOne = this.tagInfo.attr.valueAssigned,
            endQuote = "",
            shouldReplace = true,
            textAfterCursor;

        if (tokenType === HTMLUtils.ATTR_NAME) {
            textAfterCursor = this.tagInfo.attr.name.substr(offset);
            if (CodeHintManager.hasValidExclusion(this.exclusion, textAfterCursor)) {
                charCount = offset;
                replaceExistingOne = false;
            } else {
                charCount = this.tagInfo.attr.name.length;
            }
            // Append an equal sign and two double quotes if the current attr is not an empty attr
            // and then adjust cursor location before the last quote that we just inserted.
            if (!replaceExistingOne && attributes && attributes[completion] &&
                    attributes[completion].type !== "flag") {
                completion += "=\"\"";
                insertedName = true;
            } else if (completion === this.tagInfo.attr.name) {
                shouldReplace = false;
            }
        } else if (tokenType === HTMLUtils.ATTR_VALUE) {
            textAfterCursor = this.tagInfo.attr.value.substr(offset);
            if (CodeHintManager.hasValidExclusion(this.exclusion, textAfterCursor)) {
                charCount = offset;
                // Set exclusion to null only after attribute value insertion,
                // not after attribute name insertion since we need to keep it 
                // for attribute value insertion.
                this.exclusion = null;
            } else {
                charCount = this.tagInfo.attr.value.length;
            }
            
            if (!this.tagInfo.attr.hasEndQuote) {
                endQuote = this.tagInfo.attr.quoteChar;
                if (endQuote) {
                    completion += endQuote;
                } else if (offset === 0) {
                    completion = "\"" + completion + "\"";
                }
            } else if (completion === this.tagInfo.attr.value) {
                shouldReplace = false;
            }
        }

        end.line = start.line = cursor.line;
        start.ch = cursor.ch - offset;
        end.ch = start.ch + charCount;

        if (shouldReplace) {
            if (start.ch !== end.ch) {
                this.editor.document.replaceRange(completion, start, end);
            } else {
                this.editor.document.replaceRange(completion, start);
            }
        }

        if (insertedName) {
            this.editor.setCursorPos(start.line, start.ch + completion.length - 1);

            // Since we're now inside the double-quotes we just inserted,
            // immediately pop up the attribute value hint.
            return true;
        } else if (tokenType === HTMLUtils.ATTR_VALUE && this.tagInfo.attr.hasEndQuote) {
            // Move the cursor to the right of the existing end quote after value insertion.
            this.editor.setCursorPos(start.line, start.ch + completion.length + 1);
        }
        */
        return true; // added
    };

    AppInit.appReady(function () {
        // Parse JSON files
        ArcGIS_JS = JSON.parse(ArcGIS_JS_JSON);
        
        // Register code hint providers
        var ArcGISHints = new ArcGISHints();
        CodeHintManager.registerHintProvider(ArcGISHints, ["js"], 6);
    
        // For unit testing
        exports.ArcGISHintProvider = ArcGISHints;
    });
});