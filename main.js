/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";

    // Load dependent modules
    var AppInit = brackets.getModule("utils/AppInit"),
        CodeHintManager = brackets.getModule("editor/CodeHintManager"),
        ArcGIS_JS = require("jsapi");
    

    function ArcGISHints() {}

    
    
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
        
        var mode = editor.getModeForSelection(),
            cursor = editor.getCursorPos();
        

        
        
        
        return true;
        
        
        
        
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
        return {
            hints: ["test1","test2"],
            match: "tst",
            selectInitial: true,
            handleWideResults: false
        };
        
        */
        
        return null;
        
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
        
        return false;
    };
    
    
    AppInit.appReady(function () {
        // Register code hint providers
        var bracketsHints = new ArcGISHints();
        // register hints with manager
        CodeHintManager.registerHintProvider(bracketsHints, ["javascript", "html"], 0);
        // For unit testing
        exports.ArcGISHintProvider = bracketsHints;
    });
    
    
});