﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WickedSick.Server.XamlParser.TypeConverters;

namespace WickedSick.Server.XamlParser.Elements
{
    [Element]
    public class Border : FrameworkElement
    {
        public static readonly PropertyDescription Background = PropertyDescription.Register("Background", typeof(Brush), typeof(Border));
        public static readonly PropertyDescription BorderBrush = PropertyDescription.Register("BorderBrush", typeof(Brush), typeof(Border));
        public static readonly PropertyDescription BorderThickness = PropertyDescription.Register("BorderThickness", typeof(Thickness), typeof(Border));
        public static readonly PropertyDescription CornerRadius = PropertyDescription.Register("CornerRadius", typeof(CornerRadius), typeof(Border));
        public static readonly PropertyDescription Child = PropertyDescription.Register("Child", typeof(UIElement), typeof(Border), true);
    }
}
