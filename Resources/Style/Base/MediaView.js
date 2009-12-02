/**
 * A list of MediaView
 * @constructor
 * @param {CocoaObject} cocoaObject
 * @param {Object} parent
 * @param {string} elementTag
 */
var MediaView = function(cocoaObject, parent, elementTag)
{
    this.parent = parent;

    this.element = document.createElement(elementTag);
    this.element.className = "item";

    this.cocoaObject = cocoaObject;

    this.nameElement = document.createElement("div");
    this.nameElement.className = "name";

    this.revealSubitemsElement = document.createElement("div");
    this.revealSubitemsElement.className = "reveal-subitems hidden";
    this.revealSubitemsElement.innerText = ">";

    this.isAttached = false;

    this._subitemsCount = 0;
    this.subitemsCount = 0;

    this.displayName = "MediaView";
}


MediaView.prototype = {
    /**
     * @param {Node=} parentElement
     */            
    attach: function(parentElement)
    {
        console.assert(!this.isAttached, "shouldn't be attached", console.trace());
        
        console.log("MediaView.attach()...");

        this.cocoaObject.bindToObjectProperty("metaDictionary.title", this.nameElement, "innerText");

        console.log("... MediaView.attach() " + this.nameElement.innerText + this);

        this.cocoaObject.bindToObjectProperty("subitems.media.@count", this, "subitemsCount");

        this.element.appendChild(this.nameElement);
        this.element.appendChild(this.revealSubitemsElement);
        
        parentElement.appendChild(this.element);

        this.element.addEventListener('click', this.mouseClicked.bind(this), false);
        this.element.addEventListener('dblclick', this.mouseDoubleClicked.bind(this), false);

        this.isAttached = true;
    },
    detach: function()
    {
        console.log("MediaView.detach() " + this.nameElement.innerText);
        
        this.cocoaObject.unbindOfObjectProperty(this.nameElement, "innerText");
        this.cocoaObject.unbindOfObjectProperty(this, "subitemsCount");
        
        this.element.detach();
        this.isAttached = false;
    },

    /**
     * @type {number}
     */                
    _subitemsCount: 0,
    set subitemsCount(count){
        
        // Make sure if count is undef (which might be the case, especially
        // if one in the object of the binding is nil.
        // Default it to 0 instead of undefined.
        if (!count)
            count = 0;

        if (count > 0)
            this.revealSubitemsElement.removeClassName("hidden");
        else
            this.revealSubitemsElement.addClassName("hidden");
        this._subitemsCount = count;
        return 0;
    },
    get subitemsCount(){
        return this._subitemsCount;
    },

    /**
     * Event Handler
     * @param {Event} event
     */                    
    mouseClicked: function(event)
    {
        if (!this.parent)
            return;
        
        this.parent.select(this);
        event.stopPropagation();
    },

    /**
     * Event Handler
     * @param {Event} event
     */                        
    mouseDoubleClicked: function(event)
    {
        this.action();
    },

    /**
     * When double clicked
     */                            
    action: function()
    {
        if (this.subitemsCount > 0) {
            var listView = new MediaListView(this.cocoaObject);
            listView.showNavigationHeader = true;
            window.windowController.navigationController.push(listView);
        }
        else
            window.PlatformView.playCocoaObject(this.cocoaObject);        
    }
    
}