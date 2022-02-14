import {useEffect, useState} from 'react';
import {useForm, useFieldArray} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import {Shape} from "../utils";
import {useHistory, useParams} from "react-router";
import ToastMaker from 'toastmaker';

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
    costString: string,
    discountActive: boolean
}

const CreateEmployee = () => {
    const history = useHistory();
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

    const [employeeBenefitCostString, setEmployeeBenefitCostString] = useState("");
    const [employeeBenefitDiscountActive, setEmployeeBenefitDiscountActive] = useState(false);
    const [dependentBenefits, setDependentBenefits] = useState<Benefit[]>([]);
    const [calcTotalString, setCalcTotalString] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setEmployeeBenefitCostString(getEmployeeBenefitCostString());
        setCalcTotalString(getTotalString());
        
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
                        setDependentBenefits(response.data.dependentNames.map((dependentName, index) => ({costString: getDependentBenefitCostString(index), discountActive: isDiscountApplied(getValues(`dependents.${index}.dependentName`))})));
                    }
                    setEmployeeBenefitCostString(getEmployeeBenefitCostString());
                    setEmployeeBenefitDiscountActive(isDiscountApplied(getValues("employeeName")));
                    setCalcTotalString(getTotalString());
                    setIsLoading(false);
                })
                .catch((data: any) => {
                    ToastMaker("An error occured when retrieving the data for the employee.");
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
        const newIndex = dependentBenefits.length;
        setDependentBenefits([
            ...dependentBenefits,
            {
                costString: getDependentBenefitCostString(newIndex),
                discountActive: false
            }
        ]);
        setCalcTotalString(getTotalString());
    };

    const removeDependent = (index: number) => {
        removeDependentFieldArray(index);
        dependentBenefits.splice(index, 1);
        setDependentBenefits([...dependentBenefits]);
        setCalcTotalString(getTotalString());
    }

    const createEmployee = (employee: Employee) => {
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
                ToastMaker("Successfully created employee.");
                history.push("/manage-employees");
                console.log(data);
            })
            .catch((data: any) => {
                ToastMaker("An error occurred when creating the employee.");
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
        setEmployeeBenefitCostString(getEmployeeBenefitCostString());
        setEmployeeBenefitDiscountActive(isDiscountApplied(getValues("employeeName")));
        setCalcTotalString(getTotalString());
    };

    const dependentNameChange = (index: number) => {
        const dependentBenefit = dependentBenefits[index];
        dependentBenefit.costString = getDependentBenefitCostString(index);
        dependentBenefit.discountActive = isDiscountApplied(getValues(`dependents.${index}.dependentName`));
        setDependentBenefits([...dependentBenefits]);
        setCalcTotalString(getTotalString());
    };

    return (
        <div className="container">
            <h2 className='mb-4'>{employeeIdParam ? "Update" : "Create"} Employee</h2>

            {isLoading ? <em>Loading...</em> :

                <form onSubmit={handleSubmit((data) => createEmployee(data as Employee))}>
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
                                                {employeeBenefitDiscountActive &&
                                                    <div className="green small">Discount applied.</div>}
                                            </td>
                                            <td className="darkred">{employeeBenefitCostString}</td>
                                        </tr>
                                        {dependentBenefits.map((item, i) => (
                                            <tr key={dependents[i].id}>
                                                <td>
                                                    <div>
                                                        Dependent #{i + 1} Benefits
                                                    </div>
                                                    {item.discountActive &&
                                                        <div className="green small">Discount applied.</div>}
                                                </td>
                                                <td className="darkred">{item.costString}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <th>Total</th>
                                            <th>{calcTotalString}</th>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">Create Employee</button>
                </form>

            }
            
        </div>
    )
}

export default CreateEmployee;