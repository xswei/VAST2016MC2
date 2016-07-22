/*function renderHaz(timeExtent, hazData) {
	var canvas = document.getElementById('canvas_haz');
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
	var timeScale = d3.scaleTime()
		.domain(timeExtent)
		.range([margin.left, width - margin.right]);
	hazData = hazData || [haz_f1z8a, haz_f2z2, haz_f3z1, haz_f2z4];
	context.rect(margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom);
	context.clip();
	var hazName = [];
	for (var i = 0; i < hazData.length; ++i) {
		for (n in hazData[i][0].message) {
			if (n.indexOf("F_") >= 0) {
				hazName.push(n);
				break;
			}
		}
	}
	console.log(hazName);
	for (var i = 0; i < hazData.length; ++i) {
		var scaleY = d3.scaleLinear()
			.domain(d3.extent(hazData[i], function(d) {
				return parseFloat(d.message[hazName[i]]);
			}))
			.range([height - margin.bottom, margin.top]);
		var line = d3.line()
			.x(function(d) {
				return timeScale(new Date(d.message["Date/Time"]));
			})
			.y(function(d) {
				return scaleY(d.message[hazName[i]])
			})
			.context(context);

		console.log(scaleY.domain());
		context.save();
		context.lineWidth = 1;
		context.strokeStyle = d3.hsl(i * (360 / hazName.length), 0.6, 0.6).toString();
		context.beginPath();
		line(hazData[i]);
		context.stroke();
		context.restore();
	}
}

function hideHazMenu() {
	d3.select("#menu_haz").attr("onclick", "showHazMenu()");
	d3.select("#left_menu_haz").style("display", "none");
	updateHazNums();
}

function showHazMenu() {
	var div = d3.select("#left_menu_haz");
	d3.select("#menu_haz").attr("onclick", "hideHazMenu()");
	div.style("display", "block");
	var box = document.getElementById("div_haz").getBoundingClientRect();
	div.style("top", box.top + "px")
		.style("left", (box.left - 210) + "px")
}

function updateHazNums() {
	var updateNameList = [];
	d3.select("#left_menu_haz").select("table").selectAll("input")
		.each(function() {
			if (this.checked) {
				updateNameList.push(d3.select(this).attr("name"));
			}
		})
	console.log(updateNameList);
	var data = [];
	for (var i = 0; i < updateNameList.length; ++i) {
		for (n in haz_f2z4[0].message) {
			if (n == updateNameList[i]) {
				data.push(haz_f2z4);
			}
		}
		for (n in haz_f3z1[0].message) {
			if (n == updateNameList[i]) {
				data.push(haz_f3z1);
			}
		}
		for (n in haz_f2z2[0].message) {
			if (n == updateNameList[i]) {
				data.push(haz_f2z2);
			}
		}
		for (n in haz_f1z8a[0].message) {
			if (n == updateNameList[i]) {
				data.push(haz_f1z8a);
			}
		}
	}
	renderHaz(options.currentTimeExtent, data);
}*/


function renderHaz() {
	var svg = d3.select("#svg_haz"),
		width = svg.attr("width"),
		height = svg.attr("height"),
		margin = options.rightMargin;


	var tempMarginBottom = margin.bottom + 20;
	svg.selectAll("g").remove();
	var timeScale = options.rightTimeScale;
	var axisX = d3.axisBottom(timeScale);
	var g_axis_y = svg.append("g").attr("class", "x_axis")
		.attr("transform", "translate(" + 0 + "," + (height - 25) + ")")
		.call(axisX);



	options.rightScale["haz"] = timeScale;

	var g_line = svg.append("g").attr("id", "haz_line");
	g_line.style("clip-path", "url(#clipPath_haz)")
	for (var i = 0, len = options.haz.nameList.length; i < len; ++i) {
		var detail = haz[options.haz.nameList[i].name].map(function(d) {
			var temp = {};
			for (n in d.message) {
				if (n.indexOf("F") >= 0) {
					temp.time = d.message["Date/Time"];
					temp.value = d.message[n];
				}
			}
			return temp;
		});
		var scaleY = d3.scaleLinear()
			.domain(d3.extent(detail, function(d) {
				return parseFloat(d.value)
			}))
			.range([height - tempMarginBottom, margin.top]);
		var line = d3.line()
			.x(function(d) {
				return timeScale(new Date(d.time));
			})
			.y(function(d) {
				return scaleY(d.value);
			})
		g_line.append("path")
			.data(detail).attr("d", line(detail))
			.attr("class", "right_line")
			.attr("stroke", options.haz.nameList[i].color)
			.attr("id", options.haz.nameList[i].name.replace(/\s/g, "_").replace(":", ""))
	}
}


function initHazTable() {
	options.haz = {};
	options.haz.nameList = [];
	for (n in haz) {
		options.haz.nameList.push({
			"name": n
		});
	}
	console.log(options);
	for (var i = 0, len = options.haz.nameList.length; i < len; ++i) {
		options.haz.nameList[i].color = d3.hsl(i * (360 / len), 0.6, 0.6).toString()
	}

	var table = d3.select("#left_menu_haz").select("table");
	var tr = table.selectAll("tr").data(options.haz.nameList)
		.enter().append("tr");
	tr.append("td").append("input")
		.attr("type", "checkbox")
		.attr("name", function(d) {
			return d.name;
		})
	tr.append("td").text(function(d) {
		return d.name;
	})
	renderHaz();
}

function hideHazMenu() {
	d3.select("#menu_haz").attr("onclick", "showHazMenu()");
	d3.select("#left_menu_haz").style("display", "none");
	updatehazDisplay();
}

function showHazMenu() {
	var div = d3.select("#left_menu_haz");
	d3.select("#menu_haz").attr("onclick", "hideHazMenu()");
	div.style("display", "block");
	var box = document.getElementById("div_haz").getBoundingClientRect();
	div.style("top", box.top + "px")
		.style("left", (box.left - 210) + "px")
}

function updatehazDisplay() {
	var displayName = [];
	d3.select("#left_menu_haz").select("table").selectAll("input")
		.each(function(d) {
			if (!this.checked) {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_haz").select("#haz_line").select(selector)
					.attr("opacity", 0)
			} else {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_haz").select("#haz_line").select(selector)
					.attr("opacity", 1)
			}
		})
}