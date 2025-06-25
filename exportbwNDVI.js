// Kyra Meier
// kmeier@thebentway.ca
// June 25, 2025
// JavaScript for Google Earth Engine

// Note: begin with POLYGON files uploaded to G.E.E. ASSETS folder: Toronto (regional boundary limit from Open Data Toronto) and Gardiner (UGPRP ROI polygon)
// this is essentially the same as the exportcolourNDVI script but for black and white exports
// the data is still encoded in the output tiff file so you can visualize with colour and scale in an external software (eg. ArcGIS Pro or QGIS)

var toronto = ee.FeatureCollection("projects/uhibway/assets/toronto_boundary");
Map.centerObject(toronto, 10);

var gardiner = ee.FeatureCollection("projects/uhibway/assets/UGPRPstudyarea");
Map.centerObject(gardiner, 10);

var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2024-06-22', '2024-09-20')
  .filterBounds(toronto)
  .map(function(image) {
    var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
    return image.addBands(ndvi);
  });
  
var gard_dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
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

// Display the mean true-color image clipped to Toronto
Map.addLayer(dataset.select('NDVI').mean().clip(toronto), ndviVis, 'Toronto NDVI');
Map.addLayer(gard_dataset.select('NDVI').mean().clip(gardiner), ndviVis, 'Gardiner NDVI');


Export.image.toDrive({
  image: dataset.select('NDVI').mean().clip(toronto),
  description: 'torontondvi_export_nd',
  crs: 'EPSG:4326',
  region: toronto.geometry(),
  scale: 30,
  formatOptions: {
    noData: 255
  }
});

Export.image.toDrive({
  image: gard_dataset.select('NDVI').mean().clip(toronto),
  description: 'gardinerndvi_export_nd',
  crs: 'EPSG:4326',
  region: gardiner.geometry(),
  scale: 30,
  formatOptions: {
    noData: 255
  }
});