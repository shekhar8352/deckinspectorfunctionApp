
const ObjectId = require('mongodb').ObjectId;
const mongo = require('../database/mongo');

module.exports = {
    updateReportSpace: async (companyIdentifier, usedReportSpace) => {
        return await mongo.Tenants.updateOne({ 'companyIdentifier': companyIdentifier }, { $inc: { 'usedReportSpace': usedReportSpace, 'reportCount': 1  }});
    },

    getTenantDetails :async (companyIdentifier)=>{
        return await mongo.Tenants.findOne({'companyIdentifier': companyIdentifier});
    }
};
