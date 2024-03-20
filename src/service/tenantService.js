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

  module.exports = {
    editTenant
  }