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
	slideCount: number;
}

export interface ISingleInductionViewData {
	_id: string;
	name: string;
}

export interface IEditInductionResolve {
	_id: string;
	name: string;
	slides: IEditInductionResolveSlideData[];
}
export interface IEditInductionResolveSlideData {
	name: string;
	variation: string;
	status: any;
	updatedAt: string;
	_id: string;
}

// induction slide interfaces
export interface IGETCreateSlide {
	status: boolean;
	slideDeckId: string;
	slideIndex: number;
}

// induction single slide edit queryparams
export interface ISingleQueryParams {
	index: number;
	slideType: string;
}

// templatelist interface
export interface ITemplateList {
	_id: string;
	name: string;
	slug: string;
	component: ITemplateListComponent[];
	byDefault: boolean;
}
export interface ITemplateListComponent {
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

// induction single resolve data
export interface IInductionSingleResolve {
	_id: string;
	name: string;
	slide: any;
	slideIndex: number;
	defaultTemplate: any;
	media: any;
}

// consent sheet
export interface IConsentSheetData {
	confirm: IConsentSheetDataTree;
	cancel: IConsentSheetDataTree;
}
export interface IConsentSheetDataTree {
	title: string;
	desc?: string;
	fn?: Function;
	navigate?: string;
	willClose?: boolean
}

// induction single temp data
export interface ISingleTempData {
	header: string;
	content: string;
	status: string;
	imageOnlySrc: string;
}