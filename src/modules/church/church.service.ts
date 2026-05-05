import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChurchService {
	constructor(private readonly prisma: PrismaService) {}

	async listChurches() {
		const churches = await this.prisma.church.findMany({
			select: {
				id: true,
				name: true,
				createdAt: true,
			},
			orderBy: { name: 'asc' },
		});

		return {
			success: true,
			churches,
		};
	}
}
