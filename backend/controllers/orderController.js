import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModal.js'

// @descrp   create new order 
// @route    POST/api/orders
// @access    Private
const addOrderItems  = asyncHandler(async (req, res) => {
 const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
 }  = req.body

    if(orderItems && orderItems.length === 0){
        res.statu(400)
        throw new Error('no order items')
    }else{
        const order = new Order({
        orderItems: orderItems.map((x) => ({
            ...x,
            product: x._id,
            _id: undefined
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        })   
        
        const createOrder = await order.save();

        res.status(201).json(createOrder);
    }
 
 });

// @descrp   get logged in users order
// @route    GET/api/orders/myorders
// @access    Private
const getMyOrders = asyncHandler(async (req, res) => {
   const orders = await Order.find({ user: req.user._id})
   res.status(200).json(orders);
   
 });

// @descrp   get logged in users order
// @route    GET/api/orders/:id
// @access    Private
const getOrderById = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id).populate('user', 'name email')
   if(order){
    res.status(200).json(order)
   }else{
    res.status(404)
    throw new Error('Order not found')
   }
 });

 // @descrp  update order to pay
// @route    GET/api/orders/:id/pay
// @access    Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id)

   if(order){
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
         id: req.body.id,
         status: req.body.status,
         update_time: req.body.update_time,
         email_address: req.body.email_address,
      }
      const updateOrder = await order.save();
      res.status(200).json(updateOrder)
   } else {
      res.status(404);
      throw new Error('Order does not exist')
   }
   
 });

 // @descrp  update order to delivered
// @route    GET/api/orders/:id/deliver
// @access    Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id);
      if (order) {
         order.isDelivered = true;
         order.deliveredAt = Date.now()

         const updateOrder = await order.save();
         res.status(200).json(updateOrder)
      } else {
         res.status(404)
         throw new Error('Order does not exist')
      }

 });
 // @descrp  Get all oders
// @route    GET/api/orders/:id/deliver
// @access    Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const order = await Order.find({}).populate('user', 'id name')
  res.status(200).json(order)
 });

 export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders
 };
