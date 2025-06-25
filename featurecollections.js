// Kyra Meier
// kmeier@thebentway.ca
// June 25, 2025
// JavaScript for Google Earth Engine

// View and export feature collections for the Under Gardiner Public Realm Study Area 

// Note: begin with POLYGON files uploaded to G.E.E. ASSETS folder: Gardiner (UGPRP ROI polygon)
// Note: begin with SHAPEFILE or CSV data uploaded to G.E.E. ASSETS folder: City of Toronto Cool Spaces Network and Parks Drinking Fountains (CoT Open Data Portal)
// you may add more features by following this structure

var gardiner = ee.FeatureCollection("projects/uhibway/assets/UGPRPstudyarea");
Map.centerObject(gardiner, 10);

var network = ee.FeatureCollection("projects/uhibway/assets/cot_coolnetwork");

var fountains = ee.FeatureCollection("projects/uhibway/assets/ParksDrinkingFountains");

var gardiner_xway = ee.FeatureCollection("projects/uhibway/assets/gardiner");

var clippedNetwork = network.map(function(feature) {
  return feature.intersection(gardiner.geometry(), ee.ErrorMargin(1));
});

var clippedFountains = fountains.map(function(feature) {
  return feature.intersection(gardiner.geometry(), ee.ErrorMargin(1));
});

var bway = ee.Geometry.Point([-79.40631128698502, 43.63786979217238]); // 250 fort york coordinates for Bentway phase 1

Map.addLayer(clippedNetwork, {color: 'FF0000'}, 'Cool Spaces');
Map.addLayer(clippedFountains, {}, 'Drinking Fountains Parks');
Map.addLayer(bway, {color: 'ff95ee'}, 'The Bentway');
Map.addLayer(gardiner_xway, {color: 'ff95ee'}, 'Gardiner Expressway');

var allFeatures = clippedNetwork
  .merge(clippedFountains)
  .merge(gardiner_xway)
  .merge(gardiner)
  .merge(ee.FeatureCollection([ee.Feature(bway)]));

Export.table.toDrive({
  collection: allFeatures,
  description: 'merged_features_export',
  fileFormat: 'GeoJSON'
});