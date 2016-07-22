function realTime() {

	options.timer = d3.interval(update, 1000);

}

function update() {
	//console.log("update");

	options.currentTime = new Date(options.currentTime.getTime() + options.speed * 60000);
	if (options.currentTime > (new Date("2016-06-14"))) {
		console.log("stop");
		options.finished = true;
		options.timer.stop();
	}
	getMovePaths();
	updateClipPath();
}

function updateClipPath() {
	var rightWidth = options.rightTimeScale(options.currentTime) - options.rightMargin.left;
	var trackWidth = options.trackTimeScale(options.currentTime) - options.trackMargin.left;

	var tempWidth = rightWidth > (options.rightWidth - options.rightMargin.left - options.rightMargin.right) ? (options.rightWidth - options.rightMargin.left - options.rightMargin.right) : rightWidth;
	d3.select("#clipPath_track").select("rect").attr("width", trackWidth);
	d3.select("#clipPath_floor1").select("rect").attr("width", tempWidth);
	d3.select("#clipPath_floor2").select("rect").attr("width", tempWidth);
	d3.select("#clipPath_floor3").select("rect").attr("width", tempWidth);
	d3.select("#clipPath_general").select("rect").attr("width", tempWidth);
	d3.select("#clipPath_haz").select("rect").attr("width", tempWidth);
}

function getMovePaths() {
	var moves = {},
		moveSet = d3.set();
	for (n in prox_fixed) {
		for (var i = prox_fixed[n].cursor, len = [prox_fixed[n].length] - 1; i < len; ++i) {
			var timeTemp = new Date(prox_fixed[n][i][0]);
			if (timeTemp > options.currentTime) {
				prox_fixed[n].cursor = i;
				break;
			} else {
				var tempPath = "f" + prox_fixed[n][i][1] + "z" + prox_fixed[n][i][2] + "_" + "f" + prox_fixed[n][i + 1][1] + "z" + prox_fixed[n][i + 1][2];
				if (moveSet.has(tempPath)) {
					moves[tempPath].nums++;
					moves[tempPath].prox.add(n)
				} else {
					moveSet.add(tempPath);
					moves[tempPath] = {};
					moves[tempPath].nums = 1;
					moves[tempPath].prox = d3.set();
					moves[tempPath].prox.add(n);
				}
			}
		}
	}
	//console.log(moves);
	animation(moves);
}

function animation(moves) {
	var svg = d3.select("#svg_activity"),
		zones_g = svg.select("#move_zones"),
		animation_g = svg.select("#move_animation");

	//console.log(moves);
	var movesTmp = [];
	for (m in moves) {
		movesTmp.push(moves[m])
	}
	var lineWidthScale = d3.scaleLinear()
		.domain(d3.extent(movesTmp, function(d) {
			return d.nums;
		}))
		.range([0.5, 3])

	for (m in moves) {

		var fromZoneId = m.split("_")[0],
			toZoneId = m.split("_")[1],

			fromFloor = fromZoneId[1],
			toFloor = toZoneId[1],

			fromZone = fromZoneId[3],
			toZone = toZoneId[3],

			fromPos = [parseFloat(zones_g.select("#" + fromZoneId).attr("cx")), parseFloat(zones_g.select("#" + fromZoneId).attr("cy"))],
			toPos = [parseFloat(zones_g.select("#" + toZoneId).attr("cx")), parseFloat(zones_g.select("#" + toZoneId).attr("cy"))],

			fromColor = zones_g.select("#" + fromZoneId).attr("fill"),
			toColor = zones_g.select("#" + toZoneId).attr("fill");

		//console.log(m);
		//console.log(moves[m]);
		var proxs = moves[m].prox.values();
		for (var j = 0; j < proxs.length; ++j) {
			options.zones[fromZoneId].prox_id.add(proxs[j]);
			options.zones[toZoneId].prox_id.add(proxs[j]);
		}

		zones_g.select("#" + fromZoneId)
			.transition()
			.duration(2000)
			.attr("r", options.zoneSizeScale(options.zones[fromZoneId].prox_id.values().length));


		if (fromFloor == toFloor) {
			/*
			move in same floor
			*/
			if (fromZone < toZone) {
				/*
				left to right
				*/
				var c = [(fromPos[0] + toPos[0]) / 2, fromPos[1] - (options.controlPos(Math.abs(toPos[0] - fromPos[0])))];
				animation_g.append("path")
					.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "Q" + c[0] + " " + c[1] + "," + toPos[0] + " " + toPos[1])
					.attr("fill", "none")
					.attr("stroke", "#ccc")
					//.attr("stroke", fromColor)
					.attr("opacity", 1)
					.attr("stroke-width", lineWidthScale(moves[m].nums))
					.attr("stroke-dasharray", function() {
						return this.getTotalLength();
					})
					.attr("stroke-dashoffset", function() {
						return this.getTotalLength();
					})
					.transition()
					.duration(2000)
					//.attr("stroke", toColor)
					.attr("stroke-dashoffset", 0)
					.attr("opacity", 0.5)
					.transition()
					.duration(2000)
					.attr("opacity", 0)
					.remove()
					.remove()


				//console.log(p.node().getTotalLength());

			} else if (fromZone > toZone) {
				/*
				right to left
				*/
				var c = [(fromPos[0] + toPos[0]) / 2, fromPos[1] + (options.controlPos(Math.abs(fromPos[0] - toPos[0])))];
				animation_g.append("path")
					.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "Q" + c[0] + " " + c[1] + "," + toPos[0] + " " + toPos[1])
					.attr("fill", "none")
					.attr("stroke", "#ccc")
					//.attr("stroke", fromColor)
					.attr("opacity", 1)
					.attr("stroke-width", lineWidthScale(moves[m].nums))
					.attr("stroke-dasharray", function() {
						return this.getTotalLength();
					})
					.attr("stroke-dashoffset", function() {
						return this.getTotalLength();
					})
					.transition()
					.duration(2000)
					//.attr("stroke", toColor)
					.attr("opacity", 0.5)
					.attr("stroke-dashoffset", 0)
					.transition()
					.duration(1000)
					.attr("opacity", 0)
					.remove()
			}
		} else {
			/*
			through different floor
			*/
			if (fromFloor != 2 && toFloor != 2) {
				//console.log(m);
			}
			if (fromZone == "4" && toZone == "4") {
				/*
					cross  Ele/stairs
				*/
				if (fromPos[1] > toPos[1]) {
					//up
					var c = [fromPos[0] + (Math.abs(fromPos[1] - toPos[1])) / 4, (fromPos[1] + toPos[1]) / 2];
					animation_g.append("path")
						.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "Q" + c[0] + " " + c[1] + "," + toPos[0] + " " + toPos[1])
						.attr("fill", "none")
						.attr("stroke", fromColor)
						.attr("opacity", 1)
						.attr("stroke-width", lineWidthScale(moves[m].nums))
						.attr("stroke-dasharray", function() {
							return this.getTotalLength();
						})
						.attr("stroke-dashoffset", function() {
							return this.getTotalLength();
						})
						.transition()
						.duration(2000)

					.attr("opacity", 0.5)
						.attr("stroke-dashoffset", 0)
						.transition()
						.duration(1000)
						.attr("opacity", 0).attr("stroke", toColor)
						.remove()

				} else if (fromPos[1] < toPos[1]) {
					//down
					var c = [fromPos[0] - (Math.abs(fromPos[1] - toPos[1])) / 4, (fromPos[1] + toPos[1]) / 2];
					animation_g.append("path")
						.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "Q" + c[0] + " " + c[1] + "," + toPos[0] + " " + toPos[1])
						.attr("fill", "none")
						.attr("stroke", fromColor)
						.attr("opacity", 1)
						.attr("stroke-width", lineWidthScale(moves[m].nums))
						.attr("stroke-dasharray", function() {
							return this.getTotalLength();
						})
						.attr("stroke-dashoffset", function() {
							return this.getTotalLength();
						})
						.transition()
						.duration(2000)

					.attr("opacity", 0.5)
						.attr("stroke-dashoffset", 0)
						.transition()
						.duration(1000)
						.attr("opacity", 0).attr("stroke", toColor)
						.remove()
				}
			} else {
				/*
					abnormal track
				*/
				//console.log(m);
				abnormal(options.currentTime, m, moves[m]);
				if (fromPos[0] != toPos[0]) {
					var c1 = [fromPos[0], (fromPos[1] + toPos[1]) / 2],
						c2 = [toPos[0], (fromPos[1] + toPos[1]) / 2];
					animation_g.append("path")
						.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "C" + c1[0] + " " + c1[1] + "," + c2[0] + " " + c2[1] + "," + toPos[0] + " " + toPos[1])
						.attr("fill", "none")
						.attr("opacity", 1)
						.attr("stroke", "yellow")
						.attr("stroke-width", 3)
						.attr("stroke-dasharray", function() {
							return this.getTotalLength();
						})
						.attr("stroke-dashoffset", function() {
							return this.getTotalLength();
						})
						.transition()
						.duration(2000)

					.attr("opacity", 0.5)
						.attr("stroke-dashoffset", 0)
						.transition()
						.duration(1000)
						.attr("opacity", 0)
						.remove()
				} else {
					var c = [fromPos[0] - (Math.abs(fromPos[1] - toPos[1])) / 4, (fromPos[1] + toPos[1]) / 2];
					animation_g.append("path")
						.attr("d", "M" + fromPos[0] + " " + fromPos[1] + "Q" + c[0] + " " + c[1] + "," + toPos[0] + " " + toPos[1])
						.attr("fill", "none")
						.attr("opacity", 1)
						.attr("stroke", "yellow")
						.attr("stroke-width", 3)
						.attr("stroke-dasharray", function() {
							return this.getTotalLength();
						})
						.attr("stroke-dashoffset", function() {
							return this.getTotalLength();
						})
						.transition()
						.duration(2000)

					.attr("opacity", 0.5)
						.attr("stroke-dashoffset", 0)
						.transition()
						.duration(1000)
						.attr("opacity", 0)
						.remove()
				}
			}

		}
		zones_g.select("#" + toZoneId)
			.transition()
			.duration(2000)
			.attr("r", options.zoneSizeScale(options.zones[toZoneId].prox_id.values().length));
	}
}