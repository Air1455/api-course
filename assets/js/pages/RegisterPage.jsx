import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import registerAPI from "../services/registerAPI";
import customersAPI from "../services/customersAPI";
import {toast} from "react-toastify";


const RegisterPage = ({match, history}) => {
    const {id = "new"} = match.params;
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const fetchUsers = async () => {
        try{
            const data = await customersAPI.findAll();
            setUsers(data);

            if(!user.customer) setUser({...user, customer: data[0].id})
        }catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const [editing, setEditing] = useState(false);

    // Recupération de la facture en fonction de l'identifiant
    const fetchUser = async id => {
        try {
            const{amount, customer, status} = await usersAPI.find(id);
            setUser({amount, customer: customer.id, status});
        } catch (e) {
            console.log(e.response);
            history.replace("/users");
        }
    }

    // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchUser(id);
        }
    }, [id]);

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Le mot de passe doit être identique";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
            return;
        }
        try {
            if(editing){
                await registerAPI.update(id, user);
                setErrors({});
            }else{
                await registerAPI.create(user);
                setErrors({});
                toast.success("Vous êtes désormais inscrit, vous pouvez vous connecté !");
                history.replace("/login");
            }
        }catch ({response}) {
            const {violations} = response.data;
            if(violations){
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
            toast.error("Des erreurs dans votre formulaire !");
        }
    }

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]:value});
    };

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" value={user.firstName} error={errors.firstName} onChange={handleChange} />
                <Field name="lastName" label="Nom de famille" value={user.lastName} error={errors.lastName} onChange={handleChange} />
                <Field name="email" type="email" label="Email" value={user.email} error={errors.email} onChange={handleChange} />
                <Field name="password" type="password" label="Mot de passe" value={user.password} error={errors.password} onChange={handleChange} />
                <Field name="passwordConfirm" type="password" label="Confirmation du mot de passe" value={user.passwordConfirm} error={errors.passwordConfirm} onChange={handleChange} />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;
