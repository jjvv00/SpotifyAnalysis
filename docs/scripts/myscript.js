// add your JavaScript/D3 to this file
// Set up a basic 3D scene

// Load data asynchronously using d3.csv()
Promise.all([
  d3.csv("https://raw.githubusercontent.com/jjvv00/SpotifyAnalysis/main/data/DC.csv"),
  d3.csv("https://raw.githubusercontent.com/jjvv00/SpotifyAnalysis/main/data/PP.csv"),
  d3.csv("https://raw.githubusercontent.com/jjvv00/SpotifyAnalysis/main/data/FM.csv"),
  d3.csv("https://raw.githubusercontent.com/jjvv00/SpotifyAnalysis/main/data/TS.csv")
])
  .then(function(dataArray) {
    // Concatenate all data arrays into a single array
    const allData = dataArray.reduce((acc, data) => acc.concat(data), []);

    // Set up the SVG dimensions
    const svgWidth = 500;
    const svgHeight = 400;

    // Create an SVG container
    const svg = d3.select("#plot")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Scales for x-axis, y-axis, and circle size
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, svgWidth]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([svgHeight, 0]);
    const sizeScale = d3.scaleLinear().domain([0, 1]).range([5, 20]); // Adjust as needed

    // Create circles for each data point
    svg.selectAll("circle")
      .data(allData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(+d.danceability))
      .attr("cy", d => yScale(+d.valence))
      .attr("r", d => sizeScale(+d.energy))
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);

    // Add axis labels
    svg.append("text")
      .attr("transform", "translate(" + (svgWidth / 2) + " ," + (svgHeight + 30) + ")")
      .style("text-anchor", "middle")
      .text("Danceability");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 40)
      .attr("x", 0 - (svgHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Valence");


  })
  .catch(function(error) {
    console.error("Error loading data:", error);
  });

