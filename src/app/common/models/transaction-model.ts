export class TransactionModel {
    
    constructor() {
        this.amount = new TransactionAmountInfo();
    }

    id: number;
    user: number;
    bank_account: number;
    reference_no: string;
    create_datetime: Date;
    amount: TransactionAmountInfo;
    remark: string;
    mode:string;
    account_no: string;
    status: string;
    is_external: boolean;
}

export class TransactionAmountInfo {
    amount?: number;
    currency: string;
}
