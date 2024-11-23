import { defineEndpoint } from '@directus/extensions-sdk';
import { Request, Response } from 'express';
import multer from 'multer';

const upload = multer();

const handler = async (req: Request, res: Response) => {
	const host = req.headers.host;
	if (!host?.includes('aaronczichon.de')) {
		return res.status(403).send('Forbidden');
	}
	return res.status(200).json(req.body).send();
};

export default defineEndpoint((router) => {
	router.post('/', upload.none(), (_req, res) => handler(_req, res));
});
