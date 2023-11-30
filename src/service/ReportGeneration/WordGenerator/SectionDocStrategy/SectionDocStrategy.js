class SectionDocStrategy {
    constructor(baseSectionDocValues, sectionData, sectionId, location, reportType) {
        this.baseSectionDocValues = baseSectionDocValues;
        this.sectionData = sectionData;
        this.sectionId = sectionId;
        this.location = location;
        this.reportType = reportType;
    }

    async generateSectionDocValues() {
        // This method will be implemented by concrete strategies.
    }
}