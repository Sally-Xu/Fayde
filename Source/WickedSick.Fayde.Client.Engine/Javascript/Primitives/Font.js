/// <reference path="../Runtime/Nullstone.js" />
/// CODE

//#region Font
var Font = Nullstone.Create("Font");

Font.Instance.Init = function () {
    this._Family = Font.DEFAULT_FAMILY;
    this._Stretch = Font.DEFAULT_STRETCH;
    this._Style = Font.DEFAULT_STYLE;
    this._Weight = Font.DEFAULT_WEIGHT;
    this._Size = Font.DEFAULT_SIZE;
};

Font.Instance.GetFamily = function () {
    return this._Family;
};
Font.Instance.SetFamily = function (value) {
    if (this._Family == value)
        return false;
    this._Family = value;
    this._PurgeCache();
    return true;
};

Font.Instance.GetStretch = function () {
    return this._Stretch;
};
Font.Instance.SetStretch = function (value) {
    if (this._Stretch == value)
        return false;
    this._Stretch = value;
    this._PurgeCache();
    return true;
};

Font.Instance.GetStyle = function () {
    return this._Style;
};
Font.Instance.SetStyle = function (value) {
    if (this._Style == value)
        return false;
    this._Style = value;
    this._PurgeCache();
    return true;
};

Font.Instance.GetWeight = function () {
    return this._Weight;
};
Font.Instance.SetWeight = function (value) {
    if (this._Weight == value)
        return false;
    this._Weight = value;
    this._PurgeCache();
    return true;
};

Font.Instance.GetSize = function () {
    return this._Size;
};
Font.Instance.SetSize = function (value) {
    if (this._Size == value)
        return false;
    this._Size = value;
    this._PurgeCache();
    return true;
};

Font.Instance.GetActualHeight = function () {
    return Surface._MeasureHeight(this);
};

Font.Instance._Descender = function () { return 0.0; }; //most likely removable
Font.Instance._Ascender = function () { return 0.0; }; //most likely removable
Font.Instance._PurgeCache = function () {
    this._CachedHeight = undefined;
};

Font.Instance._Translate = function () {
    var s = "";
    var style = this.GetStyle();
    var weight = this.GetWeight();
    if (style && style !== FontStyles.Normal)
        s += style.toString() + " ";
    if (weight && weight !== FontWeights.Normal)
        s += weight.toString() + " ";
    s += this.GetSize() + " ";
    s += this.GetFamily() + " ";
    return s;
};

Font.DEFAULT_FAMILY = "'Lucida Sans Unicode'";
Font.DEFAULT_STRETCH = FontStretches.Normal;
Font.DEFAULT_STYLE = FontStyles.Normal;
Font.DEFAULT_WEIGHT = FontWeights.Normal;
Font.DEFAULT_SIZE = "11px";

Nullstone.FinishCreate(Font);
//#endregion