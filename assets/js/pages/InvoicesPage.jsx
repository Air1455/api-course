import React, {useState, useEffect} from 'react';
import Pagination from "../components/Pagination";
import axios from "axios";
import moment from "moment";
import InvoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = props => {
    
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchInvoices = async () => {
        try{
            const data = await axios
                .get("http://localhost:8000/api/invoices")
                .then(response => response.data["hydra:member"]);
            setInvoices(data);
        } catch (e) {
            console.log(e.response);
        }

    }
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    // Suppression d'un customer
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id))
        try {
            await InvoicesAPI.delete(id)
        } catch (e) {
            console.log(e.response)
            setInvoices(originalInvoices);
        }
    };

    // Filtrage de la recherche
    const filteredInvoices = invoices.filter(
        i => i.customer.firstName.toLowerCase().includes(search.toLowerCase())
            || i.customer.lastName.toLowerCase().includes(search.toLowerCase())
            || i.amount.toString().startsWith(search.toLowerCase())
            || STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    
    return (
        <>
            <h1>Liste des factures</h1>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {paginatedInvoices.map(invoice =>
                <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                    <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                    <td>{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                    </td>
                    <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <button className="btn btn-sm btn-danger mr-1">Editer</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                    </td>
                </tr>)}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length} />
        </>
    );
};

export default InvoicesPage;
