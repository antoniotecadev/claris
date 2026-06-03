import { Injectable } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAllOrganizations() {
        return this.prisma.organization.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                description: true,
                address: true,
            },
        });
    }
}