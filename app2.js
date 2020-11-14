
// This needs to be a function
function demoBox(sample){
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
    buildMyguagecharts(dataResult.wfreq);
});
}

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

function buildMybubblecharts(sample){
    d3.json("samples.json").then((data) =>{
        var samples = data.samples;
        var filterArray = samples.filter(samplesObj => samplesObj.id == sample);
        var dataResults =  filterArray[0]

        var otuIds = dataResults.otu_ids;
        var sampleVals = dataResults.sample_values;
        var otuLabels = dataResults.otu_labels;


        // bubble chart
        //var desired_max_marker_size = 100;
        //var size = sampleVals;

        var trace2 = [ {

            x: otuIds,
            y: sampleVals,
            text: otuLabels,
            mode: 'markers',
            type: "scatter",
            marker: {
                color: otuIds,
                colorscale: "Earth",
                size: sampleVals,
                // sizeref: 2.0* Math.max(...size) / (desired_max_marker_size**2),
                // sizemode: 'area'
            }
            
        }];
        // data to be used for the plot
        // var chartData2 = [trace2];

        // Apply the group bubble chart layout options including hoverlabel coloring
        var layout2 = {
            //title: `id: ${id} Bacteria Bubble Chart`,
            xaxis: { title:"OTU ID"},
            // showlegend: false,
            hoverlabel:{
                bgcolor: "black",
                font: {color: 'white'}
            },
            margin: {
            t: 0,
            }
            ,margin: {
            t: 30,
            }
        // Render the plot to the div tag with id "bubble"
        };
        
        Plotly.newPlot("bubble", trace2, layout2);
    });
}

function buildMyguagecharts(frequency){
    var wFreq = parseFloat(frequency);
    //d3.json("samples.json").then((data) =>{
       // var metadata = data.metadata;
      //  var filterArray2 = metadata.filter(metaObj => metaObj.id);
      //  var dataResults2 =  filterArray2[0]

     //   var freqIds = dataResults2.wfreq;
     //   var wFreq = parseFloat(freqIds);
        
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
    };





function buildDropdown(){
    var selectDropdown = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var names = data.names;
  
       names.forEach((sample)=>{
           selectDropdown.append("option").text(sample).attr("value", sample);
        });

        // Trigger change with new sample selection
        var newSample = names[0];
        demoBox(newSample);
        // Graph
        buildMycharts(newSample);
        buildMybubblecharts(newSample);
        buildMyguagecharts(newSample);
    });

};

function optionChanged(Sample){
    demoBox(Sample);
    buildMycharts(Sample);
    buildMybubblecharts(Sample);
    buildMyguagecharts(Sample);
}   

buildDropdown();