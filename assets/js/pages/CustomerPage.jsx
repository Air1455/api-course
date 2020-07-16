import React, {useState, useEffect} from 'react';
import Field from './../components/forms/Field';
import {Link} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import FormContentLoader from "../components/Loader/FormContentLoader";

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params;
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState({
        lastName:'',
        firstName:'',
        email:'',
        company:''
    });

    const [errors, setErrors] = useState({
        lastName:'',
        firstName:'',
        email:'',
        company:''
    });
    
    const [editing, setEditing] = useState(false);

    // Recupération du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
        try {
            const{firstName, lastName, email, company} = await customersAPI.find(id);
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        } catch (e) {
            console.log(e.response);
            history.replace("/customers");
        }
    }

    // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if(id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]:value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setErrors({});
            if(editing){
                await customersAPI.update(id, customer);
            }else{
                await customersAPI.create(customer);
                history.replace("/customers");
            }

        }catch ({response}) {
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
        }
    }

    return (
        <>
            <h1 className="text-center">{!editing && (<>Création d'un client</>) || (<>Modification du client</>)}</h1>
            {loading && <FormContentLoader />}
            {!loading && <form onSubmit={handleSubmit} className="mt-5">
                <Field name="lastName" label="Nom de famille" placeholder="Nom de famille du client" value={customer.lastName} onChange={handleChange} error={errors.lastName}/>
                <Field name="firstName" label="Prénom" placeholder="Prénom du client" value={customer.firstName} onChange={handleChange} error={errors.firstName}/>
                <Field name="email" label="Email" placeholder="Adresse email du client" type="email" value={customer.email} onChange={handleChange} error={errors.email}/>
                <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={errors.company}/>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>}
        </>
    );
};

export default CustomerPage;
