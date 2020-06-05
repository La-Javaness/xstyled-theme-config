describe('index', () => {
	it('doesnt crash when imported', () => {
		require('../index') // eslint-disable-line
		expect(true).toBe(true)
	})
})
