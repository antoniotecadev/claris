import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../modules/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) { }

    async listAllOrganizations() {
        const organizations = await this.prisma.organization.findMany({
            select: {
                id: true,
                churchId: true,
                name: true,
                slug: true,
                address: true,
                description: true,
                logoUrl: true,
                createdAt: true,
                church: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: { memberships: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return {
            success: true,
            organizationLength: organizations.length,
            organizations: organizations.map((org) => ({
                id: org.id,
                churchId: org.churchId,
                name: org.name,
                slug: org.slug,
                address: org.address,
                description: org.description,
                logoUrl: org.logoUrl,
                createdAt: org.createdAt,
                church: org.church,
                memberCount: org._count.memberships,
            })),
        };
    }

    async getCurrentOrganization(organizationId: string) {
    this.assertOrganizationId(organizationId);

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        createdAt: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return {
      success: true,
      organization,
    };
  }

   private assertOrganizationId(organizationId: string) {
    if (!organizationId) {
      throw new ForbiddenException('Contexto da organização não encontrado');
    }
  }

}