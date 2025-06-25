# heatmap
General steps 

Download the shapefile data for your boundaries or whatever other information you want to display (see GEE assets or search Homepage - City of Toronto Open Data Portal ) 

Register and set up Google Earth Engine (GEE) 

Upload data in proper zipped shapefile format (containing .dbf, .prj, .shx, .shp) to Assets folder in GEE 

Create a new script 

Copy your JavaScript code of choice from OneDrive folder GEE scripts 

Paste into your new GEE script 

Change variable names as needed depending on which name you uploaded your feature assets as (step 2) 

Run and address potential errors 

Open right sidebar to view <Tasks>, there you will see your pending exports, run the task and put it in your Google Drive 

Download, view, and share as needed 

 

Elaborating on Step 5: Choose your GEE script 

To view and export Landsat 8 NDVI imagery (bands 4 + 5): 

In colour: exportcolourNDVI.js 

In Black & White: exportbwNDVI.js 

To smooth the Gardiner study area NDVI (seamless tile blending and fine resolution) then view and export: 

-> smoothgardinerNDVI.js 

To view and export City of Toronto data features: 

-> exportfeaturecollections.js 
