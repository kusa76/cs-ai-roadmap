import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { server } from './test/msw'

// MSW lifecycle
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
