import { Observable } from 'rxjs';

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
	quizTemplateId?: string;
}
export interface IEditInductionResolveSlideData {
	name: string;
	variation: string;
	status: any;
	updatedAt: string;
	_id: string;
	isVisible?: boolean;
	isSearched?: boolean;
	template?: {
		name: string;
		_id: string;
	}
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

// consent boc
export interface IConsentBoxData {
	confirm: IConsentSheetDataTree;
	cancel: IConsentSheetDataTree;
}
export interface IConsentBoxDataTree {
	title: string;
	desc?: string;
}

// induction single temp data
export interface ISingleTempData {
	header: string;
	content: string;
	status: string;
	imageOnlySrc: string;
}

/* ==[ TEMPLATE ]== */

export interface ITemplateResolveReq {
	inductionId: string;
}
export interface ITemplateResolveRes {
	inductionId: string;
	action: string;
	templates: ITemplateResolveResData[]
}
export interface ITemplateResolveResData {
	name: string;
	slug: string;
	_id: string;
}


/* ==[ EDITOR ]== */

export interface IEditorResolveReq {
	ind: string;
	tmp?: string;
	slide?: string;
	action: string;
}
export interface IEditorResolveRes {
	template: any;
	induction: any;
	slide: any;
	action: any;
}
export interface IGenEditorPostAction {
	status: boolean;
	message?: string;
	data?: any;
}


/* ==[ EDITOR > SECTION ]== */

export interface IEditorSectionFormData {
	name?: string;
	header: string;
}
export interface ICompareValuesSection {
	status?: string;
	name?: string;
	header?: string;
}


/* ==[ EDITOR > TEXT-ONLY ]== */

export interface IEditorTextOnlyFormData {
	name?: string;
	template?: string;
	status?: string;
	uploadFile: string;
	content: string;
}
export interface ICompareValuesTextOnly {
	status?: string;
	name?: string;
	content?: string;
}


/* ==[ EDITOR > IMAGE-ONLY ]== */

export interface IEditorImageOnlyFormData {
	name?: string;
	template?: string;
	status?: string;
	uploadFile: string;
	mediaId: string;
}
export interface ICompareValuesImageOnly {
	status?: string;
	name?: string;
	uploadFile?: string;
}

/* ==[ EDITOR > IMAGE-CAPTION ]== */

export interface IEditorImageCaptionFormData {
	name?: string;
	template?: string;
	status?: string;
	caption: string;
	uploadFile: string;
	mediaId: string;
}
export interface ICompareValuesImageCaption {
	status?: string;
	name?: string;
	caption?: string;
	uploadFile?: string;
}


/* ==[ EDITOR > IMAGE-LEFT-CONTENT-RIGHT ]== */

export interface IEditorImageLContentRFormData {
	name?: string;
	template?: string;
	status?: string;
	content: string;
	uploadFile: string;
	mediaId: string;
}
export interface ICompareValuesImageLContentR {
	status?: string;
	name?: string;
	content?: string;
	uploadFile?: string;
}

/* ==[ EDITOR > Quiz ]== */

export interface IEditorQuizFormData {
	name?: string;
	template?: string;
	status?: string;
	content: string;
	question: string;
	mediaId: string;
}
export interface ICompareQuiz {
	status?: string;
	name?: string;
	content?: string;
	question?: string;
	option?: ICompareQuizOption[];
}
export interface ICompareQuizOption {
	option: string;
	isTrue: boolean;
}


// create a quiz =====
export interface IQuizCreateReq {
	
}
export interface IQuizCreateRes {
	status: boolean;
	message?: string;
}