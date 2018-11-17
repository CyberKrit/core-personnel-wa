import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, forkJoin, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

// custom imports
import { 
	ICategories, 
	ICategoryBrief, 
	ICreateInduction, 
	ISingleInductionViewData,
	IGETCreateSlide,
	IEditInductionResolve,
	ITemplateList,
	IInductionSingleResolve,
	ISingleTempData
} from '../../shared/interface/induction.interface';
import { CoreService } from '../core/core.service';

@Injectable()
export class InductionService {

	private baseURL: string;

	// reload induction slide data after changes been saved
	public slideIsReadyToUpdate: boolean = false;
	public slideUpdate: Subject<boolean> = new Subject<boolean>();
	public slideUpdate$: Observable<boolean> = this.slideUpdate.asObservable();

	public slideUpdateFn(): void {
		this.slideIsReadyToUpdate = !this.slideIsReadyToUpdate;
		this.slideUpdate.next(this.slideIsReadyToUpdate);
	}

	// cache induction single slide data for real-time use
	public singleTempData: ISingleTempData = {
		header: null,
		content: null,
		status: null,
		imageOnlySrc: null
	};

	// editor: image-only
	public imageOnlyEditorChanges: Subject<string> = new Subject<string>();
	public imageOnlyEditorChanges$ = this.imageOnlyEditorChanges.asObservable();
	public imageOnlyEditorChangesFn() {
		this.imageOnlyEditorChanges.next(this.singleTempData.imageOnlySrc);
	}


	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
		private $core: CoreService) {
			this.baseURL = $core.HOST;
	}

	public listCategory(): Observable<ICategories[]> {
		const baseurl =  this.baseURL + 'api/induction-cat';

		return this.http
			.get<ICategories[]>(baseurl)
			.pipe(
				map(categories => categories),
				catchError(err => throwError(err))
			);
	}

	public createCategory(req): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat';

		return this.http
			.post(baseurl, JSON.stringify(req))
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public removeCategory(catId): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/' + catId;

		return this.http
			.delete(baseurl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public updateCategory(_id, name): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/';

		name = name.trim();
		let slug = name.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

		let buildReq = { _id, name, slug };

		return this.http
			.put(baseurl, JSON.stringify(buildReq))
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public briefCategory(): Observable<any> {
		const baseurl =  this.baseURL + 'api/induction-cat/brief';

		return this.http
			.get(baseurl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	// *** INDUCTION *** //
	public createInduction(value): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction';

		return this.http
			.post<ICreateInduction>(baseUrl, JSON.stringify(value))
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public listInduction(): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction';

		return this.http
			.get(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public SingleInductionView(inductionId): Observable<ISingleInductionViewData> {
		const baseUrl = this.baseURL + 'api/induction/' + inductionId;

		return this.http
			.get<ISingleInductionViewData>(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	// *** [[[ induction-edit.component resolve data ]]] *** //
	public EditInduction(inductionId): Observable<IEditInductionResolve> {
		const baseUrl = this.baseURL + 'api/induction/edit/' + inductionId;

		return this.http
			.get<IEditInductionResolve>(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	// *** [[[ induction-edit.component create a new slide ]]] *** //
	public createSlide(inductionId): Observable<IGETCreateSlide> {
		const baseUrl = this.baseURL + 'api/induction/slide/create/' + inductionId;

		return this.http
			.get<IGETCreateSlide>(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	// *** [[[ induction-single-custom.component create a new slide ]]] *** //
	public customSlideRouteData(induction, slide): Observable<any> {
		const templateListAPI = this.baseURL + 'api/template';

		let templateList = this.http
			.get<ITemplateList[]>(templateListAPI)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);

			return forkJoin(templateList);
	}

	// *** [[[ induction-edit.component resolve data ]]] *** //
	public InductionSingleResolve(inductionId, slideIndex): Observable<IInductionSingleResolve> {
		const baseUrl = this.baseURL + 'api/induction/singleResolveData/' + inductionId + '/' + slideIndex;

		return this.http
			.get<IInductionSingleResolve>(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	// update slide for a induction
	public update(slideData): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction';

		return this.http
			.put<any>(baseUrl, slideData)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	// delete slide
	public deleteSlide(inductionId, slideId): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction/slide/' + inductionId + '/' + slideId;

		return this.http
			.delete(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public cloneSlide(inductionId, slideId): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction/slide/clone/' + inductionId + '/' + slideId;

		return this.http
			.get(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public reorderSlide(previousIndex, currentIndex, inductionId): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction/slide/reorder/' + previousIndex + '/' + currentIndex + '/' + inductionId;

		return this.http
			.get(baseUrl)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public singleTempDataFn(): ISingleTempData {
		return this.singleTempData;
	}

}