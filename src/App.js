import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  const apiUrl = 'https://votre-api-gateway.amazonaws.com'; // Remplacez par votre URL API Gateway

  // Récupérer les données
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  // Gestion des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Ajouter ou mettre à jour un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${apiUrl}/users`, formData);
        alert('Utilisateur mis à jour avec succès');
      } else {
        await axios.post(`${apiUrl}/users`, formData);
        alert('Utilisateur ajouté avec succès');
      }
      setFormData({ id: null, name: '', email: '' });
      setIsEditing(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
    }
  };

  // Préparer la mise à jour d'un utilisateur
  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/users`, { params: { id } });
      alert('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestion des utilisateurs</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>
            Nom :
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ margin: '5px' }}
            />
          </label>
        </div>
        <div>
          <label>
            Email :
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ margin: '5px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          {isEditing ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </form>

      {/* Liste des utilisateurs */}
      <h2>Liste des utilisateurs</h2>
      {users.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEdit(user)} style={{ marginRight: '5px' }}>
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(user.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun utilisateur trouvé.</p>
      )}
    </div>
  );
};

export default App;
