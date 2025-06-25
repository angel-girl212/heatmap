// Kyra Meier
// kmeier@thebentway.ca
// June 25, 2025
// JavaScript
// Google Earth Engine

// Smooth and export Gardiner region NDVI data
// Note: begin with POLYGON files uploaded to G.E.E. ASSETS folder: Gardiner (UGPRP ROI polygon)

var gardiner = ee.FeatureCollection("projects/uhibway/assets/UGPRPstudyarea");
Map.centerObject(gardiner, 10);

var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2024-06-22', '2024-09-20')
  .filterBounds(gardiner)
  .map(function(image) {
    var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
    return image.addBands(ndvi);
  });

var ndviVis = {
  bands: ['NDVI'],
  min: -0.2,
  max: 0.8,
  palette: ['red', 'yellow', 'green']
};

// create kernel for neighbourhood analysis
var kernel = ee.Kernel.square({
  radius: 30,  // adjust for Landsat resolution (~30m pixels)
  units: 'meters'
});

var meanNDVI = dataset.select('NDVI').mean().clip(gardiner);

var smoothedNDVI = meanNDVI.convolve(kernel);

Map.addLayer(smoothedNDVI, ndviVis, 'Smoothed NDVI');

// export image in black and white
Export.image.toDrive({
  image:smoothedNDVI,
  description: 'smoothedndvi_export',
  crs: 'EPSG:4326',
  region: gardiner.geometry(),
  scale: 5, // very fine resolution for blurred effect
  formatOptions: {
    noData: 255 // setting black background pixels to nodata
  }
});