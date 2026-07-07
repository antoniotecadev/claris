import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';

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
}