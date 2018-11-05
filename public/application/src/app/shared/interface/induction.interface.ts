export interface ICategories {
	_id: string;
	name: string;
	slug: string;
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