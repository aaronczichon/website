import { defineEndpoint } from '@directus/extensions-sdk';
import { Request, Response } from 'express';

const handler = async (req: Request, res: Response) => {
	const host = req.headers.host;
	if (!host?.includes('aaronczichon.de')) {
		return res.status(403).send('Forbidden');
	}
	return res.status(200).send(req.body);
};

export default defineEndpoint((router) => {
	router.post('/', (_req, res) => handler(_req, res));
});
