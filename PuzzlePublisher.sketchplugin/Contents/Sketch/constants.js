const Constants = {
    DOCUMENT_VERSION: "docVersion",
    DOCUMENT_VERSION_PLACEHOLDER: "V_V_V",
    DOCUMENT_AUTHOR_NAME_PLACEHOLDER: "V_V_N",
    DOCUMENT_AUTHOR_EMAIL_PLACEHOLDER: "V_V_E",
    DOCUMENT_COMMENTS_URL_PLACEHOLDER: "V_V_C",
    TAB_SIZE: 2,
    HOTSPOT_PADDING: 0,
    LOGGING: false,
    SERVER_ANNOUNCE_SCRIPT: "announce.php",
    IMAGES_DIRECTORY: "images/",
    PREVIEWS_DIRECTORY: "previews/",
    FULLIMAGE_DIRECTORY: "full/",
    VIEWER_DIRECTORY: "viewer/",
    RESOURCES_DIRECTORY: "resources/",
    PLUGIN_IDENTIFIER: "com.cloudblue.sketch.exporter",
    TEMP_PAGE_PREFIX: "(temp)",
    SORT_RULE_X: 0,
    SORT_RULE_SKETCH: 1,
    SORT_RULE_REVERSIVE_SKETCH: 2,
    SORT_RULE_Y: 3,
    SORT_RULE_OPTIONS: ["Left-to-right", "Sketch default", "Reversive Sketch default", "Up-to-down"],
    FONT_SIZE_FORMAT_SKETCH: 0,
    FONTSIZE_FORMAT_OPTIONS: ["Sketch sizes", "Linux-specific sizes"],
    POSITION_DEFAULT: 0,
    POSITION_TOP: 1,
    POSITION_CENTER: 2,
    EXPORT_MODE_SELECTED_ARTBOARDS: 0,
    EXPORT_MODE_CURRENT_PAGE: 1,
    DEF_BACK_COLOR: "#646464",
    ICON_TAG: " ic-", // Use this string to find icon symbol
    //
    SITE_CHANGELOG_URL: "https://github.com/ingrammicro/puzzle-publisher/blob/master/CHANGELOG.md",
    //
    ASSETS_FOLDER_PREFIX: "_pt-assets",
    SYMBOLTOKENFILE_POSTFIX: "inspector.json",
    CSSFILE_POSTFIX: "viewer.css",
    VARSFILE_POSTFIX: "vars.json",
    ///
    INT_LAYER_NAME_BACKCOLOR: "@MainBackground@",
    INT_LAYER_NAME_SITEICON: "@SiteIcon@",
    INT_LAYER_NAME_SPACER_PART: "Spacer@",
    INT_LAYER_NAME_SPACER: "@Spacer@",
    INT_LAYER_NAME_XSPACER: "@XSpacer@",
    INT_LAYER_NAME_YSPACER: "@YSpacer@",
    INT_LAYER_NAME_REDIRECT: "@Redirect@",
    ARTBOARD_TYPE_REGULAR: 0,
    ARTBOARD_TYPE_MODAL: 1,
    ARTBOARD_TYPE_EXTERNAL_URL: 2,
    ARTBOARD_TYPE_OVERLAY: 3,
    //
    ARTBOARD_TRANS_ANIM_NONE: 0,
    ARTBOARD_TRANS_ANIM_SLIDEIN_UP: 1,
    ARTBOARD_TRANS_ANIM_SLIDEIN_LEFT: 2,
    ARTBOARD_TRANS_ANIM_FADE: 3,
    ARTBOARD_TRANS_ANIM_SLIDEIN_RIGHT: 4,
    ARTBOARD_TRANS_ANIM_SLIDEIN_DOWN: 5,
    //
    ARTBOARD_OVERLAY_BY_EVENT_CLICK: 0,
    ARTBOARD_OVERLAY_BY_EVENT_MOUSEOVER: 1,
    //
    ARTBOARD_OVERLAY_PIN_HOTSPOT: 0,
    ARTBOARD_OVERLAY_PIN_PAGE: 1,
    //
    ARTBOARD_OVERLAY_PIN_HOTSPOT_UNDER_LEFT: 0,
    ARTBOARD_OVERLAY_PIN_HOTSPOT_UNDER_CENTER: 1,
    ARTBOARD_OVERLAY_PIN_HOTSPOT_UNDER_RIGHT: 2,
    ARTBOARD_OVERLAY_PIN_HOTSPOT_TOP_LEFT: 3,
    ARTBOARD_OVERLAY_PIN_HOTSPOT_TOP_CENTER: 4,
    ARTBOARD_OVERLAY_PIN_HOTSPOT_TOP_RIGHT: 5,
    ARTBOARD_OVERLAY_PIN_HOTSPOT_BOTTOM_RIGHT: 6,
    ARTBOARD_OVERLAY_PIN_HOTSPOT_UP_CENTER: 7,
    //
    ARTBOARD_OVERLAY_PIN_PAGE_TOP_LEFT: 0,
    ARTBOARD_OVERLAY_PIN_PAGE_TOP_CENTER: 1,
    ARTBOARD_OVERLAY_PIN_PAGE_TOP_RIGHT: 2,
    ARTBOARD_OVERLAY_PIN_PAGE_BOTTOM_LEFT: 3,
    ARTBOARD_OVERLAY_PIN_PAGE_BOTTOM_CENTER: 4,
    ARTBOARD_OVERLAY_PIN_PAGE_BOTTOM_RIGHT: 5,
    ARTBOARD_OVERLAY_PIN_PAGE_CENTER: 6,
    //
    //
    OLD_ARTBOARD_OVERLAY_ALIGN_HOTSPOT_LEFT: 0,
    OLD_ARTBOARD_OVERLAY_ALIGN_HOTSPOT_CENTER: 1,
    OLD_ARTBOARD_OVERLAY_ALIGN_HOTSPOT_RIGHT: 2,
    OLD_ARTBOARD_OVERLAY_ALIGN_TOP_LEFT: 3,
    OLD_ARTBOARD_OVERLAY_ALIGN_TOP_CENTER: 4,
    OLD_ARTBOARD_OVERLAY_ALIGN_TOP_RIGHT: 5,
    OLD_ARTBOARD_OVERLAY_ALIGN_CENTER: 6,
    OLD_ARTBOARD_OVERLAY_ALIGN_BOTTOM_LEFT: 7,
    OLD_ARTBOARD_OVERLAY_ALIGN_BOTTOM_CENTER: 8,
    OLD_ARTBOARD_OVERLAY_ALIGN_BOTTOM_RIGHT: 9,
    OLD_ARTBOARD_OVERLAY_ALIGN_HOTSPOT_TOP_LEFT: 10,
    OLD_ARTBOARD_OVERLAY_ALIGN_HOTSPOT_TOP_CENTER: 11,
    OLD_ARTBOARD_OVERLAY_ALIGN_HOTSPOT_TOP_RIGHT: 12,
    OLD_ARTBOARD_OVERLAY_ALIGN_HOTSPOT_TOP_RIGHT_ALIGN_RIGHT: 13,

    LAYER_OVERLAY_DEFAULT: 0,
    LAYER_OVERLAY_TRANSP_TOP: 1,
    LAYER_OVERLAY_TRANSP_LEFT: 2,
    LAYER_OVERLAY_DIV: 3,
    //
    GA_ID: "UA-84277242-5"
};

const TRACK_INSTALLED = "installed"
const TRACK_STARTED = "started"
const TRACK_EXPORT_DIALOG_SHOWN = "export-dialog-shown"
const TRACK_EXPORT_DIALOG_CLOSED = "export-dialog-closed"  // cmd:ok,cancel
const TRACK_EXPORT_COMPLETED = "export-completed"
const TRACK_PUBLISH_DIALOG_SHOWN = "publish-dialog-shown"
const TRACK_PUBLISH_DIALOG_CLOSED = "publish-dialog-closed"  // cmd:ok,cancel
const TRACK_PUBLISH_COMPLETED = "publish-completed"
const TRACK_PUBLISH_MIRO_DIALOG_SHOWN = "publish-miro-dialog-shown"
const TRACK_PUBLISH_MIRO_DIALOG_CLOSED = "publish-miro-dialog-closed"  // cmd:ok,cancel
const TRACK_PUBLISH_MIRO_COMPLETED = "publish-miro-completed"


const PublishKeys = {
    SHOW_OUTPUT: false,
    TMP_FILE: "publish.sh",
    RESOURCES_FOLDER: "scripts",

}

const SettingKeys = {
    PLUGIN_INFO_11: "pluginShown11",

    PLUGIN_POSITION: "positon",
    PLUGIN_FILETYPE: "pluginFileType",
    PLUGIN_DONT_OPEN_BROWSER: "dontOpenBrowser",
    PLUGIN_COMPRESS: "pluginCompress",
    PLUGIN_DONT_RETINA_IMAGES: "dontRetinaImages",
    PLUGIN_DISABLE_ZOOM: "pluginDisableZoom",
    PLUGIN_COMMENTS_URL: "commentsURL",
    PLUGIN_GOOGLE_CODE: "googleCode",
    PLUGIN_EXPORT_JS_CODE: "pluginExportJSCode",
    PLUGIN_SERVERTOOLS_PATH: "pluginServerToolsPath",
    PLUGIN_AUTHOR_NAME: "pluginAuthorName",
    PLUGIN_AUTHOR_EMAIL: "pluginAuthorEmail",
    PLUGIN_EXPORT_MODE: "exportMode",
    PLUGIN_HIDE_NAV: "hideNavigation",
    PLUGIN_SORT_RULE: "pluginSortRule",
    PLUGIN_FONTSIZE_FORMAT: "PLUGIN_FONTSIZE_FORMAT",
    PLUGIN_DISABLE_HOTSPOTS: "pluginDisableHotspots",
    PLUGIN_ASK_CUSTOM_SIZE: "pluginAskCustomSize",
    PLUGIN_EXPORT_DISABLE_LIB_ARTBOARDS: "pluginAskCustomSize",
    PLUGIN_EXPORT_ELEMENTS: "PLUGIN_EXPORT_ELEMENTS",
    PLUGIN_PUBLISH_LOGIN: "publishLogin",
    PLUGIN_PUBLISH_SITEROOT: "publishSiteRoot",
    PLUGIN_PUBLISH_SECRET: "PLUGIN_PUBLISH_SECRET",
    PLUGIN_PUBLISH_SSH_PORT: "publishSSHPort",
    PLUGIN_EXPORTING_URL: "pluginExportingURL",
    PLUGIN_SHARE_IFRAME_SIZE: "pluginShareiFrameSize",
    PLUGIN_PUBLISH_MIRO_ENABLED: "PLUGIN_PUBLISH_MIRO_ENABLED",
    PLUGIN_INSTALLED: "pluginInstalled",
    PLUGIN_GA_DISABLED: "pluginGADisabled",
    PLUGIN_LOGDEBUG_ENABLED: "pluginLogDebugEnabled",

    ARTBOARD_TYPE: "artboardType",

    LEGACY_ARTBOARD_MODAL: "artboardOverlay", //legacy, replaced by ARTBOARD_TYPE
    LEGACY_ARTBOARD_MODAL_SHADOW: "artboardOverlayShadow", // replaced by  ARTBOARD_SHADOW, Outdated on 14 Frev 2018
    OLD_ARTBOARD_OVERLAY_ALIGN: "artboardOverlayPosition",


    ARTBOARD_SHADOW: "artboardShadow",
    ARTBOARD_DISABLE_AUTOSCROLL: "artboardDisableAutoScroll",
    ARTBOARD_TRANS_TO_NEXT_SECS: "artboardTransNextSecs",
    ARTBOARD_TRANS_ANIM_TYPE: "artboardTransAnimType",
    ARTBOARD_OVERLAY_BY_EVENT: "artboardOverlayByEvent",
    ARTBOARD_OVERLAY_PIN: "artboardOverlayPin",
    ARTBOARD_OVERLAY_PIN_HOTSPOT: "artboardOverlayPinHotspot",
    ARTBOARD_OVERLAY_PIN_PAGE: "artboardOverlayPinPage",
    ARTBOARD_OVERLAY_OVERFIXED: "artboardOverFixed",
    ARTBOARD_OVERLAY_ALSOFIXED: "artboardAlsoFixed",
    ARTBOARD_OVERLAY_CLOSE_PREVOVERLAY: "artboardClosePrevOverlay",

    DOC_EXPORTING_URL: "docExportingURL", // legacy, replaced by PLUGIN_EXPORTING_URL
    DOC_PUBLISH_MIRO_BOARD: "DOC_PUBLISH_MIRO_BOARD",
    DOC_PUBLISH_MIRO_BOARDID: "DOC_PUBLISH_MIRO_BOARDID",
    DOC_PUBLISH_COMPRESS: "docPublishCompress",
    DOC_DISABLE_FIXED_LAYERS: "docDisablFixedLayers",
    DOC_PUBLISH_VERSION: "mockupsVersion",
    DOC_PUBLISH_REMOTE_FOLDER: "remoteFolder",
    DOC_CUSTOM_HIDE_NAV: "docCustomHideNavigation",
    DOC_CUSTOM_SORT_RULE: "docCustomSortRule", // How to sort artboards
    DOC_CUSTOM_FONTSIZE_FORMAT: "DOC_CUSTOM_FONTSIZE_FORMAT", // How to show font size in Element Inspector
    DOC_BACK_COLOR: "docBackColor",
    DOC_SKIP_AUTOSYNC: "DOC_SKIP_AUTOSYNC",
    DOC_OWNER_NAME: "DOC_OWNER_NAME",
    DOC_OWNER_EMAIL: "DOC_OWNER_EMAIL",

    LAYER_ANNOTATIONS: "layerAnnotations",
    LAYER_OVERLAY_TYPE: "layerOverlayType",
    LAYER_DIV_ID: 'layerDivID',
    LAYER_EXTERNAL_LINK: "externalLink",
    LAYER_EXTERNAL_LINK_BLANKWIN: "layerNewWindow",
    LAYER_COMMENT: 'layerComment'
};

