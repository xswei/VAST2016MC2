function renderMoveTrack() {
	var svg = d3.select("#svg_activity"),
		width = svg.attr("width"),
		height = svg.attr("height");
	var color = {
		"floor1": d3.hsl(0 * (360 / 3), 1, 0.6).toString(),
		"floor2": d3.hsl(1 * (360 / 3), 1, 0.6).toString(),
		"floor3": d3.hsl(2 * (360 / 3), 1, 0.6).toString(),
	}
	var margin = {
		left: 50,
		top: (svg.attr("height") / 3) / 2,
		bottom: (svg.attr("height") / 3) / 2,
		right: 30
	};
	svg.append("g").attr("id", "move_animation")
	var g_zones = svg.append("g").attr("id", "move_zones");

	var zones = [];
	var maxZones = 0;
	for (f in prox_zone) {
		var colorTemp = color[f];
		maxZones = prox_zone[f].length > maxZones ? prox_zone[f].length : maxZones;
		for (var i = 0; i < prox_zone[f].length; ++i) {
			zones.push({
					"floor": f,
					"zone": prox_zone[f][i].zone,
					"type": prox_zone[f][i].type,
					"zoneId": "f" + f[f.length - 1] + "z" + prox_zone[f][i].zone,
					"color": colorTemp
				})
				//console.log(f + "----" + prox_zone[f][i].zone);
		};
	}
	/*console.log(zones);
	console.log(maxZones);*/

	var x_step = d3.scaleLinear().domain([1, maxZones])
		.range([margin.left, width / 2]),
		y_step = d3.scalePoint().domain(["floor3", "floor2", "floor1"])
		.range([margin.top, height - margin.bottom]);


	g_zones.selectAll("circle").data(zones).enter().append("circle")
		.attr("cx", function(d) {
			return x_step(d.zone);
		}).attr("cy", function(d) {
			return y_step(d.floor);
		}).attr("r", 5)
		.attr("fill", function(d) {
			return d.color;
		}).attr("id", function(d) {
			return d.zoneId;
		}).attr("stroke", "white")
		.attr("stroke-width", 1.5)
		.on("mouseover", function(d) {
			/*console.log("circle mouseover");
			console.log("zone tip");
			console.log(d);*/
			zonesTip(d);
		})
		.on("mouseout", function() {
			d3.select("#departmentTip").style("display", "none");
		})
		.on("click", function(d) {
			clickZone(d);
		})


	var tip = g_zones.append("g")
	tip.append("rect").attr("x", x_step(3) + (x_step(4) - x_step(3)) / 2)
		.attr("y", y_step("floor3") - (x_step(5) - x_step(4)))
		.attr("width", x_step(5) - x_step(4))
		.attr("height", y_step("floor1") - y_step("floor3") + (x_step(5) - x_step(4)) * 2)
		.attr("stroke", "#ccc")
		.attr("fill", "none")
		.attr("stroke-width", 0.5)
		.attr("stroke-dasharray", "2,2")
	tip.append("text")
		.attr("x", x_step(4))
		.attr("y", y_step("floor3") - (x_step(5) - x_step(4)))
		.attr("text-anchor", "middle")
		.attr("dy", "-.5em")
		.attr("fill", "white")
		.attr("font-size", 18)
		.attr("font-weight", "blod")
		.text("Ele/stairs")



	/*
	add cursor for each prox card
	*/
	for (n in prox_fixed) {
		prox_fixed[n].cursor = 0;
	}

	options.controlPos = d3.scaleLinear()
		.domain([Math.abs(x_step(1) - x_step(0)), Math.abs(x_step(maxZones) - x_step(0))])
		.range([Math.abs((x_step(1) - x_step(0)) / 2), Math.abs((margin.top < (x_step(1) - x_step(0)) / 2 ? (x_step(1) - x_step(0)) / 2 : margin.top) * 1)])

	options.zones = {};
	for (var i = 0; i < zones.length; ++i) {
		options.zones[zones[i].zoneId] = {};
		options.zones[zones[i].zoneId].prox_id = d3.set();
		options.zones[zones[i].zoneId].color = zones[i].color;
		options.zones[zones[i].zoneId].type = zones[i].type;
		options.zones[zones[i].zoneId].floor = zones[i].floor;
	}
	realTime();
}

function zonesTip(z) {
	console.log(z);
	var tip_div = d3.select("#departmentTip")
		.style("left", (d3.event.clientX + 15) + "px")
		.style("top", (d3.event.clientY + 15) + "px")
		.style("display", "block")
		.html("Floor:<span style='color:red;'>" + z.floor + "</span><br/>" + "Zone:<span style='color:red;'>" + z.zone + "</span><br/>" + "Zone type:<span style='color:red;'>" + z.type + "</span>");
}

function clickZone(z) {
	console.log(z);
	var g_line,
		floor = z.floor[z.floor.length - 1],
		zone = z.zoneId[z.zoneId.length - 1];
	if (z.floor == "floor1") {
		g_line = d3.select("#svg_floor1").select("#floor1_line");
	} else if (z.floor == "floor2") {
		g_line = d3.select("#svg_floor2").select("#floor2_line");
	} else {
		g_line = d3.select("#svg_floor3").select("#floor3_line");
	}
	g_line.selectAll("path").attr("opacity", 0);
	g_line.selectAll("path").filter(function(d) {
		return d3.select(this).attr("id").indexOf("F_" + floor + "_Z_" + zone) >= 0 ? true : false;
	}).attr("opacity", 0.8)
}