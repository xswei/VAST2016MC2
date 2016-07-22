function renderFloor2() {
	var nameList = [];
	var svg = d3.select("#svg_floor2"),
		width = svg.attr("width"),
		height = svg.attr("height"),
		margin = margin = options.rightMargin;


	svg.selectAll("g").remove();
	var timeScale = options.rightTimeScale;

	var g_line = svg.append("g").attr("id", "floor2_line");

	for (var i = 0, len = options.floor2.nameList.length; i < len; ++i) {

		var detail = floor2.map(function(d) {
			return {
				"value": d[options.floor2.nameList[i].name],
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
		console.log('Rendering Floor2');
		g_line.append("path")
			.data(detail).attr("d", line(detail))
			.attr("class", "right_line")
			.attr("opacity",i%10==0?1:0)
			.attr("stroke", options.floor2.nameList[i].color)
			.attr("id", options.floor2.nameList[i].name.replace(/\s/g, "_").replace(":", ""))
	}
}

function initFloor2Table() {
	options.floor2 = {};
	options.floor2.nameList = [];
	for (n in floor2[0]) {
		if ((n != "Date/Time") && (n != "type")) {
			options.floor2.nameList.push({
				"name": n
			});
		}
	}
	for (var i = 0, len = options.floor2.nameList.length; i < len; ++i) {
		options.floor2.nameList[i].color = d3.hsl(i * (360 / len), 0.6, 0.6).toString()
	}
	var table = d3.select("#left_menu_floor2").select("table");
	var tr = table.selectAll("tr").data(options.floor2.nameList)
		.enter().append("tr");
	tr.append("td").append("input")
		.attr("type", "checkbox")
		.attr("name", function(d) {
			return d.name;
		})
	tr.append("td").text(function(d) {
		return d.name;
	})
	renderFloor2();
}

function hideFloor2Menu() {
	d3.select("#menu_floor2").attr("onclick", "showFloor2Menu()");
	d3.select("#left_menu_floor2").style("display", "none");
	updateFloor2Display();
}

function showFloor2Menu() {
	var div = d3.select("#left_menu_floor2");
	d3.select("#menu_floor2").attr("onclick", "hideFloor2Menu()");
	div.style("display", "block");
	var box = document.getElementById("div_floor2").getBoundingClientRect();
	div.style("top", box.top + "px")
		.style("left", (box.left - 210) + "px")
}

function updateFloor2Display() {
	var displayName = [];
	d3.select("#left_menu_floor2").select("table").selectAll("input")
		.each(function(d) {
			if (!this.checked) {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_floor2").select("#floor2_line").select(selector)
					.attr("opacity", 0)
			} else {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_floor2").select("#floor2_line").select(selector)
					.attr("opacity", 1)
			}
		})
}