widgets = {}

// Register a widget; takes an object, the name (which must
// match the name used by the bounding box in the skeleton SVG)
// and a list of data sources that this widget depends on
function register_widget(widget, name, depends_on=[])
{
    widgets[name] = widget;
    depends_on.forEach(function(source)
    {
        var data_source = data_sources[source];
        data_source.deps.push(name);
    });
}
