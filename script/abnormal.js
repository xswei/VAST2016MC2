function abnormal(time, p, other) {
	var m = options.currentTime.getMonth()+1,
		d = options.currentTime.getDate(),
		h = options.currentTime.getHours()<10?"0"+options.currentTime.getHours():options.currentTime.getHours(),
		mm = options.currentTime.getMinutes()<10?"0"+options.currentTime.getMinutes():options.currentTime.getMinutes();
	console.log("abnormal");
	console.log(time);
	console.log(p);
	console.log(other);
	var svg = d3.select("#svg_track");
	svg.select(".x_axis")
		.append("circle")
		.attr("cx", options.timeScale(time))
		.attr("cy", 3)
		.attr("r", 5)
		.attr("fill", "yellow")
		.on("click", function() {
			console.log('test');
			svg.select(".x_axis").selectAll("circle").attr("fill", "yellow");
			d3.select(this).attr("fill", "red");
			clickAbnormal(time, p, other,m+"-"+d+" "+h+":"+mm);
		})

}

function clickAbnormal(t, z, o,tttt) {
	//z
	/*options.timer.stop();
	if (!options.finished) {
		d3.select("#svg_activity").append("circle")
			.attr("cx", 20).attr("cy", 20)
			.attr("r", 8)
			.attr("stroke", "#ccc")
			.attr("fill", "black")
			.attr("stroke-width", 2)
			.attr("id", "start_stop")
			.on("click", function() {
				d3.select(this).transition()
					.duration(300)
					.attr("fill", "#ccc")
					.remove();
				options.timer.restart(update, 1000);
				var svg_activity = d3.select("#svg_activity"),
					svg_floor1 = d3.select("#svg_floor1"),
					svg_floor2 = d3.select("#svg_floor2"),
					svg_floor3 = d3.select("#svg_floor3"),
					svg_general = d3.select("#svg_general"),
					svg_haz = d3.select("#svg_haz");
				svg_activity.select("g.abnormal").remove();
				svg_floor1.select("g.abnormal").remove();
				svg_floor2.select("g.abnormal").remove();
				svg_floor3.select("g.abnormal").remove();
				svg_general.select("g.abnormal").remove();
				svg_haz.select("g.abnormal").remove();
			})

	}*/

	var svg_activity = d3.select("#svg_activity"),
		svg_floor1 = d3.select("#svg_floor1"),
		svg_floor2 = d3.select("#svg_floor2"),
		svg_floor3 = d3.select("#svg_floor3"),
		svg_general = d3.select("#svg_general"),
		svg_haz = d3.select("#svg_haz");
	svg_activity.select("g.abnormal").remove();
	svg_floor1.select("g.abnormal").remove();
	svg_floor2.select("g.abnormal").remove();
	svg_floor3.select("g.abnormal").remove();
	svg_general.select("g.abnormal").remove();
	svg_haz.select("g.abnormal").remove();

	var g_activity = svg_activity.append("g").attr("class", "abnormal"),
		g_floor1 = svg_floor1.append("g").attr("class", "abnormal"),
		g_floor2 = svg_floor2.append("g").attr("class", "abnormal"),
		g_floor3 = svg_floor3.append("g").attr("class", "abnormal"),
		g_general = svg_general.append("g").attr("class", "abnormal"),
		g_haz = svg_haz.append("g").attr("class", "abnormal");

	g_general.append("line")
		.attr("x1", options.rightTimeScale(t))
		.attr("y1", 0)
		.attr("x2", options.rightTimeScale(t))
		.attr("y2", svg_general.attr("height"))
		.attr("class", "abnormal_tip_line")
	g_haz.append("line")
		.attr("x1", options.rightTimeScale(t))
		.attr("y1", 0)
		.attr("x2", options.rightTimeScale(t))
		.attr("y2", svg_haz.attr("height"))
		.attr("class", "abnormal_tip_line")
	g_floor1.append("line")
		.attr("x1", options.rightTimeScale(t))
		.attr("y1", 0)
		.attr("x2", options.rightTimeScale(t))
		.attr("y2", svg_floor1.attr("height"))
		.attr("class", "abnormal_tip_line")
	g_floor2.append("line")
		.attr("x1", options.rightTimeScale(t))
		.attr("y1", 0)
		.attr("x2", options.rightTimeScale(t))
		.attr("y2", svg_floor2.attr("height"))
		.attr("class", "abnormal_tip_line")
	g_floor3.append("line")
		.attr("x1", options.rightTimeScale(t))
		.attr("y1", 0)
		.attr("x2", options.rightTimeScale(t))
		.attr("y2", svg_floor3.attr("height"))
		.attr("class", "abnormal_tip_line")

	var svg_activity_zones = svg_activity.select("#move_zones");
	svg_activity_zones.selectAll("circle").classed("zone_selected", false);
	svg_activity_zones.select("#" + z.split("_")[0]).classed("zone_selected", true);
	svg_activity_zones.select("#" + z.split("_")[1]).classed("zone_selected", true);

	var animation_g = svg_activity.select("#move_animation");
	var fromPos = [parseFloat(svg_activity_zones.select("#" + z.split("_")[0]).attr("cx")), parseFloat(svg_activity_zones.select("#" + z.split("_")[0]).attr("cy"))],
		toPos = [parseFloat(svg_activity_zones.select("#" + z.split("_")[1]).attr("cx")), parseFloat(svg_activity_zones.select("#" + z.split("_")[1]).attr("cy"))];

	animation_g.selectAll(".abnormal_line").remove();


	if (fromPos[0] != toPos[0]) {
		var c1 = [fromPos[0], (fromPos[1] + toPos[1]) / 2],
			c2 = [toPos[0], (fromPos[1] + toPos[1]) / 2];
		animation_g.append("path")
			.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "C" + c1[0] + " " + c1[1] + "," + c2[0] + " " + c2[1] + "," + toPos[0] + " " + toPos[1])
			.attr("fill", "none")
			.attr("opacity", 1)
			.attr("stroke", "yellow")
			.attr("class", "abnormal_line")
			.attr("stroke-width", 3)
			.attr("stroke-dasharray", function() {
				return this.getTotalLength();
			})
			.attr("stroke-dashoffset", function() {
				return this.getTotalLength();
			})
			.transition()
			.duration(500)
			.attr("stroke-dashoffset", 0)
	} else {
		var c = [fromPos[0] - (Math.abs(fromPos[1] - toPos[1])) / 4, (fromPos[1] + toPos[1]) / 2];
		animation_g.append("path")
			.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "Q" + c[0] + " " + c[1] + "," + toPos[0] + " " + toPos[1])
			.attr("fill", "none")
			.attr("opacity", 1)
			.attr("stroke", "yellow")
			.attr("class", "abnormal_line")
			.attr("stroke-width", 3)
			.attr("stroke-dasharray", function() {
				return this.getTotalLength();
			})
			.attr("stroke-dashoffset", function() {
				return this.getTotalLength();
			})
			.transition()
			.duration(500)
			.attr("stroke-dashoffset", 0)
	}
	

	filterProx(o.prox.values(),tttt);
}