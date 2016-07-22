function renderDepartment() {
	var svg = d3.select("#svg_activity"),
		width = svg.attr("width"),
		height = svg.attr("height");
	var g_department = svg.append("g").attr("id", "department")
		.attr("transform", "translate(" + (width / 2 + 30) + "," + 30 + ")")
	var r = d3.hierarchy(options.departmentRoot).sum(function(d) {
		return 1;
	});
	var color = d3.scaleOrdinal()
		.range(d3.schemeCategory10);
	var treemap = d3.treemap()
		.size([width / 2 - 60, height - 60])
		.round(true)
		.paddingOuter(4)
	treemap(r);

	console.log(r);

	g_department.append("text")
		.attr("class", "department_title")
		.attr("x", (width - 60) / 4)
		.attr("y", 0)
		.attr("font-size", 18)
		.attr("fill", "#ccc")
		.attr("dy", "-.2em")
		.attr("dx", "-.3em")
		.attr("font-weight", "blod")
		.attr("text-anchor", "middle")
		.text("Department")


	g_department.selectAll("rect.departWrap")
		.data(r.children).enter()
		.append("rect").attr("class", "departWrap")
		.attr("x", function(d) {
			return d.x0 - 1;
		})
		.attr("y", function(d) {
			return d.y0 - 1;
		})
		.attr("width", function(d) {
			return d.x1 - d.x0 - 2;
		})
		.attr("height", function(d) {
			return d.y1 - d.y0 - 2;
		})
		.attr("fill", "black")
		.attr("stroke", "#ccc")
		.attr("stroke-width", 0.5)
		.attr("stroke-dasharray", 2, 2)
		.on("mouseover", function(d) {
			g_department.selectAll("circle.employee")
				.attr("stroke-width", 0)
				.attr("stroke", "black")
			g_department.selectAll("rect.departWrap").attr("stroke", "#ccc")
				.attr("stroke-dasharray", "2,2")
				.attr("stroke-width", 0.5)
			d3.select(this).attr("stroke", color(d.data.name))
				.attr("stroke-dasharray", "")
				.attr("stroke-width", 2)
				//console.log(d);
			departmentTip(d);
		})
		.on("mousemove", function(d) {
			d3.select("#departmentTip").style("left", (d3.event.clientX + 15) + "px")
				.style("top", (d3.event.clientY + 15) + "px")
		})
		.on("mouseout", function() {
			d3.select("#departmentTip").style("display", "none")
		})
		.on("click", function(d) {
			clickDepartment(d);
		})


	g_department.selectAll("circle.employee")
		.data(r.leaves()).enter()
		.append("circle").attr("class", "employee")
		.attr("cx", function(d) {
			return (d.x0 + d.x1) / 2;
		}).attr("cy", function(d) {
			return (d.y0 + d.y1) / 2;
		})
		.attr("r", function(d) {
			return (d.x1 - d.x0) < (d.y1 - d.y0) ? (d.x1 - d.x0) / 3 : (d.y1 - d.y0) / 3;
		})
		/*.attr("width", function(d) {
			return d.x1 - d.x0;
		}).attr("height", function(d) {
			return d.y1 - d.y0;
		})*/
		.attr("fill", function(d) {
			return color(d.parent.data.name);
		})
		.attr("opacity", 0.7)
		.on("mouseover", function(d) {
			g_department.selectAll("circle.employee")
				.attr("stroke-width", 0)
				.attr("stroke", "black")
			d3.select(this).attr("stroke", "white")
				.attr("stroke-width", 2)
				//console.log(d);
			employeeTip(d);
		})
		.on("mousemove", function(d) {
			d3.select("#departmentTip").style("left", (d3.event.clientX + 15) + "px")
				.style("top", (d3.event.clientY + 15) + "px")
		})
		.on("mouseout", function() {
			d3.select("#departmentTip").style("display", "none")
		})
		.on("click", function(d) {
			clickEmployee(d);
		})


}

function clickEmployee(d) {

}

function employeeTip(d) {
	console.log(d);
	var tip_div = d3.select("#departmentTip")
		.style("left", d3.event.clientX + "px")
		.style("top", d3.event.clientY + "px")
		.style("display", "block")
		.html("FirstName:<span style='color:red;'>" + d.data.FirstName + "</span><br/>" + "LastName:<span style='color:red;'>" + d.data.LastName + "</span><br/>" + "Department:<span style='color:red;'>" + d.parent.data.name + "</span>");
}

function clickDepartment(d) {
	console.log("clickDepartment");
	console.log(d);
}

function departmentTip(d) {
	var tip_div = d3.select("#departmentTip")
		.style("left", d3.event.clientX + "px")
		.style("top", d3.event.clientY + "px")
		.style("display", "block")
		.html("Department:<span style='color:red;'>" + d.data.name + "</span>");
}