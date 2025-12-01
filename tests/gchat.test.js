const axios = require('axios');
const { postMessage } = require('../src/gchat');

jest.mock('axios');

describe('gchat', () => {
	it('postMessage posts', async () => {
		await postMessage('https://example.com', 'a message');
		expect(axios.post).toHaveBeenCalledWith('https://example.com', { text: 'a message' });
	});
});
