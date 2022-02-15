import {useEffect, useState} from 'react';
import {useForm, useFieldArray} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import {
    Link
} from "react-router-dom";
import ToastMaker from "toastmaker";
import {useHistory} from "react-router";

interface Employee {
    employeeId: number,
    employeeName: string
}

const Configuration = () => {
    //
    // const [isLoading, setIsLoading] = useState(true);
    // const [employees, setEmployees] = useState<Employee[]>([]);
    //
    // useEffect(() => {
    //     axios
    //         .get<Employee[]>("/api/employee/manage", {
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json;charset=UTF-8",
    //             },
    //         })
    //         .then(response => {
    //             setEmployees(response.data);
    //             setIsLoading(false);
    //         })
    //         .catch((data: any) => {
    //             alert("An error occured when retrieving the list of employees to manage.");
    //             console.error(data);
    //         });
    // }, []);
    //
    // const deleteEmployee = (employeeId: number) => {
    //     axios
    //         .delete("/api/employee/" + employeeId, {
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json;charset=UTF-8",
    //             },
    //         })
    //         .then(() => {
    //             ToastMaker("Successfully deleted employee.");
    //             setEmployees(employees.filter(employee => employee.employeeId !== employeeId));
    //         })
    //         .catch((data: any) => {
    //             ToastMaker("An error occurred when deleting the employee.");
    //             console.log(data);
    //         });
    // };

    return (
        <div className="container">
            <h2 className="mb-4">Configuration</h2>
            {/*{isLoading && <span>Loading...</span>}*/}
            {/*{!isLoading && employees.length === 0*/}
            {/*    ? <em>No employees found.</em>*/}
            {/*    :*/}
            {/*    <>*/}
            {/*        {employees.map((employee, index) => (*/}
            
            {/*            <div key={employee.employeeId} className="card">*/}
            {/*                <div className="card-body">*/}
            {/*                    <div className="d-flex justify-content-between">*/}
            {/*                        <div className="vertically-center">*/}
            {/*                            <Link to={"/create-update-employee/" + employee.employeeId}>{employee.employeeName}</Link>*/}
            {/*                        </div>*/}
            {/*                        <div>*/}
            {/*                            <button type="button" className="btn btn-outline-danger" onClick={() => {deleteEmployee(employee.employeeId)}}>Delete</button>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            
            {/*        ))}*/}
            {/*    </>*/}
            {/*}*/}
        </div>
    )
}

export default Configuration;