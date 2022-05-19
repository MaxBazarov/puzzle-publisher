const { off } = require("process")
@import("constants.js")
@import("lib/utils.js")
@import("exporter/PZDoc.js")

var Sketch = require('sketch/dom')
var Flow = require('sketch/dom').Flow
var Text = require('sketch/dom').Text
var Style = require('sketch/dom').Style

var LAYER_COUNTER = 0

var ResizingConstraint = {
    NONE: 0,
    RIGHT: 1 << 0,
    WIDTH: 1 << 1,
    LEFT: 1 << 2,
    BOTTOM: 1 << 3,
    HEIGHT: 1 << 4,
    TOP: 1 << 5
}

const ICON_TAG = " / ic-" // Use this string to find icon symbol

const alignMap2 = {
    [Text.Alignment.left]: "left",
    [Text.Alignment.center]: "center",
    [Text.Alignment.right]: "right",
    [Text.Alignment.justify]: "justify"
}
const vertAlignMap2 = {
    [Text.VerticalAlignment.top]: "top",
    [Text.VerticalAlignment.center]: "middle",
    [Text.VerticalAlignment.bottom]: "bottom",
}

const weights = [
    { label: 'thin', sketch: 2, css: 100, title: "Thin" },
    { label: 'extra-light', sketch: 3, css: 200, title: "Extra Light" },
    { label: 'light', sketch: 4, css: 300, title: "Light" },
    { label: 'regular', sketch: 5, css: 400, title: "Regular" },
    { label: 'medium', sketch: 6, css: 500, title: "Medium" },
    { label: 'semi-bold', sketch: 8, css: 600, title: "Semi Bold" },
    { label: 'semibold', sketch: 8, css: 600, title: "Semi Bold#2" },
    { label: 'bold', sketch: 9, css: 700, title: "Bold" },
    { label: 'extra-bold', sketch: 10, css: 800, title: "Extra Bold" },
    { label: 'black', sketch: 11, css: 900, title: "Black" },
    { label: 'black', sketch: 12, css: 900, title: "Black" },
    { label: 'solid', sketch: 14, css: 900, title: "Solid" },
]

class PZLayer
{

    // nlayer: ref to native MSLayer Layer
    // myParent: ref to parent MyLayer
    constructor(sLayer, myParent)
    {
        this.nlayer = sLayer.sketchObject
        this.name = sLayer.name
        this.parent = myParent
        this.objectID = String(sLayer.id)
        this.ii = LAYER_COUNTER++
        this.originalID = undefined
        this.slayer = sLayer
        this.artboard = myParent ? myParent.artboard : this
        this.isParentFixed = undefined != myParent && (myParent.isFixed || myParent.isParentFixed)

        // define type    
        this.isArtboard = false
        this.isGroup = false
        this.isSymbolInstance = false
        this.customLink = undefined
        this.isLink = false
        this.tp = undefined

        if ("Group" == sLayer.type || "Artboard" == sLayer.type) this.isGroup = true

        let symbolID = null
        let targetID = null


        //////////////////////////////////////////////////////// RESTORE SYMBOL INFO
        // find a symbol and flow information saved by sketchtool during --detach (see export.sh)
        if (this.isGroup && exporter.enabledJSON)
        {
            const info = this.nlayer.userInfo()
            if (null != info)
            {
                const detach = info['com.sketch.detach']
                if (detach && detach['symbolMaster']) symbolID = detach['symbolMaster']['symbolID']
            }
        }


        // save found symbol information
        const sSymbolMaster = symbolID ? pzDoc.getSymbolMasterByID(symbolID) : undefined
        if (sSymbolMaster)
        {
            // This layer is Symbol instance
            const smName = sSymbolMaster.name + ""

            if (smName.indexOf(ICON_TAG) > 0)
            {
                // Found Icon symbol instance
                this.tp = "Icon"
                function getLayerStyleName(layer)
                {
                    return layer && layer.isGroup && layer.styleName !== "" ? layer.styleName : undefined
                }
                this.styleName = getLayerStyleName(myParent) || getLayerStyleName(myParent.parent)

                this.smName = smName
                this.isGroup = false
                //
                if (exporter.enabledJSON)
                {
                    this.pr = this._buildIconsPropsForJSON()
                }
            } else
            {
                // Regular symbol instance
                this.isSymbolInstance = true
                this.targetId = targetID

                // prepare data for Element Inspector
                const lib = sSymbolMaster.getLibrary()
                this.smName = smName
                if (lib)
                {
                    this.sharedLib = lib.name
                    pzDoc.usedLibs[lib.name] = true
                } else
                {

                }
            }

        } else
        {
            // Check layer shared styles
            this.smName = undefined

            // prepare data for Element Inspector            
            var sharedStyle = this.slayer.sharedStyle
            if (sharedStyle)
            {
                this.styleName = sharedStyle.name
                const lib = sharedStyle.getLibrary()
                if (lib)
                {
                    this.sharedLib = lib.name
                    pzDoc.usedLibs[lib.name] = true
                }
            }
            if ("Text" == sLayer.type)
            {
                this.text = this.slayer.text + ""
            }
            this.cv = this._getColorVariable()
        }
        this.targetId = this.slayer.flow ? this.slayer.flow.targetId : null

        //////////////////////////////////////////////////////// Process artboard-special things
        if ("Artboard" == sLayer.type) this.isArtboard = true
        if (!this.isArtboard)
        {
            pzDoc.mAllLayers.push(this)


            // Check if this layer has a link
            if (this.targetId)
            {
                this.isLink = true
            } else
            {
                const externalLinkHref = exporter.Settings.layerSettingForKey(this.slayer, SettingKeys.LAYER_EXTERNAL_LINK)
                if (externalLinkHref != null && externalLinkHref != "" && externalLinkHref != "http://")
                {
                    this.externalLinkHref = externalLinkHref
                    this.isLink = true
                }
            }
            if (this.isLink)
            {
                pzDoc.mLinkedLayers.push(this)

            }

            // Check if this layer shadow will be used as artboard overlay shadow            
            if (Constants.ARTBOARD_TYPE_OVERLAY == this.artboard.artboardType)
            {
                if (this.slayer && this.slayer.style
                    && (
                        (this.slayer.style.shadows && this.slayer.style.shadows.length)
                        ||
                        (this.slayer.style.innerShadows && this.slayer.style.innerShadows.length)
                    )
                )
                {
                    this.artboard.shadowLayer = this
                }
            }

        }

        //////////////////////////////////////////////////////// COMMENT
        var comment = exporter.Settings.layerSettingForKey(this.slayer, SettingKeys.LAYER_COMMENT)
        if (undefined != comment && '' != comment)
        {
            this.comment = comment
        }

        //////////////////////////////////////////////////////// IMAGE MASKED
        if ("Image" == sLayer.type && this.nlayer.isMasked())
        {
            // sLayer.hidden = true
            this.isMasked = true
        }
        //////////////////////////////////////////////////////// EXPORTABLE LAYER
        else if ("Image" == sLayer.type || (("Group" == sLayer.type || "ShapePath" == sLayer.type) && undefined != sLayer.exportFormats && sLayer.exportFormats.length > 0))
        {
            this.artboard.addLayerAsExportableImage(this)
        }


        this.childs = []
        this.hotspots = []

        //////////////////////////////////////////////////////// RECALCULTE COORDS FROM ABS TO LOCAL
        this.frame = Utils.copyRectToRectangle(this.nlayer.absoluteRect())
        if (!this.isArtboard)
        {
            this.frame.x -= this.artboard.frame.x
            this.frame.y -= this.artboard.frame.y
        }

        //////////////////////////////////////////////////////// SAVE CONSTRAINS
        if (myParent != undefined) this.constrains = this._calculateConstrains()

        //////////////////////////////////////////////////////// LAYER IS SCROLLABLE CONTAINER        
        if (sLayer.type === "Group")
        {
            const vScrollType = Utils.getLayerSetting(sLayer, SettingKeys.LAYER_VSCROLL_TYPE, Constants.LAYER_VSCROLL_NONE)
            if (vScrollType !== Constants.LAYER_VSCROLL_NONE)
            {
                this.addSelfAsFixedLayerToArtboad(Constants.LAYER_OVERLAY_VSCROLL)
                this.vScrollType = vScrollType
            }
        }
        //////////////////////////////////////////////////////// OVERLAY & FIXED
        if (!this.isArtboard && !this.artboard.disableFixedLayers && !this.isParentFixed)
        {
            var overlayType = exporter.Settings.layerSettingForKey(this.slayer, SettingKeys.LAYER_OVERLAY_TYPE)
            if (undefined == overlayType || '' == overlayType)
                overlayType = Constants.LAYER_OVERLAY_DEFAULT

            if (this.nlayer.isFixedToViewport() || overlayType != Constants.LAYER_OVERLAY_DEFAULT)
            {
                this.addSelfAsFixedLayerToArtboad(overlayType)
            }
        }
        //////////////////////////////////////////////////////// LAYER PROVIDES PAGE BACKGROUND
        // check special internal properties
        // check: if this layer provides browser window background color
        if ("" == exporter.backColor)
        {
            while (true)
            {
                if (this.name.indexOf(Constants.INT_LAYER_NAME_BACKCOLOR) < 0) break
                let fills = this.slayer.style.fills
                if (undefined == fills) break
                fills = fills.filter(function (el) { return el.enabled })
                if (0 == fills.length) break
                exporter.backColor = fills[0].color
                break
            }
        }
        //////////////////////////////////////////////////////// LAYER PROVIDES FAVICON
        // check: if this layer provides browser favicon
        if (this.name.includes(Constants.INT_LAYER_NAME_SITEICON))
        {
            exporter.siteIconLayer = this
        }
        //////////////////////////////////////////////////////// LAYER IS SPACER
        // check: if this layer should be hiddden during export
        if (this.name.includes(Constants.INT_LAYER_NAME_SPACER_PART)
            && (
                this.name.includes(Constants.INT_LAYER_NAME_SPACER)
                || this.name.includes(Constants.INT_LAYER_NAME_XSPACER)
                || this.name.includes(Constants.INT_LAYER_NAME_YSPACER)
            ))
        {
            this.isSpacer = true
            this.slayer.hidden = true
        }

        //////////////////////////////////////////////////////// OVERLAY REDIRECT
        // check: if this layer contains special overlay
        if (!this.isArtboard && this.name.indexOf(Constants.INT_LAYER_NAME_REDIRECT) >= 0)
        {
            this.overlayRedirect = true
        }

        //////////////////////////////////////////////////////// ICON OR IMAAGE
        // checl if the layer is an image symbol name and we don't want to show the child parts
        if (this.isSymbolInstance && this.smName.startsWith("images/"))
        {
            this.isImageSymbol = true
        }

    }

    _calculateConstrains()
    {
        const resizingConstraint = 63 ^ this.nlayer.resizingConstraint()
        const res = {
            top: (resizingConstraint & ResizingConstraint.TOP) === ResizingConstraint.TOP,
            bottom: (resizingConstraint & ResizingConstraint.BOTTOM) === ResizingConstraint.BOTTOM,
            left: (resizingConstraint & ResizingConstraint.LEFT) === ResizingConstraint.LEFT,
            right: (resizingConstraint & ResizingConstraint.RIGHT) === ResizingConstraint.RIGHT,
            height: (resizingConstraint & ResizingConstraint.HEIGHT) === ResizingConstraint.HEIGHT,
            width: (resizingConstraint & ResizingConstraint.WIDTH) === ResizingConstraint.WIDTH
        }
        return res
    }

    collectAChilds(sLayers, space)
    {

        var aLayers = []
        if (undefined == sLayers)
        {
            exporter.logMsg("PZLayer:collectAChilds() empty sLayers. this.name=" + this.name)
        }
        for (const sl of sLayers.filter(l => !l.hidden || l.sketchObject.hasClippingMask()))
        {
            //            
            const al = new PZLayer(sl, this)
            if (al.isGroup && !this.isImageSymbol) al.childs = al.collectAChilds(sl.layers, space + " ")
            aLayers.push(al)
        }
        return aLayers
    }


    addSelfAsFixedLayerToArtboad(overlayType)
    {
        {
            const shadowType = exporter.Settings.layerSettingForKey(this.slayer, SettingKeys.LAYER_FIXED_SHADOW_TYPE)
            this.keepFixedShadow = shadowType != undefined && shadowType == 1
        }
        this.isFixed = true
        this.overlayType = overlayType
        this.fixedIndex = this.artboard.fixedLayers.length
        this.artboard.fixedLayers.push(this)
    }

    calculateFixedType()
    {
        let type = "";

        if (Constants.LAYER_OVERLAY_VSCROLL == this.overlayType)
        {
            type = 'vscroll'


        } else if (Constants.LAYER_OVERLAY_TRANSP_TOP == this.overlayType)
        {
            type = "top";
        } else if (Constants.LAYER_OVERLAY_TRANSP_LEFT == this.overlayType)
        {
            type = "left";
        } else
            type = "float"

        this.fixedType = type
        this.isFloat = type == 'float'
        if (type == 'vscroll') this.isVertScroll = type === 'vscroll'
    }

    findMaskLayer()
    {
        const layerIndex = this.parent.childs.indexOf(this)
        return this.parent.childs[layerIndex - 1]
    }


    buildLinks(space)
    {
        this._processHotspots(space)
    }

    getShadowInfo()
    {
        if (this.slayer.style == undefined || (this.slayer.style.shadows == undefined && this.slayer.style.innerShadows == undefined)) return undefined

        let shadowInfo = this.getShadowSetInfo(this.slayer.style.shadows, false) || this.getShadowSetInfo(this.slayer.style.innerShadows, true)
        return shadowInfo
    }


    getShadowSetInfo(shadows, inset)
    {
        if (!shadows) return

        let shadowInfo = undefined
        for (var shadow of shadows.filter(s => s.enabled))
        {
            let res = ""
            //if (res != "") res += ","
            if (inset) res += "inset "
            res += shadow.x + "px "

            if (null != shadow.y)
            {
                res += " " + shadow.y + "px"
                if (null != shadow.blur)
                {
                    res += " " + shadow.blur + "px"
                    if (null != shadow.spread)
                    {
                        res += " " + shadow.spread
                    }
                }
            }
            res += " " + shadow.color

            if (shadowInfo)
            {
                shadowInfo.style += ", " + res
            } else
            {
                shadowInfo = {
                    style: res,
                    x: shadow.x + shadow.blur ? shadow.blur : 0,
                    layer: this
                }
            }
        }
        return shadowInfo
    }

    _processHotspots(prefix)
    {
        const l = this
        const hotspots = []

        let finalHotspot = {
            r: this.frame.copy(),
            linkType: 'undefined',
            artboardID: null,
            target: null,
            overlayRedirect: this.overlayRedirect,
            ancestorFixed: null
        }
        let p = this
        while (!p.isArtboard)
        {
            if (p.nlayer.isFixedToViewport())
            {
                finalHotspot.fixedAncestorID = p.objectID
                break
            }
            p = p.parent
        }

        while (true)
        {

            // check link to external URL
            if (this.externalLinkHref != null)
            {
                const externalLink = {
                    'href': this.externalLinkHref,
                    'openNewWindow': exporter.Settings.layerSettingForKey(l.slayer, SettingKeys.LAYER_EXTERNAL_LINK_BLANKWIN) == 1

                }
                if (!this._specifyExternalURLHotspot(prefix + " ", finalHotspot, externalLink)) return
                break
            }

            // check native link
            if (null != l.targetId)
            {
                if (!this._specifyHotspot(prefix + " ", l, finalHotspot)) return
                break
            }

            // No any link on layer
            return
        }
        hotspots.push(finalHotspot);

        // finalization
        Array.prototype.push.apply(this.artboard.hotspots, hotspots);

        if (DEBUG) exporter.logMsg(prefix + "_processLayerLinks")
    }


    _specifyHotspot(prefix, l, finalHotspot)
    {
        const targetArtboardID = l.targetId;

        if (targetArtboardID == 'back')
        {
            // hande Back action
            finalHotspot.linkType = "back";
            if (DEBUG) exporter.logMsg(prefix + "hotspot: back")
        } else if (targetArtboardID != null && targetArtboardID != "" && targetArtboardID != "null")
        {
            // hande direct link
            let targetArtboard = pzDoc.findArtboardByID(targetArtboardID)

            if (!targetArtboard)
            {
                exporter.logWarning("Broken link to missed artboard on layer '" + l.name + "' on artboard '" + l.artboard.name + "' target=")
                return false
            }

            if (targetArtboard.externalArtboardURL != undefined)
            {
                const externalLink = {
                    'href': targetArtboard.externalArtboardURL,
                    'openNewWindow': exporter.Settings.layerSettingForKey(targetArtboard.slayer, SettingKeys.LAYER_EXTERNAL_LINK_BLANKWIN) == 1
                }
                finalHotspot.artboardID = targetArtboard.objectID
                this._specifyExternalURLHotspot(prefix + " ", finalHotspot, externalLink)
            } else
            {
                finalHotspot.linkType = "artboard";
                finalHotspot.artboardID = targetArtboardID;
                finalHotspot.href = Utils.toFilename(targetArtboard.name) + ".html";
            }

        } else
        {
            return false
        }
        return true
    }

    _specifyExternalURLHotspot(prefix, finalHotspot, externalLink)
    {
        if (DEBUG) exporter.logMsg(prefix + "_specifyExternalURLHotspothotspot: href")
        // found external link        
        var href = externalLink.href
        /*const regExp = new RegExp("^http(s?)://");
        if (!regExp.test(href.toLowerCase())) {
            href = "http://" + href;
        }*/
        const target = externalLink.openNewWindow ? "_blank" : null;

        finalHotspot.linkType = "href"
        finalHotspot.href = href
        finalHotspot.target = target

        return true
    }



    clearRefsBeforeJSON()
    {
        // need to cleanup temp object to allow dump it into JSON
        // but keep nlayer because Exporter.exportImage() needs it
        // 
        ///
        this.x = this.frame.x
        this.y = this.frame.y
        this.w = this.frame.width
        this.h = this.frame.height
        this.s = this.smName
        this.l = this.styleName
        this.b = this.sharedLib
        if (this.keepFixedShadow) this.ks = true
        if (this.childs.length) this.c = this.childs
        if (!this.tp) this.tp = this.isSymbolInstance ? "SI" : this.slayer.type
        if (!this.isSymbolInstance) this.n = this.name
        if (this.slayer.hidden) this.hd = true
        //
        if (this.tp == "Icon")
        {
            // this.pr is already enabled
        } else if ("Text" == this.slayer.type)
        {
            this.pr = this._buildTextPropsForJSON()
        } else if ("ShapePath" == this.slayer.type || "Shape" == this.slayer.type)
        {
            this.pr = this._buildShapePropsForJSON()
            this.tp = "ShapePath"
        } else if (this.isImageSymbol)
        {
            this.tp = "ImageSymbol"
            this.isImageSymbol = undefined
        } else if ("Image" == this.slayer.type)
        {
            if (this.isMasked)
            {
                this.hd = true
                this.isMasked = undefined
            } else
            {
                this.iu = this._buildImageURL()
            }
        } else if (this.isVertScroll !== undefined)
        {
            //this.tp = "Image"
            this.iu = this._buildImageURL()
            this.vst = this.vScrollType
            this.vScrollType = undefined
        } else if (undefined != this.imageIndex)
        {
            this.tp = "Image"
            this.iu = this._buildImageURL()
        }
        //
        this.name = undefined
        this.frame = undefined
        this.width = undefined
        this.height = undefined
        this.constrains = undefined
        this.smName = undefined
        this.styleName = undefined
        this.sharedLib = undefined
        this.text = undefined
        this.keepFixedShadow = undefined
        this.childs = undefined
        //
        this.tempOverrides = undefined
        this.slayer = undefined
        //l.nlayer = undefined
        this.customLink = undefined
        this.nlayer = undefined
        this.parent = undefined
        this.artboard = undefined
        this.objectID = undefined
        this.isParentFixed = undefined
        this.isArtboard = undefined
        this.isGroup = undefined
        this.isSymbolInstance = undefined
        this.isLink = undefined
        this.hotspots = undefined
        this.targetId = undefined
        this.imageIndex = undefined
        this.icpn = undefined
        this.icpi = undefined
    }

    _buildImageURL()
    {
        return Constants.IMAGES_DIRECTORY + Utils.toFilename(this.artboard.name, false) + "--" + this.imageIndex + "." + exporter.fileType;
    }

    _buildTextPropsForJSON()
    {
        this.tx = this.text
        //
        const pte = exporter.getTokensExporter()
        return pte._getTextStylePropsAsText(this.slayer.style)
    }

    _buildShapePropsForJSON()
    {
        const pte = exporter.getTokensExporter()
        return pte._getLayerStylePropsAsText(null, this.slayer, this.slayer.style)
    }

    _buildIconsPropsForJSON()
    {
        const pte = exporter.getTokensExporter()
        if (this.parent && this.parent.slayer && this.parent.slayer.style)
            return pte._getLayerStylePropsAsText(null, this.slayer, this.parent.slayer.style)
        else
            return undefined
    }
    _getColorVariable()
    {

        const style = this.slayer.style
        if (!style || !style.sketchObject.primitiveTextStyle()) return undefined

        // Try to find that color variables was used                
        var attributes = style.sketchObject.primitiveTextStyle().attributes()
        if (!attributes || !attributes.MSAttributedStringColorAttribute || !attributes.MSAttributedStringColorAttribute.swatchID) return undefined
        var swatchID = attributes.MSAttributedStringColorAttribute.swatchID()
        if (!swatchID) return undefined
        //
        var swatchInfo = pzDoc.getSwatchInfoByID(swatchID)
        return swatchInfo
    }

    _clearColor(color)
    {
        // drop FF transparency as default
        if (color.length == 9 && color.substring(7).toUpperCase() == "FF")
        {
            color = color.substring(0, 7)
        }
        return color.toUpperCase()
    }

    exportSiteIcon()
    {
        const nlayer = this.nlayer
        const layer = this

        const imageName = "icon.png"
        const imagePath = exporter._outputPath + "/resources/" + imageName;

        let slice = null

        slice = MSExportRequest.exportRequestsFromExportableLayer(nlayer).firstObject();

        slice.scale = 1;
        slice.saveForWeb = false;
        slice.format = "png";
        exporter.ndoc.saveArtboardOrSlice_toFile(slice, imagePath);

        /*const options = { 
            scales: [1],
            output: imagePath,
            overwriting: true,
            'save-for-web': true, 
            formats: 'png' 
        }
        Sketch.export(this.slayer, options)       */
    }

}
