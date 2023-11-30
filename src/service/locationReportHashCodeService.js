const LocationReportHashCodeDAO = require("../model/locationReportHashCodeDAO");

let addLocationReportHashCode =  async function (locationReportHashCodeDoc) {
    return await LocationReportHashCodeDAO.addLocationReportHashCode(locationReportHashCodeDoc);
}

let getLocationReportHashCodeByIdAndReportType = async function (projectId,reportType) {
    return await LocationReportHashCodeDAO.getLocationReportHashCodeByIdAndReportType(projectId,reportType);
}

let deleteLocationReportHashCodeByIdAndReportType = async function (projectId,reportType) {
    return await LocationReportHashCodeDAO.deleteLocationReportHashCodeByIdAndReportType(projectId,reportType);
}

module.exports = {
    addLocationReportHashCode: addLocationReportHashCode,
    getLocationReportHashCodeByIdAndReportType: getLocationReportHashCodeByIdAndReportType,
    deleteLocationReportHashCodeByIdAndReportType: deleteLocationReportHashCodeByIdAndReportType
}