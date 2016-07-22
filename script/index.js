window.onload = init;

function init() {

	window.haz = {
		"f1z8a": haz_f1z8a,
		"f2z2": haz_f2z2,
		"f2z4": haz_f2z4,
		"f3z1": haz_f3z1
	}
	window.proxList = [];
	for (id in prox_fixed) {
		proxList.push({
			"id": id
		})
	}



	var leftWidth = $("#div_track").width(),
		trackHeight = $("#div_track").height(),
		activityWidth = $("#div_activity").width(),
		activityHeight = $("#div_activity").height();


	var svg_activity = d3.select("#svg_activity").attr("width", activityWidth)
		.attr("height", activityHeight)

	var svg_track = d3.select("#svg_track").attr("width", leftWidth)
		.attr("height", trackHeight);

	var rightWidth = $("#div_floor1").width(),
		rightHeight = $("#div_floor1").height();
	console.log(rightWidth + ":" + rightHeight);
	d3.selectAll("div.menu_list").style("height", rightHeight + "px");



	var svg_general = d3.select("#svg_general").attr("width", rightWidth)
		.attr("height", rightHeight).style("clip-path", "url(#clipPath_general)");
	var svg_floor1 = d3.select("#svg_floor1").attr("width", rightWidth)
		.attr("height", rightHeight).style("clip-path", "url(#clipPath_floor1)");
	var svg_floor2 = d3.select("#svg_floor2").attr("width", rightWidth)
		.attr("height", rightHeight).style("clip-path", "url(#clipPath_floor2)");
	var svg_floor3 = d3.select("#svg_floor3").attr("width", rightWidth)
		.attr("height", rightHeight).style("clip-path", "url(#clipPath_floor3)");
	var svg_haz = d3.select("#svg_haz").attr("width", rightWidth)
		.attr("height", rightHeight);

	window.options = {};
	options.rightWidth = rightWidth;
	options.departmentRoot = {
		"name": "Department",
		"children": []
	};
	var department_set = d3.set();
	for (var i = 0; i < employee.length; ++i) {
		if (department_set.has(employee[i].Department)) {
			for (var j = 0; j < options.departmentRoot.children.length; ++j) {
				if (options.departmentRoot.children[j].name == employee[i].Department) {
					options.departmentRoot.children[j].children.push({
						"LastName": employee[i].LastName,
						"FirstName": employee[i].FirstName,
						"Office": employee[i].Office,
						"proxZone": employee[i].proxZone
					})
					console.log('test');
					break;
				}
			}
		} else {
			options.departmentRoot.children.push({
				"name": employee[i].Department,
				"children": [{
					"LastName": employee[i].LastName,
					"FirstName": employee[i].FirstName,
					"Office": employee[i].Office,
					"proxZone": employee[i].proxZone
				}]
			})
			department_set.add(employee[i].Department);
		}
	}

	console.log(options.departmentRoot);

	options.finished = false;

	options.rightScale = {};

	options.currentTime = new Date("2016-5-31");
	options.speed = 1000; //one second : minute;

	options.zoneSizeScale = d3.scaleLinear()
		.domain([0, 125])
		.range([5, 15])

	options.rightMargin = {
		top: 20,
		left: 30,
		right: 10,
		bottom: 10
	}

	options.currentTimeExtent = [new Date("2016-5-31"), new Date("2016-6-14")];
	options.rightTimeScale = d3.scaleTime().domain(options.currentTimeExtent)
		.range([options.rightMargin.left, rightWidth - options.rightMargin.right]);

	options.trackMargin = {
		left: 40,
		top: 20,
		right: 30,
		bottom: 20
	}
	options.trackTimeScale = d3.scaleTime()
		.domain([new Date("2016-5-31"), new Date("2016-6-14")])
		.range([options.trackMargin.left, leftWidth - options.trackMargin.right]);



	svg_track.select("defs").select("clipPath").select("rect")
		.attr("height", trackHeight - options.trackMargin.bottom)
		.attr("width", 0).attr("x", options.trackMargin.left)


	svg_floor1.select("defs").select("clipPath").select("rect")
		.attr("height", rightHeight)
		.attr("x", options.rightMargin.left)
		.attr("width", 0);
	svg_floor2.select("defs").select("clipPath").select("rect")
		.attr("x", options.rightMargin.left)
		.attr("width", 0)
		.attr("height", rightHeight);
	svg_floor3.select("defs").select("clipPath").select("rect")
		.attr("height", rightHeight)
		.attr("x", options.rightMargin.left)
		.attr("width", 0);
	svg_general.select("defs").select("clipPath").select("rect")
		.attr("height", rightHeight)
		.attr("x", options.rightMargin.left)
		.attr("width", 0);
	svg_haz.select("defs").select("clipPath").select("rect")
		.attr("height", rightHeight)
		.attr("x", options.rightMargin.left)
		.attr("width", 0);


	initFloor1Table();
	initFloor2Table();
	initFloor3Table();
	initGeneralTable();
	initHazTable();

	renderDepartment();

	renderTrack();
	renderMoveTrack();
}