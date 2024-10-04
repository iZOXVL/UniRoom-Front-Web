export interface OrderItemDto {
    orderItemId: number;
    bookId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }
  
  export interface OrderDto {
    orderId: number;
    orderDate: Date;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    couponId: string | null;
    paymentType: string;
    cardLast4Digits: string;
    address: string;
    orderItems: OrderItemDto[];
  }
  