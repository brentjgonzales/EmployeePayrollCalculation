import {useEffect, useRef, useState} from 'react';
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import ToastMaker from "toastmaker";
import {Config, Shape} from "../utils";
import AxiosService from "../services/AxiosService";
import YupService, {YupValidation} from "../services/YupService";

const Configuration = () => {
    const mountedRef = useRef(true);
    
    const validationSchema = Yup.object<Shape<Config>>().shape({
        salaryPerPaycheck: YupService.validation(
            "number",
            "Salary Per Paycheck",
            YupValidation.TypeError,
            YupValidation.Required,
            [YupValidation.Min, 0]
        ),
        numberOfPaychecksPerYear: YupService.validation(
            "number",
            "Number of Paychecks Per Year",
            YupValidation.TypeError,
            YupValidation.Required,
            [YupValidation.Min, 0]
        ),
        employeeBenefitCost: YupService.validation(
            "number",
            "Employee Benefit Cost",
            YupValidation.TypeError,
            YupValidation.Required,
            [YupValidation.Min, 0]
        ),
        dependentBenefitCost: YupService.validation(
            "number",
            "Dependent Benefit Cost",
            YupValidation.TypeError,
            YupValidation.Required,
            [YupValidation.Min, 0]
        ),
        discount: YupService.validation(
            "number",
            "Discount",
            YupValidation.TypeError,
            YupValidation.Required,
            [YupValidation.Min, 0],
            [YupValidation.Max, 1],
        )
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    const {register, control, handleSubmit, reset, formState, watch, getValues, setValue} = useForm({
        ...formOptions,
        mode: "onBlur"
    });
    const {errors} = formState;

    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        
        AxiosService.get<Config>("/api/configuration", 
            data => {
            
                setIsLoading(false);    
            
                setValue("salaryPerPaycheck", data.salaryPerPaycheck);
                setValue("numberOfPaychecksPerYear", data.numberOfPaychecksPerYear);
                setValue("employeeBenefitCost", data.employeeBenefitCost);
                setValue("dependentBenefitCost", data.dependentBenefitCost);
                setValue("discount", data.discount);
            }, "An error occurred when retrieving the configuration.", mountedRef);
        
    }, []);

    const updateConfiguration = (configuration: Config) => {
        
        AxiosService.put("/api/configuration/", configuration, 
            data => {
                ToastMaker("Successfully updated configuration.");
            }, "An error occurred when updating the configuration.", mountedRef);
        
    };

    return (
        <div className="container">
            <h2 className="mb-4">Configuration</h2>
            {isLoading ? <em>Loading...</em> :

                <form onSubmit={handleSubmit((data) => updateConfiguration(data as Config))}>
                    <div className="mb-3">
                        <label htmlFor='salaryPerPaycheck'>Salary Per Paycheck</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input {...register('salaryPerPaycheck')} className={`form-control ${errors.salaryPerPaycheck ? 'is-invalid' : ''}`}/>
                        </div>
                        <div className="text-danger small">{errors.salaryPerPaycheck?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor='numberOfPaychecksPerYear'>Number of Paychecks Per Year</label>
                        <input {...register('numberOfPaychecksPerYear')} className={`form-control ${errors.numberOfPaychecksPerYear ? 'is-invalid' : ''}`}/>
                        <div className="text-danger small">{errors.numberOfPaychecksPerYear?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor='employeeBenefitCost'>Employee Benefit Cost</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input {...register('employeeBenefitCost')} className={`form-control ${errors.employeeBenefitCost ? 'is-invalid' : ''}`}/>
                        </div>
                        <div className="text-danger small">{errors.employeeBenefitCost?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor='dependentBenefitCost'>Dependent Benefit Cost</label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input {...register('dependentBenefitCost')} className={`form-control ${errors.dependentBenefitCost ? 'is-invalid' : ''}`}/>
                        </div>
                        <div className="text-danger small">{errors.dependentBenefitCost?.message}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor='discount'>Discount</label>
                        <input {...register('discount')} className={`form-control ${errors.discount ? 'is-invalid' : ''}`}/>
                        <div className="text-danger small">{errors.discount?.message}</div>
                    </div>
                    <button type="submit" className="btn btn-success">Update Configuration</button>
                </form>
                
            }
            
        </div>
    )
}

export default Configuration;