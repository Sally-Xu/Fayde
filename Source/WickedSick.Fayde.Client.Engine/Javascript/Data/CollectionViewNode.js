/// <reference path="../Runtime/Nullstone.js" />
/// <reference path="PropertyPathNode.js"/>
/// CODE
/// <reference path="CurrentChangedListener.js"/>

//#region _CollectionViewNode
var _CollectionViewNode = Nullstone.Create("_CollectionViewNode", _PropertyPathNode, 3);

_CollectionViewNode.Instance.Init = function (bindsDirectlyToSource, bindToView, viewChanged) {
    this.Init$super();
    this.SetBindsDirectlyToSource(bindsDirectlyToSource === true);
    this.SetBindToView(bindToView === true);
    this.SetViewChangedHandler(this.ViewChanged);
};

_CollectionViewNode.Instance.OnSourceChanged = function (oldSource, newSource) {
    this.OnSourceChanged$super(oldSource, newSource);
    this.DisconnectViewHandlers();
    this.ConnectViewHandlers(Nullstone.As(newSource, CollectionViewSource), Nullstone.As(newSource, ICollectionView));
};
_CollectionViewNode.Instance.ViewChanged = function (sender, e) {
    this.DisconnectViewHandlers(true);
    this.ConnectViewHandlers(null, e.NewValue);
    this.ViewCurrentChanged(this, new EventArgs());
};
_CollectionViewNode.Instance.ViewCurrentChanged = function (sender, e) {
    this.UpdateValue();
    if (this.GetNext() != null)
        this.GetNext().SetSource(this.GetValue());
};
_CollectionViewNode.Instance.SetValue = function () {
    throw new NotImplementedException();
};
_CollectionViewNode.Instance.UpdateValue = function () {
    if (this.GetBindsDirectlyToSource()) {
        this.SetValueType(this.GetSource() == null ? null : this.GetSource().constructor);
        this._UpdateValueAndIsBroken(this.GetSource(), this._CheckIsBroken());
    } else {
        var usableSource = this.GetSource();
        var view = null;
        if (this.GetSource() instanceof CollectionViewSource) {
            usableSource = null;
            view = this.GetSource().GetView();
        } else if (this.GetSource().DoesImplement(ICollectionView)) {
            view = this.GetSource();
        }

        if (view == null) {
            this.SetValueType(usableSource == null ? null : usableSource.constructor);
            this._UpdateValueAndIsBroken(usableSource, this._CheckIsBroken());
        } else {
            if (this.GetBindToView()) {
                this.SetValueType(view.constructor);
                this._UpdateValueAndIsBroken(view, this._CheckIsBroken());
            } else {
                this.SetValueType(view.GetCurrentItem() == null ? null : view.GetCurrentItem().constructor);
                this._UpdateValueAndIsBroken(view.GetCurrentItem(), this._CheckIsBroken());
            }
        }
    }
};
_CollectionViewNode.Instance._CheckIsBroken = function () {
    return this.GetSource() == null;
};

_CollectionViewNode.Instance.ConnectViewHandlers = function (source, view) {
    /// <param name="source" type="CollectionViewSource"></param>
    /// <param name="view" type="ICollectionView"></param>
    if (source != null) {
        this._ViewPropertyListener = new PropertyChangedListener(source, source.constructor.ViewProperty, this, this.ViewChanged);
        view = source.GetView();
    }
    if (view != null)
        this._ViewListener = new CurrentChangedListener(view, this, this.ViewCurrentChanged);

};
_CollectionViewNode.Instance.DisconnectViewHandlers = function (onlyView) {
    /// <param name="onlyView" type="Boolean"></param>
    if (onlyView == null)
        onlyView = false;
    if (this._ViewPropertyListener != null && !onlyView) {
        this._ViewPropertyListener.Detach();
        this._ViewPropertyListener = null;
    }
    if (this._ViewListener != null) {
        this._ViewListener.Detach();
        this._ViewListener = null;
    }
};

//#region PROPERTIES

_CollectionViewNode.Instance.GetBindsDirectlyToSource = function () {
    /// <returns type="Boolean" />
    return this._BindsDirectlyToSource;
};
_CollectionViewNode.Instance.SetBindsDirectlyToSource = function (value) {
    /// <param name="value" type="Boolean"></param>
    this._BindsDirectlyToSource = value;
};

_CollectionViewNode.Instance.GetBindToView = function () {
    /// <returns type="Boolean" />
    return this._BindToView;
};
_CollectionViewNode.Instance.SetBindToView = function (value) {
    /// <param name="value" type="Boolean"></param>
    this._BindToView = value;
};

_CollectionViewNode.Instance.GetViewChangedHandler = function () {
    /// <returns type="Function" />
    return this._ViewChangedHandler;
};
_CollectionViewNode.Instance.SetViewChangedHandler = function (value) {
    /// <param name="value" type="Function"></param>
    this._ViewChangedHandler = value;
};

//#endregion

Nullstone.FinishCreate(_CollectionViewNode);
//#endregion