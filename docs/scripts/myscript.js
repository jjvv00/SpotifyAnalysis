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
    const svgWidth = 800;
    const svgHeight = 500;

    const margin = { top: 40, right: 20, bottom: 50, left: 70 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // Create an SVG container
    const svg = d3.select("#plot")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    svg.append("rect")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", 1);

    // Add x-axis label
    svg.append("text")
      .attr("x", svgWidth / 2)
      .attr("y", svgHeight - margin.bottom / 4)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Danceability");

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - svgHeight / 2)
      .attr("y", margin.left / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Valence");

    // Add title
    svg.append("text")
      .attr("x", svgWidth/5.5)
      .attr("y", margin.top / 3) // Adjust the y-coordinate as needed
      .style("text-anchor", "middle")
      .style("font-size", "16px") // Adjust the font size as needed
      .style("font-weight", "bold")
      .text("Valence vs. Danceability vs. Energy");


    // Scales for x-axis, y-axis, and circle size
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, svgWidth]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([svgHeight, 0]);
    const sizeScale = d3.scaleLinear().domain([0, 1]).range([2, 7]); // Adjust as needed

    // Colors for artists
    const artistColorMap = {
      'Taylor Swift': "#2274A5",
      "Fleetwood Mac": "#F75C03",
      "Doja Cat": "#D90368",
      "Peso Pluma": "#F1C40F"
    };

    // Create circles for each data point
    const circles = svg.selectAll("circle")
      .data(allData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(+d.danceability))
      .attr("cy", d => yScale(+d.valence))
      .attr("r", d => sizeScale(+d.energy))
      .attr("fill", d => artistColorMap[d.artist_name] || "steelblue")
      .attr("opacity", 0.5);

    // Define a tooltip div
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


    // Add mouseover event to display tooltip
    circles.on("mouseover", function (event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9)
        .style("background-color", "white") // Set background color to white
        .style("color", "black"); // Set text color to black

      tooltip.html(
        `<strong>${d.artist_name}</strong><br>` +
        `<em>${d.track_name}</em><br>` +
        `Album: ${d.album_name}<br>` +
        `Danceability: ${d.danceability}<br>` +
        `Valence: ${d.valence}<br>` +
        `Energy: ${d.energy}`
      )
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    });

    // Add mouseout event to hide tooltip
    circles.on("mouseout", function () {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

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

