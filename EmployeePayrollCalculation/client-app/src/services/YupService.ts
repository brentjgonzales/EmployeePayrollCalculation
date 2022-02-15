import * as Yup from 'yup';
import {NumberSchema} from "yup";
import {AnyObject} from "yup/lib/object";
import {debug} from "util";

export enum YupValidation {
    TypeError,
    Required,
    Min,
    Max
}

const YupService = {
    validation: (operation: "number" | "string", label: string, 
             ...yupValidation: (YupValidation | [YupValidation, any])[]): NumberSchema<number | undefined, AnyObject, number | undefined> => {
        
        let chain = (Yup as any)[operation]();
        
        for (let p of yupValidation) {
            let val: YupValidation;
            let prop: number | undefined
            if (Array.isArray(p)) {
                [val, prop] = p;
            }
            else {
                val = p;
            }
            
            if (val === YupValidation.TypeError) {
                chain = chain.typeError(`${label} must be a number.`);
            }
            if (val === YupValidation.Required) {
                chain = chain.required(`${label} is required.`);
            }
            if (prop !== undefined && val === YupValidation.Min) {
                chain = chain.min(prop, operation === "number" ? `The minimum value of ${label} is ${prop}.` : `${label} must be ${prop} characters or more.`);
            }
            if (prop !== undefined && val === YupValidation.Max) {
                chain = chain.max(prop, operation === "number" ? `The maximum value of ${label} is ${prop}.` :`${label} must be ${prop} characters or less.`);
            }
        }
        
        return chain;
    }
};

export default YupService;