export interface ICategories {
	_id: string;
	name: string;
	slug: string;
	inductions: number;
	// style purpose only
	highlight?: {
		update?: boolean;
		delete?: boolean;
	}
}

export interface ICategoryBrief {
	_id: string;
	name: string;
}

export interface ICreateInduction {
	inductionName: string;
	inductionCat: string;
}

export interface IListInduction {
	_id: string;
	name: string;
	category: string;
	createdAt: string;
	updatedAt: string;
}

export interface ISingleInductionViewData {
	_id: string;
	name: string;
}

export class IEditInductionResolve {
	_id: string;
	name: string;
	slideCount: number;
}

// induction slide interfaces
export class IGETCreateSlide {
	status: boolean;
	slideDeckId: string;
	slideIndex: number;
}

// induction single slide edit queryparams
export class ISingleQueryParams {
	index: number;
	slideType: string;
}

// templatelist interface
export class ITemplateList {
	_id: string;
	name: number;
	slug: string;
	component: ITemplateListComponent[];
	byDefault: boolean;
}
export class ITemplateListComponent {
	heroText: boolean;
	heroImage: boolean;
	heroVideo: boolean;
	content: boolean;
	imageCaption: boolean;
	imageLContent: boolean;
	imageRContent: boolean;
	contentImageGrid: boolean;
	quiz: boolean;
}