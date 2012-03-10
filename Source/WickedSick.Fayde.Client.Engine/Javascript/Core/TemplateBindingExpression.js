/// <reference path="../Runtime/Nullstone.js" />
/// <reference path="Expression.js"/>
/// CODE

//#region TemplateBindingExpression
var TemplateBindingExpression = Nullstone.Create("TemplateBindingExpression", Expression);

TemplateBindingExpression.Instance.Init = function (sourcePropd, targetPropd) {
    this.SourceProperty = sourcePropd;
    this.TargetProperty = targetPropd;
};

TemplateBindingExpression.Instance.GetValue = function (propd) {
    var source = this.Target.GetTemplateOwner();
    var value = null;
    if (source != null)
        value = source.GetValue(this.SourceProperty);
    return value; //TODO: Send through TypeConverter
};
TemplateBindingExpression.Instance._OnAttached = function (element) {
    this._OnAttached$super(element);

    this.Target = element;
    var listener = this.GetListener();
    if (listener != null) {
        listener.Detach();
        listener = null;
        this.SetListener(listener);
    }

    var c = Nullstone.As(this.Target, ContentControl);
    if (this.TargetProperty === ContentControl.ContentProperty && c != null) {
        this.SetsParent = c._ContentSetsParent;
        c._ContentSetsParent = false;
    }

    var source = this.Target.GetTemplateOwner();
    if (source != null) {
        listener = new PropertyChangedListener(source, this.SourceProperty, this, this.OnPropertyChanged);
        this.SetListener(listener);
    }
};
TemplateBindingExpression.Instance._OnDetached = function (element) {
    this._OnDetached$super(element);

    var listener = this.GetListener();
    if (listener == null)
        return;

    var c = Nullstone.As(this.Target, ContentControl);
    if (c != null)
        c._ContentSetsParent = this.SetsParent;

    listener.Detach();
    listener = null;
    this.SetListener(listener);
    this.Target = null;
};
TemplateBindingExpression.Instance.OnPropertyChanged = function (sender, args) {
    try {
        // Type converting doesn't happen for TemplateBindings
        this.SetUpdating(true);
        try {
            this.Target.SetValue(this.TargetProperty, this.GetValue(null));
        } catch (err2) {
            this.Target.SetValue(this.TargetProperty, this.TargetProperty.GetDefaultValue(this.Target));
        }
    } catch (err) {

    } finally {
        this.SetUpdating(false);
    }
};

TemplateBindingExpression.Instance.GetListener = function () {
    /// <returns type="PropertyChangedListener" />
    return this._Listener;
};
TemplateBindingExpression.Instance.SetListener = function (value) {
    /// <param name="value" type="PropertyChangedListener"></param>
    this._Listener = value;
};

Nullstone.FinishCreate(TemplateBindingExpression);
//#endregion