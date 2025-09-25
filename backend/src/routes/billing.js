const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
const prisma = new PrismaClient();

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        features: [
          '1 AI Bot',
          '100 messages/month',
          'WhatsApp integration',
          'Basic analytics',
          'Email support'
        ],
        stripePriceId: null
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        interval: 'month',
        features: [
          '5 AI Bots',
          '5,000 messages/month',
          'All channel integrations',
          'Broadcast messages',
          'Advanced analytics',
          'Custom branding',
          'API access',
          'Priority support'
        ],
        stripePriceId: process.env.STRIPE_PRO_PRICE_ID
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        interval: 'month',
        features: [
          'Unlimited AI Bots',
          'Unlimited messages',
          'All features included',
          'Team collaboration',
          'Advanced security',
          'Custom integrations',
          'Dedicated support',
          'White-label solution'
        ],
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID
      }
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      error: 'Failed to fetch plans',
      message: 'An error occurred while fetching subscription plans'
    });
  }
});

// Create checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { priceId, planId } = req.body;

    if (!priceId) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Price ID is required'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        planId: planId
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: 'An error occurred while creating the checkout session'
    });
  }
});

// Create customer portal session
router.post('/create-portal-session', authenticateToken, async (req, res) => {
  try {
    // Get or create Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: req.user.email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user.id
        }
      });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({
      error: 'Failed to create portal session',
      message: 'An error occurred while creating the portal session'
    });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Webhook handlers
async function handleCheckoutCompleted(session) {
  const userId = session.metadata.userId;
  const planId = session.metadata.planId;
  
  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  // Update user billing info
  await prisma.billingInfo.upsert({
    where: { userId },
    update: {
      subscriptionId: subscription.id,
      planId,
      status: 'ACTIVE',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      subscriptionId: subscription.id,
      planId,
      status: 'ACTIVE',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  });

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription) {
  // Find user by subscription ID
  const billingInfo = await prisma.billingInfo.findFirst({
    where: { subscriptionId: subscription.id }
  });

  if (billingInfo) {
    await prisma.billingInfo.update({
      where: { id: billingInfo.id },
      data: {
        status: subscription.status.toUpperCase(),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      }
    });
  }
}

async function handleSubscriptionDeleted(subscription) {
  const billingInfo = await prisma.billingInfo.findFirst({
    where: { subscriptionId: subscription.id }
  });

  if (billingInfo) {
    await prisma.billingInfo.update({
      where: { id: billingInfo.id },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: false,
      }
    });
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);
  // You can add additional logic here, like sending confirmation emails
}

async function handlePaymentFailed(invoice) {
  console.log(`Payment failed for invoice ${invoice.id}`);
  // You can add additional logic here, like sending failure notifications
}

module.exports = router;
