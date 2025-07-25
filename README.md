ADDING PAYMENT GATEWAY

OPTION -> PAYFAST
AS -> SALE GATEWAY

API ENDPOINTS NEEDED
api/payfast.js	-> build payment form 											[ X ]
api/notify.js 	-> gets called after the payment to verify it					 [ X ]
api/success.js    -> called when payment is a success							   [ X ]
api/cancel.js	 -> called when user cancels mid way							   [ X ]

NEEDS
1. need to setup api functions
2. need to setup env variables
