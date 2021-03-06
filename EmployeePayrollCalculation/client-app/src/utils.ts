import {ObjectShape} from "yup/lib/object";

// Provide typing to Yup - https://github.com/DefinitelyTyped/DefinitelyTyped/issues/29412
export type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never
export type Shape<T extends Record<any, any>> =  Partial<Record<keyof T, ObjectShapeValues>>

export interface Config {
    salaryPerPaycheck: number;
    numberOfPaychecksPerYear: number;
    employeeBenefitCost: number;
    dependentBenefitCost: number;
    discount: number
}