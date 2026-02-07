import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Menu from '@/layouts/Menu';
import { AuthContext } from '@/contexts/authContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Config() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', pin: '', role: 'employee' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, isAdmin } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user && !isAdmin()) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.pin.length < 4 || formData.pin.length > 6) {
      setError('El PIN debe tener entre 4 y 6 dígitos');
      return;
    }

    if (!/^\d+$/.test(formData.pin)) {
      setError('El PIN solo debe contener números');
      return;
    }

    try {
      const url = editingUser
        ? `http://localhost:4000/api/users/${editingUser.id}`
        : 'http://localhost:4000/api/users';
      
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar usuario');
      }

      setSuccess(editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', pin: '', role: 'employee' });
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      pin: userToEdit.pin,
      role: userToEdit.role,
    });
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (userId) => {
    if (!confirm('¿Está seguro de desactivar este usuario?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al desactivar usuario');
      }

      setSuccess('Usuario desactivado correctamente');
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleActivate = async (userToActivate) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${userToActivate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userToActivate, active: true }),
      });

      if (!response.ok) {
        throw new Error('Error al activar usuario');
      }

      setSuccess('Usuario activado correctamente');
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const openNewUserModal = () => {
    setEditingUser(null);
    setFormData({ name: '', pin: '', role: 'employee' });
    setShowModal(true);
    setError('');
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <Menu>
      <div className="p-6 h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Configuracion de Usuarios</h1>
          <button
            onClick={openNewUserModal}
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
          >
            + Nuevo Usuario
          </button>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Cargando usuarios...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-cyan-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">PIN</th>
                  <th className="px-6 py-3 text-left">Rol</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4 font-mono">{u.pin}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === 'admin' ? 'Administrador' : 'Empleado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-cyan-600 hover:text-cyan-800 mr-3"
                      >
                        Editar
                      </button>
                      {u.active ? (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={u.id === user?.id}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(u)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      PIN (4-6 digitos)
                    </label>
                    <input
                      type="text"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Rol
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="employee">Empleado</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      {editingUser ? 'Guardar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Menu>
  );
}
