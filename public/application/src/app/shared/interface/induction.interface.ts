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