import { User } from "../models/User.js";
import { Shift } from "../models/Shift.js";
import { Sale } from "../models/Sale.js";
import { sequelize } from "../database/database.js";

// Login con PIN
export const login = async (req, res) => {
  try {
    const { pin } = req.body;
    
    const user = await User.findOne({ where: { pin, active: true } });
    
    if (!user) {
      return res.status(401).json({ message: "PIN incorrecto o usuario inactivo" });
    }

    // Crear nuevo turno
    const shift = await Shift.create({
      UserId: user.id,
      startTime: new Date(),
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      shiftId: shift.id,
      message: `¡Bienvenido/a, ${user.name}!`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout - cerrar turno
export const logout = async (req, res) => {
  try {
    const { shiftId, userId } = req.body;
    
    const shift = await Shift.findByPk(shiftId);
    
    if (!shift) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    // Calcular ventas del turno
    const salesData = await Sale.findAll({
      where: {
        UserId: userId,
        createdAt: {
          [sequelize.Sequelize.Op.gte]: shift.startTime
        }
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales'],
      ]
    });

    // Cerrar turno
    shift.endTime = new Date();
    await shift.save();

    const user = await User.findByPk(userId);

    res.json({
      message: `¡Hasta luego, ${user.name}!`,
      shift: {
        startTime: shift.startTime,
        endTime: shift.endTime,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los usuarios (solo admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'pin', 'role', 'active', 'createdAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear usuario (solo admin)
export const createUser = async (req, res) => {
  try {
    const { name, pin, role } = req.body;

    // Verificar si el PIN ya existe
    const existingUser = await User.findOne({ where: { pin } });
    if (existingUser) {
      return res.status(400).json({ message: "Este PIN ya está en uso" });
    }

    const user = await User.create({
      name,
      pin,
      role: role || 'employee',
      active: true,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      pin: user.pin,
      role: user.role,
      active: user.active,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar usuario (solo admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pin, role, active } = req.body;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el nuevo PIN ya existe (si se está cambiando)
    if (pin && pin !== user.pin) {
      const existingUser = await User.findOne({ where: { pin } });
      if (existingUser) {
        return res.status(400).json({ message: "Este PIN ya está en uso" });
      }
    }

    await user.update({
      name: name || user.name,
      pin: pin || user.pin,
      role: role || user.role,
      active: active !== undefined ? active : user.active,
    });

    res.json({
      id: user.id,
      name: user.name,
      pin: user.pin,
      role: user.role,
      active: user.active,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar usuario (solo admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // En lugar de eliminar, desactivar el usuario
    await user.update({ active: false });

    res.json({ message: "Usuario desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener turnos de un usuario
export const getUserShifts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const shifts = await Shift.findAll({
      where: { UserId: userId },
      order: [['startTime', 'DESC']],
      limit: 30
    });

    res.json(shifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Inicializar admin por defecto si no existe
export const initAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (adminExists) {
      return res.json({ message: "Ya existe un administrador", exists: true });
    }

    const admin = await User.create({
      name: 'Administrador',
      pin: '1234',
      role: 'admin',
      active: true,
    });

    res.status(201).json({
      message: "Administrador creado con PIN: 1234",
      user: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
