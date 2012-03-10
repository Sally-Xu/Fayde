/// <reference path="../Runtime/Nullstone.js" />
/// <reference path="TextElement.js"/>
/// CODE

//#region Inline
var Inline = Nullstone.Create("Inline", TextElement);

Inline.Instance.Init = function () {
    this.Init$super();
    this._Autogen = false;
};

Inline.Instance.Equals = function (inline) {
    /// <returns type="Boolean" />
    if (this.GetFontFamily() != inline.GetFontFamily())
        return false;
    if (this.GetFontSize() != inline.GetFontSize())
        return false;
    if (this.GetFontStyle() != inline.GetFontStyle())
        return false;
    if (this.GetFontWeight() != inline.GetFontWeight())
        return false;
    if (this.GetFontStretch() != inline.GetFontStretch())
        return false;
    if (this.GetTextDecorations() != inline.GetTextDecorations())
        return false;
    if (this.GetForeground() != inline.GetForeground()) //TODO: Equals?
        return false;
    return true;
};

Inline.Instance._GetAutogenerated = function () {
    /// <returns type="Boolean" />
    return this._Autogen;
};
Inline.Instance._SetAutogenerated = function (value) {
    /// <param name="value" type="Boolean"></param>
    this._Autogen = value;
};

Nullstone.FinishCreate(Inline);
//#endregion