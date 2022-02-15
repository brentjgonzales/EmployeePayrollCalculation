import CommonService from "../services/CommonService";

describe("toMoney", () => {
    it("converts a number to money format", () => {
        // Arrange
        
        // Act
        const result = CommonService.toMoney(1000.50123);
        
        // Assert
        expect(result).toEqual("1,000.50");
    });
});

export {}