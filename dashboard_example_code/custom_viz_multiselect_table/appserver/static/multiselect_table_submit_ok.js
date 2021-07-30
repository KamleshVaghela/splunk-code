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
				return _(['Select Number']).contains(cell.field);
			},
			render: function ($td, cell) {
				var cell_value = cell.value.split("|")[0];
				var ack_value = cell.value.split("|")[1];
				var ack_flag = ack_value !== "";
				console.log(cell.value,ack_flag,ack_value);
				var div = (ack_flag ? $('<div>') :$('<div>').attr({
						"id": "chk-number" + cell_value,
						"value": cell_value
					}).addClass('checkbox').click(function () {
						if ($(this).attr('class') === "checkbox") {
							selected_values_array.push($(this).attr('value'));
							$(this).removeClass();
							$(this).addClass("checkbox checked");
							console.log(selected_values_array);
						} else {
							$(this).removeClass();
							$(this).addClass("checkbox");
							var i = selected_values_array.indexOf($(this).attr('value'));
							if (i != -1) {
								selected_values_array.splice(i, 1);
							}
							console.log(selected_values_array);
						}
					}))
				var b = (ack_flag ? $td.addClass('range-cell').addClass('range-acked') : $td.addClass('range-cell').addClass('range-not-acked'));
				div.appendTo($td);
			}
		});

	//List of table ID
	var sh = mvc.Components.get("myTable");
	if (typeof(sh) != "undefined") {
		sh.getVisualization(function (tableView) {
			
			tableView.on('rendered', function() {
				console.log("Omnipay 1");
                // Apply class of the cells to the parent row in order to color the whole row
                tableView.$el.find('td.range-cell').each(function() {
                	console.log("Omnipay 2");
                	$(this).parents('tr').addClass(this.className);
                	console.log(this.className);
                });
                console.log("Omnipay 3");
            });

			// Add custom cell renderer and force re-render
			tableView.table.addCellRenderer(new CustomRenderer());
			tableView.table.render();
		});
	}

	// Disabling button while search is running
	var mysearch = mvc.Components.get('mysearch');
	var mainSearch = mvc.Components.get('mainSearch');
	
	mysearch.on('search:start', function (properties) {
		$("#mybutton").attr('disabled', true);
	});

	mysearch.on('search:done', function (properties) {
		$("#mybutton").attr('disabled', false);
		mainSearch.startSearch();
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