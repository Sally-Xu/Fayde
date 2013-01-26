﻿using System;
using WickedSick.Server.XamlParser.Elements;

namespace WickedSick.Server.XamlParser.Elements.Shapes
{
    [Element(NullstoneNamespace = "Fayde.Shapes")]
    public enum PenLineJoin
    {
        Miter,
        Bevel,
        Round,
    }
}