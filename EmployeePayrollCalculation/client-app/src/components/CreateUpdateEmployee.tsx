import {useEffect, useState} from 'react';
import {useForm, useFieldArray} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import {Shape} from "../utils";
import {useParams} from "react-router";

interface Employee {
    employeeName: string,
    dependents: Dependent[]
}

interface Dependent {
    id: string,
    dependentName: string
}

interface ServerEmployee {
    employeeName: string,
    dependentNames: string[]
}

interface Calculation {
    employeeBenefit: Benefit,
    dependentBenefits: Benefit[],
    total: string
}

interface Benefit {
    cost: string,
    discountActive: boolean
}

const CreateEmployee = () => {
    const { employeeIdParam } = useParams<{employeeIdParam?: string | undefined}>();
    
    // form validation rules 
    const validationSchema = Yup.object<Shape<Employee>>().shape({
        employeeName: Yup.string()
            .required('Employee Name is required.')
            .max(50, "Employee Name must be 50 characters or less."),
        dependents: Yup.array().of(
            Yup.object().shape({
                dependentName: Yup.string()
                    .required('Dependent Name is required.')
                    .max(50, "Dependent Name must be 50 characters or less.")
            })
        )
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    // functions to build form returned by useForm() and useFieldArray() hooks
    const {register, control, handleSubmit, reset, formState, watch, getValues, setValue} = useForm({
        ...formOptions,
        mode: "onBlur"
    });
    const {errors} = formState;
    const {
        append: appendDependentFieldArray,
        remove: removeDependentFieldArray,
        fields: dependents
    } = useFieldArray({name: 'dependents', control});

    const [calculation, setCalculation] = useState<Calculation>({
        employeeBenefit: {
            cost: "",
            discountActive: false
        },
        dependentBenefits: [],
        total: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCalculation({
            employeeBenefit: {
                cost: getEmployeeBenefitCostString(),
                discountActive: false
            },
            dependentBenefits: [],
            total: getTotalString()
        });
        
        if (employeeIdParam) {
            setIsLoading(true);
            axios
                .get<ServerEmployee>("/api/employee/" + employeeIdParam, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                })
                .then(response => {
                    setValue("employeeName", response.data.employeeName);
                    if (response.data.dependentNames) {
                        setValue("dependents", response.data.dependentNames.map((dependentName) => ({id: uuidv4(), dependentName: dependentName})));
                    }
                    setIsLoading(false);
                    
                    // TODO - refactor calculation and use watch instead?
                    // setCalculation({
                    //     ...calculation,
                    //     dependentBenefits: [...calculation.dependentBenefits],
                    //     total: getTotalString()
                    // });
                })
                .catch((data: any) => {
                    alert("An error occured when retrieving the list of employees to manage.");
                    console.error(data);
                });
        }
    }, []);

    const salaryPerPaycheck = 2000.00;
    const numberOfPaychecksPerYear = 26;
    const employeeBenefitCost = 1000.00;
    const dependentBenefitCost = 500.00;
    const discount = 0.10;

    const employeeSalary = salaryPerPaycheck * numberOfPaychecksPerYear;
    const employeeSalaryString = `$${numberWithCommas(employeeSalary.toFixed(2))}`;

    const addDependent = () => {
        appendDependentFieldArray({
            id: uuidv4(),
            dependentName: ''
        });
        const newIndex = calculation.dependentBenefits.length;
        setCalculation({
            ...calculation,
            dependentBenefits: [
                ...calculation.dependentBenefits,
                {
                    cost: getDependentBenefitCostString(newIndex),
                    discountActive: false
                }
            ],
            total: getTotalString()
        })
    };

    const removeDependent = (index: number) => {
        removeDependentFieldArray(index);
        calculation.dependentBenefits.splice(index, 1);
        setCalculation({
            ...calculation,
            dependentBenefits: [...calculation.dependentBenefits],
            total: getTotalString()
        });
    }

    const onSubmit = (employee: Employee) => {
        const serverEmployee: ServerEmployee = {
            employeeName: employee.employeeName,
            dependentNames: employee.dependents.map((dependent) => dependent.dependentName)
        };
        
        axios
            .post("/api/employee", serverEmployee, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            })
            .then((data: any) => {
                console.log(data);
            })
            .catch((data: any) => {
                console.log(data);
            });
    }

    // https://stackoverflow.com/a/2901298/5573838
    function numberWithCommas(x: any) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

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
        return cost;
    }

    const getEmployeeBenefitCostString = () => {
        const cost = getEmployeeBenefitCost();
        return `($${numberWithCommas((cost).toFixed(2))})`;
    }
    
    const getDependentBenefitCost = (index: number) => {
        let cost = dependentBenefitCost;
        if (isDependentBenefitDiscountApplied(index)) {
            cost = applyDiscount(cost);
        }
        return cost;
    }

    const getDependentBenefitCostString = (index: number) => {
        const cost = getDependentBenefitCost(index);
        return `($${numberWithCommas((cost).toFixed(2))})`;
    }

    const getTotal = () => {
        let total = employeeSalary - getEmployeeBenefitCost(); 
        for (let i = 0; i < getValues("dependents").length; i++) {
            total -= getDependentBenefitCost(i);
        }
        return total;
    };
    
    const getTotalString = () => {
      const total = getTotal();
      return `$${numberWithCommas(total.toFixed(2))}`;
    };

    const employeeNameChange = () => {
        setCalculation({
            ...calculation,
            employeeBenefit: {
                cost: getEmployeeBenefitCostString(),
                discountActive: isDiscountApplied(getValues("employeeName"))
            },
            total: getTotalString()
        })
    };

    const dependentNameChange = (index: number) => {
        const dependentBenefit = calculation.dependentBenefits[index];
        dependentBenefit.cost = getDependentBenefitCostString(index);
        dependentBenefit.discountActive = isDiscountApplied(getValues(`dependents.${index}.dependentName`));
        setCalculation({
            ...calculation,
            dependentBenefits: [...calculation.dependentBenefits],
            total: getTotalString()
        })
    };

    return (
        <div className="container">
            <h2 className='mb-4'>{employeeIdParam ? "Update" : "Create"} Employee</h2>
            
            <form onSubmit={handleSubmit((data) => onSubmit(data as Employee))}>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <h5 className="card-header">Employee & Dependents</h5>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor='employeeName'>Employee Name</label>
                                    <input {...register('employeeName', {
                                        onChange: (e) => {
                                            employeeNameChange()
                                        }
                                    })}
                                           className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}/>
                                    <div className="text-danger small">{errors.employeeName?.message}</div>
                                </div>
                                {dependents.map((item, i) => (
                                    <div key={item.id} className="mb-3">
                                        <label htmlFor={`dependents.${i}.dependentName`}>Dependent Name #{i + 1}</label>
                                        <div className="input-group">
                                            <input {...register(`dependents.${i}.dependentName`, {onChange: (e) => dependentNameChange(i)})}
                                                   className={`form-control ${errors.dependents?.[i]?.dependentName ? 'is-invalid' : ''}`}/>
                                            <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => removeDependent(i)}>Remove
                                            </button>
                                        </div>
                                        <div
                                            className="text-danger small">{errors.dependents?.[i]?.dependentName?.message}</div>
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
                                <p>Employee salary is <strong>${salaryPerPaycheck.toFixed(2)}</strong> per paycheck
                                    for <strong>26</strong> paychecks per year.</p>
                                <p>Employee benefits cost <strong>${employeeBenefitCost}</strong>/year.</p>
                                <p>Dependent benefits cost <strong>$500.00</strong>/year per dependent.</p>
                                <p>Employee and dependent benefits receive a <strong>10%</strong> discount if their name
                                    starts with 'A'.</p>
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td>Employee Salary</td>
                                        <td className="green">{employeeSalaryString}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div>Employee Benefits</div>
                                            {calculation.employeeBenefit.discountActive &&
                                                <div className="green small">Discount applied.</div>}
                                        </td>
                                        <td className="darkred">{calculation.employeeBenefit.cost}</td>
                                    </tr>
                                    {dependents.map((item, i) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div>
                                                    Dependent #{i + 1} Benefits
                                                </div>
                                                {calculation.dependentBenefits[i].discountActive &&
                                                    <div className="green small">Discount applied.</div>}
                                            </td>
                                            <td className="darkred">{calculation.dependentBenefits[i].cost}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th>Total</th>
                                        <th>{calculation.total}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-success">Create Employee</button>
            </form>
        </div>
    )
}

export default CreateEmployee;