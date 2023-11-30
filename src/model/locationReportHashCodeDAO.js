"use strict";
var ObjectId = require('mongodb').ObjectId;
var mongo = require('../database/mongo');

module.exports= {
    addLocationReportHashCode: async (location) => {
        const result =  await mongo.LocationReportHashCode.insertOne(location);
        console.log(result);
        return result;
    },
    getLocationReportHashCodeByIdAndReportType: async(locationId,reportType) => {
        const result = await mongo.LocationReportHashCode.findOne({locationId: locationId,reportType:reportType});
        if(result && result.data)
        {
            return result.data;
        }
    },
    deleteLocationReportHashCodeByIdAndReportType: async(locationId,reportType) => {
        return await mongo.LocationReportHashCode.deleteOne({ locationId: locationId,reportType:reportType});
    }
}