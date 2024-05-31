import { hexToBytes } from '@noble/curves/abstract/utils';
import { bytesToNumber } from '../../src/util/utils.js';
import { blindMessage, unblindSignature } from '../../src/client';
import { pointFromHex } from '../../src/common';

const SECRET_MESSAGE = 'test_message';

describe('test blinding message', () => {
	test('testing string 0000....01', async () => {
		var enc = new TextEncoder();
		let secretUInt8 = enc.encode(SECRET_MESSAGE);
		let { B_ } = await blindMessage(
			secretUInt8,
			bytesToNumber(hexToBytes('0000000000000000000000000000000000000000000000000000000000000001'))
		);
		expect(B_.toHex(true)).toBe(
			'025cc16fe33b953e2ace39653efb3e7a7049711ae1d8a2f7a9108753f1cdea742b'
		);
	});

	test("test vector 1", async () => {
		let secretUInt8 = hexToBytes("d341ee4871f1f889041e63cf0d3823c713eea6aff01e80f1719f08f9e5be98f6");
		let blindingFactor = bytesToNumber(hexToBytes('99fce58439fc37412ab3468b73db0569322588f62fb3a49182d67e23d877824a'));
		let { B_ } = await blindMessage(secretUInt8, blindingFactor);
		expect(B_.toHex(true)).toBe(
			'033b1a9737a40cc3fd9b6af4b723632b76a67a36782596304612a6c2bfb5197e6d'
		);
	});

	test("test vector 2", async () => {
		let secretUInt8 = hexToBytes("f1aaf16c2239746f369572c0784d9dd3d032d952c2d992175873fb58fae31a60");
		let blindingFactor = bytesToNumber(hexToBytes("f78476ea7cc9ade20f9e05e58a804cf19533f03ea805ece5fee88c8e2874ba50"));
		let { B_ } = await blindMessage(secretUInt8, blindingFactor);
		expect(B_.toHex(true)).toBe("029bdf2d716ee366eddf599ba252786c1033f47e230248a4612a5670ab931f1763");
	});

});

describe('test unblinding signature', () => {
	test('testing string 0000....01', async () => {
		let C_ = pointFromHex('02a9acc1e48c25eeeb9289b5031cc57da9fe72f3fe2861d264bdc074209b107ba2');
		let r = bytesToNumber(
			hexToBytes('0000000000000000000000000000000000000000000000000000000000000001')
		);
		let A = pointFromHex('020000000000000000000000000000000000000000000000000000000000000001');
		let C = unblindSignature(C_, r, A);
		expect(C.toHex(true)).toBe(
			'03c724d7e6a5443b39ac8acf11f40420adc4f99a02e7cc1b57703d9391f6d129cd'
		);
	});
});
