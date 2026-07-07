import { Controller, Get } from '@nestjs/common';
import { ChurchService } from './church.service';

@Controller('church')
export class ChurchController {
	constructor(private readonly churchService: ChurchService) {}

	@Get()
	listChurches() {
		return this.churchService.listChurches();
	}
}
