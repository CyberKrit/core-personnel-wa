import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, Subject, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
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
	ISingleTempData,
	// editor
	IEditorResolveReq, IEditorResolveRes, IGenEditorPostAction,
	IEditorSectionFormData,
	// text-only
	IEditorTextOnlyFormData,
	// image only
	IEditorImageOnlyFormData,
	// image-caption
	IEditorImageCaptionFormData,
	// imageLContentR
	IEditorImageLContentRFormData,
	// quiz
	IQuizCreateReq, IQuizCreateRes,
	// template
	ITemplateResolveReq, ITemplateResolveRes
} from '../../shared/interface/induction.interface';
import { CoreService } from '../core/core.service';

@Injectable()
export class InductionService {

	private baseURL: string;

	/*** [[[ editor ]]] ***/
	private editorFormSubmitReqSub: Subject<any> = new Subject<any>();
	public editorFormSubmitReq$ = this.editorFormSubmitReqSub.asObservable();
	public editorFormSubmitReq() {
		this.editorFormSubmitReqSub.next();
	}
	private editorFormSubmitCompleteSub: Subject<any> = new Subject<any>();
	public editorFormSubmitComplete$ = this.editorFormSubmitReqSub.asObservable();
	public editorFormSubmitComplete() {
		this.editorFormSubmitCompleteSub.next();
	}

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

	public reorderSlide(buildReq): Observable<any> {
		const baseUrl = this.baseURL + 'api/induction/slide/reorder/';

		return this.http
			.post(baseUrl, buildReq)
			.pipe(
				map(res => res),
				catchError(err => throwError(err))
			);
	}

	public singleTempDataFn(): ISingleTempData {
		return this.singleTempData;
	}


	/* ==[ TEMPLATE ]== */

	// resolve
  public templateResolve(req: ITemplateResolveReq): Observable<ITemplateResolveRes> {
		const baseUrl = this.baseURL + 'api/template/resolve/' + req.inductionId;

		return this.http
			.get<ITemplateResolveRes>(baseUrl)
			.pipe(
				catchError(this.handleError)
			);
	}

	/* ==[ EDITOR ]== */

	public editorResolve(queryParams: IEditorResolveReq): Observable<IEditorResolveRes> {
		const baseUrl = this.baseURL + 'api/editor?ind=' + queryParams.ind + '&tmp=' + queryParams.tmp + '&slide=' + queryParams.slide + '&action=' + queryParams.action;

		return this.http
			.get<IEditorResolveRes>(baseUrl)
			.pipe(
				catchError(this.handleError)
			);
	}
	/* section */
	public editorSection(formData: IEditorSectionFormData, inductionId: string, action: string, slideId: string): Observable<IGenEditorPostAction> {
		const baseUrl = this.baseURL + 'api/editor/section?inductionId=' + inductionId + '&action=' + action + '&slideId=' + slideId;

		return this.http
			.post<IGenEditorPostAction>(baseUrl, formData)
			.pipe(
				catchError(this.handleError)
			);
	}
	/* text-only editor */
	public editorTextOnly(formData: IEditorTextOnlyFormData, inductionId: string, slideId: string): Observable<IGenEditorPostAction> {
		const baseUrl = this.baseURL + 'api/editor/textOnly?inductionId=' + inductionId + '&slideId=' + slideId;

		return this.http
			.post<IGenEditorPostAction>(baseUrl, formData)
			.pipe(
				catchError(this.handleError)
			);
	}
	/* image-only editor */
	public editorImageOnly(formData: IEditorImageOnlyFormData, inductionId: string, slideId: string): Observable<IGenEditorPostAction> {
		const baseUrl = this.baseURL + 'api/editor/imageOnly?inductionId=' + inductionId + '&slideId=' + slideId;

		return this.http
			.post<IGenEditorPostAction>(baseUrl, formData)
			.pipe(
				catchError(this.handleError)
			);
	}
	/* image-caption editor */
	public editorImageCaption(formData: IEditorImageCaptionFormData, inductionId: string, slideId: string): Observable<IGenEditorPostAction> {
		const baseUrl = this.baseURL + 'api/editor/imageCaption?inductionId=' + inductionId + '&slideId=' + slideId;

		return this.http
			.post<IGenEditorPostAction>(baseUrl, formData)
			.pipe(
				catchError(this.handleError)
			);
	}
	/* imageLContentR editor */
	public editorImageLContentR(formData: IEditorImageLContentRFormData, inductionId: string, slideId: string): Observable<IGenEditorPostAction> {
		const baseUrl = this.baseURL + 'api/editor/imageLContentR?inductionId=' + inductionId + '&slideId=' + slideId;

		return this.http
			.post<IGenEditorPostAction>(baseUrl, formData)
			.pipe(
				catchError(this.handleError)
			);
	}

	// quiz
	public saveQuiz(formData: IQuizCreateReq): Observable<IQuizCreateRes> {
		const baseUrl = this.baseURL + 'api/editor/quiz';

		return this.http
			.post<IQuizCreateRes>(baseUrl, formData)
			.pipe(
				catchError(this.handleError)
			);
	}


	/* ==[ handleError ]== */

	private handleError(error: HttpErrorResponse) {
	  if (error.error instanceof ErrorEvent) {
	    // A client-side or network error occurred. Handle it accordingly.
	    console.error('An error occurred:', error.error.message);
	  } else {
	    // The backend returned an unsuccessful response code.
	    // The response body may contain clues as to what went wrong,
	    console.error(`Backend returned code ${error.status}`);
	    console.error(error.error);
	  }
	  // return an observable with a user-facing error message
	  return throwError('Something bad happened; please try again later.');
	};

}