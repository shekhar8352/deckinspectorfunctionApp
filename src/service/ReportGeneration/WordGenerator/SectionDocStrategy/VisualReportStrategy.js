class VisualReportStrategy extends SectionDocStrategy {
    async generateSectionDocValues() {
        if (this.sectionData.data.item.unitUnavailable) {
            return {
                ...this.baseSectionDocValues,
            };
        }

        const sectionDocValuesWhenUnitAvailable = this.getSectionDocValuesWhenUnitAvailable(this.sectionData);
        return {
            ...this.baseSectionDocValues,
            ...sectionDocValuesWhenUnitAvailable,
        };
    }
}
