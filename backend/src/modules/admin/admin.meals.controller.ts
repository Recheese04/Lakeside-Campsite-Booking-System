import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// ─── MENU ITEMS ───

/** GET /api/admin/meals/items */
export const getMenuItems = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        const where: any = {};
        if (category) where.category = category;

        const items = await prisma.mealItem.findMany({ where, orderBy: { name: 'asc' } });
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch menu items: ' + error.message });
    }
};

/** POST /api/admin/meals/items */
export const createMenuItem = async (req: Request, res: Response) => {
    try {
        const item = await prisma.mealItem.create({ data: req.body });
        res.status(201).json(item);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create menu item: ' + error.message });
    }
};

/** PUT /api/admin/meals/items/:id */
export const updateMenuItem = async (req: Request, res: Response) => {
    try {
        const item = await prisma.mealItem.update({ where: { id: req.params.id }, data: req.body });
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update menu item: ' + error.message });
    }
};

/** DELETE /api/admin/meals/items/:id */
export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
        await prisma.mealItem.delete({ where: { id: req.params.id } });
        res.json({ message: 'Menu item deleted' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete menu item: ' + error.message });
    }
};

// ─── ORDERS ───

/** GET /api/admin/meals/orders */
export const getOrders = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const where: any = {};
        if (status) where.status = status;

        const orders = await prisma.mealOrder.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
        });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch orders: ' + error.message });
    }
};

/** PUT /api/admin/meals/orders/:id/status */
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const order = await prisma.mealOrder.update({
            where: { id: req.params.id },
            data: { status },
        });
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update order status: ' + error.message });
    }
};
