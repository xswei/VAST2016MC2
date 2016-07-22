/*function renderFloor(dataset, timeExtent, floor, needShowList) {

	var canvas = document.getElementById('canvas_floor' + floor);
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

	if (floor == 1) {
		context.rect(margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom);
		context.clip();
		needShowList = needShowList || (function() {
			var temp = [];
			for (n in dataset[0].message) {
				if ((n.indexOf("F_" + floor + "_Z") < 0) && (n.indexOf("F") >= 0)) {
					temp.push(n);
				}
			}
			return temp;
		}());

		console.log(needShowList);
		var showList = [];
		for (var i = 0; i < needShowList.length; ++i) {
			showList.push({
				"name": needShowList[i],
				"extent": d3.extent(dataset, function(d) {
					return parseFloat(d.message[needShowList[i]]);
				})
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
			context.strokeStyle = d3.hsl(i * (360 / showList.length), 0.6, 0.6).toString();
			context.beginPath();
			line(dataset);
			context.stroke();
			context.restore();
		}

	} else {
		context.rect(margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom);
		context.clip();
		needShowList = needShowList || (function() {
			var temp = [];
			for (n in dataset[0]) {
				if ((n.indexOf("F_" + floor + "_Z") < 0) && (n.indexOf("F") >= 0)) {
					temp.push(n);
				}
			}
			return temp;
		}());

		console.log(needShowList);
		var showList = [];
		for (var i = 0; i < needShowList.length; ++i) {
			showList.push({
				"name": needShowList[i],
				"extent": d3.extent(dataset, function(d) {
					return parseFloat(d[needShowList[i]]);
				})
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
					return scaleY(d[showList[i].name])
				})
				.context(context);
			context.save();
			context.lineWidth = 0.5;
			context.strokeStyle = d3.hsl(i * (360 / showList.length), 0.6, 0.6).toString();
			context.beginPath();
			line(dataset);
			context.stroke();
			context.restore();
		}

	}
}

function choseMenu(nameList, floor) {
	//var table = document.create

}*/


function renderFloor1() {
	var nameList = [];

	var svg = d3.select("#svg_floor1"),
		width = svg.attr("width"),
		height = svg.attr("height"),
		margin = options.rightMargin;

	svg.selectAll("g").remove();

	var timeScale = options.rightTimeScale;

	var g_line = svg.append("g").attr("id", "floor1_line");

	for (var i = 0, len = options.floor1.nameList.length; i < len; ++i) {

		var detail = floor1.map(function(d) {
			return {
				"value": d.message[options.floor1.nameList[i].name],
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
		console.log('Rendering Floor1');
		g_line.append("path")
			.data(detail).attr("d", line(detail))
			.attr("class", "right_line")
			.attr("opacity",i%10==0?1:0)
			.attr("stroke", options.floor1.nameList[i].color)
			.attr("id", options.floor1.nameList[i].name.replace(/\s/g, "_").replace(":", ""))
			//console.log(options.floor1.nameList[i].name.replace(/\s/g, "_").replace(":", ""));
	}
}

function initFloor1Table() {
	options.floor1 = {};
	options.floor1.nameList = [];
	for (n in floor1[0].message) {
		if ((n != "Date/Time") && (n != "type")) {
			options.floor1.nameList.push({
				"name": n
			});
		}
	}
	for (var i = 0, len = options.floor1.nameList.length; i < len; ++i) {
		options.floor1.nameList[i].color = d3.hsl(i * (360 / len), 0.6, 0.6).toString()
	}
	var table = d3.select("#left_menu_floor1").select("table");
	var tr = table.selectAll("tr").data(options.floor1.nameList)
		.enter().append("tr");
	tr.append("td").append("input")
		.attr("type", "checkbox")
		.attr("name", function(d) {
			return d.name;
		})
	tr.append("td").text(function(d) {
		return d.name;
	})
	renderFloor1();
}

function hideFloor1Menu() {
	d3.select("#menu_floor1").attr("onclick", "showFloor1Menu()");
	d3.select("#left_menu_floor1").style("display", "none");
	updateFloor1Display();
}

function showFloor1Menu() {
	var div = d3.select("#left_menu_floor1");
	d3.select("#menu_floor1").attr("onclick", "hideFloor1Menu()");
	div.style("display", "block");
	var box = document.getElementById("div_floor1").getBoundingClientRect();
	div.style("top", box.top + "px")
		.style("left", (box.left - 210) + "px")
}

function updateFloor1Display() {
	var displayName = [];
	d3.select("#left_menu_floor1").select("table").selectAll("input")
		.each(function(d) {
			if (!this.checked) {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_floor1").select("#floor1_line").select(selector)
					.attr("opacity", 0)
			} else {
				var selector = "#" + this.name.replace(/\s/g, "_").replace(":", "");
				d3.select("#svg_floor1").select("#floor1_line").select(selector)
					.attr("opacity", 1)
			}
		})
}