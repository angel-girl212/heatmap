// Kyra Meier
// kmeier@thebentway.ca
// June 25, 2025
// JavaScript for Google Earth Engine

// Mask clouds and display true colour Landsat image

var toronto = ee.FeatureCollection("projects/uhibway/assets/toronto_boundary");
Map.centerObject(toronto, 10);

var gardiner = ee.FeatureCollection("projects/uhibway/assets/UGPRPstudyarea");
Map.centerObject(gardiner, 10);
  
function maskClouds(image) {
  var qaPixel = image.select('QA_PIXEL');
  var cloudBitMask = 1 << 3;
  var shadowBitMask = 1 << 4;
  var snowBitMask = 1 << 5;
  
  var mask = qaPixel.bitwiseAnd(cloudBitMask)
                    .eq(0)
                    .and(qaPixel.bitwiseAnd(shadowBitMask).eq(0))
                    .and(qaPixel.bitwiseAnd(snowBitMask).eq(0));
  return image.updateMask(mask);
}

var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2024-06-22', '2024-09-20')
  .map(maskClouds)
  .filterBounds(toronto);
  
var gar_dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2024-06-22', '2024-09-20')
  .map(maskClouds)
  .filterBounds(gardiner);

// Create scaled true colour composits
var trueColorScaled = dataset.select(['SR_B4', 'SR_B3', 'SR_B2'])
  .map(function(image) {
    return image.multiply(0.0000275).add(-0.2) // scale factor conversion and reflectance offset
                .copyProperties(image, image.propertyNames());
});

var gar_trueColorScaled = gar_dataset.select(['SR_B4', 'SR_B3', 'SR_B2'])
  .map(function(image) {
    return image.multiply(0.0000275).add(-0.2) // scale factor conversion and reflectance offset
                .copyProperties(image, image.propertyNames());
});

// Create visualization parameters
var visualization = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3
};

// Display the mean true-color image clipped to Toronto
Map.addLayer(trueColorScaled.mean().clip(toronto), visualization, 'Toronto True Color');
Map.addLayer(gar_trueColorScaled.mean().clip(toronto), visualization, 'Gardiner True Color');

var trucolour = trueColorScaled.mean().clip(toronto).visualize(visualization);
var gar_trucolour = gar_trueColorScaled.mean().clip(gardiner).visualize(visualization);

// Export as colored GeoTIFF
Export.image.toDrive({
  image: trucolour,
  description: 'test_trucolorexport',
  crs: 'EPSG:4326',
  region: toronto.geometry(),
  scale: 30,
  formatOptions: {
    noData: 0 // set black border to NoData
  }
});

Export.image.toDrive({
  image: gar_trucolour,
  description: 'test_gar_trucolorexport',
  crs: 'EPSG:4326',
  region: gardiner.geometry(),
  scale: 30,
  formatOptions: {
    noData: 0
  }
});