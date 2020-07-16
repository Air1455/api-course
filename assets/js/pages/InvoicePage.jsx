import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import invoicesAPI from "../services/invoicesAPI";
import Select from "../components/forms/Select";
import customersAPI from "../services/customersAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/Loader/FormContentLoader";

const InvoicePage = ({match, history}) => {

    const {id = "new"} = match.params;
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState({
        amount:'',
        customer:'',
        status:'SENT'
    });

    const [errors, setErrors] = useState({
        amount:'',
        customer:'',
        status:''
    });
    
    const fetchCustomers = async () => {
        try{
            const data = await customersAPI.findAll();
            setCustomers(data);
            setLoading(false);

            if(!invoice.customer) setInvoice({...invoice, customer: data[0].id})
        }catch (e) {
            console.log(e.response)
            toast.error("Impossible de charger les clients !");
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    const [editing, setEditing] = useState(false);

    // Recupération de la facture en fonction de l'identifiant
    const fetchInvoice = async id => {
        try {
            const{amount, customer, status} = await invoicesAPI.find(id);
            setLoading(false);
            setInvoice({amount, customer: customer.id, status});
        } catch (e) {
            console.log(e.response);
            toast.error("Impossible de charger la facture demandé !");
            history.replace("/invoices");
        }
    }

    // Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]:value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(editing){
                await invoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifié !");
                setErrors({});
            }else{
                await invoicesAPI.create(invoice);
                setErrors({});
                toast.success("La facture a bien été enregistré !");
                history.replace("/invoices");
            }
        }catch ({response}) {
            console.log(response);
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
            <h1 className="text-center">{!editing && (<>Création d'une facture</>) || (<>Modification de la facture</>)}</h1>
            {loading && <FormContentLoader />}
            {!loading && <form onSubmit={handleSubmit} className="mt-5">
                <Field name="amount" type="number" label="Montant" placeholder="Montant de la facture" value={invoice.amount} onChange={handleChange} error={errors.amount}/>
                <Select name="customer" label="Client" placeholder="Client" value={invoice.customer} onChange={handleChange} error={errors.customer}>
                    {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option> )}
                </Select>
                <Select name="status" label="Status" value={invoice.status} onChange={handleChange} error={errors.status}>
                    <option value="SENT">Envoyé</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>}
        </>
    );
};

export default InvoicePage;
