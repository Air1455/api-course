import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import {Link} from "react-router-dom";
import TableLoader from "../components/Loader/TableLoadre";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data)
            setLoading(false);
        } catch (e) {
            console.log(e.response)
        }
    }
    useEffect(() => {
        fetchCustomers().then(console.log(customers));
    }, []);

    // Suppression d'un customer
    const handleDelete = async id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))
        try {
            await CustomersAPI.delete(id)
        } catch (e) {
            console.log(e.response)
            setCustomers(originalCustomers);
        }
    };

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    // Filtrage de la recherche
    const filteredCustomers = customers.filter(
        c => c.firstName.toLowerCase().includes(search.toLowerCase())
            || c.lastName.toLowerCase().includes(search.toLowerCase())
            || c.email.toLowerCase().includes(search.toLowerCase())
            || (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // Pagination
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link className="btn btn-primary" to="/customers/new">Créer un client</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>
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
                {!loading && <tbody>
                {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td><Link to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link></td>
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

                </tbody>}
            </table>
            {loading && <TableLoader />}
            {itemsPerPage < filteredCustomers.length && <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onPageChanged={handlePageChange}
            />}
        </>
    );
};

export default CustomersPage;
