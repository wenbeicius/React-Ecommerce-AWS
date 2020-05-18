'use strict';

const stripe = require('stripe')('sk_test_tIATfyMRKJHH8R0VXiG274pr00FNiLnjIE');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

/**
 * Retrieve orders records.
 * 
 * @return {Object|Array}}
 */

find: async (ctx) => {
    if(ctx.query._q) {
        return strapi.services.orders.search(ctx.query);
    } else{
        return strapi.services.orders.fetchAll(ctx.query);
    }
},

/*
findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F{24}$/])) {
        return ctx.notFound();
    }
    return strapi.services.orders.fetch(ctx.params); 
}, */

count: async (ctx) => {
    return strapi.services.orders.count(ctx.query);
},

//Send Charge to Stripe
create: async(ctx) => {
    const { address, amount, brews, postalCode, token, city } = ctx.request.body;

    const charge = await stripe.charges.create({ 
        amount: amount * 100,
        currency: 'usd',
        description: 'Order ${new Date(Date.now())} - User ${ctx.state.use._id}',
        source: token
    });
    // console.dir(strapi.services);
    // Create Order in database
    const order = await strapi.services.orders.create({
        user: ctx.state.user._id,
        address,
        amount,
        brews,
        postalCode,
        city
    });
    return order;
    
 /*   try {
        await strapi.plugins['email'].services.email.send({
        to: 'wenbei@gmail.com',
        from: 'wenbei@gmail.com',
        replyTo: 'wenbei@gmail.com',
        subject: 'Use strapi email provider successfully',
        text: 'Hello world!',
        html: 'Hello world!',
      });

    ;
    }catch (
        err
    ){
        console.log(err);
    };*/
},


update: async (ctx, next) => {
    return strapi.services.orders.edit(ctx.params. ctx.request.body) ;
},

};