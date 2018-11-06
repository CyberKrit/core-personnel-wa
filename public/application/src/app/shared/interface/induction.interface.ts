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