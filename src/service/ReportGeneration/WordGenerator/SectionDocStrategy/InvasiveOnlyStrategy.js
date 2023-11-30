class InvasiveOnlyStrategy extends SectionDocStrategy {
    async generateSectionDocValues() {
        const sectionDocValuesWhenUnitAvailable = this.getSectionDocValuesWhenUnitAvailable(this.sectionData);
        const invasiveSectionData = await invasiveSections.getInvasiveSectionByParentId(this.sectionId);
        const invasiveData = this.getInvasiveData(invasiveSectionData);

        const conclusiveSectionData = await conclusiveSections.getConclusiveSectionByParentId(this.sectionId);
        const conclusiveData = conclusiveSectionData.data && conclusiveSectionData.data.item
            ? this.getConclusiveData(conclusiveSectionData)
            : {
                invasiverepairsinspectedandcompleted: false,
            };

        return {
            ...this.baseSectionDocValues,
            ...invasiveData,
            ...conclusiveData,
        };
    }
}