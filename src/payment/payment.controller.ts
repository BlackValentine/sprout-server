import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  AddCreditCardDto,
  CreateChargeMonthlyDto,
  CreatePaymentDto,
  SavePaymentDto,
} from './payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createCharge(@Body() charge: CreatePaymentDto) {
    const response = await this.paymentService.charge(
      charge.amount,
      charge.paymentMethodId,
    );
    return response;
  }

  @Post('create-customer')
  async handleAuthen(@Body() body: any) {
    await this.paymentService.createCustomer(body);
    return {
      success: 'OK',
    };
  }

  @Post('monthly')
  async paymentMonthly(@Body() charge: CreateChargeMonthlyDto) {
    const response = await this.paymentService.createSubscription(
      charge.paymentMethodId,
      charge.product,
      charge.customerId,
    );
    return response;
  }

  @Post('save-card')
  async createChargeSaveCard(@Body() charge: SavePaymentDto) {
    const response = await this.paymentService.chargeSaveCard(
      charge.paymentMethodId,
      charge.amount,
      charge.customerId,
    );
    return response;
  }

  @Post('add-card')
  async attachCreditCard(@Body() creditCard: AddCreditCardDto) {
    const response = await this.paymentService.attachCreditCard(
      creditCard.paymentMethodId,
      creditCard.customerId,
    );
    return response;
  }

  @Post('detach-card')
  async detachCreditCard(@Body() creditCard: AddCreditCardDto) {
    const response = await this.paymentService.detachCreditCard(
      creditCard.paymentMethodId,
    );
    return response;
  }

  @Post('set-default-payment-method')
  async setDefaultPaymentMethod(@Body() creditCard: AddCreditCardDto) {
    const response = await this.paymentService.setDefaultPaymentMethod(
      creditCard.paymentMethodId,
      creditCard.customerId,
    );
    return response;
  }

  @Post('default-payment-method')
  async getDefaultPaymentMethod(@Body() body: any) {
    const response = await this.paymentService.getDefaultPaymentMethod(
      body.customerId,
    );
    return response;
  }

  @Post('list-card')
  async listPaymentMethod(@Body() body: any) {
    return this.paymentService.listPaymentMethods(body.customerId);
  }

  @Post('client-secret')
  async createClientSecretKey() {
    const clientSecretKey = await this.paymentService.getSecretClientKey();
    return clientSecretKey;
  }

  // @Post('get-customer-id')
  // async getCustomerId(@Body() body: any) {
  //   return await this.paymentService.getCustomerId(body.token);
  // }
}
