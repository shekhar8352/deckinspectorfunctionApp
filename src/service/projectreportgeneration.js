"use strict";
const { generatePdfFile } = require("./generatePdfFile");
const ReportGeneration = require("./reportstrategy/reportGeneration.js")
const SingleProjectReportGeneration = require("./reportstrategy/singleProjectReportGeneration.js")
const projects = require("../model/project");
const DocxMerger = require("docx-merger");
const fs = require('fs');
const os = require('os');
const path = require('path');
const GenerateReport = require("./ReportGeneration/GenerateReport.js")


const generateProjectReport = async function generate(projectId,sectionImageProperties,companyName,reportType,
    reportFormat, fileName)
{
    try{
        const project  = await projects.getProjectById(projectId);
        
        // const fileName = project.data.item.name.split(' ').join('_') + "_"+ reportType;
        if (reportFormat==='pdf') {
            const projectHtml =  await getProjectHtml(project, sectionImageProperties, reportType);
            const path = await generatePdfFile(fileName,projectHtml,companyName);
            // callback( path);
        }else{
            return await GenerateReport.generateReport(projectId,reportType);
        }
        
    }
    catch(err){
        console.log(err);
    }
};

async function getProjectDoc(project, sectionImageProperties,companyName, reportType,reportFormat='pdf') {
    if (project.data.item.projecttype === "singlelevel") {
       return await SingleProjectReportGeneration.generateReportDoc(project,companyName, sectionImageProperties, reportType);
    }
    else if (project.data.item.projecttype  === "multilevel") {
       return await ReportGeneration.generateReportDoc(project,companyName, sectionImageProperties, reportType);
    }
};

async function getProjectHtml(project, sectionImageProperties, reportType) {
    if (project.data.item.projecttype === "singlelevel") {
       return await SingleProjectReportGeneration.generateReportHtml(project, sectionImageProperties, reportType);
    }
    else if (project.data.item.projecttype  === "multilevel") {
       return await ReportGeneration.generateReportHtml(project, sectionImageProperties, reportType);
    }
};

module.exports = { generateProjectReport,getProjectHtml};


