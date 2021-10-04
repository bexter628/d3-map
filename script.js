
      var outerWidth  = 1200;
      var outerHeight = 750;
      var margin = { left: 35, top: 30, right: 35, bottom: 30 };

      var xColumn = "longitude";
      var yColumn = "latitude";
      var rColumn = "total";
      var dollarPerPixel = 3;

      var innerWidth  = outerWidth  - margin.left - margin.right;
      var innerHeight = outerHeight - margin.top  - margin.bottom;

      var svg = d3.select("div").append("svg")
        .attr("width",  outerWidth)
        .attr("height", outerHeight);

      var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // groups svg elements together
      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      // parses data
      function type(d){
    
        d.latitude   = +d.latitude;
        d.longitude  = +d.longitude;
        d.total = +d.total;

        return d;
      }

      // sets range in pixels
      var xScale = d3.scaleLinear().range([0, innerWidth]);
      var yScale = d3.scaleLinear().range([innerHeight, 0]);
      var rScale = d3.scaleSqrt();

      
      function render(data){
      
        // sets the domain - loops through data to get max/min for each column
        xScale.domain( d3.extent(data, function (d){ return d[xColumn]; }));
        yScale.domain( d3.extent(data, function (d){ return d[yColumn]; }));
        rScale.domain([0, d3.max(data, function (d){ return d[rColumn]; })]);


        // Compute the size of the biggest circle as a function of dollarPerPixel.
        var dollarMax = rScale.domain()[1];
        var rMin = 0;
        var rMax = Math.sqrt(dollarMax / (dollarPerPixel * Math.PI));
        rScale.range([rMin, rMax]);

        
        var circles = g.selectAll("circle").data(data);
        circles.enter().append("circle");

        circles
          .attr("cx", function (d){ return xScale(d[xColumn]); })
          .attr("cy", function (d){ return yScale(d[yColumn]); })
          .attr("r",  function (d){ return rScale(d[rColumn]); })
          .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html( "ID " + d['id'] + "<br />Total $" + d[rColumn])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function() {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

        circles.exit().remove();
      }
      

      d3.csv("/data.csv", type, render);