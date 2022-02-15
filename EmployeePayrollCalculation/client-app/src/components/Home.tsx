import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div className="container">
            <h2 className="mb-4">Home</h2>
            <p>Please review the actions you may take below.</p>
            <ul>
                <li>
                    <Link to="/configuration">Configuration</Link>
                </li>
                <li>
                    <Link to="/manage-employees">Manage Employees</Link>
                </li>
                <li>
                    <Link to="/create-employee">Create Employee</Link>
                </li>
            </ul>
        </div>
    )
}

export default Home;