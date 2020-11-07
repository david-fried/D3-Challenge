// I worked with Erin Wills (TA) and the following people: Corrine Ptacek, Nicole Langford, Naomi Scully, Rui Lin, Rob Welling, Beth Hakamy, Paule Nguendang, Kena Jackson
// Remember to comment your code as we discuss it.  Commenting the code is required.
// Prior to starting, make sure  you have already created and cloned your repo.



// Refer to the pdf diagram to see the visual relationship of the code

// Layout of this document
// 1.  Data Exploration (always do this; understand its structure)
// 2.  Define Functions (a and e used in page load, a through e used in click event)
//      a.  xScale(dataset, chosenXAxis):  Scales data to svg width (var width defined in Section 3: Setup SVG )
//              inputs:  (data like "dataset", an axis name like "obesity")
//              returns:  scaled data function
//      b.  renderAxes(newXScale, xAxis): Uses the xScale function and sets new x-axis values
//              inputs:  (function like "xLinearScale", object like xAxis)
//              outputs:  returns new xAxis values
//      c.  renderCircles(circlesGroup, newXScale, chosenXAxis):  Takes an object like "circlesGroup" and scales data of a given axis and assigns it to the objects attribute "cx"
//              inputs:  (object like "circlesGroup", a function like "xLinearScale", a specified axis name like "chosenXAxis" (ie "obesity"))
//              outputs:  returns an updated circlesGroup object with new x values
//      d.  **new** rendertextCircles(textcirclesGroup, newXScale, chosenXAxis)
//              inputs: (objects like "textcirclesGroup", function like "xLinearScale", a specified axis name like "chosenXAxis" (ie "obesity"))
//              outputs:  returns an updated textcirclesGroup object with new labels
//      e.  updateToolTip:  updates circlesGroup with textbox messages
//              inputs:  (a specified axis name like "chosenXAxis", objects like "circlesGroup")
//              outputs:  calls the D3 function tip() that helps automate the tooltip message generation - returns html that is assigned to circlesGroup and has mouseover, mouseout interactivity
// 3.  Setup SVG
// 4.  BRING in Data and ADD Structure /layout
//      a.  convert data to numericals
//      b.  scale and assign axis
//      c.  create circlsGroupAll object and circlesGroup and textcirclesGroup object
//      d.  create 2 x-label groups, one y-label group, one albumGroup, one tooltip group
// 5. ADD updates upon clicking axis text  
//      a. Reassign these objects with new values after click
//          i.  xLinearScale
//          ii. xAxis
//          iii. circlesGroup
//          iv. textcirclesGroup
//          v.  circlesGroup/tooltip
//          vi.  x-axis styling 





// #######################  1.  Data Exploration  ################ //
// CSV file shows that
//  Data has following columns:  rockband, obesity, poverty, num_albums
//  Once read by d3.csv then it is like an array of 20 objects as key-value pair format so I will need to use foreach or arrow functions to get arrays
//  console.log(dataset) see below after d3.csv






// #################### 2.  Define Function ###############//
// function used for updating x-scale var upon click on axis label
// scaling function: https://www.d3indepth.com/scales/
function xScale(dataset, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d[chosenXAxis]) * 0.9, //affects axis
        d3.max(dataset, d => d[chosenXAxis]) * 1.1 //affects axis
      ])
      .range([0, width]);  //width define at beginning of main code
  
    return xLinearScale;
  
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  // Added by Erin
  // Note:  as compared to renderCircles, the attr iterator needs to match what is created initially
  // So above I use "cx" and below I use "x" -  this must match where I defined it in line 146 and line 155
  function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis) {
  
      textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));
    
      return textcirclesGroup;
    }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {
  
    var label;
  
    if (chosenXAxis === "obesity") {
      label = "Obesity:";
    }
    else {
      label = "# of Albums:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip") //"toottip corresponds to the .tooltip in CSS file"
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}%<br>Poverty: ${d.poverty}%`);
      });
    
    //Note:  Below circlesGroup is having the tooltip added but other objects could also have the tool tip added
    // I could add the functionality below because for some reason a second called object as long as an input will work despite not being returned
    // or call this function with a different object as its focus (input) instead of circlesGroup; the 2nd option is probably better  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data, index, element) {
      toolTip.show(data, element[index]);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }





//########################  3.  SVG Setup ###################################//

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// xScale uses width so xScale() can only be called below this point
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);






// #################### 4.  BRING in Data and ADD Structure ###############//

// Initial Params - includes any axis selection that has multiple options
var chosenXAxis = "obesity";


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(dataset, err) {
  if (err) throw err;
   
  // parse data - set values to numerical data types
  dataset.forEach(function(data) {
    data.obesity = +data.obesity; // x-axis
    data.poverty = +data.poverty; // y-axis
    data.state = data.state;
    data.abbr = data.abbr;
    // data.num_albums = +data.num_albums; // extra x-axis
  });

  // Data Exploration (Section 1)
  // console.log(dataset)

  // xLinearScale function above csv import; Note:  xLinearScale is functioncontains scaled data specific to the defined axis
  // Important note:  xScale uses width that is defined above; xScale can only be called below width in the code
  // scaling function: https://www.d3indepth.com/scales/
  var xLinearScale = xScale(dataset, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.poverty)*0.9, d3.max(dataset, d => d.poverty)*1.1])
    .range([height, 0]);

  // Create initial axis functions; generates the scaled axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis; adds x axis chart data tick marks to chartgroup
  // for future axis value changes then the renderAxes() function needs called
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // New by Erin - provide data first to object 
  // case is important - selectAll() works but SelectAll() would produce a type error - the capitalizaton makes a difference
  var circlesGroupAll = chartGroup.selectAll("circlesGroup").data(dataset).enter();

  // modfied by Erin - data is already bound to circlesGroupAll and now I am adding the 'circles' with one circle for each data
  // note that the attributes are "cx" and "cy"; the data is being scaled by the scaling functions defined above; see it is a function
  // the centers of the circles are also coming from the specific x data group 'chosenXAxis'
  // append initial circles
  var circlesGroup = circlesGroupAll
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 20)
    .attr("class", "stateCircle")

  // added by Erin - I wanted to add text to the circles - probably several ways of doing this but here is one.
  // data is bound to ciclesGroupAll like above and now I add a text element at "x" and "y", not the difference from above.
  // added round function to make the numbers in the cirlces have no decimals; this is a random data selection; I just wanted something inside the circles. If you want to see why these values are like they are then you need to back-calculate what xScale and transpose is doing
  var textcirclesGroup = circlesGroupAll
    .append("text")
    .text((d) => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.poverty)+5)
    .attr("class", "stateText")
  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity");

  // var albumsLabel = labelsGroup.append("text")
  //   .attr("x", 0)
  //   .attr("y", 40)
  //   .attr("value", "num_albums") // value to grab for event listener
  //   .classed("inactive", true)
  //   .text("# of Albums Released");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left / 2)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Poverty");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  var textcirclesGroup = updateToolTip(chosenXAxis, textcirclesGroup);





// #################### 5.  ADD updates upon clicking axis text  ###############//

  // x axis labels event listener
  // if you comment out the entire labelsGroup section then you can see that the plot populates but does not update when selecting the axis
  // note that above this section, only the updateToolTip and xScale functions are called of all the user created functions at the top of the script
  // the other functions at the top of the page are used to re-define the data applied to the xLinearScale function, xAxis object, circlesGroup object, textcirclesGroup object, circlesGroup object
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(dataset, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        // New - updates text labels within circles
        textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
