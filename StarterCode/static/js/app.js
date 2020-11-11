// Using D3 read in the samples.json file
d3.json("samples.json").then((sampleData) => {
    
    var data = sampleData;


    // Create an array of names
    // var names = data.names;


    // Create an array of objects and push it to the globally available variables
    var metadata = data.metadata;
    var dataArrays= metadata.filter(samplesObj => samplesObj.id == sample);
    var dataResult = dataArrays[0];
    var PANEL = d3.select("#sample-metadata");
    // metadata.forEach(obj => metadataObj.push(obj));
    PANEL.html("");

    // Create an array of objects and push it to the globally available variables
    // var samples = data.samples;
    // samples.forEach(obj => samplesObj.push(obj));
    Object.entries(dataResult).forEach(([key, value])=>{
        PANEL.append('h6').text(`${key}:${value}`);
    })

});


function buildMycharts(sample){
    d3.json("samples.json").then((data) =>{
        var samples = data.samples;
        var filterArray = samples.filter(samplesObj => samplesObj.id == sample);
        var dataResults =  filterArray[0]

        var otuIds = dataResults.otu_ids;
        var sampleVals = dataResults.sample_values;
        var otuLabels = dataResults.otu_labels;

        var idResults = [];
        otuIds.forEach(function (id,i){ 
        var newObj = {};
        newObj.otu_id = id;
        newObj.sample_value = sampleVals[i];
        newObj.otu_label = otuLabels[i];
        idResults.push(newObj);
    

        // Sort the objects by sample_value and then slice the top ten
        var sortedById = idResults.sort((a,b) => b.sample_value - a.sample_value);
        var slicedTopTen = sortedById.slice(0,10);
        var reversedTopTen = slicedTopTen.reverse();
        

        //Top Ten Data
        var trace1 = {
            x: reversedTopTen.map(row => row.sample_value),
            y: reversedTopTen.map(row => `OTU ${row.otu_id}`),
            text: reversedTopTen.map(row => row.otu_label),
            name: `id: ${id}`,
            marker:{
                'color': reversedTopTen.map(row => row.otu_id),
                'colorscale': 'Portland'
            },
            type: "bar",
            orientation: "h"
        };

        // data to be used for the plot
        var chartData = [trace1];

        // group bar mode to the layout
        var layout = {
            title: `id: ${id} Bacteria Presence`,
            hoverlabel:{
                bgcolor: "black",
                font: {color: 'white'}
            },
            margin: {
            l: 70,
            r: 70,
            t: 30,
            b: 100
            }
        };

        Plotly.newPlot("bar-plot", chartData, layout);
        return reversedTopTen;

        });
    });
};
// Create empty arrays to accept the values parsed from the json file
// This is done because the variables are scoped to the d3.json function
// and they must be available to the entire  script
// var metadataObj = [];
// var samplesObj = [];



// build the dropdown options
function buildDropdown(ids){
    var selectDropdown = d3.select("#selDataset");
    for (var i = 0; i <ids.length; i++){
        selectDropdown.append("option").text(ids[i]).attr("value",ids[i]);
    }

};

//filter the records using a single id from drop down selection
function filterRecords(records,id){
    return records.filter(record => +record.id === +id);
    console.log(records.id === id);
}

//bar chart function
// use id,  gets sample_values array, otu_id array
// and otu_labels array and create a new array holding all three values
// sort in descending order and then slice the top 10 objecta
function plotTopTen(samples,id){
    // id to filter Samples from the dataset
    var focusSample = filterRecords(samples,id);
    // get values associated with id and put in array
    var otuIds = focusSample[0].otu_ids;
    var sampleVals = focusSample[0].sample_values;
    var otuLabels = focusSample[0].otu_labels;

     // create array to sort sample objects in desc order
     // get the top 10 objects
     var idResults = [];
     otuIds.forEach(function (id,i){ 
        var newObj = {};
        newObj.otu_id = id;
        newObj.sample_value = sampleVals[i];
        newObj.otu_label = otuLabels[i];
        idResults.push(newObj);
    });

    // Sort the objects by sample_value and then slice the top ten
    var sortedById = idResults.sort((a,b) => b.sample_value - a.sample_value);
    var slicedTopTen = sortedById.slice(0,10);
    var reversedTopTen = slicedTopTen.reverse();
    

      //Top Ten Data
    var trace1 = {
        x: reversedTopTen.map(row => row.sample_value),
        y: reversedTopTen.map(row => `OTU ${row.otu_id}`),
        text: reversedTopTen.map(row => row.otu_label),
        name: `id: ${id}`,
        marker:{
            'color': reversedTopTen.map(row => row.otu_id),
            'colorscale': 'Portland'
        },
        type: "bar",
        orientation: "h"
    };

    // data to be used for the plot
    var chartData = [trace1];

    // group bar mode to the layout
    var layout = {
        title: `id: ${id} Bacteria Presence`,
        hoverlabel:{
            bgcolor: "black",
            font: {color: 'white'}
        },
        margin: {
        l: 70,
        r: 70,
        t: 30,
        b: 100
        }
    };

    Plotly.newPlot("bar-plot", chartData, layout);
    return reversedTopTen;
}

// get the metadata object using a passed id value and the 
// array of all metadata objects
function buildDemoData(metadata,id){
    // filter the array of metadata objects from the dataset
    var focusMetaData = filterRecords(metadata,id);

    var selectMetaID = d3.select("#sample-metadata").html("");
    
    // iterate through the metadata object and create an <h6> html element
    // for each key:value pair
    for(let [key, value] of Object.entries(focusMetaData[0])){
        selectMetaID.append("h6").text(`${key}: ${value}`);
    }

    return focusMetaData;
};

//bubble chart
function plotBubbleChart(samples,id){
    //filter the array of Sample objects from the dataset
    var focusSample = filterRecords(samples,id);

    var otuIds = focusSample[0].otu_ids;
    var sampleVals = focusSample[0].sample_values;
    var otuLabels = focusSample[0].otu_labels;

     var desired_max_marker_size = 100;
     var size = sampleVals;

    var trace1 = {

        x: otuIds,
        y: sampleVals,
        text: otuLabels,
        name: `id: ${id}`,
        mode: 'markers',
        marker: {
            color: otuIds,
            colorscale: "Portland",
            size: size,
            sizeref: 2.0* Math.max(...size) / (desired_max_marker_size**2),
            sizemode: 'area'
        }
    };

    // data to be used for the plot
    var chartData = [trace1];

    // Apply the group bubble chart layout options including hoverlabel coloring
    var layout = {
        title: `id: ${id} Bacteria Bubble Chart`,
        xaxis: {
            title:{
            text:"OTU ID"
        }},
        showlegend: false,
        hoverlabel:{
            bgcolor: "black",
            font: {color: 'white'}
        },
        margin: {
        l: 30,
        r: 30,
        t: 30,
        b: 100
        }
    };

    // Render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", chartData, layout);
}

// A gauge chart is added to indicate the number of scrubs per week
function plotGaugeChart(metadata,id){
    // Use the passed id to filter the array of Sample objects from the dataset
    var focusMetaData = filterRecords(metadata,id);


    // the washing frequency is parsed from the object
    var wFreq = parseFloat(focusMetaData[0].wfreq);


    // the data for the gauge chart (indicator) is created
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: wFreq,
          title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font: { size: 24 } },
          // delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
          gauge: {
            axis: { range: [null, 10], tickwidth: 2, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "lightseagreen" },
              { range: [1, 2], color: "mediumspringgreen" },
              { range: [2, 3], color: "lightgreen" },
              { range: [3, 4], color: "yellowgreen" },
              { range: [4, 5], color: "darkseagreen" },
              { range: [5, 6], color: "mediumseagreen" },
              { range: [6, 7], color: "seagreen" },
              { range: [7, 8], color: "forestgreen" },
              { range: [8, 9], color: "green" },
              { range: [9, 10], color: "darkgreen" },
            ]
          }
        }
      ];
      
      var layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
      };
      
      // Render the plot to the div tag with id "gauge"
      Plotly.newPlot('gauge', data, layout);
}






// Function that is called when a new value is selected in the index.html file for
// the select with id=selDataset 
// This function refreshes the html page with new values chosen from the dropdown
function optionChanged(id){
    console.log(id),
    buildDemoData(metadataObj,id),
    plotTopTen(samplesObj,id);
    plotBubbleChart(samplesObj,id);
    plotGaugeChart(metadataObj,id);
}
