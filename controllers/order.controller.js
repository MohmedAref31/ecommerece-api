const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const asyncHandler = require("express-async-handler");
const ErrorClass = require("../utiles/ErrorClass.utiles");
const Order = require("../models/order.model")
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model")
const { getDocumentById, getAll } = require("../utiles/handlers.utiles");

const createOrder = async (session)=>{
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;

    const cart = await Cart.findById(cartId);
    const user = await User.findOne({email:session.customer_email});

    const order = await Order.create({
        user:user._id,
        cartItems:cart.cartItems,
        shippingAddress,
        totalOrderPrice:orderPrice,
        isPaid:true,
        paidAt:Date.now(),
        paymentMethod:'card',
    })

    if(order){
        const bulkOptions = cart.cartItems.map(item=>({
            updateOne:{
                filter:{_id:item.product},
                update:{$inc:{quantity:-item.quantity, sold:+item.quantity}}
            }
        }))
    
       await Product.bulkWrite(bulkOptions,{});
    
        // clear the cart with cartId  
        await Cart.findByIdAndDelete(cartId) 
        }
    
}

exports.createCashOrder = asyncHandler( async (req,res,next)=>{
    // 1- get cart depend on cartId 
    const {cartId} = req.params;
    const cart = await Cart.findById(cartId);
    if(!cart)
        next(new ErrorClass(`there is no cart for this id ${cartId}`,404));
    // get order price from the cart and check if coupon applied;
    const price = cart.totalCartPriceAfterDiscount?cart.totalCartPriceAfterDiscount:cart.totalCartPrice;
    // create an order with default payment method "cash"

    const order = await Order.create({
        user:req.user._id,
        cartItems:cart.cartItems,
        totalOrderPrice:price,
    })
    // after creating the order increase the Product sold number and decrease quantity number
    if(order){
    const bulkOptions = cart.cartItems.map(item=>({
        updateOne:{
            filter:{_id:item.product},
            update:{$inc:{quantity:-item.quantity, sold:+item.quantity}}
        }
    }))

   await Product.bulkWrite(bulkOptions,{});

    // clear the cart with cartId  
   await Cart.findByIdAndDelete(cartId) 
    }

    res.status(201).json({status: 'success' , data:order})
})


exports.createCheckoutSession = asyncHandler(async(req, res, next)=>{
        // 1- get cart depend on cartId 
        const {cartId} = req.params;
        const cart = await Cart.findById(cartId);
        if(!cart)
            next(new ErrorClass(`there is no cart for this id ${cartId}`,404));
        // get order price from the cart and check if coupon applied;
        const price = cart.totalCartPriceAfterDiscount?cart.totalCartPriceAfterDiscount:cart.totalCartPrice;
        

        const session = await stripe.checkout.sessions.create({
            line_items:[
                {
                   price_data:{
                    currency: 'egp',
                    unit_amount:price * 100,
                    product_data: {
                        name: 'T-shirt',
                        description: 'Comfortable cotton t-shirt',
                        images: ['https://example.com/t-shirt.png'],
                      },
                   },
                    quantity:1,
                }
            ],
            mode:'payment',
            success_url: `${req.protocol}://${req.get('host')}/order`,
            cancel_url: `${req.protocol}://${req.get('host')}/cart`,
            customer_email:req.user.email,
            client_reference_id:cartId,
            metadata:req.body.shippingAddress
        })

    res.send({status:"success",data:session})

})

exports.checkoutComplete = asyncHandler( async(req, res, next)=>{
    const sig = req.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
      //  Create order
      createOrder(event.data.object);
    }
  
    res.status(200).json({ received: true });
})

exports.setFilterObj = asyncHandler (async (req, res, next )=>{
    if(req.user.role === 'user')
        req.filterObj = {user:req.user._id}

    
    next()
})

exports.getAllOrders = getAll(Order)

exports.getOrderById = getDocumentById(Order)

exports.updateOrderToPaid = asyncHandler( async(req, res, next)=>{
    const {id} = req.params

    const order = await Order.findById(id);

    if(!order)
        return new ErrorClass(`here is no order with id ${id}`, 404);

    order.paidAt = Date.now()
    order.isPaid = true;

    await order.save();

    res.send({status: 'success', data: order});
})

exports.updateOrderToDelivered = asyncHandler( async(req, res, next)=>{
    const {id} = req.params

    const order = await Order.findById(id);

    if(!order)
        return new ErrorClass(`here is no order with id ${id}`, 404);

    order.deliveredAt = Date.now()
    order.isDelivered = true;

    
    await order.save();

    res.send({status: 'success', data: order});
})