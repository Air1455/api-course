import axios from "axios";

function findAll() {
    return axios
        .get("http://localhost:8000/api/users")
        .then(response => response.data["hydra:member"]);
}

function deleteCustomer(id) {
    return axios
        .delete("http://localhost:8000/api/users/"+id);
}

function find(id) {
    return axios.get("http://localhost:8000/api/users/" + id).then(response => response.data);
}

function update(id, user) {
    return axios.put("http://localhost:8000/api/users/" +id, user);
}

function create(user) {
    return axios.post("http://localhost:8000/api/users", user);
}

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteCustomer
}

