import React from 'react';

const CustomersPage = () => {
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
                <tr>
                    <td>18</td>
                    <td><a href="Lior Chamla"></a></td>
                    <td>lior@yahoo.fr</td>
                    <td></td>
                    <td></td>
                    <td>2 400,00 €</td>
                    <td><button className="btn btn-danger">Supprimer</button></td>
                </tr>
                </tbody>
            </table>
        </>
    );
};

export default CustomersPage;
