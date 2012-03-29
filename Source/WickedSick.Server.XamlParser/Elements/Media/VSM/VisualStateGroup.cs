﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WickedSick.Server.XamlParser.Elements.Media.VSM
{
    [Element]
    public class VisualStateGroup: DependencyObject
    {
        public static readonly PropertyDescription VisualStates = PropertyDescription.Register("VisualStates", typeof(IList<VisualState>), typeof(VisualStateGroup), true);
    }
}
