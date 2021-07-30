require([
		'underscore',
		'jquery',
		'splunkjs/mvc',
		'splunkjs/mvc/tableview',
		'splunkjs/mvc/simplexml/ready!'
	], function (_, $, mvc, TableView) {
	// Access the "default" token model
	var tokens = mvc.Components.get("default");
	var selected_values_array = [];
	var submittedTokens = mvc.Components.get('submitted');
	console.log("This is Multi-select table JS");
	// Custom renderer for applying checkbox.
	var CustomRenderer = TableView.BaseCellRenderer.extend({
			canRender: function (cell) {
				return _(['Select Sourcetype']).contains(cell.field);
			},
			render: function ($td, cell) {
				var a = $('<div>').attr({
						"id": "chk-sourcetype" + cell.value,
						"value": cell.value
					}).addClass('checkbox').click(function () {
						if ($(this).attr('class') === "checkbox") {
							selected_values_array.push($(this).attr('value'));
							$(this).removeClass();
							$(this).addClass("checkbox checked");
						} else {
							$(this).removeClass();
							$(this).addClass("checkbox");
							var i = selected_values_array.indexOf($(this).attr('value'));
							if (i != -1) {
								selected_values_array.splice(i, 1);
							}
						}
						console.log(selected_values_array);
					}).appendTo($td);
			}
		});

	//List of table ID
	var sh = mvc.Components.get("myTable");
	if (typeof(sh) != "undefined") {
		sh.getVisualization(function (tableView) {
			// Add custom cell renderer and force re-render
			tableView.table.addCellRenderer(new CustomRenderer());
			tableView.table.render();
		});
	}

	// Disabling button while search is running
	var mysearch = mvc.Components.get('mysearch');
	mysearch.on('search:start', function (properties) {
		$("#mybutton").attr('disabled', true);
	});

	mysearch.on('search:done', function (properties) {
		$("#mybutton").attr('disabled', false);
	});

	$(document).ready(function () {
		
		//setting up tokens with selected value.
		$("#mybutton").on("click", function (e) {
			e.preventDefault();
			tokens.set("mytoken", selected_values_array.join());
			submittedTokens.set(tokens.toJSON());
			$("#mybutton").attr('disabled', true);
		});
	});
});
