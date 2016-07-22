function renderFloor3() {
	var nameList = [];
	var svg = d3.select("#svg_floor3"),
		width = svg.attr("width"),
		height = svg.attr("height"),
		margin = margin = options.rightMargin;


	svg.selectAll("g").remove();
	var timeScale = options.rightTimeScale;

	var g_line = svg.append("g").attr("id", "floor3_line");

	for (var i = 0, len = options.floor3.nameList.length; i < len; ++i) {

		var detail = floor3.map(function(d) {
			return {
				"value": d[options.floor3.nameList[i].name],
				"time": d["Date/Time"]
			}
		})
		var scaleY = d3.scaleLinear()
			.domain(d3.extent(detail, function(d) {
				return parseFloat(d.value)
			}))
			.range([height - margin.bottom, margin.top]);
		var line = d3.line()
			.x(function(d) {
				return timeScale(new Date(d.time));
			})
			.y(function(d) {
				return scaleY(d.value);
			})
		console.log('Rendering Floor3');
		g_line.append("path")
			.data(detail).attr("d", line(detail))
			.attr("class", "right_line")
			.attr("opacity",i%10==0?1:0)
			.attr("stroke", options.floor3.nameList[i].color)
			.attr("id", options.floor3.nameList[i].name.replace(/\s/g, "_").replace(":", ""))
	}
}

function initFloor3Table() {
	options.floor3 = {};
	options.floor3.nameList = [];
	for (n in floor3[0]) {
		if ((n != "Date/Time") && (n != "type")) {
			options.floor3.nameList.push({
				"name": n
			});
		}
	}
	for (var i = 0, len = options.floor3.nameList.length; i < len; ++i) {
		options.floor3.nameList[i].color = d3.hsl(i * (360 / len), 0.6, 0.6).toString()
	}
	var table = d3.select("#left_menu_floor3").select("table");
	var tr = table.selectAll("tr").data(options.floor3.nameList)
		.enter().append("tr");
	tr.append("td").append("input")
		.attr("type", "checkbox")
		.attr("name", function(d) {
			return d.name;
		})
	tr.append("td").text(function(d) {
		return d.name;
	})
	renderFloor3();
}

function hideFloor3Menu() {
	d3.select("#menu_floor3").attr("onclick", "showFloor3Menu()");
	d3.select("#left_menu_floor3").style("display", "none");
	updateFloor3Display();
}

function showFloor3Menu() {
	var div = d3.select("#left_menu_floor3");
	d3.select("#menu_floor3").attr("onclick", "hideFloor3Menu()");
	div.style("display", "block");
	var box = document.getElementById("div_floor3").getBoundingClientRect();
	div.style("top", box.top + "px")
		.style("left", (box.left - 210) + "px")
}

function updateFloor3Display() {
	var displayName = [];
	d3.select("#left_menu_floor3").select("table").selectAll("input")
		.each(function(d) {
			if (!this.checked) {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_floor3").select("#floor3_line").select(selector)
					.attr("opacity", 0)
			} else {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_floor3").select("#floor3_line").select(selector)
					.attr("opacity", 1)
			}
		})
}