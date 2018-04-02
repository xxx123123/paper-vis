!(function (d3) {
	
	$("#fruleNode1").empty();
	$("#fruleNode2").empty();
	
	var width=560,
     height=560;
	var fsvg = d3.select("#fruleNode2").append("svg").attr("transform","translate(0,0)")
                                              .attr("width",700) 
                                              .attr("height",560);
		fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#a6cee3")
                .attr('transform','translate(560,10)');

              fsvg.append("text")
                .attr("font-size", "20px")
                .text("age")
                .attr('transform','translate(580,17)') ;

              fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#1f78b4")
                .attr('transform','translate(560,30)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("sex")
                .attr('transform','translate(580,37)') ;

               fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#b2df8a")
                .attr('transform','translate(560,50)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("alcres")
                .attr('transform','translate(580,57)') ;
			
               fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#33a02c")
                .attr('transform','translate(560,70)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("numfatal")
                .attr('transform','translate(580,77)') ;
			
			 fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#fb9a99")
                .attr('transform','translate(560,90)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("fhevent")
                .attr('transform','translate(580,97)') ;
				
			fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#e31a1c")
                .attr('transform','translate(560,110)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("fatal injury")
                .attr('transform','translate(580,117)') ;
				
				
			fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#ff7f00")
                .attr('transform','translate(560,130)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("ptype")
                .attr('transform','translate(580,137)') ;
				
				<!-- else if(d.id.match(/R/g)){return "purple";} -->
				fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#cab2d6")
                .attr('transform','translate(560,150)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("rfun")
                .attr('transform','translate(580,157)') ;
				
				<!-- else if(d.id.match(/^A\d+/g)){return "orange";} -->
				fsvg.append("circle")
                .attr("r",10)
                .attr("fill", "#ffff99")
                .attr('transform','translate(560,170)');

               fsvg.append("text")
                .attr("font-size", "20px")
                .text("atmcond")
                .attr('transform','translate(580,177)') ;
	se_updata();										  
function se_updata(){
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(20))
    .force("collide",d3.forceCollide(40))
    .force("center", d3.forceCenter(width/2+50, height / 2));
  
    d3.selectAll(".fnodes circle").remove();
    d3.selectAll(".links line").remove();
  
   d3.json("force.json", function(error, graph) {
      
       if (error) throw error;
  
  var link = fsvg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke","#999")
      .style("opacity","0.6")
      .attr("source",function(d){return d.source;})
      .attr("target",function(d){return d.target;})
      .attr("stroke-width", function(d) {
		  var z_sum=0;
		  if(dict_cbx["cbx_item_set_2"]===true){ z_sum += d.value2;}
		  if(dict_cbx["cbx_item_set_3"]===true){ z_sum += d.value3; }
		  if(dict_cbx["cbx_item_set_4"]===true){ z_sum += d.value4;}
		  if(dict_cbx["cbx_item_set_5"]===true){ z_sum += d.value5;}
		  if(dict_cbx["cbx_item_set_6"]===true){ z_sum += d.value6;}
		  return Math.sqrt(z_sum); })
       // .on("mouseover",function(d) { 
       //         d3.select(this).style("stroke","black");
       //           // d3.select(this).style("opacity","1").attr("stroke-width", function(d) { 
       //           //                if (d.support<=0.07) {return (d.support+5);} 
       //           //                else if (d.support>0.07&&d.support<=0.15) {return d.support+5;}  
       //           //                else if(d.support>0.15) {return (d.support+7);}
       //           //                               }) ;
                             
       //                           })
       //  .on("mouseout",function(d){  
       //      d3.select(this).style("stroke","#999");
       //       })
        .on("click",function(d){
                 doub.length=0;
                  d3.selectAll(".links line").style("stroke","#999");
                d3.select(this).style("stroke","black");
              
                var key_s = Array( d3.select(this).attr("source"),d3.select(this).attr("target") ) ;
                doub.push(d3.select(this).attr("source"));
                doub.push(d3.select(this).attr("target"));
                console.log(doub);
                //       d3.selectAll(".links line")
                //           .attr("stroke-width", function(d) { 
                //                 if (d.support<=0.07) {return (d.support+1);} 
                //                 else if (d.support>0.07&&d.support<=0.15) {return d.support+2;}  
                //                 else if(d.support>0.15) {return (d.support+3);}
                //                                })  ;
                //      d3.select(this).transition().delay(1000)
                //             .attr("stroke-width", function(d) { 
                //                 if (d.support<=0.07) {return (d.support+5);} 
                //                 else if (d.support>0.07&&d.support<=0.15) {return d.support+5;}  
                //                 else if(d.support>0.15) {return (d.support+7);}
                //                                }) ;
                    
                    
                //    d3.selectAll(".links line").attr("stroke","#999");
                //    d3.select(this).attr("stroke","purple");

                drawForceCircle3("nrule.csv",doub);
                // console.log( Array( d3.select(this).attr("source"),d3.select(this).attr("target") ) ); 
                              });
     
       


  var node = fsvg.append("g")
      .attr("class", "fnodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 10)
      .attr("id",function(d){return d.id;})
      .attr("fill", function(d){if(d.id.match(/Ag/g)){return "#a6cee3";}
                              	   else if(d.id.match(/S/g)){return "#1f78b4";}
                              		else if(d.id.match(/Alc/g)){return "#b2df8a";}
                              		else if(d.id.match(/N/g)){return "#33a02c";}
                              		else if(d.id.match(/F/g)){return "#fb9a99";}
                              		else if(d.id.match(/I4/g)){return "#e31a1c";}
                              		else if(d.id.match(/^I\d+/g)){return "#fdbf6f";}
                              		else if(d.id.match(/P/g)){return "#ff7f00";}
                              		else if(d.id.match(/R/g)){return "#cab2d6";}
                              		else if(d.id.match(/^A\d+/g)){return "#ffff99";}
                              		else {return "#b15928";}
		})
      .call(
		         d3.drag().on("start",function(d) {
           if (!d3.event.active) simulation.alphaTarget(0.1).restart();
           d.fx = d.x;
           d.fy = d.y;
          })
          .on("drag", function(d) {
                      d.fx = d3.event.x;
                      d.fy = d3.event.y;
                      d3.select(this).attr("fill","orange");
          })
          .on("end", function(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
             
              d3.select(this).transition().delay(50).attr("fill","black");
              d3.selectAll(".fnodes circle")
	              .attr("fill", function(d){
                  		if(d.id.match(/Ag/g)){return "#a6cee3";}
                  	  else if(d.id.match(/S/g)){return "#1f78b4";}
                  		else if(d.id.match(/Alc/g)){return "#b2df8a";}
                  		else if(d.id.match(/N/g)){return "#33a02c";}
                  		else if(d.id.match(/F/g)){return "#fb9a99";}
                  		else if(d.id.match(/I4/g)){return "#e31a1c";}
                  		else if(d.id.match(/^I\d+/g)){return "#fdbf6f";}
                  		else if(d.id.match(/P/g)){return "#ff7f00";}
                  		else if(d.id.match(/R/g)){return "#cab2d6";}
                  		else if(d.id.match(/^A\d+/g)){return "#ffff99";}
                  		else {return "#b15928";}
                  		});
       
                // drawForceCircle1("nrule.csv",idSelected);
              }))
       .on("click",function(d){
                  doub.length=0;
               d3.selectAll(".fnodes circle")
                  .attr("fill", function(d){
                  if(d.id.match(/Ag/g)){return "#a6cee3";}
                   else if(d.id.match(/S/g)){return "#1f78b4";}
                  else if(d.id.match(/Alc/g)){return "#b2df8a";}
                  else if(d.id.match(/N/g)){return "#33a02c";}
                  else if(d.id.match(/F/g)){return "#fb9a99";}
                  else if(d.id.match(/I4/g)){return "#e31a1c";}
                  else if(d.id.match(/^I\d+/g)){return "#fdbf6f";}
                  else if(d.id.match(/P/g)){return "#ff7f00";}
                  else if(d.id.match(/R/g)){return "#cab2d6";}
                  else if(d.id.match(/^A\d+/g)){return "#ffff99";}
                  else {return "#b15928";}
                d3.select(this).attr("fill","black");})

              
                var key_s = Array( d3.select(this).attr("id"),d3.select(this).attr("id") ) ;
                doub.push(d3.select(this).attr("id"));
                doub.push(d3.select(this).attr("id"));
                console.log(doub);
                //       d3.selectAll(".links line")
                //           .attr("stroke-width", function(d) { 
                //                 if (d.support<=0.07) {return (d.support+1);} 
                //                 else if (d.support>0.07&&d.support<=0.15) {return d.support+2;}  
                //                 else if(d.support>0.15) {return (d.support+3);}
                //                                })  ;
                //      d3.select(this).transition().delay(1000)
                //             .attr("stroke-width", function(d) { 
                //                 if (d.support<=0.07) {return (d.support+5);} 
                //                 else if (d.support>0.07&&d.support<=0.15) {return d.support+5;}  
                //                 else if(d.support>0.15) {return (d.support+7);}
                //                                }) ;
                    
                    
                //    d3.selectAll(".links line").attr("stroke","#999");
                //    d3.select(this).attr("stroke","purple");

                drawForceCircle3("nrule.csv",doub);
                // console.log( Array( d3.select(this).attr("source"),d3.select(this).attr("target") ) ); 
                              });
     
       
       node.append("title")
           .text(function(d) { return d.id+"\n"+d.Dec; });

  simulation.nodes(graph.nodes)
            .on("tick",  ticked)
            .force("link")
            .links(graph.links)
            .distance(0);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
 });  
 }
  d3.select("#cbx_item_set_2").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_2"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_2"] = true;
                }
			
			se_updata();	
            });
 d3.select("#cbx_item_set_3").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_3"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_3"] = true;
                }
				se_updata();
            });
 d3.select("#cbx_item_set_4").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_4"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_4"] = true;
                }
				se_updata();
            });
 d3.select("#cbx_item_set_5").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_5"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_5"] = true;
                }
				se_updata();
            });
 d3.select("#cbx_item_set_6").on("change", function() {  
                if (this.checked == false) {
                    dict_cbx["cbx_item_set_6"] = false;          //使用dict来存储link的状态
                } else {
                    dict_cbx["cbx_item_set_6"] = true;
                }
				se_updata();
            });



})(d3);