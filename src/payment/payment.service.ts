import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private stripeRepo: Repository<Payment>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10',
    });
  }

  async createCustomer(body: { email: string }): Promise<string> {
    const result = await this.stripe.customers.create({
      email: body.email,
    });
    return result.id;
  }

  async charge(amount: number, paymentMethodId: string) {
    const response = await this.stripe.paymentIntents.create({
      amount,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      confirm: true,
      return_url: 'http://localhost:3000',
    });
    const status = response['status'];
    return status;
  }

  async listPaymentMethods(customerId: string) {
    const response = await this.stripe.customers.listPaymentMethods(
      customerId,
      {
        type: 'card',
      },
    );
    return response;
  }

  public async chargeSaveCard(
    paymentMethodId: string,
    amount: number,
    customerId: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      off_session: true,
      confirm: true,
    });
  }

  async createSubscription(
    paymentMethodId: string,
    product: string,
    customerId: string,
  ) {
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: product }],
      expand: ['latest_invoice.payment_intent'],
    });

    const status = subscription['latest_invoice']['payment_intent']['status'];
    const clientSecret =
      subscription['latest_invoice']['payment_intent']['client_secret'];

    return { status, clientSecret };
  }

  async getSecretClientKey() {
    const paymentIntent = await this.stripe.paymentIntents.create({
      currency: this.configService.get('STRIPE_CURRENCY'),
      automatic_payment_methods: { enabled: true },
      amount: 100,
    });
    if (!paymentIntent) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
    return paymentIntent.client_secret;
  }

  async attachCreditCard(paymentMethodId: string, customerId: string) {
    const paymentMethod = await this.stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    });

    //Retrieve a card fingerprint
    const detailPaymentMethod = await this.stripe.paymentMethods.retrieve(
      paymentMethodId,
    );

    const listPaymentMethods = await this.listPaymentMethods(customerId);

    const isExistCard = listPaymentMethods.data.findIndex(
      (paymentMethod) =>
        paymentMethod.card.fingerprint === detailPaymentMethod.card.fingerprint,
    );

    if (isExistCard !== -1) {
      throw new HttpException(
        'Card is existed. Try another!!!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.stripe.setupIntents.confirm(paymentMethod.id, {
      payment_method: paymentMethodId,
    });
  }

  async setDefaultPaymentMethod(paymentMethodId: string, customerId: string) {
    return await this.stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
  }

  async getDefaultPaymentMethod(customerId: string) {
    return await this.stripe.customers.retrieve(customerId);
  }

  async detachCreditCard(paymentMethod: string) {
    return await this.stripe.paymentMethods.detach(paymentMethod);
  }

  // async getCustomerId(token: string) {
  //   const res = await this.authService.decodeToken(token);
  //   const customerCurrent = await this.stripeRepo.findOne({
  //     where: {
  //       email: res.email,
  //     },
  //   });
  //   if (customerCurrent) {
  //     return customerCurrent.customerId;
  //   } else {
  //     const response = await this.createCustomer({ email: res.email });
  //     return response.id;
  //   }
  // }
}
