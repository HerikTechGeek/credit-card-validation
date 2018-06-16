const CONSTANTS = {
	CVV_DEFAULT_LIMIT: 3,
	UNKNOWN: "UNKNOWN",
};

const cards = {
	list: [
		{
			brand: "UNKNOWN",
			id: "UNKNOWN",
			length: 16,
		},
		{
			brand: "American Express",
			id: "AMEX",
			verification: "^(34|37)",
			separation: "^([0-9]{4})([0-9]{6})?(?:([0-9]{6})([0-9]{5}))?$",
			masked: "[0-9]{4} xxxxxx x[0-9]{4}",
			accepted: true,
			length: 15,
			cvvLimit: 4,
		},
		{
			brand: "Master Card",
			id: "MASTER",
			verification: "^5[1-5]",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx [0-9]{4}",
			accepted: true,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
		},
		{
			brand: "VISA",
			id: "VISA",
			verification: "^4",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx [0-9]{3, 4}",
			accepted: true,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
		},
		{
			brand: "RUPAY",
			id: "RUPAY",
			verification:
				"^(?:508[5-9][0-9][0-9]|60698[5-9]|60699[0-9]|60738[4-9]|60739[0-9]|607[0-8][0-9][0-9]|6079[0-7][0-9]|60798[0-4]|608[0-4][0-9][0-9]|608500|6521[5-9][0-9]|652[2-9][0-9][0-9]|6530[0-9][0-9]|6531[0-4][0-9]|6070(66|90|32|74|94|27|93|02|76)|6071(26|05|65)|607243)",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx [0-9]{4}",
			accepted: true,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
		},
		{
			brand: "DISCOVER",
			id: "DISCOVER",
			verification: "^(65|6011)",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx [0-9]{4}",
			accepted: false,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
		},
		{
			brand: "DINERS",
			id: "DINERS",
			verification: "^(30|36|38)",
			separation: "^([0-9]{4})([0-9]{6})?(?:([0-9]{6})([0-9]{4}))?$",
			masked: "[0-9]{4} xxxx xx[0-9]{2} [0-9]{2}",
			accepted: false,
			length: 14,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
		},
		{
			brand: "JCB",
			id: "JCB",
			verification: "^35",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx xxxx [0-9]{3, 4}",
			accepted: false,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
		},
		{
			brand: "BAJAJ",
			id: "BAJAJ",
			verification: "^203040",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx xxxx [0-9]{3,4}",
			accepted: true,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
		},
		{
			brand: "MAESTRO_16",
			id: "MAESTRO",
			verification: "^(508125|508126|508159|508192|508227|504437|504681)",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx xxxx [0-9]{4}",
			accepted: true,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
			cvvNotRequired: true,
			expiryNotRequired: true,
		},
		{
			brand: "MAESTRO_16_OPT",
			id: "MAESTRO",
			verification: "^(504437|504681)",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx xxxx [0-9]{4}",
			accepted: true,
			length: 16,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
			cvvNotRequired: true,
			expiryNotRequired: true,
		},
		{
			brand: "MAESTRO",
			id: "MAESTRO",
			verification: "^(50|63|66|5[6-8]|6[8-9]|600[0-9]|6010|601[2-9]|60[2-9]|61|620|621|6220|6221[0-1])",
			separation: "^([0-9]{4})([0-9]{4})?([0-9]{4})?([0-9]{4})?$",
			masked: "[0-9]{4} xxxx xxxx [0-9]{4}",
			accepted: true,
			length: 19,
			cvvLimit: CONSTANTS.CVV_DEFAULT_LIMIT,
			cvvNotRequired: true,
			expiryNotRequired: true,
		},
	],
	active: null,
};

CardHelper = {
	getCardIssuer: cardNumber => {
		cardNumber = (cardNumber || "").replace(/[^0-9]/g, "");
		let issuer = null;
		cards.list.forEach(card => {
			if ( issuer ) return;
			issuer = card.verification && new RegExp(card.verification).test(cardNumber) ? card : null;
		});
		return issuer || cards.list.find(card => card.id === "UNKNOWN");
	},

	getCardByName: cardName => cards.list.find(card => card.id === cardName),

	isValid: cardNumber => {
		cardNumber = (cardNumber || "").replace(/[^0-9]/g, "");
		const issuer = CardHelper.getCardIssuer(cardNumber);
		if ( issuer && issuer.id === 'UNKNOWN' ) return false;
		return new RegExp(issuer.verification).test(cardNumber)
						&& issuer.length === cardNumber.length
						&& CardHelper.mod10Check(cardNumber)
						? issuer : false;
	},

	mod10Check: d => {
		let res = 0,
			inc = d.length % 2;
		for ( let i = 0; i < d.length; ++i ) {
			const n = Number(d.charAt(i)) * (2 - (i + inc) % 2);
			res += n > 9 ? n - 9 : n;
		}
		return res % 10 === 0;
	},
};
