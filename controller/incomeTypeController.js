const Transaction = require('../models/transactionsModel');
const IncomeType = require('../models/incomeTypeModel');
const Joi = require('joi');

const schema = Joi.object({
    income_type_name: Joi.string().min(3).required(),
    income_type_image: Joi.string().optional(),
});

class IncomeTypeController {
    // Create global income type
    async createIncomeTypeGlobal(req, res) {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: `Validation Error: ${error.details[0].message}` });
            }
            const { income_type_name } = req.body;

            const find = await IncomeType.findOne({ where: { income_type_name } });
            if (find) {
                return res.status(403).json({ message: "Income type already exists" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "No image provided" });
            }

            await IncomeType.create({
                income_type_name,
                income_type_image: req.file.path,
                is_global: true,
                user_id: null, // Global income type, no user ID
            });

            return res.status(200).json({ message: 'Income type created successfully' });
        } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    // Create user-specific income type
    async createIncomeTypeByUser(req, res) {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: `Validation Error: ${error.details[0].message}` });
            }
            const { income_type_name } = req.body;
            const { userId } = req.params;

            const find = await IncomeType.findOne({
                where: { income_type_name, user_id: userId }
            });

            if (find) {
                return res.status(403).json({ message: "Income type already exists for this user" });
            }
            // if (!req.file) {
            //     return res.status(400).json({ message: 'No image provided' });
            // }

            await IncomeType.create({
                income_type_name,
                income_type_image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROTIBidJi6AHVXFvTK09bFYYCel7jq1NNQkA&s",
                is_global: false,
                user_id: userId,
            });

            return res.status(200).json({ message: "Income type created successfully for user" });
        } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    // Update income type
    async updateIncomeType(req, res) {
        try {
            const { incomeTypeId } = req.params;

            const incomeType = await IncomeType.findByPk(incomeTypeId);
            if (!incomeType) {
                return res.status(404).json({ message: "Income type not found" });
            }
            if (incomeType.is_global) {
                return res.status(403).json({ message: "Cannot update a global income type" });
            }

            const { error } = schema.validate(req.body, { allowUnknown: true });
            if (error) {
                return res.status(400).json({ message: `Validation Error: ${error.details[0].message}` });
            }

            const { income_type_name, income_type_image } = req.body;

            await incomeType.update({
                income_type_name: income_type_name || incomeType.income_type_name,
                income_type_image: income_type_image || incomeType.income_type_image
            });

            return res.status(200).json({ message: "Income type updated successfully" });
        } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    // Get all income types with pagination
    async getAllIncomeType(req, res) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;

            const incomeTypes = await IncomeType.findAll({
                where: {
                    user_id: userId,
                    is_global: true
                },
                limit,
                offset
            });

            return res.status(200).json({ message: "Success", incomeTypes });
        } catch (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    // Delete income type
    async deleteIncomeType(req, res) {
        const transaction = await db.transaction();
        try {
            const { incomeTypeId } = req.params;

            const incomeType = await IncomeType.findByPk(incomeTypeId);
            if (!incomeType) {
                return res.status(404).json({ message: "Income type not found" });
            }

            // Delete the income type and update related transactions
            await incomeType.destroy({ transaction });
            await Transaction.update(
                { income_type_id: null },
                { where: { income_type_id: incomeTypeId }, transaction }
            );

            await transaction.commit();
            return res.status(200).json({ message: "Income type deleted successfully" });
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: `Error: ${err.message}` });
        }
    }
}

module.exports = new IncomeTypeController();
