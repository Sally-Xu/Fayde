/// <reference path="../../Runtime/Nullstone.js" />
/// <reference path="../../Core/FrameworkElementPropertyValueProvider.js"/>
/// CODE

//#region _TextBlockDynamicPropertyValueProvider
var _TextBlockDynamicPropertyValueProvider = Nullstone.Create("_TextBlockDynamicPropertyValueProvider", FrameworkElementPropertyValueProvider, 2);

_TextBlockDynamicPropertyValueProvider.Instance.Init = function (obj, propPrecedence) {
    this.Init$super(obj, propPrecedence);
    this._BaselineOffsetValue = null;
    this._TextValue = null;
};
_TextBlockDynamicPropertyValueProvider.Instance.GetPropertyValue = function (propd) {
    if (propd == TextBlock.BaselineOffsetProperty) {
        var layout = this._Object._Layout;
        if (layout == null)
            return 0;
        return layout.GetBaselineOffset();
    }
    return this.GetPropertyValue$super(propd);
};

Nullstone.FinishCreate(_TextBlockDynamicPropertyValueProvider);
//#endregion