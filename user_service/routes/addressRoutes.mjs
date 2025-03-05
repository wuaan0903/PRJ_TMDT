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


// Lấy địa chỉ mặc định của người dùng
router.get('/:userId/addresses/default', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const defaultAddress = user.addresses.find(addr => addr.defaultAddress === true);
        if (!defaultAddress) {
            return res.status(404).json({ message: 'Default address not found' });
        }

        res.status(200).json({
            email: user.email,
            defaultAddress: defaultAddress
        });
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
    const { nameKH,phoneNumber,address, ward, district, city, defaultAddress =true } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressToUpdate = user.addresses.id(req.params.addressId);
        if (!addressToUpdate) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Cập nhật thông tin địa chỉ
        addressToUpdate.nameKH = nameKH;
        addressToUpdate.phoneNumber = phoneNumber;
        addressToUpdate.address = address;
        addressToUpdate.ward = ward;
        addressToUpdate.district = district;
        addressToUpdate.city = city;
        
        addressToUpdate.defaultAddress = true; 


        // Nếu địa chỉ này được đặt làm mặc định, cập nhật các địa chỉ khác
        if (defaultAddress) {
            user.addresses.forEach(addr => {
                if (addr._id.toString() !== req.params.addressId) {
                    addr.defaultAddress = false;
                }
            });
        }

        await user.save();
        res.status(200).json(user.addresses.id(req.params.addressId));

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