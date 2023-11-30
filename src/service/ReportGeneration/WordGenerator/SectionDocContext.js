class SectionDocContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    generateSectionDocValues() {
        return this.strategy.generateSectionDocValues();
    }
}