import { getContainer } from '../../../bin';

process.env.aos4nEntry = __filename

export const containerPromise = getContainer().runAsync()