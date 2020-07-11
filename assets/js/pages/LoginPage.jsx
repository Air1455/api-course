import React, {useState} from 'react';
import AuthAPI from "../services/authAPI";
import Field from "../components/forms/Field";

const LoginPage = ({onLogin, history}) => {
    const [credentials, setCredentials] = useState({
        username:"",
        password:""
    });

    const [error, setError] = useState("");

    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value})
    };

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            onLogin(true);
            history.replace('/customers');
        }catch (e) {
            setError('Aucun compte ne possède cette email ou alors les informations ne correpondent pas');
        }
    }
    return (
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <Field label="Adresse email" name="username" value={credentials.username}  onChange={handleChange} placeholder="Adresse email de connexion" error={error} />
                <Field label="Mot de passe" name="password" value={credentials.password}  onChange={handleChange} type="password" />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;