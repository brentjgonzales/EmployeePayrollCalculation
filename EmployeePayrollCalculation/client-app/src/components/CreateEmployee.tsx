import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

interface ILocalState {
    name: string,
    dependents: IDependent[]
}

interface IDependent {
    id: string,
    name: string
}

const CreateEmployee = () => {
    const [employee, setEmployee] = useState<ILocalState>({
        name: '',
        dependents: [] as IDependent[]
    });

    const addDependent = (e: any) => {
        setEmployee({
            ...employee,
            dependents: [...employee.dependents, {
                id: uuidv4(),
                name: ''
            }]
        });
    };

    return (

        <>
            <form onSubmit={() => {
            }}>
                <h1>Create Employee</h1>
                <h2>Employee</h2>
                <div className='mb-3'>
                    <label htmlFor='name' className='form-label'>Name</label>
                    <input type='text' className='form-control' name='name'/>
                    {/*<input type='text' className='form-control' {...register('name', { required: true, maxLength: 100 })} />*/}
                    {/*<span className='text-danger'>{errors.name?.type === 'required' && 'Name is required.'}</span>*/}
                    {/*<span className='text-danger'>{errors.name?.type === 'maxLength' && 'Name cannot be more than 100 characters.'}</span>*/}
                </div>
                {employee.dependents.map((dependent, index) => {
                    return (
                        <div key={dependent.id} className='mb-3'>
                            <label htmlFor={'dependent-name-' + dependent.id} className='form-label'>Dependent
                                #{index + 1}</label>
                            <input type='text' className='form-control' name={'dependent-name-' + dependent.id}/>
                        </div>
                    );
                })}
                <div className='mb-3'>
                    <button type='button' className='btn btn-link' onClick={(e) => addDependent(e)}>+ Add Dependent
                    </button>
                </div>
                <input type='submit' className='btn btn-success'/>
            </form>
        </>
    );
}

export default CreateEmployee;