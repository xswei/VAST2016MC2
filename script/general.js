/*function renderGeneral(timeExtent, nameList) {
	var svg = d3.select("#svg_general");
	var width = svg.attr("width"),
		height = svg.attr("height"),
		margin = {
			top: 10,
			left: 30,
			right: 10,
			bottom: 10
		};
	var g_line = svg.append("g").attr("class", "g_line_general");
	var timeScale = d3.scaleTime()
		.domain(timeExtent)
		.range([margin.left, width - margin.right]);
	nameList = nameList || (function() {
		var temp = [];
		for (n in general[0].message) {
			if ((n != "Date/Time") && (n != "type")) {
				temp.push(n);
			}
		}
		return temp;
	}());
	var showList = [];
	for (var i = 0; i < nameList.length; ++i) {
		showList.push({
			"name": nameList[i],
			"extent": d3.extent(general, function(d) {
				return parseFloat(d.message[nameList[i]]);
			}),
			"color": d3.hsl(i * (360 / nameList.length), 0.6, 0.6).toString()
		})
	}
	console.log(showList);
	for (var i = 0; i < showList.length; ++i) {
		var scaleY = d3.scaleLinear()
			.domain(showList[i].extent)
			.range([height - margin.bottom, margin.top]);
		var line = d3.line()
			.x(function(d) {
				return timeScale(new Date(d["Date/Time"]));
			})
			.y(function(d) {
				return scaleY(d.value)
			})
		showList[i].scaleY = scaleY;
		showList[i].line = line;
		showList[i].dataset = general.map(function(d) {
			return {
				"Date/Time": d.message["Date/time"],
				"value": d.message[showList[i]]
			};
		})
	}
	g_line.selectAll("path").data(showList).enter()
		.append("path")
		.attr("d", function(d) {
			return d.line(d.dataset);
		})
		.attr("stroke", function(d) {
			return d.color;
		})
		.attr("fill", "none")
		.attr("stroke-width", 2)



	var canvas = document.getElementById('canvas_general');
	var context = canvas.getContext("2d"),
		width = canvas.width,
		height = canvas.height,
		margin = {
			top: 10,
			left: 30,
			right: 10,
			bottom: 10
		};
	context.clearRect(0, 0, width, height);
	context.rect(margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom);
	context.clip();
	var timeScale = d3.scaleTime()
		.domain(timeExtent)
		.range([margin.left, width - margin.right]);
	nameList = nameList || (function() {
		var temp = [];
		for (n in general[0].message) {
			if ((n != "Date/Time") && (n != "type")) {
				temp.push(n);
			}
		}
		return temp;
	}());
	var showList = [];
	for (var i = 0; i < nameList.length; ++i) {
		showList.push({
			"name": nameList[i],
			"extent": d3.extent(general, function(d) {
				return parseFloat(d.message[nameList[i]]);
			}),
			"color": d3.hsl(i * (360 / nameList.length), 0.6, 0.6).toString()
		})
	}
	console.log(showList);
	for (var i = 0; i < showList.length; ++i) {
		var scaleY = d3.scaleLinear()
			.domain(showList[i].extent)
			.range([height - margin.bottom, margin.top]);
		var line = d3.line()
			.x(function(d) {
				return timeScale(new Date(d.message["Date/Time"]));
			})
			.y(function(d) {
				return scaleY(d.message[showList[i].name])
			})
			.context(context);
		context.save();
		context.lineWidth = 0.5;
		context.strokeStyle = showList[i].color;
		context.beginPath();
		line(general);
		context.stroke();
		context.restore();
	}

}

function hideGeneralMenu() {
	d3.select("#menu_general").attr("onclick", "showGeneralMenu()");
	d3.select("#left_menu_general").style("display", "none");
	updateGeneralNums();
}

function showGeneralMenu() {
	var div = d3.select("#left_menu_general");
	d3.select("#menu_general").attr("onclick", "hideGeneralMenu()");
	div.style("display", "block");
	var box = document.getElementById("div_general").getBoundingClientRect();
	div.style("top", box.top + "px")
		.style("left", (box.left - 210) + "px")
}

function updateGeneralNums() {
	var updateNameList = [];
	d3.select("#left_menu_general").select("table").selectAll("input")
		.each(function() {
			if (this.checked) {
				updateNameList.push(d3.select(this).attr("name"));
			}
		})
	console.log(updateNameList);
	renderGeneral(options.currentTimeExtent, updateNameList)
}*/

function renderGeneral() {
	var svg = d3.select("#svg_general"),
		width = svg.attr("width"),
		height = svg.attr("height"),
		margin = margin = options.rightMargin;

	svg.selectAll("g").remove();

	var timeScale = options.rightTimeScale;
	var g_line = svg.append("g").attr("id", "general_line");

	for (var i = 0, len = options.general.nameList.length; i < len; ++i) {

		var detail = general.map(function(d) {
			return {
				"value": d.message[options.general.nameList[i].name],
				"time": d.message["Date/Time"]
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
		console.log('Rendering General');
		g_line.append("path")
			.data(detail).attr("d", line(detail))
			.attr("class", "right_line")
			.attr("opacity",i%10==0?1:0)
			.attr("stroke", options.general.nameList[i].color)
			.attr("id", options.general.nameList[i].name.replace(/\s/g, "_").replace(":", ""))
	}
}

function initGeneralTable() {
	options.general = {};
	options.general.nameList = [];
	for (n in general[0].message) {
		if ((n != "Date/Time") && (n != "type")) {
			options.general.nameList.push({
				"name": n
			});
		}
	}
	console.log(options);
	for (var i = 0, len = options.general.nameList.length; i < len; ++i) {
		options.general.nameList[i].color = d3.hsl(i * (360 / len), 0.6, 0.6).toString()
	}

	var table = d3.select("#left_menu_general").select("table");
	var tr = table.selectAll("tr").data(options.general.nameList)
		.enter().append("tr");
	tr.append("td").append("input")
		.attr("type", "checkbox")
		.attr("name", function(d) {
			return d.name;
		})
	tr.append("td").text(function(d) {
		return d.name;
	})
	renderGeneral();
}

function hideGeneralMenu() {
	d3.select("#menu_general").attr("onclick", "showGeneralMenu()");
	d3.select("#left_menu_general").style("display", "none");
	updateGeneralDisplay();
}

function showGeneralMenu() {
	var div = d3.select("#left_menu_general");
	d3.select("#menu_general").attr("onclick", "hideGeneralMenu()");
	div.style("display", "block");
	var box = document.getElementById("div_general").getBoundingClientRect();
	div.style("top", box.top + "px")
		.style("left", (box.left - 210) + "px")
}

function updateGeneralDisplay() {
	var displayName = [];
	d3.select("#left_menu_general").select("table").selectAll("input")
		.each(function(d) {
			if (!this.checked) {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_general").select("#general_line").select(selector)
					.attr("opacity", 0)
			} else {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_general").select("#general_line").select(selector)
					.attr("opacity", 1)
			}
		})
}