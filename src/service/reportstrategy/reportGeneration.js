const {generateReportForSubProject,generateDocReportForSubProject} = require("../subprojectreportgeneration.js");
const {generateReportForLocation,generateDocReportForLocation} = require("../sectionParts/util/locationGeneration/locationreportgeneration.js")
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const ProjectChildType = require("../../model/projectChildType.js");
const ProjectReportType = require("../../model/projectReportType.js");
const filePath = path.join(__dirname, 'projectfile.ejs');
const template = fs.readFileSync(filePath, 'utf8');
const docxTemplate = require('docx-templates');
const blobManager = require("../../database/uploadimage");
const jo = require('jpeg-autorotate');
const os = require('os');
const sharp = require('sharp');
var tenantService = require('../tenantService.js');
class ReportGeneration{
    async generateReportDoc(project,companyName,sectionImageProperties,reportType){
        try{
         //   console.time("generateReportDocs");
            
            const promises = [];
            const reportDocList = []; 
            project.data.item.projectHeader = this.getProjectHeader(reportType);
            
            //create project header docx
            var template;

            
            var website='';
            var headerImageURL ='';
            var footerImageURL ='';
            var createdBy ='E3 Inspection Reporting Solutions.';
            var template = fs.readFileSync(path.join(__dirname,'DeckProjectHeader.docx'));
            
            var tenantDetails = await tenantService.getTenant(companyName);
            if (tenantDetails.success) {
                website = tenantDetails.tenant.website;
                headerImageURL = tenantDetails.tenant.icons.header;
                createdBy =tenantDetails.tenant.name;
                footerImageURL = tenantDetails.tenant.icons.footer;
            }
            var createdAtString = project.data.item.createdat;
            var date = new Date(createdAtString);
            const buffer = await docxTemplate.createReport({
            template,
            data: {
                project:{
                    footerText:  website,
                    reportType: reportType,
                    name: project.data.item.name,
                    address: project.data.item.address,
                    description:project.data.item.description,
                    createdBy:createdBy,
                    createdAt : date.toLocaleString(),
                    
                }               
            },
            additionalJsContext: {
                tile: async () => {
                    var projurl = project.data.item.url===''?'https://deckinspectorsappdata.blob.core.windows.net/highlandmountainshadow/image_1.png':
                    project.data.item.url;

                    var urlArray = projurl.toString().split('/');
                    var imageBuffer ;
                    if (projurl.includes('deckinspectorsappdata')) {
                        imageBuffer = await blobManager.getBlobBuffer(urlArray[urlArray.length-1],urlArray[urlArray.length-2]);
                    }else{
                        imageBuffer = await blobManager.getBlobBufferFromOld(urlArray[urlArray.length-1],urlArray[urlArray.length-2]);
                    }
                    
                    if (imageBuffer===undefined) {
                      console.log('Failed to load image .');
                      return;
                    }
                  
                  const extension  = path.extname(projurl);
                  try {
                    var {buffer} = await jo.rotate(Buffer.from(imageBuffer), {quality:100});
                    
                    return { height: 15,width: 19.8,  data: buffer, extension: '.jpg' };
                  } catch (error) {
                    //console.log('An error occurred when rotating the file: ' + error);
                    return { height: 15,width: 19.8,  data: imageBuffer, extension: '.jpg' };
                  }                                                  
                },
                headertile: async () => {
                    //replace this URL with the tenants header URL.
                    var projurl = headerImageURL===''?'https://deckinspectorsappdata.blob.core.windows.net/highlandmountainshadow/image_1.png':
                    headerImageURL;

                    var urlArray = projurl.toString().split('/');
                    var imageBuffer ;
                    if (projurl.includes('deckinspectorsappdata')) {
                        imageBuffer = await blobManager.getBlobBuffer(urlArray[urlArray.length-1],urlArray[urlArray.length-2]);
                    }else{
                        imageBuffer = await blobManager.getBlobBufferFromOld(urlArray[urlArray.length-1],urlArray[urlArray.length-2]);
                    }
                    
                    if (imageBuffer===undefined) {
                      console.log('Failed to load image .');
                      return;
                    }
                  
                  const extension  = path.extname(projurl)
                  try {
                    
                    //var {buffer} = await jo.rotate(Buffer.from(imageBuffer), {quality:100});
                    
                    var rotatedBuffer =  sharp(imageBuffer).rotate();
                    var imagemeta = await rotatedBuffer.metadata();
                    var aspectRatio = (imagemeta. height / imagemeta. width );
                    if (imagemeta.width>imagemeta.height) {
                        
                        var resizedheight = aspectRatio * 4.23;
                        const resizedImage = await rotatedBuffer.resize(160,parseInt(160*aspectRatio),{fit:'outside'})
                           .toBuffer();
                        
                        return { height: resizedheight,width: 4.23,  data: resizedImage, extension: '.jpg' };
                    }else{
                        var resizedheight = aspectRatio * 3.175;
                        const resizedImage = await rotatedBuffer.resize(120,parseInt(120*resizedheight),{fit:'outside'})
                            .toBuffer();
                        
                        return { height: resizedheight,width: 3.175,  data: resizedImage, extension: '.jpg' };
                    }

                  } catch (error) {
                    
                    console.log('An error occurred when rotating the file: ' + error);
                    
                  }                                                  
                },
                footertile: async () => {
                    //replace this URL with the tenants header URL.
                    var projurl = footerImageURL===''?'https://deckinspectorsappdata.blob.core.windows.net/highlandmountainshadow/image_1.png':
                    footerImageURL;

                    var urlArray = projurl.toString().split('/');
                    var imageBuffer ;
                    if (projurl.includes('deckinspectorsappdata')) {
                        imageBuffer = await blobManager.getBlobBuffer(urlArray[urlArray.length-1],urlArray[urlArray.length-2]);
                    }else{
                        imageBuffer = await blobManager.getBlobBufferFromOld(urlArray[urlArray.length-1],urlArray[urlArray.length-2]);
                    }
                    
                    if (imageBuffer===undefined) {
                      console.log('Failed to load image .');
                      return;
                    }
                  
                  const extension  = path.extname(projurl)
                  try {                   
                    var rotatedBuffer =  sharp(imageBuffer).rotate();                    
                    const resizedImage = await rotatedBuffer.resize(100,100,{fit:'outside'})
                        .toBuffer();    
                    return { height: resizedheight,width: 2.64,  data: resizedImage, extension: '.jpg' };
                    
                  } catch (error) {                    
                    console.log('An error occurred when rotating the file: ' + error);                    
                  }                                   
                },
               
              },
            });
            const outputDir = path.join(os.tmpdir(), "projectreportfiles")
            if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
            }
            var filePath = path.join(outputDir,'projectheader.docx');
            fs.writeFileSync(filePath, buffer);
            let projectHtml = [filePath];
            const orderedProjects = this.reOrderProjects(project.data.item.children);
            for (let key in orderedProjects) {
                const promise = this.getReportDoc(orderedProjects[key],companyName,sectionImageProperties,reportType)
                .then((loc_doc) => {
                 
                 reportDocList[key]=loc_doc;
                });
              promises.push(promise);
            }
            await Promise.all(promises);
            
            for (let key in reportDocList) {
                projectHtml.push(...reportDocList[key]);
            }
            //console.timeEnd("generateReportDoc");
            return projectHtml;
            
        }
        catch(err){
            console.log(err);
        }
    }

    
    

    async generateReportHtml(project,sectionImageProperties,reportType){
        try{
            console.time("generateReportHtml");
            const promises = [];
            const locsHtmls = []; 
            project.data.item.projectHeader = this.getProjectHeader(reportType);
            let projectHtml = ejs.render(template, project.data.item);
            const orderedProjects = this.reOrderProjects(project.data.item.children);
            for (let key in orderedProjects) {
                const promise = this.getReport(orderedProjects[key],sectionImageProperties,reportType)
                .then((loc_html) => {
                 locsHtmls[key] = loc_html;
                });
              promises.push(promise);
            }
            await Promise.all(promises);
            
            for (let key in locsHtmls) {
                projectHtml += locsHtmls[key];
            }
            console.timeEnd("generateReportHtml");
            return projectHtml;
        }
        catch(err){
            console.log(err);
        }
    }

    reOrderProjects (projects){
        const orderedProjects = [];
        const subProjects = [];
        const locations = [];
        for(let key in projects)
        {
            if(projects[key].type === ProjectChildType.SUBPROJECT)
            {
                subProjects.push(projects[key]);
            }else if(projects[key].type === ProjectChildType.PROJECTLOCATION){
                locations.push(projects[key]);
            }
        }
        subProjects.sort(function(subProj1,subProj2){
            console.log(subProj1.sequenceNo);
            if (subProj1.sequenceNo===null||subProj1.sequenceNo===undefined) {
                return subProj1._id-subProj2._id;
            }else{
                return (subProj1.sequenceNo-subProj2.sequenceNo);
            }
            
        });
        locations.sort(function(loc1,loc2){
            console.log(loc1.sequenceNo);
            if (loc1.sequenceNo===null||loc1.sequenceNo===undefined) {
                return (loc1._id-loc2._id);
            }else{
                return (loc1.sequenceNo-loc2.sequenceNo);
            }
            
        });
        orderedProjects.push(...subProjects);
        orderedProjects.push(...locations);
        return orderedProjects;
    }
    
    async getReportDoc(child,companyName,sectionImageProperties,reportType){
        try{
            if(child.type === ProjectChildType.PROJECTLOCATION)
            {
                const loc_html =  await generateDocReportForLocation(child._id,companyName,sectionImageProperties,reportType);
                return loc_html;
            }else if(child.type ===  ProjectChildType.SUBPROJECT){
                const subProjectHtml = await generateDocReportForSubProject(child._id,companyName,sectionImageProperties,reportType);
                return subProjectHtml;
            }
        }catch(error){
            console.log(error);
        }
    }
    
    async getReport(child,sectionImageProperties,reportType){
        try{
            if(child.type === ProjectChildType.PROJECTLOCATION)
            {
                const loc_html =  await generateReportForLocation(child._id,sectionImageProperties,reportType);
                return loc_html;
            }else if(child.type ===  ProjectChildType.SUBPROJECT){
                const subProjectHtml = await generateReportForSubProject(child._id,sectionImageProperties,reportType);
                return subProjectHtml;
            }
        }catch(error){
            console.log(error);
        }
    }


     getProjectHeader(reportType){
        if(ProjectReportType.VISUALREPORT === reportType)
        {
            return "Visual Inspection Report";
        }
        else if(ProjectReportType.INVASIVEONLY === reportType)
        {
            return "Invasive only Project Report";
        }
        else if(ProjectReportType.INVASIVEVISUAL === reportType)
        {   
            return "Invasive Project Report";
        }
     }
}

module.exports = new ReportGeneration();