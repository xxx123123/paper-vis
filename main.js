function rule_click(d){  //左下方区域柱形图  该点击事件中有日历图点击事件
            // txt1.innerHTML = "hour";
            $("#rightDown").empty();
            alll = d ;
            //console.log(alll);
            drawRecordCircle(d);
            var rule=d.rule;
            rule_n=d.rule;
            L=[];

            var l_rule=rule.replace("->","-");          //将规则转换为文件名
             var x_rule=rule.replace("->",",");     
            var s_rule=x_rule.split(",");
            
            //console.log(l_rule);
            d3.selectAll("#ItemsetRectRegion").remove();//将之前的柱形图删除
            //先画图例
            drawrightaxis();//画右上图例
        
            var rectPadding = 60; //总的矩形宽度
            
            var width = 120;
            var kkheight = 350;
            var rightsvg = d3.select("#ItemsetRectRegion") //取出边框里面的变量
            
            
            var padding = {
                left: 30,
                right: 30,
                top: 20,
                bottom: 20
            };
            var TimeScale = d3.scaleOrdinal()
                .domain(dataset.map(function(d){return d.key;})) 
                .range([0,87.5,225,337.5,450,562.5,675]);
                // .range([0,80,160,240,320,400,480]);
            //console.log(TimeScale('201101'));
            //left轴的比例尺（共同的）
            var LeftScaleC = d3.scaleLinear()
                .domain([0, 1])
                .range([0,kkheight - padding.top - padding.bottom]);
            
d3.csv("mubar/"+l_rule+".csv",function(d, i, columns) {
                for (var i = 1, n = columns.length; i < n; ++i) 
                    //console.log(d[columns[i]]);
                    d[columns[i]] = +d[columns[i]];
                    //console.log(d);   
                    return d;
                },function(error,csv){ 
                if(error){console.log("error");}
                //console.log(csv);
                var key = csv.columns.length;//4，两项。5，三项。6，四项
                //console.log(key);
                if(key ==5){
                    drawrect_2(2);
                }else if(key==6){
                    drawrect_3(3);
                }else if(key==7){
                    drawrect_4(4);
                }else if(key==8){
                    drawrect_5(5);
                }else{
                    drawrect_6(6);
                }
                //var keys = data.columns.slice(1);  //这里有问题
                //先绘制高层在绘制底层

          var righttoptooltip = d3.select("body")
                .append("div")  
                .attr("class","righttoptooltip") 
                .style("opacity",0.0);
            
            function drawrect_2(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
            
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {

                                        var cury = kkheight-LeftScaleC(d.sup1>d.sup2?d.sup1:d.sup2)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) { return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.bottom-padding.top;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3)+"<br />"+"multi items:"+d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ; ;
            }
            
            
            function drawrect_3(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
            
            
              var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
                                    var ma=Math.max(+d.sup1,+d.sup2,+d.sup3);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) {   return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                 .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+"multi items:"+d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ;
            }
            
            function drawrect_4(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
                                        var ma=Math.max(+d.sup1,+d.sup2,+d.sup3,+d.sup4);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) { return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           });
            }
             function drawrect_5(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
                                    var ma=Math.max(+d.sup1,+d.sup2,+d.sup3,+d.sup4,+d.sup5);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) {   return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            rectgroup.append("rect")  //第五个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+4;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup5)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup5);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+s_rule[4]+":"+ d.sup5.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           });
            }
            function drawrect_6(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
                                    var ma=Math.max(+d.sup1,+d.sup2,+d.sup3,+d.sup4,+d.sup5,+d.sup6);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) {   return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            rectgroup.append("rect")  //第五个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+4;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup5)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup5);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            rectgroup.append("rect")  //第六个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+5;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup6)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup6);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+s_rule[4]+":"+ d.sup5.toFixed(3)+"<br />"+s_rule[5]+":"+ d.sup6.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           });
            }
            
            });
			drawcalendar();
            drawcalendar_click(l_rule); 
}
function rule_clickx(d){  //左下方区域柱形图  该点击事件中有日历图点击事件
            $("#rightDown").empty();
            alll = d ;
            //console.log(alll);
            //drawRecordCircle(d);
            drawRecordCircle(d);
            var rule=d.rule;
            rule_n=d.rule;
            L=[];

            var l_rule=rule.replace("->","-");          //将规则转换为文件名
             var x_rule=rule.replace("->",",");     
            var s_rule=x_rule.split(",");
            
            //console.log(l_rule);
            d3.selectAll("#ItemsetRectRegion").remove();//将之前的柱形图删除
            //先画图例
            drawrightaxis();//画右上图例
        
            var rectPadding = 60; //总的矩形宽度
            
            var width = 120;
            var kkheight = 350;
            var rightsvg = d3.select("#ItemsetRectRegion") //取出边框里面的变量
            
            
            var padding = {
                left: 30,
                right: 30,
                top: 20,
                bottom: 20
            };
            var TimeScale = d3.scaleOrdinal()
                .domain(dataset.map(function(d){return d.key;})) 
                .range([0,87.5,225,337.5,450,562.5,675]);
            //console.log(TimeScale('201101'));
            //left轴的比例尺（共同的）
            var LeftScaleC = d3.scaleLinear()
                .domain([0, 1])
                .range([0,kkheight - padding.top - padding.bottom]);
            
d3.csv("mubar/"+l_rule+".csv",function(d, i, columns) {
                for (var i = 1, n = columns.length; i < n; ++i) 
                    //console.log(d[columns[i]]);
                    d[columns[i]] = +d[columns[i]];
                    //console.log(d);   
                    return d;
                },function(error,csv){ 
                if(error){console.log("error");}
                //console.log(csv);
                var key = csv.columns.length;//4，两项。5，三项。6，四项
                //console.log(key);
                if(key ==5){
                    drawrect_2(2);
                }else if(key==6){
                    drawrect_3(3);
                }else if(key==7){
                    drawrect_4(4);
                }else if(key==8){
					drawrect_5(5);
				}else{
					drawrect_6(6);
				}
                //var keys = data.columns.slice(1);  //这里有问题
                //先绘制高层在绘制底层

          var righttoptooltip = d3.select("body")
                .append("div")  
                .attr("class","righttoptooltip") 
                .style("opacity",0.0);
            
            function drawrect_2(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
            
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {

                                        var cury = kkheight-LeftScaleC(d.sup1>d.sup2?d.sup1:d.sup2)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) { return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.bottom-padding.top;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3)+"<br />"+"multi items:"+d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ; ;
            }
            
            
            function drawrect_3(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
            
            
              var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
									var ma=Math.max(+d.sup1,+d.sup2,+d.sup3);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) {   return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                 .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+"multi items:"+d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ;
            }
            
            function drawrect_4(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
										var ma=Math.max(+d.sup1,+d.sup2,+d.sup3,+d.sup4);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) { return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           });
            }
             function drawrect_5(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
									var ma=Math.max(+d.sup1,+d.sup2,+d.sup3,+d.sup4,+d.sup5);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) {   return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			rectgroup.append("rect")  //第五个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+4;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup5)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup5);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+s_rule[4]+":"+ d.sup5.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           });
            }
            function drawrect_6(m){
            var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(csv)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
             var text = rectgroup.selectAll("text")
                               .data(csv)
                               .enter().append("text")
                               .attr("font-size","15px")
                               .attr("text-anchor","middle")
                               .attr("x", function(d, i) {
                                        var k = TimeScale(d.date);
                                        d.x =k;
                                      return d.x;
                                            })
                                .attr("y",function(d, i) {
									var ma=Math.max(+d.sup1,+d.sup2,+d.sup3,+d.sup4,+d.sup5,+d.sup6);
                                        var cury = kkheight-LeftScaleC(ma)-padding.top-padding.bottom;
                                        d.y = cury;
                                        return d.y;
                                    })
                                .attr("dx",rectPadding+m-1)
                                .attr("dy","1em")
                                .text( function(d) {   return d.sum.toFixed(4);} );
            // 高层矩形         
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            
            rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
                
            rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			rectgroup.append("rect")  //第五个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+4;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup5)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup5);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			rectgroup.append("rect")  //第六个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+5;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sup6)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup6);
                    
                    return w;
                })
                .attr("opacity", 0.8);
            //绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
                    var k = TimeScale(d.date);
                    d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = kkheight-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
                    //console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
                  .on("mousemove",function(d){  
                     righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+s_rule[4]+":"+ d.sup5.toFixed(3)+"<br />"+s_rule[5]+":"+ d.sup6.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                 .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           });
            }
            
            });
			drawcalendar(); //画右下图例
            drawcalendar_click(l_rule); 
}
//初始最小support值
var _val=0.02;
function change_s(){
	
	 var value = document.getElementById('range_s').value;
	 _val = value;
	 console.log(_val);
}
var s_change = true;
function sun_change(){ //点击切换sunday的位置
	 // var b=document.getElementById("switch").innerHTML;
     // console.log(b);
     // b = "Sunday First?" ;
    if(s_change){document.getElementById("switch").innerHTML = "Sunday Starts" ; s_change = false;}else{s_change = true;  document.getElementById("switch").innerHTML= " Monday Starts" ;}
    
    var l_rule=rule_n.replace("->","-");
	$("#rightDown").empty();
	drawcalendar();
	drawcalendar_click(l_rule);
}
function drawrightaxis(){  //左下区域坐标轴
            var width = 940;
            var kkheight = 350;

            var rightsvg = d3.select("#Content-Right-Top")
                .append("svg")
                .attr("id", "ItemsetRectRegion")
                .attr("width", width)
                .attr("height", kkheight);
            //定义画布周围空白的地方
            var padding = {
                left: 30,
                right: 30,
                top: 20,
                bottom: 20
            };
			
			
            //定义一个数组
          var barintro = rightsvg.append("rect")
                .attr("class", "barintrorect")
                .attr("x", 780)
                .attr("y", 20)
                .attr("width", 150)
                .attr("height", 60)
                .attr("stroke", "#666666 ")
                .attr("fill", "#CCCCCC ")
                .attr("stroke-width", "1px")
                .attr("opacity", 0.5);

            rightsvg.append("rect")
                .attr("x",785)
                .attr("y", 30)
                .attr("width", 20)
                .attr("height", 16)
                .attr("stroke", "#666666 ")
                .attr("fill", "#6699FF");

            rightsvg.append("text")
                .attr("x", 815)
                .attr("y", 45)
                .attr("font-size", "13px")
                .text("One Item Frequent");

            rightsvg.append("rect")
                .attr("x",785)
                .attr("y", 50)
                .attr("width", 20)
                .attr("height", 16)
                .attr("stroke", "#666666")
                .attr("fill", "#FF6699");

            rightsvg.append("text")
                .attr("x", 815)
                .attr("y", 65)
                .attr("font-size", "13px")
                .text("Multi Items Frequent");

            //线性比例尺
        var dataset = [{"key":"Sun"},{"key":"Mon"},{"key":"Tue"},{"key":"Wed"},{"key":"Thu"},{"key":"Fri"},{"key":"Sat"},{"key":"."}]
  
            var TimeScale =d3.scaleOrdinal()
                .domain(dataset.map(function(d){return d.key;})) 
                .range([0,87.5,225,337.5,450,562.5,675]);
                  // .range([0, width - padding.left - padding.right]);
				// .range([0,40,80,120,160,200,240,280,320,360,400,440,480]);
		
            //left轴的比例尺（共同的）
            
            var LeftScaleC = d3.scaleLinear()
                .domain([0, 1])
                .range([0,kkheight - padding.top - padding.bottom]);
            //support比例尺（各自超出的）**********
			var LeftScale = d3.scaleLinear()
                .domain([0, 1])
                .range([kkheight - padding.top - padding.bottom,0]);
			
            //定义bottom轴
            var axisBottom = d3.axisBottom(TimeScale);


			//.tickFormat(d3.timeFormat("%Y%m"));  
            //var axisBottom = d3.axisBottom(BottomScale);
            var axisLeft = d3.axisLeft(LeftScale);

            //添加bottom轴
            rightsvg.append("g")
                .attr("class", "axis_right")
                .attr("transform", "translate(" + (padding.left+30) + "," + (kkheight - padding.bottom) + ")")
              	.call(axisBottom);

             // d3.selectAll('g.axis_right  text').attr('transform','translate(0,0)rotate(15)'); 

            rightsvg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .call(axisLeft);
}

var rule_n;  //button规则

   
function convert_data(){ //button点击 统计support
   
   txt.innerHTML = "Loading...";
    
	//选取时间段的support
	var ObjMubar = [];
	//选取时间段的confident
	var ObjDot = new Array();
	//先将L重新排序
	
	
	L.sort(function(a,b){
		if(a.week>b.week){
			return 1;
		}else if(a.week == b.week){
			return a.hour>b.hour?1:-1;
		}else{
			return -1;
		}
		});
	
	
	// 将选取的时间变为区间
	 var sumtime = d3.pairs(L);
	 //console.log(sumtime);
	
	// rule_n为每条规则的原始样子
	 var rule=rule_n.replace("->","-");
	
	// 统计共同项规则的分子
	var conn_sum = [];
	d3.csv("week-hour/"+rule+".csv", function(error, csv) {
		sumtime.forEach(function(l){
			var pre = l[0]; //大于时间
			var con = l[1]; //小于时间
			var c = 0;
			csv.forEach(function(d){
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour)
					c = c + 1;
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour)
							c = c + 1;
					}else if (d.dayofweek == con.week){
						if(d.acchr <con.hour)
							c = c + 1;
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						c = c + 1;
					}
				}
			});
			conn_sum.push(c);
			
			//console.log(conn_sum); 
			
		});
	
	// 统计所有分母
	var m_sum = [];
	d3.csv("2011-b.csv", function(error, csv) {
		sumtime.forEach(function(l){
			var pre = l[0]; //大于时间
			var con = l[1]; //小于时间
			var c = 0;
			csv.forEach(function(d){
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour)
					c = c + 1;
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour)
							c = c + 1;
					}else if (d.dayofweek == con.week){
						if(d.acchr <con.hour)
							c = c + 1;
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						c = c + 1;
					}
				}
			});
			m_sum.push(c);
			
		});
	
	
	
	// 将规则分为多个部分
	var rule_ns = new Array();
	rule=rule.replace("-",", ");
	rule_ns = rule.split(", ");//分割各个规则
	 //console.log(rule_ns);
	// console.log(rule_ns[1]);
	
	
	var r1 = [];  //多个规则
	var r2 = [];
	if(rule_ns.length == 5){
		var r3 =[];
		var r4 =[];
		var r5 =[];
	}else if(rule_ns.length == 4){
		var r3 =[];
		var r4 =[];
	}else if(rule_ns.length == 6){
		var r3 =[];
		var r4 =[];
		var r5 =[];
		var r6 =[];
	}else if(rule_ns.length == 3){
		var r3 =[];
	}
	
	// 规则的分子
	d3.csv("newonline.csv", function(error, csv) {
		sumtime.forEach(function(l){
			var pre = l[0]; //大于时间
			var con = l[1]; //小于时间
			var c1 = 0;
			var c2 = 0;
			var c3 = 0;
			var c4 = 0;
			var c5 = 0;
			var c6 = 0;
			csv.forEach(function(d){
			if(rule_ns.length == 2){ //规则为两项的
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						}
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
						}
					}else if (d.dayofweek == con.week){
						if(d.acchr <con.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
						}
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
					}
				}
			}
				// 规则为三项
			if(rule_ns.length == 3){
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
						}
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
						}
					}else if (d.dayofweek == con.week){
						if(d.acchr <con.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
						}
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
					}
				}
			}
				// 规则为四项
				if(rule_ns.length == 4){
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
						if(d.code == rule_ns[3]) c4 = c4+1;
						}
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
							if(d.code == rule_ns[3]) c4 = c4+1;
						}
					}else if (d.dayofweek == con.week){
						if(d.acchr <con.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
							if(d.code == rule_ns[3]) c4 = c4+1;
						}
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
						if(d.code == rule_ns[3]) c4 = c4+1;
					}
				}
			}
			//规则为五项
				if(rule_ns.length == 5){
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
						if(d.code == rule_ns[3]) c4 = c4+1;
						if(d.code == rule_ns[4]) c5 = c5+1;
						}
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
							if(d.code == rule_ns[3]) c4 = c4+1;
							if(d.code == rule_ns[4]) c5 = c5+1;
						}
					}else if (d.dayofweek == con.week){
						if(d.acchr <con.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
							if(d.code == rule_ns[3]) c4 = c4+1;
							if(d.code == rule_ns[4]) c5 = c5+1;
						}
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
						if(d.code == rule_ns[3]) c4 = c4+1;
						if(d.code == rule_ns[4]) c5 = c5+1;
					}
				}
			}
			//规则为六项
				if(rule_ns.length == 6){
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
						if(d.code == rule_ns[3]) c4 = c4+1;
						if(d.code == rule_ns[4]) c5 = c5+1;
						if(d.code == rule_ns[5]) c6 = c6+1;
						}
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
							if(d.code == rule_ns[3]) c4 = c4+1;
							if(d.code == rule_ns[4]) c5 = c5+1;
							if(d.code == rule_ns[5]) c6 = c6+1;
						}
					}else if (d.dayofweek == con.week){
						if(d.acchr <con.hour){
							if(d.code == rule_ns[0]) c1 = c1+1;
							if(d.code == rule_ns[1]) c2 = c2+1;
							if(d.code == rule_ns[2]) c3 = c3+1;
							if(d.code == rule_ns[3]) c4 = c4+1;
							if(d.code == rule_ns[4]) c5 = c5+1;
							if(d.code == rule_ns[5]) c6 = c6+1;
						}
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						if(d.code == rule_ns[0]) c1 = c1+1;
						if(d.code == rule_ns[1]) c2 = c2+1;
						if(d.code == rule_ns[2]) c3 = c3+1;
						if(d.code == rule_ns[3]) c4 = c4+1;
						if(d.code == rule_ns[4]) c5 = c5+1;
						if(d.code == rule_ns[5]) c6 = c6+1;
					}
				}
			}
			});
			
			r1.push(c1);
			r2.push(c2);
			if(rule_ns.length == 3){
				r3.push(c3);
			}else if (rule_ns.length == 4){
				r3.push(c3);
				r4.push(c4);
			}else if (rule_ns.length == 5){
				r3.push(c3);
				r4.push(c4);
				r5.push(c5);
			}else if(rule_ns.length == 6){
				r3.push(c3);
				r4.push(c4);
				r5.push(c5);
				r6.push(c6);
			}
		});
	

	// console.log("####################");
	// console.log(r1);
	// console.log(r2);
	
	// content_right的图的数据
	// 建立ObjMubar
	
	var keys={1:'Sun',2:'Mon',3:'Tue',4:'Wed',5:'Thu',6:'Fri',7:'Sat'}
	var keys1={1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri',6:'Sat',7:'Sun'}
	if (s_change ==false){keys=keys1;}
	var num = 0;
	if(rule_ns.length == 2){  //规则等于2  还有等于3.4的
	sumtime.forEach(function(l){
		var Obj_mubar = new Object();
		Obj_mubar.date = keys[l[0].week]+l[0].hour+'-'+keys[l[1].week]+l[1].hour;
		Obj_mubar.sum = conn_sum[num] / m_sum[num];
		Obj_mubar.sup1 = r1[num] / m_sum[num];
		Obj_mubar.sup2 = r2[num] / m_sum[num];
		num = num + 1;
		if(Obj_mubar.sum>=0.05){ObjMubar.push(Obj_mubar);}
		delete Obj_mubar;
		delete num;
		});
		
	}
	if(rule_ns.length == 3){
	sumtime.forEach(function(l){
		var Obj_mubar = new Object();
		Obj_mubar.date = keys[l[0].week]+l[0].hour+'-'+keys[l[1].week]+l[1].hour; 
		Obj_mubar.sum = conn_sum[num] / m_sum[num];
		Obj_mubar.sup1 = r1[num] / m_sum[num];
		Obj_mubar.sup2 = r2[num] / m_sum[num];
		Obj_mubar.sup3 = r3[num] / m_sum[num];
		num = num + 1;
		
		if(Obj_mubar.sum>=0.05){ObjMubar.push(Obj_mubar);}
		
		delete Obj_mubar;
		delete num;
		});
		
	}
	if(rule_ns.length == 4){
	sumtime.forEach(function(l){
		var Obj_mubar = new Object();
		Obj_mubar.date = keys[l[0].week]+l[0].hour+'-'+keys[l[1].week]+l[1].hour; 
		Obj_mubar.sum = conn_sum[num] / m_sum[num];
		Obj_mubar.sup1 = r1[num] / m_sum[num];
		Obj_mubar.sup2 = r2[num] / m_sum[num];
		Obj_mubar.sup3 = r3[num] / m_sum[num];
		Obj_mubar.sup4 = r4[num] / m_sum[num];
		num = num + 1;
		
		if(Obj_mubar.sum>=0.05){ObjMubar.push(Obj_mubar);}
		
		delete Obj_mubar;
		delete num;
		});
		
	}
	if(rule_ns.length == 5){
	sumtime.forEach(function(l){
		var Obj_mubar = new Object();
		Obj_mubar.date = keys[l[0].week]+l[0].hour+'-'+keys[l[1].week]+l[1].hour; 
		Obj_mubar.sum = conn_sum[num] / m_sum[num];
		Obj_mubar.sup1 = r1[num] / m_sum[num];
		Obj_mubar.sup2 = r2[num] / m_sum[num];
		Obj_mubar.sup3 = r3[num] / m_sum[num];
		Obj_mubar.sup4 = r4[num] / m_sum[num];
		Obj_mubar.sup5 = r5[num] / m_sum[num];
		num = num + 1;
		
		if(Obj_mubar.sum>=0.05){ObjMubar.push(Obj_mubar);}
		
		delete Obj_mubar;
		delete num;
		});
		
	}
	if(rule_ns.length == 6){
	sumtime.forEach(function(l){
		var Obj_mubar = new Object();
		Obj_mubar.date = keys[l[0].week]+l[0].hour+'-'+keys[l[1].week]+l[1].hour; 
		Obj_mubar.sum = conn_sum[num] / m_sum[num];
		Obj_mubar.sup1 = r1[num] / m_sum[num];
		Obj_mubar.sup2 = r2[num] / m_sum[num];
		Obj_mubar.sup3 = r3[num] / m_sum[num];
		Obj_mubar.sup4 = r4[num] / m_sum[num];
		Obj_mubar.sup5 = r5[num] / m_sum[num];
		Obj_mubar.sup6 = r6[num] / m_sum[num];
		num = num + 1;
		
		if(Obj_mubar.sum>=0.05){ObjMubar.push(Obj_mubar);}
		
		delete Obj_mubar;
		delete num;
		});
		
	}
	 

	
	var number =0;
	if(rule_ns.length == 2){
	sumtime.forEach(function(l){
		var Obj_dot = new Object();
		Obj_dot.date = keys[l[0].week]+l[0].hour+'-'+keys[l[1].week]+l[1].hour;
		Obj_dot.sup = conn_sum[number] / m_sum[number];
		Obj_dot.con = conn_sum[number]/ r1[number];
		number += 1;
		//console.log(Obj_dot);
		// if(Obj_mubar.sum>0.05){ObjMubar.push(Obj_mubar);}
		if(Obj_dot.sup>=0.05&&Obj_dot.con>=0.5){ObjDot.push(Obj_dot);}
		delete Obj_dot;
		delete number;
		});
		
		draw_mubar(ObjMubar,rule_ns.length); //重新绘制柱形图 
		save_data(ObjDot,rule_n);//保存改数据并绘制
		txt.innerHTML = "";
	
		
	}else{
			// 建立ObjDot 分母的前键
	var pre_rule=rule_n.split("->");
	// pre_rule[0]是前键
	
	// 统计3、4/5/6项集分母
	var pre_sum = [];
	d3.csv("prule/"+pre_rule[0]+".csv", function(error, csv) {
		sumtime.forEach(function(l){
			var pre = l[0]; //大于时间
			var con = l[1]; //小于时间
			var c = 0;
			csv.forEach(function(d){
				if(pre.week == con.week){
					if (d.dayofweek == pre.week){
					if(d.acchr >=pre.hour && d.acchr < con.hour)
					c = c + 1;
					}
				}else {
					if (d.dayofweek == pre.week){  //&& d.dayofweek <= con.week)
						if(d.acchr >=pre.hour)
							c = c + 1;
					}else if (d.dayofweek == con.week){
						if(d.acchr <=con.hour)
							c = c + 1;
					}else if(d.dayofweek > pre.week && d.dayofweek < con.week){
						c = c + 1;
					}
				}
			});
			pre_sum.push(c);
			//console.log(conn_sum); 
			delete c;
		});
		
		// 计算置信度
		sumtime.forEach(function(l){
		var Obj_dot = new Object();
		Obj_dot.date = keys[l[0].week]+l[0].hour+'-'+keys[l[1].week]+l[1].hour;
		Obj_dot.sup = conn_sum[number] / m_sum[number];
		Obj_dot.con = conn_sum[number]/ pre_sum[number];
		number += 1;
		//console.log(Obj_dot);
		if(Obj_dot.sup>=0.05&&Obj_dot.con>=0.5){ObjDot.push(Obj_dot);}
		delete Obj_dot;
		delete number;
		});
		
	
	
	 draw_mubar(ObjMubar,rule_ns.length); //重新绘制柱形图 
	 save_data(ObjDot,rule_n);//保存改数据并绘制
    txt.innerHTML = "";
	
		// console.log(ObjMubar);
	  // console.log(ObjDot);  //查看三项集合
	
	});//三项和四项的分母
	}
	 });//各自的分子
	});//取分母
	 });//取共同分子
	
}

function draw_mubar(data,m){//热图点击画mubar
	d3.selectAll("#ItemsetRectRegion").remove();
	var rule=rule_n;
     var x_rule=rule.replace("->",",");     
            var s_rule=x_rule.split(",");
			var width = 940;
            var height = 350;

            var rightsvg = d3.select("#Content-Right-Top")
                .append("svg")
                .attr("id", "ItemsetRectRegion")
                .attr("width", width)
                .attr("height", height);
            //定义画布周围空白的地方
            var padding = {
                left: 22.5,
                right: 22.5,
                top: 20,
                bottom: 20
            };
			
		var righttoptooltip = d3.select("body")
                .append("div")  
                .attr("class","righttoptooltip") 
                .style("opacity",0.0);
            //定义一个数组


           var barintro = rightsvg.append("rect")
                .attr("class", "barintrorect")
                .attr("x", 780)
                .attr("y", 20)
                .attr("width", 150)
                .attr("height", 60)
                .attr("stroke", "#666666 ")
                .attr("fill", "#CCCCCC ")
                .attr("stroke-width", "1px")
                .attr("opacity", 0.5);

            rightsvg.append("rect")
                .attr("x",785)
                .attr("y", 30)
                .attr("width", 20)
                .attr("height", 16)
                .attr("stroke", "#666666 ")
                .attr("fill", "#6699FF");

            rightsvg.append("text")
                .attr("x", 815)
                .attr("y", 45)
                .attr("font-size", "13px")
                .text("One Item Frequent");

            rightsvg.append("rect")
                .attr("x",785)
                .attr("y", 50)
                .attr("width", 20)
                .attr("height", 16)
                .attr("stroke", "#666666")
                .attr("fill", "#FF6699");

            rightsvg.append("text")
                .attr("x", 815)
                .attr("y", 65)
                .attr("font-size", "13px")
                .text("Multi Items Frequent");

				
			var LeftScaleC = d3.scaleLinear()
                .domain([0, 1])
                .range([0,height - padding.top - padding.bottom]);
            //support比例尺（各自超出的）**********
			var LeftScale = d3.scaleLinear()
                .domain([0, 1])
                .range([height - padding.top - padding.bottom,0]);
				
			var axisLeft = d3.axisLeft(LeftScale);
            //添加bottom轴
          
            rightsvg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (padding.left+10) + "," + (padding.top) + ")")
                .call(axisLeft);
				
			var rectPadding = 45; //总的矩形宽度
			//时间比例尺重新划定范围
			var rang_arr=[];
			for(var i=0 ;i<data.length;i++){ 
			rang_arr[i]=0+(825/data.length * i); 
			}
			
			var last =data[data.length-1];
			var last_T = last.date;
			
			
			//每一个间隔大小  data.length
			var timeScale = d3.scaleOrdinal()
				.domain(data.map(function(d){
					return d.date;
				})) 
				.range(rang_arr); //这里修改一下
			var axisBottom = d3.axisBottom(timeScale);
 
			rightsvg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + (padding.left+20) + "," + (height - padding.bottom) + ")")
                // .attr("stroke", "black")
				.call(axisBottom);
             
             // d3.selectAll('g.axis text').attr('transform','translate(0,0)rotate(5)');
			
            if(m == 2){
					drawrect_2(2);
				}else if(m == 3){
					drawrect_3(3);
				}else if(m == 4){
					drawrect_4(4);
				}else if(m == 5){
					drawrect_5(5);
				}else{ 
					drawrect_6(6);
				}
			
		function drawrect_2(m){
			var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(data)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
			
			// 高层矩形			
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
			//绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
					//console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8)
				.on("mousemove",function(d){  
                righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3)+"<br />"+"multi items:"+d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ; 
			}

			function drawrect_3(m){
			var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(data)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
			
			// 高层矩形			
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			//绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
					//console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8).on("mousemove",function(d){  
                righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+"multi items:"+d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ; 
			}		
			function drawrect_4(m){
			var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(data)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
			
			// 高层矩形			
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
			rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			//绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
					//console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8).on("mousemove",function(d){  
                righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ; 
			}
		function drawrect_6(m){
			var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(data)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
			
			// 高层矩形			
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
			rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
				rectgroup.append("rect")  //第五个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+4;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup5)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup5);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
				rectgroup.append("rect")  //第六个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+5;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup6)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup6);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			//绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
					//console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8).on("mousemove",function(d){  
                righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+s_rule[4]+":"+ d.sup5.toFixed(3)+"<br />"+s_rule[5]+":"+ d.sup6.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }) ; 
			}
			function drawrect_5(m){
			var rectgroup = rightsvg.selectAll(".ItemSetRectGroup" )
                .data(data)
                .enter()
                .append("g")
                .attr("class", "itemsetrecgroup");
			
			// 高层矩形			
            rectgroup.append("rect")  //第一个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup1)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup1);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第二个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+1;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup2)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup2);
                    
                    return w;
                })
                .attr("opacity", 0.8);
			
			rectgroup.append("rect")  //第三个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+2;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup3)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup3);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
			rectgroup.append("rect")  //第四个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+3;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup4)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup4);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
				rectgroup.append("rect")  //第五个
                .attr("fill", "#6699FF")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d) 这里看数据有几个来看
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x+rectPadding/m+rectPadding/m+rectPadding/m+rectPadding/m+4;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sup5)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding/m)
                .attr("height", function(d) {
                    var w = LeftScaleC(d.sup5);
                    
                    return w;
                })
                .attr("opacity", 0.8);
				
			//绘制底层矩形
            rectgroup.append("rect")
                .attr("fill", "#FF6699")
                .attr("transform", "translate(" + padding.left + "," + (padding.top) + ")")
                .attr("x", function(d, i) {
                    //console.log(d)
					var k = timeScale(d.date)+10;
					d.x =k;
                  return d.x;
                })
                .attr("y", function(d, i) {
                    var cury = height-LeftScaleC(d.sum)-padding.top-padding.bottom;
                    d.y = cury;
                    return d.y;
                })
                .attr("width", rectPadding+m-1)
                .attr("height", function(d) {
                    d.curwidth = LeftScaleC(d.sum);
                    //d.maxwidth = d.wth + curwidth;
					//console.log(d.curwidth);
                    return d.curwidth;
                })
                .attr("opacity", 0.8).on("mousemove",function(d){  
                righttoptooltip
                               .html("rule: " + rule +"<br />"+s_rule[0]+":"+ d.sup1.toFixed(3) +"<br />"+s_rule[1]+":"+ d.sup2.toFixed(3) +"<br />"+s_rule[2]+":"+ d.sup3.toFixed(3)+"<br />"+s_rule[3]+":"+ d.sup4.toFixed(3)+"<br />"+s_rule[4]+":"+ d.sup5.toFixed(3)+"<br />"+"multi items:"+ d.sum.toFixed(3)) 
                               .style("left", (d3.event.pageX) + "px")  
                               .style("top", (d3.event.pageY + 20) + "px")
                               .style("opacity",1);  
                    })
                .on("mouseout",function(){  
                        righttoptooltip.style("opacity",0.0); 
                           }); 
			}
			
}


//保存重新选取时间段之后的数据
var c_dot=new Array();
function save_data(data,rule){
    // 将数据保存
    // if(c_dot != null||c_dot != ""||c_dot != undefined){
    //     d3.select("#right_tempt table").select("tbody").remove();
    // }
   // console.log("tbodysize:"+d3.select("#right_tempt table").select("tbody").size());
     data.rule=rule;

    c_dot.push(data);
//绘制该数据
   
    draw_dot(c_dot,rule);

}

function draw_dot(data,rule){ //热图点击画dot
	//将含有，的规则修改为->
   //console.log(data); 
	   // d3.select("#right_tempt  table.t2").selectAll("tr").remove();
       
        var rtoptooltip = d3.select("body")
                .append("div")  
                .attr("class","riballtiptxt") 
                .style("opacity",0.0);


        // d3.select("#right_tempt").append("tbody");
	var tr = d3.select("#right_tempt  table.t2").selectAll("tr")
				.data(data)
                .enter()
                .append("tr")
                .attr("rule",function(d){return d.rule;}); //设置行

			      tr.append("th")
                    .text(rule);
	
	tr.selectAll("td")
				.data(function(d){ return d.map(function(m){ return m;});})
				.enter()
                .append("td").append("svg")
				.attr("width", 67.5)
                 .attr("height", 45)
				.append("circle")
                .attr("support", function(ob) {
                              return ob.sup;
                          })
                .attr("confidence", function(ob) {
                              return ob.con;
                          })
				.attr("cx",30)
				.attr("cy",22.5)
				.attr("r", function(d) { 
				return d.sup * 100;
				})
				.attr("fill",function(d){
                             if(d.con ==null){return 0;}else if (d.con <=0.6) {return compute(d.con-0.5);} 
                              else if (d.con>=0.6&&d.con <=0.7) {return compute(d.con-0.3);}  else if (d.con>=0.7&&
                                d.con <=0.8) {return compute(d.con-0.1);} else { return compute(d.con);}  }
                        )
                .on("mouseover",function(d){  
                                rtoptooltip.html("date:"+d.date+"<br />"+"support: " +d.sup.toFixed(3) +"<br />"+"confidence: " + d.con.toFixed(3)) 
                                     .style("left", (d3.event.pageX) + "px")  
                                     .style("top", (d3.event.pageY + 50) + "px")  
                                     .style("opacity",1.0);  
                                d3.select(this)
                                  .attr("r",function(d) {  
                                             return d.sup * 100+3; 
                                                         }) ;
                                var myDate=new Date();
                                                                //console.log(d);
                              console.log("reselect mouseover dot information"+ rule +'//'+  '\t'+"time:"+myDate.toLocaleString());//////////////////////////////////
                           })                    
                .on("mouseout",function(d){    
                                    d3.select(this)
                                      .attr("r",function(d) {  
                                            return d.sup * 100; 
                                                            });
                                    rtoptooltip.style("opacity",0.0);   
                           });
	
}
var list1=[];

function drawRecordCircle(a) {        //从ruleview中记录每条数据
    
     d3.select("#right_tempt table").selectAll("tr").remove();
       
       // var list_f = [a.rule];
       list1.push(a.rule);
       // console.log(list_f);

  
    d3.csv("nrule.csv",function(error,data) {
        
           data.forEach(function(l,i){ 
                var m=l.rule;
                l.isshow= list1.filter(function(d){
                // if (m.indexOf(d)==-1)
                if(m!=d)
                {return 0;}
                else{return 1;}}
                )[0];
                // console.log(l.isshow);
            });

         function fil(d){
                return d.isshow;
         }
         var newdata=data.filter(fil);
         // console.log(newdata);

            
            if (error) {
                console.log("loading csvdata error");
            }                   
                        
            else { 
         // console.log(data);
            var tooltip = d3.select("body")
                .append("div")  
                .attr("class","balltiptxt")  
               .style("opacity",0.0);

            var ctooltip = d3.select("body")
                .append("div")  
                .attr("class","cballtiptxt")  
                .style("opacity",0.0);
                   
              var year=["1","2","3","4","5","6","7"];
              
              var tr = d3.select("#right_tempt  table.t1").selectAll("tr")//设置行
                        .data(newdata)
                        .enter().append("tr")
                        .attr("rule",function(d) { return d.rule;})
                        .on("mouseover",function(d){  
                                ctooltip.html(d.Def) 
                                     .style("left", (d3.event.pageX ) + "px")  
                                     .style("top", (d3.event.pageY + 20) + "px")  
                                     .style("opacity",1.0);  
                                        var myDate=new Date();
                                        console.log("mouseover rule "+d.rule +"\t"+" time:"+myDate.toLocaleString());///////////////////////////
                           })                    
                        .on("mouseout",function(d){  
                                      // 鼠标移出时，将透明度设定为0.0（完全透明）
                                         ctooltip.style("opacity",0.0);  
                           });
                    
                    tr.append("th")
                       // .attr("width",151)
                      .text(function(d) { return d.rule; });
                   
                    var years = new Array(); 
                  
                    for (var i in year){
                        //console.log(year[i]);
                        var obj = new Object();
                        obj.sup = "support"+year[i];
                        obj.con = "confidence"+year[i]; 
                        obj.lift = "lift"+year[i]; 
                        years.push(obj);
                        
                        }
                        
                    tr.selectAll("td")
                        .data(function(d) { 
                            return years.map(function(k){
                            var ob =new Object();
                                ob.ru =d.rule;/////////////////
                            var la=(k.sup).replace("support","");///////////////////
                                ob.yt = la;//////////////////////////////
                                ob.sup=d[k.sup]; 
                                ob.con=d[k.con];
                                // ob.lift=d[k.lift];
                            return ob; 
                            }); 
                           }) 
                        .enter().append("td").append("svg")
                         .attr("width", 67.5)
                        .attr("height", 45)
                        .append("circle")
                        .attr("support", function(ob) {
                             return ob.sup; 
                          })
                        .attr("confidence", function(ob) {
                               return ob.con;
                          })
                         // .attr("lift", function(ob) {
                         //       return ob.lift;
                         //  })
                        .attr("cx",30)
                        .attr("cy",22.5)
                        .attr("r", function(d) { 
                        if(d.sup == 0||d.sup == null){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
                        })
                        .attr("fill",function(d){
                             if(d.con ==null){return 0;}else if (d.con <=0.6) {return compute(d.con-0.5);} 
                              else if (d.con>=0.6&&d.con <=0.7) {return compute(d.con-0.3);}  else if (d.con>=0.7&&
                                d.con <=0.8) {return compute(d.con-0.1);} else { return compute(d.con);}  }
                        )
                        .on("mouseover",function(d){  
                                // tooltip.html("month: " + d.yt + "<br />"+"support: " +d.sup.substring(0, 5) +"<br />"+"confidence: " + d.con.substring(0, 5)) 
                                    tooltip.html("support: " +d.sup.substring(0, 5) +"<br />"+"confidence: " + d.con.substring(0, 5))
                                     .style("left", (d3.event.pageX) + "px")  
                                     .style("top", (d3.event.pageY - 60) + "px")  
                                     .style("opacity",1.0);  
                              
                                  var myDate=new Date();
                                                                //console.log(d);
                                 console.log(" mouseover RecordDot information"+d.ru +'//'+  d.yt+ '\t'+"time:"+myDate.toLocaleString());//////////////////////////////////
                           })                    
                       .on("mouseout",function(d){  
   
                                    tooltip.style("opacity",0.0);  
                           });

                        tr.on("click.first",rule_clickx)
              .on("click.second",function(){
            ctooltip.style("opacity",0.0);
              tooltip.style("opacity",0.0);
                d3.selectAll("tr").style("color","black");
                d3.select(this).style("color","orange");
              });

    }
     }) };
var flag1 = true;
function drawcalendar_click(l_rule){ //日历图的点击记录时间点
    
    d3.selectAll("rect.hourbordered").remove();
    var svg =d3.selectAll("#calendar_region");

  var margin = { top: 30, right: 0, bottom: 50, left: 40 },
          width = 850 - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          days = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          days1 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"],
          times = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

		if(s_change){
		var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize+7; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + (gridSize / 1.5 + 10)+ ")")
            .attr("class", function (d, i) { return  "dayLabel mono axis axis-workweek"; });
		}else{
		var dayLabels = svg.selectAll(".dayLabel")
          .data(days1)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize+7; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," +  (gridSize / 1.5 + 10) + ")")
            .attr("class", function (d, i) { return  "dayLabel mono axis axis-workweek"; });
			
		}
      var timeLabels = svg.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", 6)")
            .attr("class", function(d, i) { return "timeLabel mono axis axis-worktime" ; });
   
    var color = d3.scaleLinear() 
    .domain([1, 70])  
    .range([0.2,1]); 
 
        d3.csv("nweek-hour/"+l_rule+".csv",
         function(d) { 
            if(s_change ==false){ if (d.dayofweek =="1") {d.dayofweek =7} else {+d.dayofweek--;}}
           return {
            day: +d.dayofweek,
            hour: +d.acchr+1,
            value: +d.size
		   };
		   
        },
        function(error, data) {
   
   var cards = svg.append("g").selectAll("rect")
						.data(data).enter().append("rect")
                          .attr("x", function(d) { return (d.hour ) * gridSize+33; })
                          .attr("y", function(d) { return (d.day+0.5 ) * gridSize; })
                          .attr("value",function(d){return d.value;})
                          .attr("rx", 4)
                          .attr("ry", 4)
                          .attr("day",function(d){return d.day})
                          .attr("hour",function(d){return d.hour})
                          .attr("class", "hourbordered")
                          .attr("width", gridSize)
                          .attr("height", gridSize)
                          .attr("fill", "#006400")
                          .style("opacity",function(d){ return color(d.value); })
                          // .attr("transform", "translate(0,-10")
                          .append("title").text(function(d) { return "value:"+d.value; });
					
					L.length = 0;
					
             d3.selectAll("rect.hourbordered")
			 .on("click",function(d){ 
			   L.push({"week":d.day,"hour":d.hour});
			   
			   d3.select(this).attr("fill","black").style("opacity","0.6");});
        });    
}


function drawcalendar(){   //只画边框线

  var margin = { top: 30, right: 10, bottom: 50, left: 40 },
          width = 850 - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          days = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          days1 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"],
          times = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];

      var svg = d3.select("#rightDown").append("svg")
          .attr("id","calendar_region")
          .attr("width", width + margin.left + margin.right+50)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + (margin.left+20) + "," + margin.top + ")");

	if(s_change){
      var dayLabels = svg.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize+7; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," +  (gridSize / 1.5 + 10) + ")")
            .attr("class", function (d, i) { return "dayLabel mono axis axis-workweek"; });
		}else{
		var dayLabels = svg.selectAll(".dayLabel")
          .data(days1)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize+7; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + (gridSize / 1.5 + 10) + ")")
            .attr("class", function (d, i) { return "dayLabel mono axis axis-workweek"; });
			
		}
			
      var timeLabels = svg.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", 6)")
            .attr("class", function(d, i) { return "timeLabel mono axis axis-worktime"; });

    flag1 = false;
}
 function MyRange_s() {
    var x = document.getElementById("range_s").value;
    document.getElementById("demo").innerHTML = x;  
    drawCircle1("new_dynamicRules.csv",x) ;
}
 function MyRange_c() {
    var x = document.getElementById("range_c").value;
    document.getElementById("demo1").innerHTML = x;
    drawCircle2("new_dynamicRules.csv",x) ;
}

 function drawCircle1(data,val) {    
    //删掉之前的重新画
    d3.select("body").selectAll("tr").remove();
     d3.selectAll(".itemsetrecgroup").remove();
       d3.selectAll("#calendar_region rect").remove();   
    
    
    d3.csv(data,function(error,data) {
     
            if (error) {
                console.log("loading csvdata error");
            }           
                
            else {    
    
            var tooltip = d3.select("body")
                .append("div")  
                .attr("class","balltiptxt")  
               .style("opacity",0.0);

            var ctooltip = d3.select("body")
                .append("div")  
                .attr("class","cballtiptxt")  
                .style("opacity",0.0);
                   

              var year=["1","2","3","4","5","6","7"];
              
              var tr = d3.select("tbody").selectAll("tr") //设置行
                        .data(data)
                        .enter().append("tr")
                        .attr("rule",function(d) {return d.rule;})
                        .on("mouseover",function(d){  
                                ctooltip.html(d.rule +"<br />"+d.pDef) 
                                     .style("left", (d3.event.pageX ) + "px")  
                                     .style("top", (d3.event.pageY + 20) + "px")  
                                     .style("opacity",1.0);  
                            
                           })                    
                        .on("mouseout",function(d){  
                                      // 鼠标移出时，将透明度设定为0.0（完全透明）
                                         ctooltip.style("opacity",0.0);  
                           });
                    
                    tr.append("th")
                      .text(function(d) { return d.rule; });
                   
                    var years= new Array(); 
                  
                    for (var i in year){
                        //console.log(year[i]);
                        var obj = new Object();
                        obj.sup = "support"+year[i];
                        obj.con = "confidence"+year[i]; 
                        obj.lift = "lift"+year[i]; 
                        years.push(obj);
                        
                        }
                        
                    tr.selectAll("td")
                        .data(function(d) { 
                            return years.map(function(k){
                            var ob =new Object();
                                ob.sup=d[k.sup];
                                ob.con=d[k.con];
                                ob.lift=d[k.lift];
                            return ob; 
                            }); 
                           }) 
                        .enter().append("td").append("svg")
                        .attr("width", 67.5)
                        .attr("height",45)
                        .append("circle")
                        .attr("support", function(ob) {
                               return ob.sup;
                          })
                        .attr("confidence", function(ob) {
                               return ob.con;
                          })
						 .attr("lift", function(ob) {
                               return ob.lift;
                          })
                        .attr("cx",30)
                        .attr("cy",22.5)
                        .attr("r", function(d) { 
                        if(d.sup == 0||d.sup == null||d.sup <= val){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
						
                        })
                        .attr("fill",function(d){
                             if(d.con ==null){return 0;}else if (d.con <=0.6) {return compute(d.con-0.5);} 
                              else if (d.con>=0.6&&d.con <=0.7) {return compute(d.con-0.3);}  else if (d.con>=0.7&&
                                d.con <=0.8) {return compute(d.con-0.1);} else { return compute(d.con);}  }
                        )
                        .on("mouseover",function(d){  
                                tooltip.html("support: " +d.sup.substring(0, 5) +"<br />"+"confidence: " + d.con.substring(0, 5)+"<br />"+"lift: " + d.lift.substring(0, 5)) 
                                     .style("left", (d3.event.pageX) + "px")  
                                     .style("top", (d3.event.pageY - 60) + "px")  
                                     .style("opacity",1.0);  
                                d3.select(this)
                                  .attr("r",function(d) {  
                                            if(d.sup ==null){ return 0;}else{ return d.sup * 100; }
                                                         }) ;
                           })                    
                       .on("mouseout",function(d){  
    /* 鼠标移出时，将透明度设定为0.0（完全透明）*/  
                                    d3.select(this)
                                      .attr("r",function(d) {  
                                           if(d.sup == 0||d.sup == null||d.sup <= val){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
                                                            });
                                    tooltip.style("opacity",0.0);  
                           });
                                                   
            //点击一行响应
            tr.on("click.first",rule_click)
              .on("click.second",function(){
                d3.selectAll("tr").style("color","black");
                d3.select(this).style("color","orange");
              });
            

    }
     }) };
 function drawCircle2(data,val) {    
    //删掉之前的重新画
    d3.select("body").selectAll("tr").remove();
     d3.selectAll(".itemsetrecgroup").remove();
       d3.selectAll("#calendar_region rect").remove();   
    
    
    d3.csv(data,function(error,data) {
     
            if (error) {
                console.log("loading csvdata error");
            }           
                
            else {    
    
            var tooltip = d3.select("body")
                .append("div")  
                .attr("class","balltiptxt")  
               .style("opacity",0.0);

            var ctooltip = d3.select("body")
                .append("div")  
                .attr("class","cballtiptxt")  
                .style("opacity",0.0);
                   

              var year=["1","2","3","4","5","6","7"];
              
              var tr = d3.select("tbody").selectAll("tr") //设置行
                        .data(data)
                        .enter().append("tr")
                        .attr("rule",function(d) {return d.rule;})
                        .on("mouseover",function(d){  
                                ctooltip.html(d.rule +"<br />"+d.pDef) 
                                     .style("left", (d3.event.pageX ) + "px")  
                                     .style("top", (d3.event.pageY + 20) + "px")  
                                     .style("opacity",1.0);  
                            
                           })                    
                        .on("mouseout",function(d){  
                                      // 鼠标移出时，将透明度设定为0.0（完全透明）
                                         ctooltip.style("opacity",0.0);  
                           });
                    
                    tr.append("th")
                      .text(function(d) { return d.rule; });
                   
                    var years= new Array(); 
                  
                    for (var i in year){
                        //console.log(year[i]);
                        var obj = new Object();
                        obj.sup = "support"+year[i];
                        obj.con = "confidence"+year[i]; 
                        obj.lift = "lift"+year[i]; 
                        years.push(obj);
                        
                        }
                        
                    tr.selectAll("td")
                        .data(function(d) { 
                            return years.map(function(k){
                            var ob =new Object();
                                ob.sup=d[k.sup];
                                ob.con=d[k.con];
                                ob.lift=d[k.lift];
                            return ob; 
                            }); 
                           }) 
                        .enter().append("td").append("svg")
                        .attr("width", 67.5)
                        .attr("height",45)
                        .append("circle")
                        .attr("support", function(ob) {
                               return ob.sup;
                          })
                        .attr("confidence", function(ob) {
                               return ob.con;
                          })
						 .attr("lift", function(ob) {
                               return ob.lift;
                          })
                        .attr("cx",30)
                        .attr("cy",22.5)
                        .attr("r", function(d) { 
                        if(d.sup == 0||d.sup == null){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100+3; }
                        })
                        .attr("fill",function(d){
                             if(d.con ==null||d.con < val){return "white";}else if (d.con <=0.6) {return compute(d.con-0.5);} 
                              else if (d.con>=0.6&&d.con <=0.7) {return compute(d.con-0.3);}  else if (d.con>=0.7&&
                                d.con <=0.8) {return compute(d.con-0.1);} else { return compute(d.con);}  }
                        )
                        .on("mouseover",function(d){  
                                tooltip.html("support: " +d.sup.substring(0, 5) +"<br />"+"confidence: " + d.con.substring(0, 5)+"<br />"+"lift: " + d.lift.substring(0, 5)) 
                                     .style("left", (d3.event.pageX) + "px")  
                                     .style("top", (d3.event.pageY - 60) + "px")  
                                     .style("opacity",1.0);  
                                d3.select(this)
                                  .attr("r",function(d) {  
                                            if(d.sup == 0||d.sup == null){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
                                                         }) ;
                           })                    
                       .on("mouseout",function(d){  
    /* 鼠标移出时，将透明度设定为0.0（完全透明）*/  
                                    d3.select(this)
                                      .attr("r",function(d) {  
                                            if(d.sup == 0||d.sup == null){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
                                                            });
                                    tooltip.style("opacity",0.0);  
                           });
                                                   
            //点击一行响应
            tr.on("click.first",rule_click)
              .on("click.second",function(){
                d3.selectAll("tr").style("color","black");
                d3.select(this).style("color","orange");
              });
            

    }
     }) };
function drawCircle3(data,sin,key_s) {    
    //删掉之前的重新画
    d3.select("body").selectAll("tr").remove();
     d3.selectAll(".itemsetrecgroup").remove();
       d3.selectAll("#calendar_region rect").remove();   

    console.log(sin);
    d3.csv(data,function(error,data) {
     

    data.forEach(function(l,i){ 
        var m=l.rule;
        var regex = new RegExp(",", 'g'); 
        var result = m.match(regex);
        var count = !result ? 2 : result.length+2;

       
        if(dict_cbx["cbx_item_set_"+count] == true){
          
              if (m.indexOf(sin[0])==-1||m.indexOf(sin[1])==-1)    
                {l.isshow=0;}
              else{l.isshow=1;}
                
            }
         });
          function fil(d){
                return d.isshow;
         }

         var newdata=data.filter(fil);

            if (error) {
                console.log("loading csvdata error");
            }           
                
            else {    
    
            var tooltip = d3.select("body")
                .append("div")  
                .attr("class","balltiptxt")  
               .style("opacity",0.0);

            var ctooltip = d3.select("body")
                .append("div")  
                .attr("class","cballtiptxt")  
                .style("opacity",0.0);
                   

              var year=["1","2","3","4","5","6","7"];
              
              var tr = d3.select("tbody").selectAll("tr") //设置行
                        .data(newdata)
                        .enter().append("tr")
                        .attr("rule",function(d) {return d.rule;})
                        .on("mouseover",function(d){  
                                ctooltip.html(d.rule +"<br />"+d.Def) 
                                     .style("left", (d3.event.pageX ) + "px")  
                                     .style("top", (d3.event.pageY + 20) + "px")  
                                     .style("opacity",1.0);  
                            var myDate=new Date();
                            console.log("mouseover rule "+d.rule +"\t"+" time:"+myDate.toLocaleString());///////////////////////////
                           })                    
                        .on("mouseout",function(d){  
                                      // 鼠标移出时，将透明度设定为0.0（完全透明）
                                         ctooltip.style("opacity",0.0);  
                           });
                    
                    //按照不同字段进行排序
                    d3.csv("sort.csv",function(error,sort_a){
                      // console.log(sort_a[0].value);

                    var dic=new Array();
                    for(var i=1;i<(sort_a.length+1);i++){
                       // console.log(sort_a.length);
                        dic[i]=sort_a[i-1].title;
                    }
                    
                    var sort_by=dic[key_s]; //改变这个
                    tr.sort(function(a,b){return d3.descending(a[sort_by],b[sort_by])});
                    var myDate=new Date();///////////
                    console.log("sort  "+sort_by +"\t"+"   time:"+myDate.toLocaleString());
                    }

                    );
                    
                    tr.append("th")
                      .text(function(d) { return d.rule; });
                   
                    var years= new Array(); 
                  
                    for (var i in year){
                        //console.log(year[i]);
                        var obj = new Object();
                        obj.sup = "support"+year[i];
                        obj.con = "confidence"+year[i]; 
                        obj.lift = "lift"+year[i]; 
                        years.push(obj);
                        
                        }
                        
                    tr.selectAll("td")
                        .data(function(d) { 
                            return years.map(function(k){
                            var ob =new Object();
                                ob.ru =d.rule;/////////////////
                                var la=(k.sup).replace("support","");///////////////////
                                ob.yt = la;//////////////////////////////
                                ob.sup=d[k.sup];
                                ob.con=d[k.con];
                                ob.lift=d[k.lift];
                            return ob; 
                            }); 
                           }) 
                        .enter().append("td").append("svg")
                        .attr("width", 67.5)
                        .attr("height", 45)
                        .append("circle")
                        .attr("support", function(ob) {
                               return ob.sup;
                          })
                        .attr("confidence", function(ob) {
                               return ob.con;
                          })
						  .attr("lift", function(ob) {
                               return ob.lift;
                          })
                        .attr("cx",30)
                        .attr("cy",22.5)
                        .attr("r", function(d) { 
                        if(d.sup == 0||d.sup == null){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
                        })
                        .attr("fill",function(d){
                             if(d.con ==null){return 0;}else if (d.con <=0.6) {return compute(d.con-0.5);} 
                              else if (d.con>=0.6&&d.con <=0.7) {return compute(d.con-0.4);}  else if (d.con>=0.7&&
                                d.con <=0.8) {return compute(d.con-0.2);} else { return compute(d.con);}  }
                        )
                        .on("mouseover",function(d){  
                                tooltip.html("support: " +d.sup.substring(0, 5) +"<br />"+"confidence: " + d.con.substring(0, 5)+"<br />"+"lift:"+d.lift.substring(0, 5)) 
                                     .style("left", (d3.event.pageX) + "px")  
                                     .style("top", (d3.event.pageY - 60) + "px")  
                                     .style("opacity",1.0);  
                                d3.select(this)
                                  .attr("r",function(d) {  
                                            if(d.sup == 0||d.sup == null){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
                                                         }) ;
                                var myDate=new Date();
                                console.log("mouseover dot information"+d.ru +'//'+  d.yt+" time:"+myDate.toLocaleString());////////////////
                           })                    
                       .on("mouseout",function(d){  
    /* 鼠标移出时，将透明度设定为0.0（完全透明）*/  
                                    d3.select(this)
                                      .attr("r",function(d) {  
                                            if(d.sup == 0||d.sup == null){ return 0;}else if(d.sup >0.2){return 21;}else{ return d.sup * 100; }
                                                            });
                                    tooltip.style("opacity",0.0);  
                           });
                                                   
            //点击一行响应
            tr.on("click.first",rule_click)
              .on("click.second",function(){
                d3.selectAll("tr").style("color","black");
                d3.select(this).style("color","orange")
              });
            

    }
     }) };
 
