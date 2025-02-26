@import("constants.js")
@import("lib/utils.js")
Sketch = require('sketch/dom')

var PZPage_touched = false

class PZPage {

    // spage: ref to Sketch Page
    constructor(sPage) {
        this.sPage = sPage
        this.mArtboards = []
    }

    collectData(sArtboards = null) {
        if (DEBUG) exporter.logMsg("PZPage.collectData() starting... name=" + (this.sPage ? this.sPage.name : ''))
        // 
        if (!sArtboards) sArtboards = this.sPage.layers

        // Run in sync mode, doesn't need Element Inspector data to be exported
        if (!exporter.enabledJSON) {
            // prepare layers for collecting
            exporter.logMsg("PZPage.collectData() preparing...")
            for (const sa of sArtboards) {
                if ("Artboard" != sa.type) continue
                if (exporter.filterAster && sa.name.indexOf("*") == 0) continue

                // special trick to add some data change event to Sketch as Undo point
                if (!PZPage_touched) {
                    sa.frame.y += 10
                    PZPage_touched = true
                }

                this._scanLayersToDetachSymbols(sa)
            }
        }

        // collect layers
        exporter.logMsg("PZPage.collectData() collecting...")
        this._collectArtboards(sArtboards)
        exporter.logMsg("PZPage.collectData() collected")

    }


    export() {
        for (const a of this.mArtboards) {
            a.export()
        }
        //// export itself
        if (this.sPage != null) {
            const data = {
                'id': String(this.sPage.id),
                name: this.sPage.name
            }
            exporter.storyData.groups.push(data)
        }
    }


    // return index of new artboard
    addArtboard(mArtboard) {
        this.mArtboards.push(mArtboard)
        mArtboard.index = pzDoc.addArtboard(mArtboard)
    }


    //////////////////////// PRIVATE FUNCTIONS //////////////////////////////////////

    _scanLayersToDetachSymbols(sParent) {
        if (DEBUG) exporter.logMsg("PZPage._scanLayersToDetachSymbols() runnning...name=" + (this.sPage ? this.sPage.name : ''))
        const nParent = sParent.sketchObject

        const symbolPredicate = NSPredicate.predicateWithFormat("className == %@", 'MSSymbolInstance');
        const symbolInstances = nParent.children().filteredArrayUsingPredicate_(symbolPredicate);

        symbolInstances.forEach(function (nl) {
            var sl = Sketch.fromNative(nl)
            sl = sl.detach({
                recursively: true
            })
            if (DEBUG) exporter.logMsg("PZPage._scanLayersToDetachSymbols() symbol:" + sl.name)
        }, this)

        if (DEBUG) exporter.logMsg("PZPage._scanLayersToDetachSymbols() completed")
    }

    _collectArtboards(sArtboards) {
        for (var sa of this._sortArtboards(sArtboards)) {
            if ("SymbolMaster" == sa.type) continue
            if ("Artboard" != sa.type) continue
            if (exporter.filterAster && sa.name.indexOf("*") == 0) continue
            const ma = new PZArtboard(sa)
            ma.collectLayers(' ')
            this.addArtboard(ma)
        }
    }


    // Resort artboards using configuration settings
    _sortArtboards(sSrcArtboards) {
        var sArtboards = sSrcArtboards.slice()
        if (Constants.SORT_RULE_X == exporter.sortRule) {
            sArtboards.sort((
                function (a, b) {
                    return a.frame.x != b.frame.x ? (a.frame.x - b.frame.x) : (a.frame.y - b.frame.y)
                }))
        } else if (Constants.SORT_RULE_Y == exporter.sortRule) {
            sArtboards.sort((
                function (a, b) {
                    return a.frame.y != b.frame.y ? (a.frame.y - b.frame.y) : (a.frame.x - b.frame.x)
                }))
        } else if (Constants.SORT_RULE_REVERSIVE_SKETCH == exporter.sortRule) {
            sArtboards = sArtboards.reverse()
        } else {
        }
        return sArtboards
    }


}
