function renderTrack() {
	var zones = [];
	var color = {
		"floor1": d3.hsl(0 * (360 / 3), 0.6, 0.6).toString(),
		"floor2": d3.hsl(1 * (360 / 3), 0.6, 0.6).toString(),
		"floor3": d3.hsl(2 * (360 / 3), 0.6, 0.6).toString(),
	}
	for (f in prox_zone) {
		var colorTemp = color[f];
		for (var i = 0; i < prox_zone[f].length; ++i) {
			zones.push({
				"floor": f,
				"zone": prox_zone[f][i].zone,
				"type": prox_zone[f][i].type,
				"zoneId": "f" + f[f.length - 1] + "z" + prox_zone[f][i].zone,
				"color": colorTemp
			})
		};
	}
	console.log(zones);
	for (var i = 0; i < proxList.length; ++i) {
		proxList[i].color = d3.hsl(i * (360 / proxList.length), 0.6, 0.6).toString(),
			proxList[i].track = prox_fixed[proxList[i].id]
	}
	console.log(proxList);
	var svg = d3.select("#svg_track"),
		width = svg.attr("width"),
		height = svg.attr("height"),
		margin = options.trackMargin;
	var scaleY = d3.scalePoint()
		.domain(zones.map(function(d) {
			return d.zoneId;
		}))
		.range([height - margin.bottom - 15, margin.top / 2])
	var axisY = d3.axisLeft(scaleY);
	var g_axis_y = svg.append("g").attr("class", "y_axis")
		.attr("transform", "translate(" + (margin.left) + "," + 0 + ")")
		.call(axisY)
		.selectAll("text")
	var timeScale = options.trackTimeScale;


	var axisX = d3.axisBottom(timeScale);
	var g_axis_y = svg.append("g").attr("class", "x_axis")
		.attr("transform", "translate(" + 0 + "," + (height - margin.bottom) + ")")
		.call(axisX);

	var g_track = svg.append("g").attr("class", "track");

	var brush = d3.brush()
		.extent([
			[options.trackMargin.left, 0],
			[width - options.trackMargin.left - options.trackMargin.right, height - options.trackMargin.bottom]
		])
		.on("end", brushed)

	g_track.call(brush)


	var track_width = scaleY.step() * 0.8;

	options.timeScale = timeScale;

	/*
	test
	 */
	g_track.style("clip-path", "url(#clipPath_track)")
	console.log(proxList);
	for (var i = 0; i < proxList.length; ++i) {
		var pathTemp = "";
		for (var j = 0, len = proxList[i].track.length; j < len; ++j) {
			var posX = timeScale(new Date(proxList[i].track[j][0])),
				posY = scaleY("f" + proxList[i].track[j][1] + "z" + proxList[i].track[j][2]);
			pathTemp += "M" + posX + " " + posY + "L" + (posX + 1) + " " + posY;
		}
		g_track.append("path").attr("stroke-width", track_width)
			.attr("stroke", proxList[i].color)
			.attr("fill", "none")
			.attr("d", pathTemp)
			.attr("id", proxList[i].id)
	}

}


function brushed() {
	var s = d3.event.selection;
	console.log(s);
	if (s == null) {
		options.currentTimeExtent = [new Date("2016-5-31"), new Date("2016-6-14")];
	} else {
		var startB = options.timeScale.invert(s[0][0]),
			endB = options.timeScale.invert(s[1][0]);
		options.currentTimeExtent = [startB, endB];
	}
		renderFloor1();
		renderFloor2();
		renderFloor3();
	var tempRange = options.rightTimeScale.range();
	options.rightTimeScale = d3.scaleTime().domain(options.currentTimeExtent)
		.range(tempRange);

	renderHaz();
	renderGeneral();

}



function filterProx(displayList,str) {
	console.log(displayList);
	var svg = d3.select("#svg_track");
	var g_tracks = svg.select(".track")
	svg.select("#abnormalList").remove();
	var g_abnormal = svg.append("g").attr("id","abnormalList").attr("transform","translate("+options.rightMargin.left+","+30+")");
	




	g_abnormal.append("text")
		.attr("x",20)
		.attr("y",0)
		.attr("fill","white")
		.attr("font-weight","bold")
		.text(str)

	g_abnormal.selectAll("text")
		.data(displayList).enter().append("text")
		.attr("x",20)
		.attr("y",function(d,i){
			return i*20;
		})
		.attr("fill","white")
		.attr("font-weight","bold")
		.text(function(d){
			return d;
		})





	g_tracks.selectAll("path")
		.attr("opacity", 0);
	for (var i = 0; i < displayList.length; ++i) {
		console.log(g_tracks.select("#" + displayList[i]));
		g_tracks.select("#" + displayList[i]).attr("opacity", 1);
	}
}