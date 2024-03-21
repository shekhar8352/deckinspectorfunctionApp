"use strict";
const TenantDAO = require("../model/tenantsDAO");

var editTenant = async function (companyIdentifier, usedReportSpace) {
    try {
      const result = await TenantDAO.updateReportSpace(companyIdentifier, usedReportSpace);
      if (result.modifiedCount === 1) {
        return {
          success: true,
        };
      }
      return {
        code: 401,
        success: false,
        reason: "No Tenant found with the given ID",
      };
    } catch (error) {
        console.log(`File error: ${error}`)
      return {
        code: 500,
        success: false,
        reason: "Server error"
      }
    }
  };
 var getTenant = async function (companyIdentifier){
  try {
    const result = await TenantDAO.getTenantDetails(companyIdentifier);
    if (result) {
      return {
          success: true,
          tenant: result,
      };
  }
  return {
      code:401,
      success: false,
      reason: 'No tenant found with the given identifier'
  };
  } catch (error) {
      console.log(` error: ${error}`)
    return {
      code: 500,
      success: false,
      reason: "Server error"
    }
  }
 }
  module.exports = {
    editTenant,
    getTenant
  }