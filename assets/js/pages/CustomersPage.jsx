import React, { useEffect, useState } from 'react';
import axios from "axios";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/customers")
            .then(response => response.data["hydra:member"])
            .then(data => setCustomers(data))
            .catch(error => console.log(error.response));
    }, []);

    const handleDelete = id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))
        axios
            .delete("http://localhost:8000/api/customers/"+id)
            .then(response => console.log('ok'))
            .catch(error => {
                console.log(error.response)
                setCustomers(originalCustomers);
            });
    }

    return (
        <>
            <h1>Liste des clients</h1>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {customers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td><a href="#">{customer.firstName}{customer.lastName}</a></td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td><span className="badge badge-primary">{customer.invoices.length}</span></td>
                        <td>{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <button
                                onClick={()=> handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}

                </tbody>
            </table>
        </>
    );
};

export default CustomersPage;