/// <reference path="../Runtime/Nullstone.js" />
/// <reference path="PropertyValueProviders/PropertyValueProvider.js"/>
/// <reference path="../Primitives/Size.js"/>
/// CODE
/// <reference path="FrameworkElement.js"/>

//#region FrameworkElementPropertyValueProvider
var FrameworkElementPropertyValueProvider = Nullstone.Create("FrameworkElementPropertyValueProvider", _PropertyValueProvider, 2);

FrameworkElementPropertyValueProvider.Instance.Init = function (obj, propPrecedence) {
    this.Init$super(obj, propPrecedence, 0);
    this._ActualHeight = null;
    this._ActualWidth = null;
    this._Last = new Size(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
};

FrameworkElementPropertyValueProvider.Instance.GetPropertyValue = function (propd) {
    if (propd !== FrameworkElement.ActualHeightProperty && propd !== FrameworkElement.ActualWidthProperty)
        return undefined;

    var actual = this._Object._ComputeActualSize();
    if (!this._Last.Equals(actual)) {
        this._Last = actual;
        this._ActualHeight = actual.Height;
        this._ActualWidth = actual.Width;
    }

    if (propd === FrameworkElement.ActualHeightProperty) {
        return this._ActualHeight;
    } else {
        return this._ActualWidth;
    }
};

Nullstone.FinishCreate(FrameworkElementPropertyValueProvider);
//#endregion