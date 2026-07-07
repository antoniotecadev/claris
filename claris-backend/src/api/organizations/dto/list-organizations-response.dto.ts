import { ApiProperty } from '@nestjs/swagger';

// 1. Sub-objeto da Igreja
class ChurchNestedDto {
  @ApiProperty({ example: '667a4e21-b321-4f11-bc6d-0683a9364bfa' })
  id: string;

  @ApiProperty({ example: 'Igreja Central' })
  name: string;
}

// 2. O objeto da Organização formatado pelo .map()
class OrganizationItemDto {
  @ApiProperty({ example: '7a8b9c1d-e2f3-4a5b-6c7d-8e9f0a1b2c3d' })
  id: string;

  @ApiProperty({ example: '667a4e21-b321-4f11-bc6d-0683a9364bfa' })
  churchId: string;

  @ApiProperty({ example: 'Jovens Unidos' })
  name: string;

  @ApiProperty({ example: 'jovens-unidos' })
  slug: string;

  @ApiProperty({ example: 'Avenida Principal, nº 123, Luanda', nullable: true })
  address: string | null;

  @ApiProperty({ example: 'Departamento de atividades juvenis.', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'https://example.com/logos/jovens.png', nullable: true })
  logoUrl: string | null;

  @ApiProperty({ example: '2026-06-30T18:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: ChurchNestedDto })
  church: ChurchNestedDto;

  @ApiProperty({ example: 42, description: 'Total de membros na organização' })
  memberCount: number;
}

// 3. O DTO Principal que a rota de facto retorna
export class ListOrganizationsResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 1, description: 'Quantidade de organizações retornadas' })
  organizationLength: number;

  @ApiProperty({ type: [OrganizationItemDto] })
  organizations: OrganizationItemDto[];
}