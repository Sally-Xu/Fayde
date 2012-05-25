﻿/// <reference path="../Core/DependencyObject.js"/>
/// CODE
/// <reference path="PathSegmentCollection.js"/>
/// <reference path="../Shapes/Enums.js"/>

//#region PathFigure
var PathFigure = Nullstone.Create("PathFigure", DependencyObject);

PathFigure.Instance.Init = function () {
    this.Init$DependencyObject();
    this._Path = null;
};

//#region Dependency Properties

PathFigure.IsClosedProperty = DependencyProperty.RegisterCore("IsClosed", function () { return Boolean; }, PathFigure, false);
PathFigure.SegmentsProperty = DependencyProperty.RegisterFull("Segments", function () { return PathSegmentCollection; }, PathFigure, null, { GetValue: function () { return new PathSegmentCollection(); } });
PathFigure.StartPointProperty = DependencyProperty.RegisterCore("StartPoint", function () { return Point; }, PathFigure, new Point());
PathFigure.IsFilledProperty = DependencyProperty.RegisterCore("IsFilled", function () { return Boolean; }, PathFigure, true);

Nullstone.AutoProperties(PathFigure, [
    PathFigure.IsClosedProperty,
    PathFigure.SegmentsProperty,
    PathFigure.StartPointProperty,
    PathFigure.IsFilledProperty
]);

//#endregion

PathFigure.Instance._OnPropertyChanged = function (args, error) {
    if (args.Property.OwnerType !== PathFigure) {
        this._OnPropertyChanged$DependencyObject(args, error);
        return;
    }
    this._Path = null;
    this.PropertyChanged.Raise(this, args);
};
PathFigure.Instance._OnCollectionChanged = function (sender, args) {
    if (!this._PropertyHasValueNoAutoCreate(PathFigure.SegmentsProperty, sender)) {
        this._OnCollectionChanged$DependencyObject(sender, args);
        return;
    }
    this._Path = null;
    var newArgs = {
        Property: PathFigure.SegmentsProperty,
        OldValue: null,
        NewValue: this._GetValue(PathFigure.SegmentsProperty)
    };
    this.PropertyChanged.Raise(this, newArgs);
};
PathFigure.Instance._OnCollectionItemChanged = function (sender, args) {
    if (!this._PropertyHasValueNoAutoCreate(PathFigure.SegmentsProperty, sender)) {
        this._OnCollectionItemChanged$DependencyObject(sender, args);
        return;
    }
    this._Path = null;
    var newArgs = {
        Property: PathFigure.SegmentsProperty,
        OldValue: null,
        NewValue: this._GetValue(PathFigure.SegmentsProperty)
    };
    this.PropertyChanged.Raise(this, newArgs);
};

PathFigure.Instance._Build = function () {
    this._Path = [];

    var start = this.StartPoint;
    this._Path.push({ type: PathEntryType.Move, x: start.X, y: start.Y });

    var segments = this.Segments;
    var count = segments.GetCount();
    for (var i = 0; i < count; i++) {
        var segment = segments[i];
        segment._Append(this._Path);
    }
    if (this.IsClosed)
        this._Path.push({ type: PathEntryType.Close });
};

Nullstone.FinishCreate(PathFigure);
//#endregion