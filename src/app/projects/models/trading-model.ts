export class TradingModel {
}

export class TradingInfo {
    id: number;
    title: string;
    getInitailTitle() {
        return this.title ? this.title[0] : '?';
    }
}

export class AskBidInfo {
    exchange_type: string;
    order_time: Date;
    project: number;
    quantity: number;
    price: number;
    order_type: string;
    limit_price: number;
    bid_by: number;
    ask_by: number;
}
