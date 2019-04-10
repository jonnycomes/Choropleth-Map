const svg = d3.select("svg");
const path = d3.geoPath();

// map percentage ranges to colors
const shade = function(percentage) {
    return percentage > 50 ? "rgba( 28,  5, 58,1)"  :
           percentage > 40 ? "rgba( 49, 21, 87,1)"  :
           percentage > 30 ? "rgba( 75, 45,115,1)"  :
           percentage > 20 ? "rgba(107, 78,144,1)"  :
           percentage > 10 ? "rgba(143,120,173,1)"  : 
                             "rgba( 75, 45,115,0.5)";
}

// Create tooltip
var div = d3.select("body").append("div")   
    .attr("id", "tooltip")         
    .style("opacity", 0);

// Create map
d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json", function(error, edu) {
    if (error) throw error;
    d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json", function(error, us) {
      if (error) throw error;

      svg.append("g")
         .attr("class", "county-interior")
         .selectAll("path")
         .data(topojson.feature(us, us.objects.counties).features)
         .enter().append("path")
         .attr("class", "county")
         .attr("data-fips", d => d.id)
         .attr("data-education", d => edu.filter(x => (x.fips === d.id))[0].bachelorsOrHigher)
         .attr("data-county", d => edu.filter(x => (x.fips === d.id))[0].area_name)
         .attr("data-state", d => edu.filter(x => (x.fips === d.id))[0].state)
         .attr("fill", d => shade(edu.filter(x => (x.fips === d.id))[0].bachelorsOrHigher))
         .attr("d", path)
         .on("mouseover", function(d) {       
            div.transition()        
                .duration(200)      
                .style("opacity", 0.8);   
            div .attr("data-education", d3.select(this).attr("data-education"))  
                .html(d3.select(this).attr("data-county") + ", " + 
                      d3.select(this).attr("data-state") + ": " + 
                      d3.select(this).attr("data-education") + "%")
                .style("left", (d3.event.pageX + 40) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
         .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
         });
      
      svg.append("path")
         .attr("class", "state-borders")
         .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
    });
});

// Add legend
const legend = d3.select("svg").append("g")
   .attr("id", "legend");

const colors = [
    "rgba( 75, 45,115,0.5)",
    "rgba(143,120,173,1)",
    "rgba(107, 78,144,1)",
    "rgba( 75, 45,115,1)",
    "rgba( 49, 21, 87,1)",
    "rgba( 28,  5, 58,1)"
];
const boundaries = [10, 20, 30, 40, 50];

legend.selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("fill", c => c)
      .attr("x", (c,i) => 540 + 50*i)
      .attr("y", 20)
      .attr("width", 48)
      .attr("height", 15);

legend.selectAll("text")
      .data(boundaries)
      .enter()
      .append("text")
      .attr("fill", "rgba( 28,  5, 58,1)")
      .attr("x", (c,i) => 580 + 50*i)
      .attr("y", 52)
      .text(b => b + "%");
