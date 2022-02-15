import {useEffect, useRef, useState} from 'react';
import {useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid';
import {Config, Shape} from "../utils";
import {useHistory, useParams} from "react-router";
import ToastMaker from 'toastmaker';
import AxiosService from "../services/AxiosService";
import YupService, {YupValidation} from "../services/YupService";
import CommonService from "../services/CommonService";
import CreateUpdateEmployeeService from "../services/CreateUpdateEmployeeService";

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

interface Benefit {
    costString: string,
    discountActive: boolean
}

const CreateEmployee = () => {
    const mountedRef = useRef(true);
    
    const history = useHistory();
    const { employeeIdParam } = useParams<{ employeeIdParam?: string | undefined }>();

    // Form Validation
    const validationSchema = Yup.object<Shape<Employee>>().shape({
        employeeName: YupService.validation("string", "Employee Name",
            YupValidation.Required,
            [YupValidation.Max, 50]
        ),
        dependents: Yup.array().of(
            Yup.object().shape({
                dependentName: YupService.validation("string", "Dependent Name",
                    YupValidation.Required,
                    [YupValidation.Max, 50]
                )
            })
        )
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    // Custom Hooks
    const {register, control, handleSubmit, formState, getValues, setValue} = useForm({
        ...formOptions,
        mode: "onBlur"
    });
    const {errors} = formState;
    const {
        append: appendDependentFieldArray,
        remove: removeDependentFieldArray,
        fields: dependents
    } = useFieldArray({name: 'dependents', control});

    // State management for result of calculation
    const [employeeSalaryString, setEmployeeSalaryString] = useState("");
    const [employeeBenefitCostString, setEmployeeBenefitCostString] = useState("");
    const [employeeBenefitDiscountActive, setEmployeeBenefitDiscountActive] = useState(false);
    const [dependentBenefits, setDependentBenefits] = useState<Benefit[]>([]);
    const [calcTotalString, setCalcTotalString] = useState("");

    // State management for variables needed for calculation
    const [employeeSalary, setEmployeeSalary] = useState(0);
    const [salaryPerPaycheck, setSalaryPerPaycheck] = useState(0);
    const [numberOfPaychecksPerYear, setNumberOfPaychecksPerYear] = useState(0);
    const [employeeBenefitCost, setEmployeeBenefitCost] = useState(0);
    const [dependentBenefitCost, setDependentBenefitCost] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        // Retrieve the variables needed for calculation
        AxiosService.get<Config>("/api/configuration", 
            data => {

                setEmployeeSalary(data.salaryPerPaycheck * data.numberOfPaychecksPerYear)
                setSalaryPerPaycheck(data.salaryPerPaycheck);
                setNumberOfPaychecksPerYear(data.numberOfPaychecksPerYear);
                setEmployeeBenefitCost(data.employeeBenefitCost);
                setDependentBenefitCost(data.dependentBenefitCost);
                setDiscount(data.discount);

                if (employeeIdParam) {

                    // Retrieve the existing employee
                    AxiosService.get<ServerEmployee>("/api/employee/" + employeeIdParam,
                        data => {
                            setValue("employeeName", data.employeeName);
                            if (data.dependentNames) {
                                setValue("dependents", data.dependentNames.map((dependentName) =>
                                    ({id: uuidv4(), dependentName: dependentName})));
                            }
                            
                            setIsLoading(false);
                        }, "An error occured when retrieving the data for the employee.", mountedRef);

                }
                else {
                    setIsLoading(false);
                }
                
            }, "An error occured when retrieving the configuration.", mountedRef);
        
        // Tell all async callbacks not to process because we have unmounted this component
        return () => {
            mountedRef.current = false;
        };
    }, []);
    
    useEffect(() => {
        
        // Once loading is complete, trigger functionality to set all calculated values
        setEmployeeSalaryString(CommonService.toMoney(employeeSalary));
        setEmployeeBenefitCostString(getEmployeeBenefitCostString());
        setEmployeeBenefitDiscountActive(CreateUpdateEmployeeService.isDiscountApplied(getValues("employeeName")));
        setDependentBenefits(dependents.map((dependent, index) =>
            ({costString: getDependentBenefitCostString(index), discountActive: CreateUpdateEmployeeService.isDiscountApplied(getValues(`dependents.${index}.dependentName`))})));
        setCalcTotalString(getTotalString());
        
    }, [isLoading]);

    const addDependent = () => {
        // Update form
        appendDependentFieldArray({
            id: uuidv4(),
            dependentName: ''
        });
        
        // Re-run calculation
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
        // Update form
        removeDependentFieldArray(index);
        
        // Re-run calculation
        dependentBenefits.splice(index, 1);
        setDependentBenefits([...dependentBenefits]);
        setCalcTotalString(getTotalString());
    }

    const apiCreateEmployee = (employee: Employee) => {
        // Convert form to server model
        const serverEmployee: ServerEmployee = {
            employeeName: employee.employeeName,
            dependentNames: employee.dependents.map((dependent) => dependent.dependentName)
        };
        
        if (employeeIdParam) {
            // Update employee
            AxiosService.put("/api/employee/" + employeeIdParam, serverEmployee,
                data => {
                    ToastMaker("Successfully updated employee.");
                    history.push("/manage-employees");
                }, "An error occurred when updating the employee.", mountedRef);
        }
        else {
            // Create employee
            AxiosService.post("/api/employee", serverEmployee,
                data => {
                    ToastMaker("Successfully created employee.");
                    history.push("/manage-employees");
                }, "An error occurred when creating the employee.", mountedRef);
        }
    }
    
    const isEmployeeBenefitDiscountApplied = () => {
        const employeeName = getValues("employeeName");
        return CreateUpdateEmployeeService.isDiscountApplied(employeeName);
    };

    const isDependentBenefitDiscountApplied = (index: number) => {
        const employeeName = getValues(`dependents.${index}.dependentName`);
        return CreateUpdateEmployeeService.isDiscountApplied(employeeName);
    };

    const getEmployeeBenefitCost = () => {
        let cost = employeeBenefitCost;
        if (isEmployeeBenefitDiscountApplied()) {
            cost = CreateUpdateEmployeeService.applyDiscount(cost, discount);
        }
        return cost;
    };

    const getEmployeeBenefitCostString = () => {
        const cost = getEmployeeBenefitCost();
        return CommonService.toMoney(cost);
    };
    
    const getDependentBenefitCost = (index: number) => {
        let cost = dependentBenefitCost;
        if (isDependentBenefitDiscountApplied(index)) {
            cost = CreateUpdateEmployeeService.applyDiscount(cost, discount);
        }
        return cost;
    };

    const getDependentBenefitCostString = (index: number) => {
        const cost = getDependentBenefitCost(index);
        return CommonService.toMoney(cost);
    };

    const getTotal = () => {
        let total = employeeSalary - getEmployeeBenefitCost(); 
        for (let i = 0; i < getValues("dependents").length; i++) {
            total -= getDependentBenefitCost(i);
        }
        return total;
    };
    
    const getTotalString = () => {
      const total = getTotal();
      return CommonService.toMoney(total);
    };

    const employeeNameChange = () => {
        // User changed the employee name, update the employee calculated values
        setEmployeeBenefitCostString(getEmployeeBenefitCostString());
        setEmployeeBenefitDiscountActive(CreateUpdateEmployeeService.isDiscountApplied(getValues("employeeName")));
        setCalcTotalString(getTotalString());
    };

    const dependentNameChange = (index: number) => {
        // User changed the dependent name, update the dependent calculated values
        const dependentBenefit = dependentBenefits[index];
        dependentBenefit.costString = getDependentBenefitCostString(index);
        dependentBenefit.discountActive = CreateUpdateEmployeeService.isDiscountApplied(getValues(`dependents.${index}.dependentName`));
        setDependentBenefits([...dependentBenefits]);
        setCalcTotalString(getTotalString());
    };

    return (
        <div className="container">
            <h2 className='mb-4'>{employeeIdParam ? "Update" : "Create"} Employee</h2>

            {isLoading ? <em>Loading...</em> :

                <form onSubmit={handleSubmit((data) => apiCreateEmployee(data as Employee))}>
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
                                        for <strong>{numberOfPaychecksPerYear}</strong> paychecks per year.</p>
                                    <p>Employee benefits cost <strong>${employeeBenefitCost.toFixed(2)}</strong>/year.</p>
                                    <p>Dependent benefits cost <strong>${dependentBenefitCost.toFixed(2)}</strong>/year per dependent.</p>
                                    <p>Employee and dependent benefits receive a <strong>{discount * 100}%</strong> discount if their name
                                        starts with 'A'.</p>
                                    <table className="table">
                                        <tbody>
                                        <tr>
                                            <td>Employee Salary</td>
                                            <td className="green">${employeeSalaryString}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>Employee Benefits</div>
                                                {employeeBenefitDiscountActive &&
                                                    <div className="green small">Discount applied.</div>}
                                            </td>
                                            <td className="darkred">(${employeeBenefitCostString})</td>
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
                                                <td className="darkred">(${item.costString})</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <th>Total</th>
                                            <th>${calcTotalString}</th>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success">{employeeIdParam ? "Update" : "Create"} Employee</button>
                </form>

            }
            
        </div>
    )
}

export default CreateEmployee;