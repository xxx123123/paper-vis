!(function (d3) {
  $("#fruleNode1").empty();
  $("#fruleNode2").empty();
  
  
var margin = {top: 30, right: 0, bottom: 10, left: 24},
    width = 560,
    height = 560;

var x = d3.scaleBand().range([0, width]),
    z = d3.scaleLinear().domain([0, 20]).clamp(true);
   

var fsvg = d3.selectAll("#fruleNode1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", margin.left + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top+10) + ")");

// var doub =[];  
// var single = [];

d3.json("matrixs.json", function(miserables) {
  var matrix = [],
      nodes = miserables.nodes,
      n = nodes.length;
    
  updata();
function updata(){
    // Compute index per node.  
  nodes.forEach(function(node, i) {
  
    node.index = i;
    node.count = 0;
    matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
  });

  //console.log(nodes); 
  // Convert links to matrix; count character occurrences.
  
  miserables.links.forEach(function(link) {
  
  if(dict_cbx["cbx_item_set_2"]===true){
    if(link.source !=link.target){
  matrix[link.source][link.target].z += link.value2;
    matrix[link.target][link.source].z += link.value2;
  }else{
  matrix[link.source][link.target].z += link.value2;
  }
    nodes[link.source].count += link.value2;
    nodes[link.target].count += link.value2;
  }
  if(dict_cbx["cbx_item_set_3"]===true){
  if(link.source !=link.target){
  matrix[link.source][link.target].z += link.value3;
    matrix[link.target][link.source].z += link.value3;
  }else{
  matrix[link.source][link.target].z += link.value3;
  }
    nodes[link.source].count += link.value3;
    nodes[link.target].count += link.value3;
  }
  if(dict_cbx["cbx_item_set_4"]===true){
  if(link.source !=link.target){
  matrix[link.source][link.target].z += link.value4;
    matrix[link.target][link.source].z += link.value4;
  }else{
  matrix[link.source][link.target].z += link.value4;
  }
    nodes[link.source].count += link.value4;
    nodes[link.target].count += link.value4;
  }
  if(dict_cbx["cbx_item_set_5"]===true){
  if(link.source !=link.target){
  matrix[link.source][link.target].z += link.value5;
    matrix[link.target][link.source].z += link.value5;
  }else{
  matrix[link.source][link.target].z += link.value5;
  }

    nodes[link.source].count += link.value5;
    nodes[link.target].count += link.value5;
  }
  if(dict_cbx["cbx_item_set_6"]===true){
  if(link.source !=link.target){
  matrix[link.source][link.target].z += link.value6;
    matrix[link.target][link.source].z += link.value6;
  }else{
  matrix[link.source][link.target].z += link.value6;
  }
    nodes[link.source].count += link.value6;
    nodes[link.target].count += link.value6;
  }
  });

  
  //console.log(matrix);
  // Precompute the orders.
  var orders = {
    name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
    count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; })
  };

  x.domain(orders.name);
  d3.selectAll(".row").remove();
  d3.selectAll(".column").remove();
  
  var width = 560;
  var height = 560;
  
  fsvg.append("rect")
      .attr("class", "kbackground")
      .attr("width", width)
      .attr("height", height);

  var row = fsvg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  row.append("fline")
      .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return nodes[i].name; })
    .on("click",function(d){ 
      // single.length=0;
      doub.length=0;
    var num=d[0].y;
    // var kk;
    // single.length==0; 
    nodes.forEach(function(m){
    if(m.index == num){
      // single = m.name;
      doub.push(m.name);
      doub.push(m.name);
      // single.push(m.name);
      // console.log(single[0]);
    }
    });
    // drawForceCircle3("nrule.csv",single[0]);
     drawForceCircle3("nrule.csv",doub); 
    d3.selectAll("text").classed("rcactive",false);
    d3.select(this).classed("rcactive",true);
    })
	.append("title").text(function(d,i) { return nodes[i].Dec; });

  var column = fsvg.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
       // .attr("transform", function(d, i) { return "translate(" + x(i) + ")"; });
  column.append("fline")
      .attr("x1", -width);

  column.append("text")
      .attr("x", 6)
      .attr("y", x.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name; })
    .on("click",function(d){ 
      // single.length=0;
      doub.length=0;
      var num=d[0].y;
    // var kk;
    nodes.forEach(function(m){
    if(m.index == num){
      // single = m.name;
        // single.push(m.name); 
        doub.push(m.name); 
         doub.push(m.name); 
    }
    });
    // drawForceCircle3("nrule.csv",single[0]);
    drawForceCircle3("nrule.csv",doub);
    d3.selectAll("text").classed("rcactive",false);
    d3.select(this).classed("rcactive",true);
    })
	.append("title").text(function(d,i) { return nodes[i].Dec; });

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.bandwidth())
        .attr("height", x.bandwidth())
    .attr("value",function(d){return d.z;})
        .style("fill-opacity", function(d) { var m = Math.sqrt(d.z);  return z(m); })
        .style("fill", "#006400")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
    .on("click",function(d){ 
    //console.log(d);
     // single.length=0;
    doub.length=0;
    d3.selectAll("text").classed("rcactive",false);
    d3.selectAll(".row text").classed("rcactive",function(p,i){return i==d.y;});
    d3.selectAll(".column text").classed("rcactive",function(p,i){return i==d.x;});
    var num1=d.x;var num2=d.y;
    // var kk=[]; 
    nodes.forEach(function(m){
      if(m.index == num1){
      doub.push(m.name); 
      // single.push(m.name); 
      } 
      if(m.index == num2){
      doub.push(m.name);
       // single.push(m.name); 
      }
       // console.log(doub); 
    });
    if(num1==num2){
    // drawForceCircle3("nrule.csv",single[0]);
    // drawForceCircle3("nrule.csv", [doub[0]]); 
      drawForceCircle3("nrule.csv", doub); 
    }else{
    drawForceCircle3("nrule.csv",doub); 
  }
    }).append("title").text(function(d) { return "rule number:"+d.z; });;
  }

  function mouseover(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
  }

  function mouseout() {
    d3.selectAll("text").classed("active", false);
  }
  
  d3.select("#order").on("change", function() {
    order(this.value);
  if(order_index){
  order_index=false;
  }else{
  order_index=true;
  }
  });

  function order(value) {
    x.domain(orders[value]);

    var t = fsvg.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return x(d.x) * 4; })
        .attr("x", function(d) { return x(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return x(i) * 4; })
        // .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
            .attr("transform", function(d, i) { return "translate(" + x(i) + ")"; });
   }
  }
d3.select("#cbx_item_set_2").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_2"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_2"] = true;
                }
      
      updata(); 
            });
 d3.select("#cbx_item_set_3").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_3"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_3"] = true;
                }
        updata();
            });
 d3.select("#cbx_item_set_4").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_4"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_4"] = true;
                }
        updata();
            });
 d3.select("#cbx_item_set_5").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_5"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_5"] = true;
                }
        updata();
            });
 d3.select("#cbx_item_set_6").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_6"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_6"] = true;
                }
        updata();
            });
      
});
//jieshu 
})(d3);