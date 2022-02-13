import {useEffect} from 'react';
import {useForm, useFieldArray} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid';

interface LocalState {
    name: string,
    dependents: Dependent[]
}

interface Dependent {
    id: string,
    name: string
}

const CreateEmployee = () => {
    // form validation rules 
    const validationSchema = Yup.object().shape({
        employeeName: Yup.string()
            .required('Employee Name is required.'),
        dependents: Yup.array().of(
            Yup.object().shape({
                dependentName: Yup.string()
                    .required('Dependent Name is required.')
            })
        )
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    // functions to build form returned by useForm() and useFieldArray() hooks
    const {register, control, handleSubmit, reset, formState, watch, getValues} = useForm({...formOptions, mode: "onBlur"});
    const {errors} = formState;
    const {append, remove, fields: dependents} = useFieldArray({name: 'dependents', control});
    
    // watch to enable re-render when ticket number is changed
    // const employeeName = watch('employeeName');

    // useEffect(() => {
    //     // update field array when ticket number changed
    //     const newVal = parseInt(numberOfTickets || 0);
    //     const oldVal = fields.length;
    //     if (newVal > oldVal) {
    //         // append tickets to field array
    //         for (let i = oldVal; i < newVal; i++) {
    //             append({ name: '', email: '' });
    //         }
    //     } else {
    //         // remove tickets from field array
    //         for (let i = oldVal; i > newVal; i--) {
    //             remove(i - 1);
    //         }
    //     }
    // }, [numberOfTickets]);
    
    const salaryPerPaycheck = 2000.00;
    const numberOfPaychecksPerYear = 26;
    const employeeBenefitCost = 1000.00;
    const dependentBenefitCost = 500.00;
    const discount = 0.10;

    const addDependent = () => {
        append({
            id: uuidv4(),
            dependentName: ''
        })
    };

    const removeDependent = (index: number) => {
        remove(index);
    }

    function onSubmit(data: any) {
        // display form data on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    }

    // https://stackoverflow.com/a/2901298/5573838
    function numberWithCommas(x: any) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    const getEmployeeSalary = () => {
        console.log("getEmployeeSalary")
        return `$${numberWithCommas((salaryPerPaycheck * numberOfPaychecksPerYear).toFixed(2))}`;
    };
    
    const isDiscountApplied = (name: string) => {
        return name?.length > 0 && name[0].toUpperCase() === "A";
    };
    
    const isEmployeeBenefitDiscountApplied = () => {
        const employeeName = getValues("employeeName");
        return isDiscountApplied(employeeName);
    };

    const isDependentBenefitDiscountApplied = (index: number) => {
        const employeeName = getValues(`dependents.${index}.dependentName`);
        return isDiscountApplied(employeeName);
    };
    
    const applyDiscount = (cost: number) => {
        return cost * (1 - discount);
    };
    
    const getEmployeeBenefitCost = () => {
        let cost = employeeBenefitCost;
        if (isEmployeeBenefitDiscountApplied()) {
            cost = applyDiscount(cost);
        }
        return `($${numberWithCommas((cost).toFixed(2))})`;
    }
    
    const getDependentBenefitCost = (index: number) => {
        let cost = dependentBenefitCost;
        if (isDependentBenefitDiscountApplied(index)) {
            cost = applyDiscount(cost);
        }
        return `($${numberWithCommas((cost).toFixed(2))})`;
    }
    
    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className='mb-4'>Create Employee</h2>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <h5 className="card-header">Employee & Dependents</h5>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor='employeeName'>Employee Name</label>
                                    <input {...register('employeeName')}
                                           className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}/>
                                    <div className="text-danger small">{errors.employeeName?.message}</div>
                                </div>
                                {dependents.map((item, i) => (
                                    <div key={item.id} className="mb-3">
                                        <label htmlFor={`dependents.${i}.dependentName`}>Dependent Name #{i + 1}</label>
                                        <div className="input-group">
                                            <input {...register(`dependents.${i}.dependentName`)}
                                                   className={`form-control ${errors.dependents?.[i]?.dependentName ? 'is-invalid' : ''}`}/>
                                            <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => removeDependent(i)}>Remove
                                            </button>
                                        </div>
                                        <div className="text-danger small">{errors.dependents?.[i]?.dependentName?.message}</div>
                                    </div>
                                ))}
                                <div>
                                    <button type="button" className="btn btn-link" onClick={addDependent}>+ Add
                                        Dependent
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <h5 className="card-header">Calculation</h5>
                            <div className="card-body">
                                <p>Employee salary is <strong>${salaryPerPaycheck.toFixed(2)}</strong> per paycheck for <strong>26</strong> paychecks per year.</p>
                                <p>Employee benefits cost <strong>${employeeBenefitCost}</strong>/year.</p>
                                <p>Dependent benefits cost <strong>$500.00</strong>/year per dependent.</p>
                                <p>Employee and dependent benefits receive a <strong>10%</strong> discount if their name starts with 'A'.</p>
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td>Employee Salary</td>
                                        <td className="green">{getEmployeeSalary()}</td>
                                    </tr>
                                    <tr>
                                        <td>Employee Benefits</td>
                                        <td className="darkred">{getEmployeeBenefitCost()}</td>
                                    </tr>
                                    {dependents.map((item, i) => (
                                        <tr key={item.id}>
                                            <td>Dependent #{i + 1} Benefits</td>
                                            <td className="darkred">{getDependentBenefitCost(i)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CreateEmployee;