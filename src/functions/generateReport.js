const { app } = require('@azure/functions');
const mongo = require('../database/mongo');
const {generateProjectReport,getProjectHtml}= require('../service/projectreportgeneration');
const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const projectReports = require("../model/projectReports");
const uploadBlob = require("../database/uploadimage");
const path = require('path');
const fs = require('fs');
const os = require('os');
require("dotenv").config();
mongo.Connect();
app.http('generateReport', {
    
    trigger:{
        methods: [ 'POST'],
        authLevel: 'anonymous',
        name: "generateReport",
        type: "httpTrigger",
        direction: "in",
    },
    return:{
        type: "http",
        direction: "out",
        name: "res"
    },
    
    handler: async (req,  context) => {
        context.log(`Http function processed request for url "${req.url}"`);
        context.log(context );
        const parsedData = await req.json();
        
        
    try{
        const outputDir = path.join(os.tmpdir(), "projectreportfiles")
            if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
            }
        const projectId = parsedData.id;
        const sectionImageProperties = parsedData.sectionImageProperties;
        const companyName = parsedData.companyName;
        const reportType = parsedData.reportType;
        const reportFormat = parsedData.reportFormat;
        // const requestType = req.body.requestType;
        // const reportId = uuidv4();
        // console.log(`reportID: ${reportId}`);
        const projectName = parsedData.projectName;
        var projectReportId;
        const uploader = parsedData.user;
        // const docpath = `${projectName}_${reportType}_${reportId}`;
        
            const now = new Date();
            const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
            const docpath = path.join(outputDir,`${projectName}_${reportType}_${timestamp}`);
            let project_id = projectId;
            let name = projectName;
            context.log(response);
            let reporttimestamp = (new Date(Date.now())).toISOString();
            projectReports.addProjectReport({
            project_id,
            name,
            url:"",
            reportType,
            isReportInProgress:true,
            uploader,
            timestamp:reporttimestamp
            },function(err,result){
                if (err) { 
                    context.log(err)
                }
                if (result){
                    if (result._id===undefined) {
                        projectReportId = result.insertedId;
                    }else{
                        projectReportId = result._id;
                    }
                    
                    context.log(result)
                }
            });
            context.res= {               
                status: 200,
                body: {
                    message: 'Generating report'
                }
            };
            
            await generateProjectReport(projectId,sectionImageProperties,companyName,reportType, reportFormat, docpath);
            const absolutePath = path.resolve(`${docpath}.${reportFormat}`);
            console.log(absolutePath);
            const containerName = projectName;
            const uploadOptions = {
            metadata: {
                'uploader': uploader,
            },
            tags: {
                'project': containerName,
                'owner': projectName
            }
        };
            const newContainerName = containerName.replace(/\s+/g, '').toLowerCase();
            const fileName = `${projectName}_${reportType}_${timestamp}.${reportFormat}`;
            const newfileName = fileName.replace(/\s+/g, '').toLowerCase();
            var result = await uploadBlob.uploadFile(newContainerName, newfileName, absolutePath, uploadOptions);
            var response = JSON.parse(result);
            if (response.error) {
                //responseError = new ErrorResponse(500, 'Internal server error', result.error);
                context.log(response);
                // res.status(500).json(responseError);
                return;
            }
            if (response.message) {
            fs.unlinkSync(absolutePath);
                //Update images Url
                let url = response.url;
                //update report
                projectReports.updateProjectReport({
                    _id:projectReportId,
                    project_id,                   
                    url,
                    isReportInProgress:false                   
                    },function(err,result){
                        if (err) { 
                            context.log(err)
                        }
                        if (result){
                            //context.log(result)
                        }
                    });
                context.log(projectId);
                context.log('report uploaded');
            }
            // else
            //     res.status(409).json(response);      
        } catch (err) {
            context.error('Error generating Report:', err);
        //return res.status(500).send('Error generating Report');
        }
    }
});
