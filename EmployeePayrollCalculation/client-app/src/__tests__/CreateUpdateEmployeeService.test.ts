import CreateUpdateEmployeeService from "../services/CreateUpdateEmployeeService";

describe("applyDiscount", () => {
    it("applies the discount to the number", () => {
        // Arrange
        
        // Act
        const result = CreateUpdateEmployeeService.applyDiscount(500, 0.1);
        
        // Assert
        expect(result).toEqual(450);
    });
});

describe("isDiscountApplied", () => {
    it("should apply the discount", () => {
        // Arrange

        // Act
        const result = CreateUpdateEmployeeService.isDiscountApplied("Andrew");

        // Assert
        expect(result).toEqual(true);
    });

    it("should not apply the discount", () => {
        // Arrange

        // Act
        const result = CreateUpdateEmployeeService.isDiscountApplied("Brent");

        // Assert
        expect(result).toEqual(false);
    });
});

export {}