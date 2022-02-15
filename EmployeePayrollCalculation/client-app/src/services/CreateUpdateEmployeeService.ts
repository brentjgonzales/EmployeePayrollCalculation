const CreateUpdateEmployeeService = {
    applyDiscount: (cost: number, discount: number) => {
        return cost * (1 - discount);
    },
    isDiscountApplied: (name: string) => {
        return name?.length > 0 && name[0].toUpperCase() === "A";
    }
};

export default CreateUpdateEmployeeService;