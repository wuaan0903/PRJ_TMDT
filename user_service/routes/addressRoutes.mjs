import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Lấy danh sách địa chỉ của người dùng
router.get('/:userId/addresses', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Thêm địa chỉ mới cho người dùng
router.post('/:userId/addresses', async (req, res) => {
    const { nameKH,phoneNumber,address, ward, district, city, defaultAddress } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Nếu defaultAddress = true, đặt tất cả địa chỉ khác về false
        if (defaultAddress) {
            user.addresses.forEach(addr => {
                addr.defaultAddress = false;
            });
        }

        // Thêm địa chỉ mới
        const newAddress = { nameKH, phoneNumber, address, ward, district, city, defaultAddress };
        user.addresses.push(newAddress);

        await user.save();
        res.status(201).json({ message: "Thêm địa chỉ thành công", newAddress });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cập nhật địa chỉ của người dùng
router.put('/:userId/addresses/:addressId', async (req, res) => {
    const { address, ward, district, city, default: isDefault } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressToUpdate = user.addresses.id(req.params.addressId);
        if (!addressToUpdate) {
            return res.status(404).json({ message: 'Address not found' });
        }

        addressToUpdate.address = address;
        addressToUpdate.ward = ward;
        addressToUpdate.district = district;
        addressToUpdate.city = city;
        addressToUpdate.default = isDefault;

        // Nếu địa chỉ cập nhật là địa chỉ mặc định, cập nhật các địa chỉ khác
        if (isDefault) {
            user.addresses.forEach(addr => {
                if (addr !== addressToUpdate) {
                    addr.default = false;
                }
            });
        }

        await user.save();
        res.status(200).json(addressToUpdate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Xóa địa chỉ của người dùng
router.delete('/:userId/addresses/:addressId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra nếu user không có địa chỉ nào
        if (!user.addresses || user.addresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this user' });
        }

        // Tìm địa chỉ cần xóa
        const addressToDelete = user.addresses.id(req.params.addressId);
        if (!addressToDelete) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Xóa địa chỉ bằng pull()
        user.addresses.pull(req.params.addressId);
        await user.save();

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;