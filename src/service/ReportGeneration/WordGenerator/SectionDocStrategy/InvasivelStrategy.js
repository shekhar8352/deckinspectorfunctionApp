import invasiveSections from "../../../invasiveSectionService";

class InvasiveVisualStrategy extends SectionDocStrategy {
    async generateSectionDocValues() {
        const sectionDocValuesWhenUnitAvailable = this.getSectionDocValuesWhenUnitAvailable(this.sectionData);
        const invasiveSectionData = await invasiveSections.getInvasiveSectionByParentId(this.sectionId);
        const invasiveData = this.getInvasiveData(invasiveSectionData);

        return {
            ...this.baseSectionDocValues,
            ...sectionDocValuesWhenUnitAvailable,
            ...invasiveData,
            furtherInvasiveRequired: false,
            invasiverepairsinspectedandcompleted: false,
        };
    }
}